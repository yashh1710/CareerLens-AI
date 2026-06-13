QUESTION_BANK = {

    "Data Analyst": [

        "What is SQL?",

        "What is a JOIN?",

        "Explain normalization.",

        "What is Power BI?",

        "Difference between WHERE and HAVING?"
    ],

    "Python Developer": [

        "What is Python?",

        "What are decorators?",

        "Explain OOP concepts.",

        "What is FastAPI?",

        "Difference between list and tuple?"
    ],

    "AI Engineer": [

        "What is Machine Learning?",

        "Difference between AI and ML?",

        "What is overfitting?",

        "What is a neural network?",

        "Explain supervised learning."
    ]
}


def get_questions(role):

    return QUESTION_BANK.get(
        role,
        [
            "Tell me about yourself."
        ]
    )
def evaluate_answer(answer):

    answer_length = len(
        answer.split()
    )

    if answer_length >= 30:

        score = 10

        feedback = (
            "Excellent answer with good detail."
        )

    elif answer_length >= 15:

        score = 7

        feedback = (
            "Good answer. Add more depth."
        )

    elif answer_length >= 5:

        score = 5

        feedback = (
            "Basic answer. Expand your explanation."
        )

    else:

        score = 2

        feedback = (
            "Answer is too short."
        )

    return {

        "score": score,

        "feedback": feedback
    }   
def generate_resume_questions(
    role,
    skills,
    projects
):

    questions = []

    questions.append(
        f"Why are you interested in the role of {role}?"
    )

    for skill in skills[:3]:

        questions.append(
            f"Explain your experience with {skill.skill_name}."
        )

    for project in projects[:2]:

        questions.append(
            f"Tell me about your project: {project.title}."
        )

        questions.append(
            f"What challenges did you face while building {project.title}?"
        )

    return questions[:10]