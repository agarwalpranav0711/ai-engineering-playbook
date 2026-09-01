# 🚀 Day 25 — Voice-to-Notes AI

Transform spoken voice recordings into **structured, actionable AI Notes** through browser microphone recording (`MediaRecorder` API), Audio File Uploads, Speech-to-Text (STT) transcription, Pydantic schema validation, and interactive transcript editing.

---

## 🎯 Architecture Overview

```
                         VOICE-TO-NOTES AI
                                │
               ┌────────────────┴────────────────┐
               ↓                                 ↓
      BROWSER MICROPHONE                 AUDIO FILE UPLOAD
    (MediaRecorder API)               (.webm, .wav, .mp3)
               │                                 │
               └────────────────┬────────────────┘
                                │
                                ▼
                       FASTAPI BACKEND API
                                │
                                ▼
                      SPEECH-TO-TEXT (STT)
                   (OpenRouter Transcription)
                                │
                                ▼
                         RAW TRANSCRIPT
                                │
                                ▼
                       LLM NOTE EXTRACTOR
                    (Structured Pydantic Model)
                                │
                                ▼
                      STRUCTURED VOICE NOTES
      (Title, Summary, Key Points, Tasks Table, Deadlines, People, Export MD)
```

---

## 🧱 Tech Stack & Frameworks

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite + Tailwind CSS v4 + Lucide Icons | Responsive UI with browser microphone recorder (`getUserMedia`), timer (`00:15`), `<audio controls>` player, transcript editor, and markdown export |
| **Backend API** | Python 3.11 + FastAPI + Uvicorn | RESTful API server handling audio upload validation (`/api/voice-to-notes`), STT transcription, and structured note synthesis |
| **Data Schemas** | Pydantic v2 (`models.py`) | Strict models (`Task`, `VoiceNotes`, `TranscriptRequest`, `VoiceNotesResponse`) |
| **STT & Notes Engine** | `transcription.py`, `notes.py`, `audio.py` | Audio file validator, OpenRouter STT integration, and prompt-engineered note synthesizer with offline heuristic fallback |
| **Testing** | `pytest` / Python Runner (`tests/test_voice_notes.py`) | Automated test suite verifying audio validation, STT engine, note extraction, anti-hallucination compliance, and API routes |

---

## 🔬 Core Capabilities

1. **Browser Microphone Recording**: Captures live audio streams via `navigator.mediaDevices.getUserMedia` and `MediaRecorder` API with timer display (`00:15`).
2. **Audio Preview Player**: Native `<audio controls>` player allows users to listen to their voice recording before processing.
3. **Speech-to-Text Transcription**: Converts audio files (`.webm`, `.wav`, `.mp3`) into clean text transcripts.
4. **Editable Transcript**: Allows reviewing and editing transcribed text before regenerating AI Notes.
5. **Structured Voice Notes**: Extracts Title, Executive Summary, Key Points, Action Items Checklist (with Assignees & Deadlines), Decisions, Deadlines, People, and Open Questions.
6. **Anti-Hallucination Rules**: Unstated deadlines or assignees default to `'Not specified'` or `'Unassigned'` rather than being invented.
7. **Markdown Export**: 1-click download of synthesized voice notes as `.md` files.

---

## 🧪 Experiments & Verification Results

| Test Case / Experiment | Input Audio / Text | Expected Behavior | Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **1. Task Voice Note** | "Tomorrow I need to finish authentication..." | Extract task (authentication), deadline (Tomorrow), follow-up (Rahul) | Tasks & deadlines extracted | ✅ PASSED |
| **2. Hinglish Note** | "Kal mujhe authentication complete karni hai..." | Preserve Hinglish meaning and extract English tasks | Hinglish meaning preserved | ✅ PASSED |
| **3. Technical Meeting** | "Completed Day 24 Research Assistant..." | Extract framework terms (FastAPI, MediaRecorder, Pydantic) | Technical vocabulary captured | ✅ PASSED |
| **4. Unassigned Task** | "Someone should test the API soon" | Set `assignee`: `"Unassigned"`, `deadline`: `"Not specified"` | Anti-hallucination enforced | ✅ PASSED |
| **5. Transcript Editing** | User edits transcript text in UI | Click **Regenerate Notes** to re-synthesize notes from edit | Notes re-synthesized | ✅ PASSED |

---

## 🚀 How to Run

### 1. Backend Setup (FastAPI)
```bash
cd day-25/backend
python -m venv venv
# On Windows:
venv\Scripts\activate
pip install -r requirements.txt

# (Optional) Copy .env.example and set your OpenRouter API key
cp .env.example .env

# Run FastAPI server
python -m uvicorn main:app --reload --port 8000
```
Backend API docs: `http://localhost:8000/docs`

### 2. Frontend Setup (React + Vite)
```bash
cd day-25/frontend
npm install
npm run dev
```
Open browser at: `http://localhost:3000`

### 3. Run Automated Voice-to-Notes Tests
```bash
cd day-25
python tests/test_voice_notes.py
```

---

## 💡 Key Learnings from Day 25

- **Speech-to-Text vs Language Understanding**: Speech recognition converts sound to text (STT), while language models extract structured meaning and action items from text (LLM).
- **Browser MediaRecorder API**: Managing media streams (`getUserMedia`), recording states (`start`, `stop`), and assembling binary audio chunks into Blobs.
- **Factual Grounding Guardrails**: Enforcing strict rules against inventing deadlines, assignees, or decisions ensures voice notes remain accurate and trustworthy.
