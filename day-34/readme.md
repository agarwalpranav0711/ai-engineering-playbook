# Day 5 — OpenAI Agents SDK 🤖

> **Daily AI Learning — Ecosystem Experiment**

## 📌 Today's Task

**Day 5 — OpenAI Agents SDK**

> Not as my main framework — just an ecosystem experiment.

### Goal

Build the **smallest possible agent + tool workflow** using the OpenAI Agents SDK and compare its architecture and mental model with **LangGraph**.

---

# 🧠 What I Learned Today

Today I explored the **OpenAI Agents SDK**, a lightweight Python-first framework for building agentic AI applications.

The main idea is to provide a small number of powerful abstractions instead of requiring developers to learn a large framework.

The SDK provides core concepts such as:

- Agents
- Models
- Instructions
- Tools
- Agent loops
- Runner
- Handoffs
- Agents as tools
- Guardrails
- Sessions
- Tracing
- Multi-agent orchestration

The current SDK also provides broader capabilities including hosted tools, MCP integration, sandbox agents, realtime agents, human-in-the-loop workflows, and more.

---

# 1. What is the OpenAI Agents SDK?

The **OpenAI Agents SDK** is a framework for building applications where AI models can:

- follow instructions
- use tools
- perform multi-step tasks
- delegate work to other agents
- maintain conversational context
- apply guardrails
- produce structured outputs
- expose execution traces

The SDK is designed around a relatively small set of primitives.

A useful mental model is:

```text
                 OpenAI Agents SDK
                         │
          ┌──────────────┼──────────────┐
          │              │              │
        Agents         Tools       Guardrails
          │              │              │
          └──────────────┼──────────────┘
                         │
                  Agent Runtime
                         │
          ┌──────────────┼──────────────┐
          │              │              │
      Handoffs        Sessions       Tracing
```

The official documentation describes Agents as the core building block and combines them with tools, handoffs, guardrails, sessions, and tracing to create agentic workflows.

---

# 2. Why use an Agents SDK?

A raw LLM call is basically:

```text
User
 ↓
Model
 ↓
Response
```

An agentic application needs more:

```text
User
 ↓
Agent
 ↓
Model
 ↓
Decision
 ├── Answer directly
 ├── Call a tool
 └── Delegate to another agent
       ↓
    Tool/Agent result
       ↓
     Model again
       ↓
   Final response
```

The SDK provides the runtime needed to manage these interactions.

The current SDK uses the Responses API by default for OpenAI models, but adds a higher-level agent runtime around model calls, tools, handoffs, guardrails, and sessions.

---

# 3. Core Mental Model

The most important mental model I learned today is:

```text
Agent
 =
Model
 +
Instructions
 +
Tools
 +
Runtime behavior
```

An agent is not simply an LLM.

It is an LLM configured with behavior and capabilities.

---

# 4. Agent

An `Agent` is the main building block.

A basic agent looks like:

```python
from agents import Agent

agent = Agent(
    name="My First Agent",
    instructions="You are a helpful assistant."
)
```

The important properties include:

### Name

```python
name="My First Agent"
```

Identifies the agent.

### Instructions

```python
instructions="You are a helpful assistant."
```

Defines how the agent should behave.

### Model

The agent can use a model to perform the reasoning/generation.

### Tools

Tools give the agent capabilities beyond simply generating text.

### Handoffs

Handoffs allow the agent to delegate work to another agent.

### Guardrails

Guardrails can validate inputs, outputs, or tool execution.

The current documentation describes an Agent as an LLM configured with instructions, tools, and optional runtime behavior such as handoffs, guardrails, and structured outputs.

---

# 5. Agent vs Model

This was an important distinction.

## Model

```text
Input
 ↓
Model
 ↓
Output
```

## Agent

```text
Instructions
      +
Model
      +
Tools
      +
Runtime
      +
Context
      +
Agent loop
```

Therefore:

```text
Model = intelligence

Agent = intelligence + behavior + capabilities + runtime
```

---

# 6. Runner

The `Runner` is responsible for actually executing an agent.

Example:

```python
from agents import Agent, Runner

agent = Agent(
    name="My First Agent",
    instructions="You are a helpful assistant."
)

result = Runner.run_sync(
    agent,
    "Explain what an AI agent is."
)

print(result.final_output)
```

The architecture is:

```text
Agent
  │
  │ definition
  ▼
Runner
  │
  │ execution
  ▼
Result
```

The official quickstart uses `Runner` to execute agents, tool calls, and handoffs.

---

