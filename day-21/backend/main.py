import time
from typing import List
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from models import ReviewRequest, ReviewResponse
from reviewer import CodeReviewerEngine

app = FastAPI(
    title="AI Code Reviewer API",
    description="Multi-dimensional static code analysis, bug detection, security audit, and Big-O complexity profiling.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = CodeReviewerEngine()

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "AI Code Reviewer API",
        "has_openrouter_key": bool(engine.api_key),
        "model": engine.model
    }

@app.get("/api/languages")
def get_languages():
    return {
        "supported_languages": ["cpp", "python", "javascript", "typescript", "java", "go", "c", "rust"],
        "review_modes": ["full", "dsa", "bugs", "security", "performance"]
    }

@app.post("/api/review", response_model=ReviewResponse)
async def review_code(req: ReviewRequest):
    if not req.code or not req.code.strip():
        raise HTTPException(status_code=400, detail="Source code snippet cannot be empty.")

    start_time = time.time()
    try:
        review_result = engine.review(req)
        duration = round(time.time() - start_time, 2)
        return ReviewResponse(
            success=True,
            review=review_result,
            processing_time_sec=duration
        )
    except Exception as e:
        duration = round(time.time() - start_time, 2)
        return ReviewResponse(
            success=False,
            error=str(e),
            processing_time_sec=duration
        )
