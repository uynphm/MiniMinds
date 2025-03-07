"use client";

import React from "react";
import Image from "next/image"; // Import Image from next/image

interface MediaPreviewProps {
  preview: string;
  uploading: boolean;
  analyzing: boolean;
  results: {
    filename: string;
    predictions: {
      label: string;
      confidence: number;
    }[];
  } | null;
  error: string | null;
  onUpload: () => void;
  onClear: () => void;
}

export function MediaPreview({
  preview,
  uploading,
  analyzing,
  results,
  error,
  onUpload,
  onClear,
}: MediaPreviewProps) {
  return (
    <div className="space-y-4">
      {/* Preview */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black/5">
        <Image
          src={preview}
          alt="Preview"
          layout="fill" // Ensures it fills the container with correct aspect ratio
          objectFit="contain" // Keeps the image within the container bounds
        />
      </div>

      {/* Status and Controls */}
      <div className="space-y-2">
        {error && <div className="text-red-500 text-sm">{error}</div>}

        {results && (
          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Analysis Results:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            onClick={onUpload}
            disabled={uploading || analyzing}
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : analyzing ? "Analyzing..." : "Start Analysis"}
          </button>

          <button
            onClick={onClear}
            className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
