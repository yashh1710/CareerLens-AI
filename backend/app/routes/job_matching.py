from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.user import User
from app.utils.security import get_current_user

from app.models.resume_upload import ResumeUpload

from app.services.job_matching import (
    recommend_roles_ai
)

router = APIRouter(
    prefix="/job-matching",
    tags=["Job Matching"]
)


@router.get("/recommend/{resume_id}")
def recommend_role(

    resume_id: int,

    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    resume = db.query(
        ResumeUpload
    ).filter(
        ResumeUpload.id == resume_id,
        ResumeUpload.user_id == current_user.id
    ).first()

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    result = recommend_roles_ai(
        resume.extracted_text
    )

    return result