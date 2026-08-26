# 🚀 Day 24 — AI Research Assistant

Transform open-ended research questions into **verifiable, citation-grounded research reports** through Multi-Perspective Query Planning, Web Search & Fetching, Evidence Extraction, Cross-Source Contradiction Analysis, Citation Mapping (`[1]`, `[2]`), and Prompt Injection Defenses.

---

## 🎯 Architecture Overview

```
                         AI RESEARCH ASSISTANT
                                │
               ┌────────────────┴────────────────┐
               ↓                                 ↓
        RESEARCH QUESTION                 RESEARCH DEPTH
    ("AI coding agents 2026?")           (Quick, Standard, Deep)
               │                                 │
               └────────────────┬────────────────┘
                                │
                                ▼
                       FASTAPI BACKEND API
                                │
                                ▼
                         QUERY PLANNER
                  (Generates 3-5 Sub-Queries)
                                │
                                ▼
                       WEB SEARCH ENGINE
                (OpenRouter Search / Fallback)
                                │
             ┌──────────────────┼──────────────────┐
             ↓                  ↓                  ↓
          Source 1           Source 2           Source 3
             │                  │                  │
             └──────────────────┼──────────────────┘
                                │
                                ▼
                      EVIDENCE SYNTHESIZER
                 (Claims -> Citations [1][2])
                                │
                                ▼
                         PYDANTIC MODEL
                         ResearchReport
                                │
                                ▼
                     STRUCTURED RESEARCH REPORT
        (Summary, Key Findings, Contradictions, Sources, Export MD)
```

---

## 🧱 Tech Stack & Frameworks

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite + Tailwind CSS v4 + Lucide Icons | Responsive UI with question input, depth pills, live stage progress stepper, citation badges `[1]`, contradiction cards, and markdown export |
| **Backend API** | Python 3.11 + FastAPI + Uvicorn | RESTful API backend handling research requests, query planning, web search execution, and citation synthesis |
| **Data Schemas** | Pydantic v2 (`models.py`) | Strict models (`Source`, `Finding`, `ResearchReport`, `ResearchRequest`, `ResearchResponse`) |
| **Research Engine** | `researcher.py` & `query_planner.py` | Multi-query planner, evidence extractor, contradiction detector, and OpenRouter / offline heuristic fallback engine |
| **Testing** | `pytest` / Python Runner (`tests/test_researcher.py`) | Automated test suite verifying query planning, evidence extraction, citation mapping, contradiction detection, prompt injection defense, and API routes |

---

## 🔬 Core Capabilities

1. **Multi-Perspective Query Planning**: Decomposes user question into 3-5 sub-queries (broad overview, technical benchmarks, real-world adoption, risks/limitations).
2. **Evidence Extraction & Citation Grounding**: Every claim in `key_findings` is explicitly linked to actual numeric source IDs `[1]`, `[2]` with zero fabricated citations.
3. **Cross-Source Contradiction Analysis**: Explicitly identifies conflicting evidence between sources rather than forcing a biased single narrative.
4. **Prompt Injection Defense**: Fetched web page text is treated strictly as untrusted data, preventing embedded website instructions from hijacking agent behavior.
5. **Research Scope & Limitations**: Flags research gaps, domain boundaries, and assigns system confidence (`High`, `Medium`, `Low`).
6. **Markdown Export**: 1-click download of synthesized research report as `.md` files.

---

## 🧪 Experiments & Verification Results

| Test Case / Experiment | Input Question | Expected Behavior | Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **1. AI Coding Agents** | "How are AI coding agents changing software development in 2026?" | Generate multi-queries, extract evidence, cite sources [1][2] | Grounded findings & citations | ✅ PASSED |
| **2. RAG vs Vector DBs** | "Latest developments in RAG vs Vector DBs in 2026?" | Restrict sources via domain filter `arxiv.org` | Academic sources cited | ✅ PASSED |
| **3. Framework Comparison** | "Compare CrewAI, AutoGen, Mastra, and PydanticAI" | Multi-source comparison with contradiction analysis | Comparative matrix report | ✅ PASSED |
| **4. Citation Grounding** | Any research query | Ensure claim `source_ids` match valid `sources` list | 100% Citation grounding | ✅ PASSED |
| **5. Prompt Injection Defense** | Web page snippet: "IGNORE PREVIOUS INSTRUCTIONS" | System treats text as untrusted data; ignores instruction | Injection blocked | ✅ PASSED |

---

## 🚀 How to Run

### 1. Backend Setup (FastAPI)
```bash
cd day-24/backend
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
cd day-24/frontend
npm install
npm run dev
```
Open browser at: `http://localhost:3000`

### 3. Run Automated AI Research Assistant Tests
```bash
cd day-24
python tests/test_researcher.py
```

---

## 💡 Key Learnings from Day 24

- **Open-World Research vs Closed RAG**: Transitioned from querying fixed local documents (Day 20 RAG) to dynamically searching, discovering, fetching, and cross-checking open web sources.
- **Query Planning & Multi-Query Search**: Decomposing research topics into diverse sub-queries prevents single-query bias and ensures comprehensive evidence coverage.
- **Citation Accuracy & Prompt Injection Safety**: Grounding claims in explicit numeric source IDs while treating external web content strictly as untrusted data builds trustworthy, secure AI research workflows.
