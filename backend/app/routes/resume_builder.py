from app.models.resume_builder import Skill
from app.models.resume_builder import Education
from app.models.resume_builder import Project
from app.models.resume_builder import Experience
from app.models.resume_builder import Certification

from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.config.database import get_db

from app.models.resume_builder import ResumeBuilder

from fastapi import HTTPException

from app.schemas.skill import SkillCreate

from app.schemas.education import EducationCreate

from app.models.resume_builder import Project
from app.schemas.project import ProjectCreate

from app.models.resume_builder import Certification
from app.schemas.certification import CertificationCreate

from app.models.resume_builder import Experience
from app.schemas.experience import ExperienceCreate

from app.services.resume_analyzer import calculate_ats_score
from app.services.resume_analyzer import generate_suggestions

from app.services.job_matcher import calculate_job_match

from app.services.job_matcher import recommend_best_roles

from app.schemas.job_description import JobDescriptionInput

from app.services.job_matcher import (
    match_job_description
)

from app.schemas.resume_builder import (
    ResumeBuilderCreate
)

from fastapi.responses import FileResponse

from app.services.pdf_generator import (
    generate_resume_pdf
)
from app.services.career_coach import (
    generate_career_coach_report
)
from app.schemas.cover_letter import (
    CoverLetterRequest
)

from app.services.cover_letter_service import (
    generate_cover_letter
)
from fastapi.responses import FileResponse

from app.services.cover_letter_pdf import (
    generate_cover_letter_pdf
)

router = APIRouter(
    prefix="/resume-builder",
    tags=["Resume Builder"]
)
@router.post("/")
def create_resume(
    resume: ResumeBuilderCreate,
    db: Session = Depends(get_db)
):

    new_resume = ResumeBuilder(

        user_id=resume.user_id,

        full_name=resume.full_name,

        email=resume.email,

        phone=resume.phone,

        linkedin=resume.linkedin,

        github=resume.github,

        summary=resume.summary
    )

    db.add(new_resume)

    db.commit()

    db.refresh(new_resume)

    return {
        "message":
        "Resume created successfully",

        "resume_id":
        new_resume.id
    }
@router.get("/{resume_id}")
def get_resume(
    resume_id: int,
    db: Session = Depends(get_db)
):

    resume = db.query(
        ResumeBuilder
    ).filter(
        ResumeBuilder.id == resume_id
    ).first()

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    return resume
@router.put("/{resume_id}")
def update_resume(
    resume_id: int,
    updated_resume: ResumeBuilderCreate,
    db: Session = Depends(get_db)
):

    resume = db.query(
        ResumeBuilder
    ).filter(
        ResumeBuilder.id == resume_id
    ).first()

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    resume.full_name = updated_resume.full_name
    resume.email = updated_resume.email
    resume.phone = updated_resume.phone
    resume.linkedin = updated_resume.linkedin
    resume.github = updated_resume.github
    resume.summary = updated_resume.summary

    db.commit()

    return {
        "message": "Resume updated successfully"
    }
@router.post("/{resume_id}/skill")
def add_skill(
    resume_id: int,
    skill: SkillCreate,
    db: Session = Depends(get_db)
):

    new_skill = Skill(
        resume_id=resume_id,
        skill_name=skill.skill_name
    )

    db.add(new_skill)

    db.commit()

    db.refresh(new_skill)

    return {
        "message": "Skill added successfully"
    }
@router.get("/{resume_id}/skills")
def get_skills(
    resume_id: int,
    db: Session = Depends(get_db)
):

    skills = db.query(
        Skill
    ).filter(
        Skill.resume_id == resume_id
    ).all()

    return skills
@router.post("/{resume_id}/education")
def add_education(
    resume_id: int,
    education: EducationCreate,
    db: Session = Depends(get_db)
):

    new_education = Education(

        resume_id=resume_id,

        college=education.college,

        degree=education.degree,

        cgpa=education.cgpa,

        year=education.year
    )

    db.add(new_education)

    db.commit()

    db.refresh(new_education)

    return {
        "message":
        "Education added successfully"
    }
@router.get("/{resume_id}/education")
def get_education(
    resume_id: int,
    db: Session = Depends(get_db)
):

    education = db.query(
        Education
    ).filter(
        Education.resume_id == resume_id
    ).all()

    return education
@router.post("/{resume_id}/project")
def add_project(
    resume_id: int,
    project: ProjectCreate,
    db: Session = Depends(get_db)
):

    new_project = Project(

        resume_id=resume_id,

        title=project.title,

        description=project.description,

        tech_stack=project.tech_stack,

        github_link=project.github_link
    )

    db.add(new_project)

    db.commit()

    db.refresh(new_project)

    return {
        "message":
        "Project added successfully"
    }
@router.get("/{resume_id}/projects")
def get_projects(
    resume_id: int,
    db: Session = Depends(get_db)
):

    projects = db.query(
        Project
    ).filter(
        Project.resume_id == resume_id
    ).all()

    return projects
