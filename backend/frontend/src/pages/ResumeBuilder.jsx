import { useEffect, useMemo, useState } from "react"
import api from "../services/api"

const emptyEducation = { college: "", degree: "", cgpa: "", year: "" }
const emptyProject = { title: "", description: "", tech_stack: "", github_link: "" }
const emptyExperience = { company: "", role: "", duration: "", description: "" }
const emptyCertification = { certificate_name: "", issuer: "", year: "" }

function Section({ title, description, children }) {
  return (
    <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        {description && <p className="text-white/50 mt-1">{description}</p>}
      </div>
      {children}
    </section>
  )
}

function Input({ label, ...props }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-white/70">{label}</span>
      <input
        {...props}
        className="w-full p-3.5 bg-black/30 border border-white/10 rounded-xl outline-none focus:border-purple-500 transition"
      />
    </label>
  )
}

function Textarea({ label, ...props }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-white/70">{label}</span>
      <textarea
        {...props}
        className="w-full p-3.5 bg-black/30 border border-white/10 rounded-xl outline-none focus:border-purple-500 transition resize-y"
      />
    </label>
  )
}

function PrimaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      type={props.type || "button"}
      className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 rounded-xl font-medium transition"
    >
      {children}
    </button>
  )
}

function SecondaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      type={props.type || "button"}
      className="border border-white/10 hover:bg-white/10 px-4 py-2.5 rounded-xl transition"
    >
      {children}
    </button>
  )
}

