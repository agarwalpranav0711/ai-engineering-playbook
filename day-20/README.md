# 🚀 Day 20 — AI PDF Chat (Retrieval-Augmented Generation - RAG)

Turn any PDF document into an **interactive AI knowledge base**. This project implements a complete **RAG (Retrieval-Augmented Generation)** pipeline that extracts page-attributed text, chunks content with overlapping windows, indexes vectors in a VectorStore, performs top-k semantic similarity retrieval, and generates evidence-grounded answers complete with exact page source citations.

---

## 🎯 Architecture Overview

```
                         AI PDF CHAT
                              │
               ┌──────────────┴──────────────┐
               ↓                             ↓
         PHASE A: INGESTION            PHASE B: RAG CHAT
            (Upload PDF)                  (User Query)
               │                             │
          pypdf Parser                  Query Vector
               │                             │
       Page-Tracked Text             Cosine Similarity Search
               │                             │
       Chunking + Overlap            Top-K PDF Context Chunks
       (600 size, 120 overlap)               │
               │                      Prompt Builder
        Vector Database              (Context + History)
         (VectorStore)                       │
               │                             │
               └──────────────┬──────────────┘
                              ↓
                        OpenRouter LLM
                     (Gemini 2.5 / Fallback)
                              │
                              ↓
                    Answer + Page Sources
                     (📄 Page 2, Page 4)
                              │
                              ↓
                    React 19 + Vite Dashboard
```

---

## 🧱 Tech Stack & Frameworks

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite + Tailwind CSS v4 + Lucide Icons | Chat UI with PDF upload dropzone, processing status, expandable source page badges, and test prompt chips |
| **Backend API** | Python 3.11 + FastAPI + Uvicorn | RESTful API backend handling PDF ingestion, vector indexing, and chat RAG endpoints |
| **Data Schemas** | Pydantic v2 (`models.py`) | Strict models (`SourceCitation`, `DocumentChunk`, `UploadResponse`, `ChatRequest`, `ChatResponse`) |
| **PDF Extraction** | `pypdf` (`pdf_parser.py`) | Page-by-page text extraction with page number attribution |
| **Chunking** | Custom Chunker (`chunker.py`) | Sliding window chunker (600 characters, 120 character overlap) preserving page metadata |
| **Vector Store** | VectorStore (`vector_store.py`) | TF-IDF n-gram vectorizer & cosine similarity index filtered by document ID |
| **RAG Pipeline** | RAGEngine (`rag_engine.py`) | Semantic retrieval, prompt augmentation, chat memory integration, and source attribution |
| **Testing** | `pytest` / Python Runner (`tests/test_rag.py`) | Automated test suite verifying chunking, retrieval accuracy, source citations, and out-of-doc refusals |

---

## 🔑 Core RAG Concepts Explained

### 1. Ingestion vs. Querying
- **Ingestion (Phase A)**: Runs once when a PDF is uploaded. Text is extracted, cleaned, chunked into smaller pieces, vectorized, and saved in the vector store.
- **Querying (Phase B)**: Runs every time the user sends a message. Converts the user's question into a query vector, finds top-k matching document chunks, injects them into the LLM system prompt, and returns the grounded answer with page numbers.

### 2. Why Chunking & Overlap?
Instead of sending a 500-page document into the LLM (which wastes tokens and confuses context), we split it into small 600-character chunks. The **120-character overlap** ensures sentences or key concepts cut at chunk boundaries are preserved across adjacent chunks.

### 3. Strict Document Grounding (Anti-Hallucination)
The RAG system prompt enforces strict context boundary rules. If a user asks a question not present in the uploaded document (e.g. asking about *quantum computing* when given an AI handbook), the system returns:  
`"I couldn't find information about quantum computing in the uploaded document."`

---

## 🧪 Experiments & Verification Results

| Test Case | User Prompt / Query | Expected RAG Behavior | Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **1. Direct Question** | *"What is RAG and why is it useful?"* | Retrieves Chapter 1 chunks; cites Page 1/2 | Answer generated with `📄 Page 1` citation | ✅ PASSED |
| **2. Technical Concept**| *"Explain text chunking & embeddings."* | Retrieves Chapter 2 chunks; cites Page 1/2 | Answer generated with `📄 Page 2` citation | ✅ PASSED |
| **3. Out-of-Doc Query** | *"What does the doc say about quantum computing?"* | Refuses answer; cites 0 sources | Returned: *"I couldn't find information..."* | ✅ PASSED |
| **4. Chat Memory** | Turn 1: *"What is chunking?"* <br> Turn 2: *"Why is it done?"* | Resolves pronoun `"it"` using chat history | Maintained context seamlessly | ✅ PASSED |
| **5. Source Attribution**| Any document query | Provides expandable page snippet drawer | Page badges render with score % | ✅ PASSED |

---

## 🚀 How to Run

### 1. Backend Setup (FastAPI)
```bash
cd day-20/backend
python -m venv venv
# On Windows:
venv\Scripts\activate
pip install -r requirements.txt

# (Optional) Copy .env.example and set your OpenRouter API key
cp .env.example .env

# Run FastAPI server
python -m uvicorn main:app --reload --port 8000
```
Backend API docs: `http://localhost:8000/docs`

### 2. Frontend Setup (React + Vite)
```bash
cd day-20/frontend
npm install
npm run dev
```
Open browser at: `http://localhost:3000`

### 3. Run Automated RAG Test Suite
```bash
cd day-20
python tests/test_rag.py
```

---

## 💡 Key Learnings from Day 20

- **RAG vs Document Review**: Day 19 evaluated a document once; Day 20 converted a document into an interactive knowledge base with similarity search.
- **Vector Search & Metadata**: Preserved page numbers during chunking, enabling transparent source attribution.
- **Grounded AI Systems**: Proved how prompt augmentation prevents LLM hallucinations on out-of-domain queries.
