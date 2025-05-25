# AnnamAI

AnnamAI is a full-stack application that allows users to upload lecture videos (MP4), automatically generates a transcript and multiple-choice questions (MCQs) using AI, and displays them in a user-friendly interface.

---

## Features

- Upload lecture videos (MP4 format)
- Automatic transcript generation using AI models
- Automatic MCQ generation from the transcript
- View transcript and MCQs in the web interface

---

## Project Structure

```
AnnamAI/
├── aiService/           # Python FastAPI backend for AI processing
│   ├── main.py
│   ├── requirements.txt
│   └── ... 
├── client/              # React frontend
│   ├── src/
│   ├── package.json
│   └── ...
├── server/              # Node.js/Express backend for file uploads
│   ├── index.js
│   ├── package.json
│   └── ...
├── README.md
└── .gitignore
```

---

## Prerequisites

- Python 3.9+
- Node.js 18+
- npm or yarn

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/AnnamAI.git
cd AnnamAI
```

---

### 2. Install and Run the AI Service (FastAPI)

```bash
cd aiService
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

### 3. Install and Run the Server (Node.js/Express)

```bash
cd ../server
npm install
npm run dev   # or: node index.js
```

---

### 4. Install and Run the Client (React)

```bash
cd ../client
npm install
npm start
```

---

## Usage

1. Open your browser and go to [http://localhost:3000](http://localhost:3000)
2. Upload an MP4 lecture video.
3. Wait for processing (transcript and MCQs will appear automatically).
4. View the transcript and MCQs on the page.

---

## Configuration

- The client expects the backend server at `http://localhost:5000` and the AI service at `http://localhost:8000`. Adjust proxy or API URLs as needed in your codebase.

---

## Troubleshooting

- Ensure all three services (AI, server, client) are running.
- If you encounter CORS issues, check your backend CORS settings.
- For Python dependency issues, ensure you are using the correct Python version and a clean virtual environment.

---

## License

MIT License

---

## Credits

- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://react.dev/)
- [Transformers](https://huggingface.co/docs/transformers/index)
- [PyTorch](https://pytorch.org/)
