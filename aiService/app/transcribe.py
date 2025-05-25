# transcribe.py
from faster_whisper import WhisperModel

# Load model once globally
model = WhisperModel("base", compute_type="int8")  # Can use "small", "medium", etc.

def transcribe_audio(audio_path: str) -> str:
    segments, _ = model.transcribe(audio_path)
    transcript = " ".join(segment.text for segment in segments)
    return transcript
