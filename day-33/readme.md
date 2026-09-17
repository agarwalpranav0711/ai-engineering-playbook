# 🚀 Day 4 — Google ADK

> **Daily AI Learning — Exploring Google Agent Development Kit (ADK)**

Today I explored **Google Agent Development Kit (ADK)**, Google's open-source, code-first framework for building, orchestrating, evaluating, and deploying AI agents.

The main goal was not just to build a simple chatbot, but to understand **how ADK structures agents, tools, workflows, sessions, state, events, and execution**.

---

## 🎯 Today's Objective

- Understand what Google ADK is
- Understand why an agent framework is needed
- Build and run a basic ADK agent
- Understand the Agent abstraction
- Understand Models, Instructions, Tools, Sessions, State, Events, and Runners
- Understand tool calling
- Explore multi-agent systems
- Understand workflow-based orchestration
- Learn about Sequential, Parallel, and Loop workflows
- Understand ADK's memory and artifact concepts
- Understand callbacks, planning, evaluation, and deployment
- Compare ADK with technologies I previously learned:
  - LangGraph
  - A2A
  - A2UI
  - AG-UI
- Understand the overall architecture of an ADK application

---

# 🧠 1. What is Google ADK?

**ADK = Agent Development Kit.**

Google ADK is an open-source, code-first framework for building AI agents and agentic applications.

It provides abstractions for:

- Agents
- Models
- Tools
- Workflows
- Sessions
- State
- Events
- Memory
- Artifacts
- Callbacks
- Planning
- Evaluation
- Deployment

ADK is optimized for Google's Gemini ecosystem, but it is designed to be flexible and can work with other models and integrations.

The current Python project is **ADK 2.0**, which introduced breaking changes compared with ADK 1.x, including changes to the agent API, event model, and session schema.

---

# 🤔 2. Why do we need an Agent Development Kit?

An LLM by itself mainly provides intelligence.

For example:

```text
User
 ↓
LLM
 ↓
Text Response
```

But a real agentic application may need:

```text
User
 ↓
Agent
 ├── Model
 ├── Tools
 ├── State
 ├── Memory
 ├── Other Agents
 ├── Workflows
 └── External Services
```

The application also needs infrastructure for:

- Executing agents
- Managing sessions
- Calling tools
- Maintaining state
- Streaming events
- Coordinating multiple agents
- Running deterministic workflows
- Evaluating agent behavior
- Debugging
- Deploying

ADK provides these building blocks instead of requiring developers to implement everything from scratch.

---

# 🧩 3. The Core ADK Mental Model

The most important architecture I learned today:

```text
                    USER
                      │
                      ▼
                   RUNNER
                      │
                      ▼
                    AGENT
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
        MODEL        TOOLS       STATE
          │           │           │
          └───────────┼───────────┘
                      │
                      ▼
                    EVENTS
                      │
                      ▼
                    USER
```

For larger applications:

```text
                     APPLICATION
                          │
                          ▼
                        AGENT
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
           MODEL        TOOLS      SUB-AGENTS
                                      │
                         ┌────────────┼────────────┐
                         ▼            ▼            ▼
                     SEQUENTIAL    PARALLEL      LOOP
```

---

# 🤖 4. What is an Agent?

An **Agent** is the fundamental execution unit responsible for accomplishing a task.

A basic agent combines:

```text
Agent
 ├── Model
 ├── Instructions
 ├── Description
 └── Tools
```

Example:

```python
from google.adk import Agent

root_agent = Agent(
    name="hello_agent",
    model="gemini-2.5-flash",
    instruction="You are a helpful assistant."
)
```

An agent is more than just an LLM.

It combines the model with instructions, capabilities, and execution context.

---

# 🧠 5. Agent vs Model

This distinction is important.

### Model

The model provides the underlying intelligence.

```text
Gemini
```

### Agent

The agent wraps the model with additional behavior and capabilities.

```text
Agent
 ├── Model
 ├── Instructions
 ├── Tools
 └── Context
```

A simple way to remember:

```text
Model = Intelligence

Agent = Intelligence + Behavior + Capabilities + Execution Context
```

---

# 📝 6. Instructions

Instructions define how the agent should behave.

Example:

