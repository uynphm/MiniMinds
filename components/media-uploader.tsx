"use client";

import { useState } from "react";
import { ImageIcon, Film } from "lucide-react";
import { UploadBox } from "@/components/upload-box";
import { MediaPreview } from "@/components/media-preview";

interface ModelPrediction {
  label: string; // Changed from 'model' to 'label' to match TypeScript interface
  class: string;
  confidence: number;
}

interface PredictionResponse {
  filename: string;
  predictions: ModelPrediction[];
}

export function MediaUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File, type: "image" | "video") => {
    setFile(file);
    setFileType(type);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!file) return;

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

      // Read and parse JSON safely
      const rawText = await response.text();
      console.log("Raw API response:", rawText);

      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch (parseError) {
        throw new Error(`Invalid JSON response: ${rawText}`);
      }

      console.log("Parsed API response:", data);

      // Validate API response format
      if (!data || typeof data !== "object" || !data.filename || typeof data.predictions !== "object") {
        throw new Error("Invalid API response format");
      }

      // Convert predictions object to an array with 'label'
      const predictionsArray: ModelPrediction[] = Object.entries(data.predictions).map(([model, result]) => ({
        label: model, // Renaming 'model' to 'label'
        ...(result as { class: string; confidence: number }),
      }));

      setResults({ filename: data.filename, predictions: predictionsArray });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during analysis");
      console.error("Analysis error:", err);
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setFileType(null);
    setUploading(false);
    setAnalyzing(false);
    setResults(null);
    setError(null);
  };

  if (file && preview) {
    return (
      <MediaPreview
        file={file}
        preview={preview}
        fileType={fileType!}
        uploading={uploading}
        analyzing={analyzing}
        results={results}
        error={error}
        onUpload={handleUpload}
        onClear={handleClear}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UploadBox
        title="Analyze Video"
        icon={<Film className="h-12 w-12" />}
        acceptTypes="video/*"
        onFileSelected={(file) => handleFile(file, "video")}
        glowColor="#3b82f6"
      />

      <UploadBox
        title="Analyze Image"
        icon={<ImageIcon className="h-12 w-12" />}
        acceptTypes="image/*"
        onFileSelected={(file) => handleFile(file, "image")}
        glowColor="#8b5cf6"
      />
    </div>
  );
}
