import axios from 'axios';

interface MCQ {
  question: string;
  options: string[];
  answer: string;
}

export async function generateMCQs(text: string): Promise<MCQ[]> {
  try {
    console.log('[MCQ] Generating MCQs from transcript');
    
    const response = await axios.post(
      "http://localhost:8000/generate-mcqs",
      { text },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data || !Array.isArray(response.data.mcqs)) {
      throw new Error("Invalid MCQ response from FastAPI service");
    }

    return response.data.mcqs;
  } catch (error) {
    console.error('[MCQ] Error generating MCQs:', error);
    throw error;
  }
}