```python
instruction="""
You are a programming tutor.
Explain concepts simply.
Give examples when useful.
"""
```

Instructions define things such as:

- Role
- Behavior
- Rules
- Task requirements
- Response style

---

# 🏷️ 7. Agent Name

Agents have unique identities.

Example:

```python
name="research_agent"
```

Names become particularly useful in multi-agent systems.

For example:

```text
Coordinator
 ├── Researcher
 ├── Writer
 └── Reviewer
```

---

# 📖 8. Agent Description

A description explains what an agent is capable of.

Example:

```python
description="Researches technical topics and summarizes findings."
```

Descriptions are particularly useful when agents need to delegate work to specialized agents.

Conceptually:

```text
name
 ↓
Who am I?

description
 ↓
What am I good at?
```

---

# 🛠️ 9. What is a Tool?

An agent can reason, but tools allow it to **take actions or access external capabilities**.

Examples:

- APIs
- Databases
- Search
- Calculations
- Code execution
- File operations
- External services
- Custom Python functions

A custom Python function can act as a tool.

Example:

```python
def get_weather(city: str) -> dict:
    """Returns weather information for a city."""
    return {
        "city": city,
        "temperature": 28,
        "condition": "Sunny"
    }
```

Then:

```python
root_agent = Agent(
    name="weather_agent",
    model="gemini-2.5-flash",
    instruction="Help users with weather questions.",
    tools=[get_weather]
)
```

---

# 🔄 10. Tool Calling

One of the most important concepts I learned:

The model does not directly execute the Python function.

Instead:

```text
User
 ↓
Agent
 ↓
Model
 ↓
Model decides:
"I need a tool"
 ↓
Tool Call
 ↓
ADK executes Tool
 ↓
Tool Result
 ↓
Model
 ↓
Final Response
```

For example:

```text
User:
"What is the weather in Delhi?"

        ↓

Model:
"I need weather information."

        ↓

get_weather("Delhi")

        ↓

Tool Result:
28°C, Sunny

        ↓

Model generates final answer
```

This is the basic agent-tool loop.

---

# 🏃 11. What is a Runner?

The **Runner** is the execution engine.

A useful mental model:

```text
Agent
=
Definition

Runner
=
Execution
```

The Runner manages things such as:

- Session lifecycle
- Agent invocation
- State
- Events
- Execution flow
- Tool outputs
- Streaming events

Current ADK documentation describes `Runner` as the top-level execution engine connecting the agent/application with session, memory, artifact, plugin, and event infrastructure.

---

# 🗂️ 12. What is a Session?

A **Session** represents the context of a conversation or execution.

Conceptually:

```text
Session
 ├── User Message
 ├── Agent Response
 ├── Tool Call
 ├── Tool Result
 ├── Agent Response
 └── State
```

A session gives the agent the context needed for a particular interaction.

---

# 💾 13. What is State?

State is information associated with the current session.

Example:

```json
{
  "user_name": "Pranav",
  "current_topic": "Google ADK",
  "language": "English"
}
```

Mental model:

```text
Session
 =
Conversation / Execution Container

State
 =
Data stored inside that context
```

---

# ⚡ 14. What are Events?

An **Event** represents something that happens during an ADK session.

Examples:

- User message
- Agent response
- Tool call
- Tool result
- State-related activity

Conceptually:

```text
User Message
      ↓
    Event
      ↓
Agent Processing
      ↓
    Event
      ↓
Tool Call
      ↓
    Event
      ↓
Tool Result
      ↓
    Event
      ↓
Agent Response
```

Events are important because they form the execution/history stream of an agent application.

---

# 🧠 15. Session vs State vs Memory

These three concepts should not be confused.

### Session

Current conversation/execution context.

### State

Working information associated with that session.

### Memory

Longer-term information that can potentially be retrieved across sessions.

```text
SESSION
 ├── Events
 └── State

MEMORY
 └── Long-term information
```

---

# 🗃️ 16. What are Artifacts?

Agents may need to work with files and binary data.

Examples:

- PDFs
- Images
- Documents
- Generated reports
- Code files
- Other binary outputs

ADK provides artifact-management capabilities for saving, loading, and managing these outputs.

Conceptually:

```text
Agent
 └── Artifact
      ├── PDF
      ├── Image
      ├── Document
      └── Generated File
```

