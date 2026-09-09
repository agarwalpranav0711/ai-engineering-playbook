from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import ChatRequest, ChatResponse, WorkspaceState, Task, Note
from copilot_engine import process_copilot_request
import json
import os

app = FastAPI(
    title="Day 28 - Mini AI Copilot API",
    description="Backend API powering the contextual Mini AI Copilot for workspace tasks and notes.",
    version="1.0.0"
)

# Enable CORS for frontend development
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
        "service": "Mini AI Copilot Backend API",
        "day": 28,
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
    
    # Fallback default workspace
    return WorkspaceState(
        tasks=[
            Task(id="task_1", title="Review Day 28 Mini Copilot architecture", status="done", priority="high", tags=["architecture", "ai"]),
            Task(id="task_2", title="Implement tool execution loop and approval flows", status="in_progress", priority="high", tags=["backend", "fastapi"]),
            Task(id="task_3", title="Build dynamic frontend sidebar and Copilot chat interface", status="todo", priority="medium", tags=["frontend", "react"])
        ],
        notes=[
            Note(
                id="note_1",
                title="Sprint Planning Notes",
                content="- Write FastAPI backend endpoints\n- Add Pydantic schemas for state\n- Implement tool safety checks for destructive actions\n- Connect React workspace components",
                tags=["sprint", "planning"]
            )
        ],
        selected_item_id="task_2",
        selected_item_type="task",
        current_view="all"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
