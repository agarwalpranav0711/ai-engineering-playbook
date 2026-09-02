import base64
import io
from PIL import Image
from fastapi import UploadFile, HTTPException
from typing import Tuple

MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

ALLOWED_IMAGE_MIME_TYPES = {
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/gif"
}

def validate_and_encode_image(file: UploadFile, contents: bytes) -> Tuple[str, str, int, int]:
    """Validates image file size, format, extracts dimensions, and returns base64 Data URL."""
    if not contents or len(contents) == 0:
        raise HTTPException(status_code=400, detail="Empty image file provided.")

    if len(contents) > MAX_IMAGE_SIZE_BYTES:
        max_mb = MAX_IMAGE_SIZE_BYTES // (1024 * 1024)
        raise HTTPException(
            status_code=400,
            detail=f"Image file size ({len(contents) / (1024*1024):.1f}MB) exceeds limit of {max_mb}MB."
        )

    content_type = (file.content_type or "").lower().split(";")[0].strip()
    filename = (file.filename or "").lower()

    is_valid_type = (content_type in ALLOWED_IMAGE_MIME_TYPES) or any(
        filename.endswith(ext) for ext in [".png", ".jpg", ".jpeg", ".webp", ".gif"]
    )

    if not is_valid_type:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported image type '{content_type}'. Allowed formats: PNG, JPEG, WEBP, GIF."
        )

    # Determine MIME type string
    mime_type = "image/jpeg"
    if "png" in content_type or filename.endswith(".png"):
        mime_type = "image/png"
    elif "webp" in content_type or filename.endswith(".webp"):
        mime_type = "image/webp"
    elif "gif" in content_type or filename.endswith(".gif"):
        mime_type = "image/gif"

    # Inspect image dimensions with Pillow
    try:
        pil_img = Image.open(io.BytesIO(contents))
        width, height = pil_img.size
    except Exception as e:
        print(f"Pillow image inspection warning: {e}. Using default dimensions.")
        width, height = 800, 600

    # Base64 Encode
    base64_str = base64.b64encode(contents).decode("utf-8")
    data_url = f"data:{mime_type};base64,{base64_str}"

    return data_url, mime_type, width, height
