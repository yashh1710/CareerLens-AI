import json

from app.services.gemini_service import (
    model
)


def generate_career_coach_report(
    resume_data
):

    prompt = f"""
You are an expert career coach.

Analyze the following resume:

{resume_data}

Return ONLY valid JSON.

{{
    "current_level": "",
    "best_fit_role": "",
    "top_3_career_paths": [],
    "industry_readiness_score": 0,
    "salary_range": "",
    "skills_to_learn": [],
    "certifications_to_pursue": [],
    "projects_to_build": [],
    "three_month_plan": [],
    "six_month_plan": [],
    "job_search_strategy": []
}}
"""

    response = model.generate_content(
        prompt
    )

    text = response.text.strip()

    text = text.replace(
        "```json",
        ""
    )

    text = text.replace(
        "```",
        ""
    )

    return json.loads(text)