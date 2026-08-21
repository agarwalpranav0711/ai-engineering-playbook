from typing import List, Dict, Any
from models import DocumentChunk

def chunk_document_pages(
    pages: List[Dict[str, Any]],
    document_id: str,
    chunk_size: int = 600,
    chunk_overlap: int = 120
) -> List[DocumentChunk]:
    """
    Split page text into chunks of length chunk_size with chunk_overlap.
    Preserves page_number metadata for each chunk.
    """
    chunks: List[DocumentChunk] = []

    for page in pages:
        page_num = page["page_number"]
        text = page["text"]

        if not text:
            continue

        # If page text is shorter than chunk_size, create 1 chunk
        if len(text) <= chunk_size:
            chunk_id = f"{document_id}_p{page_num}_c0"
            chunks.append(DocumentChunk(
                chunk_id=chunk_id,
                document_id=document_id,
                page_number=page_num,
                text=text
            ))
            continue

        # Overlapping sliding window chunking
        start = 0
        chunk_idx = 0
        while start < len(text):
            end = start + chunk_size
            chunk_text = text[start:end].strip()

            if chunk_text:
                chunk_id = f"{document_id}_p{page_num}_c{chunk_idx}"
                chunks.append(DocumentChunk(
                    chunk_id=chunk_id,
                    document_id=document_id,
                    page_number=page_num,
                    text=chunk_text
                ))
                chunk_idx += 1

            start += (chunk_size - chunk_overlap)
            if start >= len(text):
                break

    return chunks
