from pydantic import BaseModel


class ResumeBuilderCreate(BaseModel):

    user_id: int

    full_name: str

    email: str

    phone: str

    linkedin: str

    github: str

    summary: str