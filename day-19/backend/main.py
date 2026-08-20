import time
from typing import Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from models import ReviewRequest, ReviewResponse, ResumeReview
from parser import extract_text_from_pdf, clean_resume_text
from reviewer import SingleAgentReviewer
from multi_agent import MultiAgentReviewer

app = FastAPI(
    title="AI Resume Reviewer API",
    description="Structured, evidence-based AI resume analysis and job description matching.",
    version="1.0.0"
)

# Enable CORS for local Vite development frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

single_reviewer = SingleAgentReviewer()
multi_reviewer = MultiAgentReviewer()

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "AI Resume Reviewer API",
        "has_openrouter_key": bool(single_reviewer.api_key),
        "model": single_reviewer.model
    }

@app.post("/api/review", response_model=ReviewResponse)
async def review_resume(
    job_description: str = Form(...),
    mode: str = Form("single"),
    file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None)
):
    start_time = time.time()
    
    extracted_text = ""
    
    # 1. Parse File upload if provided
    if file:
        filename = file.filename.lower()
        content = await file.read()
        if filename.endswith(".pdf"):
            try:
                extracted_text = extract_text_from_pdf(content)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"PDF extraction error: {str(e)}")
        elif filename.endswith(".txt"):
            extracted_text = clean_resume_text(content.decode("utf-8", errors="ignore"))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a .pdf or .txt file.")
    elif resume_text and resume_text.strip():
        extracted_text = clean_resume_text(resume_text)
    else:
        raise HTTPException(status_code=400, detail="Please provide either a resume file upload or plain text resume.")

    if not job_description or not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description text is required.")

    # 2. Run analysis mode
    try:
        if mode == "multi_agent":
            review_result = multi_reviewer.analyze(extracted_text, job_description)
        else:
            review_result = single_reviewer.analyze(extracted_text, job_description)

        duration = round(time.time() - start_time, 2)
        return ReviewResponse(
            success=True,
            review=review_result,
            mode_used=mode,
            processing_time_sec=duration
        )
    except Exception as e:
        duration = round(time.time() - start_time, 2)
        return ReviewResponse(
            success=False,
            error=str(e),
            mode_used=mode,
            processing_time_sec=duration
        )

@app.post("/api/review/json", response_model=ReviewResponse)
async def review_resume_json(payload: ReviewRequest):
    """JSON body endpoint alternative to multipart form data."""
    start_time = time.time()
    if not payload.resume_text or not payload.resume_text.strip():
        raise HTTPException(status_code=400, detail="resume_text is required for JSON endpoint.")

    clean_text = clean_resume_text(payload.resume_text)
    
    try:
        if payload.mode == "multi_agent":
            review_result = multi_reviewer.analyze(clean_text, payload.job_description)
        else:
            review_result = single_reviewer.analyze(clean_text, payload.job_description)

        duration = round(time.time() - start_time, 2)
        return ReviewResponse(
            success=True,
            review=review_result,
            mode_used=payload.mode,
            processing_time_sec=duration
        )
    except Exception as e:
        duration = round(time.time() - start_time, 2)
        return ReviewResponse(
            success=False,
            error=str(e),
            mode_used=payload.mode,
            processing_time_sec=duration
        )
