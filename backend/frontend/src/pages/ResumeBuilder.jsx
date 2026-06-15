import { useState } from "react"
import api from "../services/api"

function ResumeBuilder() {

  const [formData, setFormData] = useState({

    user_id: 1,

    full_name: "",

    email: "",

    phone: "",

    linkedin: "",

    github: "",

    summary: ""

  })

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    })

  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const response =
        await api.post(
          "/resume-builder/",
          formData
        )

      alert(
        `Resume Created Successfully\nResume ID: ${response.data.resume_id}`
      )

    } catch (error) {

      console.log(error)

      alert(
        "Failed to create resume"
      )

    }

  }

  return (

    <div className="bg-black min-h-screen text-white p-10">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-bold mb-10">
          Resume Builder
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <input
            name="full_name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl"
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl"
          />

          <input
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl"
          />

          <input
            name="linkedin"
            placeholder="LinkedIn"
            onChange={handleChange}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl"
          />

          <input
            name="github"
            placeholder="GitHub"
            onChange={handleChange}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl"
          />

          <textarea
            name="summary"
            placeholder="Professional Summary"
            rows="5"
            onChange={handleChange}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl"
          />

          <button
            type="submit"
            className="
            bg-purple-600
            hover:bg-purple-700
            px-8
            py-4
            rounded-xl
            "
          >
            Create Resume
          </button>

        </form>

      </div>

    </div>
  )
}

export default ResumeBuilder