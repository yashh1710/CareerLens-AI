from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey

from app.config.database import Base


class InterviewSession(Base):

    __tablename__ = "interview_sessions"

    id = Column(
        Integer,
        primary_key=True
    )

    role = Column(String)


class InterviewAnswer(Base):

    __tablename__ = "interview_answers"

    id = Column(
        Integer,
        primary_key=True
    )

    session_id = Column(
        Integer,
        ForeignKey(
            "interview_sessions.id"
        )
    )

    question = Column(String)

    answer = Column(String)

    score = Column(Integer)

    feedback = Column(String)