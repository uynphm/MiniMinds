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
      {results && (
        <div className="mt-10 p-10 bg-black/5 border rounded-md w-full max-w-lg">
          <h2 className="font-semibold text-xl">Analysis Results:</h2>
          <pre className="whitespace-pre-wrap break-words text-lg">{results}</pre>
        </div>
      )}

      {/* Show error message if any */}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
