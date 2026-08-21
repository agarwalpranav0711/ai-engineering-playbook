import uuid
import time
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware

from models import UploadResponse, ChatRequest, ChatResponse, DocumentInfo
from pdf_parser import parse_pdf_pages, clean_page_text
from chunker import chunk_document_pages
from vector_store import vector_store
from rag_engine import RAGEngine

app = FastAPI(
    title="AI PDF Chat API (RAG)",
    description="Retrieval-Augmented Generation over PDF documents with page source attribution.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

rag_engine = RAGEngine()

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "AI PDF Chat RAG API",
        "has_openrouter_key": bool(rag_engine.api_key),
        "model": rag_engine.model
    }

@app.post("/api/upload", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    filename = file.filename
    if not filename.lower().endswith((".pdf", ".txt")):
        raise HTTPException(status_code=400, detail="Only .pdf or .txt files are supported.")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Generate document ID
    document_id = f"doc_{uuid.uuid4().hex[:8]}"

    try:
        pages = []
        if filename.lower().endswith(".pdf"):
            pages = parse_pdf_pages(content)
        else:
            text = clean_page_text(content.decode("utf-8", errors="ignore"))
            pages = [{"page_number": 1, "text": text}]

        if not pages:
            raise HTTPException(status_code=400, detail="No readable text extracted from document.")

        # Chunk document
        chunks = chunk_document_pages(pages=pages, document_id=document_id, chunk_size=600, chunk_overlap=120)

        # Index in Vector Store
        vector_store.add_document(
            document_id=document_id,
            filename=filename,
            total_pages=len(pages),
            chunks=chunks
        )

        return UploadResponse(
            success=True,
            document_id=document_id,
            filename=filename,
            total_pages=len(pages),
            total_chunks=len(chunks),
            message=f"Successfully processed and indexed {len(chunks)} text chunks across {len(pages)} pages."
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")

@app.post("/api/chat", response_model=ChatResponse)
async def chat_rag(req: ChatRequest):
    if not req.document_id:
        raise HTTPException(status_code=400, detail="document_id is required.")
    if not req.question or not req.question.strip():
        raise HTTPException(status_code=400, detail="question is required.")

    doc_info = vector_store.get_document_info(req.document_id)
    if not doc_info:
        raise HTTPException(status_code=440, detail=f"Document ID '{req.document_id}' not found. Please upload a PDF first.")

    res = rag_engine.query(req)
    return res

@app.get("/api/documents", response_model=List[DocumentInfo])
def list_documents():
    docs = vector_store.list_documents()
    return [DocumentInfo(**d) for d in docs]
