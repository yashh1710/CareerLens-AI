import os
import google.generativeai as genai

from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def generate_ai_questions(
    role,
    skills,
    projects
):

    skill_list = []

    for skill in skills:

        skill_list.append(
            skill.skill_name
        )

    project_list = []

    for project in projects:

        project_list.append(
            project.title
        )

    prompt = f"""
You are a professional technical interviewer.

Role:
{role}

Skills:
{", ".join(skill_list)}

Projects:
{", ".join(project_list)}

Generate 10 interview questions.

Rules:
- Mix beginner and advanced questions.
- Include project-based questions.
- Include role-specific questions.
- Return only questions.
- One question per line.
"""

    response = model.generate_content(
        prompt
    )

    questions = response.text.split("\n")

    questions = [
        q.strip()
        for q in questions
        if q.strip()
    ]

    return questions