# 7. `run_sync()` vs `run()`

The SDK supports synchronous and asynchronous execution.

### Synchronous

```python
result = Runner.run_sync(
    agent,
    "Hello!"
)
```

### Asynchronous

```python
result = await Runner.run(
    agent,
    "Hello!"
)
```

The async version is useful when building applications that need asynchronous execution and concurrency.

---

# 8. Final Output

After execution:

```python
result.final_output
```

contains the final response.

Example:

```python
print(result.final_output)
```

So the basic pipeline is:

```text
User Input
    ↓
Agent
    ↓
Runner
    ↓
Model
    ↓
Result
    ↓
final_output
```

---

# 9. Tools

One of the most important things I explored today was **tools**.

An LLM by itself can generate text.

A tool allows an agent to perform an action.

Examples:

```text
Database query
API request
Calculator
Search
File operation
Code execution
External service
Python function
```

The SDK supports multiple tool categories, including function tools, hosted OpenAI tools, local/runtime execution tools, agents as tools, and MCP-related tools.

---

# 10. Function Tools

A Python function can be exposed as an agent tool.

Example:

```python
from agents import Agent, Runner, function_tool


@function_tool
def get_student_info() -> str:
    """Return information about the student."""
    return "The student is learning AI agents, LangGraph, and AI systems."


agent = Agent(
    name="Student Assistant",
    instructions=(
        "You are a helpful student assistant. "
        "Use get_student_info when useful."
    ),
    tools=[get_student_info],
)

result = Runner.run_sync(
    agent,
    "What is the student currently learning?"
)

print(result.final_output)
```

The important part is:

```python
@function_tool
```

It turns the Python function into something the agent can call.

---

# 11. Tool Calling Architecture

The tool-calling process is:

```text
User
 ↓
Agent
 ↓
Model
 ↓
Does the agent need a tool?
 │
 ├── No
 │    ↓
 │  Final answer
 │
 └── Yes
      ↓
   Tool call
      ↓
   Python function
      ↓
   Tool result
      ↓
   Model
      ↓
   Final answer
```

This is the basic **agent loop**.

---

# 12. Tool with Arguments

Tools can accept arguments.

Example:

```python
from agents import Agent, Runner, function_tool


@function_tool
def calculate_square(number: int) -> int:
    """Calculate the square of an integer."""
    return number * number


agent = Agent(
    name="Math Agent",
    instructions="You are a helpful math assistant.",
    tools=[calculate_square],
)

result = Runner.run_sync(
    agent,
    "What is the square of 12?"
)

print(result.final_output)
```

Conceptually:

```text
User
 ↓
"What is the square of 12?"
 ↓
Agent
 ↓
Model decides tool is useful
 ↓
calculate_square(number=12)
 ↓
144
 ↓
Model
 ↓
Final answer
```

---

# 13. Why Tool Descriptions Matter

The tool contains a docstring:

```python
"""Calculate the square of an integer."""
```

The model needs information about:

- what the tool does
- what arguments it accepts
- what the arguments mean
- what result it returns

This allows the model to decide when the tool is appropriate.

---

# 14. The Agent Loop

This was one of the most important concepts today.

An agent isn't necessarily:

```text
Prompt
 ↓
Answer
```

Instead:

```text
Prompt
 ↓
Model
 ↓
Decision
 ↓
Tool?
 ├── No → Final output
 │
 └── Yes
       ↓
   Execute tool
       ↓
   Tool result
       ↓
     Model
       ↓
   Decision again
       ↓
   Final output
```

The SDK's built-in agent loop handles tool invocation and continues the interaction until the task reaches completion.

---

# 15. Multi-Agent Systems

The SDK can also coordinate multiple agents.

Example:

```text
                 Triage Agent
                      │
             ┌────────┴────────┐
             ▼                 ▼
        Math Agent        History Agent
```

The triage agent decides which specialist should handle the request.

---

# 16. Handoffs

A **handoff** means an agent delegates control to another agent.

Example:

```text
Triage Agent
     │
     │ handoff
     ▼
History Agent
```

The specialist then becomes responsible for the conversation.

The official SDK describes handoffs as a way for one agent to delegate a task to another agent, with the receiving agent taking over that part of the workflow.

---

# 17. Handoff Example

