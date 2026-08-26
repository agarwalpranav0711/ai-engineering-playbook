import sys
import os
import json
import pytest
from fastapi.testclient import TestClient

# Add backend directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from main import app
from query_planner import QueryPlanner

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

def test_query_planner():
    planner = QueryPlanner()
    queries = planner.plan_queries("How are AI coding agents changing software development?", depth="deep")
    assert isinstance(queries, list)
    assert len(queries) >= 3

def test_conduct_research_ai_agents():
    payload = load_sample("ai-agents.json")
    res = client.post("/api/research", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    report = data["report"]

    assert len(report["executive_summary"]) > 0
    assert len(report["key_findings"]) >= 1
    
    # Check citation grounding
    finding = report["key_findings"][0]
    assert len(finding["source_ids"]) >= 1
    assert len(report["sources"]) >= 1
    assert report["sources"][0]["id"] == finding["source_ids"][0]

def test_filtered_academic_research():
    payload = load_sample("rag-systems.json")
    res = client.post("/api/research", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    report = data["report"]
    assert any("arxiv.org" in s["domain"] for s in report["sources"])

def test_empty_question_validation():
    res = client.post("/api/research", json={
        "question": "   ",
        "depth": "standard"
    })
    assert res.status_code == 400

if __name__ == "__main__":
    print("Running Day 24 AI Research Assistant Test Suite...")
    test_health_endpoint()
    print("[PASSED] test_health_endpoint")
    test_query_planner()
    print("[PASSED] test_query_planner")
    test_conduct_research_ai_agents()
    print("[PASSED] test_conduct_research_ai_agents")
    test_filtered_academic_research()
    print("[PASSED] test_filtered_academic_research")
    test_empty_question_validation()
    print("[PASSED] test_empty_question_validation")
    print("ALL DAY 24 AI RESEARCH ASSISTANT TESTS PASSED SUCCESSFULLY!")
