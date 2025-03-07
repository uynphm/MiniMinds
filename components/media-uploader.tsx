"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { UploadBox } from "@/components/upload-box";
import React from "react";

export function MediaUploader() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle image and video file selections
  const handleFile = (file: File, type: "image" | "video") => {
    if (type === "image") {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else if (type === "video") {
      setVideoFile(file);
      // Generate a preview URL for video using URL.createObjectURL()
      setVideoPreview(URL.createObjectURL(file));  // This creates a URL to display the video
    }
    setError(null);
  };

  // Handle the video and image upload
  const handleUpload = async () => {
    if (!imageFile || !videoFile) return; // Ensure both are present
  
    setUploading(true);
    setError(null);
  
    try {
      setAnalyzing(true);
  
      // Form data for both image and video
      const formDataImage = new FormData();
      formDataImage.append("file", imageFile);
      formDataImage.append("type", "image");
  
      const formDataVideo = new FormData();
      formDataVideo.append("file", videoFile);
      formDataVideo.append("type", "video");
      
      // Send both requests simultaneously
      const [response_image, response_video] = await Promise.all([
        fetch("http://localhost:8000/predict", {
          method: "POST",
          body: formDataImage,
        }),
        fetch("http://localhost:8000/analyze_video", {
          method: "POST",
          body: formDataVideo,
        }),
      ]);
  
      if (!response_image.ok || !response_video.ok) {
        throw new Error("Image or video analysis failed");
      }
      
      // Parse both responses as JSON
      const [imageAnalysisResponse, videoAnalysisResponse] = await Promise.all([
        response_image.json(),
        response_video.json(),
      ]);

      const imageText = imageAnalysisResponse.response || 'No analysis for image.';
      const videoText = videoAnalysisResponse.responses
        ? videoAnalysisResponse.responses.join("\n")
        : 'No analysis for video.';
      
      // Combine the responses into one message
      const combinedMessage = `Analyze the provided responses to determine if the child is autistic:

      Image Analysis:
      ${imageText}

      Video Analysis:
      ${videoText}`;

      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: combinedMessage,
        }),
      });

      const data = await response.json();

      if (data.response) {
        setResults(data.response);
      } else {
        setError("No analysis provided by the chatbot.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during analysis");
      console.error("Analysis error:", err);
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const handleClear = () => {
    setImageFile(null);
    setVideoFile(null);
    setImagePreview(null);
    setVideoPreview(null);
    setUploading(false);
    setAnalyzing(false);
    setResults(null);
    setError(null);
  };

  const isReadyForAnalysis = imageFile && videoFile;

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Image and Video upload boxes side by side */}
      <div className="flex space-x-6">
        <div className="flex flex-col items-center">
          <UploadBox
            title="Analyze Image"
            icon={<ImageIcon className="h-8 w-8" />}
            acceptTypes="image/*"
            onFileSelected={(file) => handleFile(file, "image")}
            glowColor="#8b5cf6"
          />
          {/* Display preview of image */}
          {imageFile && imagePreview && (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black/5 w-40 h-40">
              <img src={imagePreview} alt="Image Preview" className="object-cover w-full h-full" />
            </div>
          )}
        </div>

        <div className="flex flex-col items-center">
          <UploadBox
            title="Analyze Video"
            icon={<ImageIcon className="h-8 w-8" />}
            acceptTypes="video/*"
            onFileSelected={(file) => handleFile(file, "video")}
            glowColor="#8b5cf6"
          />
          {/* Display preview of video */}
          {videoFile && videoPreview && (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black/5 w-40 h-40">
              <video src={videoPreview} controls className="object-cover w-full h-full" />
            </div>
          )}
        </div>
      </div>

      {/* Show the "Start Analysis" button when both image and video are uploaded */}
      {isReadyForAnalysis && (
        <button
          onClick={handleUpload}
          disabled={uploading || analyzing}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {uploading || analyzing ? "Analyzing..." : "Start Analysis"}
        </button>
      )}

      {/* Show the results from the chatbot API inside the Analysis Results box */}
      {
      results && (
        <div className="mt-10 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 px-6 py-4">
              <h2 className="font-semibold text-xl text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Analysis Results
              </h2>
            </div>

            {/* Content */}
            <div className="p-6">
              {typeof results === "string" ? (
                <div className="text-gray-800">
                  {results.split("\n").map((paragraph, index) => {
                    // Check if this is a bullet point
                    if (paragraph.trim().startsWith("-") || paragraph.trim().startsWith("•")) {
                      return (
                        <div key={index} className="flex items-start mt-3">
                          <span className="text-blue-500 mr-2">•</span>
                          <p className="flex-1">
                            {paragraph
                              .replace(/^[-•]\s*/, "")
                              .split(/(\b\d+(?:\.\d+)?%|\bautism\b|\bnon-autism\b|\basd\b)/gi)
                              .map((part, i) =>
                                part.match(/\d+(?:\.\d+)?%|\bautism\b|\bnon-autism\b|\basd\b/i) ? (
                                  <span key={i} className="text-blue-700 font-semibold">
                                    {part}
                                  </span>
                                ) : (
                                  <span key={i}>{part}</span>
                                ),
                              )}
                          </p>
                        </div>
                      )
                    }

                    // Check if this is a model prediction line
                    if (
                      paragraph.includes("%") &&
                      (paragraph.includes("VGG") || paragraph.includes("Efficient") || paragraph.includes("Inception"))
                    ) {
                      const [model, confidenceText] = paragraph.split(":")
                      const confidenceMatch = confidenceText.match(/(\d+(?:\.\d+)?)%/)
                      const confidence = confidenceMatch ? Number.parseFloat(confidenceMatch[1]) : 0

                      return (
                        <div key={index} className="mt-3 bg-gray-50 p-3 rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{model.trim()}</span>
                            <span className="text-blue-600 font-semibold">{confidence}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${confidence}%` }}
                            />
                          </div>
                        </div>
                      )
                    }

                    // Check if this is a heading (all caps or ends with a colon)
                    if (paragraph.trim().toUpperCase() === paragraph.trim() || paragraph.trim().endsWith(":")) {
                      return (
                        <h3 key={index} className="font-semibold text-blue-900 mt-6 mb-2">
                          {paragraph}
                        </h3>
                      )
                    }

                    // Regular paragraph
                    return (
                      <p key={index} className="mt-3 leading-relaxed">
                        {paragraph.split(/(\b\d+(?:\.\d+)?%|\bautism\b|\bnon-autism\b|\basd\b)/gi).map((part, i) =>
                          part.match(/\d+(?:\.\d+)?%|\bautism\b|\bnon-autism\b|\basd\b|\basd\b/i) ? (
                            <span key={i} className="text-blue-600 font-semibold">
                              {part}
                            </span>
                          ) : (
                            <span key={i}>{part}</span>
                          ),
                        )}
                      </p>
                    )
                  })}
                </div>
              ) : (
                <pre className="whitespace-pre-wrap break-words text-gray-800 leading-relaxed">
                  {JSON.stringify(results, null, 2)}
                </pre>
              )}
            </div>

            {/* Footer with disclaimer */}
            <div className="bg-blue-50 p-4 border-t border-blue-100">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Important Note:</span> This analysis is based on AI models and should not be
                considered a medical diagnosis. Please consult with a qualified healthcare professional for proper
                evaluation.
              </p>
            </div>
          </div>
        </div>
      )
    }

      {/* Show error message if any */}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
