import React, { useRef, useState } from "react";
import { useUpload } from "../hooks/useUpload";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Label } from "./ui/label";

interface UploadFormProps {
  onUploadComplete: (videoId: string) => void;
}

export default function UploadForm({ onUploadComplete }: UploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const mutation = useUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStatus("uploading");
      setProgress(10);
      mutation.mutate(file, {
        onSuccess: (data) => {
          setProgress(100);
          setStatus("done");
          onUploadComplete(data.videoId); // Only pass videoId
        },
        onError: () => {
          setStatus("error");
          setProgress(0);
        },
      });
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 border rounded-lg bg-white shadow">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (fileInputRef.current?.files?.[0]) {
            mutation.mutate(fileInputRef.current.files[0]);
          }
        }}
      >
        <Label htmlFor="upload" className="block mb-2">
          Upload MP4 Lecture Video
        </Label>
        <Input
          id="upload"
          type="file"
          accept="video/mp4"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={mutation.isPending}
        />
        <Button type="submit" className="mt-4" disabled={mutation.isPending}>
          {mutation.isPending ? "Uploading..." : "Upload"}
        </Button>
      </form>
      <div className="mt-4">
        <Progress value={progress} max={100} />
        <div className="mt-2 text-sm">
          {status === "idle" && "Waiting for upload..."}
          {status === "uploading" && "Uploading video..."}
          {status === "done" && (
            <div className="text-green-600">
              Upload complete!
            </div>
          )}
          {status === "error" && "An error occurred. Please try again."}
        </div>
      </div>
    </div>
  );
}