import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import ResearchRequest, ResearchResponse
from researcher import ResearchAssistantEngine

app = FastAPI(
    title="AI Research Assistant API",
    description="Multi-query web search, evidence extraction, citation grounding ([1], [2]), and contradiction analysis engine.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = ResearchAssistantEngine()

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "AI Research Assistant API",
        "has_openrouter_key": bool(engine.api_key),
        "model": engine.model
    }

@app.post("/api/research", response_model=ResearchResponse)
async def conduct_research(req: ResearchRequest):
    if not req.question or not req.question.strip():
        raise HTTPException(status_code=400, detail="Research question cannot be empty.")

    start_time = time.time()
    try:
        report_result, queries_used = engine.research(req)
        duration = round(time.time() - start_time, 2)
        return ResearchResponse(
            success=True,
            report=report_result,
            search_queries_used=queries_used,
            processing_time_sec=duration
        )
    except Exception as e:
        duration = round(time.time() - start_time, 2)
        return ResearchResponse(
            success=False,
            error=str(e),
            processing_time_sec=duration
        )
