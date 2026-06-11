from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Depends

from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.resume_upload import ResumeUpload

import fitz
import shutil
import os


router = APIRouter(
    prefix="/resume-upload",
    tags=["Resume Upload"]
)

UPLOAD_FOLDER = "app/uploads"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


@router.post("/")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    # Save uploaded PDF
    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    # Extract text from PDF
    doc = fitz.open(file_path)

    text = ""

    for page in doc:

        text += page.get_text()

    doc.close()

    # Save metadata and extracted text to database
    new_resume = ResumeUpload(

        user_id=1,   # Temporary for testing

        file_name=file.filename,

        file_path=file_path,

        extracted_text=text
    )

    db.add(new_resume)

    db.commit()

    db.refresh(new_resume)

    return {

        "message":
        "Resume uploaded successfully",

        "resume_id":
        new_resume.id,

        "filename":
        file.filename,

        "characters_extracted":
        len(text),

        "preview":
        text[:500]
    }