---

# 🔌 17. Callbacks

Callbacks allow custom logic to run at specific points during agent execution.

They can be used for:

- Logging
- Monitoring
- Validation
- Safety checks
- Metrics
- Custom side effects

Conceptually:

```text
Before Execution
       ↓
   Callback
       ↓
    Agent
       ↓
   Callback
       ↓
After Execution
```

---

# 🧩 18. Multi-Agent Systems

ADK allows multiple specialized agents to work together.

Example:

```text
                  Coordinator
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      Researcher      Writer      Reviewer
```

Each agent can specialize in a particular task.

This improves modularity and allows complex applications to be divided into smaller components.

---

# 🔀 19. Agent Delegation

A coordinator agent can delegate work to specialized agents.

Example:

```text
User
 ↓
Coordinator
 ↓
"Research this topic"
 ↓
Researcher
 ↓
Research Result
 ↓
Coordinator
 ↓
Writer
 ↓
Final Response
```

This connects directly to what I learned previously about **A2A (Agent-to-Agent)**.

---

# 🔗 20. ADK and A2A

These solve different problems.

### ADK

Used to:

```text
BUILD AND ORCHESTRATE AGENTS
```

### A2A

Used for:

```text
AGENT ↔ AGENT COMMUNICATION
```

Mental model:

```text
ADK
 ↓
Build Agent A

ADK
 ↓
Build Agent B

A2A
 ↕
Agent A ↔ Agent B
```

---

# 🔀 21. Workflows

ADK 2.0 has a graph-based workflow runtime for composing agentic and deterministic execution flows.

Workflows are useful when a task becomes more complicated than a single agent.

Example:

```text
START
  ↓
Research
  ↓
Generate
  ↓
Review
  ↓
END
```

Workflows allow developers to combine:

- Agents
- Code execution
- Routing
- Parallel execution
- Loops
- State
- Human-in-the-loop steps
- Other workflow nodes

---

# ➡️ 22. Sequential Workflow

A sequential workflow executes tasks in a defined order.

```text
Research
   ↓
Write
   ↓
Review
   ↓
Publish
```

This is useful when:

```text
Step B depends on Step A.
```

---

# ⚡ 23. Parallel Workflow

Parallel execution is useful when multiple tasks are independent.

```text
             Coordinator
                  │
       ┌──────────┼──────────┐
       ▼          ▼          ▼
   Research     Search     Analysis
       │          │          │
       └──────────┼──────────┘
                  ▼
               Combine
```

The independent tasks can execute concurrently.

---

# 🔁 24. Loop Workflow

Some tasks need repeated execution.

Example:

```text
Generate
   ↓
Evaluate
   ↓
Good?
 ┌─┴─┐
No   Yes
│     │
└─────┘
```

A loop workflow can repeatedly execute a process until a condition or iteration limit is reached.

---

# 🧱 25. Deterministic vs AI-Driven Execution

This was an important architectural idea.

Some decisions are better handled by an LLM:

```text
"Which specialist should handle this?"
```

Other decisions are better explicitly defined:

```text
Research → Write → Review
```

So an agentic application can combine:

```text
AI Reasoning
+
Deterministic Code
```

This gives more control and predictability.

---

# 🧠 26. Planning

Agents can also break complex goals into smaller steps.

Example:

```text
Goal:
Build a web application.

Plan:
1. Understand requirements
2. Design architecture
3. Build backend
4. Build frontend
5. Test
6. Fix issues
```

Planning helps agents handle tasks that require multiple reasoning steps.

---

# 💻 27. Code Execution

Agents can use code execution capabilities to perform tasks such as:

- Calculations
- Data processing
- Programmatic transformations
- Complex computation

Conceptually:

```text
User
 ↓
Agent
 ↓
"I need to calculate something"
 ↓
Code Execution
 ↓
Result
 ↓
Agent
 ↓
Answer
```

---

# 🧪 28. Evaluation

Building an agent is not enough.

An agent needs to be tested.

```text
Agent works once
        ≠
Agent is reliable
```

ADK provides evaluation capabilities for testing agent behavior against evaluation datasets.

The development lifecycle becomes:

