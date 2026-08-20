import io
import re
from typing import Tuple, List
import pypdf

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extract raw text from PDF file bytes using pypdf."""
    try:
        pdf_file = io.BytesIO(pdf_bytes)
        reader = pypdf.PdfReader(pdf_file)
        text_pages = []
        for page_idx, page in enumerate(reader.pages):
            page_text = page.extract_text() or ""
            text_pages.append(page_text)
        raw_text = "\n".join(text_pages)
        return clean_resume_text(raw_text)
    except Exception as e:
        raise ValueError(f"Failed to parse PDF file: {str(e)}")

def clean_resume_text(text: str) -> str:
    """Clean extracted resume text while preserving line breaks and section structure."""
    if not text:
        return ""
    # Normalize newline breaks
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    # Remove control characters except tab and newline
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]', '', text)
    # Collapse multiple blank lines
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def detect_parsing_concerns(text: str) -> List[str]:
    """Detect potential ATS parseability concerns based on heuristic text inspection."""
    concerns = []
    
    if len(text.strip()) < 100:
        concerns.append("Potential Parsing Risk: Extremely short text extracted. PDF may contain images/scans instead of selectable text.")
        
    # Check contact info
    email_regex = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    phone_regex = r'(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    
    if not re.search(email_regex, text):
        concerns.append("Missing Contact Info: No email address detected in extracted resume text.")
    if not re.search(phone_regex, text):
        concerns.append("Missing Contact Info: No phone number detected in extracted resume text.")
        
    # Check standard section headings
    text_lower = text.lower()
    headings = ["education", "experience", "projects", "skills"]
    missing_headings = [h for h in headings if h not in text_lower]
    if missing_headings:
        concerns.append(f"Non-standard Layout: Missing explicit standard headings: {', '.join(missing_headings)}.")

    # Check for potential multi-column table output artifacts (e.g. side-by-side fragmented text)
    lines = text.split('\n')
    short_line_count = sum(1 for line in lines if 0 < len(line.strip()) < 15)
    if len(lines) > 20 and (short_line_count / len(lines)) > 0.4:
        concerns.append("Potential Parsing Risk: High density of fragmented short lines detected. Resume may use multi-column tables or complex graphical layouts.")
        
    return concerns
