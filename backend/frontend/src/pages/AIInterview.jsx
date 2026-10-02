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
  const [isProcessingAudio, setIsProcessingAudio] = useState(false)
  const [audioSubmitted, setAudioSubmitted] = useState(false)

  const resumeId = localStorage.getItem("resume_id")

  const startInterview = async () => {
    if (!role.trim()) {
      alert("Please enter a role.")
      return
    }

    if (!resumeId) {
      alert("Resume ID not found. Please upload/select your resume first.")
      return
    }

    try {
      const response = await api.post("/interview/start", {
        resume_id: Number(resumeId),
        role: role.trim()
      })

      setSessionId(response.data.session_id)
      setQuestions(response.data.questions || [])
      setCurrentQuestion("")
      setAnswer("")
      setResult(null)
      setAudioSubmitted(false)
    } catch (error) {
      console.error("Start interview error:", error)
      alert(error.response?.data?.detail || "Failed to start interview.")
    }
  }

  const selectQuestion = (question) => {
    setCurrentQuestion(question)
    setAnswer("")
    setResult(null)
    setAudioSubmitted(false)
  }

  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert("Please write an answer.")
      return
    }

    try {
      const response = await api.post("/interview/submit-answer", {
        session_id: sessionId,
        question: currentQuestion,
        answer: answer.trim()
      })
      setResult(response.data)
      setAudioSubmitted(false)
    } catch (error) {
      console.error("Typed answer error:", error)
      alert(error.response?.data?.detail || "Failed to submit answer.")
    }
  }

  const handleRecordingComplete = async (audioBlob) => {
    if (!sessionId || !currentQuestion) {
      alert("Please start the interview and select a question first.")
      return
    }

    if (!audioBlob || audioBlob.size === 0) {
      alert("No audio was recorded.")
      return
    }

    setIsProcessingAudio(true)
    setResult(null)
    setAudioSubmitted(false)

    try {
      const formData = new FormData()
      formData.append("audio", audioBlob, "interview_answer.webm")
      formData.append("session_id", String(sessionId))
      formData.append("question", currentQuestion)

      const response = await api.post("/interview/submit-audio", formData)

      setAnswer(response.data.transcript || "")
      setResult(response.data)
      setAudioSubmitted(true)
    } catch (error) {
      console.error("Audio submission error:", error)
      alert(error.response?.data?.detail || "Failed to process your audio answer.")
    } finally {
      setIsProcessingAudio(false)
    }
  }

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden && sessionId) {
        setWarnings((previous) => previous + 1)
        setWarningMessage("Warning: Tab switching detected.")

        try {
          await api.post("/interview/monitor", {
            session_id: sessionId,
            event_type: "Tab Switch",
            details: "User switched browser tab"
          })
        } catch (error) {
          console.error("Monitoring error:", error)
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [sessionId])

  return (
    <div className="bg-black min-h-screen text-white p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-10">AI Interview</h1>

        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          <InterviewCamera onRecordingComplete={handleRecordingComplete} />

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-5">Interview Status</h2>
            <p className="text-green-400">📷 Camera Ready</p>
            <p className="text-green-400 mb-4">🎤 Microphone Ready</p>

            <div className="border-t border-white/10 pt-4">
              <h3 className="text-xl font-semibold mb-3">Proctoring Status</h3>
              <p>Total Warnings : <span className="text-yellow-400 font-bold">{warnings}</span></p>

              {warningMessage && (
                <div className="mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500">
                  ⚠️ {warningMessage}
                </div>
              )}

              <p className="text-gray-400 mt-4">Do not switch browser tabs during the interview.</p>
            </div>
          </div>
        </div>

        {!sessionId && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10">
            <h2 className="text-2xl font-bold mb-5">Start Interview</h2>
            <input
              type="text"
              placeholder="Enter Role (Example: Python Developer)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-4 rounded-xl bg-black border border-white/20 mb-5"
            />
            <button
              onClick={startInterview}
              className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-semibold"
            >
              Start Interview
            </button>
          </div>
        )}

        {questions.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10">
            <h2 className="text-3xl font-bold mb-6">Interview Questions</h2>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => selectQuestion(question)}
                  className={`w-full text-left border rounded-xl p-5 transition ${
                    currentQuestion === question
                      ? "bg-purple-600/30 border-purple-500"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {index + 1}. {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentQuestion && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10">
            <h2 className="text-2xl font-bold mb-4">Selected Question</h2>
            <div className="bg-black border border-white/10 rounded-xl p-5 mb-6">
              <p className="text-gray-200 text-lg">{currentQuestion}</p>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-5 mb-6">
              <h3 className="text-xl font-semibold mb-2">🎙️ Answer Verbally</h3>
              <p className="text-gray-400">
                Use the recording controls above to record your answer. Your audio will be transcribed and evaluated by AI.
              </p>

              {isProcessingAudio && (
                <div className="mt-4 text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                  ⏳ Processing your audio answer...
                </div>
              )}

              {audioSubmitted && !isProcessingAudio && (
                <div className="mt-4 text-green-400 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  ✅ Audio answer processed successfully.
                </div>
              )}
            </div>

            {answer && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">📝 Transcript</h3>
                <div className="bg-black border border-white/10 rounded-xl p-5 text-gray-300">
                  {answer}
                </div>
              </div>
            )}

            <details className="mb-6">
              <summary className="cursor-pointer text-gray-400 hover:text-white">✍️ Use typed answer instead</summary>
              <textarea
                rows="7"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your answer here..."
                className="w-full bg-black border border-white/20 rounded-xl p-4 mt-4 mb-4"
              />
              <button
                onClick={submitAnswer}
                disabled={isProcessingAudio}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-8 py-4 rounded-xl font-semibold"
              >
                Submit Typed Answer
              </button>
            </details>
          </div>
        )}

        {result && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10">
            <h2 className="text-3xl font-bold mb-6">AI Evaluation</h2>
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5 mb-6">
              <h3 className="text-3xl text-green-400 font-bold">Score : {result.score}/10</h3>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">💬 Feedback</h3>
              <p className="text-gray-300">{result.feedback}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-3 text-green-400">✓ Strengths</h3>
                <ul className="space-y-3">
                  {result.strengths?.map((item, index) => (
                    <li key={index} className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 text-yellow-400">⚠ Improvements</h3>
                <ul className="space-y-3">
                  {result.improvements?.map((item, index) => (
                    <li key={index} className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">{item}</li>
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