```text
Build
 ↓
Run
 ↓
Evaluate
 ↓
Debug
 ↓
Improve
```

---

# 🐛 29. Development UI

ADK provides a development UI for working with agents locally.

It can be used for:

- Testing
- Debugging
- Evaluation
- Inspecting execution
- Viewing events
- Exploring agent behavior

This makes it easier to understand what happens internally instead of only seeing the final text response.

---

# 📦 30. Basic ADK Project Structure

A simple project can look like:

```text
Day_4_Google_ADK/
│
├── hello_agent/
│   ├── __init__.py
│   ├── agent.py
│   └── .env
│
├── requirements.txt
├── .gitignore
└── README.md
```

---

# ⚙️ 31. Installation

Inside a Python virtual environment:

```bash
pip install google-adk
```

ADK currently requires Python 3.10+.

The official project recommends using a virtual environment and installing the stable package through `pip`.

---

# 🤖 32. My First ADK Agent

Example:

```python
from google.adk import Agent

root_agent = Agent(
    name="hello_agent",
    model="gemini-2.5-flash",
    description="A simple greeting agent.",
    instruction="Greet the user and explain that you are an ADK agent."
)
```

This demonstrated the basic Agent abstraction.

---

# 🛠️ 33. My First Custom Tool

I also explored how an agent can be given a custom Python function as a tool.

Example:

```python
def get_student_info() -> dict:
    """Returns information about the student."""
    return {
        "name": "Pranav",
        "role": "student",
        "focus": [
            "AI",
            "Agents",
            "Web Development"
        ]
    }
```

Then:

```python
root_agent = Agent(
    name="student_agent",
    model="gemini-2.5-flash",
    instruction="Answer questions using the available tools.",
    tools=[get_student_info]
)
```

The important concept was:

```text
Model decides
      ↓
Tool should be used
      ↓
ADK executes Python function
      ↓
Result goes back
      ↓
Model generates response
```

---

# 🖥️ 34. Running an ADK Agent

ADK provides CLI tooling.

Interactive execution:

```bash
adk run path/to/my_agent
```

Development UI:

```bash
adk web path/to/agents_dir
```

This allowed me to move from simply defining an agent to actually executing and inspecting it.

---

# 🌐 35. ADK vs LangGraph

I have previously explored LangGraph, so this comparison helped me understand ADK better.

### LangGraph

My mental model:

```text
State
 ↓
Nodes
 ↓
Edges
 ↓
Conditional Routing
 ↓
END
```

It is strongly centered around explicit graph/state-machine orchestration.

### ADK

My mental model:

```text
Agent
 ↓
Tools
 ↓
Sessions
 ↓
Runner
 ↓
Workflows
```

ADK also supports graph-based workflows, so it is not simply "graphs vs no graphs."

A better distinction is:

```text
LangGraph
→ graph/state-machine-first

ADK
→ agent/runtime/workflow-first
```

---

# 🎨 36. ADK vs A2UI

From Day 2:

```text
A2UI
=
Agent → UI
```

It focuses on how an agent can generate/use structured UI rather than returning only text.

ADK is different:

```text
ADK
=
Framework for building and running agents
```

They operate at different layers.

---

# 🖥️ 37. ADK vs AG-UI

From Day 3:

```text
AG-UI
=
Agent ↔ Frontend interaction
```

While:

```text
ADK
=
Agent development + execution + orchestration
```

Conceptually they can fit together:

```text
Frontend
    ↕
  AG-UI
    ↕
ADK Agent
    │
 ┌──┼──┐
 ▼  ▼  ▼
Tools Agents Model
```

---

# 🤝 38. ADK + A2A + AG-UI + A2UI

The concepts I learned over the last few days can fit together:

```text
                     FRONTEND
                        │
                        ↕
                      AG-UI
                        │
                        ▼
                    ADK AGENT
                        │
             ┌──────────┼──────────┐
             ▼          ▼          ▼
           MODEL       TOOLS     WORKFLOWS
                                    │
                              ┌─────┼─────┐
                              ▼     ▼     ▼
                           Agent  Agent  Agent
                              ↕
                             A2A
```

And A2UI can be used at the UI-generation layer:

```text
Agent
  ↓
Structured UI
  ↓
Frontend
```

This helped me understand that these technologies are **not necessarily competitors**.

