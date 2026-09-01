import sys
import os
import json
import pytest
from fastapi.testclient import TestClient

# Add backend directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from main import app
from audio import validate_audio_file
from fastapi import HTTPException, UploadFile
import io

client = TestClient(app)

SAMPLE_DIR = os.path.join(os.path.dirname(__file__), "..", "sample-data")

def load_sample_txt(filename: str) -> str:
    path = os.path.join(SAMPLE_DIR, filename)
    with open(path, "r", encoding="utf-8") as f:
        return f.read().strip()

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "service" in data

def test_audio_validation():
    # Test empty file
    dummy_file = UploadFile(filename="empty.wav", file=io.BytesIO(b""))
    with pytest.raises(HTTPException) as exc_info:
        validate_audio_file(dummy_file, b"")
    assert exc_info.value.status_code == 400

    # Test valid small audio bytes
    dummy_file_valid = UploadFile(filename="test.webm", file=io.BytesIO(b"RIFF....WAVE"))
    assert validate_audio_file(dummy_file_valid, b"RIFF....WAVE") is True

def test_voice_to_notes_upload():
    dummy_audio = b"RIFF1234WAVEfmt " + b"\x00" * 100
    files = {"file": ("test_recording.webm", dummy_audio, "audio/webm")}
    res = client.post("/api/voice-to-notes", files=files, data={"note_style": "standard"})
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert len(data["transcript"]) > 0
    notes = data["notes"]
    assert len(notes["title"]) > 0
    assert len(notes["summary"]) > 0
    assert isinstance(notes["tasks"], list)

def test_notes_from_transcript_editing():
    sample_text = load_sample_txt("voice-recording.txt")
    res = client.post("/api/notes-from-transcript", json={
        "transcript": sample_text,
        "note_style": "standard"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    notes = data["notes"]
    
    # Check task extraction & assignees
    tasks = notes["tasks"]
    assert len(tasks) >= 1
    task_names = [t["task"].lower() for t in tasks]
    assert any("authentication" in tn or "api" in tn for tn in task_names)

def test_empty_transcript_validation():
    res = client.post("/api/notes-from-transcript", json={
        "transcript": "   ",
        "note_style": "standard"
    })
    assert res.status_code == 400

if __name__ == "__main__":
    print("Running Day 25 Voice-to-Notes AI Test Suite...")
    test_health_endpoint()
    print("[PASSED] test_health_endpoint")
    test_audio_validation()
    print("[PASSED] test_audio_validation")
    test_voice_to_notes_upload()
    print("[PASSED] test_voice_to_notes_upload")
    test_notes_from_transcript_editing()
    print("[PASSED] test_notes_from_transcript_editing")
    test_empty_transcript_validation()
    print("[PASSED] test_empty_transcript_validation")
    print("ALL DAY 25 VOICE-TO-NOTES AI TESTS PASSED SUCCESSFULLY!")
