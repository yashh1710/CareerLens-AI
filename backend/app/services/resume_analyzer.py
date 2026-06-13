SKILLS_DB = [
    "Python",
    "Java",
    "C++",
    "SQL",
    "MySQL",
    "PostgreSQL",
    "JavaScript",
    "HTML",
    "CSS",
    "React",
    "Node.js",
    "Machine Learning",
    "Data Analysis",
    "Power BI",
    "Excel",
    "Git",
    "FastAPI",
    "Django"
]


def analyze_resume(text):

    skills_found = []

    for skill in SKILLS_DB:

        if skill.lower() in text.lower():

            skills_found.append(skill)

    score = min(
        50 + (len(skills_found) * 5),
        100
    )

    strengths = []

    improvements = []

    if skills_found:

        strengths.append(
            "Resume contains technical skills"
        )

    if "linkedin" in text.lower():

        strengths.append(
            "LinkedIn profile detected"
        )

    if "project" not in text.lower():

        improvements.append(
            "Add project experience"
        )

    if "certification" not in text.lower():

        improvements.append(
            "Add certifications"
        )

    return {

        "resume_score": score,

        "skills_found": skills_found,

        "strengths": strengths,

        "improvements": improvements
    }
def calculate_ats_score(
    skills,
    education,
    projects,
    experience,
    certifications
):

    score = 0

    if len(skills) >= 5:
        score += 25
    else:
        score += len(skills) * 5

    if len(projects) >= 2:
        score += 20
    else:
        score += len(projects) * 10

    if len(experience) >= 1:
        score += 20

    if len(certifications) >= 2:
        score += 15
    else:
        score += len(certifications) * 7

    if len(education) >= 1:
        score += 20

    return min(score, 100)
def generate_suggestions(
    skills,
    projects,
    experience,
    certifications
):

    suggestions = []

    if len(skills) < 5:
        suggestions.append(
            "Add more technical skills"
        )

    if len(projects) < 2:
        suggestions.append(
            "Add more projects"
        )

    if len(experience) == 0:
        suggestions.append(
            "Add internship or work experience"
        )

    if len(certifications) < 2:
        suggestions.append(
            "Add certifications"
        )

    return suggestions