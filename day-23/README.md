# 🚀 Day 23 — AI Meeting Summarizer

Transform raw meeting transcripts into **structured meeting intelligence**, extracting Executive Summaries, Key Points, Agreed Decisions (distinguished from suggestions), Action Items with Assignees & Deadlines, Risks & Blockers, Open Questions, Next Steps, and Participants.

---

## 🎯 Architecture Overview

```
                         AI MEETING SUMMARIZER
                                │
               ┌────────────────┴────────────────┐
               ↓                                 ↓
        INPUT TRANSCRIPT                  MEETING TYPE & LENGTH
      (Rahul, Pranav, Kriti)           (Project, Standup, Short/Detailed)
               │                                 │
               └────────────────┬────────────────┘
                                │
                                ▼
                       FASTAPI BACKEND API
                                │
                        SIZE CHECK & STRATEGY
                       /                    \
              Small (<3000 w)           Large (>3000 w)
                    │                          │
                    ▼                          ▼
               Direct LLM               Map-Reduce Chunker
                    │                     (Chunk -> Summarize -> Combine)
                    └───────────┬──────────────┘
                                │
                                ▼
                         PYDANTIC MODEL
                         MeetingSummary
                                │
                                ▼
                     STRUCTURED MEETING REPORT
      (Decisions, Action Items Table, Risks, Questions, Export MD/TXT)
```

---

## 🧱 Tech Stack & Frameworks

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite + Tailwind CSS v4 + Lucide Icons | Responsive UI with transcript editor, meeting type/length selector, sample presets, action items table, copy & markdown export |
| **Backend API** | Python 3.11 + FastAPI + Uvicorn | RESTful API backend handling transcript summarization, strategy selection, and export formatting |
| **Data Schemas** | Pydantic v2 (`models.py`) | Strict models (`ActionItem`, `Decision`, `MeetingSummary`, `SummarizeRequest`, `SummarizeResponse`) |
| **Summarizer Engine** | `summarizer.py` & `chunker.py` | Direct LLM pass & Map-Reduce hierarchical chunker with OpenRouter & offline heuristic evaluator fallback |
| **Testing** | `pytest` / Python Runner (`tests/test_summarizer.py`) | Automated test suite verifying decision vs suggestion distinction, action item assignees, participant safety, map-reduce strategy, and API routes |

---

## 🔬 Core Capabilities & Extraction Rules

1. **Executive Summary**: Narrative overview of meeting purpose, key topics, and outcomes.
2. **Decisions vs Suggestions**: Strict system prompt rules distinguish tentative proposals ("Maybe we launch Friday") from confirmed agreements ("We decided to launch Friday").
3. **Action Items Table**: Extracts structured tasks (`task`, `assignee` or `"Unassigned"`, `deadline` or `"Not specified"`, `status`: `"pending"`).
4. **Risks & Blockers**: Identifies explicit technical risks, dependencies, or incomplete prerequisite tasks.
5. **Open Questions**: Highlights unresolved questions needing clarification.
6. **Participants Safety**: Includes ONLY active speakers present in the transcript dialogue.
7. **Map-Reduce Chunker**: Long transcripts (>3000 words) are automatically chunked into 2000-word blocks, summarized in parallel, and synthesized into a master report.
8. **Markdown Export**: 1-click download of formatted meeting notes as `.md` files.

---

## 🧪 Experiments & Verification Results

| Test Case / Experiment | Input Transcript | Expected Behavior | Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **1. Project Launch** | Dialogue between Rahul, Pranav, Kriti | Extract decision (launch Friday), action item (Pranav -> Wednesday) | Decision & task extracted | ✅ PASSED |
| **2. Daily Standup** | Short standup meeting transcript | Classify standup type, extract blockers | Standup summary generated | ✅ PASSED |
| **3. Client Meeting** | Client & developer requirements discussion | Extract client requests, delivery deadline, next steps | Client requirements captured | ✅ PASSED |
| **4. Long Transcript** | Transcript > 3,000 words | Trigger `hierarchical_map_reduce` chunking strategy | Map-Reduce executed | ✅ PASSED |
| **5. Unassigned Task** | "Someone should update docs" | Set `assignee`: `"Unassigned"` (no hallucinated name) | Assignee: Unassigned | ✅ PASSED |
| **6. Unstated Deadline** | "Pranav, please test soon" | Set `deadline`: `"Not specified"` (no fake date) | Deadline: Not specified | ✅ PASSED |

---

## 🚀 How to Run

### 1. Backend Setup (FastAPI)
```bash
cd day-23/backend
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
cd day-23/frontend
npm install
npm run dev
```
Open browser at: `http://localhost:3000`

### 3. Run Automated Meeting Summarizer Tests
```bash
cd day-23
python tests/test_summarizer.py
```

---

## 💡 Key Learnings from Day 23

- **Meeting Intelligence vs Text Shortening**: Summarizing meetings requires classifying decisions, action items, assignees, and deadlines—not merely compressing text.
- **Hierarchical Map-Reduce Strategy**: Handling long context windows via chunking and parallel summarization guarantees reliability on long transcripts without exceeding context limits.
- **Factual Grounding Guardrails**: Forcing unstated fields to `"Unassigned"` or `"Not specified"` prevents LLMs from fabricating tasks or deadlines.
