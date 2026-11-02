# 🧠 Day 26 — Letta: Persistent and Stateful AI Agents

> **Daily AI Learning — Day 26**  
> Explore how Letta enables AI agents to maintain persistent identity, memory, and experience across conversations.

## 📌 Overview

Traditional LLM interactions are often stateless: each request is processed using the context supplied for that request.

However, real-world AI agents need to remember useful information, learn from previous interactions, and maintain continuity across sessions.

This experiment explores **Letta**, an open-source platform for building persistent, stateful AI agents.

The main experiment:

**Create an agent → Store information → Start a new conversation → Retrieve the information → Update its memory**

The goal is to understand how persistent agent identity, memory, and conversation history work together.

---

## 🎯 Learning Objectives

- Understand stateless and stateful AI interactions.
- Explore Letta as a platform for persistent agents.
- Understand agent identity and conversation separation.
- Explore Letta's memory filesystem (MemFS).
- Learn how persistent memory blocks work.
- Install and configure Letta CLI.
- Teach an agent useful information using `/remember`.
- Inspect agent memory using `/memory`.
- Start a new conversation with `/new`.
- Verify that the same agent retains information across conversations.
- Test memory updates and retrieval.
- Understand the difference between persistent memory and the context window.

---

## 🧠 1. What Is a Stateful AI Agent?

A stateful AI agent maintains information about itself, its environment, and previous interactions across time.

For example, imagine an AI coding assistant that learns:

- Project name: Atlas
- Programming language: Python
- Database: SQLite
- Testing preference: Run unit tests before finalizing a solution

A stateful agent can retain these facts and use them in a later conversation.

### Stateless interaction

```text
Request 1
   |
   v
User provides project details
   |
   v
Model generates response
   |
   v
Request ends

New request:
Previous information is unavailable
unless supplied again.
```

### Stateful agent

```text
Conversation 1
   |
   v
User provides project details
   |
   v
Agent updates persistent memory
   |
   v
New conversation
   |
   v
Same agent retrieves stored information
   |
   v
Context-aware response
```

A stateless model can still power a stateful application if the application manages memory and history externally. Letta provides an agent runtime that manages these components together.

---

## 🏗️ 2. Letta Architecture

```text
                  User
                   |
                   v
             Conversation
                   |
                   v
             Letta Agent
                   |
       +-----------+-----------+
       |           |           |
       v           v           v
    Model       Memory       Tools
                 Blocks
                   |
                   v
             Persistent State
                   |
                   v
          New Conversation
                   |
                   v
          Same Agent Identity
```

### Main components

| Component | Responsibility |
|---|---|
| Agent | Persistent identity, configuration, memory, and tools |
| Model | Generates responses and decides when to use tools |
| Memory blocks | Store durable information for future interactions |
| Conversation | Individual message thread associated with an agent |
| MemFS | Git-backed filesystem used by Letta Code for persistent memory |
| Tools | Allow the agent to interact with external systems |
| Context window | Information currently available to the model |

---

## 🧩 3. Important Concepts

### Stateful agent

An agent that maintains identity and state across interactions.

### Agent identity

The persistent agent configuration, including instructions, model settings, tools, and memory.

### Conversation

A separate message thread associated with an agent. Multiple conversations can share the same agent memory.

### Persistent memory

Information saved outside the active context window and available in later interactions.

### Memory block

A structured piece of persistent information attached to an agent. Memory blocks can be inspected and updated.

### Context window

The information supplied to the model during its current inference request. Not every historical message must remain in the active context.

### MemFS

Letta Code's git-backed memory filesystem. It stores persistent agent memory and allows the agent to inspect, organize, and update that memory.

---

## 🔍 4. How Letta Memory Works

Letta agents can update memory as they learn durable information. Developers and users can also explicitly teach an agent.

```text
User provides information
          |
          v
Agent processes the message
          |
          v
Agent updates persistent memory
          |
          v
Memory is stored in MemFS
          |
          v
New conversation begins
          |
          v
Relevant memory is available
          |
          v
Agent responds using prior knowledge
```

Letta Code supports explicit memory teaching with `/remember` and memory inspection with `/memory`.

Example:

```text
/remember always use pytest for this project
```

The agent determines where the information belongs in its memory and updates the memory repository.

---

## ⚖️ 5. Letta vs. Mem0

| Mem0 — Day 25 | Letta — Day 26 |
|---|---|
| Memory layer for AI applications | Platform and runtime for stateful agents |
| Explicit add and search operations | Agent can manage its own persistent memory |
| User ID scopes memory operations | Agent identity scopes memory and conversations |
| Memory can be integrated into an existing application | Memory, tools, model, and agent state work together |
| Focus: persistent memory operations | Focus: persistent agent behavior |

Mem0 is useful when adding memory to an existing application. Letta is useful when building agents whose memory and identity persist over time.

---

## 🛠️ 6. Technology Stack

- Letta Code CLI
- Node.js
- npm
- LLM provider supported by Letta
- PowerShell
- Letta memory system (MemFS)

The experiment uses the CLI rather than building a custom agent from scratch.

---

## ⚙️ 7. Installation

Install Letta Code globally:

```powershell
npm install -g @letta-ai/letta-code
```

Launch the CLI:

```powershell
letta
```

The first launch guides you through onboarding and model-provider configuration.

Connect a provider when prompted, or use:

