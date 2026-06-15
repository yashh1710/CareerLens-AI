const features = [
  {
    title: "Resume Builder",
    desc: "Create professional resumes with AI assistance.",
    number: "01"
  },
  {
    title: "ATS Analysis",
    desc: "Analyze resumes and improve ATS scores.",
    number: "02"
  },
  {
    title: "Job Matching",
    desc: "Match resumes against job descriptions.",
    number: "03"
  },
  {
    title: "AI Interview",
    desc: "Practice interviews with Gemini AI.",
    number: "04"
  },
  {
    title: "Career Coach",
    desc: "Get personalized career roadmaps.",
    number: "05"
  },
  {
    title: "Cover Letter",
    desc: "Generate tailored cover letters instantly.",
    number: "06"
  }
]

function FeatureCards() {
  return (
    <section className="px-10 pb-24">

      <h2 className="text-5xl font-bold text-center mb-16">
        Everything You Need
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        {features.map((feature) => (

          <div
            key={feature.number}
            className="
            bg-white/5
            border border-white/10
            backdrop-blur-xl
            rounded-3xl
            p-8
            hover:scale-105
            transition-all
            duration-300
            "
          >

            <div className="text-purple-400 text-sm mb-4">
              {feature.number}
            </div>

            <h3 className="text-2xl font-bold mb-4">
              {feature.title}
            </h3>

            <p className="text-gray-400">
              {feature.desc}
            </p>

          </div>

        ))}

      </div>

    </section>
  )
}

export default FeatureCards