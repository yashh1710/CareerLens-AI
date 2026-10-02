import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from app.config.database import Base, engine
from app.models.interview import InterviewAnswer, InterviewMonitoring, InterviewSession
from app.models.resume_builder import Certification, Education, Experience, Project, ResumeBuilder, Skill
from app.models.resume_upload import ResumeUpload
from app.models.user import User
from app.routes.auth import router
from app.routes.career_coach import router as career_coach_router
from app.routes.interview import router as interview_router
from app.routes.job_matching import router as job_matching_router
from app.routes.resume_builder import router as resume_builder_router
from app.routes.resume_upload import router as resume_upload_router

app = FastAPI(title="CareerLens AI")

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
allowed_origins = [url.strip() for url in frontend_url.split(",") if url.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

Base.metadata.create_all(bind=engine)

app.include_router(router)
app.include_router(resume_builder_router)
app.include_router(resume_upload_router)
app.include_router(interview_router)
app.include_router(job_matching_router)
app.include_router(career_coach_router)


@app.get("/")
def home():
    return {"message": "CareerLens AI Backend Running"}
