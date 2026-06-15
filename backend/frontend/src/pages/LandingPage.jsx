import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import FeatureCards from "../components/FeatureCards"

function LandingPage() {

  return (

    <div className="bg-black text-white min-h-screen">

      <div className="absolute w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full top-20 left-20"></div>

      <div className="absolute w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full bottom-20 right-20"></div>

      <div className="relative z-10">

        <Navbar />

        <Hero />

        <FeatureCards />

      </div>

    </div>

  )
}

export default LandingPage