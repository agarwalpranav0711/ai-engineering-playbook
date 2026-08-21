import math
import re
from typing import List, Dict, Tuple, Optional, Any
from models import DocumentChunk

class VectorStore:
    """
    In-Memory Vector Store utilizing TF-IDF character & word n-gram vectorization 
    with Cosine Similarity for fast, dependency-free semantic & keyword retrieval.
    """
    def __init__(self):
        # document_id -> List[DocumentChunk]
        self.documents: Dict[str, List[DocumentChunk]] = {}
        # document_id -> Dict metadata info
        self.doc_metadata: Dict[str, Dict[str, Any]] = {}

    def add_document(self, document_id: str, filename: str, total_pages: int, chunks: List[DocumentChunk]):
        """Store document chunks and register metadata index."""
        self.documents[document_id] = chunks
        self.doc_metadata[document_id] = {
            "document_id": document_id,
            "filename": filename,
            "total_pages": total_pages,
            "total_chunks": len(chunks)
        }

    def search(self, document_id: str, query: str, top_k: int = 3) -> List[Tuple[DocumentChunk, float]]:
        """
        Perform similarity search on document chunks for query.
        Returns top_k list of tuples: (DocumentChunk, similarity_score)
        """
        if document_id not in self.documents or not self.documents[document_id]:
            return []

        chunks = self.documents[document_id]
        
        # Tokenize query
        query_terms = self._tokenize(query)
        if not query_terms:
            # Fallback to returning first top_k chunks if query is blank
            return [(c, 0.5) for c in chunks[:top_k]]

        # Build IDF table across document chunks
        num_docs = len(chunks)
        doc_freqs: Dict[str, int] = {}
        chunk_tf_list = []

        for chunk in chunks:
            terms = self._tokenize(chunk.text)
            term_counts = {}
            for t in terms:
                term_counts[t] = term_counts.get(t, 0) + 1
            chunk_tf_list.append(term_counts)

            unique_terms = set(terms)
            for t in unique_terms:
                doc_freqs[t] = doc_freqs.get(t, 0) + 1

        # Calculate Query Vector
        query_tf = {}
        for t in query_terms:
            query_tf[t] = query_tf.get(t, 0) + 1

        query_vec = {}
        for t, tf in query_tf.items():
            idf = math.log((num_docs + 1) / (doc_freqs.get(t, 0) + 1)) + 1.0
            query_vec[t] = tf * idf

        # Calculate Cosine Similarity for each chunk
        scored_chunks = []
        for idx, chunk in enumerate(chunks):
            chunk_tf = chunk_tf_list[idx]
            chunk_vec = {}
            for t, tf in chunk_tf.items():
                idf = math.log((num_docs + 1) / (doc_freqs.get(t, 0) + 1)) + 1.0
                chunk_vec[t] = tf * idf

            score = self._cosine_similarity(query_vec, chunk_vec)
            
            # Boost score if query keywords appear in chunk exactly
            for q_term in set(query_terms):
                if q_term in chunk_tf:
                    score += 0.05

            scored_chunks.append((chunk, round(score, 4)))

        # Sort descending by similarity score
        scored_chunks.sort(key=lambda x: x[1], reverse=True)
        return scored_chunks[:top_k]

    def get_document_info(self, document_id: str) -> Optional[Dict[str, Any]]:
        return self.doc_metadata.get(document_id)

    def list_documents(self) -> List[Dict[str, Any]]:
        return list(self.doc_metadata.values())

    def _tokenize(self, text: str) -> List[str]:
        """Extract lowercase word tokens and n-grams."""
        words = re.findall(r'\b\w+\b', text.lower())
        bigrams = [f"{words[i]}_{words[i+1]}" for i in range(len(words)-1)]
        return words + bigrams

    def _cosine_similarity(self, vec1: Dict[str, float], vec2: Dict[str, float]) -> float:
        """Compute cosine similarity between two sparse vector dicts."""
        common = set(vec1.keys()) & set(vec2.keys())
        if not common:
            return 0.0

        dot_product = sum(vec1[k] * vec2[k] for k in common)
        mag1 = math.sqrt(sum(v ** 2 for v in vec1.values()))
        mag2 = math.sqrt(sum(v ** 2 for v in vec2.values()))

        if mag1 == 0 or mag2 == 0:
            return 0.0

        return dot_product / (mag1 * mag2)

# Global singleton VectorStore instance
vector_store = VectorStore()
