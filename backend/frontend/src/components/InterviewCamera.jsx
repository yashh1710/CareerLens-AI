import { useEffect, useRef, useState } from "react"

function InterviewCamera({ onRecordingComplete }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  const [cameraStatus, setCameraStatus] = useState("Requesting...")
  const [micStatus, setMicStatus] = useState("Requesting...")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })

        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        setCameraStatus("Connected ✅")
        setMicStatus("Connected ✅")
      } catch (error) {
        console.error("Camera/Microphone error:", error)
        setCameraStatus("Denied ❌")
        setMicStatus("Denied ❌")
      }
    }

    startCamera()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startRecording = () => {
    if (!streamRef.current) {
      alert("Camera and microphone are not ready.")
      return
    }

    const audioTracks = streamRef.current.getAudioTracks()

    if (!audioTracks.length) {
      alert("Microphone is not available.")
      return
    }

    chunksRef.current = []

    let mimeType = "audio/webm;codecs=opus"

    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : ""
    }

    try {
      const audioStream = new MediaStream(audioTracks)
      const recorder = mimeType
        ? new MediaRecorder(audioStream, { mimeType })
        : new MediaRecorder(audioStream)

      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (event) => {
        if (event.data?.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, {
          type: mimeType || "audio/webm"
        })

        if (onRecordingComplete) {
          onRecordingComplete(audioBlob)
        }
      }

      recorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((previous) => previous + 1)
      }, 1000)
    } catch (error) {
      console.error("MediaRecorder error:", error)
      alert("Audio recording is not supported in this browser.")
    }
  }

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current

    if (recorder && recorder.state !== "inactive") {
      recorder.stop()
    }

    setIsRecording(false)

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`
  }

  return (
    <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
      <h2 className="text-2xl font-bold mb-5">🎥 Live Camera</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full rounded-2xl border border-white/20 bg-black"
      />

      <div className="mt-5 space-y-2">
        <p>
          📷 Camera : {" "}
          <span className="text-green-400">{cameraStatus}</span>
        </p>
        <p>
          🎤 Microphone : {" "}
          <span className="text-green-400">{micStatus}</span>
        </p>
      </div>

      <div className="mt-6 pt-5 border-t border-white/10">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold">
            {isRecording ? "🔴 Recording..." : "🎙️ Ready to record"}
          </p>

          {isRecording && (
            <span className="font-mono text-red-400 text-lg">
              {formatTime(recordingTime)}
            </span>
          )}
        </div>

        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            disabled={cameraStatus !== "Connected ✅" || micStatus !== "Connected ✅"}
            className="w-full px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed font-semibold transition"
          >
            🎙️ Start Recording
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="w-full px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 font-semibold transition"
          >
            ⏹ Stop Recording
          </button>
        )}
      </div>
    </div>
  )
}

export default InterviewCamera
