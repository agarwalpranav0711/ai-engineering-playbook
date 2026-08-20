# 🚀 Day 19 — AI Resume Reviewer

Transform unstructured candidate resumes and target job descriptions into **structured, evidence-backed AI match scorecards**, skill gap matrixes, bullet point rewrites, and actionable feedback — without inventing fake candidate experience or skills.

---

## 🎯 Architecture Overview

```
                          USER
                            │
                            ↓
               REACT 19 + VITE + TAILWIND
             (Upload PDF/TXT or Paste Text)
                            │
                            ↓
                   FASTAPI BACKEND API
                            │
               ┌────────────┴────────────┐
               ↓                         ↓
           pypdf Parser           Job Description
               │                         │
         Extracted Text                  │
               └────────────┬────────────┘
                            ↓
                     AI REVIEW ENGINE
               (Single Agent vs 4-Agent Team)
                            │
             ┌──────────────┼──────────────┐
             ↓              ↓              ↓
       Resume Analyst   Job Matcher      Critic
             │              │              │
             └──────────────┼──────────────┘
                            ↓
                     Final Reviewer
                            │
                            ↓
                    PYDANTIC MODEL
                     ResumeReview
                            │
                            ↓
                    STRUCTURED REPORT
             (Scores, Matrix, Bullet Rewrites)
```

---

## 🧱 Tech Stack & Frameworks

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite + Tailwind CSS v4 + Lucide Icons | Responsive glassmorphism dashboard with PDF dropzone, presets, and interactive report tabs |
| **Backend API** | Python 3.11 + FastAPI + Uvicorn | RESTful API backend for document parsing, analysis pipeline, and validation |
| **Data Validation** | Pydantic v2 (`models.py`) | Strict output schema (`ResumeData`, `JobDescription`, `ResumeReview`) |
| **PDF Extraction** | `pypdf` (`parser.py`) | Extracts text from uploaded `.pdf` resume files |
| **AI LLM Gateway** | OpenRouter API / OpenAI SDK (`reviewer.py`) | Flexible multi-model inference with deterministic offline heuristic fallback |
| **Multi-Agent Pipeline**| `multi_agent.py` | 4-Agent team collaboration (Analyst → Matcher → Critic → Final Reviewer) |
| **Testing** | `pytest` + `httpx` (`tests/test_reviewer.py`) | Automated verification suite for gaps, synonyms, and anti-hallucination guardrails |

---

## 🛡️ Anti-Hallucination Guardrails & Scoring Policy

1. **Evidence-Only Matching**: Strengths and matched skills cite explicit text from the candidate resume.
2. **Strict Missing Skill Detection**: Unstated skills required in the Job Description are flagged as `missing`. The system never assumes unmentioned candidate skills.
3. **Truthful Bullet Rewrites**: Bullet suggestions transform vague statements into impact-oriented work while keeping actual technical facts intact (no inventing fake metrics).
4. **Transparent AI Match Score**: Labeled explicitly as **AI Match Score** (not an official or universal ATS formula).

### Scoring Weight Rubric
- **Skills Match Score (30%)**: Ratio of required & preferred JD skills backed by resume evidence.
- **Experience Alignment (25%)**: Title alignment, domain depth, and responsibility relevance.
- **Project Relevance (20%)**: Demonstration of practical project work matching JD requirements.
- **Parseability & Layout (15%)**: Standard section headings, contact information presence, text density.
- **Impact & Bullet Quality (10%)**: Presence of action verbs and quantifiable outcomes.

---

## 🧪 Experiments & Verification Results

| Experiment / Test Case | Input Condition | Expected Behavior | Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **1. Strong Resume Test** | Full stack React + Node resume vs Frontend JD | Score ≥ 75, verified strengths in React/REST APIs | Score: 84/100, Strengths cited | ✅ PASSED |
| **2. Weak Resume Test** | Short resume with vague bullets vs same JD | Score drops significantly (< 70), missing skills flagged | Score: 49/100, Missing TypeScript/Docker flagged | ✅ PASSED |
| **3. Missing Skills Test** | Candidate lacks TypeScript & AWS | Flag TypeScript/AWS in missing skills | Flagged missing correctly | ✅ PASSED |
| **4. Synonym Matching** | Resume states `JS`, JD requires `JavaScript` | Match `JS` as `JavaScript` | Recognized synonym match | ✅ PASSED |
| **5. Anti-Hallucination** | Resume lacks Python, JD requires Python | Flag Python as missing; do NOT claim match | Flagged missing | ✅ PASSED |
| **6. Multi-Agent Team Mode**| 4-agent collaborative pipeline | Analyst → Matcher → Critic → Final Reviewer | Validated output generated | ✅ PASSED |

---

## 🚀 How to Run

### 1. Backend Setup (FastAPI)
```bash
cd day-19/backend
python -m venv venv
# On Windows:
venv\Scripts\activate
pip install -r requirements.txt

# (Optional) Copy .env.example and set your OpenRouter API key
cp .env.example .env

# Run FastAPI server
uvicorn main:app --reload --port 8000
```
Backend API interactive docs: `http://localhost:8000/docs`

### 2. Frontend Setup (React + Vite)
```bash
cd day-19/frontend
npm install
npm run dev
```
Open browser at: `http://localhost:3000`

### 3. Run Automated Tests
```bash
cd day-19
pytest tests/test_reviewer.py
```

---

## 💡 Key Learnings from Day 19

- **Combining Days 13–18**: Leveraged FastAPI backend (Day 13), React UI (Day 14), Pydantic typed schemas (Day 17), and Multi-Agent team workflows (Day 16/18).
- **Heuristic + LLM Hybrid**: Built robust fallback mechanisms ensuring the application operates reliably both with live LLMs and offline.
- **Pydantic Guardrails**: Prevented raw unstructured LLM text by enforcing validated output schemas.
