from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text

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

    session_id = Column(Integer)

    question = Column(Text)

    answer = Column(Text)

    score = Column(Integer)

    feedback = Column(Text)

    strengths = Column(Text)

    improvements = Column(Text)


class InterviewMonitoring(Base):

    __tablename__ = "interview_monitoring"

    id = Column(
        Integer,
        primary_key=True
    )

    session_id = Column(Integer)

    event_type = Column(String)

    details = Column(Text)