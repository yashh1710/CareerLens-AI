from pydantic import BaseModel


class InterviewMonitorCreate(
    BaseModel
):

    session_id: int

    event_type: str

    details: str