```python
from agents import Agent, Runner


math_agent = Agent(
    name="Math Agent",
    handoff_description="Handles mathematics questions.",
    instructions="Solve mathematics questions step by step.",
)


history_agent = Agent(
    name="History Agent",
    handoff_description="Handles history questions.",
    instructions="Answer history questions clearly.",
)


triage_agent = Agent(
    name="Triage Agent",
    instructions="Route the question to the appropriate specialist.",
    handoffs=[
        math_agent,
        history_agent,
    ],
)


result = Runner.run_sync(
    triage_agent,
    "Who was the first president of the United States?"
)

print(result.final_output)
print("Final agent:", result.last_agent.name)
```

---

# 18. `handoff_description`

This:

```python
handoff_description="Handles mathematics questions."
```

helps the routing agent understand **when that specialist should receive control**.

So the architecture becomes:

```text
User
 ↓
Triage Agent
 ↓
Model decides
 ↓
Handoff
 ↓
Specialist Agent
 ↓
Final answer
```

---

# 19. Handoff vs Tool

This distinction is extremely important.

## Tool

```text
Agent
 ↓
Tool
 ↓
Tool result
 ↓
Same Agent
 ↓
Final answer
```

The original agent remains in control.

## Handoff

```text
Agent A
 ↓
Handoff
 ↓
Agent B
 ↓
Agent B continues
```

Control moves to another agent.

Therefore:

```text
Tool
=
"Do this operation for me."

Handoff
=
"You take over this task."
```

---

# 20. Agents as Tools

There is another multi-agent architecture.

Instead of handing over control:

```text
Triage
 ↓
Specialist takes over
```

we can have:

```text
                Manager
              /    |     \
             /     |      \
            ▼      ▼       ▼
        Math     History   Research
         Agent     Agent     Agent
          as        as        as
         Tool      Tool      Tool
```

The manager remains responsible for the final response.

The official SDK distinguishes this **manager/agents-as-tools** pattern from handoffs: with agents as tools, the central agent retains control of the conversation.

---

# 21. Handoff vs Agents-as-Tools

### Handoff

```text
Manager
   │
   ▼
Specialist
   │
   ▼
Specialist controls conversation
```

### Agents as tools

```text
Manager
   │
   ├──► Specialist A
   │
   ├──► Specialist B
   │
   └──► Specialist C
           │
           ▼
       Manager gets result
           │
           ▼
       Final response
```

The architectural question is:

> **Who should own the final answer?**

If the specialist should take over → **Handoff**

If the manager should remain in control → **Agent as a tool**

---

# 22. Guardrails

Guardrails provide validation and safety checks around agent execution.

They can be used for:

```text
Input validation
Output validation
Tool validation
Safety checks
Business rules
```

The current SDK supports input guardrails, output guardrails, and tool guardrails.

---

# 23. Guardrail Architecture

```text
User
 ↓
Input Guardrail
 ↓
Agent
 ↓
Tool
 ↓
Output Guardrail
 ↓
Final response
```

If a guardrail fails, the SDK can trigger a **tripwire** and stop further processing.

---

# 24. Sessions

Agents often need conversation history.

For example:

```text
User:
My name is Pranav.

Agent:
Nice to meet you.

User:
What is my name?
```

The system needs a way to maintain that context.

That's where **sessions** come in.

The SDK provides session mechanisms for maintaining working conversation context across agent runs.

---

# 25. Session Mental Model

```text
Session
 │
 ├── User message
 ├── Agent response
 ├── User message
 ├── Tool call
 ├── Tool result
 └── Agent response
```

So:

```text
Session
=
persistent working conversation context
```

This should not be confused with a general-purpose long-term memory system.

---

# 26. Tracing

Another major feature is **built-in tracing**.

Tracing records what happened during an agent workflow.

For example:

```text
Run
 │
 ├── Agent
 │
 ├── Model generation
 │
 ├── Tool call
 │
 ├── Tool result
 │
 ├── Handoff
 │
 ├── Guardrail
 │
 └── Final output
```

The current SDK's tracing system records events such as LLM generations, tool calls, handoffs, guardrails, and custom events.

---

# 27. Why Tracing Matters

Without tracing:

```text
Agent
 ↓
Final answer
```

With tracing:

```text
Agent started
      ↓
Model call
      ↓
Tool selected
      ↓
Tool executed
      ↓
Tool result
      ↓
Model called again
      ↓
Handoff
      ↓
Final output
```

This makes debugging complex agent workflows much easier.

The SDK's tracing is enabled by default and can be inspected through the OpenAI dashboard's trace viewer.

---

# 28. OpenAI Agents SDK Architecture

My mental model after today's exploration:

