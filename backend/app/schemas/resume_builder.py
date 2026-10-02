from pydantic import BaseModel


class ResumeBuilderCreate(BaseModel):
    user_id: int | None = None
    full_name: str
    email: str
    phone: str
    linkedin: str
    github: str
    summary: str
