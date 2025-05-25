import { useEffect, useState } from "react";

export default function GetMCQs({ videoId }: { videoId: string }) {
  const [mcqs, setMCQs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let pollTimeout: ReturnType<typeof setTimeout>;

    async function fetchMCQs() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/upload/${videoId}/results`);
        if (!response.ok) throw new Error("Failed to fetch MCQs");
        const data = await response.json();

        if (data.status !== "completed") {
          pollTimeout = setTimeout(fetchMCQs, 2000);
          return;
        }

        if (isMounted) {
          setMCQs(data.mcqs || []);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Unknown error");
          setLoading(false);
        }
      }
    }

    fetchMCQs();

    return () => {
      isMounted = false;
      if (pollTimeout) clearTimeout(pollTimeout);
    };
  }, [videoId]);

  if (loading) return <div className="text-center mt-8">Loading MCQs...</div>;
  if (error) return <div className="text-center text-red-600 mt-8">{error}</div>;
  if (!mcqs.length) return <div className="text-center mt-8">No MCQs found.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">MCQs</h2>
      {mcqs.map((mcq: any, idx: number) => (
        <div key={idx} className="p-4 border rounded">
          <div className="font-medium text-left">{mcq.question}</div>
          <ul className="list-none ml-0 pl-0">
            {mcq.options.map((opt: string, oIdx: number) => (
              <li key={oIdx} className="text-left">{opt}</li>
            ))}
          </ul>
          <div className="text-xs text-green-700 mt-1 text-left">
            Correct Answer: {mcq.correct_answer}
          </div>
        </div>
      ))}
    </div>
  );
}