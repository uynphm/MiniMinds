"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { UploadBox } from "@/components/upload-box";
import { MediaPreview } from "@/components/media-preview";

export function MediaUploader() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File, type: "image" | "video") => {
    if (type === "image") {
      setImageFile(file);
    } else if (type === "video") {
      setVideoFile(file);
    }
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!imageFile && !videoFile) return;

    setUploading(true);
    setError(null);

    try {
      setAnalyzing(true);
      const formData = new FormData();
      let response_image = null;
      let response_video = null;

      // Call the image API if it's an image
      if (imageFile) {
        formData.append("file", imageFile);
        formData.append("type", "image");

        response_image = await fetch("http://localhost:8000/predict", {
          method: "POST",
          body: formData,
        });

        if (!response_image.ok) {
          throw new Error("Image analysis failed");
        }
      }

      // Call the video API if it's a video
      if (videoFile) {
        formData.append("file", videoFile);
        formData.append("type", "video");

        response_video = await fetch("http://localhost:8000/analyze_video", {
          method: "POST",
          body: formData,
        });

        if (!response_video.ok) {
          throw new Error("Video analysis failed");
        }
      }

      // Wait for both responses to be processed (if applicable)
      const imageText = response_image ? await response_image.text() : null;
      const videoText = response_video ? await response_video.text() : null;

      // Ensure both responses are received before calling the chat API
      if (imageText || videoText) {
        // Send the responses to the chatbot API if either image or video is available
        const response = await fetch("http://localhost:8000/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Analyze the provided responses to determine if the child is autistic:",
            image: imageText,
            video: videoText,
          }),
        });

        const data = await response.json();
        setResults(data);
      } else {
        alert("Please upload either an image or a video file for analysis.");
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
    setPreview(null);
    setUploading(false);
    setAnalyzing(false);
    setResults(null);
    setError(null);
  };

  const isReadyForAnalysis = imageFile && videoFile;

  return (
    <div className="flex items-center justify-center space-x-6">
      {/* Image upload box */}
      <UploadBox
        title="Analyze Image"
        icon={<ImageIcon className="h-8 w-8" />}
        acceptTypes="image/*"
        onFileSelected={(file) => handleFile(file, "image")}
        glowColor="#8b5cf6"
      />

      {/* Video upload box */}
      <UploadBox
        title="Analyze Video"
        icon={<ImageIcon className="h-8 w-8" />}
        acceptTypes="video/*"
        onFileSelected={(file) => handleFile(file, "video")}
        glowColor="#8b5cf6"
      />

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
    </div>
  );
}
