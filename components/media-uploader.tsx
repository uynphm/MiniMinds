import React, { useState } from "react";
import { Film, ImageIcon } from "lucide-react";
import { UploadBox } from "@/components/upload-box";
import { MediaPreview } from "@/components/media-preview";

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

interface MediaUploaderProps {
  onFileUpload: (file: File) => void;
  onClear: () => void;
  results: PredictionResponse | null;
  error: string | null;
  uploading: boolean;
  analyzing: boolean;
}

export function MediaUploader({ onFileUpload, onClear, results, error, uploading, analyzing }: MediaUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);

  const handleFile = (file: File, type: "image" | "video") => {
    setFile(file);
    setFileType(type);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!file) return;
    onFileUpload(file);
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setFileType(null);
    onClear();
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