from pydantic import BaseModel


class ProjectCreate(BaseModel):

    title: str

    description: str

    tech_stack: str

    github_link: str