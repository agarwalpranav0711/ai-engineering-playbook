# 🚀 DAY 27 — SIMPLE AI WORKFLOW BUILDER

> A visual graph editor and execution engine built from scratch to understand AI workflow orchestration, node execution, and DAG pipeline concepts.

---

## 🎯 What is this Project?

Instead of hardcoding prompt pipelines in single scripts or giant text boxes, modern AI frameworks (such as **Langflow** and **Mastra**) use visual node graphs where operations are encapsulated inside connected components.

This project is a lightweight, educational **Simple AI Workflow Builder** built from scratch using **React 19 + Vite + React Flow (@xyflow/react)** on the frontend and **FastAPI + Pydantic v2 + OpenRouter** on the backend.

```text
┌─────────────┐       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ Input Node  │  ───► │ Prompt Node │  ───► │   AI Node   │  ───► │ Output Node │
└─────────────┘       └─────────────┘       └─────────────┘       └─────────────┘
```

---

## 🧠 Key Concepts & Learning Objectives

1. **Workflow Orchestration**: Multi-step AI task execution where data flows sequentially or through complex DAG networks.
2. **Nodes**: Independent units of computation (`Input`, `Prompt`, `AI`, `Output`).
3. **Edges & Ports**: Connectors linking source output handles to target input handles.
4. **Variable Substitution**: Dynamic variable template resolution (`{{topic}}`, `{{text}}`, `{{message}}`).
5. **DAG Enforcer**: Directed Acyclic Graph validation enforcing no infinite execution cycles.
6. **Graph Serialization**: Converting visual UI graphs into structured `Workflow JSON`.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + Vite
- **Visual Graph Canvas**: `@xyflow/react` (React Flow v12)
- **Styling**: Vanilla Tailwind CSS v4 (Glassmorphism dark theme)
- **Icons**: Lucide React

### Backend
- **Framework**: Python 3.11 + FastAPI
- **Schemas**: Pydantic v2 (`WorkflowNode`, `WorkflowEdge`, `Workflow`, `ExecutionResponse`)
- **LLM Provider**: OpenRouter API (`openai` client)
- **Validation Engine**: Topological Sort (Kahn's Algorithm) + Heuristic Fallback Engine

---

## 📦 Project Directory Structure

```text
day-27/
├── README.md
├── backend/
│   ├── main.py              # FastAPI endpoints (/api/workflow/run, /api/health)
│   ├── executor.py          # DAG validator, Kahn's topo sort, variable substitution & execution
│   ├── models.py            # Pydantic schemas for graph nodes, edges, and execution requests
│   ├── prompts.py           # System prompts and offline fallback templates
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # OpenRouter API key template
│   └── .env                 # Environment variables
├── frontend/
│   ├── package.json         # React 19, @xyflow/react, Tailwind v4
│   ├── vite.config.js       # Vite configuration with backend proxy
│   ├── index.html           # Dark theme HTML root
│   ├── src/
│   │   ├── main.jsx         # React DOM root
│   │   ├── index.css        # Tailwind & custom React Flow styles
│   │   ├── api.js           # API fetch helpers
│   │   ├── App.jsx          # App container & graph state manager
│   │   ├── components/
│   │   │   ├── Header.jsx           # Navbar, preset loader, save/load, run button
│   │   │   ├── NodePanel.jsx        # Left palette for adding nodes
│   │   │   ├── WorkflowCanvas.jsx   # React Flow interactive canvas
│   │   │   ├── SettingsPanel.jsx    # Right node inspector/editor
│   │   │   └── ExecutionResult.jsx  # Bottom result drawer & JSON modal
│   │   └── nodes/
│   │       ├── InputNode.jsx        # Custom Input component
│   │       ├── PromptNode.jsx       # Custom Prompt component
│   │       ├── AINode.jsx           # Custom AI model component
│   │       └── OutputNode.jsx       # Custom Output terminal component
├── sample-data/
│   ├── basic.json           # Sample 1: Input -> Prompt -> AI -> Output
│   ├── summarizer.json      # Sample 2: Text Summarization Workflow
│   ├── translator.json      # Sample 3: Hindi Translation Workflow
│   ├── email.json           # Sample 4: Professional Email Generator
│   └── multi-ai.json        # Sample 5: Multi-AI Pipeline (Draft -> Refine)
└── tests/
    └── test_workflow.py     # 5 Pytest unit/integration test cases
```

---

## ⚡ Quick Start & How to Run

### 1. Run Backend Server
```bash
cd day-27/backend
pip install -r requirements.txt
python main.py
```
*Backend runs at: `http://localhost:8000` (API Docs at `http://localhost:8000/docs`)*

### 2. Run Frontend Web App
```bash
cd day-27/frontend
npm install
npm run dev
```
*Frontend runs at: `http://localhost:5173`*

### 3. Run Automated Test Suite
```bash
$env:PYTEST_DISABLE_PLUGIN_AUTOLOAD="1"
python -m pytest day-27/tests/test_workflow.py
```

---

## 🧪 Sample Workflows Included

1. **Basic Workflow**: `Input (Topic)` ➔ `Prompt` ➔ `AI (GPT-4o-mini)` ➔ `Output`
2. **Summarizer**: `Input (Article)` ➔ `Summarize Prompt` ➔ `AI (Claude 3.5 Sonnet)` ➔ `Output`
3. **Translator**: `Input (English Text)` ➔ `Hindi Prompt` ➔ `AI (Gemini 2.5 Flash)` ➔ `Output`
4. **Email Generator**: `Input (Situation)` ➔ `Professional Email Prompt` ➔ `AI` ➔ `Output`
5. **Multi-AI Pipeline**: `Input` ➔ `Prompt 1` ➔ `AI 1 (Draft)` ➔ `Prompt 2` ➔ `AI 2 (Refine)` ➔ `Output`

---

## 📄 License & Day 27 Curriculum
Part of the **30-Day AI Engineering Playbook**.
