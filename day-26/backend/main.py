import time
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from models import CaptionResponse, QuestionResponse, QuestionRequest
from image import validate_and_encode_image
from vision import MultimodalVisionEngine

app = FastAPI(
    title="Image Caption Generator API",
    description="Multimodal Computer Vision pipeline for image understanding, caption synthesis, object inventory, accessibility alt text, and visual Q&A.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vision_engine = MultimodalVisionEngine()

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "Image Caption Generator API",
        "has_openrouter_key": bool(vision_engine.api_key),
        "vision_model": vision_engine.model
    }

@app.post("/api/caption", response_model=CaptionResponse)
async def generate_caption(
    file: UploadFile = File(...),
    style: Optional[str] = Form("descriptive"),
    custom_instruction: Optional[str] = Form("")
):
    """Processes uploaded image file: Validates -> Base64 Data URL -> Vision Model -> ImageCaption JSON."""
    start_time = time.time()
    try:
        contents = await file.read()
        data_url, mime_type, width, height = validate_and_encode_image(file, contents)

        analysis = vision_engine.analyze_image(
            image_data_url=data_url,
            filename=file.filename or "image.jpg",
            style=style or "descriptive",
            custom_instruction=custom_instruction or ""
        )

        duration = round(time.time() - start_time, 2)
        return CaptionResponse(
            success=True,
            analysis=analysis,
            filename=file.filename or "image.jpg",
            style=style or "descriptive",
            processing_time_sec=duration
        )

    except HTTPException as he:
        duration = round(time.time() - start_time, 2)
        raise he
    except Exception as e:
        duration = round(time.time() - start_time, 2)
        return CaptionResponse(
            success=False,
            filename=file.filename or "image.jpg",
            error=str(e),
            processing_time_sec=duration
        )

@app.post("/api/ask-image", response_model=QuestionResponse)
async def ask_image_question(
    file: UploadFile = File(...),
    question: str = Form(...)
):
    """Answers custom user visual Q&A about an uploaded image."""
    if not question or not question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    start_time = time.time()
    try:
        contents = await file.read()
        data_url, mime_type, width, height = validate_and_encode_image(file, contents)

        answer = vision_engine.ask_question(image_data_url=data_url, question=question.strip())
        duration = round(time.time() - start_time, 2)

        return QuestionResponse(
            success=True,
            answer=answer,
            processing_time_sec=duration
        )
    except Exception as e:
        duration = round(time.time() - start_time, 2)
        return QuestionResponse(
            success=False,
            error=str(e),
            processing_time_sec=duration
        )
