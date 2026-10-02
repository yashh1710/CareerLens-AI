from pydantic import BaseModel


class ExperienceCreate(BaseModel):

    company: str

    role: str

    duration: str

    description: str