import { Request, Response } from 'express';
import { Video } from '../models/Video';
import { processVideo } from '../service/workflow.service';
import { Transcript} from '../models/Transcript';
import { ITranscript } from '../models/MCQ';

export const uploadVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Processing upload request:', req.file?.originalname);
    
    const video = await Video.create({
      filename: req.file?.filename,
      originalName: req.file?.originalname,
      duration: req.body.duration || 0
    });

    console.log(`Video uploaded successfully: ${video._id}`);

    // Send response immediately
    res.status(201).json({ videoId: video._id });

    // Start processing in background
    processVideo(video._id)
      .catch(error => {
        console.error(`Background processing failed for video ${video._id}:`, error);
      });

  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
};

export const getVideoResults = async (req: Request, res: Response): Promise<void> => {
  try {
    const { videoId } = req.params;
    
    const video = await Video.findById(videoId);
    if (!video) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }

    const transcript = await Transcript.findOne({ videoId }) as ITranscript | null;
    if (!transcript) {
      res.status(200).json({
        status: video.status,
        videoId: video._id,
        transcript: null,
        mcqs: null
      });
      return;
    }

    res.status(200).json({
      status: video.status,
      videoId: video._id,
      transcript: {
        fullText: transcript.fullText,
        segments: transcript.segments,
      },
      mcqs: transcript.mcqs || []
    });

  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
};