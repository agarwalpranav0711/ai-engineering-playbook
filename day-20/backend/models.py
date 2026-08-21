from pydantic import BaseModel, Field
from typing import List, Optional

class SourceCitation(BaseModel):
    page_number: int = Field(description="PDF page number (1-indexed) where context chunk originated")
    snippet: str = Field(description="Snippet preview of the retrieved text chunk")
    score: float = Field(default=0.0, description="Cosine similarity score of retrieval")

class DocumentChunk(BaseModel):
    chunk_id: str = Field(description="Unique identifier for chunk")
    document_id: str = Field(description="Parent document ID")
    page_number: int = Field(description="Page number in original PDF")
    text: str = Field(description="Text content of chunk")

class UploadResponse(BaseModel):
    success: bool
    document_id: str
    filename: str
    total_pages: int
    total_chunks: int
    message: str

class ChatMessage(BaseModel):
    role: str = Field(description="'user', 'assistant', or 'system'")
    content: str = Field(description="Text message body")
    sources: Optional[List[SourceCitation]] = Field(default=None, description="Attributed page sources if assistant message")

class ChatRequest(BaseModel):
    document_id: str = Field(description="Document ID to query against")
    question: str = Field(description="User query question")
    history: List[ChatMessage] = Field(default_factory=list, description="Previous conversation turn history")
    top_k: int = Field(default=3, ge=1, le=10, description="Number of top relevant chunks to retrieve")

class ChatResponse(BaseModel):
    success: bool
    answer: str = Field(description="Generated answer grounded in document context")
    sources: List[SourceCitation] = Field(default_factory=list, description="Page sources supporting the answer")
    document_id: str
    retrieved_chunks_count: int = Field(default=0)
    processing_time_sec: float = Field(default=0.0)
    error: Optional[str] = None

class DocumentInfo(BaseModel):
    document_id: str
    filename: str
    total_pages: int
    total_chunks: int