```text
                         USER
                           │
                           ▼
                    ┌─────────────┐
                    │    AGENT    │
                    │             │
                    │ Instructions│
                    │    Model    │
                    │    Tools    │
                    └──────┬──────┘
                           │
                           ▼
                     AGENT LOOP
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
            TOOL        HANDOFF      ANSWER
              │            │
              ▼            ▼
          Tool result    Agent B
              │
              ▼
            MODEL
              │
              ▼
         FINAL OUTPUT

        + Sessions
        + Guardrails
        + Tracing
```

---

# 29. OpenAI Agents SDK vs LangGraph

One of the main goals of today's experiment was to compare the two.

The most useful way to compare them is **not**:

> Which framework is better?

Instead:

> What mental model does each framework make natural?

---

## OpenAI Agents SDK

The natural abstraction is:

```text
Agent
 ↓
Instructions
 ↓
Tools
 ↓
Agent Loop
 ↓
Tool / Handoff
 ↓
Final Output
```

It is **agent-centric**.

---

## LangGraph

The natural abstraction is:

```text
START
 ↓
Node
 ↓
State
 ↓
Edge
 ↓
Conditional Routing
 ↓
Node
 ↓
END
```

It is strongly **graph/state-centric**.

---

# 30. Side-by-Side Comparison

| Concept | OpenAI Agents SDK | LangGraph |
|---|---|---|
| Main abstraction | Agent | Graph |
| Execution | Runner | Graph execution |
| Capability | Tool | Node/tool |
| Routing | Handoffs / agent logic | Edges / conditional edges |
| State/context | Sessions + context | Explicit graph state + persistence |
| Multi-agent | Handoffs / agents as tools | Agent nodes/subgraphs |
| Guardrails | Built-in | Implemented through graph/application logic |
| Tracing | Built-in tracing | Observability/integration ecosystem |
| Philosophy | Agent-centric | Graph/state-centric |
| Code-first | Yes | Yes |
| Workflow control | Agent runtime + Python | Explicit graph structure |

---

# 31. The Most Important Architectural Difference

A simplified mental model:

### OpenAI Agents SDK

```text
"What should these agents do
and how should they collaborate?"
```

### LangGraph

```text
"How should execution move
through this stateful workflow?"
```

This is a **difference in the starting abstraction**, not a statement that either framework can only implement one kind of architecture.

---

# 32. Same Problem — Two Architectures

Suppose we want:

```text
User question
      ↓
Determine type
      ↓
Math or History
```

### OpenAI Agents SDK

```text
Triage Agent
      │
      ├── Handoff → Math Agent
      │
      └── Handoff → History Agent
```

### LangGraph

```text
START
  │
  ▼
Router Node
  │
  ▼
Conditional Edge
  ├──────────────┐
  ▼              ▼
Math Node     History Node
  │              │
  └──────┬───────┘
         ▼
        END
```

This comparison helped me understand the difference much more clearly than simply reading framework documentation.

---

# 33. What I Actually Built

### Experiment 1 — Basic Agent

```text
Agent
 ↓
Runner
 ↓
Final Output
```

### Experiment 2 — Agent + Tool

```text
Agent
 ↓
Model
 ↓
Function Tool
 ↓
Tool Result
 ↓
Model
 ↓
Final Output
```

### Experiment 3 — Tool with Arguments

```text
Agent
 ↓
calculate_square(12)
 ↓
144
 ↓
Final Output
```

### Experiment 4 — Multi-Agent Routing

```text
Triage Agent
    │
    ├── Math Agent
    │
    └── History Agent
```

### Experiment 5 — Architecture Comparison

```text
OpenAI Agents SDK
=
Agents + Tools + Handoffs + Runtime
```

versus:

```text
LangGraph
=
State + Nodes + Edges + Graph Runtime
```

---

# 34. What I Learned

The biggest things I learned today:

### 1. An agent is more than an LLM

```text
Agent
=
Model + Instructions + Tools + Runtime
```

### 2. Tools give agents capabilities

```text
LLM
 ↓
Tool call
 ↓
Real action
```

### 3. The agent loop is central

```text
Reason
 ↓
Act
 ↓
Observe
 ↓
Reason again
```

### 4. Handoffs enable delegation

```text
Agent A
 ↓
Agent B
```

### 5. Agents-as-tools create manager architectures

```text
Manager
 ↓
Specialist agents
 ↓
Manager
```

### 6. Guardrails control execution

```text
Input
 ↓
Validation
 ↓
Agent
 ↓
Validation
 ↓
Output
```

### 7. Sessions maintain working context

```text
Conversation
 ↓
Session
 ↓
Future run
```

