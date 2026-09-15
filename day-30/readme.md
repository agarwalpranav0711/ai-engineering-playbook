# Day 1 — Agent-to-Agent (A2A) Communication

> **30-Minute Daily Exploration — Day 1**

Today I explored **Agent-to-Agent (A2A) communication** and learned how independent AI agents can communicate, delegate tasks, exchange information, and collaborate to complete a larger goal.

---

# 1. What is A2A?

**A2A stands for Agent-to-Agent communication.**

At the simplest level, A2A means:

```text
Agent A
   │
   │ Task / Message
   ↓
Agent B
   │
   │ Result / Artifact
   ↓
Agent A
```

Instead of making one AI agent responsible for everything, we can create multiple specialized agents and allow them to collaborate.

For example:

```text
                    Manager Agent
                    /     |      \
                   /      |       \
                  ↓       ↓        ↓
             Research   Coding   Writing
               Agent     Agent     Agent
```

The manager can decide which specialist should handle a particular task.

---

# 2. Why do we need multiple agents?

A single large agent can potentially perform many different tasks, but a multi-agent architecture allows responsibilities to be separated.

For example:

```text
Research Agent
→ Researches information

Coding Agent
→ Writes and analyzes code

Data Agent
→ Analyzes datasets

Writing Agent
→ Creates reports

Testing Agent
→ Tests generated code
```

A coordinator can combine their capabilities.

```text
User
 ↓
Manager Agent
 ↓
Research Agent
 ↓
Coding Agent
 ↓
Testing Agent
 ↓
Manager Agent
 ↓
Final Result
```

This is called a **multi-agent system**.

---

# 3. Agent vs A2A

These are not the same thing.

## Agent

An **agent** is an AI system capable of working toward a goal, potentially using reasoning, tools, memory, and actions.

Example:

```text
Research Agent

Goal:
Find information about quantum computing.

Possible process:

Understand task
     ↓
Search
     ↓
Read information
     ↓
Analyze
     ↓
Summarize
     ↓
Return result
```

## A2A

**A2A is the communication/interoperability mechanism that allows agents to interact.**

```text
Agent A
   ↕
  A2A
   ↕
Agent B
```

A useful mental model is:

```text
Agent = worker

A2A = communication system between workers
```

---

# 4. The core idea: delegation

The most important concept I learned today is **delegation**.

One agent doesn't have to perform every task itself.

Instead:

```text
User
 ↓
Manager Agent
 ↓
"Research this topic."
 ↓
Research Agent
 ↓
Research result
 ↓
Manager Agent
 ↓
Final response
```

The manager is responsible for deciding:

> "Which agent should do this task?"

The specialist is responsible for:

> "How should I perform this task?"

---

# 5. Simple real-world analogy

A multi-agent system is similar to a company.

```text
                    Manager
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
      Researcher     Developer    Writer
```

The manager doesn't personally perform every task.

Instead:

```text
Manager
  ↓
Delegates task
  ↓
Specialist
  ↓
Completes task
  ↓
Returns result
```

AI agents can work using a similar architecture.

---

# 6. Basic A2A architecture

The simplest architecture I learned is:

```text
┌─────────────────────┐
│      Agent A        │
│     Coordinator     │
└──────────┬──────────┘
           │
           │ Task
           ↓
┌─────────────────────┐
│      Agent B        │
│     Specialist      │
└──────────┬──────────┘
           │
           │ Result
           ↓
┌─────────────────────┐
│      Agent A        │
└─────────────────────┘
```

Agent A:

- receives the user's goal
- decides what needs to be delegated
- sends the task
- receives the result
- continues the overall workflow

Agent B:

- receives the delegated task
- performs the work
- returns the result

---

# 7. A2A is more than simply calling a function

A simple Python program could do:

```python
result = research_agent(task)
```

This demonstrates the basic idea of delegation, but a real interoperable agent system can be much more sophisticated.

A real agent may:

```text
Receive goal
    ↓
Reason
    ↓
Choose action
    ↓
Use tools
    ↓
Observe results
    ↓
Reason again
    ↓
Complete task
```

A2A is useful when those agents need to communicate across system boundaries.

For example:

```text
Agent A
running on Server A
       │
       │ A2A
       ↓
Agent B
running on Server B
```

The agents do not necessarily need to share their internal implementation.

