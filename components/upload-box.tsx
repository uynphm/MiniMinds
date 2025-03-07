"use client";

import type React from "react";
import { useState, useRef } from "react";
import { cn } from "@/lib/cn";

interface UploadBoxProps {
  title: string;
  icon: React.ReactNode;
  acceptTypes: string;
  onFileSelected: (file: File) => void;
  glowColor: string;
}

export function UploadBox({ title, icon, acceptTypes, onFileSelected, glowColor }: UploadBoxProps) {
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
      {/* Dark blue background for the box */}
      <div
        className={cn(
          "absolute inset-0 bg-blue-950 transition-all duration-500 ease-in-out",
          isHovering ? "opacity-0" : "opacity-100",
        )}
      />

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

      {/* Shadow overlay (slightly visible by default) */}
      <div
        className={cn(
          "absolute inset-0 bg-black/30 transition-opacity duration-500 ease-in-out",
          isHovering ? "opacity-0" : "opacity-100",
        )}
      />

      <div
        className={cn(
          "relative h-full w-full flex flex-col items-center justify-center rounded-lg border border-blue-800/50 transition-all duration-500",
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
            "text-xl font-bold mb-4 transition-colors duration-500", // Smaller text (text-xl)
            isHovering ? "text-blue-600" : "text-white",
          )}
        >
          {title}
        </h2>

        {/* Upload area (white by default, dark blue on hover) */}
        <div
          className={cn(
            "w-20 h-20 flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-500", // Smaller upload area (w-20 h-20)

            isDragging || isHovering ? "border-blue-500 text-blue-600" : "border-blue-800/50 text-white",
          )}
        >
          {icon}
          <span
            className={cn(
              "mt-2 text-sm font-medium transition-colors duration-500", // Smaller text (text-sm)
              isHovering ? "text-blue-600" : "text-white",
            )}
          >
            Upload File
          </span>
        </div>

        <input ref={fileInputRef} type="file" accept={acceptTypes} className="hidden" onChange={handleFileInput} />
      </div>
    </div>
  );
}