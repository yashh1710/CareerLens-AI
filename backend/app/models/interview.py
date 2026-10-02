from sqlalchemy import Column, ForeignKey, Integer, String, Text

from app.config.database import Base


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    role = Column(String, nullable=False)


class InterviewAnswer(Base):
    __tablename__ = "interview_answers"

    id = Column(Integer, primary_key=True)
    session_id = Column(Integer, ForeignKey("interview_sessions.id"), nullable=False, index=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    score = Column(Integer)
    feedback = Column(Text)
    strengths = Column(Text)
    improvements = Column(Text)


class InterviewMonitoring(Base):
    __tablename__ = "interview_monitoring"

    id = Column(Integer, primary_key=True)
    session_id = Column(Integer, ForeignKey("interview_sessions.id"), nullable=False, index=True)
    event_type = Column(String, nullable=False)
    details = Column(Text)
