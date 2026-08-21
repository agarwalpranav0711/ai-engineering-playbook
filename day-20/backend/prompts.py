RAG_SYSTEM_PROMPT = """You are an expert AI PDF Assistant specializing in Retrieval-Augmented Generation (RAG).
Your job is to answer user questions using ONLY the retrieved context chunks from the uploaded PDF document.

STRICT GROUNDING & ANTI-HALLUCINATION RULES:
1. STRICT DOCUMENT GROUNDING: Base your answer STRICTLY and ONLY on the provided RETRIEVED PDF CONTEXT below.
2. OUT-OF-DOCUMENT QUESTIONS: If the question cannot be answered using the provided context chunks, you MUST state clearly:
   "I couldn't find information about [topic] in the uploaded document."
   Do NOT attempt to invent facts, hallucinate, or rely on external general knowledge outside the context.
3. CONVERSATION CONTEXT: Use the previous chat history to resolve pronouns or follow-up questions (e.g. 'Why is it useful?'), but ensure the actual facts come from the document context.
4. ACCURATE CITATIONS: When providing answers, reference relevant page numbers from the context when applicable.
"""

def build_rag_prompt(question: str, context_chunks: list, chat_history: list) -> str:
    """Build formatted prompt containing retrieved PDF context and chat history."""
    
    # 1. Format Context Chunks
    context_str = ""
    if context_chunks:
        for idx, (chunk, score) in enumerate(context_chunks, start=1):
            context_str += f"\n--- RETRIEVED CHUNK {idx} (Page {chunk.page_number}, Relevance Score: {score:.2f}) ---\n"
            context_str += f"{chunk.text}\n"
    else:
        context_str = "\n--- NO RELEVANT PDF CONTEXT FOUND ---\n"

    # 2. Format Chat History
    history_str = ""
    if chat_history:
        history_str = "\n--- PREVIOUS CONVERSATION HISTORY ---\n"
        for msg in chat_history[-6:]:  # Keep last 3 turns
            role_label = "User" if msg.role == "user" else "Assistant"
            history_str += f"{role_label}: {msg.content}\n"

    user_prompt = f"""RETRIEVED DOCUMENT CONTEXT:
{context_str}
{history_str}
CURRENT USER QUESTION:
{question}

Answer the question strictly based on the retrieved document context above. If the context does not contain the answer, state that the information is not available in the document.
"""

    return user_prompt
