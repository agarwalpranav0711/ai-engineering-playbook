import os
import time
from typing import List
from dotenv import load_dotenv
from openai import OpenAI

from models import ChatRequest, ChatResponse, SourceCitation, ChatMessage
from vector_store import vector_store
from prompts import RAG_SYSTEM_PROMPT, build_rag_prompt

load_dotenv()

class RAGEngine:
    def __init__(self, api_key: str = None, model: str = None):
        self.api_key = api_key or os.getenv("OPENROUTER_API_KEY", "")
        self.model = model or os.getenv("DEFAULT_MODEL", "google/gemini-2.5-flash")
        
        if self.api_key:
            self.client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=self.api_key,
                default_headers={
                    "HTTP-Referer": os.getenv("SITE_URL", "http://localhost:3000"),
                    "X-Title": os.getenv("SITE_NAME", "AI PDF Chat RAG"),
                }
            )
        else:
            self.client = None

    def query(self, req: ChatRequest) -> ChatResponse:
        """Run RAG pipeline: Query -> Vector Similarity Search -> Context Prompt -> LLM -> Sources."""
        start_time = time.time()

        # 1. Retrieve top-k relevant chunks from VectorStore
        retrieved_items = vector_store.search(
            document_id=req.document_id,
            query=req.question,
            top_k=req.top_k
        )

        # Build Source Citations
        sources: List[SourceCitation] = []
        for chunk, score in retrieved_items:
            snippet = chunk.text[:140].strip() + ("..." if len(chunk.text) > 140 else "")
            sources.append(SourceCitation(
                page_number=chunk.page_number,
                snippet=snippet,
                score=round(score, 4)
            ))

        # Check if any chunk met minimum relevance threshold
        has_relevant_context = any(score >= 0.15 for _, score in retrieved_items) if retrieved_items else False

        # 2. Call LLM or Offline Heuristic RAG Fallback
        if not self.client or not self.api_key:
            answer = self._offline_rag_fallback(req.question, retrieved_items, has_relevant_context)
        else:
            prompt = build_rag_prompt(req.question, retrieved_items, req.history)
            try:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": RAG_SYSTEM_PROMPT},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.2
                )
                answer = response.choices[0].message.content
            except Exception as e:
                print(f"OpenRouter RAG API call error: {e}. Switching to offline RAG fallback.")
                answer = self._offline_rag_fallback(req.question, retrieved_items, has_relevant_context, str(e))

        processing_time = round(time.time() - start_time, 2)
        return ChatResponse(
            success=True,
            answer=answer,
            sources=sources if has_relevant_context else [],
            document_id=req.document_id,
            retrieved_chunks_count=len(retrieved_items),
            processing_time_sec=processing_time
        )

    def _offline_rag_fallback(self, question: str, retrieved_items: list, has_relevant: bool, error_msg: str = None) -> str:
        """Deterministic offline RAG synthesis when API key is not present."""
        if not retrieved_items or not has_relevant:
            return f"I couldn't find information about '{question}' in the uploaded document."

        top_chunk, top_score = retrieved_items[0]
        page_num = top_chunk.page_number
        
        note = f" (Offline RAG Mode: {error_msg})" if error_msg else " (Offline RAG Mode - set OPENROUTER_API_KEY for deep LLM answer generation)"
        
        # Grounded answer synthesis directly from top retrieved chunk
        summary_text = top_chunk.text.strip()
        if len(summary_text) > 250:
            summary_text = summary_text[:250] + "..."

        return f"Based on page {page_num} of the uploaded document:\n\n\"{summary_text}\"{note}"
