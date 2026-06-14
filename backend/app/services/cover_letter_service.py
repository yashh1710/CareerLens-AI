from app.services.gemini_service import (
    model
)


def generate_cover_letter(

    resume_data,

    job_role,

    company_name
):

    prompt = f"""
You are an expert recruiter.

Generate a professional cover letter.

Candidate Resume:

{resume_data}

Job Role:
{job_role}

Company:
{company_name}

Write a professional cover letter.
"""

    response = model.generate_content(
        prompt
    )

    return response.text