from pydantic import BaseModel


class CoverLetterRequest(
    BaseModel
):

    resume_id: int

    job_role: str

    company_name: str