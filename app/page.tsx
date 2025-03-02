import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function WelcomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 bg-blue-custom text-white overflow-hidden">
      <div className="w-full max-w-4xl text-center space-y-8 relative z-10">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-950 animate-pulse">
          Welcome to MiniMinds
        </h1>
        <p className="font-mono text-xl sm:text-2xl text-black-200 max-w-2xl mx-auto font-space-grotesk">
          Autism is a spectrum disorder, and it affects each person differently. We are here to help detect early signs of autism in toddlers.
        </p>
        <Link
          href="/UploadPage"
          className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-300 group"
        >
          Start Detection
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full mix-blend-screen animate-blob"
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
          ))}
        </div>
      </div>
    </main>
  )
}
