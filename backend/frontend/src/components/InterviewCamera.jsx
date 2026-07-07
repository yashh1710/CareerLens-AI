import { useEffect, useRef, useState } from "react"

function InterviewCamera() {

  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const [cameraStatus, setCameraStatus] =
    useState("Requesting...")

  const [micStatus, setMicStatus] =
    useState("Requesting...")

  useEffect(() => {

    const startCamera = async () => {

      try {

        const stream =
          await navigator.mediaDevices.getUserMedia({

            video: true,
            audio: true

          })

        streamRef.current = stream

        if (videoRef.current) {

          videoRef.current.srcObject = stream

        }

        setCameraStatus("Connected ✅")
        setMicStatus("Connected ✅")

      }

      catch (error) {

        console.log(error)

        setCameraStatus("Denied ❌")
        setMicStatus("Denied ❌")

      }

    }

    startCamera()

    return () => {

      if (streamRef.current) {

        streamRef.current
          .getTracks()
          .forEach(track => track.stop())

      }

    }

  }, [])

  return (

    <div className="bg-white/5 rounded-3xl p-6 border border-white/10">

      <h2 className="text-2xl font-bold mb-5">

        🎥 Live Camera

      </h2>

      <video

        ref={videoRef}

        autoPlay

        playsInline

        muted

        className="
        w-full
        rounded-2xl
        border
        border-white/20
        bg-black
        "

      />

      <div className="mt-5 space-y-2">

        <p>

          📷 Camera :
          {" "}
          <span className="text-green-400">

            {cameraStatus}

          </span>

        </p>

        <p>

          🎤 Microphone :
          {" "}
          <span className="text-green-400">

            {micStatus}

          </span>

        </p>

      </div>

    </div>

  )

}

export default InterviewCamera