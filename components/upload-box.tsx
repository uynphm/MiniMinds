"use client"; 

import type React from "react";
import { useState, useRef } from "react";
import { cn } from "../lib/cn";

interface UploadBoxProps {
  title: string;
  icon: React.ReactNode;
  acceptTypes: string;
  onFileSelected: (file: File) => void;
  glowColor: string;
  preview?: string | null;
}

export function UploadBox({ 
  title, 
  icon, 
  acceptTypes, 
  onFileSelected, 
  glowColor, 
  preview = null,
}: UploadBoxProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
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
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div
      className="relative w-80 h-80 rounded-lg overflow-hidden" 
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* If we have a preview, show it as a background */}
      {preview && (
        <div className="absolute inset-0 z-0">
          {acceptTypes.includes('image') ? (
            <img 
              src={preview} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <video 
              src={preview} 
              className="w-full h-full object-cover" 
              autoPlay={isHovering}
              muted 
              loop
            />
          )}
        </div>
      )}

      {/* Dark blue background for the box (only if no preview) */}
      {!preview && (
        <div
          className={cn(
            "absolute inset-0 bg-blue-950 transition-all duration-500 ease-in-out",
            isHovering ? "opacity-0" : "opacity-100",
          )}
        />
      )}

      {/* Soft glow around the box */}
      <div
        className={cn(
          "absolute inset-0 rounded-lg border border-blue-800/50 transition-all duration-500 ease-in-out",
          isHovering ? "opacity-0" : "opacity-100",
        )}
        style={{
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
        }}
      />

      {/* Lightning effect */}
      <div
        className={cn(
          "absolute -top-20 left-0 right-0 h-20 w-full transition-all duration-500 ease-in-out",
          isHovering ? "opacity-100" : "opacity-0",
        )}
        style={{
          background: `linear-gradient(to bottom, white 0%, ${glowColor} 100%)`,
          clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
        }}
      />

      {/* Shadow overlay (more visible with preview) */}
      <div
        className={cn(
          "absolute inset-0 bg-black transition-opacity duration-500 ease-in-out z-10",
          preview ? (isHovering ? "opacity-30" : "opacity-50") : (isHovering ? "opacity-0" : "opacity-30")
        )}
      />

      <div
        className={cn(
          "relative h-full w-full flex flex-col items-center justify-center rounded-lg border transition-all duration-500 z-20",
          isDragging ? "border-blue-500 bg-blue-500/10" : "border-blue-800/50",
          "cursor-pointer",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {/* Title (white by default, dark blue on hover) */}
        <h2
          className={cn(
            "text-xl font-bold mb-4 transition-colors duration-500 z-20", 
            isHovering ? "text-blue-600" : "text-white",
            preview ? "bg-black/50 px-3 py-1 rounded" : ""
          )}
        >
          {title}
        </h2>

        {/* Only show upload area if no preview */}
        {!preview && (
          <div
            className={cn(
              "w-20 h-20 flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-500",
              isDragging || isHovering ? "border-blue-500 text-blue-600" : "border-blue-800/50 text-white",
            )}
          >
            {icon}
            <span
              className={cn(
                "mt-2 text-sm font-medium transition-colors duration-500",
                isHovering ? "text-blue-600" : "text-white",
              )}
            >
              Upload File
            </span>
          </div>
        )}

        {/* When preview exists, show a change button on hover */}
        {preview && isHovering && (
          <div className="absolute bottom-4 bg-white/90 text-blue-800 py-1 px-3 rounded-full shadow-lg z-30">
            Click to change
          </div>
        )}

        <input ref={fileInputRef} type="file" accept={acceptTypes} className="hidden" onChange={handleFileInput} />
      </div>
    </div>
  );
}