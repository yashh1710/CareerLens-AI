function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-6">

      <h1 className="text-2xl font-bold">
        CareerLens AI
      </h1>

      <div className="flex gap-4">

        <button className="px-5 py-2 border border-white/20 rounded-xl">
          Login
        </button>

        <button className="px-5 py-2 bg-white text-black rounded-xl font-semibold">
          Get Started
        </button>

      </div>

    </nav>
  )
}

export default Navbar