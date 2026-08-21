import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from fastapi.testclient import TestClient
from main import app
from chunker import chunk_document_pages
from vector_store import vector_store

client = TestClient(app)

SAMPLE_FILE_PATH = os.path.join(os.path.dirname(__file__), "..", "sample-data", "sample-ai-notes.txt")

def load_sample_content() -> bytes:
    with open(SAMPLE_FILE_PATH, "rb") as f:
        return f.read()

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"

def test_upload_document():
    content = load_sample_content()
    response = client.post("/api/upload", files={
        "file": ("sample-ai-notes.txt", content, "text/plain")
    })
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is True
    assert res["total_chunks"] > 0
    assert "document_id" in res

def test_rag_direct_question_and_citations():
    content = load_sample_content()
    upload_res = client.post("/api/upload", files={
        "file": ("sample-ai-notes.txt", content, "text/plain")
    }).json()
    doc_id = upload_res["document_id"]

    chat_res = client.post("/api/chat", json={
        "document_id": doc_id,
        "question": "What is RAG and why is it useful?",
        "history": [],
        "top_k": 3
    })
    assert chat_res.status_code == 200
    res = chat_res.json()
    assert res["success"] is True
    assert len(res["answer"]) > 10
    assert res["retrieved_chunks_count"] > 0
    assert len(res["sources"]) > 0
    assert res["sources"][0]["page_number"] >= 1

def test_out_of_document_anti_hallucination():
    content = load_sample_content()
    upload_res = client.post("/api/upload", files={
        "file": ("sample-ai-notes.txt", content, "text/plain")
    }).json()
    doc_id = upload_res["document_id"]

    chat_res = client.post("/api/chat", json={
        "document_id": doc_id,
        "question": "What does the document say about quantum computing?",
        "history": [],
        "top_k": 3
    })
    assert chat_res.status_code == 200
    res = chat_res.json()
    assert res["success"] is True
    answer_lower = res["answer"].lower()
    assert "couldn't find" in answer_lower or "not available" in answer_lower or len(res["sources"]) == 0

def test_follow_up_chat_history():
    content = load_sample_content()
    upload_res = client.post("/api/upload", files={
        "file": ("sample-ai-notes.txt", content, "text/plain")
    }).json()
    doc_id = upload_res["document_id"]

    # Turn 1
    chat_res1 = client.post("/api/chat", json={
        "document_id": doc_id,
        "question": "What is chunking?",
        "history": []
    }).json()

    # Turn 2 follow up
    history = [
        {"role": "user", "content": "What is chunking?"},
        {"role": "assistant", "content": chat_res1["answer"]}
    ]
    chat_res2 = client.post("/api/chat", json={
        "document_id": doc_id,
        "question": "Why is it done?",
        "history": history
    })
    assert chat_res2.status_code == 200
    res2 = chat_res2.json()
    assert res2["success"] is True
    assert len(res2["answer"]) > 10

if __name__ == "__main__":
    print("Running Day 20 RAG Test Suite...")
    test_health_endpoint()
    print("[PASSED] test_health_endpoint")
    test_upload_document()
    print("[PASSED] test_upload_document")
    test_rag_direct_question_and_citations()
    print("[PASSED] test_rag_direct_question_and_citations")
    test_out_of_document_anti_hallucination()
    print("[PASSED] test_out_of_document_anti_hallucination")
    test_follow_up_chat_history()
    print("[PASSED] test_follow_up_chat_history")
    print("ALL DAY 20 RAG TESTS PASSED SUCCESSFULLY!")