```text
/connect
```

Check the installed Node.js version:

```powershell
node --version
```

The current CLI quickstart requires Node.js 22.19 or newer.

---

## 🧪 8. Experiment A — Create or Select an Agent

Launch Letta:

```powershell
letta
```

Use the agent selector:

```text
/agents
```

Select an agent or create a new one named:

```text
Day26MemoryAgent
```

For the entire experiment, reuse the same agent identity.

---

## 💾 9. Experiment B — Teach the Agent

Send the following prompt:

```text
For a memory experiment, remember these project facts:

- Project name: Atlas
- Programming language: Python
- Database: SQLite
- Testing preference: Run unit tests before finalizing a solution

Save these as useful long-term memory so you can use them
in future conversations. Tell me when you have updated
your memory.
```

You can also explicitly teach information using:

```text
/remember Atlas is a Python project that uses SQLite
```

The agent should update its persistent memory rather than relying only on the current conversation.

---

## 🔎 10. Experiment C — Inspect Persistent Memory

Run:

```text
/memory
```

Inspect the memory files and identify where the Atlas project facts were stored.

Ask the agent:

```text
Show me the relevant memory you updated.
Explain which facts were saved and where they belong.
```

Record the actual memory contents.

The agent's verbal confirmation alone is not sufficient evidence that the facts were persisted.

---

## 🔄 11. Experiment D — Start a New Conversation

Run:

```text
/new
```

This creates a new conversation while preserving the same agent identity and its persistent memory.

Do not switch to a different agent.

The purpose of this step is to test whether the information survives outside the original conversation.

---

## 🧠 12. Experiment E — Retrieve the Stored Information

Ask:

```text
Using your persistent memory, tell me:

1. What is the project name?
2. Which programming language does it use?
3. Which database does it use?
4. What is the testing preference?

Do not guess. If a fact is missing from memory, say so.
```

Expected facts:

| Question | Expected answer |
|---|---|
| Project name | Atlas |
| Programming language | Python |
| Database | SQLite |
| Testing preference | Run unit tests before finalizing a solution |

Record the actual response and compare it with the stored memory.

---

## 🔁 13. Experiment F — Update a Memory

Tell the agent:

```text
The Atlas project has migrated from SQLite to PostgreSQL.

Update your persistent memory so that PostgreSQL is
the current database for Atlas.
```

Then:

1. Inspect `/memory`.
2. Start a new conversation using `/new`.
3. Ask which database Atlas currently uses.
4. Verify that the updated fact is reflected in memory and the response.

This experiment tests memory updates and conflicting facts.

---

## 📊 14. Results and Observations

Complete this table after performing the experiment.

| Measurement | Actual observation |
|---|---|
| Letta CLI version | Record installed version |
| Agent created or selected | Record agent name |
| Memory updated successfully | Yes / No |
| Memory inspected | Yes / No |
| New conversation started | Yes / No |
| Facts retrieved correctly | Yes / No |
| Updated database reflected | Yes / No |
| Errors or limitations | Record actual observations |

Do not replace actual observations with expected results.

---

## ⚠️ 15. Limitations

- Memory may omit information that was not considered durable.
- An agent may retrieve or interpret memory incorrectly.
- Old and new facts may conflict.
- Persistent memory does not guarantee correct answers.
- The context window still has a finite capacity.
- Local-only agents require appropriate backups.
- Memory systems introduce privacy and data-management considerations.

Persistent memory should support reasoning, not replace verification.

---

## 🔒 16. Security Considerations

- Do not store passwords, private keys, or sensitive credentials in the experiment.
- Use fictional project information.
- Inspect what the agent stores.
- Review memory before sharing or syncing it.
- Understand whether your agent is stored locally or backed up to Letta Cloud.
- Keep model-provider credentials secure.

---

## 🧠 17. Key Takeaways

- Stateful agents preserve identity and information across interactions.
- Agent identity and conversation identity are different.
- Multiple conversations can share the same agent memory.
- Letta Code uses MemFS for persistent memory.
- `/remember` teaches the agent durable information.
- `/memory` allows inspection of stored memory.
- `/new` creates a new conversation with the same agent.
- Memory updates should be verified rather than assumed.
- Persistent memory is distinct from the active context window.

---

## 📚 18. Official References

- [Letta Quickstart](https://docs.letta.com/quickstart)
- [Stateful Agents](https://docs.letta.com/concepts/stateful-agents)
- [Memory and Dreaming](https://docs.letta.com/configuration/memory)
- [Letta Documentation](https://docs.letta.com/)
- [Letta Code GitHub Repository](https://github.com/letta-ai/letta-code)

---

## 🏁 Final Summary

Day 26 explores persistent, stateful AI agents using Letta.

The experiment follows this workflow:

```text
Create or Select Agent
          |
          v
Teach Project Facts
          |
          v
Inspect Persistent Memory
          |
          v
Start a New Conversation
          |
          v
Retrieve Stored Facts
          |
          v
Update a Fact
          |
          v
Verify the Updated Memory
```

**Main takeaway:** A stateful AI agent can maintain identity, memory, and experience across conversations. Letta provides a practical environment for exploring this behavior without building the entire agent runtime yourself.

**Completion criteria:** teach the agent the Atlas facts, inspect its memory, retrieve those facts in a new conversation, update one fact, and document the actual results.