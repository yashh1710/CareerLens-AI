from pydantic import BaseModel


class CertificationCreate(BaseModel):

    certificate_name: str

    issuer: str

    year: str