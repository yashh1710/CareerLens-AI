from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.database import Base
from app.config.database import engine

# Auth Routes
from app.routes.auth import router

# Resume Builder Models
from app.models.resume_builder import (
    ResumeBuilder,
    Education,
    Project,
    Skill,
    Experience,
    Certification
)

# Resume Upload Model
from app.models.resume_upload import ResumeUpload

# Interview Models
from app.models.interview import (
    InterviewSession,
    InterviewAnswer,
    InterviewMonitoring
)

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

# Job Matching Routes
from app.routes.job_matching import (
    router as job_matching_router
)

from app.routes.career_coach import (
    router as career_coach_router
)


# Create FastAPI App
app = FastAPI(
    title="CareerLens AI"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Create Database Tables
Base.metadata.create_all(
    bind=engine
)

# Register Routes

# Authentication
app.include_router(router)

# Resume Builder
app.include_router(
    resume_builder_router
)

# Resume Upload
app.include_router(
    resume_upload_router
)

# AI Interview
app.include_router(
    interview_router
)

# Job Matching
app.include_router(
    job_matching_router
)
app.include_router(
    career_coach_router
)

# Home Route
@app.get("/")
def home():

    return {
        "message":
        "CareerLens AI Backend Running"
    }