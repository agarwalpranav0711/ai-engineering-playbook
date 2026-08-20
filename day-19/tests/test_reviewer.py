import sys
import os
import pytest
from fastapi.testclient import TestClient

# Add backend directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from main import app
from parser import clean_resume_text, detect_parsing_concerns
from reviewer import SingleAgentReviewer
from multi_agent import MultiAgentReviewer

client = TestClient(app)

# Load sample data
SAMPLE_DIR = os.path.join(os.path.dirname(__file__), "..", "sample-data")

def load_file(filename: str) -> str:
    path = os.path.join(SAMPLE_DIR, filename)
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "service" in data

def test_strong_resume_review():
    strong_resume = load_file("sample-resume-strong.txt")
    jd = load_file("sample-job-description.txt")

    response = client.post("/api/review/json", json={
        "resume_text": strong_resume,
        "job_description": jd,
        "mode": "single"
    })
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["success"] is True
    review = res_data["review"]

    assert review["overall_score"] >= 70
    assert review["skills_match_score"] >= 70
    assert len(review["strengths"]) > 0
    assert review["hallucination_check_passed"] is True

def test_weak_resume_review_and_gap_detection():
    weak_resume = load_file("sample-resume-weak.txt")
    jd = load_file("sample-job-description.txt")

    response = client.post("/api/review/json", json={
        "resume_text": weak_resume,
        "job_description": jd,
        "mode": "single"
    })
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["success"] is True
    review = res_data["review"]

    # Weak resume score should drop significantly compared to strong resume
    assert review["overall_score"] < 70
    # TypeScript, Docker, or AWS should be flagged missing
    missing_str = " ".join(review["missing_skills"]).lower()
    assert "typescript" in missing_str or "docker" in missing_str or "aws" in missing_str
    # Parsing or contact concerns should be caught
    assert len(review["parsing_concerns"]) > 0 or len(review["weak_bullets"]) > 0

def test_parser_concerns_detection():
    text_missing_contact = "Simple Candidate Resume\nExperience\nWorked on web projects."
    concerns = detect_parsing_concerns(text_missing_contact)
    assert any("Missing Contact Info" in c for c in concerns)

def test_synonym_and_antihallucination_check():
    reviewer = SingleAgentReviewer()
    resume_with_js = "Skills: JS, React, HTML, CSS.\nProjects: Built React web dashboard."
    jd_requiring_ts = "Requirements: React, JavaScript, TypeScript, Docker."

    review = reviewer.analyze(resume_with_js, jd_requiring_ts)
    
    # JS should match JavaScript via synonym
    matched_str = " ".join([m.skill_name.lower() for m in review.skill_breakdown if m.status == "matched"])
    assert "javascript" in matched_str or "js" in matched_str

    # TypeScript and Docker should be missing, NOT hallucinated as matched
    missing_skills_lower = [s.lower() for s in review.missing_skills]
    assert any("typescript" in s for s in missing_skills_lower) or any("docker" in s for s in missing_skills_lower)

def test_multi_agent_review_mode():
    strong_resume = load_file("sample-resume-strong.txt")
    jd = load_file("sample-job-description.txt")

    response = client.post("/api/review/json", json={
        "resume_text": strong_resume,
        "job_description": jd,
        "mode": "multi_agent"
    })
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["success"] is True
    assert res_data["mode_used"] == "multi_agent"
