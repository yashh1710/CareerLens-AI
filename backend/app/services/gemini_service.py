import json
import os

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")


def _clean_json(text: str):
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return json.loads(text.strip())


def generate_ai_questions(role, skills, projects):
    skill_list = [skill.skill_name for skill in skills]
    project_list = [project.title for project in projects]

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

    response = model.generate_content(prompt)
    return [q.strip() for q in response.text.split("\n") if q.strip()]


def evaluate_answer_ai(question, answer):
    prompt = f"""
You are an expert technical interviewer.

Question:
{question}

Candidate Answer:
{answer}

Evaluate the answer.
Return ONLY valid JSON in this format:

{{
    "score": 8,
    "feedback": "Good answer",
    "strengths": ["Clear explanation"],
    "improvements": ["Add more technical depth"]
}}

Score must be between 1 and 10.
"""

    response = model.generate_content(prompt)
    return _clean_json(response.text)


def transcribe_audio(audio_path: str):
    audio_file = genai.upload_file(path=audio_path)

    prompt = """
Transcribe the candidate's spoken interview answer exactly.
Do not summarize, improve, or add information.
Return only the transcript.
"""

    response = model.generate_content([audio_file, prompt])
    return response.text.strip()
