from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text

from app.config.database import Base


class ResumeUpload(Base):

    __tablename__ = "resume_uploads"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(Integer)

    file_name = Column(String)

    file_path = Column(String)

    extracted_text = Column(Text)