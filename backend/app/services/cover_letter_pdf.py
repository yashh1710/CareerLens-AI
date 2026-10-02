from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def generate_cover_letter_pdf(

    filename,

    cover_letter
):

    c = canvas.Canvas(
        filename,
        pagesize=letter
    )

    y = 750

    c.setFont(
        "Helvetica",
        12
    )

    lines = cover_letter.split("\n")

    for line in lines:

        c.drawString(
            50,
            y,
            line
        )

        y -= 18

        if y < 50:

            c.showPage()

            y = 750

    c.save()

    return filename