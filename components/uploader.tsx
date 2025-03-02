"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Upload, X, ImageIcon, Film, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/button";
import { Progress } from "@/components/progress";
import { cn } from "@/lib/cn";

export function Uploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Reset states
    setUploadComplete(false);
    setProgress(0);

    // Check if file is an image or video
    if (file.type.startsWith("image/")) {
      setFileType("image");
    } else if (file.type.startsWith("video/")) {
      setFileType("video");
    } else {
      alert("Please upload an image or video file");
      return;
    }

    setFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!file) return;

    setUploading(true);

    // Simulate upload progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 10;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setUploading(false);
        setUploadComplete(true);
      }
      setProgress(currentProgress);
    }, 200);
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setFileType(null);
    setUploading(false);
    setProgress(0);
    setUploadComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {!preview ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-12 transition-all duration-200 ease-in-out",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-muted-foreground/25 hover:border-primary/50",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-4 text-center cursor-pointer">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Drag & drop your file here</h3>
              <p className="text-sm text-muted-foreground">or click to browse your files</p>
              <p className="text-xs text-muted-foreground">Supports images and videos up to 50MB</p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background rounded-full"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>

          {fileType === "image" ? (
            <div className="aspect-video bg-black flex items-center justify-center">
              <img src={preview || "/placeholder.svg"} alt="Preview" className="max-h-full max-w-full object-contain" />
            </div>
          ) : (
            <div className="aspect-video bg-black">
              <video src={preview} controls className="w-full h-full" />
            </div>
          )}

          <div className="p-4 space-y-4">
            <div className="flex items-center space-x-2">
              {fileType === "image" ? (
                <ImageIcon className="h-5 w-5 text-blue-500" />
              ) : (
                <Film className="h-5 w-5 text-purple-500" />
              )}
              <span className="font-medium truncate">{file?.name}</span>
            </div>

            {/* Add a check to ensure `file` is defined before accessing its properties */}
            {file && <div className="text-sm text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>}

            {(uploading || uploadComplete) && <Progress value={progress} className="h-2" />}

            <div className="flex justify-end">
              <Button onClick={handleUpload} disabled={uploading || uploadComplete} className="w-full sm:w-auto">
                {uploadComplete ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Uploaded
                  </>
                ) : uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}