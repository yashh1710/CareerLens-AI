import { useEffect, useState } from "react"
import api from "../services/api"
import InterviewCamera from "../components/InterviewCamera"

function AIInterview() {
  const [role, setRole] = useState("")
  const [sessionId, setSessionId] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [result, setResult] = useState(null)
  const [warnings, setWarnings] = useState(0)
  const [warningMessage, setWarningMessage] = useState("")

  const resumeId = localStorage.getItem("resume_id")

  const startInterview = async () => {
    if (!role.trim()) {
      alert("Please enter a role.")
      return
    }

    try {
      const response = await api.post(
        "/interview/start",
        {
          resume_id: Number(resumeId),
          role: role.trim()
        }
      )

      setSessionId(response.data.session_id)
      setQuestions(response.data.questions)
    } catch (error) {
      console.log(error)
      alert("Failed to start interview.")
    }
  }

  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert("Please write an answer.")
      return
    }

    try {
      const response = await api.post(
        "/interview/submit-answer",
        {
          session_id: sessionId,
          question: currentQuestion,
          answer: answer.trim()
        }
      )

      setResult(response.data)
    } catch (error) {
      console.log(error)
      alert("Failed to submit answer.")
    }
  }

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden && sessionId) {
        setWarnings((prev) => prev + 1)
        setWarningMessage("Warning: Tab switching detected.")

        try {
          await api.post(
            "/interview/monitor",
            {
              session_id: sessionId,
              event_type: "Tab Switch",
              details: "User switched browser tab"
            }
          )
        } catch (error) {
          console.log(error)
        }
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    )

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      )
    }
  }, [sessionId])

  return (
    <div className="bg-black min-h-screen text-white p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-10">
          AI Interview
        </h1>

        {/* Camera + Status */}
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          <InterviewCamera />

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-5">
              Interview Status
            </h2>

            <p className="text-green-400">
              Camera Ready
            </p>

            <p className="text-green-400 mb-4">
              Microphone Ready
            </p>

            <div className="border-t border-white/10 pt-4">
              <h3 className="text-xl font-semibold mb-3">
                Proctoring Status
              </h3>

              <p>
                Total Warnings :
                <span className="text-yellow-400 font-bold">
                  {" "}
                  {warnings}
                </span>
              </p>

              {warningMessage && (
                <div className="mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500">
                  {warningMessage}
                </div>
              )}

              <p className="text-gray-400 mt-4">
                Do not switch browser tabs during the interview.
              </p>
            </div>
          </div>
        </div>

        {/* Start Interview */}
        {!sessionId && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10">
            <h2 className="text-2xl font-bold mb-5">
              Start Interview
            </h2>

            <input
              type="text"
              placeholder="Enter Role (Example: Python Developer)"
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              className="
                w-full
                p-4
                rounded-xl
                bg-black
                border
                border-white/20
                mb-5
              "
            />

            <button
              onClick={startInterview}
              className="
                bg-purple-600
                hover:bg-purple-700
                px-8
                py-4
                rounded-xl
                font-semibold
              "
            >
              Start Interview
            </button>
          </div>
        )}

        {/* Questions */}
        {questions.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10">
            <h2 className="text-3xl font-bold mb-6">
              Interview Questions
            </h2>

            <div className="space-y-4">
              {questions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentQuestion(question)
                    setResult(null)
                    setAnswer("")
                  }}
                  className="
                    w-full
                    text-left
                    bg-white/5
                    hover:bg-white/10
                    border
                    border-white/10
                    rounded-xl
                    p-5
                    transition
                  "
                >
                  {index + 1}. {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Answer Section */}
        {currentQuestion && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10">
            <h2 className="text-2xl font-bold mb-4">
              Selected Question
            </h2>

            <p className="mb-6 text-gray-300">
              {currentQuestion}
            </p>

            <textarea
              rows="7"
              value={answer}
              onChange={(e) =>
                setAnswer(e.target.value)
              }
              placeholder="Write your answer here..."
              className="
                w-full
                bg-black
                border
                border-white/20
                rounded-xl
                p-4
                mb-6
              "
            />

            <button
              onClick={submitAnswer}
              className="
                bg-green-600
                hover:bg-green-700
                px-8
                py-4
                rounded-xl
                font-semibold
              "
            >
              Submit Answer
            </button>
          </div>
        )}

        {/* Evaluation */}
        {result && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h2 className="text-3xl font-bold mb-6">
              AI Evaluation
            </h2>

            <h3 className="text-2xl text-green-400 mb-4">
              Score : {result.score}/10
            </h3>

            <p className="mb-6">
              {result.feedback}
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-3">
                  Strengths
                </h3>

                <ul className="space-y-2">
                  {result.strengths?.map((item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">
                  Improvements
                </h3>

                <ul className="space-y-2">
                  {result.improvements?.map((item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIInterview
