"use client"

import { MediaUploader } from "@/components/media-uploader"
import { motion } from "framer-motion"

const BackgroundBubble = ({ delay = 0 }) => (
  <motion.div
    className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-70"
    initial={{
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      scale: 0,
    }}
    animate={{
      x: Math.random() * 400 - 200,
      y: Math.random() * 400 - 200,
      scale: Math.random() * 0.8 + 0.2,
      opacity: Math.random() * 0.5 + 0.3,
    }}
    transition={{
      duration: Math.random() * 10 + 10,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse",
      delay,
    }}
    style={{
      backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, 255, 0.3)`,
      width: `${Math.random() * 300 + 100}px`,
      height: `${Math.random() * 300 + 100}px`,
    }}
  />
)

export default function AnalyzePage() {
  return (
    <motion.main
      className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-24 bg-sky-100 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background bubbles */}
      {[...Array(10)].map((_, i) => (
        <BackgroundBubble key={i} delay={i * 0.2} />
      ))}

      <motion.div
        className="w-full max-w-2xl space-y-12 relative z-10"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="text-center space-y-2">
          <motion.h1
            className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Autism Detection Analysis
          </motion.h1>
          <motion.p
            className="text-slate-600 font-space-grotesk"
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
  )
}

