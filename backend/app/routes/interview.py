from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.config.database import get_db

import json

from app.models.interview import (
    InterviewSession,
    InterviewAnswer,
    InterviewMonitoring
)

from app.models.resume_builder import (
    Skill,
    Project
)

from app.schemas.interview import (
    InterviewStart,
    InterviewAnswerInput
)

from app.schemas.interview_monitor import (
    InterviewMonitorCreate
)

from app.services.gemini_service import (
    generate_ai_questions,
    evaluate_answer_ai
)

router = APIRouter(
    prefix="/interview",
    tags=["Interview"]
)


@router.post("/start")
def start_interview(

    data: InterviewStart,

    db: Session = Depends(get_db)
):

    session = InterviewSession(
        role=data.role
    )

    db.add(session)

    db.commit()

    db.refresh(session)

    skills = db.query(
        Skill
    ).filter(
        Skill.resume_id == data.resume_id
    ).all()

    projects = db.query(
        Project
    ).filter(
        Project.resume_id == data.resume_id
    ).all()

    questions = generate_ai_questions(
        data.role,
        skills,
        projects
    )

    return {

        "session_id":
        session.id,

        "role":
        data.role,

        "questions":
        questions
    }


@router.post("/submit-answer")
def submit_answer(

    data: InterviewAnswerInput,

    db: Session = Depends(get_db)
):

    result = evaluate_answer_ai(

        data.question,

        data.answer
    )

    answer_record = InterviewAnswer(

        session_id=data.session_id,

        question=data.question,

        answer=data.answer,

        score=result["score"],

        feedback=result["feedback"],

        strengths=json.dumps(
            result["strengths"]
        ),

        improvements=json.dumps(
            result["improvements"]
        )
    )

    db.add(answer_record)

    db.commit()

    db.refresh(answer_record)

    return {

        "score":
        result["score"],

        "feedback":
        result["feedback"],

        "strengths":
        result["strengths"],

        "improvements":
        result["improvements"]
    }


@router.get("/report/{session_id}")
def interview_report(

    session_id: int,

    db: Session = Depends(get_db)
):

    answers = db.query(
        InterviewAnswer
    ).filter(
        InterviewAnswer.session_id == session_id
    ).all()

    if not answers:

        raise HTTPException(
            status_code=404,
            detail="No interview answers found"
        )

    total_score = 0

    strengths = []

    improvements = []

    for answer in answers:

        total_score += answer.score

        try:

            strengths.extend(
                json.loads(
                    answer.strengths
                )
            )

            improvements.extend(
                json.loads(
                    answer.improvements
                )
            )

        except:

            pass

    overall_score = int(
        total_score /
        len(answers)
        * 10
    )

    monitoring_events = db.query(
        InterviewMonitoring
    ).filter(
        InterviewMonitoring.session_id == session_id
    ).all()

    monitoring_summary = []

    for event in monitoring_events:

        monitoring_summary.append(
            {
                "event_type":
                event.event_type,

                "details":
                event.details
            }
        )

    return {

        "session_id":
        session_id,

        "overall_score":
        overall_score,

        "total_questions":
        len(answers),

        "strengths":
        list(
            set(strengths)
        ),

        "improvements":
        list(
            set(improvements)
        ),

        "monitoring_events":
        monitoring_summary
    }


@router.post("/monitor")
def monitor_event(

    data: InterviewMonitorCreate,

    db: Session = Depends(get_db)
):

    event = InterviewMonitoring(

        session_id=data.session_id,

        event_type=data.event_type,

        details=data.details
    )

    db.add(event)

    db.commit()

    db.refresh(event)

    return {

        "message":
        "Monitoring event saved",

        "event_id":
        event.id
    }