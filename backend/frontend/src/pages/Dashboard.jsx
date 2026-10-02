import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function Dashboard() {

  const [email, setEmail] = useState("")

  const navigate = useNavigate()

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const token =
          localStorage.getItem("token")

        const response =
          await api.get(
            "/auth/me",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          )

        setEmail(
          response.data.email
        )

      } catch (error) {

        console.log(error)

      }

    }

    fetchUser()

  }, [])

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    )

    navigate("/login")

  }

  const cards = [

    {
      title: "Resume Builder",
      description:
        "Create professional resumes",
      path: "/resume-builder"
    },

    {
      title: "Resume Analysis",
      description:
        "Analyze ATS score and skills",
      path: "/resume-analysis"
    },

    {
      title: "Job Matching",
      description:
        "Match resume with jobs",
      path: "/job-matching"
    },

    {
      title: "Career Coach",
      description:
        "Get AI career roadmap",
      path: "/career-coach"
    },

    {
      title: "AI Interview",
      description:
        "Practice interviews with AI",
      path: "/ai-interview"
    },

    {
      title: "Cover Letter",
      description:
        "Generate cover letters",
      path: "/cover-letter"
    },

    {
  title: "Resume Upload",
  description: "Upload PDF Resume",
  path: "/resume-upload"
}

  ]

  return (

    <div className="bg-black min-h-screen text-white">

      <div className="flex">

        {/* Sidebar */}

        <aside className="w-64 border-r border-white/10 min-h-screen p-6">

          <h1 className="text-2xl font-bold mb-10">
            CareerLens AI
          </h1>

          <ul className="space-y-4 text-gray-300">

            <li>Resume Builder</li>

            <li>Resume Analysis</li>

            <li>Job Matching</li>

            <li>Career Coach</li>

            <li>AI Interview</li>

            <li>Cover Letter</li>

          </ul>

        </aside>

        {/* Main Content */}

        <main className="flex-1 p-10">

          <div className="flex justify-between items-center mb-10">

            <div>

              <h1 className="text-4xl font-bold">
                Dashboard
              </h1>

              <p className="text-gray-400 mt-2">
                Welcome {email}
              </p>

            </div>

            <button

              onClick={handleLogout}

              className="
              bg-red-500
              hover:bg-red-600
              px-4
              py-2
              rounded-xl
              "
            >
              Logout
            </button>

          </div>

          {/* Dashboard Cards */}

          <div className="grid md:grid-cols-3 gap-6">

            {cards.map((card) => (

              <div

                key={card.title}

                className="
                bg-white/5
                border
                border-white/10
                backdrop-blur-lg
                rounded-3xl
                p-6
                hover:scale-105
                transition-all
                duration-300
                cursor-pointer
                "

                onClick={() =>
                  navigate(card.path)
                }

              >

                <h2 className="text-2xl font-bold mb-3">

                  {card.title}

                </h2>

                <p className="text-gray-400">

                  {card.description}

                </p>

              </div>

            ))}

          </div>

        </main>

      </div>

    </div>

  )

}

export default Dashboard