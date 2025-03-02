"use client"

import { X, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/button"
import { Progress } from "@/components/progress"

interface MediaPreviewProps {
  file: File | null
  preview: string | null
  fileType: "image" | "video"
  uploading: boolean
  analyzing: boolean
  results: string | null
  onUpload: () => void
  onClear: () => void
}

export function MediaPreview({
  file,
  preview,
  fileType,
  uploading,
  analyzing,
  results,
  onUpload,
  onClear,
}: MediaPreviewProps) {
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 rounded-full text-white"
          onClick={onClear}
        >
          <X className="h-4 w-4" />
        </Button>

        {fileType === "image" ? (
          <div className="aspect-video bg-black flex items-center justify-center">
            <img src={preview || "/placeholder.svg"} alt="Preview" className="max-h-full max-w-full object-contain" />
          </div>
        ) : (
          <div className="aspect-video bg-black">
            <video src={preview || ""} controls className="w-full h-full" />
          </div>
        )}
      </div>

      <div className="p-4 space-y-4 bg-gray-900">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-white truncate">{file?.name}</span>
        </div>

        <div className="text-sm text-gray-400">{file?.size ? (file.size / (1024 * 1024)).toFixed(2) : "0"} MB</div>

        {(uploading || analyzing) && (
          <Progress value={uploading ? 50 : analyzing ? 75 : 0} className="h-2 bg-gray-800" />
        )}

        <div className="flex justify-end">
          <Button
            onClick={onUpload}
            disabled={uploading || analyzing || !!results}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            {results ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Analysis Complete
              </>
            ) : analyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
              </>
            ) : uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
              </>
            ) : (
              "Analyze File"
            )}
          </Button>
        </div>

        {results && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Analysis Results:</h3>
            <p className="text-gray-300">{results}</p>
          </div>
        )}
      </div>
    </div>
  )
}

