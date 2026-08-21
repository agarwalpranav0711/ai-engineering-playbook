import io
import re
from typing import List, Dict, Any
import pypdf

def parse_pdf_pages(pdf_bytes: bytes) -> List[Dict[str, Any]]:
    """
    Extract text page by page from PDF bytes using pypdf.
    Returns list of dicts: [{'page_number': 1, 'text': '...'}, ...]
    """
    try:
        pdf_file = io.BytesIO(pdf_bytes)
        reader = pypdf.PdfReader(pdf_file)
        pages_data = []

        for page_idx, page in enumerate(reader.pages):
            raw_page_text = page.extract_text() or ""
            clean_text = clean_page_text(raw_page_text)
            if clean_text:
                pages_data.append({
                    "page_number": page_idx + 1,
                    "text": clean_text
                })

        return pages_data
    except Exception as e:
        raise ValueError(f"Failed to parse PDF pages: {str(e)}")

def clean_page_text(text: str) -> str:
    """Normalize whitespace and line breaks while preserving paragraph boundaries."""
    if not text:
        return ""
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    # Remove control characters except tab and newline
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]', '', text)
    # Replace multiple spaces with a single space
    text = re.sub(r'[ \t]+', ' ', text)
    # Collapse 3+ consecutive newlines to 2
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()
