import { useState } from "react";
import UploadForm from "../components/UploadForm";
import GetTranscript from "../components/getTranscript";
import GetMCQs from "../components/getMCQs";

export default function Home() {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [showMCQs, setShowMCQs] = useState(false);

  const handleUploadComplete = (id: string) => {
    setVideoId(id);
    setShowMCQs(false); // Reset MCQs when a new video is uploaded
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Lecture Video MCQ Generator</h1>
      <UploadForm onUploadComplete={handleUploadComplete} />
      {videoId && (
        <>
          <GetTranscript videoId={videoId} onLoaded={() => setShowMCQs(true)} />
          {showMCQs && <GetMCQs videoId={videoId} />}
        </>
      )}
    </div>
  );
}