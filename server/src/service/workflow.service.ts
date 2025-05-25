import { Video } from '../models/Video';
import { Transcript } from '../models/Transcript';
import { generateTranscript } from '../service/transcript.service';
import { generateMCQs } from '../service/mcq.service';

export async function processVideo(videoId: string): Promise<void> {
  try {
    console.log(`[Workflow] Starting processing for video: ${videoId}`);
    
    await Video.findByIdAndUpdate(videoId, { status: 'processing' });
    
    const video = await Video.findById(videoId);
    if (!video) {
      throw new Error(`Video not found: ${videoId}`);
    }
    
    console.log(`[Workflow] Generating transcript for video: ${videoId}`);
    const transcriptResult = await generateTranscript(video);
    
    console.log(`[Workflow] Saving transcript for video: ${videoId}`);
    const transcript = await Transcript.create({
      videoId: video._id,
      fullText: transcriptResult.fullText,
      segments: transcriptResult.segments
    });
    
    console.log(`[Workflow] Generating MCQs for transcript: ${transcript._id}`);
    if (!transcript.fullText) {
      throw new Error('No transcript text available for MCQ generation');
    }
    
    const mcqs = await generateMCQs(transcript.fullText);
    console.log(`[Workflow] Generated ${mcqs.length} MCQs`);

    // Update transcript with MCQs
    const updatedTranscript = await Transcript.findByIdAndUpdate(
      transcript._id,
      { mcqs: mcqs },
      { new: true } // Return updated document
    );

    if (!updatedTranscript) {
      throw new Error('Failed to update transcript with MCQs');
    }

    console.log(`[Workflow] Successfully saved MCQs to transcript: ${transcript._id}`);
    
    await Video.findByIdAndUpdate(videoId, { status: 'completed' });
    console.log(`[Workflow] Processing completed for video: ${videoId}`);

  } catch (error) {
    console.error('[Workflow] Error during processing:', error);
    await Video.findByIdAndUpdate(videoId, { status: 'error' });
    throw error;
  }
}