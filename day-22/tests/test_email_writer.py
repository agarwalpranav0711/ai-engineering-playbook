import sys
import os
import json
import pytest
from fastapi.testclient import TestClient

# Add backend directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from main import app

client = TestClient(app)

SAMPLE_DIR = os.path.join(os.path.dirname(__file__), "..", "sample-data")

def load_sample(filename: str) -> dict:
    path = os.path.join(SAMPLE_DIR, filename)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"

def test_generate_academic_email():
    payload = load_sample("academic-extension.json")
    res = client.post("/api/email/generate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    email = data["email"]

    assert "extension" in email["subject"].lower() or "request" in email["subject"].lower()
    assert len(email["greeting"]) > 0
    assert len(email["body"]) > 0
    assert email["word_count"] > 10
    assert len(email["alternative_subjects"]) >= 1

def test_generate_job_followup_email():
    payload = load_sample("job-followup.json")
    res = client.post("/api/email/generate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    email = data["email"]

    assert "follow" in email["subject"].lower() or "interview" in email["subject"].lower()
    assert "Pranav" in email["closing"] or "Pranav" in email["full_email"]

def test_rewrite_email_concise():
    res = client.post("/api/email/rewrite", json={
        "email_subject": "Meeting Follow-up",
        "email_body": "I hope you are having a wonderful week. I am reaching out to follow up on our previous conversation regarding the software project details. Please let me know your thoughts.",
        "instruction": "make_concise",
        "sender_name": "Pranav"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    email = data["email"]

    assert len(email["body"]) > 0
    assert "Pranav" in email["closing"]

def test_extract_intent_natural():
    res = client.post("/api/email/extract-intent", json={
        "natural_prompt": "I need to email Professor Sharma asking for a 2-day assignment extension because I was sick."
    })
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    extracted = data["extracted_intent"]

    assert extracted["recipient"].lower() in ["professor", "professor sharma"]
    assert "extension" in extracted["purpose"].lower() or "assignment" in extracted["purpose"].lower()

def test_empty_purpose_validation():
    res = client.post("/api/email/generate", json={
        "email_type": "professional",
        "recipient": "Professor",
        "purpose": "   ",
        "context": "sick",
        "tone": "professional",
        "length": "medium"
    })
    assert res.status_code == 400

if __name__ == "__main__":
    print("Running Day 22 AI Email Writer Test Suite...")
    test_health_endpoint()
    print("[PASSED] test_health_endpoint")
    test_generate_academic_email()
    print("[PASSED] test_generate_academic_email")
    test_generate_job_followup_email()
    print("[PASSED] test_generate_job_followup_email")
    test_rewrite_email_concise()
    print("[PASSED] test_rewrite_email_concise")
    test_extract_intent_natural()
    print("[PASSED] test_extract_intent_natural")
    test_empty_purpose_validation()
    print("[PASSED] test_empty_purpose_validation")
    print("ALL DAY 22 AI EMAIL WRITER TESTS PASSED SUCCESSFULLY!")
