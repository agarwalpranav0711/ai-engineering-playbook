import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import Workflow, ExecutionRequest, ExecutionResponse
from executor import WorkflowExecutor

app = FastAPI(
    title="Simple AI Workflow Builder API",
    description="Backend Graph Execution Engine for Day 27 Simple AI Workflow Builder",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

executor = WorkflowExecutor()


@app.get("/")
def read_root():
    return {
        "message": "Simple AI Workflow Builder API is running.",
        "docs": "/docs",
        "health": "/api/health"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Simple AI Workflow Builder Backend",
        "version": "1.0.0"
    }


@app.post("/api/workflow/validate")
def validate_workflow(workflow: Workflow):
    sorted_nodes, errors = executor.validate_and_sort(workflow)
    if errors:
        return {"valid": False, "errors": errors}
    return {
        "valid": True,
        "execution_order": [node.id for node in sorted_nodes],
        "node_count": len(sorted_nodes)
    }


@app.post("/api/workflow/run", response_model=ExecutionResponse)
def run_workflow(request: ExecutionRequest):
    try:
        response = executor.execute_workflow(request.workflow)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
