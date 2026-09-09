# 🚀 Day 29 — Mini AI Copilot v2: Context & Reliability Improvement

An empirical AI evaluation and iterative improvement experiment turning Day 28's baseline application into a context-aware, highly reliable, and safety-verified **Mini AI Copilot v2**.

---

## 📊 Evaluation Summary & Results

We established a representative **20-test case evaluation suite** covering 4 distinct operational categories (scored 0–10 per test case, 200 total possible points):

| Version | Overall Score | Category A (Normal) | Category B (Context) | Category C (Tool Selection) | Category D (Safety) | Critical Safety Failures |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Day 28 Baseline (v0)** | **90.5%** (181/200) | 100.0% | 88.0% | 76.0% | 98.0% | **0** |
| **Day 29 Copilot v2 (v4)** | **99.0%** (198/200) | **100.0%** | **96.0%** | **100.0%** | **100.0%** | **0** |
| **Net Improvement** | **+8.5% Gain** | **Parity** | **+8.0% Gain** | **+24.0% Gain** | **+2.0% Gain** | **0 Failures** |

---

## 🎯 Target Improvements Implemented

1. **Smart Context Builder (`context_builder.py`)**:
   - Replaced raw state dumping with focused context isolation targeting the user's active item selection, view filters, and task summaries.
2. **Hard Tool Permission Boundaries & Safety Policy (`safety_policy.py`)**:
   - Defined READ, WRITE, and DESTRUCTIVE tool policies. Enforced mandatory human-in-the-loop approval intercepts for destructive actions (`delete_task`, `delete_note`).
3. **Unambiguous Tool Selection & Argument Validation (`tools.py`)**:
   - Added explicit selection target instructions (`update_task` targets active item ID) and strict keyword routing (`search_workspace`).
4. **Data/Instruction Boundary Defense (`prompts.py`)**:
   - Explicitly configured system prompts to treat task descriptions and note bodies strictly as passive DATA, preventing prompt injection attacks.
5. **Execution Telemetry Logger (`execution_logger.py`)**:
   - Structured JSON audit logging for request IDs, token usage context, tool calls, approval states, and latency.
6. **Frontend AI Evaluation Dashboard (`EvalDashboard.jsx`)**:
   - Embedded interactive UI dashboard displaying live benchmark scores, category radar breakdowns, and full 20-case test inspection logs.

---

## 📂 Project Architecture

```
day-29/
├── backend/
│   ├── main.py               # FastAPI endpoints (/api/copilot/chat, /api/copilot/eval/results, /api/copilot/eval/run)
│   ├── copilot_engine.py     # Refactored engine integrating ContextBuilder, SafetyPolicy & ExecutionLogger
│   ├── context_builder.py    # Smart workspace context isolation builder
│   ├── safety_policy.py      # READ/WRITE/DESTRUCTIVE tool permission policy
│   ├── execution_logger.py   # Telemetry & latency audit logger
│   ├── tools.py              # OpenRouter tool schemas & execution handlers
│   ├── prompts.py            # Structured system prompt with data boundaries
│   ├── models.py             # Pydantic schemas
│   └── requirements.txt
├── evaluation/
│   ├── test_cases.json       # 20 structured test cases (Categories A, B, C, D)
│   ├── scoring_rubric.py     # 5-dimension scoring engine (0-2 per dimension, max 10/test)
│   ├── eval_runner.py        # Automated benchmark evaluation suite runner
│   ├── results_v0_baseline.json # Day 28 baseline evaluation report
│   ├── results_v4_copilot_v2.json # Copilot v2 benchmark evaluation report
│   └── results.csv           # Historical metrics table
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EvalDashboard.jsx  # Visual evaluation benchmark & test inspector tab
│   │   │   ├── CopilotPanel.jsx   # Right AI Copilot drawer
│   │   │   ├── TaskBoard.jsx      # Task manager with context selection
│   │   │   ├── NoteEditor.jsx     # Note reader with task extraction
│   │   │   └── ApprovalCard.jsx   # Human approval modal
│   │   └── App.jsx                # Main layout with Evaluation tab
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## ⚡ Quick Start

### 1. Run Evaluation Benchmark (CLI)
```bash
cd day-29
python evaluation/eval_runner.py v4_copilot_v2
```

### 2. Run Backend API (FastAPI)
```bash
cd backend
python main.py
```

### 3. Run Frontend Web App (React 19 + Vite)
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) and click **Evaluation Benchmark** in the sidebar to view live metrics!
