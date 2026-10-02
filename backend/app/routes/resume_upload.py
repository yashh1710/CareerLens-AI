import os
import uuid

import fitz
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.resume_upload import ResumeUpload
from app.models.user import User
from app.services.resume_analyzer import analyze_resume
from app.utils.security import get_current_user

router = APIRouter(prefix="/resume-upload", tags=["Resume Upload"])

UPLOAD_FOLDER = "app/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
MAX_RESUME_SIZE = 10 * 1024 * 1024


@router.post("/")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF resumes are supported")

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")
    if len(contents) > MAX_RESUME_SIZE:
        raise HTTPException(status_code=400, detail="Resume is too large. Maximum 10 MB.")

    filename = f"{uuid.uuid4()}.pdf"
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    try:
        doc = fitz.open(file_path)
        text = "".join(page.get_text() for page in doc)
        doc.close()
    except Exception:
        try:
            os.remove(file_path)
        except OSError:
            pass
        raise HTTPException(status_code=400, detail="Unable to read the PDF resume")

    new_resume = ResumeUpload(
        user_id=current_user.id,
        file_name=file.filename or "resume.pdf",
        file_path=file_path,
        extracted_text=text
    )

    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    return {
        "message": "Resume uploaded successfully",
        "resume_id": new_resume.id,
        "filename": new_resume.file_name,
        "characters_extracted": len(text),
        "preview": text[:500]
    }


@router.get("/analysis/{resume_upload_id}")
def analyze_uploaded_resume(
    resume_upload_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume = db.query(ResumeUpload).filter(
        ResumeUpload.id == resume_upload_id,
        ResumeUpload.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    result = analyze_resume(resume.extracted_text)

    return {
        "resume_id": resume.id,
        "file_name": resume.file_name,
        "analysis": result
    }