@router.post("/{resume_id}/certification")
def add_certification(
    resume_id: int,
    certification: CertificationCreate,
    db: Session = Depends(get_db)
):

    new_certification = Certification(

        resume_id=resume_id,

        certificate_name=certification.certificate_name,

        issuer=certification.issuer,

        year=certification.year
    )

    db.add(new_certification)

    db.commit()

    db.refresh(new_certification)

    return {
        "message": "Certification added successfully"
    }
@router.get("/{resume_id}/certifications")
def get_certifications(
    resume_id: int,
    db: Session = Depends(get_db)
):

    certifications = db.query(
        Certification
    ).filter(
        Certification.resume_id == resume_id
    ).all()

    return certifications
@router.post("/{resume_id}/experience")
def add_experience(
    resume_id: int,
    experience: ExperienceCreate,
    db: Session = Depends(get_db)
):

    new_experience = Experience(

        resume_id=resume_id,

        company=experience.company,

        role=experience.role,

        duration=experience.duration,

        description=experience.description
    )

    db.add(new_experience)

    db.commit()

    db.refresh(new_experience)

    return {
        "message": "Experience added successfully"
    }
@router.get("/{resume_id}/experience")
def get_experience(
    resume_id: int,
    db: Session = Depends(get_db)
):

    experience = db.query(
        Experience
    ).filter(
        Experience.resume_id == resume_id
    ).all()

    return experience
@router.get("/{resume_id}/complete")
def get_complete_resume(
    resume_id: int,
    db: Session = Depends(get_db)
):

    resume = db.query(
        ResumeBuilder
    ).filter(
        ResumeBuilder.id == resume_id
    ).first()

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    skills = db.query(
        Skill
    ).filter(
        Skill.resume_id == resume_id
    ).all()

    education = db.query(
        Education
    ).filter(
        Education.resume_id == resume_id
    ).all()

    projects = db.query(
        Project
    ).filter(
        Project.resume_id == resume_id
    ).all()

    experience = db.query(
        Experience
    ).filter(
        Experience.resume_id == resume_id
    ).all()

    certifications = db.query(
        Certification
    ).filter(
        Certification.resume_id == resume_id
    ).all()

    return {
        "resume": resume,
        "skills": skills,
        "education": education,
        "projects": projects,
        "experience": experience,
        "certifications": certifications
    }
@router.get("/analysis/{resume_id}")
def analyze_built_resume(
    resume_id: int,
    db: Session = Depends(get_db)
):

    resume = db.query(
        ResumeBuilder
    ).filter(
        ResumeBuilder.id == resume_id
    ).first()

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    skills = db.query(
        Skill
    ).filter(
        Skill.resume_id == resume_id
    ).all()

    education = db.query(
        Education
    ).filter(
        Education.resume_id == resume_id
    ).all()

    projects = db.query(
        Project
    ).filter(
        Project.resume_id == resume_id
    ).all()

    experience = db.query(
        Experience
    ).filter(
        Experience.resume_id == resume_id
    ).all()

    certifications = db.query(
        Certification
    ).filter(
        Certification.resume_id == resume_id
    ).all()

    ats_score = calculate_ats_score(
        skills,
        education,
        projects,
        experience,
        certifications
    )

    suggestions = generate_suggestions(
        skills,
        projects,
        experience,
        certifications
    )

    return {

        "resume_id": resume_id,

        "full_name": resume.full_name,

        "ats_score": ats_score,

        "skills_count": len(skills),

        "education_count": len(education),

        "projects_count": len(projects),

        "experience_count": len(experience),

        "certifications_count": len(certifications),

        "suggestions": suggestions
    }
@router.get("/{resume_id}/job-match/{job_role}")
def match_resume_to_job(

    resume_id: int,

    job_role: str,

    db: Session = Depends(get_db)
):

    resume = db.query(
        ResumeBuilder
    ).filter(
        ResumeBuilder.id == resume_id
    ).first()

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    skills = db.query(
        Skill
    ).filter(
        Skill.resume_id == resume_id
    ).all()

    result = calculate_job_match(
        skills,
        job_role
    )

    return {

        "resume_id":
        resume_id,

        "job_role":
        job_role,

        "match_result":
        result
    }
@router.get("/{resume_id}/career-suggestions")
def career_suggestions(

    resume_id: int,

    db: Session = Depends(get_db)
):

    resume = db.query(
        ResumeBuilder
    ).filter(
        ResumeBuilder.id == resume_id
    ).first()

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    skills = db.query(
        Skill
    ).filter(
        Skill.resume_id == resume_id
    ).all()

    projects = db.query(
        Project
    ).filter(
        Project.resume_id == resume_id
    ).all()

    experience = db.query(
        Experience
    ).filter(
        Experience.resume_id == resume_id
    ).all()

    certifications = db.query(
        Certification
    ).filter(
        Certification.resume_id == resume_id
    ).all()

    return recommend_best_roles(
        skills,
        projects,
        experience,
        certifications
    )
