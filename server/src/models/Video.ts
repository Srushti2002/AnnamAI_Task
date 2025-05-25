import { Schema, model, Document } from 'mongoose';

export interface IVideo extends Document {
  filename?: string;
  originalName?: string;
  uploadedAt: Date;
  duration?: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  _id: string;
}

const videoSchema = new Schema({
  filename: { type: String, required: false },
  originalName: { type: String, required: false },
  uploadedAt: { type: Date, default: Date.now },
  duration: { type: Number, required: false },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'error'], default: 'pending' }
});

export const Video = model<IVideo>('Video', videoSchema);