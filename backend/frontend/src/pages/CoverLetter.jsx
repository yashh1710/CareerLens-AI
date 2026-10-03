import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function CoverLetter() {
  const navigate = useNavigate()
  const resumeId = localStorage.getItem("resume_id")

  const [jobRole, setJobRole] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState("")

  const generateCoverLetter = async () => {
    if (!resumeId) {
      setError("No resume found. Please create or save your resume first.")
      return
    }

    if (!jobRole.trim() || !companyName.trim()) {
      setError("Please enter both the job role and company name.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await api.post("/resume-builder/cover-letter", {
        resume_id: Number(resumeId),
        job_role: jobRole.trim(),
        company_name: companyName.trim()
      })

      setCoverLetter(response.data.cover_letter || "")
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.detail ||
        "Unable to generate the cover letter. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = async () => {
    if (!resumeId) return

    setDownloading(true)
    setError("")

    try {
      const response = await api.post(
        "/resume-builder/cover-letter/pdf",
        {
          resume_id: Number(resumeId),
          job_role: jobRole.trim(),
          company_name: companyName.trim()
        },
        {
          responseType: "blob"
        }
      )

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      )

      const link = document.createElement("a")
      link.href = url
      link.download = `cover_letter_${resumeId}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()

      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      setError("Unable to download the cover letter PDF.")
    } finally {
      setDownloading(false)
    }
  }

  const copyCoverLetter = async () => {
    if (!coverLetter) return

    try {
      await navigator.clipboard.writeText(coverLetter)
      alert("Cover letter copied to clipboard.")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "#f8fafc"
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto"
        }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginBottom: "25px",
            padding: "10px 18px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer"
          }}
        >
          ← Back to Dashboard
        </button>

        <h1>AI Cover Letter Generator</h1>

        <p
          style={{
            color: "#64748b",
            marginBottom: "30px"
          }}
        >
          Generate a tailored cover letter using your saved resume.
        </p>

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            marginBottom: "25px"
          }}
        >
          <label>Job Role</label>

          <input
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="e.g. Software Engineer"
            style={{
              width: "100%",
              padding: "12px",
              margin: "8px 0 20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxSizing: "border-box"
            }}
          />

          <label>Company Name</label>

          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Acies"
            style={{
              width: "100%",
              padding: "12px",
              margin: "8px 0 20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxSizing: "border-box"
            }}
          />

          <button
            onClick={generateCoverLetter}
            disabled={loading}
            style={{
              padding: "12px 22px",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              background: "#111827",
              color: "white"
            }}
          >
            {loading ? "Generating..." : "Generate Cover Letter"}
          </button>

          {!resumeId && (
            <p style={{ color: "#dc2626" }}>
              No saved resume found. Please create your resume first.
            </p>
          )}
        </div>

        {error && (
          <div
            style={{
              padding: "14px",
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: "8px",
              marginBottom: "20px"
            }}
          >
            {error}
          </div>
        )}

        {coverLetter && (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)"
            }}
          >
            <h2>Generated Cover Letter</h2>

            <div
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: "1.7",
                marginTop: "20px",
                padding: "25px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px"
              }}
            >
              {coverLetter}
            </div>

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                gap: "10px"
              }}
            >
              <button
                onClick={copyCoverLetter}
                style={{
                  padding: "11px 18px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: "white",
                  cursor: "pointer"
                }}
              >
                Copy
              </button>

              <button
                onClick={downloadPDF}
                disabled={downloading}
                style={{
                  padding: "11px 18px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#111827",
                  color: "white",
                  cursor: "pointer"
                }}
              >
                {downloading ? "Downloading..." : "Download PDF"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoverLetter