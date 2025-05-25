from typing import List, Dict
import requests
import json
from math import ceil

class MCQGenerator:
    def __init__(self, model_name: str = "gemma:2b", chunk_size: int = 500):
        """
        Initialize MCQ generator
        Args:
            model_name: Model to use for generation
            chunk_size: Maximum characters per chunk for processing
        """
        self.model_name = model_name
        self.chunk_size = chunk_size
        self.api_url = "http://localhost:11434/api/generate"

    def _split_transcript(self, transcript: str) -> List[str]:
        """Split transcript into chunks at sentence boundaries"""
        words = transcript.split()
        chunks = []
        current_chunk = []
        current_length = 0

        for word in words:
            word_length = len(word) + 1  # +1 for space
            if current_length + word_length > self.chunk_size and current_chunk:
                # Join current chunk and add to chunks list
                chunks.append(' '.join(current_chunk))
                current_chunk = [word]
                current_length = word_length
            else:
                current_chunk.append(word)
                current_length += word_length

        # Add the last chunk if it exists
        if current_chunk:
            chunks.append(' '.join(current_chunk))

        return chunks

    def _generate_with_ollama(self, prompt: str) -> str:
        """Generate text using Ollama API"""
        payload = {
            "model": self.model_name,
            "prompt": prompt,
            "stream": False
        }
        
        response = requests.post(self.api_url, json=payload)
        if response.status_code == 200:
            return response.json()["response"]
        else:
            raise Exception(f"Ollama API error: {response.text}")

    def generate_mcqs(self, transcript: str, num_questions: int = 3) -> List[Dict]:
        """Generate MCQs from transcript text"""
        # Split transcript into manageable chunks
        chunks = self._split_transcript(transcript)
        questions_per_chunk = ceil(num_questions / len(chunks))
        all_questions = []

        for i, chunk in enumerate(chunks):
            print(f"Processing chunk {i+1}/{len(chunks)}")
            chunk_questions = self._generate_chunk_mcqs(chunk, questions_per_chunk)
            all_questions.extend(chunk_questions)

        # Ensure we don't exceed the requested number of questions
        return all_questions[:num_questions]

    def _generate_chunk_mcqs(self, chunk: str, num_questions: int) -> List[Dict]:
        """Generate MCQs for a single chunk of text"""
        prompt = f"""Generate {num_questions} multiple choice questions from this text.
        Format each question exactly as shown:

        Q1. [Clear, specific question]
        A) [Correct answer]
        B) [Plausible wrong answer]
        C) [Plausible wrong answer]
        D) [Plausible wrong answer]
        Correct: A

        Text: {chunk}

        Important:
        - Questions should test understanding
        - All options must be plausible
        - Make options distinct and clear
        - Only one answer should be correct
        - Questions should be relevant to this specific text chunk
        """

        try:
            result = self._generate_with_ollama(prompt)
            return self._parse_response(result, num_questions)
        except Exception as e:
            print(f"Error generating MCQs for chunk: {str(e)}")
            return []

    def _parse_response(self, result: str, num_questions: int) -> List[Dict]:
        """Parse the generated response into structured MCQ format"""
        questions = []
        current_question = {}
        
        for line in result.split('\n'):
            line = line.strip()
            if not line:
                continue
                
            if line.startswith('Q'):
                if current_question and self._is_valid_question(current_question):
                    questions.append(current_question)
                current_question = {
                    "question": line[line.find('.')+1:].strip(),
                    "options": [],
                    "correct_answer": ""
                }
            elif line.startswith(('A)', 'B)', 'C)', 'D)')):
                if current_question is not None:
                    current_question["options"].append(line)
            elif line.startswith('Correct:'):
                if current_question is not None:
                    correct_answer = line.split(':')[1].strip()
                    if correct_answer in ['A', 'B', 'C', 'D']:
                        current_question["correct_answer"] = correct_answer

        if current_question and self._is_valid_question(current_question):
            questions.append(current_question)

        return questions[:num_questions]

    def _is_valid_question(self, question: Dict) -> bool:
        """Validate the structure of a generated question"""
        return (len(question.get("options", [])) == 4 and 
                question.get("correct_answer") in ['A', 'B', 'C', 'D'] and 
                question.get("question"))