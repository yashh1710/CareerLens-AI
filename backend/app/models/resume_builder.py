from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey

from app.config.database import Base


class ResumeBuilder(Base):

    __tablename__ = "resume_builder"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    full_name = Column(String)

    email = Column(String)

    phone = Column(String)

    linkedin = Column(String)

    github = Column(String)

    summary = Column(String)
class Education(Base):

    __tablename__ = "education"

    id = Column(
        Integer,
        primary_key=True
    )

    resume_id = Column(
        Integer,
        ForeignKey("resume_builder.id")
    )

    college = Column(String)

    degree = Column(String)

    cgpa = Column(String)

    year = Column(String)
class Project(Base):

    __tablename__ = "projects"

    id = Column(
        Integer,
        primary_key=True
    )

    resume_id = Column(
        Integer,
        ForeignKey("resume_builder.id")
    )

    title = Column(String)

    description = Column(String)

    tech_stack = Column(String)

    github_link = Column(String)
class Skill(Base):

    __tablename__ = "skills"

    id = Column(
        Integer,
        primary_key=True
    )

    resume_id = Column(
        Integer,
        ForeignKey("resume_builder.id")
    )

    skill_name = Column(
        String,
        nullable=False
    )
class Experience(Base):

    __tablename__ = "experience"

    id = Column(
        Integer,
        primary_key=True
    )

    resume_id = Column(
        Integer,
        ForeignKey("resume_builder.id")
    )

    company = Column(String)

    role = Column(String)

    duration = Column(String)

    description = Column(String)
class Certification(Base):

    __tablename__ = "certifications"

    id = Column(
        Integer,
        primary_key=True
    )

    resume_id = Column(
        Integer,
        ForeignKey("resume_builder.id")
    )

    certificate_name = Column(String)

    issuer = Column(String)

    year = Column(String)
