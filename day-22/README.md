# 🚀 Day 22 — AI Email Writer

Transform situation contexts and user intents into **polished, professional emails** with strict anti-hallucination factual grounding, tone controls, length adjustment, subject line alternatives, and 1-click rewrites.

---

## 🎯 Architecture Overview

```
                         AI EMAIL WRITER
                                │
               ┌────────────────┴────────────────┐
               ↓                                 ↓
        GUIDED FORM INPUT                NATURAL INTENT INPUT
     (Recipient, Purpose, Context)      ("Ask prof for 2-day extension")
               │                                 │
               └────────────────┬────────────────┘
                                │
                                ▼
                       FASTAPI BACKEND API
                                │
                                ▼
                       AI GENERATION ENGINE
                  (OpenRouter LLM / Heuristic)
                                │
             ┌──────────────────┼──────────────────┐
             ↓                  ↓                  ↓
       Subject Line       Email Body Text      Alternatives
             │                  │                  │
             └──────────────────┼──────────────────┘
                                │
                                ▼
                         PYDANTIC MODEL
                         EmailResponse
                                │
                                ▼
                     STRUCTURED EMAIL DISPLAY
        (Subject, Body, Copy Button, Controlled Rewriting Toolbar)
```

---

## 🧱 Tech Stack & Frameworks

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite + Tailwind CSS v4 + Lucide Icons | Responsive UI with guided input form, natural intent mode, tone/length pill selectors, copy-to-clipboard, and rewrite action toolbar |
| **Backend API** | Python 3.11 + FastAPI + Uvicorn | RESTful API backend handling email generation, natural intent extraction, and email rewriting endpoints |
| **Data Schemas** | Pydantic v2 (`models.py`) | Strict models (`EmailRequest`, `EmailResponse`, `RewriteRequest`, `IntentExtractRequest`, `ExtractedIntentResponse`) |
| **AI LLM Gateway** | OpenRouter API / OpenAI SDK (`generator.py`) | Multi-model email synthesis with anti-hallucination rules & offline heuristic generator fallback |
| **Testing** | `pytest` / Python Runner (`tests/test_email_writer.py`) | Automated test suite verifying generation, tone variations, rewrite instructions, anti-hallucination guardrails, and API routes |

---

## 🔬 Core Capabilities

1. **Strict Factual Grounding**: System prompt prevents inventing unsupplied personal details, dates, companies, achievements, or attachments.
2. **Tone Controls**: Supports `professional`, `friendly`, `formal`, `casual`, `confident`, `persuasive`, `apologetic`, and `concise` writing styles.
3. **Length Adjustments**: Supports `short` (2-4 direct sentences), `medium` (2 paragraphs), and `detailed` (3-4 thorough paragraphs).
4. **Subject Line Alternatives**: Generates a primary subject line plus 2-3 alternative subject line options.
5. **Controlled Rewriting**: 1-click action pills (**"Make Professional"**, **"Make Friendly"**, **"Make Concise"**, **"Make Detailed"**, **"Fix Grammar"**).
6. **Dual Input Modes**: Guided Form Mode (structured controls) + Natural Language Intent Extraction Mode.

---

## 🧪 Experiments & Verification Results

| Test Case / Experiment | Input Situation | Expected Behavior | Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **1. Academic Extension** | Professor Sharma, fever, need 2 days | Generate academic email with subject & alternatives | Subject & body generated | ✅ PASSED |
| **2. Job Follow-up** | Interviewed last Friday for Software role | Confident tone, follow-up subject, no fake details | Follow-up draft generated | ✅ PASSED |
| **3. Cold Networking** | Virtual coffee chat request to Senior AI Eng | Short length, friendly tone, concise request | Short coffee chat request | ✅ PASSED |
| **4. Concise Rewrite** | Longer email body + `make_concise` instruction | Reduce length while preserving core intent | Concise rewrite produced | ✅ PASSED |
| **5. Natural Intent Mode** | "Ask professor for 2-day extension on assignment" | Extract recipient, purpose, tone into form fields | Intent extracted cleanly | ✅ PASSED |
| **6. Anti-Hallucination** | User context: "sick with fever" | AI does NOT invent fake medical names or dates | Factually grounded | ✅ PASSED |

---

## 🚀 How to Run

### 1. Backend Setup (FastAPI)
```bash
cd day-22/backend
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
cd day-22/frontend
npm install
npm run dev
```
Open browser at: `http://localhost:3000`

### 3. Run Automated Email Writer Tests
```bash
cd day-22
python tests/test_email_writer.py
```

---

## 💡 Key Learnings from Day 22

- **Controlled Generation vs Raw Prompting**: Passing structured parameters (Tone, Length, Recipient, Purpose, Context) creates drastically higher quality emails than generic "write an email" prompts.
- **Anti-Hallucination System Rules**: Explicit prompt constraints ensure LLMs stick strictly to user-supplied facts without making fake promises or fabricating details.
- **Controlled Rewriting**: Implementing 1-click transformation endpoints empowers users to iterate on email tone and conciseness effortlessly.
