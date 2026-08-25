import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import SummarizeRequest, SummarizeResponse
from summarizer import MeetingSummarizerEngine

app = FastAPI(
    title="AI Meeting Summarizer API",
    description="Structured meeting intelligence, decision classification, action-item extraction, and map-reduce long transcript processing.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = MeetingSummarizerEngine()

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "AI Meeting Summarizer API",
        "has_openrouter_key": bool(engine.api_key),
        "model": engine.model
    }

@app.post("/api/summarize", response_model=SummarizeResponse)
async def summarize_meeting(req: SummarizeRequest):
    if not req.transcript or not req.transcript.strip():
        raise HTTPException(status_code=400, detail="Meeting transcript cannot be empty.")

    start_time = time.time()
    try:
        summary_result, strategy = engine.summarize(req)
        duration = round(time.time() - start_time, 2)
        return SummarizeResponse(
            success=True,
            summary=summary_result,
            strategy_used=strategy,
            processing_time_sec=duration
        )
    except Exception as e:
        duration = round(time.time() - start_time, 2)
        return SummarizeResponse(
            success=False,
            error=str(e),
            processing_time_sec=duration
        )
