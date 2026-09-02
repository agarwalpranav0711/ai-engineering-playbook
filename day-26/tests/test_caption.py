import sys
import os
import json
import pytest
from fastapi.testclient import TestClient
from starlette.datastructures import Headers
from PIL import Image
import io

# Add backend directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from main import app
from image import validate_and_encode_image
from fastapi import HTTPException, UploadFile

client = TestClient(app)

SAMPLE_DIR = os.path.join(os.path.dirname(__file__), "..", "sample-data")

def create_dummy_png_bytes(width: int = 100, height: int = 100) -> bytes:
    img = Image.new("RGB", (width, height), color="red")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "vision_model" in data

def test_image_validation_size_format():
    # Test empty file
    dummy_file = UploadFile(filename="empty.png", file=io.BytesIO(b""))
    with pytest.raises(HTTPException) as exc_info:
        validate_and_encode_image(dummy_file, b"")
    assert exc_info.value.status_code == 400

    # Test unsupported text format
    dummy_file_txt = UploadFile(
        filename="test.txt",
        file=io.BytesIO(b"hello text"),
        headers=Headers({"content-type": "text/plain"})
    )
    with pytest.raises(HTTPException) as exc_info2:
        validate_and_encode_image(dummy_file_txt, b"hello text")
    assert exc_info2.value.status_code == 400

def test_base64_data_url_encoding():
    img_bytes = create_dummy_png_bytes(200, 150)
    dummy_file = UploadFile(
        filename="sample.png",
        file=io.BytesIO(img_bytes),
        headers=Headers({"content-type": "image/png"})
    )

    data_url, mime_type, w, h = validate_and_encode_image(dummy_file, img_bytes)
    assert data_url.startswith("data:image/png;base64,")
    assert mime_type == "image/png"
    assert w == 200
    assert h == 150

def test_generate_caption_coffee_shop():
    img_bytes = create_dummy_png_bytes(300, 200)
    files = {"file": ("coffee-shop.jpg", img_bytes, "image/jpeg")}
    data = {"style": "descriptive", "custom_instruction": "Highlight cozy elements"}
    
    res = client.post("/api/caption", files=files, data=data)
    assert res.status_code == 200
    res_data = res.json()
    assert res_data["success"] is True
    analysis = res_data["analysis"]
    assert len(analysis["caption"]) > 0
    assert len(analysis["detailed_description"]) > 0
    assert isinstance(analysis["objects"], list)
    assert len(analysis["alt_text"]) > 0

def test_visual_qa_asking_question():
    img_bytes = create_dummy_png_bytes(300, 200)
    files = {"file": ("chart.png", img_bytes, "image/png")}
    data = {"question": "What is the main subject of this image?"}

    res = client.post("/api/ask-image", files=files, data=data)
    assert res.status_code == 200
    res_data = res.json()
    assert res_data["success"] is True
    assert len(res_data["answer"]) > 0

if __name__ == "__main__":
    print("Running Day 26 Image Caption Generator Test Suite...")
    test_health_endpoint()
    print("[PASSED] test_health_endpoint")
    test_image_validation_size_format()
    print("[PASSED] test_image_validation_size_format")
    test_base64_data_url_encoding()
    print("[PASSED] test_base64_data_url_encoding")
    test_generate_caption_coffee_shop()
    print("[PASSED] test_generate_caption_coffee_shop")
    test_visual_qa_asking_question()
    print("[PASSED] test_visual_qa_asking_question")
    print("ALL DAY 26 IMAGE CAPTION GENERATOR TESTS PASSED SUCCESSFULLY!")
