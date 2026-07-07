import { useEffect } from "react"
import { useState } from "react"

import api from "../services/api"

function CareerCoach() {

  const [report, setReport] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const resumeId =
    localStorage.getItem(
      "resume_id"
    )

  useEffect(() => {

    const fetchReport =
      async () => {

        try {

          const response =
            await api.get(
              `/career-coach/${resumeId}`
            )

          setReport(
            response.data
          )

        } catch (error) {

          console.log(error)

          alert(
            "Failed to generate career report"
          )

        } finally {

          setLoading(false)

        }

      }

    if (resumeId) {

      fetchReport()

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

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-10">

          AI Career Coach

        </h1>

        {loading && (

          <h2>
            Generating Career Roadmap...
          </h2>

        )}

        {report && (

          <>

            {/* Top Cards */}

            <div className="grid md:grid-cols-3 gap-6 mb-10">

              <div className="bg-white/5 p-6 rounded-3xl">

                <h2 className="text-gray-400 mb-2">

                  Current Level

                </h2>

                <p className="text-2xl font-bold">

                  {report.current_level}

                </p>

              </div>

              <div className="bg-white/5 p-6 rounded-3xl">

                <h2 className="text-gray-400 mb-2">

                  Best Fit Role

                </h2>

                <p className="text-2xl font-bold text-purple-400">

                  {report.best_fit_role}

                </p>

              </div>

              <div className="bg-white/5 p-6 rounded-3xl">

                <h2 className="text-gray-400 mb-2">

                  Readiness Score

                </h2>

                <p className="text-2xl font-bold text-green-400">

                  {report.industry_readiness_score}%

                </p>

              </div>

            </div>

            {/* Career Paths */}

            <div className="bg-white/5 p-6 rounded-3xl mb-8">

              <h2 className="text-2xl font-bold mb-4">

                Top Career Paths

              </h2>

              <ul className="space-y-2">

                {report.top_3_career_paths?.map(
                  (item, index) => (

                    <li key={index}>
                      🚀 {item}
                    </li>

                  )
                )}

              </ul>

            </div>

            {/* Skills */}

            <div className="bg-white/5 p-6 rounded-3xl mb-8">

              <h2 className="text-2xl font-bold mb-4">

                Skills To Learn

              </h2>

              <ul className="space-y-2">

                {report.skills_to_learn?.map(
                  (item, index) => (

                    <li key={index}>
                      📘 {item}
                    </li>

                  )
                )}

              </ul>

            </div>

            {/* Certifications */}

            <div className="bg-white/5 p-6 rounded-3xl mb-8">

              <h2 className="text-2xl font-bold mb-4">

                Certifications

              </h2>

              <ul className="space-y-2">

                {report.certifications_to_pursue?.map(
                  (item, index) => (

                    <li key={index}>
                      🏆 {item}
                    </li>

                  )
                )}

              </ul>

            </div>

            {/* Projects */}

            <div className="bg-white/5 p-6 rounded-3xl mb-8">

              <h2 className="text-2xl font-bold mb-4">

                Recommended Projects

              </h2>

              <ul className="space-y-2">

                {report.projects_to_build?.map(
                  (item, index) => (

                    <li key={index}>
                      💻 {item}
                    </li>

                  )
                )}

              </ul>

            </div>

            {/* 3 Month Plan */}

            <div className="bg-white/5 p-6 rounded-3xl mb-8">

              <h2 className="text-2xl font-bold mb-4">

                3 Month Plan

              </h2>

              <ul className="space-y-2">

                {report.three_month_plan?.map(
                  (item, index) => (

                    <li key={index}>
                      📅 {item}
                    </li>

                  )
                )}

              </ul>

            </div>

            {/* 6 Month Plan */}

            <div className="bg-white/5 p-6 rounded-3xl mb-8">

              <h2 className="text-2xl font-bold mb-4">

                6 Month Plan

              </h2>

              <ul className="space-y-2">

                {report.six_month_plan?.map(
                  (item, index) => (

                    <li key={index}>
                      🎯 {item}
                    </li>

                  )
                )}

              </ul>

            </div>

            {/* Job Strategy */}

            <div className="bg-white/5 p-6 rounded-3xl">

              <h2 className="text-2xl font-bold mb-4">

                Job Search Strategy

              </h2>

              <ul className="space-y-2">

                {report.job_search_strategy?.map(
                  (item, index) => (

                    <li key={index}>
                      🔥 {item}
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

export default CareerCoach