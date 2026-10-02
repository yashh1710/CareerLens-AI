import { useNavigate } from "react-router-dom"

function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="flex justify-between items-center px-10 py-6">

      <button
        type="button"
        onClick={() => navigate("/")}
        className="text-2xl font-bold cursor-pointer"
      >
        CareerLens AI
      </button>

      <div className="flex gap-4">

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="px-5 py-2 border border-white/20 rounded-xl cursor-pointer hover:bg-white/10 transition"
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => navigate("/register")}
          className="px-5 py-2 bg-white text-black rounded-xl font-semibold cursor-pointer hover:bg-gray-200 transition"
        >
          Get Started
        </button>

      </div>

    </nav>
  )
}

export default Navbar