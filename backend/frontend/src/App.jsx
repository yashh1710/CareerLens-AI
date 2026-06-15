import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"

import LandingPage from "./pages/LandingPage"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import ResumeBuilder from "./pages/ResumeBuilder"
import ResumeUpload from "./pages/ResumeUpload"
import ResumeAnalysis from "./pages/ResumeAnalysis"
function App() {
  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/><Route
  path="/resume-builder"
  element={
    <ProtectedRoute>
      <ResumeBuilder />
    </ProtectedRoute>
  }
/>
<Route
  path="/resume-upload"
  element={
    <ProtectedRoute>
      <ResumeUpload />
    </ProtectedRoute>
  }
/>

<Route
  path="/resume-analysis"
  element={
    <ProtectedRoute>
      <ResumeAnalysis />
    </ProtectedRoute>
  }
/>

      </Routes>

    </BrowserRouter>

  )
}

export default App