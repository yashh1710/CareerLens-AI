from fastapi import FastAPI

from app.config.database import Base
from app.config.database import engine

from app.routes.auth import router

from app.models.resume_builder import ResumeBuilder
from app.models.resume_builder import Education
from app.models.resume_builder import Project

from app.models.resume_builder import Skill

from app.models.resume_builder import Experience


from app.models.resume_builder import Certification

from app.models.resume_builder import Experience

from app.routes.resume_builder import (
    router as resume_builder_router
)

app = FastAPI(
    title="CareerLens AI"
)

Base.metadata.create_all(
    bind=engine
)

app.include_router(router)

app.include_router(
    resume_builder_router
)


@app.get("/")
def home():

    return {
        "message": "CareerLens AI Backend Running"
    }