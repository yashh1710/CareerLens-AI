from pydantic import BaseModel
from app.models.resume_builder import ResumeBuilder
from app.models.resume_builder import Skill
from app.models.resume_builder import Project
from app.services.interview_service import (
    generate_resume_questions
)


class InterviewStart(BaseModel):

    resume_id: int

    role: str

class InterviewAnswerInput(BaseModel):

    session_id: int

    question: str

    answer: str