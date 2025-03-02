"use client";

import { useState } from "react";
import { ImageIcon, Film } from "lucide-react";
import { UploadBox } from "@/components/upload-box";
import { MediaPreview } from "@/components/media-preview";

export function MediaUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<string | null>(null);

  const handleFile = (file: File, type: "image" | "video") => {
    setFile(file);
    setFileType(type);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setUploading(false);
    setAnalyzing(true);

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Placeholder for AI analysis results
    setResults("AI analysis complete. Here are the insights: ...");

    setAnalyzing(false);
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setFileType(null);
    setUploading(false);
    setAnalyzing(false);
    setResults(null);
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
        onUpload={handleUpload}
        onClear={handleClear}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UploadBox
        title="Analyze Video"
        icon={<Film className="h-12 w-12 " />}
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