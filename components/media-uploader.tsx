"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { UploadBox } from "@/components/upload-box";
import { MediaPreview } from "@/components/media-preview";

export function MediaUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setFile(file);
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

      const data = await response.json();
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
    setFile(null);
    setPreview(null);
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
    <div className="flex items-center justify-center w-full"> {/* Center the UploadBox */}
      <UploadBox
        title="Analyze Image"
        icon={<ImageIcon className="h-8 w-8" />} // Smaller icon size (h-8 w-8)
        acceptTypes="image/*"
        onFileSelected={handleFile}
        glowColor="#8b5cf6"
      />
    </div>
  );
}