import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function ResumeUpload() {

  const navigate = useNavigate()

  const [file, setFile] = useState(null)

  const [uploadResult, setUploadResult] =
    useState(null)

  const handleUpload = async () => {

    if (!file) {

      alert("Please select a PDF file")

      return

    }

    const formData = new FormData()

    formData.append(
      "file",
      file
    )

    try {

      const response =
        await api.post(
          "/resume-upload/",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data"
            }
          }
        )

      console.log(
        "Upload Response:",
        response.data
      )

      setUploadResult(
        response.data
      )

      localStorage.setItem(
        "resume_id",
        response.data.resume_id
      )

      console.log(
        "Saved Resume ID:",
        response.data.resume_id
      )

      console.log(
        "Stored Value:",
        localStorage.getItem(
          "resume_id"
        )
      )

      alert(
        "Resume Uploaded Successfully"
      )

      navigate(
        "/resume-analysis"
      )

    } catch (error) {

      console.log(error)

      alert(
        "Upload Failed"
      )

    }

  }

  return (

    <div className="bg-black min-h-screen text-white p-10">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-bold mb-10">

          Resume Upload

        </h1>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

          <input

            type="file"

            accept=".pdf"

            onChange={(e) =>
              setFile(
                e.target.files[0]
              )
            }

            className="mb-6 block"

          />

          <button

            onClick={handleUpload}

            className="
            bg-purple-600
            hover:bg-purple-700
            px-8
            py-4
            rounded-xl
            font-semibold
            "

          >

            Upload Resume

          </button>

        </div>

        {uploadResult && (

          <div className="mt-10 bg-white/5 border border-white/10 rounded-3xl p-6">

            <h2 className="text-2xl font-bold mb-4">

              Upload Successful

            </h2>

            <p>

              Resume ID:
              {" "}
              {uploadResult.resume_id}

            </p>

            <p>

              File Name:
              {" "}
              {uploadResult.filename}

            </p>

            <p>

              Characters Extracted:
              {" "}
              {uploadResult.characters_extracted}

            </p>

          </div>

        )}

      </div>

    </div>

  )

}

export default ResumeUpload