@router.post(
    "/{resume_id}/job-description-match"
)
def job_description_match(

    resume_id: int,

    job_data: JobDescriptionInput,

    db: Session = Depends(get_db)
):

    resume = db.query(
        ResumeBuilder
    ).filter(
        ResumeBuilder.id == resume_id
    ).first()

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    skills = db.query(
        Skill
    ).filter(
        Skill.resume_id == resume_id
    ).all()

    result = match_job_description(

        skills,

        job_data.job_description
    )

    return result
@router.get("/{resume_id}/pdf")
def download_resume_pdf(

    resume_id: int,

    db: Session = Depends(get_db)
):

    resume = db.query(
        ResumeBuilder
    ).filter(
        ResumeBuilder.id == resume_id
    ).first()

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    skills = db.query(
        Skill
    ).filter(
        Skill.resume_id == resume_id
    ).all()

    education = db.query(
        Education
    ).filter(
        Education.resume_id == resume_id
    ).all()

    projects = db.query(
        Project
    ).filter(
        Project.resume_id == resume_id
    ).all()

    experience = db.query(
        Experience
    ).filter(
        Experience.resume_id == resume_id
    ).all()

    certifications = db.query(
        Certification
    ).filter(
        Certification.resume_id == resume_id
    ).all()

    filename = (
        f"resume_{resume_id}.pdf"
    )

    generate_resume_pdf(

        filename,

        resume,

        skills,

        education,

        projects,

        experience,

        certifications
    )

    return FileResponse(

        path=filename,

        media_type="application/pdf",

        filename=filename
    )
@router.get("/{resume_id}/career-roadmap")
def career_roadmap(

    resume_id: int,

    db: Session = Depends(get_db)
):

    resume = db.query(
        ResumeBuilder
    ).filter(
        ResumeBuilder.id == resume_id
    ).first()

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    skills = db.query(
        Skill
    ).filter(
        Skill.resume_id == resume_id
    ).all()

    education = db.query(
        Education
    ).filter(
        Education.resume_id == resume_id
    ).all()

    projects = db.query(
        Project
    ).filter(
        Project.resume_id == resume_id
    ).all()

    experience = db.query(
        Experience
    ).filter(
        Experience.resume_id == resume_id
    ).all()

    certifications = db.query(
        Certification
    ).filter(
        Certification.resume_id == resume_id
    ).all()

    resume_data = {

        "name":
        resume.full_name,

        "summary":
        resume.summary,

        "skills":
        [
            s.skill_name
            for s in skills
        ],

        "education":
        [
            {
                "college": e.college,
                "degree": e.degree
            }
            for e in education
        ],

        "projects":
        [
            {
                "title": p.title,
                "tech_stack": p.tech_stack
            }
            for p in projects
        ],

        "experience":
        [
            {
                "company": ex.company,
                "role": ex.role
            }
            for ex in experience
        ],

        "certifications":
        [
            c.certificate_name
            for c in certifications
        ]
    }

    result = generate_career_coach_report(
        resume_data
    )

    return result
@router.post("/cover-letter")
def create_cover_letter(

    data: CoverLetterRequest,

    db: Session = Depends(get_db)
):

    resume = db.query(
        ResumeBuilder
    ).filter(
        ResumeBuilder.id == data.resume_id
    ).first()

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    skills = db.query(
        Skill
    ).filter(
        Skill.resume_id == data.resume_id
    ).all()

    projects = db.query(
        Project
    ).filter(
        Project.resume_id == data.resume_id
    ).all()

    resume_data = {

        "name":
        resume.full_name,

        "summary":
        resume.summary,

        "skills":
        [
            s.skill_name
            for s in skills
        ],

        "projects":
        [
            p.title
            for p in projects
        ]
    }

    cover_letter = generate_cover_letter(

        resume_data,

        data.job_role,

        data.company_name
    )

    return {

        "cover_letter":
        cover_letter
    }
@router.post("/cover-letter/pdf")
def download_cover_letter(

    data: CoverLetterRequest,

    db: Session = Depends(get_db)
):

    resume = db.query(
        ResumeBuilder
    ).filter(
        ResumeBuilder.id == data.resume_id
    ).first()

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    skills = db.query(
        Skill
    ).filter(
        Skill.resume_id == data.resume_id
    ).all()

    projects = db.query(
        Project
    ).filter(
        Project.resume_id == data.resume_id
    ).all()

    resume_data = {

        "name":
        resume.full_name,

        "summary":
        resume.summary,

        "skills":
        [
            s.skill_name
            for s in skills
        ],

        "projects":
        [
            p.title
            for p in projects
        ]
    }

    cover_letter = generate_cover_letter(

        resume_data,

        data.job_role,

        data.company_name
    )

    filename = (
        f"cover_letter_{data.resume_id}.pdf"
    )

    generate_cover_letter_pdf(

        filename,

        cover_letter
    )

    return FileResponse(

        path=filename,

        media_type="application/pdf",

        filename=filename
    )