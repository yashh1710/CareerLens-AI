JOB_ROLES = {

    "Data Analyst": [
        "Python",
        "SQL",
        "Excel",
        "Power BI",
        "Data Analysis",
        "Statistics"
    ],

    "Python Developer": [
        "Python",
        "FastAPI",
        "Git",
        "PostgreSQL",
        "SQL"
    ],

    "AI Engineer": [
        "Python",
        "Machine Learning",
        "SQL",
        "Data Analysis",
        "Git"
    ],

    "Frontend Developer": [
        "HTML",
        "CSS",
        "JavaScript",
        "React"
    ]
}


def calculate_job_match(
    resume_skills,
    job_role
):

    required_skills = JOB_ROLES.get(
        job_role,
        []
    )

    matched_skills = []

    missing_skills = []

    for skill in required_skills:

        found = False

        for resume_skill in resume_skills:

            if (
                resume_skill.skill_name.lower()
                ==
                skill.lower()
            ):

                found = True

                matched_skills.append(
                    skill
                )

                break

        if not found:

            missing_skills.append(
                skill
            )

    if len(required_skills) == 0:

        return {

            "match_percentage": 0,

            "matched_skills": [],

            "missing_skills": []
        }

    match_percentage = int(

        len(matched_skills)

        /

        len(required_skills)

        * 100
    )

    return {

        "match_percentage":
        match_percentage,

        "matched_skills":
        matched_skills,

        "missing_skills":
        missing_skills
    }
def recommend_best_roles(
    resume_skills,
    projects=None,
    experience=None,
    certifications=None
):

    projects = projects or []
    experience = experience or []
    certifications = certifications or []

    rankings = []

    for role in JOB_ROLES.keys():

        result = calculate_job_match(
            resume_skills,
            role
        )

        rankings.append({

            "role": role,

            "match_percentage":
            result["match_percentage"],

            "matched_skills":
            result["matched_skills"],

            "missing_skills":
            result["missing_skills"]
        })

    rankings.sort(
        key=lambda x: x["match_percentage"],
        reverse=True
    )

    best_role = rankings[0]

    reasoning = []

    if best_role["match_percentage"] >= 70:

        reasoning.append(
            "Strong alignment with role requirements"
        )

    elif best_role["match_percentage"] >= 40:

        reasoning.append(
            "Moderate alignment with role requirements"
        )

    else:

        reasoning.append(
            "Additional skills recommended for this role"
        )

    reasoning.append(
        f"Matched {len(best_role['matched_skills'])} key skills"
    )

    # Career level prediction

    total_profile_score = (
        len(projects)
        + len(experience) * 2
        + len(certifications)
    )

    if total_profile_score >= 8:

        career_level = "Advanced"

    elif total_profile_score >= 4:

        career_level = "Intermediate"

    else:

        career_level = "Entry Level"

    return {

        "best_role":
        best_role["role"],

        "confidence":
        best_role["match_percentage"],

        "career_level":
        career_level,

        "matched_skills":
        best_role["matched_skills"],

        "missing_skills":
        best_role["missing_skills"],

        "reasoning":
        reasoning,

        "role_rankings":
        rankings
    }
def match_job_description(

    resume_skills,

    job_description

):

    jd_lower = job_description.lower()

    matched_skills = []

    missing_skills = []

    suggestions = []

    for skill_obj in resume_skills:

        if skill_obj.skill_name.lower() in jd_lower:

            matched_skills.append(
                skill_obj.skill_name
            )

    common_skills = [

        "Python",
        "SQL",
        "Excel",
        "Power BI",
        "Statistics",
        "Machine Learning",
        "FastAPI",
        "Git",
        "React",
        "JavaScript",
        "HTML",
        "CSS"
    ]

    for skill in common_skills:

        if (

            skill.lower() in jd_lower

            and

            skill not in matched_skills

        ):

            missing_skills.append(
                skill
            )

            suggestions.append(
                f"Learn {skill}"
            )

    total_required = (
        len(matched_skills)
        +
        len(missing_skills)
    )

    if total_required == 0:

        match_percentage = 0

    else:

        match_percentage = int(

            len(matched_skills)

            /

            total_required

            * 100
        )

    if match_percentage >= 80:

        hiring_chance = "High"

    elif match_percentage >= 50:

        hiring_chance = "Medium"

    else:

        hiring_chance = "Low"

    return {

        "match_percentage":
        match_percentage,

        "matched_skills":
        matched_skills,

        "missing_skills":
        missing_skills,

        "hiring_chance":
        hiring_chance,

        "suggestions":
        suggestions
    }