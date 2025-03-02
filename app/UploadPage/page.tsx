"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import NavigationBar from "@/components/navigationbar";
import { MediaUploader } from "@/components/media-uploader";

// Define the ModelPrediction type
interface ModelPrediction {
  label: string;
  class: string;
  confidence: number;
}

// Define the PredictionResponse type
interface PredictionResponse {
  filename: string;
  predictions: ModelPrediction[];
}

export default function AnalyzePage() {
  const [results, setResults] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      setAnalyzing(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      const rawText = await response.text();
      console.log("Raw API response:", rawText);

      let data: PredictionResponse;
      try {
        data = JSON.parse(rawText) as PredictionResponse;
      } catch {
        throw new Error(`Invalid JSON response: ${rawText}`);
      }

      console.log("Parsed API response:", data);

      if (!data || typeof data !== "object" || !data.filename || !Array.isArray(data.predictions)) {
        throw new Error("Invalid API response format");
      }

      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during analysis");
      console.error("Analysis error:", err);
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const handleClear = () => {
    setResults(null);
    setError(null);
  };

  return (
    <div className="relative min-h-screen bg-blue-200 text-white overflow-hidden">
      {/* Background Boxes */}
      <div className="fixed inset-0">
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
                className="text-4xl sm:text-5xl font-bold tracking-tight text-blue-950/90"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Autism Detection Analysis
              </motion.h1>
              <motion.p
                className="text-xl sm:text-xl text-blue-950/90 font-space-grotesk"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Upload your files for instant AI-powered analysis and insights.
              </motion.p>
            </div>
            <MediaUploader
              onFileUpload={handleFileUpload}
              onClear={handleClear}
              results={results}
              error={error}
              uploading={uploading}
              analyzing={analyzing}
            />
            <motion.div
              id="results"
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-blue-950/90 mb-4">Analysis Results</h2>
              {analyzing ? (
                <p className="text-blue-950/90 font-space-grotesk">Analyzing...</p>
              ) : results ? (
                <div className="text-blue-950/90 font-space-grotesk">
                  {results.predictions.map((prediction, index) => (
                    <div key={index} className="mb-2">
                      <strong>{prediction.label}:</strong> {prediction.class} (Confidence: {prediction.confidence.toFixed(2)}%)
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-blue-950/90 font-space-grotesk">Upload a file to see AI-generated insights here.</p>
              )}
            </motion.div>
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}