# ⚙️ Day 27 — Durable AI Workflows

> **Daily AI Learning — Day 27**  
> Explore how durable workflow engines make AI applications reliable, resumable, and fault-tolerant.

## 📌 Overview

AI applications often involve multiple steps, external APIs, and long-running tasks. A failure in one step can interrupt the entire process and cause completed work to be repeated.

This experiment explores **durable AI workflows** using Inngest, with Temporal as a comparison.

The central idea is:

**Execute a workflow → Persist progress → Simulate failure → Recover → Resume without repeating completed steps**

The goal is to understand how workflow orchestration, persistent execution state, retries, and recovery can make AI applications more reliable.

---

## 🎯 Learning Objectives

- Understand durable execution and why AI workflows need it.
- Learn the difference between ordinary functions and durable workflows.
- Explore workflow steps, checkpoints, retries, and replay.
- Compare Temporal and Inngest.
- Build a multi-step workflow using Python and FastAPI.
- Trigger workflows using events.
- Persist completed step results.
- Simulate a failure and inspect recovery behavior.
- Explore durable waits and long-running workflows.
- Understand idempotency and safe retries.
- Connect durable workflows with AI agents and memory systems.

---

## 🧠 1. What Is a Durable AI Workflow?

A durable AI workflow is an AI-driven process whose execution progress is persisted so it can recover from failures and continue from a safe point.

Consider an AI research assistant:

1. Receive a research question.
2. Collect information from sources.
3. Generate an AI summary.
4. Validate the result.
5. Generate a report.
6. Deliver the report.

If the AI summary fails, a durable workflow can reuse the completed source-collection step rather than repeating the entire process.

### Ordinary workflow

```text
Start
  |
  v
Collect sources
  |
  v
Generate summary
  |
  X Failure
  |
  v
Restart from beginning
```

### Durable workflow

```text
Start
  |
  v
Collect sources
  |
  v
Persist completed result
  |
  v
Generate summary
  |
  X Failure
  |
  v
Retry failed step
  |
  v
Reuse saved source results
  |
  v
Continue workflow
```

**Key takeaway:** Durability preserves workflow progress, not merely the data used by the AI model.

---

## 🧩 2. Core Concepts

| Concept | Explanation |
|---|---|
| Workflow | The complete sequence of operations |
| Step / Activity | A unit of work within a workflow |
| Durable state | Persisted information needed to resume execution |
| Checkpoint | A saved progress point |
| Retry | Attempt failed work again |
| Replay | Reconstruct workflow state from recorded history |
| Event | A message that starts or affects a workflow |
| Trigger | The event, schedule, or condition that starts execution |
| Timer / Wait | Pause execution until a future time or event |
| Idempotency | Repeating an operation does not duplicate its effect |
| Human-in-the-loop | Pause for approval or human input |
| Observability | Inspect execution history, errors, retries, and status |
| Compensation | Perform corrective actions when an operation cannot simply be rolled back |

---

## 🏗️ 3. Architecture

```text
                 User / Application
                        |
                        v
                  Event Trigger
                        |
                        v
                Durable Workflow
                        |
           +------------+------------+
           |            |            |
           v            v            v
      Step 1        Step 2        Step 3
   Collect Data    AI Summary    Validation
           |            |            |
           v            v            v
      Persisted     Persisted     Persisted
       Result        Result        Result
           |            |            |
           +------------+------------+
                        |
                        v
                 Final Report
                        |
                        v
                  Workflow Done
```

Each important operation has a durable boundary. Completed steps can be reused during retries or recovery.

---

## ⚖️ 4. Temporal vs. Inngest

Both platforms provide durable execution, but their programming models differ.

| Feature | Temporal | Inngest |
|---|---|---|
| Programming model | Workflows + Activities | Functions + Steps |
| Recovery | Event-history replay | Persisted step results |
| Workflow code | Must be deterministic | Standard application code around durable steps |
| Local development | Temporal development server and workers | Inngest Dev Server |
| Infrastructure | Temporal Service and Workers | Managed or self-hosted orchestration |
| Best suited for | Complex, long-running workflows | Durable application workflows and background jobs |
| AI applications | Stateful agents and complex orchestration | AI pipelines, background tasks, and durable agents |

### Temporal mental model

```text
Workflow Code
     |
     v
Event History
     |
     v
Deterministic Replay
     |
     v
Reconstruct State
     |
     v
Resume Execution
```

Temporal replays workflow code using recorded events. External operations such as LLM calls belong in Activities.

### Inngest mental model