---

# 8. A2A and interoperability

One of the major ideas behind the A2A protocol is **interoperability**.

Different agents may be built using:

- different programming languages
- different frameworks
- different AI models
- different vendors
- different infrastructure

A standard communication protocol allows them to interact without requiring everyone to build the same internal architecture.

The current A2A specification describes the protocol as an open standard for communication and interoperability between independent, potentially opaque agent systems.

The important idea is:

```text
Agent A
   │
   │ Standard communication
   ↓
Agent B
```

rather than:

```text
Agent A
   │
   │ Must understand
   │ Agent B's entire
   │ internal implementation
   ↓
Agent B
```

---

# 9. A2A does not require agents to expose their internal reasoning

This is an important concept.

Agent A does not need to know exactly:

- which model Agent B uses
- how Agent B reasons internally
- which tools Agent B uses
- how Agent B stores its internal state

Instead, Agent A can interact with the capabilities exposed by Agent B.

This is known as **opaque execution** in the A2A specification.

Conceptually:

```text
Agent A

"I need a research result."

        ↓

Agent B

"I can provide research."

        ↓

Agent A

"I don't need to know
how Agent B internally
performed it."
```

---

# 10. Agent Card

One of the most important technical concepts I learned today is the **Agent Card**.

An Agent Card is essentially an agent's **digital business card**.

It describes things such as:

- agent identity
- description
- capabilities
- skills
- endpoint
- supported interaction methods
- authentication requirements

The A2A specification uses the Agent Card to allow clients to discover whether an agent is suitable for a particular task.

Conceptually:

```json
{
  "name": "Research Agent",
  "description": "Agent specialized in research",
  "skills": [
    "web-research",
    "summarization"
  ]
}
```

The actual A2A Agent Card contains more protocol-specific information.

---

# 11. Agent discovery

Before Agent A can delegate work to Agent B, it may need to discover:

> "What can Agent B do?"

This is where Agent Cards become useful.

Conceptually:

```text
Agent A
   │
   │ Discover available agents
   ↓
Agent Card
   │
   ├── Identity
   ├── Capabilities
   ├── Skills
   ├── Endpoint
   └── Authentication
```

The current specification defines standardized Agent Card discovery mechanisms, including a well-known Agent Card URI and other discovery approaches.

---

# 12. Message

A **Message** represents a communication turn between a client and an agent.

It can contain instructions, questions, context, or responses.

Conceptually:

```text
Message

Role:
user / agent

Content:
"Research the latest developments
in quantum computing."
```

The current A2A model defines a message as containing one or more `Part` objects.

---

# 13. Part

A **Part** is a smaller piece of content inside a Message or Artifact.

A Part can represent things such as:

```text
Text
File reference
Structured data
```

This makes A2A more flexible than a system that only exchanges plain text.

Conceptually:

```text
Message
 ├── Text Part
 ├── File Part
 └── Data Part
```

The current specification defines Parts as the fundamental content containers used inside Messages and Artifacts.

---

# 14. Task

A **Task** is one of the most important concepts in A2A.

A Task represents a unit of work that an agent is processing.

For example:

```text
Task:
"Research the top open-source
LLM frameworks."
```

The task has an ID and a lifecycle.

The current A2A specification defines a Task as a stateful unit of work with a unique identifier, status, history, and potentially generated artifacts.

Conceptually:

```text
Task
 ├── taskId
 ├── contextId
 ├── status
 ├── history
 └── artifacts
```

---

# 15. Task lifecycle

A task doesn't simply have:

```text
started → finished
```

It can move through different states.

The current specification includes states such as:

```text
submitted
    ↓
working
    ↓
completed
```

There can also be situations where the task:

```text
working
   ↓
input-required
```

or:

```text
working
   ↓
failed
```

Other terminal/interrupted states can also exist depending on the protocol version and implementation.

The current A2A specification defines a formal task lifecycle for tracking stateful work.

---

# 16. Context

A2A also supports a **context ID**.

A context can logically group related tasks and messages.

For example:

```text
contextId = abc123

Task 1
 ↓
Task 2
 ↓
Task 3
```

All of these can belong to the same broader interaction.

This allows an agent to maintain continuity across related interactions.

---

# 17. Artifact

An **Artifact** is an output generated as a result of a task.

Examples:

