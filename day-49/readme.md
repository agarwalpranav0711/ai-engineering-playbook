# 🧠 Day 25 — Agent Memory Tools: Persistent Memory with Mem0

> **Daily AI Learning — Day 25**  
> Explore how AI agents store information, persist it across sessions, and retrieve relevant facts using Mem0.

## 📌 Overview

An AI agent can answer questions using information in its current conversation. However, when a new conversation begins, earlier information may no longer be available unless it has been stored and retrieved separately.

This experiment explores **persistent agent memory** using [Mem0](https://mem0.ai/), a memory layer for AI applications and agents.

Mem0 provides an API for extracting useful information from conversations, storing memories, and searching them when they are needed again.

The experiment follows one simple workflow:

**Store information → Start a new session → Retrieve the stored information**

The goal is to understand the underlying memory workflow and verify that information remains available after the original Python process ends.

---

## 🎯 Learning Objectives

- Understand what memory means in an AI agent.
- Distinguish conversation context from persistent storage.
- Explore Mem0 as an agent memory system.
- Understand memory extraction and retrieval.
- Install and configure the Mem0 Python SDK.
- Store information using `MemoryClient`.
- Retrieve information using semantic search.
- Use a stable user identifier to scope memories.
- Test retrieval from a separate Python process.
- Understand asynchronous memory processing.
- Investigate memory updates, relevance, and missing information.
- Document actual results and limitations.

---

## 🧠 1. What Is Agent Memory?

Agent memory is information an AI system can reuse across interactions.

For example, imagine an AI coding assistant that learns the following facts:

- Project name: Atlas
- Programming language: Python
- Database: SQLite
- Testing preference: Run unit tests before finalizing a solution

If these facts are stored in persistent memory, the agent can retrieve them during a later interaction without requiring the user to repeat everything.

Memory is useful for personalization, long-running tasks, project continuity, and conversational applications.

### Without persistent memory

```text
Session 1
    |
    v
User shares project details
    |
    v
Conversation ends
    |
    v
New session may not contain
the earlier information
```

### With persistent memory

```text
Session 1
    |
    v
User shares project details
    |
    v
Mem0 stores useful information
    |
    v
New session begins
    |
    v
Mem0 retrieves relevant facts
    |
    v
Agent uses those facts
```

A normal chatbot can also implement persistent memory. Mem0 provides a reusable memory layer rather than requiring every application to build its own storage and retrieval pipeline.

---

## 🏗️ 2. Project Architecture

```text
                 Python Application
                         |
                         v
                    Mem0 SDK
                         |
              +----------+----------+
              |                     |
              v                     v
          Add Memory           Search Memory
              |                     |
              v                     v
         Extract Facts       Retrieve Relevant
              |                  Memories
              v                     |
          Persistent                |
          Memory Store <------------+
```

The application interacts with Mem0 through its SDK. The hosted platform manages the memory operations and returns the results.

### Main components

| Component | Responsibility |
|---|---|
| Python application | Supplies conversations and search queries |
| Mem0 SDK | Provides a Python interface to the memory API |
| Memory extraction | Identifies useful information from supplied messages |
| Persistent storage | Keeps memories available for later operations |
| Search | Finds memories relevant to a natural-language query |
| User identifier | Scopes operations to the intended user's memories |

The underlying storage and retrieval implementation is managed by Mem0 Platform in this experiment.

---

## 🧩 3. Important Memory Concepts

### Short-term or working memory

Information available during the current task or conversation.

Example: the error message currently being debugged.

### Long-term or persistent memory

Information saved for reuse across separate interactions.

Example: a project's programming language and database.

### Semantic memory

Facts, preferences, and concepts.

Example: "Atlas uses SQLite."

### Episodic memory

Information about past events or interactions.

Example: "The previous session fixed a database connection error."

### Procedural memory

Information about how to perform a task.

Example: "Run unit tests before proposing the final solution."

These are general conceptual categories. They do not necessarily correspond to separate Mem0 storage types.

---

## ⚖️ 4. Mem0 vs. Zep vs. Letta

The Day 25 task suggests exploring one new memory system. This project focuses on Mem0.

| System | Main learning focus |
|---|---|
| Mem0 | Add persistent memory to AI applications |
| Zep | Persistent context and context retrieval |
| Letta | Stateful agents and agent-managed memory |

Mem0 is a suitable starting point because its Platform SDK provides direct operations for adding and searching memories.

The goal is to understand one implementation properly rather than installing several overlapping systems.

---

## 🛠️ 5. Technology Stack

- Python
- Mem0 Platform
- `mem0ai` Python SDK
- Environment variables for API credentials
- PowerShell for the development workflow

The experiment uses Mem0's hosted API rather than setting up a local vector database and memory infrastructure.

---

## 📁 6. Project Structure

```text
Day_25_Agent_Memory_Tools/
│
├── README.md
├── store_memory.py
├── retrieve_memory.py
├── requirements.txt
├── .gitignore
└── results/
    └── experiment_log.md
```

The storage and retrieval scripts are separate intentionally. This helps demonstrate that the retrieved information does not depend on variables remaining in the original Python process.

---

## ⚙️ 7. Environment Setup

Create the project directory on Windows:

```powershell
New-Item -ItemType Directory -Force `
  -Path "D:\AI-Learning\Day_25_Agent_Memory_Tools"

Set-Location "D:\AI-Learning\Day_25_Agent_Memory_Tools"

python -m venv .venv
.\.venv\Scripts\Activate.ps1

python -m pip install mem0ai
```

If the directory already exists, simply navigate into it and activate the virtual environment.

Create `requirements.txt`:

```text
mem0ai
```

For a reproducible project, record the installed package version after verifying the experiment:

```powershell
python -m pip show mem0ai
python -m pip freeze
```

---

## 🔐 8. Configure Mem0

1. Open the [Mem0 Platform](https://app.mem0.ai/).
2. Create an account or sign in.
3. Obtain a Platform API key.
4. Configure the key in PowerShell.

```powershell
$env:MEM0_API_KEY = "your-mem0-api-key"
```

Replace the placeholder with your actual key.

The environment variable applies to the current PowerShell session. Set it again in a new terminal if required.

Never commit API keys to GitHub.

---

## 💾 9. Experiment A — Store Information

Create `store_memory.py`:

```python
import os
from mem0 import MemoryClient

client = MemoryClient(
    api_key=os.environ["MEM0_API_KEY"]
)

USER_ID = "day25-demo-user"

messages = [
    {
        "role": "user",
        "content": (
            "My demo project is Atlas. "
            "It uses Python and SQLite. "
            "I prefer running unit tests before "
            "finalizing a solution."
        ),
    }
]

result = client.add(
    messages=messages,
    user_id=USER_ID,
)

print("Memory operation response:")
print(result)
```

Run:

```powershell
python store_memory.py
```

### What happens?

1. The application initializes `MemoryClient`.
2. It sends a conversation message to Mem0.
3. The `user_id` scopes the operation to the demo user.
4. Mem0 processes the supplied information.
5. The application receives an operation response.

Mem0 may return an event identifier and a `PENDING` status because memory processing is asynchronous.

**Important:** A successful API response does not necessarily mean that processing has finished. Inspect the returned status and verify completion before testing retrieval.

---

## 🔍 10. Experiment B — Retrieve Information

Create `retrieve_memory.py`:

```python
import os
from mem0 import MemoryClient

client = MemoryClient(
    api_key=os.environ["MEM0_API_KEY"]
)

USER_ID = "day25-demo-user"

query = (
    "What programming language and database "
    "does the Atlas project use? "
    "What is the testing preference?"
)

result = client.search(
    query=query,
    filters={"user_id": USER_ID},
)

print("Retrieved memories:")
print(result)
```

Run the retrieval script separately:

```powershell
python retrieve_memory.py
```

### What this experiment demonstrates

- The original Python process has ended.
- The retrieval program creates a new client.
- The stored facts are not passed through Python variables.
- The query uses the same stable user identifier.
- Mem0 searches persistent memory and returns relevant records.

The storage and retrieval scripts use the current Platform API pattern documented by Mem0.

---

## 🔄 11. Understanding the Asynchronous Workflow

Mem0 Platform's `add()` operation may return an event identifier with a pending status.

```text
Application
    |
    v
client.add(...)
    |
    v
Event ID + PENDING
    |
    v
Memory processing
    |
    v
SUCCEEDED
    |
    v
Search stored memories
```

If a search returns no results immediately after adding a memory, check the operation status first.

Use the event-status endpoint documented by Mem0 to confirm that processing has completed. Avoid assuming that an arbitrary delay guarantees success.

Official reference:

https://docs.mem0.ai/platform/quickstart

---

## 🧪 12. Experiment C — Test Retrieval Quality

After the initial test, use different queries to check whether retrieval works beyond exact wording.

| Query | Expected information |
|---|---|
| Which database does Atlas use? | SQLite |
| What language is the project written in? | Python |
| What should happen before finalizing a solution? | Run unit tests |
| What is the project called? | Atlas |

Record the actual returned memories. A search may return individual facts rather than a single combined answer.

Do not assume every query will retrieve every fact. Relevance, filtering, and memory extraction affect the result.

---

## 🔁 13. Experiment D — Update a Fact

Add a new message indicating that the Atlas project has migrated from SQLite to PostgreSQL.

Then search again:

```python
result = client.search(
    "Which database does the Atlas project currently use?",
    filters={"user_id": "day25-demo-user"},
)

print(result)
```

Inspect whether the latest fact is reflected in the returned memories.

Adding a new fact does not guarantee that every older record is automatically deleted. Real applications should define how to handle changed facts, conflicting memories, and outdated information.

---

## 🧪 14. Experiment E — Test Missing Information

Ask a question about information you never stored:

```python
result = client.search(
    "Which frontend framework does Atlas use?",
    filters={"user_id": "day25-demo-user"},
)

print(result)
```

No frontend framework was supplied in the original experiment.

Observe whether the search returns no relevant result or returns unrelated memories.

This test matters because a robust AI application should not invent a missing fact simply because a memory system returned something vaguely related.

---

## 📊 15. Results and Observations

Fill in this table after running the experiments.

| Measurement | Actual observation |
|---|---|
| Mem0 SDK version | Record installed version |
| Storage operation status | Record returned status |
| Processing completed | Yes / No |
| Retrieval from separate process | Yes / No |
| Correct project name retrieved | Yes / No |
| Correct database retrieved | Yes / No |
| Updated fact handled correctly | Record observation |
| Missing fact handled safely | Record observation |
| Errors or limitations | Record actual errors |

Do not use expected results as if they were measured results.

---

## ⚠️ 16. Limitations

- Memory extraction may omit information.
- Search may retrieve incomplete or irrelevant records.
- Old and new facts may conflict.
- Persistent memory does not guarantee correct answers.
- Memory processing may be asynchronous.
- A hosted service introduces external dependency and data-handling considerations.
- Search results need to be evaluated rather than blindly trusted.

A memory system should support an agent's reasoning, not replace verification for important decisions.

---

## 🔒 17. Security Considerations

- Store API keys in environment variables or a secret manager.
- Do not commit credentials to source control.
- Use stable, non-sensitive user identifiers for testing.
- Scope retrieval to the intended user.
- Avoid putting passwords, private keys, or confidential project data into the demo.
- Review the hosted service's data-handling policies.
- Learn how to inspect and delete test memories when finished.

The hosted Platform API processes information externally. This experiment is intentionally based on fictional project data.

---

## 🧠 18. Key Takeaways

- Agent memory allows information to be reused across interactions.
- Persistent memory is different from the current conversation context.
- Mem0 provides APIs for adding and searching memories.
- A stable `user_id` scopes operations to a user.
- A separate process provides a useful persistence test.
- Memory extraction and search can produce incomplete results.
- Asynchronous processing must be accounted for.
- Updating a fact requires checking how conflicts are handled.
- Retrieved memory should be verified when correctness matters.

---

## 📚 19. Official References

- [Mem0 Platform Quickstart](https://docs.mem0.ai/platform/quickstart)
- [Mem0 GitHub Repository](https://github.com/mem0ai/mem0)
- [Mem0 — Add Memory](https://github.com/mem0ai/mem0/blob/main/docs/core-concepts/memory-operations/add.mdx)
- [Mem0 — Search Memory](https://github.com/mem0ai/mem0/blob/main/docs/core-concepts/memory-operations/search.mdx)
- [Mem0 API Reference](https://github.com/mem0ai/mem0/blob/main/docs/api-reference.mdx)

---

## 🏁 Final Summary

Day 25 explores persistent agent memory using Mem0.

The experiment follows this workflow:

```text
Share Information
       |
       v
Store Memory with Mem0
       |
       v
Confirm Processing
       |
       v
Start a New Python Process
       |
       v
Search Persistent Memory
       |
       v
Verify the Retrieved Facts
```

**Main takeaway:** An AI agent can reuse information across sessions when useful facts are persisted and retrieved through a memory system. Mem0 provides a practical way to experiment with this pattern without building the entire storage and retrieval infrastructure yourself.

**Completion criteria:** store the Atlas facts, confirm that processing has completed, retrieve the facts from a separate process, test a changed or missing fact, and record the actual results.