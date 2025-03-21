import Link from "next/link"
import { ArrowRight } from 'lucide-react'
import NavigationBar from "../components/navigationbar";
import { Search, Zap, Shield } from 'lucide-react';
import { Border } from "../components/border";

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen bg-blue-200 text-white overflow-hidden">

      {/* Main Content */}
      <div className="relative z-20 flex flex-col min-h-screen">
        {/* Navigation */}
        <NavigationBar />

        {/* Decorative Blobs */}
        <div className="fixed inset-0 pointer-events-none">
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

        {/* Content */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-24">
          <div className="w-full max-w-4xl text-center space-y-8">
            <h1 className="text-4xl sm:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-blue-700 to-blue-950 animate-pulse">
              Welcome to MiniMinds
            </h1>
            <p className="font-semibold text-xl sm:text-lg text-black-200 max-w-2xl mx-auto font-space-grotesk">
              Autism affects every child differently, but early detection can lead to timely intervention and better outcomes. With our system, parents can recognize early signs in toddlers and access the resources needed to support their child&apos;s development. Start detecting early - because every step matters!
            </p>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-blue-950/90 backdrop-blur-sm rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:-translate-y-5 hover:shadow-xl">
                <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <Search className="h-7 w-7 text-blue-950" />
                </div>
                <h3 className="text-2xl font-bold text-blue-200 mb-3">Simple Detection</h3>
                <p className="text-white">
                  Recognize early signs of autism in toddlers with an intuitive and user-friendly interface.
                </p>
              </div>

              <div className="bg-blue-950/90 backdrop-blur-sm rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:-translate-y-5 hover:shadow-xl">
                <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <Zap className="h-7 w-7 text-blue-950" />
                </div>
                <h3 className="text-2xl font-bold text-blue-200 mb-3">Fast Insights</h3>
                <p className="text-white">
                  Get quick, research-backed insights to support your child&apos;s development.
                </p>
              </div>

              <div className="bg-blue-950/90 backdrop-blur-sm rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:-translate-y-5 hover:shadow-xl">
                <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7 text-blue-950" />
                </div>
                <h3 className="text-2xl font-bold text-blue-200 mb-3">No Data Storage</h3>
                <p className="text-white">
                  Enjoy peace of mind knowing your information is never stored or shared.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <Link href="/UploadPage">
              <Border className="inline-flex items-center px-4 pt-3 py-3 font-medium bg-blue-100 rounded-full transition-colors duration-300 group hover:bg-blue-200">
                Start Detection
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Border>
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