```text
Research report
Image
Document
Structured data
Code
Analysis
```

Conceptually:

```text
Task
 ↓
Agent performs work
 ↓
Artifact
```

For example:

```text
Task:
"Analyze this dataset."

        ↓

Artifact:
analysis.json
```

The A2A data model represents artifacts using Parts as their content.

---

# 18. Stateless message vs stateful task

An agent interaction does not always have to become a long-running Task.

An agent can return a simple **Message** for an immediate interaction.

Or it can create a **Task** when stateful work needs to be tracked.

Conceptually:

```text
Message
= quick/simple interaction
```

versus:

```text
Task
= stateful unit of work
```

The A2A task model specifically supports longer-running interactions and progress tracking.

---

# 19. Synchronous vs asynchronous work

This was another important concept.

Some tasks are quick:

```text
Request
 ↓
Agent
 ↓
Result
```

But imagine:

```text
"Analyze 10,000 documents
and produce a report."
```

That could take much longer.

Instead of keeping the client waiting for the entire process, A2A supports mechanisms for longer-running and asynchronous work, including streaming and push notifications.

---

# 20. Streaming

With streaming, an agent can send incremental updates while working.

Conceptually:

```text
Agent
 ↓
"Started..."
 ↓
"Researching..."
 ↓
"Found 20 sources..."
 ↓
"Analyzing..."
 ↓
"Completed."
```

This is useful when a task takes time and the user/client needs progress updates.

---

# 21. Push notifications

For long-running or disconnected scenarios, A2A also supports push notifications.

Instead of constantly asking:

```text
"Are you finished?"
"Are you finished?"
"Are you finished?"
```

the agent can send an update when something changes.

Conceptually:

```text
Client
   │
   │ Start task
   ↓
Remote Agent
   │
   │ ...processing...
   │
   └────→ Webhook notification
```

The current specification describes push notifications for asynchronous task updates.

---

# 22. A2A vs API

An API usually exposes a particular service or capability.

For example:

```text
Agent → Weather API → Weather data
```

A2A is intended for communication with another agentic system.

```text
Agent A → A2A → Agent B
```

The second agent may itself:

- reason
- use tools
- perform multiple operations
- maintain task state
- produce artifacts
- communicate further with other agents

So a useful distinction is:

```text
API
→ exposes a service/capability

A2A
→ enables agent-to-agent collaboration
```

---

# 23. A2A vs MCP

This is one of the most important distinctions for AI systems.

## MCP

MCP is primarily about connecting an AI application/agent with external capabilities such as:

```text
Tools
Resources
Data
```

Conceptually:

```text
Agent
  ↓
 MCP
  ↓
Tools / Data / Resources
```

## A2A

A2A is about agent-to-agent communication:

```text
Agent A
  ↓
 A2A
  ↓
Agent B
```

A system can use both.

```text
                  Manager Agent
                  /           \
                 ↓             ↓
          Research Agent    Coding Agent
                 ↓             ↓
                MCP           MCP
                 ↓             ↓
              Web tools     Dev tools
```

A2A and MCP therefore solve different problems and can complement each other.

---

# 24. Multi-agent architectures

Today I learned that there isn't just one way to organize multiple agents.

## Manager → Workers

```text
             Manager
            /   |   \
           ↓    ↓    ↓
       Research Code Writing
```

The manager delegates work.

This is the architecture I focused on today.

---

## Pipeline

```text
Research
   ↓
Analysis
   ↓
Writing
   ↓
Review
   ↓
Final
```

Each agent passes its output to the next agent.

---

## Peer-to-peer

```text
Research Agent
      ↕
Coding Agent
      ↕
Testing Agent
```

Agents can communicate directly.

---

# 25. The experiment I wanted to build

My Day 1 objective was:

> **Connect two simple agents and let one delegate a task to another.**

The basic architecture is:

```text
┌──────────────────┐
│    Agent A       │
│    Manager       │
└────────┬─────────┘
         │
         │ Delegate task
         ↓
┌──────────────────┐
│    Agent B       │
│   Specialist     │
└────────┬─────────┘
         │
         │ Return result
         ↓
┌──────────────────┐
│    Agent A       │
└──────────────────┘
```

---

# 26. Simplest possible implementation

A minimal conceptual implementation looks like:

