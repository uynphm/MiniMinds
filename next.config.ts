import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Moved from experimental section
  serverExternalPackages: ["sharp"], // <-- This is the corrected key
  
  experimental: {
    // Keep other experimental flags here
    optimizeCss: false,
    webpackBuildWorker: false,
    reactCompiler: true
  },

  webpack: (config) => {
    config.cache = false;
    config.parallelism = 1;
    return config;
  }
};

export default nextConfig;