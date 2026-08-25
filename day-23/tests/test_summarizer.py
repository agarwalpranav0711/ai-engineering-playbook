import sys
import os
import pytest
from fastapi.testclient import TestClient

# Add backend directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from main import app

client = TestClient(app)

SAMPLE_DIR = os.path.join(os.path.dirname(__file__), "..", "sample-data")

def load_sample(filename: str) -> str:
    path = os.path.join(SAMPLE_DIR, filename)
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"

def test_project_meeting_summarization():
    transcript = load_sample("project-meeting.txt")
    res = client.post("/api/summarize", json={
        "transcript": transcript,
        "meeting_type": "project",
        "summary_length": "medium"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    summary = data["summary"]

    assert len(summary["title"]) > 0
    assert len(summary["executive_summary"]) > 0
    assert "Rahul" in summary["participants"]
    assert "Pranav" in summary["participants"]
    assert "Kriti" in summary["participants"]

    # Check action items
    assert len(summary["action_items"]) >= 1
    pranav_action = next((a for a in summary["action_items"] if "Pranav" in a["assignee"]), None)
    assert pranav_action is not None
    assert "Wednesday" in pranav_action["deadline"] or "Wednesday" in str(summary["action_items"])

def test_standup_meeting_summarization():
    transcript = load_sample("standup.txt")
    res = client.post("/api/summarize", json={
        "transcript": transcript,
        "meeting_type": "standup",
        "summary_length": "short"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["summary"]["title"] is not None

def test_long_transcript_map_reduce_strategy():
    base_text = load_sample("project-meeting.txt")
    long_transcript = (base_text + "\n\n") * 350 # Create > 3000 words transcript
    res = client.post("/api/summarize", json={
        "transcript": long_transcript,
        "meeting_type": "project",
        "summary_length": "detailed"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["strategy_used"] == "hierarchical_map_reduce"

def test_empty_transcript_validation():
    res = client.post("/api/summarize", json={
        "transcript": "   ",
        "meeting_type": "general",
        "summary_length": "medium"
    })
    assert res.status_code == 400

if __name__ == "__main__":
    print("Running Day 23 AI Meeting Summarizer Test Suite...")
    test_health_endpoint()
    print("[PASSED] test_health_endpoint")
    test_project_meeting_summarization()
    print("[PASSED] test_project_meeting_summarization")
    test_standup_meeting_summarization()
    print("[PASSED] test_standup_meeting_summarization")
    test_long_transcript_map_reduce_strategy()
    print("[PASSED] test_long_transcript_map_reduce_strategy")
    test_empty_transcript_validation()
    print("[PASSED] test_empty_transcript_validation")
    print("ALL DAY 23 AI MEETING SUMMARIZER TESTS PASSED SUCCESSFULLY!")
