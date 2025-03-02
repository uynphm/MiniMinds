"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/UploadPage");
  };

  return (
    <div className="w-full dark:bg-black-200 bg-purple dark:bg-grid-white/[0.05] bg-grid-black/[0.2] flex items-center justify-center absolute top-0 left-0">
      <div className="relative z-10 text-center items-center flex justify-center">
        {/* Welcome Message */}
        <h1 className="font-mono text-6xl font-bold text-black mb-8">
          Welcome to the Home Page!
        </h1>

        {/* Start Detection Button */}
        <button
          onClick={handleNavigate}
          className="bg-blue-600 text-white text-xl font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
        >
          Start Detection
        </button>
      </div>
    </div>
  );
}