```python
def specialist_agent(task):
    return f"Result for: {task}"


def manager_agent(user_request):
    print("[MANAGER] Received:", user_request)

    print("[MANAGER] Delegating task...")

    result = specialist_agent(user_request)

    print("[SPECIALIST] Result:", result)

    return result


response = manager_agent(
    "Explain Agent-to-Agent communication"
)

print(response)
```

This isn't a complete A2A protocol implementation.

It is a **conceptual prototype** demonstrating the fundamental pattern:

```text
Manager
   ↓
Delegation
   ↓
Specialist
   ↓
Result
   ↓
Manager
```

---

# 27. Making the experiment more realistic

A more interesting architecture is:

```text
User
 ↓
Manager Agent
 ↓
"Research this topic"
 ↓
Research Agent
 ↓
Research + tools
 ↓
Result
 ↓
Manager Agent
 ↓
Final response
```

Now the specialist isn't merely a function.

It can behave as an agent with its own goal and tools.

---

# 28. What makes delegation intelligent?

The interesting part is when Agent A decides **whether** it needs Agent B.

For example:

```text
User:
"Calculate 5 × 7."

Manager:
"I can solve this myself."
```

But:

```text
User:
"Research the latest developments
in quantum computing."

Manager:
"I need a research specialist."
```

So:

```text
Manager Agent
      ↓
Understand request
      ↓
Decide:
Can I do this myself?
      │
      ├── Yes → Do it
      │
      └── No → Delegate
```

This is much closer to a real agentic architecture.

---

# 29. Why specialization matters

Suppose I create:

```text
Research Agent
```

Its system instructions can be optimized specifically for research.

Then:

```text
Coding Agent
```

can be optimized for programming.

And:

```text
Testing Agent
```

can specialize in finding bugs.

Instead of asking one model to be excellent at everything, the system can divide responsibilities.

---

# 30. Benefits of A2A

### 1. Specialization

Different agents can focus on different jobs.

### 2. Modularity

One agent can be replaced without redesigning the entire system.

### 3. Scalability

More specialized agents can be added.

### 4. Interoperability

Independent agents can potentially communicate even when built using different technologies.

### 5. Collaboration

Complex tasks can be broken into smaller pieces.

### 6. Long-running workflows

Tasks can be tracked while agents work asynchronously.

These capabilities are central to the A2A protocol's design.

---

# 31. Problems with multi-agent systems

Multi-agent systems aren't automatically better.

They also introduce new problems.

## Communication overhead

Instead of:

```text
User → Agent
```

you might get:

```text
User
 ↓
Agent A
 ↓
Agent B
 ↓
Agent C
 ↓
Agent A
 ↓
User
```

More communication means more latency and potentially more cost.

---

## Error propagation

If Agent A gives Agent B a bad instruction:

```text
Agent A
 ↓ wrong task
Agent B
 ↓ wrong result
Agent C
 ↓ uses wrong result
Final answer
```

The error can propagate.

---

## Ambiguous delegation

Bad:

```text
"Research Python."
```

Better:

```text
"Research the differences between
Python 3.12 and Python 3.13,
focusing on performance and new features."
```

Good delegation requires clear task definitions.

---

## Debugging complexity

One agent:

```text
User → Agent
```

is relatively easy to inspect.

Ten agents:

```text
A → B → C
↘ D → E
  ↘ F
```

can become difficult to debug.

Logging and observability therefore become extremely important.

---

# 32. Security

Once agents can communicate with other agents, security becomes important.

An agent should not blindly trust every remote agent.

Important considerations include:

```text
Authentication
Authorization
HTTPS
Input validation
Agent identity
Data protection
Task validation
```

Agent Cards can also contain authentication requirements, and the specification discusses security considerations around discovery and communication.

---

# 33. The deeper idea: agent interoperability

The biggest idea I took away from today is that the future of agentic systems isn't necessarily:

```text
ONE HUGE AI
```

It can instead look like:

```text
             Agent Ecosystem

      ┌───────────────┐
      │ Research Agent│
      └───────┬───────┘
              │
              ↕
      ┌───────────────┐
      │ Manager Agent │
      └───┬───────┬───┘
          │       │
          ↕       ↕
      Coding    Data
      Agent     Agent
```

Each agent can provide specialized capabilities.

A standard communication protocol makes collaboration between independent agents much easier.

---

# 34. General A2A workflow

