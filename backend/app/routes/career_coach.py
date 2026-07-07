from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.config.database import get_db

from app.models.resume_upload import ResumeUpload

from app.services.career_coach import (
    generate_career_coach_report
)

router = APIRouter(
    prefix="/career-coach",
    tags=["Career Coach"]
)


@router.get("/{resume_id}")
def career_coach(
    resume_id: int,
    db: Session = Depends(get_db)
):

    resume = db.query(
        ResumeUpload
    ).filter(
        ResumeUpload.id == resume_id
    ).first()

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    result = generate_career_coach_report(
        resume.extracted_text
    )

    return result