import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import EmailRequest, RewriteRequest, IntentExtractRequest, EmailApiResponse
from generator import EmailGeneratorEngine

app = FastAPI(
    title="AI Email Writer API",
    description="Controlled AI Email Generation, Tone Control, Anti-Hallucination, and Refinement Engine.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = EmailGeneratorEngine()

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "AI Email Writer API",
        "has_openrouter_key": bool(engine.api_key),
        "model": engine.model
    }

@app.post("/api/email/generate", response_model=EmailApiResponse)
async def generate_email(req: EmailRequest):
    if not req.purpose or not req.purpose.strip():
        raise HTTPException(status_code=400, detail="Purpose field cannot be empty.")

    start_time = time.time()
    try:
        email_res = engine.generate(req)
        duration = round(time.time() - start_time, 2)
        return EmailApiResponse(
            success=True,
            email=email_res,
            processing_time_sec=duration
        )
    except Exception as e:
        duration = round(time.time() - start_time, 2)
        return EmailApiResponse(
            success=False,
            error=str(e),
            processing_time_sec=duration
        )

@app.post("/api/email/rewrite", response_model=EmailApiResponse)
async def rewrite_email(req: RewriteRequest):
    if not req.email_body or not req.email_body.strip():
        raise HTTPException(status_code=400, detail="email_body cannot be empty.")

    start_time = time.time()
    try:
        email_res = engine.rewrite(req)
        duration = round(time.time() - start_time, 2)
        return EmailApiResponse(
            success=True,
            email=email_res,
            processing_time_sec=duration
        )
    except Exception as e:
        duration = round(time.time() - start_time, 2)
        return EmailApiResponse(
            success=False,
            error=str(e),
            processing_time_sec=duration
        )

@app.post("/api/email/extract-intent", response_model=EmailApiResponse)
async def extract_intent(req: IntentExtractRequest):
    if not req.natural_prompt or not req.natural_prompt.strip():
        raise HTTPException(status_code=400, detail="natural_prompt cannot be empty.")

    start_time = time.time()
    try:
        extracted = engine.extract_intent(req)
        duration = round(time.time() - start_time, 2)
        return EmailApiResponse(
            success=True,
            extracted_intent=extracted,
            processing_time_sec=duration
        )
    except Exception as e:
        duration = round(time.time() - start_time, 2)
        return EmailApiResponse(
            success=False,
            error=str(e),
            processing_time_sec=duration
        )
