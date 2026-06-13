from pydantic import BaseModel


class JobDescriptionInput(BaseModel):

    job_description: str