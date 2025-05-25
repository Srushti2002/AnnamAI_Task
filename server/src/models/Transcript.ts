import { Schema, model } from 'mongoose';

interface MCQ {
  question: string;
  options: string[];
  correct_answer: string;
}

export interface ITranscript extends Document {
  videoId: string;
  fullText: string;
  segments: Array<{
    start: number;
    end: number;
    text: string;
  }>;
  mcqs?: MCQ[];
}

const transcriptSchema = new Schema({
  videoId: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
  fullText: { type: String, required: true },
  segments: [{
    start: { type: Number, required: true },
    end: { type: Number, required: true },
    text: { type: String, required: true }
  }],
  mcqs: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correct_answer: { type: String, required: true }
  }]
});

export const Transcript = model<ITranscript>('Transcript', transcriptSchema);
