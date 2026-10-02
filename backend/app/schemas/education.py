from pydantic import BaseModel


class EducationCreate(BaseModel):

    college: str

    degree: str

    cgpa: str

    year: str