The complete mental model I learned today is:

```text
                 USER
                   │
                   ↓
            Manager Agent
                   │
                   ↓
           Discover Agent
                   │
                   ↓
             Agent Card
                   │
                   ↓
          Select Specialist
                   │
                   ↓
             Send Message
                   │
                   ↓
             Create Task
                   │
                   ↓
            Agent Processes
                   │
             ┌─────┴─────┐
             ↓           ↓
          Progress     Result
             │           │
             ↓           ↓
         Streaming    Artifact
             │           │
             └─────┬─────┘
                   ↓
            Manager Agent
                   │
                   ↓
              Final Result
```

This is the mental model I want to remember.

---

# 35. Important A2A vocabulary

| Term | Meaning |
|---|---|
| **A2A** | Agent-to-Agent communication/protocol |
| **Agent** | AI system capable of performing tasks |
| **Agent Card** | Metadata describing an agent's identity, skills, capabilities, endpoint, etc. |
| **Message** | A communication turn |
| **Part** | Content unit inside a Message or Artifact |
| **Task** | Stateful unit of work |
| **Task ID** | Unique identifier for a task |
| **Context ID** | Groups related interactions |
| **Artifact** | Output generated by a task |
| **Streaming** | Incremental real-time updates |
| **Push Notification** | Asynchronous notification about task changes |
| **Delegation** | Giving a task to another agent |
| **Interoperability** | Different agents/systems being able to work together |
| **Multi-agent system** | Multiple agents collaborating on a goal |
| **Opaque execution** | Agents collaborate without needing each other's internal implementation |

The current A2A specification defines these concepts as part of its core data model and interaction model.

---

# 36. What I actually learned today

Before today:

```text
A2A = Agents talking to each other
```

After today's exploration:

```text
A2A
│
├── Agent discovery
│     └── Agent Cards
│
├── Communication
│     ├── Messages
│     └── Parts
│
├── Work management
│     └── Tasks
│
├── Task continuity
│     └── Context IDs
│
├── Outputs
│     └── Artifacts
│
├── Long-running work
│     ├── Streaming
│     └── Push notifications
│
├── Architecture
│     ├── Manager/worker
│     ├── Pipeline
│     └── Peer-to-peer
│
└── Goal
      └── Agent interoperability
```

---

# 37. Biggest takeaway

The biggest thing I learned today is:

> **A powerful AI system does not necessarily need to be one giant agent. It can be an ecosystem of specialized agents that communicate and delegate work to each other.**

The basic pattern is:

```text
Understand
   ↓
Decide
   ↓
Delegate
   ↓
Execute
   ↓
Return result
   ↓
Combine
   ↓
Complete goal
```

---

# 38. What I want to explore next

Possible next experiments:

### Experiment 1

Build:

```text
Manager Agent
      ↓
Research Agent
```

### Experiment 2

Add:

```text
Coding Agent
```

```text
Manager
 /    \
Research Coding
```

### Experiment 3

Create a pipeline:

```text
Research
   ↓
Analysis
   ↓
Writer
   ↓
Reviewer
```

### Experiment 4

Make the manager dynamically decide:

```text
Which agent should I use?
```

### Experiment 5

Build an actual A2A-compatible server and Agent Card rather than only simulating agent-to-agent delegation.

---

# 39. Day 1 conclusion

Today I learned that **A2A is not simply "two chatbots talking."**

It is about creating a structured way for independent agentic systems to:

```text
discover capabilities
        ↓
communicate
        ↓
delegate work
        ↓
track tasks
        ↓
exchange results
        ↓
collaborate
```

The larger goal is **interoperability between agents**.

That makes A2A an important concept for building scalable multi-agent AI systems.

---

# 40. One-line memory trick

> **MCP connects agents to capabilities; A2A connects agents to agents.**

---

## Official references

- A2A Protocol Specification — current specification and core protocol concepts.
- A2A Core Concepts — Agent Cards, Messages, Parts, Tasks, and Artifacts.
- Life of a Task — task lifecycle and context.

---

## Day 1 Status

```text
Topic:        A2A
Focus:        Agent-to-Agent Communication
Time:         ~30 minutes
Main concept: Delegation between agents
Architecture: Manager → Specialist → Result

Status: 🟢 Learned
Next: Build a working two-agent prototype
```