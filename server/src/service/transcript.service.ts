import { IVideo } from '../models/Video';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import FormData from 'form-data';

interface TranscriptResult {
  fullText: string;
  segments: Array<{
    start: number;
    end: number;
    text: string;
  }>;
}

export async function generateTranscript(video: IVideo): Promise<TranscriptResult> {
  try {
    console.log(`[Transcript] Processing video: ${video._id}`);
    
    const filePath = path.join(__dirname, "../../uploads", video.filename || "");
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    const response = await axios.post(
      "http://localhost:8000/transcribe",
      form,
      {
        headers: form.getHeaders(),
      }
    );

    if (!response.data.transcript) {
      throw new Error("No transcript received from FastAPI service");
    }

    const fullText = response.data.transcript;
    const duration = video.duration || 300; // Default to 5 minutes if duration not set
    const words = fullText.split(" ");
    const wordsPerSegment = Math.ceil(words.length / Math.ceil(duration / 300));
    
    const segments = [];
    for (let i = 0; i < words.length; i += wordsPerSegment) {
      const start = Math.floor((i / words.length) * duration);
      const end = Math.min(start + 300, duration);
      segments.push({
        start,
        end,
        text: words.slice(i, i + wordsPerSegment).join(" "),
      });
    }

    return { fullText, segments };
  } catch (error) {
    console.error('[Transcript] Error generating transcript:', error);
    throw error;
  }
}