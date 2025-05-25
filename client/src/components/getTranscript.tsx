import { useEffect, useState } from "react";

export default function GetTranscript({ videoId, onLoaded }: { videoId: string; onLoaded?: () => void }) {
  const [transcript, setTranscript] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let pollTimeout: ReturnType<typeof setTimeout>;

    async function fetchTranscript() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/upload/${videoId}/results`);
        if (!response.ok) throw new Error("Failed to fetch transcript");
        const data = await response.json();

        if (data.status !== "completed") {
          pollTimeout = setTimeout(fetchTranscript, 2000);
          return;
        }

        if (isMounted) {
          setTranscript(data.transcript);
          setLoading(false);
          if (onLoaded) onLoaded();
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Unknown error");
          setLoading(false);
        }
      }
    }

    fetchTranscript();

    return () => {
      isMounted = false;
      if (pollTimeout) clearTimeout(pollTimeout);
    };
  }, [videoId, onLoaded]);

  if (loading) return <div className="text-center mt-8">Loading transcript...</div>;
  if (error) return <div className="text-center text-red-600 mt-8">{error}</div>;
  if (!transcript?.segments?.length) return <div className="text-center mt-8">No transcript found.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Transcript</h2>
      {transcript.segments.map((seg: any, idx: number) => (
        <div key={idx} className="mb-4 p-2 border rounded">
          <div>{seg.text}</div>
        </div>
      ))}
    </div>
  );
}