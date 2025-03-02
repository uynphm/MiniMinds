import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function WelcomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 bg-blue-custom text-white overflow-hidden">
      <div className="w-full max-w-4xl text-center space-y-8 relative z-10 animate-bounce-in">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-950 animate-pulse">
          Welcome to MiniMinds
        </h1>
        <p className="font-semibold text-2xl sm:text-2xl text-black-200 max-w-2xl mx-auto font-space-grotesk">
          Autism is a spectrum disorder, and it affects each person differently. We are here to help detect early signs of autism in toddlers.
        </p>

        {/* Content container */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Easy to Use", description: "Intuitive interface designed for everyone" },
            { title: "Powerful Features", description: "Everything you need to succeed" },
            { title: "Secure & Reliable", description: "Your data is always protected" },
          ].map((feature, index) => (
            <div key={index} className="bg-blue-900/30 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-blue-200">{feature.description}</p>
            </div>
          ))}
        </div>

        <Link
          href="/UploadPage"
          className="inline-flex items-center px-6 pt-2 py-3 text-lg font-medium text-white bg-blue-950 rounded-full hover:bg-gray-600 transition-colors duration-300 group"
        >
          Start Detection
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>

      {/* Animated background elements */}
      <div className="absolute rounded-full mix-blend-screen animate-blob"
        style={{
          backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.1)`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 300 + 50}px`,
          height: `${Math.random() * 300 + 50}px`,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${Math.random() * 20 + 10}s`,
        }}
      />
    </main>
  )
}
