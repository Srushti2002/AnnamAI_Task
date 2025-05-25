import { useMutation } from "@tanstack/react-query";

interface UploadResponse {
  videoId: string;
}

export function useUpload() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return { videoId: data.videoId } as UploadResponse;
    },
  });
}