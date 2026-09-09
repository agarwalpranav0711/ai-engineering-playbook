from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import ChatRequest, ChatResponse, WorkspaceState, Task, Note
from copilot_engine import process_copilot_request
import json
import os
import sys

# Add evaluation directory to path
eval_dir = os.path.join(os.path.dirname(__file__), "..", "evaluation")
sys.path.insert(0, eval_dir)
from eval_runner import run_evaluation_suite

app = FastAPI(
    title="Day 29 - Mini AI Copilot v2 API",
    description="Backend API powering the improved, evaluation-tested Mini AI Copilot v2.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Mini AI Copilot v2 Backend API",
        "day": 29,
        "docs": "/docs"
    }

@app.post("/api/copilot/chat", response_model=ChatResponse)
def copilot_chat(request: ChatRequest):
    try:
        response = process_copilot_request(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/workspace/sample", response_model=WorkspaceState)
def get_sample_workspace():
    sample_path = os.path.join(os.path.dirname(__file__), "..", "sample-data", "workspace.json")
    if os.path.exists(sample_path):
        with open(sample_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return WorkspaceState(**data)
    
    return WorkspaceState(
        tasks=[
            Task(id="task_101", title="Finalize AI Copilot System Architecture", status="done", priority="high", tags=["architecture", "design"]),
            Task(id="task_102", title="Implement Tool Execution Loop with Approval Check", status="in_progress", priority="high", tags=["backend", "safety"]),
            Task(id="task_103", title="Prepare UI Demo for React 19 Frontend", status="todo", priority="medium", tags=["frontend", "ui"])
        ],
        notes=[
            Note(
                id="note_201",
                title="Product Roadmap Notes",
                content="- Build backend API endpoints with FastAPI\n- Add context injection for current workspace state\n- Implement human-in-the-loop approval modal\n- Add prompt injection defense rule",
                tags=["roadmap", "copilot"]
            )
        ],
        selected_item_id="task_102",
        selected_item_type="task",
        current_view="all"
    )

@app.get("/api/copilot/eval/results")
def get_eval_results():
    v0_path = os.path.join(eval_dir, "results_v0_baseline.json")
    v4_path = os.path.join(eval_dir, "results_v4_copilot_v2.json")
    
    v0_data = {}
    v4_data = {}
    
    if os.path.exists(v0_path):
        with open(v0_path, "r", encoding="utf-8") as f:
            v0_data = json.load(f)
    if os.path.exists(v4_path):
        with open(v4_path, "r", encoding="utf-8") as f:
            v4_data = json.load(f)

    return {
        "baseline": v0_data,
        "copilot_v2": v4_data
    }

@app.post("/api/copilot/eval/run")
def trigger_eval_run():
    v0_res = run_evaluation_suite("v0_baseline")
    v4_res = run_evaluation_suite("v4_copilot_v2")
    return {
        "status": "success",
        "baseline": v0_res,
        "copilot_v2": v4_res
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
