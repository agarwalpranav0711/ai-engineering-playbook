import time
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from models import TranscriptRequest, VoiceNotesResponse
from audio import validate_audio_file
from transcription import SpeechToTextEngine
from notes import VoiceNotesSynthesizer

app = FastAPI(
    title="Voice-to-Notes AI API",
    description="Speech-to-Text transcription and structured AI Voice Notes synthesis engine.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

stt_engine = SpeechToTextEngine()
notes_engine = VoiceNotesSynthesizer()

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "Voice-to-Notes AI API",
        "has_openrouter_key": bool(stt_engine.api_key),
        "model": notes_engine.model,
        "stt_model": stt_engine.model
    }

@app.post("/api/voice-to-notes", response_model=VoiceNotesResponse)
async def process_voice_recording(
    file: UploadFile = File(...),
    note_style: Optional[str] = Form("standard")
):
    """Processes uploaded audio file: Validates -> Transcribes -> Synthesizes VoiceNotes."""
    start_time = time.time()
    try:
        contents = await file.read()
        validate_audio_file(file, contents)

        # 1. Speech-to-Text
        transcript = stt_engine.transcribe(contents, file.filename or "recording.webm")
        
        # 2. LLM Note Synthesis
        notes = notes_engine.generate_notes(transcript, note_style or "standard")
        
        duration = round(time.time() - start_time, 2)
        return VoiceNotesResponse(
            success=True,
            transcript=transcript,
            notes=notes,
            processing_time_sec=duration
        )

    except HTTPException as he:
        duration = round(time.time() - start_time, 2)
        raise he
    except Exception as e:
        duration = round(time.time() - start_time, 2)
        return VoiceNotesResponse(
            success=False,
            transcript="",
            error=str(e),
            processing_time_sec=duration
        )

@app.post("/api/notes-from-transcript", response_model=VoiceNotesResponse)
async def process_text_transcript(req: TranscriptRequest):
    """Synthesizes structured VoiceNotes directly from user-provided or edited text transcript."""
    if not req.transcript or not req.transcript.strip():
        raise HTTPException(status_code=400, detail="Transcript text cannot be empty.")

    start_time = time.time()
    try:
        notes = notes_engine.generate_notes(req.transcript, req.note_style or "standard")
        duration = round(time.time() - start_time, 2)
        return VoiceNotesResponse(
            success=True,
            transcript=req.transcript,
            notes=notes,
            processing_time_sec=duration
        )
    except Exception as e:
        duration = round(time.time() - start_time, 2)
        return VoiceNotesResponse(
            success=False,
            transcript=req.transcript,
            error=str(e),
            processing_time_sec=duration
        )
