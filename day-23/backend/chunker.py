from typing import List

def split_transcript_into_chunks(transcript: str, max_words_per_chunk: int = 2000) -> List[str]:
    """Splits a long meeting transcript into coherent chunks preserving dialogue speaker lines."""
    lines = transcript.split('\n')
    chunks: List[str] = []
    current_chunk: List[str] = []
    current_word_count = 0

    for line in lines:
        line_words = len(line.split())
        if current_word_count + line_words > max_words_per_chunk and current_chunk:
            chunks.append("\n".join(current_chunk))
            current_chunk = [line]
            current_word_count = line_words
        else:
            current_chunk.append(line)
            current_word_count += line_words

    if current_chunk:
        chunks.append("\n".join(current_chunk))

    return chunks if chunks else [transcript]