They can operate at different layers of an agentic system.

---

# ☁️ 39. Deployment

ADK is not only for local experiments.

The current ecosystem supports deployment options including:

- Docker
- Cloud Run
- Vertex AI Agent Engine

So the development lifecycle can look like:

```text
Build
 ↓
Run Locally
 ↓
Evaluate
 ↓
Debug
 ↓
Deploy
 ↓
Monitor
```

---

# 🧠 40. The Most Important Things I Learned

The biggest lessons from today were:

### 1. An Agent is not just an LLM

```text
Agent
=
Model
+
Instructions
+
Tools
+
Context
```

### 2. Tools give agents capabilities

```text
LLM
+
Tools
=
Ability to interact with the outside world
```

### 3. Runner is the execution engine

```text
Agent = Definition
Runner = Execution
```

### 4. Session and State are different

```text
Session = Execution/Conversation Context
State = Working Data
```

### 5. Events represent what happens

```text
User Message
Tool Call
Tool Result
Agent Response
```

can all participate in the event stream.

### 6. Multiple agents can specialize

```text
Coordinator
 ├── Researcher
 ├── Writer
 └── Reviewer
```

### 7. Workflows can combine AI and deterministic logic

```text
LLM reasoning
+
Explicit execution flow
```

### 8. Agent frameworks are more than prompts

A real agent system requires:

```text
Models
Tools
State
Memory
Execution
Orchestration
Evaluation
Deployment
```

---

# 🔥 41. My Final Mental Model

The simplest way I understand Google ADK now:

```text
                         GOOGLE ADK
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
      AGENTS                TOOLS               WORKFLOWS
        │                     │                     │
      MODEL               APIs / Code       Sequential / Parallel
        │                                      / Loop
   INSTRUCTIONS
        │
   SUB-AGENTS
        │
        └───────────────┐
                        ▼
                      RUNNER
                        │
              ┌─────────┼─────────┐
              ▼         ▼         ▼
           SESSION     STATE    EVENTS
              │
              ▼
            MEMORY
              │
              ▼
          ARTIFACTS
```

---

# 📚 42. What I Explored Today

### Concepts

- Google ADK
- Agent
- Model
- Instructions
- Description
- Tools
- Tool Calling
- Runner
- Session
- State
- Events
- Memory
- Artifacts
- Callbacks
- Planning
- Code Execution
- Multi-Agent Systems
- Agent Delegation
- Workflows
- Sequential Workflow
- Parallel Workflow
- Loop Workflow
- Evaluation
- Development UI
- Deployment

### Practical Work

- Installed Google ADK
- Created an ADK project
- Created a basic agent
- Ran the agent
- Explored the ADK CLI
- Explored the development UI
- Created a custom Python tool
- Connected the tool to an agent
- Observed the agent/tool interaction
- Studied multi-agent architecture
- Compared ADK with LangGraph
- Compared ADK with A2A
- Compared ADK with AG-UI
- Compared ADK with A2UI

---

# 🧩 43. Key Takeaway

> **Google ADK is a framework for turning models into structured agentic applications by combining agents, tools, workflows, sessions, state, events, memory, evaluation, and deployment capabilities.**

The most important mental shift from today:

```text
Before:

LLM
 ↓
Prompt
 ↓
Response
```

After learning ADK:

```text
User
 ↓
Runner
 ↓
Agent
 ↓
Model
 ├── Tools
 ├── State
 ├── Memory
 ├── Other Agents
 └── Workflows
 ↓
Events
 ↓
Response
```

---

# 🚀 What's Next?

The next step is not to immediately learn another framework.

The goal is to keep building the mental map:

```text
A2A
 ↓
A2UI
 ↓
AG-UI
 ↓
Google ADK
 ↓
???
```

The next daily experiment can build on this foundation by exploring another agent framework or capability and comparing it with what I already know.

---

## 📌 Official References

- Google ADK Documentation
- Google ADK Python Repository
- ADK Concepts & Architecture
- ADK Agent Documentation
- ADK Runner Documentation
- ADK Tutorials

> **Note:** ADK is evolving quickly. This README is based on the current ADK 2.0 architecture, and older ADK 1.x tutorials may contain APIs or concepts that have changed.