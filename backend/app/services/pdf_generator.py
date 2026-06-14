from reportlab.lib.pagesizes import letter

from reportlab.pdfgen import canvas


def generate_resume_pdf(

    filename,
    resume,
    skills,
    education,
    projects,
    experience,
    certifications
):

    c = canvas.Canvas(
        filename,
        pagesize=letter
    )

    y = 750

    c.setFont(
        "Helvetica-Bold",
        18
    )

    c.drawString(
        50,
        y,
        resume.full_name
    )

    y -= 30

    c.setFont(
        "Helvetica",
        12
    )

    c.drawString(
        50,
        y,
        f"Email: {resume.email}"
    )

    y -= 20

    c.drawString(
        50,
        y,
        f"Phone: {resume.phone}"
    )

    y -= 30

    c.setFont(
        "Helvetica-Bold",
        14
    )

    c.drawString(
        50,
        y,
        "Summary"
    )

    y -= 20

    c.setFont(
        "Helvetica",
        12
    )

    c.drawString(
        50,
        y,
        resume.summary
    )

    y -= 40

    c.setFont(
        "Helvetica-Bold",
        14
    )

    c.drawString(
        50,
        y,
        "Skills"
    )

    y -= 20

    c.setFont(
        "Helvetica",
        12
    )

    for skill in skills:

        c.drawString(
            60,
            y,
            f"- {skill.skill_name}"
        )

        y -= 18

    y -= 10

    c.setFont(
        "Helvetica-Bold",
        14
    )

    c.drawString(
        50,
        y,
        "Projects"
    )

    y -= 20

    for project in projects:

        c.drawString(
            60,
            y,
            project.title
        )

        y -= 18

    c.save()

    return filename