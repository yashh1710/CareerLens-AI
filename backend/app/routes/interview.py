from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.config.database import get_db

from app.models.interview import (
    InterviewSession,
    InterviewAnswer
)

from app.models.resume_builder import (
    Skill,
    Project
)

from app.schemas.interview import (
    InterviewStart,
    InterviewAnswerInput
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

        feedback=result["feedback"]
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

    for answer in answers:

        total_score += answer.score

    overall_score = int(
        total_score /
        len(answers)
        * 10
    )

    strengths = []

    improvements = []

    if overall_score >= 80:

        strengths.append(
            "Strong interview performance"
        )

    elif overall_score >= 60:

        strengths.append(
            "Good communication skills"
        )

        improvements.append(
            "Add more technical depth"
        )

    else:

        improvements.append(
            "Improve technical explanations"
        )

        improvements.append(
            "Practice interview questions"
        )

    return {

        "session_id":
        session_id,

        "overall_score":
        overall_score,

        "total_questions":
        len(answers),

        "strengths":
        strengths,

        "improvements":
        improvements
    }