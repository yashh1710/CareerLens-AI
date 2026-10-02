import json

from app.services.gemini_service import model


def recommend_roles_ai(
    resume_text
):

    prompt = f"""
You are an expert AI Career Coach.

Analyze the following resume.

Resume:
{resume_text}

Recommend:

1. Top 5 suitable job roles
2. Confidence score (0-100) for each role
3. Career level
4. Strengths
5. Missing skills

Return ONLY valid JSON.

Example:

{{
    "career_level":"Entry Level",

    "recommended_roles":[
        {{
            "role":"Python Developer",
            "confidence":95
        }},
        {{
            "role":"Backend Developer",
            "confidence":90
        }}
    ],

    "strengths":[
        "Python",
        "FastAPI",
        "SQL"
    ],

    "missing_skills":[
        "Docker",
        "AWS"
    ]
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