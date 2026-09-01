from fastapi import UploadFile, HTTPException

MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024  # 25 MB

ALLOWED_MIME_TYPES = {
    "audio/webm",
    "audio/wav",
    "audio/x-wav",
    "audio/mp3",
    "audio/mpeg",
    "audio/ogg",
    "audio/m4a",
    "audio/x-m4a",
    "video/webm",
    "application/octet-stream"
}

def validate_audio_file(file: UploadFile, contents: bytes) -> bool:
    """Validates audio file size and content type."""
    if not contents or len(contents) == 0:
        raise HTTPException(status_code=400, detail="Empty audio file provided.")

    if len(contents) > MAX_FILE_SIZE_BYTES:
        max_mb = MAX_FILE_SIZE_BYTES // (1024 * 1024)
        raise HTTPException(
            status_code=400,
            detail=f"Audio file size ({len(contents) / (1024*1024):.1f}MB) exceeds maximum limit of {max_mb}MB."
        )

    # Check content type if specified
    content_type = (file.content_type or "").lower().split(";")[0].strip()
    filename = (file.filename or "").lower()
    
    is_valid_type = (content_type in ALLOWED_MIME_TYPES) or any(
        filename.endswith(ext) for ext in [".webm", ".wav", ".mp3", ".m4a", ".ogg", ".aac"]
    )

    if not is_valid_type:
        print(f"Warning: Unusual audio content type '{content_type}' for filename '{filename}'. Allowing processing.")

    return True
