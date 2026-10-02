import { useEffect } from "react"
import { useState } from "react"

import api from "../services/api"

function JobMatching() {

  const [result, setResult] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const resumeId =
    localStorage.getItem(
      "resume_id"
    )

  useEffect(() => {

    const fetchMatch =
      async () => {

        try {

          const response =
            await api.get(
              `/job-matching/recommend/${resumeId}`
            )

          setResult(
            response.data
          )

        } catch (error) {

          console.log(error)

          alert(
            "Failed to load job recommendations"
          )

        } finally {

          setLoading(false)

        }

      }

    if (resumeId) {

      fetchMatch()

    }

  }, [resumeId])

  if (!resumeId) {

    return (

      <div className="bg-black min-h-screen text-white flex items-center justify-center">

        <h1 className="text-3xl font-bold">

          Upload Resume First

        </h1>

      </div>

    )

  }

  return (

    <div className="bg-black min-h-screen text-white p-10">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold mb-10">

          AI Job Matching

        </h1>

        {loading && (

          <h2>
            Analyzing Resume...
          </h2>

        )}

        {result && (

          <>

            {/* Career Level */}

            <div className="bg-white/5 p-6 rounded-3xl mb-8">

              <h2 className="text-2xl font-bold mb-2">

                Career Level

              </h2>

              <p className="text-purple-400 text-xl">

                {result.career_level}

              </p>

            </div>

            {/* Roles */}

            <div className="bg-white/5 p-6 rounded-3xl mb-8">

              <h2 className="text-2xl font-bold mb-6">

                Recommended Roles

              </h2>

              <div className="grid md:grid-cols-2 gap-6">

                {result.recommended_roles?.map(
                  (role, index) => (

                    <div
                      key={index}
                      className="
                      bg-purple-500/10
                      border
                      border-purple-500/20
                      p-5
                      rounded-2xl
                      "
                    >

                      <h3 className="text-xl font-bold">

                        {role.role}

                      </h3>

                      <p className="text-purple-400 mt-2">

                        Confidence:
                        {" "}
                        {role.confidence}%

                      </p>

                    </div>

                  )
                )}

              </div>

            </div>

            {/* Strengths */}

            <div className="bg-white/5 p-6 rounded-3xl mb-8">

              <h2 className="text-2xl font-bold mb-4">

                Strengths

              </h2>

              <ul className="space-y-2">

                {result.strengths?.map(
                  (skill, index) => (

                    <li key={index}>

                      ✅ {skill}

                    </li>

                  )
                )}

              </ul>

            </div>

            {/* Missing Skills */}

            <div className="bg-white/5 p-6 rounded-3xl">

              <h2 className="text-2xl font-bold mb-4">

                Skills To Learn

              </h2>

              <ul className="space-y-2">

                {result.missing_skills?.map(
                  (skill, index) => (

                    <li key={index}>

                      🚀 {skill}

                    </li>

                  )
                )}

              </ul>

            </div>

          </>

        )}

      </div>

    </div>

  )

}

export default JobMatching