import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
function Login() {

  const navigate = useNavigate()

  const [email, setEmail] =
    useState("")

  const [password, setPassword] =
    useState("")

  const handleLogin = async () => {

    try {

      const response =
        await api.post(
          "/auth/login",
          {
            email,
            password
          }
        )

      localStorage.setItem(
        "token",
        response.data.access_token
      )

      navigate("/dashboard")

    } catch {

      alert(
        "Invalid Credentials"
      )

    }

  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center">

      <div className="bg-white/5 border border-white/10 p-10 rounded-3xl w-400px">

        <h1 className="text-white text-3xl font-bold mb-6">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full p-3 rounded-xl mb-4 bg-black border border-gray-700 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full p-3 rounded-xl mb-4 bg-black border border-gray-700 text-white"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-white text-black py-3 rounded-xl font-semibold"
        >
          Login
        </button>

      </div>

    </div>
  )
}

export default Login