function ResumeBuilder() {
  const [resumeId, setResumeId] = useState(() => localStorage.getItem("resume_id") || "")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    summary: "",
  })

  const [skillInput, setSkillInput] = useState("")
  const [skills, setSkills] = useState([])
  const [education, setEducation] = useState([])
  const [projects, setProjects] = useState([])
  const [experience, setExperience] = useState([])
  const [certifications, setCertifications] = useState([])

  const [educationForm, setEducationForm] = useState(emptyEducation)
  const [projectForm, setProjectForm] = useState(emptyProject)
  const [experienceForm, setExperienceForm] = useState(emptyExperience)
  const [certificationForm, setCertificationForm] = useState(emptyCertification)

  const hasResume = useMemo(() => Boolean(resumeId), [resumeId])

  const setField = (e) => {
    setFormData((current) => ({ ...current, [e.target.name]: e.target.value }))
  }

  const setObjectField = (setter) => (e) => {
    setter((current) => ({ ...current, [e.target.name]: e.target.value }))
  }

  const handleApiError = (err, fallback) => {
    console.error(err)
    const detail = err?.response?.data?.detail
    setError(typeof detail === "string" ? detail : fallback)
  }

  const loadCompleteResume = async (id) => {
    setLoading(true)
    setError("")
    try {
      const response = await api.get(`/resume-builder/${id}/complete`)
      const data = response.data

      setFormData({
        full_name: data.resume?.full_name || "",
        email: data.resume?.email || "",
        phone: data.resume?.phone || "",
        linkedin: data.resume?.linkedin || "",
        github: data.resume?.github || "",
        summary: data.resume?.summary || "",
      })
      setSkills(data.skills || [])
      setEducation(data.education || [])
      setProjects(data.projects || [])
      setExperience(data.experience || [])
      setCertifications(data.certifications || [])
    } catch (err) {
      // A stale localStorage id should not prevent creating a new resume.
      if (err?.response?.status === 404) {
        localStorage.removeItem("resume_id")
        setResumeId("")
      } else {
        handleApiError(err, "Could not load your resume.")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (resumeId) loadCompleteResume(resumeId)
  }, [resumeId])

  const savePersonalInfo = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")
    setError("")

    try {
      let id = resumeId

      if (id) {
        await api.put(`/resume-builder/${id}`, formData)
        setMessage("Personal information saved successfully.")
      } else {
        const response = await api.post("/resume-builder/", formData)
        id = String(response.data.resume_id)
        localStorage.setItem("resume_id", id)
        setResumeId(id)
        setMessage(`Resume created successfully. Resume ID: ${id}`)
      }
    } catch (err) {
      handleApiError(err, "Failed to save personal information.")
    } finally {
      setSaving(false)
    }
  }

  const addSkill = async () => {
    const skillName = skillInput.trim()
    if (!skillName || !resumeId) return

    setSaving(true)
    setMessage("")
    setError("")
    try {
      await api.post(`/resume-builder/${resumeId}/skill`, { skill_name: skillName })
      setSkillInput("")
      await loadCompleteResume(resumeId)
      setMessage("Skill added successfully.")
    } catch (err) {
      handleApiError(err, "Failed to add skill.")
    } finally {
      setSaving(false)
    }
  }

  const addSectionItem = async (type, endpoint, payload, resetForm) => {
    if (!resumeId) return
    setSaving(true)
    setMessage("")
    setError("")
    try {
      await api.post(`/resume-builder/${resumeId}/${endpoint}`, payload)
      resetForm()
      await loadCompleteResume(resumeId)
      setMessage(`${type} added successfully.`)
    } catch (err) {
      handleApiError(err, `Failed to add ${type.toLowerCase()}.`)
    } finally {
      setSaving(false)
    }
  }

  if (loading && !formData.full_name) {
    return (
      <div className="bg-black min-h-screen text-white p-10 flex items-center justify-center">
        <p className="text-white/60">Loading your resume...</p>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8 pb-16">
        <header>
          <p className="text-purple-400 mb-2">CareerLens AI</p>
          <h1 className="text-4xl md:text-5xl font-bold">Resume Builder</h1>
          <p className="text-white/50 mt-3">
            Build your resume section by section and save every part to your account.
          </p>
          {resumeId && (
            <p className="text-sm text-white/40 mt-2">Resume ID: {resumeId}</p>
          )}
        </header>

        {message && (
          <div className="border border-green-500/30 bg-green-500/10 text-green-300 rounded-xl p-4">
            {message}
          </div>
        )}
        {error && (
          <div className="border border-red-500/30 bg-red-500/10 text-red-300 rounded-xl p-4">
            {error}
          </div>
        )}

        <Section title="1. Personal Information" description="Your contact and professional introduction.">
          <form onSubmit={savePersonalInfo} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <Input label="Full Name" name="full_name" value={formData.full_name} onChange={setField} required />
              <Input label="Email" name="email" type="email" value={formData.email} onChange={setField} required />
              <Input label="Phone" name="phone" value={formData.phone} onChange={setField} />
              <Input label="LinkedIn" name="linkedin" value={formData.linkedin} onChange={setField} />
              <Input label="GitHub" name="github" value={formData.github} onChange={setField} />
            </div>
            <Textarea label="Professional Summary" name="summary" rows={5} value={formData.summary} onChange={setField} />
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? "Saving..." : hasResume ? "Save Personal Information" : "Create Resume"}
            </PrimaryButton>
          </form>
        </Section>

        <Section title="2. Skills" description="Add technical and professional skills one at a time.">
          {!hasResume ? (
            <p className="text-yellow-300/80">Create the resume above before adding skills.</p>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addSkill()
                    }
                  }}
                  placeholder="e.g. Python, FastAPI, SQL"
                  className="flex-1 p-3.5 bg-black/30 border border-white/10 rounded-xl outline-none focus:border-purple-500"
                />
                <PrimaryButton onClick={addSkill} disabled={saving || !skillInput.trim()}>
                  + Add Skill
                </PrimaryButton>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.length === 0 && <span className="text-white/40">No skills added yet.</span>}
                {skills.map((skill) => (
                  <span key={skill.id} className="bg-purple-500/15 border border-purple-500/30 px-3 py-2 rounded-full">
                    {skill.skill_name}
                  </span>
                ))}
              </div>
            </>
          )}
        </Section>

        <Section title="3. Education" description="Add your college, degree, CGPA and graduation year.">
          {!hasResume ? (
            <p className="text-yellow-300/80">Create the resume above before adding education.</p>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-5">
                <Input label="College / University" name="college" value={educationForm.college} onChange={setObjectField(setEducationForm)} />
                <Input label="Degree" name="degree" value={educationForm.degree} onChange={setObjectField(setEducationForm)} />
                <Input label="CGPA / Percentage" name="cgpa" value={educationForm.cgpa} onChange={setObjectField(setEducationForm)} />
                <Input label="Year" name="year" value={educationForm.year} onChange={setObjectField(setEducationForm)} />
              </div>
              <PrimaryButton
                disabled={saving || !educationForm.college || !educationForm.degree}
                onClick={() => addSectionItem("Education", "education", educationForm, () => setEducationForm({ ...emptyEducation }))}
              >
                + Add Education
              </PrimaryButton>

              {education.length > 0 && (
                <div className="space-y-3">
                  {education.map((item) => (
                    <div key={item.id} className="border border-white/10 rounded-xl p-4">
                      <p className="font-semibold">{item.degree} — {item.college}</p>
                      <p className="text-white/50">{item.cgpa} {item.year && `• ${item.year}`}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </Section>

        <Section title="4. Experience" description="Add internships, jobs or relevant professional experience.">
          {!hasResume ? (
            <p className="text-yellow-300/80">Create the resume above before adding experience.</p>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-5">
                <Input label="Company" name="company" value={experienceForm.company} onChange={setObjectField(setExperienceForm)} />
                <Input label="Role" name="role" value={experienceForm.role} onChange={setObjectField(setExperienceForm)} />
                <Input label="Duration" name="duration" value={experienceForm.duration} onChange={setObjectField(setExperienceForm)} />
              </div>
              <Textarea label="Description" name="description" rows={4} value={experienceForm.description} onChange={setObjectField(setExperienceForm)} />
              <PrimaryButton
                disabled={saving || !experienceForm.company || !experienceForm.role}
                onClick={() => addSectionItem("Experience", "experience", experienceForm, () => setExperienceForm({ ...emptyExperience }))}
              >
                + Add Experience
              </PrimaryButton>

              {experience.length > 0 && (
                <div className="space-y-3">
                  {experience.map((item) => (
                    <div key={item.id} className="border border-white/10 rounded-xl p-4">
                      <p className="font-semibold">{item.role} — {item.company}</p>
                      <p className="text-white/50">{item.duration}</p>
                      <p className="text-white/70 mt-2 whitespace-pre-wrap">{item.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </Section>

        <Section title="5. Projects" description="Showcase projects with their technologies and repository links.">
          {!hasResume ? (
            <p className="text-yellow-300/80">Create the resume above before adding projects.</p>
          ) : (
            <>
              <div className="space-y-5">
                <Input label="Project Title" name="title" value={projectForm.title} onChange={setObjectField(setProjectForm)} />
                <Textarea label="Description" name="description" rows={4} value={projectForm.description} onChange={setObjectField(setProjectForm)} />
                <div className="grid md:grid-cols-2 gap-5">
                  <Input label="Tech Stack" name="tech_stack" placeholder="Python, FastAPI, React, PostgreSQL" value={projectForm.tech_stack} onChange={setObjectField(setProjectForm)} />
                  <Input label="GitHub Link" name="github_link" value={projectForm.github_link} onChange={setObjectField(setProjectForm)} />
                </div>
              </div>
              <PrimaryButton
                disabled={saving || !projectForm.title}
                onClick={() => addSectionItem("Project", "project", projectForm, () => setProjectForm({ ...emptyProject }))}
              >
                + Add Project
              </PrimaryButton>

              {projects.length > 0 && (
                <div className="space-y-3">
                  {projects.map((item) => (
                    <div key={item.id} className="border border-white/10 rounded-xl p-4">
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-purple-300 text-sm mt-1">{item.tech_stack}</p>
                      <p className="text-white/70 mt-2 whitespace-pre-wrap">{item.description}</p>
                      {item.github_link && <p className="text-white/40 text-sm mt-2">{item.github_link}</p>}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </Section>

        <Section title="6. Certifications" description="Add relevant certifications and credentials.">
          {!hasResume ? (
            <p className="text-yellow-300/80">Create the resume above before adding certifications.</p>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-5">
                <Input label="Certificate Name" name="certificate_name" value={certificationForm.certificate_name} onChange={setObjectField(setCertificationForm)} />
                <Input label="Issuer" name="issuer" value={certificationForm.issuer} onChange={setObjectField(setCertificationForm)} />
                <Input label="Year" name="year" value={certificationForm.year} onChange={setObjectField(setCertificationForm)} />
              </div>
              <PrimaryButton
                disabled={saving || !certificationForm.certificate_name}
                onClick={() => addSectionItem("Certification", "certification", certificationForm, () => setCertificationForm({ ...emptyCertification }))}
              >
                + Add Certification
              </PrimaryButton>

              {certifications.length > 0 && (
                <div className="space-y-3">
                  {certifications.map((item) => (
                    <div key={item.id} className="border border-white/10 rounded-xl p-4">
                      <p className="font-semibold">{item.certificate_name}</p>
                      <p className="text-white/50">{item.issuer} {item.year && `• ${item.year}`}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </Section>

        <div className="flex flex-wrap gap-3 pt-2">
          <SecondaryButton onClick={() => resumeId && loadCompleteResume(resumeId)} disabled={!resumeId || loading}>
            Refresh Saved Data
          </SecondaryButton>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder
