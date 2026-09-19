# 🪿 Day 6 — Goose

> **Exploring an Open-Source General-Purpose AI Agent**

Today I explored **Goose**, an open-source, general-purpose AI agent designed to do more than simply generate text. Goose can use LLMs together with tools, extensions, MCP servers, workflows, and computer capabilities to perform multi-step tasks.

The main goal of today's experiment was to understand what a **real, ready-to-use general-purpose AI agent** looks like and how it differs from agent frameworks and SDKs such as LangGraph, OpenAI Agents SDK, and Google ADK.

---

## 🎯 Today's Task

**Day 6 — Goose**

> Explore an open-source general-purpose AI agent.

### Experiment

> Run Goose and experiment with a capability/extension that I had not previously used.

The focus of this day was not simply installing Goose. The goal was to understand:

- What Goose actually is
- How Goose works
- How it uses models and tools
- What extensions are
- How MCP fits into Goose
- How Goose can perform real actions
- How Goose differs from an agent SDK/framework
- How Goose fits into the larger AI-agent ecosystem

---

# 🪿 What is Goose?

**Goose is an open-source, general-purpose AI agent.**

Unlike a normal chatbot that primarily generates responses, Goose is designed to **take actions using tools and extensions** to accomplish tasks.

A simplified mental model is:

```text
                    USER
                      │
                      ▼
                   GOOSE
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
        MODEL        TOOLS    EXTENSIONS
          │           │           │
          ▼           ▼           ▼
       LLM        Actions        MCP
          │
          └───────────┬───────────┘
                      ▼
                  AGENT LOOP
                      │
              ┌───────┴───────┐
              ▼               ▼
            THINK            ACT
              │               │
              └───────┬───────┘
                      ▼
                   OBSERVE
                      │
                      ▼
                   CONTINUE
                      │
                      ▼
                    DONE
```

The important idea is:

> **Goose connects an LLM to capabilities that allow it to actually perform tasks.**

---

# 🧠 Why is Goose different?

One of the most important things I learned today is that **an agent framework and a ready-to-use agent are not necessarily the same thing.**

For example:

### Vanilla Agent

I manually build:

```text
LLM
 ↓
Instructions
 ↓
Tool definitions
 ↓
Agent loop
 ↓
Tool execution
 ↓
Tool result
 ↓
LLM again
```

I am responsible for building the runtime.

---

### OpenAI Agents SDK

I use an SDK to build the agent:

```text
Agent
 ↓
Instructions
 ↓
Tools
 ↓
Runner
 ↓
Agent Loop
```

The SDK provides abstractions that make building the agent easier.

---

### Goose

Goose is already a usable general-purpose agent:

```text
User
 ↓
Goose
 ↓
LLM
 ↓
Tools / Extensions / MCP
 ↓
Actions
 ↓
Result
```

Instead of first writing the complete agent runtime myself, I can **run Goose and give it tasks**.

---

# 🔑 The Main Distinction

The simplest way to remember the difference:

```text
Vanilla
→ Build the agent yourself.

OpenAI Agents SDK
→ Build an agent using an SDK.

LangGraph
→ Build explicit stateful agent workflows.

Google ADK
→ Develop agent applications using Google's framework.

CrewAI
→ Build agent teams and workflows.

AutoGen
→ Build multi-agent systems.

Goose
→ Use and extend an already-built general-purpose agent.
```

This does **not** mean Goose is "better" than these tools.

They operate at different levels and have different design goals.

---

# 🏗️ Goose Architecture

A useful high-level architecture is:

```text
                         GOOSE
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
      MODEL              TOOLS           EXTENSIONS
        │                  │                  │
        │                  │                  ▼
        │                  │                 MCP
        │                  │                  │
        ▼                  ▼                  ▼
   LLM Provider        Actions          External Systems
        │
        └──────────────────┐
                           ▼
                      AGENT LOOP
                           │
                           ▼
                       OBSERVATION
                           │
                           ▼
                         ACTION
                           │
                           ▼
                      MORE STEPS
                           │
                           ▼
                         RESULT
```

---

# 🤖 Model ≠ Agent

Another important concept from today's exploration:

**Goose itself is not the LLM.**

The LLM provides the reasoning/generation capability.

Goose provides the agent environment around it.

```text
                GOOSE
                  │
          ┌───────┴───────┐
          ▼               ▼
        MODEL          TOOLS
          │               │
          ▼               ▼
       Reasoning        Actions
```

Therefore:

```text
Model Provider ≠ Agent
```

An agent system can use different model providers.

Goose supports multiple providers and models through its provider configuration.

---

# 🔄 The Agentic Loop

The core idea behind an agent is the ability to continue acting based on observations.

A simplified loop is:

```text
USER REQUEST
     │
     ▼
   MODEL
     │
     ▼
DECIDE WHAT TO DO
     │
     ├───────────────┐
     │               │
     ▼               ▼
  TOOL NEEDED?      DONE
     │               │
    YES              ▼
     │            RESPONSE
     ▼
  USE TOOL
     │
     ▼
 TOOL RESULT
     │
     ▼
   MODEL
     │
     ▼
  CONTINUE
```

This is fundamentally similar to the agent loop explored during Day 5 with the OpenAI Agents SDK.

The difference is that Goose provides a complete agent environment around this concept.

---

# 🧰 Tools

A **tool** is something the agent can use to perform an action.

Examples include:

```text
File operations
Terminal commands
Code execution
Web operations
Git operations
Data processing
External APIs
```

Without tools:

```text
Agent
 ↓
Generate text
```

With tools:

```text
Agent
 ↓
Decide action
 ↓
Tool
 ↓
Real-world effect
```

This is what makes an agent much more capable than a basic chatbot.

---

# 🧩 Extensions

One of the most important Goose concepts is the **extension system**.

Extensions add capabilities to Goose.

Conceptually:

```text
                    GOOSE
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
      Developer    Computer      Memory
                   Controller
          │           │           │
          └───────────┼───────────┘
                      ▼
                 Capabilities
```

Goose uses extensions to connect additional functionality to the agent.

---

# 🔌 MCP — Model Context Protocol

A major part of Goose's extension architecture is **MCP**.

MCP stands for:

> **Model Context Protocol**

MCP provides a standardized way for AI applications to connect with tools and external systems.

Instead of every AI application implementing a completely different integration:

```text
Agent A
 ↓
Custom GitHub integration

Agent B
 ↓
Different GitHub integration

Agent C
 ↓
Another GitHub integration
```

MCP provides a common protocol:

```text
                MCP
                 │
       ┌─────────┼─────────┐
       ▼         ▼         ▼
    GitHub    Database    Browser
```

Goose can use MCP servers as extensions.

Therefore:

```text
Goose
  ↓
MCP Client
  ↓
MCP Server
  ↓
Tool / Resource
  ↓
External System
```

---

# 🧱 Built-in Capabilities

Goose provides built-in capabilities/extensions around areas such as:

### Developer

Development and coding-related operations.

```text
Goose
 ↓
Developer Extension
 ↓
Files / Commands / Development Tasks
```

---

### Computer Controller

Provides computer-related capabilities.

This allows Goose to interact with environments beyond simply generating text.

Conceptually:

```text
Goose
 ↓
Computer Controller
 ↓
Computer / Browser
 ↓
Action
 ↓
Observation
```

This was particularly interesting because it demonstrates how an agent can move from:

```text
Generate
```

to:

```text
Act
```

---

### Memory

Memory capabilities allow information to be retained and reused across interactions.

Conceptually:

```text
Conversation
      ↓
    Memory
      ↓
Future interaction
```

---

### Auto Visualiser

Provides capabilities for generating visual representations of data.

This demonstrates another important principle:

> Tools/extensions can specialize an otherwise general-purpose agent.

---

# 🧠 Skills

A **skill** is different from a tool.

A tool primarily **does something**.

A skill primarily provides **instructions/knowledge for how to perform something**.

### Tool

```text
calculator()
github()
browser()
```

### Skill

```text
Code Review Skill
Research Skill
Documentation Skill
```

So:

```text
Tool
→ Action

Skill
→ Specialized knowledge/instructions
```

Skills can therefore make an agent better at specific categories of work without changing the fundamental agent architecture.

---

# 📋 Recipes

Goose also supports **recipes**.

A recipe can package a reusable workflow/configuration.

A simplified representation:

```text
Recipe
│
├── Instructions
├── Prompt
├── Model
├── Extensions
├── Parameters
├── Settings
└── Workflow
```

Instead of repeatedly configuring the same agent workflow manually, a recipe can make it reusable.

A useful mental model is:

> **Recipe = reusable agent workflow/configuration**

---

# 👥 Subagents

Goose can also work with subagents.

Conceptually:

```text
                    MAIN AGENT
                        │
             ┌──────────┼──────────┐
             ▼          ▼          ▼
         Research     Coding     Testing
          Agent        Agent      Agent
```

The main agent can delegate specialized work.

This connects to the multi-agent concepts explored earlier.

---

# 🖥️ Goose Interfaces

Goose is not limited to one interface.

It provides ways to interact with Goose through:

```text
Desktop
CLI
API
```

This makes it different from simply installing a Python library.

It behaves more like a complete agent product/platform.

---

# 💻 Goose CLI

The CLI allows Goose to be used directly from a terminal.

This is especially useful for developers because:

```text
Terminal
   ↓
Goose
   ↓
Agent
   ↓
Development Environment
```

The agent can operate much closer to the environment where development work actually happens.

---

# 🖥️ Goose Desktop

The desktop application provides a graphical interface for interacting with Goose.

The high-level flow is:

```text
Desktop App
     ↓
   Goose
     ↓
   Model
     ↓
Tools / Extensions
     ↓
Actions
```

This makes Goose accessible without requiring every interaction to be implemented as code.

---

# 🌐 Goose API

Goose also exposes an API-oriented way of integrating with the agent.

This provides another layer:

```text
Application
     ↓
Goose API
     ↓
Goose
     ↓
Agent Runtime
```

So Goose can be thought of as more than a standalone CLI tool.

---

# 🔐 Security and Permissions

Agent capabilities introduce an important problem:

> **What should the agent be allowed to do?**

For example:

```text
Agent
 ↓
Can read files?
 ↓
Can modify files?
 ↓
Can execute commands?
 ↓
Can access internet?
 ↓
Can interact with computer?
```

The more tools an agent receives, the more powerful it becomes.

Therefore:

```text
Agent Capability
+
Permissions
+
Sandboxing
+
Approval Controls
=
Safer Agent
```

Goose provides controls around tool permissions and security.

This is an important lesson because **agent safety is not only about the model**.

It is also about:

```text
Tools
Permissions
Environment
Data access
Execution authority
```

---

# 🧪 My Hands-On Experiment

## Experiment: Computer Controller

The capability explored for today's experiment was:

> **Computer Controller**

The goal was to understand how Goose can move beyond text generation and interact with an environment.

### Example task

```text
Open a webpage and identify its title.
```

The conceptual execution becomes:

```text
User
 ↓
Goose
 ↓
Understand task
 ↓
Choose computer/browser capability
 ↓
Perform action
 ↓
Observe result
 ↓
Continue if necessary
 ↓
Return answer
```

This demonstrates the fundamental agent pattern:

```text
Reason
 ↓
Act
 ↓
Observe
 ↓
Reason again
 ↓
Act again
```

---

# 🔬 What I Observed

The important observation from the experiment was that Goose is designed around **action-oriented agent behavior**.

A traditional chatbot primarily follows:

```text
Input
 ↓
LLM
 ↓
Output
```

An agent follows:

```text
Input
 ↓
LLM
 ↓
Decision
 ↓
Tool
 ↓
Observation
 ↓
LLM
 ↓
Decision
 ↓
Action
 ↓
Result
```

This is the major shift from chatbot → agent.

---

# ⚖️ Goose vs OpenAI Agents SDK

| Feature | Goose | OpenAI Agents SDK |
|---|---|---|
| Primary role | General-purpose agent/platform | Agent development SDK |
| Open source | Yes | Yes |
| Ready-to-use agent | Yes | No — primarily a developer SDK |
| Desktop | Yes | No |
| CLI | Yes | Developer-created application |
| Tools | Yes | Yes |
| Extensions | Major concept | Tools/integrations |
| MCP | Strong extension model | Supported |
| Multi-agent | Supported | Supported |
| Recipes | Yes | Not the central abstraction |
| Computer capabilities | Available through extensions | Must be integrated as tools |
| Main mindset | Use/extend an agent | Build an agent |

The important conclusion is **not that one is better**.

They solve different problems.

---

# ⚖️ Goose vs LangGraph

### LangGraph

LangGraph is strongly centered around:

```text
State
 ↓
Nodes
 ↓
Edges
 ↓
Conditional Routing
 ↓
State
```

The developer explicitly designs the workflow.

---

### Goose

Goose is centered around:

```text
User
 ↓
Agent
 ↓
Model
 ↓
Tools / Extensions
 ↓
Actions
 ↓
Observations
```

Goose provides a more ready-to-use agent environment.

---

# 🧠 Framework vs Agent Platform

This was one of the biggest lessons from Day 6.

A framework/SDK usually gives developers building blocks:

```text
Agent
Tool
State
Runner
Graph
Handoff
Guardrail
```

A ready-to-use agent platform gives the user an already assembled environment:

```text
Agent
+
Model
+
Tools
+
Extensions
+
Runtime
+
Interface
+
Configuration
```

Therefore:

```text
SDK / Framework
        ↓
Build agent systems


Goose
        ↓
Use + extend an agent system
```

---

# 🌎 Where Goose Fits in the Agent Ecosystem

After Days 1–6, the ecosystem can be visualized like this:

```text
                         AI AGENT ECOSYSTEM
                                │
       ┌────────────────────────┼────────────────────────┐
       │                        │                        │
       ▼                        ▼                        ▼
   PROTOCOLS                FRAMEWORKS              AGENTS
       │                        │                        │
       │                        │                        │
      A2A                    LangGraph              Goose
      MCP                    ADK
      AG-UI                  CrewAI
      A2UI                   AutoGen
                             OpenAI Agents SDK
```

These are different layers.

### A2A

```text
Agent ↔ Agent
```

### MCP

```text
Agent ↔ Tools / Services
```

### AG-UI / A2UI

```text
Agent ↔ User Interface
```

### Frameworks / SDKs

```text
Developer → Agent System
```

### Goose

```text
User → Ready-to-use General Agent
```

---

# 🧩 The Core Agent Formula

After studying the vanilla agent, OpenAI Agents SDK, LangGraph, ADK, and Goose, a useful framework-independent model is:

```text
AGENT
=
MODEL
+
INSTRUCTIONS
+
TOOLS
+
CONTEXT / STATE
+
LOOP
+
ORCHESTRATION
+
GUARDRAILS
+
OBSERVABILITY
```

Not every implementation exposes all of these in the same way.

Different frameworks simply choose different abstractions.

---

# 🧠 The Most Important Lesson

An AI agent is **not just an LLM**.

```text
LLM
≠
Agent
```

A more useful model is:

```text
                  AGENT
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
      MODEL        TOOLS       STATE
        │           │           │
        └───────────┼───────────┘
                    ▼
                 LOOP
                    │
                    ▼
                ACTION
                    │
                    ▼
               OBSERVATION
                    │
                    ▼
                 CONTINUE
```

Goose is an example of a complete system that puts these ideas together into a usable general-purpose agent.

---

# 🆚 Chatbot vs Agent

### Chatbot

```text
USER
 ↓
MODEL
 ↓
TEXT
```

