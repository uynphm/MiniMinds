import { MediaUploader } from "@/components/media-uploader"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-24 bg-black">
      <div className="w-full max-w-6xl space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Autism Detection</h1>
        </div>
        <MediaUploader />
        <div id="results" className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Analysis Results</h2>
          <p className="text-gray-400">Upload a file to see AI-generated insights here.</p>
          {/* Results will be dynamically inserted here */}
        </div>
      </div>
    </main>
  )
}

