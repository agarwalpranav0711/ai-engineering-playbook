# 🚀 Day 21 — AI Code Reviewer

Transform raw source code into **structured multi-dimensional code reviews**, line-level bug detection, Big-O complexity profiling, security vulnerability audits, edge case generation, and refactored code rewrites.

---

## 🎯 Architecture Overview

```
                         AI CODE REVIEWER
                                │
               ┌────────────────┴────────────────┐
               ↓                                 ↓
        INPUT SOURCE CODE                REVIEW MODE SELECTOR
     (C++, Python, JS, Java)            (Full, DSA, Bugs, Security)
               │                                 │
               └────────────────┬────────────────┘
                                │
                                ▼
                       FASTAPI BACKEND API
                                │
                                ▼
                        AI REVIEW ENGINE
                  (OpenRouter LLM / Heuristic)
                                │
             ┌──────────────────┼──────────────────┐
             ↓                  ↓                  ↓
       Correctness & Bugs   Complexity        Security & Quality
             │                  │                  │
             └──────────────────┼──────────────────┘
                                │
                                ▼
                         PYDANTIC MODEL
                           CodeReview
                                │
                                ▼
                     STRUCTURED REVIEW REPORT
        (Scores, Severity Cards, Complexity, Test Cases, Code Diff)
```

---

## 🧱 Tech Stack & Frameworks

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite + Tailwind CSS v4 + Lucide Icons | Developer UI with line-numbered editor, language selector, presets, severity badges, and code diff view |
| **Backend API** | Python 3.11 + FastAPI + Uvicorn | RESTful API backend handling code review requests, schema validation, and mode routing |
| **Data Schemas** | Pydantic v2 (`models.py`) | Strict models (`Issue`, `Complexity`, `TestCase`, `CodeReview`, `ReviewRequest`, `ReviewResponse`) |
| **AI LLM Gateway** | OpenRouter API / OpenAI SDK (`reviewer.py`) | Multi-model code analysis with deterministic offline heuristic review fallback |
| **Testing** | `pytest` / Python Runner (`tests/test_reviewer.py`) | Automated test suite verifying bug detection, complexity analysis, security audits, and edge case generation |

---

## 🔬 10 Review Dimensions Analyzed

1. **Correctness & Logic Errors**: Null pointer handling, off-by-one errors, array index out of bounds.
2. **Time Complexity**: Big-O classification ($O(1)$, $O(\log n)$, $O(n)$, $O(n \log n)$, $O(n^2)$) with loop analysis.
3. **Space Complexity**: Auxiliary memory analysis.
4. **Security Vulnerabilities**: Hardcoded API keys, passwords, SQL injection, unsafe input handling.
5. **Code Quality**: Variable naming conventions, redundancy, magic numbers.
6. **Performance Optimization**: Inefficient nested loops, unnecessary allocations.
7. **Edge Cases**: Empty input, single element, negative values, duplicates, integer boundaries.
8. **Test Cases**: Generated input/output verification pairs.
9. **Line-Level Highlighting**: Pinpoints exact line numbers where issues occur.
10. **Refactored Code Rewrite**: Clean, fully working refactored code with itemized list of changes.

---

## 🧪 Experiments & Verification Results

| Test Case / Experiment | Input Code Snippet | Expected Behavior | Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **1. Buggy C++ Array** | `sum` with `for(i=0; i<=n; i++)` | Detect off-by-one out-of-bounds on Line 9; fix to `<` | Line 9 bug flagged; score 65 | ✅ PASSED |
| **2. Inefficient Loop** | Python `for i in range(n)` nested loop | Flag $O(n^2)$ time complexity bottleneck | $O(n^2)$ complexity detected | ✅ PASSED |
| **3. Vulnerable Secret** | Python `API_KEY = "sk-or-v1-..."` | Detect hardcoded secret vulnerability | High severity security alert | ✅ PASSED |
| **4. Clean Function** | C++ `int add(int a, int b)` | Score ≥ 90; return 0 bugs (no fake bugs) | Score: 98; 0 bugs flagged | ✅ PASSED |
| **5. Refactored Code** | Any code with bugs | Generate working improved code with changes list | Improved code diff rendered | ✅ PASSED |

---

## 🚀 How to Run

### 1. Backend Setup (FastAPI)
```bash
cd day-21/backend
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
cd day-21/frontend
npm install
npm run dev
```
Open browser at: `http://localhost:3000`

### 3. Run Automated Code Reviewer Tests
```bash
cd day-21
python tests/test_reviewer.py
```

---

## 💡 Key Learnings from Day 21

- **Pydantic Validation**: Forced LLM outputs to adhere to strict schemas, preventing unformatted free text.
- **Non-Inventive Guardrails**: Proved how prompts should allow empty lists (`bugs: []`) for clean code instead of inventing fake issues.
- **Line-Level Feedback**: Associating line numbers with severity cards creates genuine developer tool UI experience.