### Agent

```text
USER
 ↓
MODEL
 ↓
DECISION
 ↓
TOOL
 ↓
ACTION
 ↓
OBSERVATION
 ↓
MODEL
 ↓
NEXT ACTION
 ↓
RESULT
```

The key difference is **the ability to interact with an environment and take actions through tools**.

---

# 📚 Key Concepts Learned

Today's important concepts:

- Goose
- Open-source AI agent
- General-purpose agent
- Agent runtime
- Model providers
- Tools
- Extensions
- MCP
- MCP servers
- Skills
- Recipes
- Subagents
- Computer Controller
- Memory
- Agent loop
- Tool calling
- Permissions
- Sandboxing
- Agent security
- CLI
- Desktop agent
- Agent API
- Multi-agent systems
- Agent platforms
- Agent frameworks

---

# 🔥 Day 6 Takeaway

The biggest lesson from today's experiment:

> **An AI agent is not defined by a particular framework. At its core, it is a system where a model can use context and tools in an iterative loop to accomplish a goal.**

Goose demonstrates what happens when that concept is packaged into a **ready-to-use, general-purpose, open-source agent**.

The progression from the previous days now looks like:

```text
Day 1
A2A
Agent ↔ Agent
       │
       ▼
Day 2
A2UI
AI → UI
       │
       ▼
Day 3
AG-UI
Agent ↔ Frontend
       │
       ▼
Day 4
Google ADK
Build Agent Applications
       │
       ▼
Day 5
OpenAI Agents SDK
Build Agents with an SDK
       │
       ▼
Day 6
Goose
Use + Extend a General-Purpose Agent
```

---

# 🚀 Final Mental Model

The simplest way I now understand Goose:

```text
                         GOOSE
                           │
                           ▼
                    GENERAL AGENT
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
        MODEL             TOOLS         EXTENSIONS
          │                │                │
          │                │                ▼
          │                │               MCP
          │                │                │
          ▼                ▼                ▼
      Reasoning          Actions       Capabilities
          │
          └────────────────┐
                           ▼
                       AGENT LOOP
                           │
                           ▼
                  REASON → ACT → OBSERVE
                           │
                           ▼
                         DONE
```

### One-line summary

> 🪿 **Goose is an open-source, general-purpose AI agent that provides a ready-to-use agent environment and can be extended with tools, MCP servers, skills, workflows, subagents, and computer capabilities.**

---

## 🔗 Official Resources

- [Goose Official Website](https://block.github.io/goose/)
- [Goose GitHub Repository](https://github.com/aaif-goose/goose)
- [Goose Installation](https://block.github.io/goose/docs/getting-started/installation/)
- [Goose Extensions](https://block.github.io/goose/docs/getting-started/using-extensions/)
- [Goose Providers](https://block.github.io/goose/docs/getting-started/providers/)
- [Goose Recipes](https://block.github.io/goose/docs/guides/recipes/recipe-reference/)
- [Goose Custom Extensions](https://block.github.io/goose/docs/tutorials/custom-extensions/)
- [Model Context Protocol](https://modelcontextprotocol.io/)

---

# 📌 Day 6 Status

```text
[✓] Understood Goose
[✓] Understood why Goose is different from an SDK
[✓] Explored Goose architecture
[✓] Understood model providers
[✓] Understood tools
[✓] Understood extensions
[✓] Learned MCP integration
[✓] Explored Computer Controller
[✓] Learned about Skills
[✓] Learned about Recipes
[✓] Learned about Subagents
[✓] Learned about Sessions
[✓] Considered permissions and security
[✓] Compared Goose with OpenAI Agents SDK
[✓] Compared Goose with LangGraph
[✓] Connected Goose to the broader agent ecosystem
```

---

## 🧠 One Sentence to Remember

**Goose is not just another way to call an LLM — it is an open-source general-purpose agent environment that combines models, tools, extensions, MCP, and an agent loop so the system can actually perform multi-step tasks.**