```text
Event
  |
  v
Function
  |
  v
step.run()
  |
  v
Persist Step Result
  |
  v
Retry / Resume
```

Inngest saves completed step results and reuses them when execution retries.

---

## 🛠️ 5. Technology Stack

- Python 3.11+
- FastAPI
- Inngest Python SDK
- Inngest Dev Server
- Uvicorn
- PowerShell
- Optional: an LLM provider and API key

The initial experiment simulates the AI response so it can run without API costs.

---

## ⚙️ 6. Project Setup

Create the project on your D drive:

```powershell
New-Item -ItemType Directory -Force `
  -Path "D:\AI-Learning\Day_27_Durable_AI_Workflows"

Set-Location "D:\AI-Learning\Day_27_Durable_AI_Workflows"

python -m venv .venv

.\.venv\Scripts\Activate.ps1

python -m pip install fastapi inngest uvicorn
```

Save dependencies:

```powershell
python -m pip freeze > requirements.txt
```

### Project structure

```text
Day_27_Durable_AI_Workflows/
│
├── .venv/
├── main.py
├── requirements.txt
├── .gitignore
└── README.md
```

---

## 🧪 7. Implement the Workflow

Create `main.py`:

```python
import datetime
import logging

from fastapi import FastAPI
import inngest
import inngest.fast_api


client = inngest.Inngest(
    app_id="day27-durable-ai",
    logger=logging.getLogger("uvicorn"),
)


@client.create_function(
    fn_id="ai-research-workflow",
    trigger=inngest.TriggerEvent(
        event="research/requested"
    ),
)
async def research_workflow(ctx: inngest.Context):
    topic = ctx.event.data["topic"]

    # Step 1: Collect context
    context = await ctx.step.run(
        "collect-context",
        lambda: {
            "topic": topic,
            "sources": [
                "Source A: introductory overview",
                "Source B: technical explanation",
            ],
        },
    )

    # Step 2: Simulate AI summary
    summary = await ctx.step.run(
        "generate-summary",
        lambda: (
            f"Research summary for {topic}: "
            f"collected {len(context['sources'])} sources."
        ),
    )

    # Step 3: Validate the summary
    validated = await ctx.step.run(
        "validate-summary",
        lambda: {
            "topic": topic,
            "summary": summary,
            "valid": bool(summary),
        },
    )

    # Step 4: Durable pause
    await ctx.step.sleep(
        "review-pause",
        datetime.timedelta(seconds=5),
    )

    return {
        "status": "completed",
        "report": validated,
    }


app = FastAPI()

inngest.fast_api.serve(
    app,
    client,
    [research_workflow],
)


@app.post("/api/research")
async def start_research():
    event_ids = await client.send(
        inngest.Event(
            name="research/requested",
            data={
                "topic": "Durable AI workflows"
            },
        )
    )

    return {"event_ids": event_ids}
```

### Important implementation details

- `Inngest(...)` creates the workflow client.
- `create_function(...)` defines the durable function.
- `TriggerEvent(...)` defines the event that starts it.
- `ctx.event.data` contains the event payload.
- `ctx.step.run(...)` executes a durable step and persists its result.
- `ctx.step.sleep(...)` creates a durable wait.
- `client.send(...)` sends an event to trigger the workflow.
- `inngest.fast_api.serve(...)` exposes the workflow to the Dev Server.

---

## 🚀 8. Run the Workflow Locally

### Terminal 1 — Start FastAPI

```powershell
.\.venv\Scripts\Activate.ps1

$env:INNGEST_DEV = "1"

uvicorn main:app --reload
```

### Terminal 2 — Start Inngest Dev Server

Install the Inngest CLI using the official instructions:

https://www.inngest.com/docs/local-development

Then run:

```powershell
inngest dev -u http://localhost:8000/api/inngest
```

Open the dashboard:

http://localhost:8288

### Terminal 3 — Trigger the workflow

```powershell
Invoke-RestMethod `
  -Method POST `
  -Uri "http://localhost:8000/api/research"
```

Inspect the workflow run in the dashboard.

Verify that:

- The event starts the workflow.
- The three steps execute.
- The pause is visible.
- The workflow completes.
- Each step has a recorded result.

---

## 💥 9. Experiment A — Simulate a Failure

Temporarily replace the AI summary step with:

```python
def generate_summary():
    raise RuntimeError("Simulated AI failure")


