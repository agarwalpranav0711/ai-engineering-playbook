from pydantic import BaseModel, Field
from typing import List, Optional

class ImageCaption(BaseModel):
    caption: str = Field(description="Concise 1-sentence image caption")
    detailed_description: str = Field(description="Comprehensive multi-sentence visual description of scene, elements, and composition")
    objects: List[str] = Field(default_factory=list, description="List of primary visible objects detected in the image")
    scene: str = Field(description="Environment or setting identification e.g. 'outdoor park', 'modern kitchen', 'tech workspace'")
    colors: List[str] = Field(default_factory=list, description="List of dominant colors present in the image")
    mood: Optional[str] = Field(default=None, description="Atmosphere or emotional tone e.g. 'energetic', 'serene', 'professional'")
    alt_text: str = Field(description="Accessibility-focused alt text specifically crafted for screen readers")
    visible_text: Optional[str] = Field(default=None, description="OCR text extracted if signs, receipts, or text are present, else null")

class CaptionResponse(BaseModel):
    success: bool
    analysis: Optional[ImageCaption] = Field(default=None, description="Structured multimodal vision analysis report")
    filename: str = Field(default="", description="Original uploaded filename")
    style: str = Field(default="descriptive", description="Applied caption style")
    processing_time_sec: float = Field(default=0.0, description="Backend processing time in seconds")
    error: Optional[str] = Field(default=None, description="Error message if processing failed")

class QuestionRequest(BaseModel):
    question: str = Field(description="Custom question about the uploaded image content")

class QuestionResponse(BaseModel):
    success: bool
    answer: str = Field(default="", description="Visual reasoning answer based on observable image content")
    processing_time_sec: float = Field(default=0.0, description="Backend processing time in seconds")
    error: Optional[str] = Field(default=None, description="Error message if visual Q&A failed")
