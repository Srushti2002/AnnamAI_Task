# main.py
from fastapi import FastAPI, UploadFile, File, HTTPException
import shutil
import uuid
import os
from app.transcribe import transcribe_audio
from app.mcq_generator import MCQGenerator
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests.exceptions

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mcq_generator = MCQGenerator(model_name="gemma:2b") 

class TranscriptRequest(BaseModel):
    text: str
    num_questions: int = 3

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    try:
        temp_filename = f"{uuid.uuid4()}_{file.filename}"
        temp_path = os.path.join(UPLOAD_DIR, temp_filename)

        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        transcript = transcribe_audio(temp_path)
        os.remove(temp_path)

        return {"transcript": transcript}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-mcqs")
async def generate_mcqs(request: dict):
    try:
        mcqs = mcq_generator.generate_mcqs(request["text"], num_questions=5)
        return {"mcqs": mcqs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))