### 8. Tracing makes agent behavior observable

```text
Agent
 ↓
Trace
 ↓
Model / Tools / Handoffs / Guardrails
```

### 9. OpenAI Agents SDK and LangGraph start from different abstractions

```text
Agents SDK → Agent-centric

LangGraph → Graph/state-centric
```

---

# 35. What I Did NOT Try to Master Today

Today's goal was an **ecosystem experiment**, not becoming an OpenAI Agents SDK expert.

The current SDK has additional capabilities that I identified but did not deeply implement today:

- Hosted tools
- MCP
- Sandbox agents
- Realtime agents
- Voice agents
- Human-in-the-loop
- Advanced guardrails
- Structured outputs
- Advanced sessions
- Advanced tracing
- Custom model providers
- More complex orchestration patterns

These are potential future experiments rather than requirements for today's task.

---

# 36. What I Would Explore Next

If I return to the OpenAI Agents SDK later, useful next experiments would be:

```text
1. MCP integration
        ↓
2. Hosted tools
        ↓
3. Human approval
        ↓
4. Structured outputs
        ↓
5. Advanced guardrails
        ↓
6. Sessions
        ↓
7. Streaming
        ↓
8. Sandbox agents
        ↓
9. Realtime agents
        ↓
10. Production deployment
```

---

# 37. Day 5 Final Mental Model

After today's experiment, my mental model is:

```text
                 OPENAI AGENTS SDK
                         │
                         ▼
                      AGENT
                         │
              ┌──────────┼──────────┐
              │          │          │
              ▼          ▼          ▼
           MODEL       TOOLS    INSTRUCTIONS
              │          │
              └────┬─────┘
                   ▼
              AGENT LOOP
                   │
          ┌────────┼────────┐
          ▼        ▼        ▼
        ANSWER    TOOL    HANDOFF
                   │        │
                   ▼        ▼
                RESULT    AGENT
                   │
                   └────┬───┘
                        ▼
                   FINAL OUTPUT

          Supporting runtime:
          ├── Sessions
          ├── Guardrails
          └── Tracing
```

---

# 🎯 Final Takeaway

Today's experiment showed me that the **OpenAI Agents SDK is designed to make agent development lightweight and code-first**.

Instead of explicitly constructing every execution path as a graph, I can define:

```text
Agent
+
Instructions
+
Tools
+
Handoffs
+
Guardrails
```

and let the agent runtime manage the agent loop.

The biggest conceptual difference I observed compared with LangGraph is:

```text
OpenAI Agents SDK
        ↓
Start with AGENTS
        ↓
Tools / Handoffs
        ↓
Agent runtime
```

while:

```text
LangGraph
        ↓
Start with STATE + GRAPH
        ↓
Nodes + Edges
        ↓
Explicit execution flow
```

Neither mental model makes the other impossible. They simply make different kinds of orchestration feel more natural.

---

# 📚 Official References

- OpenAI Agents SDK — Python documentation
- OpenAI Agents SDK — Quickstart
- OpenAI Agents SDK — Agents
- OpenAI Agents SDK — Tools
- OpenAI Agents SDK — Handoffs
- OpenAI Agents SDK — Guardrails
- OpenAI Agents SDK — Sessions
- OpenAI Agents SDK — Tracing

The official documentation and examples used for this exploration are maintained in the OpenAI Agents SDK documentation and repository.

---

# 🚀 Daily AI Learning Progress

| Day | Topic | Status |
|---|---|---|
| Day 1 | A2A — Agent-to-Agent Communication | ✅ |
| Day 2 | A2UI — Agent-Generated UI | ✅ |
| Day 3 | AG-UI — Agent ↔ Frontend | ✅ |
| Day 4 | Google ADK | ✅ |
| **Day 5** | **OpenAI Agents SDK** | **✅** |

---

## 🧠 One-Line Summary

> **Day 5: I explored the OpenAI Agents SDK by building agents, tools, tool-calling loops, and multi-agent handoffs, then compared its agent-centric runtime architecture with the graph/state-centric approach of LangGraph.**

---

## 🔥 Today's Core Keywords

```text
OpenAI Agents SDK
Agent
Model
Instructions
Runner
Agent Loop
Function Tool
Tool Calling
Handoff
Agents as Tools
Manager Pattern
Multi-Agent System
Guardrails
Sessions
Tracing
MCP
Hosted Tools
Sandbox Agents
Realtime Agents
LangGraph
State
Nodes
Edges
Graph
Agentic Orchestration
```

---

**Day 5 complete. 🚀**