import sys
import os
import pytest
from fastapi.testclient import TestClient

# Add backend directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from main import app
from reviewer import CodeReviewerEngine

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

def test_languages_endpoint():
    response = client.get("/api/languages")
    assert response.status_code == 200
    data = response.json()
    assert "cpp" in data["supported_languages"]
    assert "dsa" in data["review_modes"]

def test_buggy_cpp_array_review():
    code = load_sample("buggy-array.cpp")
    res = client.post("/api/review", json={
        "language": "cpp",
        "code": code,
        "review_mode": "bugs"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    review = data["review"]

    assert len(review["bugs"]) > 0
    bug_titles = [b["title"].lower() for b in review["bugs"]]
    assert any("bounds" in t or "out-of-bounds" in t or "index" in t for t in bug_titles)
    assert review["overall_score"] < 90
    assert len(review["improved_code"]) > 0

def test_inefficient_python_loop_review():
    code = load_sample("inefficient-loops.py")
    res = client.post("/api/review", json={
        "language": "python",
        "code": code,
        "review_mode": "performance"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    review = data["review"]

    assert "n" in review["complexity"]["time_complexity"] or len(review["performance_issues"]) > 0

def test_vulnerable_secret_review():
    code = load_sample("vulnerable-secret.py")
    res = client.post("/api/review", json={
        "language": "python",
        "code": code,
        "review_mode": "security"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    review = data["review"]

    assert len(review["security_issues"]) > 0
    sec_titles = [s["title"].lower() for s in review["security_issues"]]
    assert any("secret" in t or "credential" in t or "hardcoded" in t for t in sec_titles)

def test_empty_code_validation():
    res = client.post("/api/review", json={
        "language": "python",
        "code": "   ",
        "review_mode": "full"
    })
    assert res.status_code == 400

if __name__ == "__main__":
    print("Running Day 21 Code Reviewer Test Suite...")
    test_health_endpoint()
    print("[PASSED] test_health_endpoint")
    test_languages_endpoint()
    print("[PASSED] test_languages_endpoint")
    test_buggy_cpp_array_review()
    print("[PASSED] test_buggy_cpp_array_review")
    test_inefficient_python_loop_review()
    print("[PASSED] test_inefficient_python_loop_review")
    test_vulnerable_secret_review()
    print("[PASSED] test_vulnerable_secret_review")
    test_empty_code_validation()
    print("[PASSED] test_empty_code_validation")
    print("ALL DAY 21 CODE REVIEWER TESTS PASSED SUCCESSFULLY!")
