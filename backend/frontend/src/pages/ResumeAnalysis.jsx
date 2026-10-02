import { useState, useEffect } from "react"
import api from "../services/api"

function ResumeAnalysis() {

  const [analysis, setAnalysis] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  const resumeId =
    localStorage.getItem(
      "resume_id"
    )

  useEffect(() => {

    const analyzeResume =
      async () => {

        try {

          setLoading(true)

          console.log(
            "Resume ID:",
            resumeId
          )

          const response =
            await api.get(
              `/resume-upload/analysis/${resumeId}`
            )

          console.log(
            "Analysis Response:",
            response.data
          )

          setAnalysis(
            response.data
          )

        } catch (err) {

          console.log(err)

          setError(
            "Failed to analyze resume"
          )

        } finally {

          setLoading(false)

        }

      }

    if (resumeId) {

      analyzeResume()

    } else {

      setError(
        "No Resume ID Found"
      )

      setLoading(false)

    }

  }, [resumeId])

  return (

    <div className="bg-black min-h-screen text-white p-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-10">
          Resume Analysis
        </h1>

        <div className="mb-6 text-gray-400">
          Resume ID: {resumeId || "Not Found"}
        </div>

        {loading && (

          <div className="bg-white/5 p-6 rounded-2xl">

            Analyzing Resume...

          </div>

        )}

        {error && (

          <div className="bg-red-500/20 border border-red-500 p-6 rounded-2xl">

            {error}

          </div>

        )}

        {analysis && (

          <div className="mt-6">

            <div className="bg-white/5 p-6 rounded-2xl">

              <h2 className="text-2xl font-bold mb-4">

                Analysis Result

              </h2>

              <div className="mb-4">

                <strong>
                  File Name:
                </strong>

                {" "}

                {analysis.file_name}

              </div>

              <div className="mb-4">

                <strong>
                  Resume ID:
                </strong>

                {" "}

                {analysis.resume_id}

              </div>

<div className="grid md:grid-cols-2 gap-6">

  <div className="bg-white/5 p-6 rounded-3xl">

    <h2 className="text-2xl font-bold mb-4">
      Resume Score
    </h2>

    <div className="text-6xl font-bold text-green-400">

      {analysis.analysis.resume_score}%

    </div>

  </div>

  <div className="bg-white/5 p-6 rounded-3xl">

    <h2 className="text-2xl font-bold mb-4">
      Skills Found
    </h2>

    <div className="flex flex-wrap gap-3">

      {analysis.analysis.skills_found.map(
        (skill, index) => (

          <span
            key={index}
            className="
            bg-purple-600
            px-4
            py-2
            rounded-full
            "
          >
            {skill}
          </span>

        )
      )}

    </div>

  </div>

</div>

<div className="grid md:grid-cols-2 gap-6 mt-6">

  <div className="bg-white/5 p-6 rounded-3xl">

    <h2 className="text-2xl font-bold mb-4">
      Strengths
    </h2>

    {analysis.analysis.strengths.map(
      (item, index) => (

        <p
          key={index}
          className="mb-2 text-green-400"
        >
          ✓ {item}
        </p>

      )
    )}

  </div>

  <div className="bg-white/5 p-6 rounded-3xl">

    <h2 className="text-2xl font-bold mb-4">
      Improvements
    </h2>

    {analysis.analysis.improvements.map(
      (item, index) => (

        <p
          key={index}
          className="mb-2 text-yellow-400"
        >
          ⚠ {item}
        </p>

      )
    )}

  </div>

</div>

            </div>

          </div>

        )}

      </div>

    </div>

  )

}

export default ResumeAnalysis