summary = await ctx.step.run(
    "generate-summary",
    generate_summary,
)
```

Trigger the workflow again.

Observe:

- Which step fails?
- Which steps completed successfully?
- Does the workflow retry?
- What happens to the completed `collect-context` step?
- What does the dashboard show in the execution history?

Record the actual behavior.

---

## 🔁 10. Experiment B — Recover from Failure

Restore the successful summary function.

Trigger a new workflow run and inspect its result.

The expected behavior is that the new run completes successfully.

For an actual retry experiment, configure a limited retry policy and deliberately fail the same execution transiently before allowing a later attempt to succeed.

Verify that previously completed durable steps are not unnecessarily repeated.

---

## ⏳ 11. Experiment C — Durable Wait

The workflow includes:

```python
await ctx.step.sleep(
    "review-pause",
    datetime.timedelta(seconds=5),
)
```

Observe the workflow during the pause.

A durable wait lets the workflow remain suspended without continuously occupying a worker process.

Try increasing the pause duration and inspect how the workflow resumes.

---

## 🤖 12. Integrate a Real AI Model

After the simulated workflow works, replace the summary function with a real LLM call.

```python
async def generate_summary():
    # Call your chosen LLM provider.
    # Return a JSON-serializable result.
    return {
        "summary": "Model-generated research summary"
    }
```

Run the function inside the durable step:

```python
summary = await ctx.step.run(
    "generate-summary",
    generate_summary,
)
```

Keep the LLM call inside the step boundary so the result can be persisted and reused.

### Important reliability note

A durable workflow does not guarantee that an external API call can never be repeated.

For example, an API may complete a request while the network fails before your workflow receives the response. A retry could issue the request again.

Use idempotency keys where supported, configure retries carefully, and make external side effects safe to repeat.

---

## 🧠 13. Important Reliability Concepts

### Idempotency

An operation is idempotent when repeating it does not create duplicate effects.

For example, creating a report with a stable report ID is safer than creating a new report every time a step retries.

### Retry policies

Retries help recover from temporary failures such as rate limits, network timeouts, and transient server errors.

They should have appropriate attempt limits and backoff.

### Replay

Temporal reconstructs workflow state by replaying recorded events. Workflow code must be deterministic so replay produces the same decisions.

### Checkpointing

Persisting intermediate results allows a workflow to resume from completed work rather than starting over.

### Human-in-the-loop

A workflow can pause until a person approves a report, confirms a payment, or provides additional information.

---

## 📊 14. Results and Observations

Complete this table after running the experiment.

| Measurement | Actual observation |
|---|---|
| Python version | Record installed version |
| Inngest SDK version | Record installed version |
| Workflow completed successfully | Yes / No |
| Number of workflow steps | Record actual count |
| Failure introduced | Describe the failure |
| Retry behavior | Record observed attempts |
| Completed steps reused | Yes / No |
| Durable wait observed | Yes / No |
| Recovery successful | Yes / No |
| Errors or limitations | Record actual observations |

Do not replace actual observations with expected results.

---

## 🔒 15. Security and Best Practices

- Keep API keys in environment variables.
- Never commit `.env` files or credentials.
- Avoid storing sensitive information in workflow payloads.
- Use idempotency for external side effects.
- Set timeouts and retry limits.
- Log workflow IDs and step IDs for debugging.
- Validate inputs before calling expensive models.
- Avoid placing non-deterministic external operations directly in Temporal workflow code.

---

## 📚 16. Official Resources

### Inngest

- [Durable Execution](https://www.inngest.com/docs/durable-execution)
- [Python Quickstart](https://www.inngest.com/docs/durable-execution/quick-start/python-quick-start)
- [Durable Execution Concepts](https://www.inngest.com/docs/durable-execution/concepts)
- [Local Development](https://www.inngest.com/docs/local-development)

### Temporal

- [Temporal Workflows](https://docs.temporal.io/workflows)
- [Temporal Python SDK](https://docs.temporal.io/develop/python)
- [Temporal Quickstarts](https://docs.temporal.io/quickstarts)

---

## 🏁 Final Summary

Day 27 explores durable AI workflows using Inngest and Temporal.

The experiment follows this process:

```text
Trigger Event
     |
     v
Collect Context
     |
     v
Persist Result
     |
     v
Generate AI Summary
     |
     v
Simulate Failure
     |
     v
Retry / Recover
     |
     v
Validate and Complete
```

**Main takeaway:** Durable execution makes multi-step AI applications more reliable by preserving completed work and enabling recovery after failures.

**Completion criteria:** Build and run the workflow, inspect its execution history, simulate a failure, verify recovery behavior, and document the actual results.