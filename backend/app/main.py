from fastapi import FastAPI

from app.config.database import Base
from app.config.database import engine

# Auth Routes
from app.routes.auth import router

# Resume Builder Models
from app.models.resume_builder import ResumeBuilder
from app.models.resume_builder import Education
from app.models.resume_builder import Project
from app.models.resume_builder import Skill
from app.models.resume_builder import Experience
from app.models.resume_builder import Certification

# Resume Upload Model
from app.models.resume_upload import ResumeUpload

# Interview Models
from app.models.interview import InterviewSession
from app.models.interview import InterviewAnswer

from app.models.interview import InterviewSession
from app.models.interview import InterviewAnswer
from app.models.interview import InterviewMonitoring

# Resume Builder Routes
from app.routes.resume_builder import (
    router as resume_builder_router
)

# Resume Upload Routes
from app.routes.resume_upload import (
    router as resume_upload_router
)

# Interview Routes
from app.routes.interview import (
    router as interview_router
)

# Create FastAPI App
app = FastAPI(
    title="CareerLens AI"
)

# Create Database Tables
Base.metadata.create_all(
    bind=engine
)

# Register Routes
app.include_router(router)

app.include_router(
    resume_builder_router
)

app.include_router(
    resume_upload_router
)

app.include_router(
    interview_router
)

# Home Route
@app.get("/")
def home():

    return {
        "message": "CareerLens AI Backend Running"
    }