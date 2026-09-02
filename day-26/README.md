# 🚀 Day 26 — Image Caption Generator

Transform uploaded images (`PNG`, `JPEG`, `WEBP`) into **rich, structured vision reports** through Multimodal Computer Vision, Base64 Data URL encoding (`image_url`), Pydantic schema validation, style customization, accessibility alt text, and Visual Q&A.

---

## 🎯 Architecture Overview

```
                     IMAGE CAPTION GENERATOR
                                │
               ┌────────────────┴────────────────┐
               ↓                                 ↓
      BROWSER FILE INPUT                 DRAG & DROP DROPZONE
   (<input type="file">)                 (DragEvent Handling)
               │                                 │
               └────────────────┬────────────────┘
                                │
                                ▼
                       FASTAPI BACKEND API
                                │
                                ▼
                     IMAGE VALIDATION & BASE64
                 (Max 10MB, PNG/JPEG/WEBP check)
                                │
                                ▼
                     VISION-CAPABLE LLM API
                (OpenRouter image_url content)
                                │
                                ▼
                         PYDANTIC MODEL
                          ImageCaption
                                │
                                ▼
                     STRUCTURED VISION REPORT
      (Caption, Description, Objects, Scene, Colors, Alt Text, Visual Q&A)
```

---

## 🧱 Tech Stack & Frameworks

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite + Tailwind CSS v4 + Lucide Icons | Responsive UI with drag-and-drop dropzone, `URL.createObjectURL()` preview player, style pills, objects list, alt text box, visual Q&A, and markdown export |
| **Backend API** | Python 3.11 + FastAPI + Uvicorn | RESTful API server handling image upload validation (`/api/caption`, `/api/ask-image`), base64 encoding, and vision prompt synthesis |
| **Data Schemas** | Pydantic v2 (`models.py`) | Strict models (`ImageCaption`, `CaptionResponse`, `QuestionRequest`, `QuestionResponse`) |
| **Vision Engine** | `vision.py`, `image.py`, `prompts.py` | Image validator, Pillow dimensions inspector, Base64 Data URL converter, OpenRouter Vision Chat Completions integration, and offline heuristic fallback |
| **Testing** | `pytest` / Python Runner (`tests/test_caption.py`) | Automated test suite verifying image validation, base64 encoding, vision prompt synthesis, style variations, anti-hallucination compliance, and API routes |

---

## 🔬 Core Capabilities

1. **Multimodal Computer Vision Input**: Sends Base64 Data URLs (`data:image/jpeg;base64,...`) via OpenRouter Chat Completions API with `image_url` content blocks.
2. **Structured Vision Analysis**: Synthesizes Concise Caption, Detailed Description, Main Visible Objects, Scene/Setting, Dominant Colors, Mood, Accessibility Alt Text, and OCR text.
3. **Accessibility Alt Text**: Generates objective screen-reader descriptions specifically formatted for web accessibility compliance.
4. **Caption Style Customization**: Supports styles (`Descriptive`, `Short`, `Social Media`, `Professional`, `Accessibility`, `Technical`) plus custom prompt instructions.
5. **Interactive Visual Q&A**: Answers custom user questions directly about the image (e.g. "What color is the mug?", "What is on the desk?").
6. **Anti-Hallucination Guardrails**: Unreadable text or ambiguous elements default to `'Unclear/unreadable text'` rather than being invented.
7. **Markdown Export**: 1-click download of synthesized vision reports as `.md` files.

---

## 🧪 Experiments & Verification Results

| Test Case / Experiment | Input Image / Request | Expected Behavior | Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **1. Coffee Shop Workspace** | `coffee-shop-person.jpg` | Extract caption (working on laptop), objects (mug, laptop), scene | Structured vision report | ✅ PASSED |
| **2. Bar Chart Analysis** | `developer-chart.png` | Identify chart type (bar chart), metrics, axis labels | Data graphic analyzed | ✅ PASSED |
| **3. Store Receipt OCR** | `store-receipt.png` | Extract visible text subtotal, tax breakdown, and item names | Visible OCR text extracted | ✅ PASSED |
| **4. Visual Q&A** | "What color is the car?" | Perform visual reasoning and answer specific question | Accurate answer generated | ✅ PASSED |
| **5. Caption Style Variations** | Style: `Social Media` | Add engaging tone & hashtags (`#AIVision #TechIn2026`) | Style-aligned output | ✅ PASSED |

---

## 🚀 How to Run

### 1. Backend Setup (FastAPI)
```bash
cd day-26/backend
python -m venv venv
# On Windows:
venv\Scripts\activate
pip install -r requirements.txt

# (Optional) Copy .env.example and set your OpenRouter API key
cp .env.example .env

# Run FastAPI server
python -m uvicorn main:app --reload --port 8000
```
Backend API docs: `http://localhost:8000/docs`

### 2. Frontend Setup (React + Vite)
```bash
cd day-26/frontend
npm install
npm run dev
```
Open browser at: `http://localhost:3000`

### 3. Run Automated Image Caption Generator Tests
```bash
cd day-26
python tests/test_caption.py
```

---

## 💡 Key Learnings from Day 26

- **Multimodal AI Input**: Vision-capable models receive multimodal arrays containing text prompts alongside `image_url` data blocks.
- **Base64 Data URLs**: Local image bytes can be safely converted to base64 Data URLs (`data:image/png;base64,...`) for direct API consumption without external public hosting.
- **Accessibility vs Captioning**: Social media captions emphasize engaging tone, while accessibility alt text prioritizes objective visual descriptions for screen readers.
