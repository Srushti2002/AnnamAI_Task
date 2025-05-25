// import { Schema, model } from 'mongoose';

// const mcqSchema = new Schema({
//   videoId: { type: Schema.Types.ObjectId, ref: 'Video' },
//   transcriptId: { type: Schema.Types.ObjectId, ref: 'Transcript' },
//   segmentIndex: Number,
//   question: String,
//   options: [String],
//   correctAnswer: String,
// });

// export const MCQ = model('MCQ', mcqSchema);

import { Schema, model, Document } from 'mongoose';

interface MCQ {
  question: string;
  options: string[];
  answer: string;
}

export interface ITranscript extends Document {
  videoId: string;
  fullText: string;
  segments: Array<{
    text: string;
    start: number;
    end: number;
  }>;
  mcqs?: MCQ[];
}

const transcriptSchema = new Schema({
  videoId: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
  fullText: { type: String, required: true },
  segments: [{
    text: { type: String, required: true },
    start: { type: Number, required: true },
    end: { type: Number, required: true }
  }],
  mcqs: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    answer: { type: String, required: true }
  }]
});

export const Transcript = model<ITranscript>('Transcript', transcriptSchema);