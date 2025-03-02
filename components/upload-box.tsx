"use client"

import type React from "react"

import { useState, useRef } from "react"
import { cn } from "@/lib/cn"

interface UploadBoxProps {
  title: string
  icon: React.ReactNode
  acceptTypes: string
  onFileSelected: (file: File) => void
  glowColor: string
}

export function UploadBox({ title, icon, acceptTypes, onFileSelected, glowColor }: UploadBoxProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelected(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0])
    }
  }

  return (
    <div
      className="relative aspect-square rounded-lg overflow-hidden bg-gray-200"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Lightning effect */}
      <div
        className={cn(
          "absolute inset-0 w-full opacity-0 transition-opacity duration-300 ease-in-out",
          isHovering ? "opacity-60" : "opacity-0",
        )}
        style={{
          background: `linear-gradient(to bottom, ${glowColor} 0%, transparent 100%)`,
          clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
        }}
      />

      <div
        className={cn(
          "relative h-full w-full flex flex-col items-center justify-center rounded-lg border border-gray-700 transition-all duration-300",
          isDragging ? "border-blue-500 bg-blue-500/10" : "border-gray-700",
          "cursor-pointer",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <h2 className="text-2xl font-bold text-white mb-8">{title}</h2>

        <div
          className={cn(
            "w-32 h-32 flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-300",
            isDragging || isHovering ? "border-blue-500 text-blue-500" : "border-gray-700 text-gray-400",
          )}
        >
          {icon}
          <span className="mt-2 text-lg font-medium">Upload File</span>
        </div>

        <input ref={fileInputRef} type="file" accept={acceptTypes} className="hidden" onChange={handleFileInput} />
      </div>
    </div>
  )
}

