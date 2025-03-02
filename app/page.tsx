import Link from "next/link"
import { ArrowRight } from "lucide-react"
import NavigationBar from "@/components/navigationbar";
import { Sparkles, Brain, Shield } from "lucide-react";
import { Border } from "@/components/border";

export default function WelcomePage() {
  return (
    <main className="flex h-screen flex-col items-center justify-center p-4 sm:p-24 bg-blue-custom text-white overflow-hidden">
      <div className="mt-8 w-full h-full justify-center items-center flex flex-col">
        {/* Navigation bar */}
        <div className="z-10 w-full absolute inset-0 overflow-hidden">
          <NavigationBar />
        </div>
        <div className="w-full max-w-4xl text-center space-y-8 relative z-10 animate-bounce-in">
          <h1 className="text-4xl sm:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-blue-700 to-blue-950 animate-pulse">
            Welcome to MiniMinds
          </h1>
          <p className="font-semibold text-xl sm:text-lg text-black-200 max-w-2xl mx-auto font-space-grotesk">
            Autism affects every child differently, but early detection can can lead to timely intervention and better outcomes. With our app, parents can recognize early signs in toddlers and access the resources needed to support their child’s development. Start detecting early - because every step matters!
          </p>

          {/* Content container */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-blue-950 rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:-translate-y-5 hover:shadow-xl mt-3 mb-5">
              <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Sparkles className="h-7 w-7 text-blue-950" />
              </div>
              <h3 className="text-2xl font-bold text-blue-200 mb-3">Easy to Use</h3>
              <p className="text-white">
                Intuitive interface designed for everyone, making the assessment process simple and straightforward.
              </p>
            </div>

            <div className="bg-blue-950 rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:-translate-y-5 hover:shadow-xl mt-3 mb-5">
              <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Brain className="h-7 w-7 text-blue-950" />
              </div>
              <h3 className="text-2xl font-bold text-blue-200 mb-3">Powerful Features</h3>
              <p className="text-white">
                Everything you need to succeed with comprehensive assessment tools backed by research.
              </p>
            </div>

            <div className="bg-blue-950 rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:-translate-y-5 hover:shadow-xl mt-3 mb-5">
              <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-blue-950" />
              </div>
              <h3 className="text-2xl font-bold text-blue-200 mb-3">Secure & Reliable</h3>
              <p className="text-white">
                Your data is always protected with enterprise-grade security and privacy measures.
              </p>
            </div>
          </div>

          <Link
            href="/UploadPage"
          >
            <Border
              className="inline-flex items-center px-4 pt-3 py-3 font-medium bg-blue-100 rounded-full transition-colors duration-300 group"
            >
              Start Detection
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Border>
          </Link>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          {[...Array(20)].map((_, i) => {
            const size = `${Math.random() * 300 + 50}px`;
            const top = `${Math.random() * 100}%`;
            const left = `${Math.random() * 100}%`;
            const color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.1)`;
            const delay = `${Math.random() * 10}s`;
            const duration = `${Math.random() * 20 + 10}s`;

            return (
              <div
                key={i}
                className="absolute rounded-full mix-blend-screen animate-blob"
                style={{
                  backgroundColor: color,
                  top: top,
                  left: left,
                  width: size,
                  height: size,
                  animationDelay: delay,
                  animationDuration: duration,
                }}
              />
            );
          })}
        </div>
      </div>
    </main >
  )
}
