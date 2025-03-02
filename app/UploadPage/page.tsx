"use client";

import { MediaUploader } from "@/components/media-uploader";
import { motion } from "framer-motion";
import NavigationBar from "@/components/navigationbar";
import { Boxes } from "@/components/bgboxes";

export default function AnalyzePage() {
  return (
    <div className="relative min-h-screen bg-blue-200 text-white overflow-hidden">
      {/* Background Boxes */}
      <div className="fixed inset-0">
        <Boxes />
      </div>

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

      {/* Main Content */}
      <div className="relative z-20 flex flex-col min-h-screen">
        {/* Navigation */}
        <NavigationBar />

        {/* Centered Content */}
        <motion.main
          className="flex-1 flex items-center justify-center p-4 sm:p-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-full max-w-2xl space-y-12 text-center"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="space-y-2">
              <motion.h1
                className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-800"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Autism Detection Analysis
              </motion.h1>
              <motion.p
                className="text-xl sm:text-2xl text-slate-600 font-space-grotesk"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Upload your files for instant AI-powered analysis and insights
              </motion.p>
            </div>
            <MediaUploader />
            <motion.div
              id="results"
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Analysis Results</h2>
              <p className="text-slate-600 font-space-grotesk">Upload a file to see AI-generated insights here.</p>
              {/* Results will be dynamically inserted here */}
            </motion.div>
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}