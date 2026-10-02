import json
import os
import tempfile
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.interview import InterviewAnswer, InterviewMonitoring, InterviewSession
from app.models.resume_builder import Project, Skill
from app.models.resume_upload import ResumeUpload
from app.models.user import User
from app.schemas.interview import InterviewAnswerInput, InterviewStart
from app.schemas.interview_monitor import InterviewMonitorCreate
from app.services.gemini_service import (
    evaluate_answer_ai,
    generate_ai_questions,
    transcribe_audio
)
from app.utils.security import get_current_user

router = APIRouter(prefix="/interview", tags=["Interview"])

ALLOWED_AUDIO_TYPES = {
    "audio/webm",
    "audio/wav",
    "audio/mpeg",
    "audio/mp3",
    "audio/ogg"
}
MAX_AUDIO_SIZE = 10 * 1024 * 1024


def get_owned_session(session_id: int, user: User, db: Session):
    session = db.query(InterviewSession).filter(
        InterviewSession.id == session_id,
        InterviewSession.user_id == user.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found")

    return session


@router.post("/start")
def start_interview(
    data: InterviewStart,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume = db.query(ResumeUpload).filter(
        ResumeUpload.id == data.resume_id,
        ResumeUpload.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    session = InterviewSession(user_id=current_user.id, role=data.role)
    db.add(session)
    db.commit()
    db.refresh(session)

    skills = db.query(Skill).filter(Skill.resume_id == data.resume_id).all()
    projects = db.query(Project).filter(Project.resume_id == data.resume_id).all()
    questions = generate_ai_questions(data.role, skills, projects)

    return {
        "session_id": session.id,
        "role": data.role,
        "questions": questions
    }


@router.post("/submit-answer")
def submit_answer(
    data: InterviewAnswerInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    get_owned_session(data.session_id, current_user, db)
    result = evaluate_answer_ai(data.question, data.answer)

    answer_record = InterviewAnswer(
        session_id=data.session_id,
        question=data.question,
        answer=data.answer,
        score=result["score"],
        feedback=result["feedback"],
        strengths=json.dumps(result["strengths"]),
        improvements=json.dumps(result["improvements"])
    )

    db.add(answer_record)
    db.commit()
    db.refresh(answer_record)

    return {
        "answer_id": answer_record.id,
        "transcript": data.answer,
        "score": result["score"],
        "feedback": result["feedback"],
        "strengths": result["strengths"],
        "improvements": result["improvements"]
    }


@router.post("/submit-audio")
async def submit_audio_answer(
    session_id: int,
    question: str,
    audio: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    get_owned_session(session_id, current_user, db)

    audio_type = (audio.content_type or "").split(";", 1)[0].strip().lower()

    if audio_type not in ALLOWED_AUDIO_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported audio format")

    contents = await audio.read()

    if not contents:
        raise HTTPException(status_code=400, detail="Audio file is empty")

    if len(contents) > MAX_AUDIO_SIZE:
        raise HTTPException(status_code=400, detail="Audio file is too large. Maximum 10 MB.")

    suffix = ".webm"
    if audio_type == "audio/wav":
        suffix = ".wav"
    elif audio_type in {"audio/mpeg", "audio/mp3"}:
        suffix = ".mp3"
    elif audio_type == "audio/ogg":
        suffix = ".ogg"

    temp_path = os.path.join(
        tempfile.gettempdir(),
        f"careerlens_{uuid.uuid4()}{suffix}"
    )

    try:
        with open(temp_path, "wb") as buffer:
            buffer.write(contents)

        transcript = transcribe_audio(temp_path)
        result = evaluate_answer_ai(question, transcript)

        answer_record = InterviewAnswer(
            session_id=session_id,
            question=question,
            answer=transcript,
            score=result["score"],
            feedback=result["feedback"],
            strengths=json.dumps(result["strengths"]),
            improvements=json.dumps(result["improvements"])
        )

        db.add(answer_record)
        db.commit()
        db.refresh(answer_record)

        return {
            "answer_id": answer_record.id,
            "transcript": transcript,
            "score": result["score"],
            "feedback": result["feedback"],
            "strengths": result["strengths"],
            "improvements": result["improvements"]
        }

    except HTTPException:
        raise
    except Exception as exc:
        db.rollback()
        print(f"Audio interview processing error: {exc}")
        raise HTTPException(status_code=500, detail="Failed to process audio answer")
    finally:
        try:
            if os.path.exists(temp_path):
                os.remove(temp_path)
        except OSError:
            pass


@router.get("/report/{session_id}")
def interview_report(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    get_owned_session(session_id, current_user, db)

    answers = db.query(InterviewAnswer).filter(
        InterviewAnswer.session_id == session_id
    ).all()

    if not answers:
        raise HTTPException(status_code=404, detail="No interview answers found")

    total_score = sum(answer.score or 0 for answer in answers)
    strengths = []
    improvements = []

    for answer in answers:
        try:
            strengths.extend(json.loads(answer.strengths or "[]"))
            improvements.extend(json.loads(answer.improvements or "[]"))
        except (json.JSONDecodeError, TypeError):
            pass

    overall_score = round(total_score / len(answers), 1)

    monitoring_events = db.query(InterviewMonitoring).filter(
        InterviewMonitoring.session_id == session_id
    ).all()

    return {
        "session_id": session_id,
        "overall_score": overall_score,
        "total_questions": len(answers),
        "strengths": list(dict.fromkeys(strengths)),
        "improvements": list(dict.fromkeys(improvements)),
        "monitoring_events": [
            {"event_type": event.event_type, "details": event.details}
            for event in monitoring_events
        ]
    }


@router.post("/monitor")
def monitor_event(
    data: InterviewMonitorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    get_owned_session(data.session_id, current_user, db)

    event = InterviewMonitoring(
        session_id=data.session_id,
        event_type=data.event_type,
        details=data.details
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    return {
        "message": "Monitoring event saved",
        "event_id": event.id
    }
