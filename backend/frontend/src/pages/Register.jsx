import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
function Register() {

  const navigate = useNavigate()

  const [fullName, setFullName] =
    useState("")

  const [email, setEmail] =
    useState("")

  const [password, setPassword] =
    useState("")

  const handleRegister = async () => {

    try {

      await api.post(
        "/auth/register",
        {
          full_name: fullName,
          email: email,
          password: password
        }
      )

      alert(
        "Registration Successful"
      )

      navigate("/login")

    } catch (error) {

      alert(
        error.response.data.detail
      )

    }

  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center">

      <div className="bg-white/5 border border-white/10 p-10 rounded-3xl w-400px">

        <h1 className="text-white text-3xl font-bold mb-6">
          Register
        </h1>

        <input
          placeholder="Full Name"
          value={fullName}
          onChange={(e) =>
            setFullName(e.target.value)
          }
          className="w-full p-3 rounded-xl mb-4 bg-black border border-gray-700 text-white"
        />

        <input
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
          onClick={handleRegister}
          className="w-full bg-white text-black py-3 rounded-xl font-semibold"
        >
          Register
        </button>

      </div>

    </div>
  )
}

export default Register