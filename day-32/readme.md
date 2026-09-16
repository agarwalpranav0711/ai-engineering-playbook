# 🚀 Day 3 — AG-UI: Agent ↔ Frontend Interaction

> **Daily AI Working — Day 3**

Today I explored **AG-UI (Agent–User Interaction Protocol)** and learned how an AI agent can communicate with a frontend application through a stream of structured events instead of simply returning one final response.

The main goal was to understand how modern agentic applications create a **live, interactive frontend experience** where the UI can react to what an agent is doing in real time.

---

## 📌 Today's Task

### Learn

**AG-UI — Agent ↔ Frontend Interaction**

### Try

> Stream agent events/actions into a small frontend.

---

# 🧠 1. What is AG-UI?

**AG-UI** stands for **Agent–User Interaction**.

It is an open, lightweight, event-based protocol designed to standardize communication between **AI agents** and **user-facing applications**.

Instead of an application waiting for an agent to finish and return one large response, AG-UI allows the agent to continuously emit structured events while it is working.

```text
┌──────────────┐
│    USER      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   FRONTEND   │
└──────┬───────┘
       │
       │ AG-UI
       ▼
┌──────────────┐
│    AGENT     │
└──────┬───────┘
       │
       ├── Text Events
       ├── Tool Events
       ├── State Events
       ├── Activity Events
       ├── Lifecycle Events
       └── Custom Events
       │
       ▼
┌──────────────┐
│   FRONTEND   │
│  UI Updates  │
└──────────────┘
```

AG-UI is essentially the **interaction/event layer between an agent backend and a frontend application**.

The official project describes it as an event-based protocol where agent backends emit standardized events during execution.

---

# 🎯 2. What Problem Does AG-UI Solve?

Traditional applications often follow a simple request/response model:

```text
User
 │
 ▼
Frontend
 │
 │ HTTP Request
 ▼
Backend
 │
 │ Processing
 ▼
Final Response
 │
 ▼
Frontend
```

The frontend may see nothing while the backend is processing.

For an agent this can be a problem because an agent might perform many actions:

```text
1. Understand request
2. Search for information
3. Call a tool
4. Receive tool result
5. Analyze result
6. Call another tool
7. Update state
8. Generate answer
```

Waiting until everything finishes hides the agent's work.

AG-UI changes the interaction into an event stream:

```text
User
 │
 ▼
Agent
 │
 ├── RUN_STARTED
 │
 ├── TEXT_MESSAGE_CONTENT
 │
 ├── TOOL_CALL_START
 │
 ├── TOOL_CALL_ARGS
 │
 ├── TOOL_CALL_END
 │
 ├── STATE_DELTA
 │
 ├── TEXT_MESSAGE_CONTENT
 │
 └── RUN_FINISHED
 │
 ▼
Frontend
```

This allows the frontend to update while the agent is still running.

---

# ⚡ 3. The Core Idea: Events

The most important concept I learned today is:

> **AG-UI is event-based.**

An event represents something happening during an agent interaction.

Instead of:

```text
Request → Final Response
```

we can have:

```text
Request
   ↓
Event
   ↓
Event
   ↓
Event
   ↓
Event
   ↓
Event
   ↓
Finished
```

The frontend receives these events and decides how the UI should react.

The AG-UI SDK describes events as the fundamental communication units between agents and frontends.

---

# 🔄 4. The Agent Run Lifecycle

A basic AG-UI run can be thought of as:

```text
RUN_STARTED
      │
      ▼
Agent starts working
      │
      ├── STEP_STARTED
      ├── ...
      ├── STEP_FINISHED
      │
      ▼
RUN_FINISHED
```

If something fails:

```text
RUN_STARTED
      │
      ▼
Agent works
      │
      ▼
RUN_ERROR
```

The current specification makes `RUN_STARTED` and either `RUN_FINISHED` or `RUN_ERROR` the boundaries of an agent run. Step events are optional.

---

# 🟢 5. RUN_STARTED

`RUN_STARTED` means:

> The agent has started processing the user's request.

Conceptually:

```json
{
  "type": "RUN_STARTED",
  "threadId": "thread-123",
  "runId": "run-456"
}
```

The frontend can use this to:

```text
Show loading state
Start progress indicator
Disable/modify controls
Create a new agent activity
```

---

# 🏁 6. RUN_FINISHED

`RUN_FINISHED` indicates that the agent run completed successfully.

The frontend can then:

```text
Stop loading
Enable controls
Finalize UI
Allow another request
```

Example:

```text
Agent Status:

🟢 Working...

...

✅ Finished
```

---

# ❌ 7. RUN_ERROR

If the agent encounters an error:

```text
RUN_ERROR
```

can communicate that the run failed.

The frontend could show:

```text
❌ Agent failed

Please try again.
```

This is much better than leaving the user staring at a loading indicator forever.

---

# 🔢 8. Step Events

An agent can internally perform multiple steps.

For example:

```text
Agent Run
   │
   ├── Step 1: Understand request
   │
   ├── Step 2: Search information
   │
   ├── Step 3: Analyze results
   │
   └── Step 4: Generate answer
```

AG-UI can represent progress using:

```text
STEP_STARTED
STEP_FINISHED
```

Step events are optional and can occur multiple times within one run.

---

# 💬 9. Text Message Events

One of the most important parts of AG-UI is **streaming text**.

Instead of waiting for the complete answer:

```text
"Artificial intelligence is a field of computer science..."
```

the frontend can receive pieces of the answer.

The basic lifecycle is:

```text
TEXT_MESSAGE_START
        ↓
TEXT_MESSAGE_CONTENT
        ↓
TEXT_MESSAGE_CONTENT
        ↓
TEXT_MESSAGE_CONTENT
        ↓
TEXT_MESSAGE_END
```

The official event specification defines this streaming pattern.

---

# 🧩 10. TEXT_MESSAGE_START

This indicates that a new text message is beginning.

It establishes a `messageId`.

Example:

```json
{
  "type": "TEXT_MESSAGE_START",
  "messageId": "msg-123",
  "role": "assistant"
}
```

The frontend can now create a new message bubble.

---

# ✍️ 11. TEXT_MESSAGE_CONTENT

This contains a chunk of the actual text.

Example:

```json
{
  "type": "TEXT_MESSAGE_CONTENT",
  "messageId": "msg-123",
  "delta": "Hello"
}
```

Then another event:

```json
{
  "type": "TEXT_MESSAGE_CONTENT",
  "messageId": "msg-123",
  "delta": " Pranav"
}
```

Then:

```json
{
  "type": "TEXT_MESSAGE_CONTENT",
  "messageId": "msg-123",
  "delta": "!"
}
```

The frontend combines the deltas:

```text
"Hello"
+
" Pranav"
+
"!"
```

Result:

```text
Hello Pranav!
```

The official specification says frontends should concatenate the `delta` chunks in order and use `messageId` to associate them with the correct message.

---

# 🏁 12. TEXT_MESSAGE_END

This tells the frontend:

> The streamed message is complete.

The UI can now:

```text
Remove typing indicator
Finalize message
Enable controls
Allow interaction
```

---

# 🔧 13. Tool Call Events

Agents frequently need tools.

For example:

```text
Web Search
Database
Calculator
File System
API
Code Execution
```

AG-UI can stream tool-call information to the frontend.

The lifecycle is:

```text
TOOL_CALL_START
       ↓
TOOL_CALL_ARGS
       ↓
TOOL_CALL_END
       ↓
TOOL_CALL_RESULT
```

The official event documentation defines these as the tool-call lifecycle.

---

# 🚀 14. TOOL_CALL_START

This means:

> The agent is starting a tool call.

Example:

```json
{
  "type": "TOOL_CALL_START",
  "toolCallId": "tool-123",
  "toolCallName": "web_search"
}
```

The frontend can display:

```text
🔎 Searching the web...
```

---

# 📦 15. TOOL_CALL_ARGS

The agent can stream the arguments being passed to the tool.

Example:

```json
{
  "type": "TOOL_CALL_ARGS",
  "toolCallId": "tool-123",
  "delta": "{\"query\":\""
}
```

followed by:

```json
{
  "type": "TOOL_CALL_ARGS",
  "toolCallId": "tool-123",
  "delta": "quantum computing\"}"
}
```

The frontend/client can reconstruct the complete arguments.

The protocol uses the `toolCallId` to associate the argument chunks with the correct tool call.

---

# 🛑 16. TOOL_CALL_END

This indicates that the tool-call request itself has finished being constructed/emitted.

The frontend can update:

```text
🔎 Searching...
```

to:

```text
🔎 Search request sent
```

---

# 📤 17. TOOL_CALL_RESULT

This contains the result/output associated with a tool call.

Conceptually:

```text
Agent
  │
  ▼
Tool Call
  │
  ▼
Tool executes
  │
  ▼
Tool Result
  │
  ▼
Agent continues
```

The result event contains the associated `toolCallId` and the tool output content.

---

# 🧠 18. State Events

Agents and applications have state.

Example:

```json
{
  "searchQuery": "quantum computing",
  "sourcesFound": 5,
  "isSearching": true
}
```

AG-UI provides events for synchronizing this state.

Important events:

```text
STATE_SNAPSHOT
STATE_DELTA
```

---

# 📸 19. STATE_SNAPSHOT

A snapshot represents a complete state.

Example:

```json
{
  "searchQuery": "quantum computing",
  "sourcesFound": 5,
  "isSearching": true
}
```

The frontend can use the snapshot as its current state.

---

# 🔄 20. STATE_DELTA

A delta represents an incremental change.

Instead of sending the complete state again:

```text
searchQuery
sourcesFound
isSearching
user
...
```

the system can communicate only what changed.

Example:

```text
sourcesFound:
5 → 6
```

Conceptually:

```json
{
  "type": "STATE_DELTA",
  "delta": [
    {
      "op": "replace",
      "path": "/sourcesFound",
      "value": 6
    }
  ]
}
```

This is useful for keeping frontend and agent state synchronized efficiently.

---

# 📊 21. Activity Events

An agent can also expose structured activity/progress information.

Examples:

```text
Searching...
Analyzing...
Running tests...
Waiting for approval...
```

AG-UI supports:

```text
ACTIVITY_SNAPSHOT
ACTIVITY_DELTA
```

These allow a frontend to represent structured activity updates.

---

# 🤖 22. Sub-Agent Interaction

Agentic systems can contain multiple agents.

For example:

```text
                 Manager Agent
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
      Research      Coding      Review
       Agent        Agent        Agent
```

This connects directly with what I learned on **Day 1 — A2A**.

A2A handles communication between agents, while AG-UI can expose the resulting agent activity to the frontend.

So the user could see:

```text
Manager Agent       🟢 Working

Research Agent      ✅ Finished

Coding Agent        🟢 Working

Review Agent        ⏳ Waiting
```

---

# 🧩 23. Custom Events

Not every application needs the same events.

A custom event can represent application-specific behavior.

Examples:

```text
PAYMENT_REQUIRED
APPROVAL_REQUIRED
DOCUMENT_SELECTED
WORKFLOW_PAUSED
```

AG-UI includes a `CUSTOM` event type for application-specific semantics.

---

# 🖥️ 24. What Does the Frontend Actually Do?

The frontend becomes an **event processor**.

Conceptually:

```javascript
switch (event.type) {

  case "RUN_STARTED":
    setLoading(true);
    break;

  case "TEXT_MESSAGE_CONTENT":
    appendText(event.delta);
    break;

  case "TOOL_CALL_START":
    showTool(event.toolCallName);
    break;

  case "TOOL_CALL_END":
    markToolComplete();
    break;

  case "STATE_DELTA":
    updateState(event);
    break;

  case "RUN_FINISHED":
    setLoading(false);
    break;
}
```

The key idea:

```text
AG-UI Event
      ↓
Frontend Event Handler
      ↓
React State
      ↓
UI Update
```

---

# 🌐 25. Streaming

Streaming is what makes an agentic interface feel alive.

Without streaming:

```text
User
 ↓
Wait...
 ↓
Wait...
 ↓
Wait...
 ↓
Complete response
```

With streaming:

```text
User
 ↓
Agent started
 ↓
"Let me search..."
 ↓
🔎 Searching
 ↓
✓ Search complete
 ↓
"I found..."
 ↓
Answer
 ↓
Finished
```

The current AG-UI project specifically highlights real-time agentic chat with streaming as one of its core features.

---

# 🔌 26. Transport

AG-UI is an application-level protocol and can work over different transports.

Examples include:

```text
SSE
WebSockets
Webhooks
HTTP-based implementations
```

The official project states that AG-UI can work with different event transports rather than forcing one specific transport.

For my learning experiment, the important concept is not mastering every transport.

The important concept is:

```text
Agent
  ↓
Stream Events
  ↓
Frontend
```

---

# 📡 27. SSE

**SSE = Server-Sent Events**

It allows a server to continuously send events to a client over an HTTP connection.

Conceptually:

```text
Frontend
    │
    │ Request
    ▼
Backend
    │
    ├── Event 1 ───────► Frontend
    ├── Event 2 ───────► Frontend
    ├── Event 3 ───────► Frontend
    └── Event 4 ───────► Frontend
```

This makes SSE a useful way to understand one-way event streaming from an agent backend to a frontend.

---

# 🔄 28. WebSockets

WebSockets provide persistent, bidirectional communication:

```text
Frontend ↔ Backend
```

Compared with simple one-way streaming:

```text
Backend → Frontend
```

WebSockets allow both sides to continuously communicate.

However, for today's experiment, understanding the **event model** is more important than becoming an expert in WebSockets.

---

# 🧑‍💻 29. Frontend Tools

Another important idea is that an agent can interact with application-level functionality.

For example:

```text
navigateTo()
openModal()
selectUser()
refreshDashboard()
```

Instead of allowing the LLM to directly execute arbitrary browser code, the application can expose controlled tools/actions.

Conceptually:

```text
Agent
  │
  │ Tool Call
  ▼
Frontend Tool
  │
  ▼
Application Action
```

This creates a controlled bridge between agent reasoning and frontend behavior.

AG-UI lists frontend tool integration as one of its core capabilities.

---

# 🧑‍⚖️ 30. Human-in-the-Loop

AG-UI can also support interactions where the user needs to approve or modify an agent action.

Example:

```text
Agent wants to delete a file.

┌─────────────────────────────┐
│ ⚠️ Confirmation Required    │
│                             │
│ Delete main.py?             │
│                             │
│ [Cancel]       [Approve]    │
└─────────────────────────────┘
```

The user controls the decision.

This is useful for sensitive or important actions.

Human-in-the-loop collaboration is listed as a core AG-UI feature.

---

# 🔥 31. AG-UI vs Traditional API

## Traditional API

```text
Frontend
   │
   │ Request
   ▼
Backend
   │
   │ Process
   ▼
Response
   │
   ▼
Frontend
```

## AG-UI

```text
Frontend
   │
   ▼
Agent
   │
   ├── RUN_STARTED
   ├── TEXT_MESSAGE_CONTENT
   ├── TOOL_CALL_START
   ├── TOOL_CALL_ARGS
   ├── TOOL_CALL_RESULT
   ├── STATE_DELTA
   ├── TEXT_MESSAGE_CONTENT
   └── RUN_FINISHED
   │
   ▼
Frontend
```

The second model gives the frontend much more visibility into an ongoing agent run.

---

# 🆚 32. AG-UI vs A2A vs A2UI

This is one of the most important things I learned.

## A2A

**Agent ↔ Agent**

Purpose:

> Communication between AI agents.

```text
Agent A
   ↕
Agent B
```

---

## A2UI

**Agent → UI**

Purpose:

> Representing/generating UI from agent output.

```text
Agent
  │
  ▼
UI Description
  │
  ▼
Renderer
  │
  ▼
Interface
```

A2UI itself is a JSON-based streaming UI protocol focused on progressively constructing/updating UI surfaces and data models.

---

## AG-UI

**Agent ↔ Frontend**

Purpose:

> Real-time interaction between an agent and a user-facing application.

```text
Agent
  ↕
AG-UI
  ↕
Frontend
```

The AG-UI project describes the three protocols as complementary:

```text
MCP → Agents ↔ Tools/Data

A2A → Agents ↔ Agents

AG-UI → Agents ↔ User-facing Applications
```



---

# 🔥 33. A2UI and AG-UI Can Work Together

They are not necessarily alternatives.

They can work together:

```text
                 Agent
                   │
                   │ AG-UI
                   ▼
                Frontend
                   │
             A2UI messages
                   │
                   ▼
              UI Renderer
                   │
                   ▼
                User
```

The A2UI documentation also describes receiving A2UI messages through an AG-UI runtime connection and routing those messages to an A2UI renderer.

---

# 🧠 34. My Mental Model

The easiest way I understand the difference now is:

```text
A2A
"Agent, talk to another agent."

A2UI
"Agent, describe what UI should exist."

AG-UI
"Agent, tell my frontend what you're doing
and let the application participate."
```

---

# 🏗️ 35. Architecture I Learned

```text
                         USER
                           │
                           ▼
                    ┌────────────┐
                    │  FRONTEND  │
                    │   React    │
                    └─────┬──────┘
                          │
                          │ AG-UI
                          ▼
                   ┌─────────────┐
                   │    AGENT    │
                   └──────┬──────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
             LLM         TOOLS       STATE
              │           │           │
              └───────────┼───────────┘
                          │
                          ▼
                    EVENT STREAM
                          │
       ┌──────────────────┼─────────────────┐
       ▼                  ▼                 ▼
     TEXT               TOOLS             STATE
       │                  │                 │
       └──────────────────┼─────────────────┘
                          ▼
                       FRONTEND
                          │
                          ▼
                      UPDATED UI
```

---

# 🧪 36. My Practical Experiment

For the practical part of today's task, the goal was to create a small frontend that can receive and react to streamed agent events.

The experiment can be simplified into:

```text
React Frontend
      │
      ▼
Backend / Agent
      │
      ▼
Event Stream
      │
      ├── RUN_STARTED
      ├── TEXT_MESSAGE_CONTENT
      ├── TOOL_CALL_START
      ├── TOOL_CALL_END
      ├── TEXT_MESSAGE_CONTENT
      └── RUN_FINISHED
      │
      ▼
React Event Handler
      │
      ▼
Live UI
```

---

# 🎨 37. Example UI

The small frontend can display:

```text
┌────────────────────────────────────┐
│          AG-UI DEMO                │
├────────────────────────────────────┤
│                                    │
│ User:                              │
│ [ Explain quantum computing ]      │
│                          [Send]    │
│                                    │
│ Agent Status: 🟢 Working           │
│                                    │
│ 🔎 Tool: web_search                │
│    ✓ Completed                     │
│                                    │
│ 🤖 Agent:                          │
│ Quantum computing uses...          │
│                                    │
│ Run: ✅ Finished                   │
└────────────────────────────────────┘
```

---

# 🧪 38. Why Start With Fake Events?

For a first experiment, it is better to understand the event system before adding a real LLM.

For example:

```javascript
const events = [
  {
    type: "RUN_STARTED"
  },

  {
    type: "TEXT_MESSAGE_CONTENT",
    delta: "I'll search for information..."
  },

  {
    type: "TOOL_CALL_START",
    toolCallName: "web_search"
  },

  {
    type: "TOOL_CALL_END",
    toolCallName: "web_search"
  },

  {
    type: "TEXT_MESSAGE_CONTENT",
    delta: "I found some information."
  },

  {
    type: "RUN_FINISHED"
  }
];
```

Then stream them one by one.

This separates:

```text
AG-UI learning
```

from:

```text
LLM debugging
```

---

# 💡 39. What the Frontend Does With These Events

Conceptually:

```javascript
switch (event.type) {

  case "RUN_STARTED":
    setLoading(true);
    break;

  case "TEXT_MESSAGE_CONTENT":
    appendText(event.delta);
    break;

  case "TOOL_CALL_START":
    showTool(event.toolCallName);
    break;

  case "TOOL_CALL_END":
    markToolComplete();
    break;

  case "RUN_FINISHED":
    setLoading(false);
    break;
}
```

The important pattern is:

```text
Event
 ↓
Event Handler
 ↓
Application State
 ↓
UI
```

---

# 🧩 40. Example Agent Interaction

Imagine the user asks:

```text
"Find information about quantum computing."
```

The agent could produce:

```text
RUN_STARTED
```

Frontend:

```text
🟢 Agent started
```

Then:

```text
TEXT_MESSAGE_CONTENT
"I'll search for information."
```

Frontend:

```text
🤖 I'll search for information.
```

Then:

```text
TOOL_CALL_START
web_search
```

Frontend:

```text
🔎 Searching...
```

Then:

```text
TOOL_CALL_END
```

Frontend:

```text
✓ Search completed
```

Then:

```text
TEXT_MESSAGE_CONTENT
"Quantum computing is..."
```

Frontend:

```text
🤖 Quantum computing is...
```

Finally:

```text
RUN_FINISHED
```

Frontend:

```text
✅ Finished
```

---

# 📚 41. Important Event Categories

| Category | Examples | Purpose |
|---|---|---|
| Lifecycle | `RUN_STARTED`, `RUN_FINISHED`, `RUN_ERROR` | Track agent execution |
| Steps | `STEP_STARTED`, `STEP_FINISHED` | Track structured progress |
| Text | `TEXT_MESSAGE_START`, `CONTENT`, `END` | Stream messages |
| Tools | `TOOL_CALL_START`, `ARGS`, `END`, `RESULT` | Show tool usage |
| State | `STATE_SNAPSHOT`, `STATE_DELTA` | Synchronize state |
| Activity | `ACTIVITY_SNAPSHOT`, `ACTIVITY_DELTA` | Show structured activity |
| Custom | `CUSTOM` | Application-specific events |

The current TypeScript SDK exposes these event families, along with additional event types such as reasoning-related events.

---

# 🧠 42. Most Important Concepts Learned

### 1. Event-based communication

AG-UI communicates using structured events.

### 2. Streaming

Events can arrive while the agent is still working.

### 3. Lifecycle

A run has a clear beginning and completion/error boundary.

### 4. Streaming messages

Text can arrive in multiple chunks.

### 5. Tool visibility

The frontend can observe tool-call activity.

### 6. State synchronization

Agent/application state can be synchronized using snapshots and deltas.

### 7. Frontend interaction

The frontend is not just a passive display.

### 8. Human-in-the-loop

Users can participate in agent workflows.

### 9. Agentic UX

The UI can represent what an agent is doing instead of only displaying the final answer.

---

# 🔥 43. What I Actually Learned Today

Before today, I mostly thought about an AI application like:

```text
User
 ↓
Prompt
 ↓
LLM
 ↓
Answer
```

After learning AG-UI, I understand that an agentic application can be:

```text
User
 ↓
Frontend
 ↓
Agent
 ↓
Event Stream
 ├── Agent started
 ├── Agent message
 ├── Tool started
 ├── Tool arguments
 ├── Tool result
 ├── State update
 ├── More text
 └── Agent finished
 ↓
Frontend continuously updates
```

This changes the way I think about AI applications.

The frontend isn't just showing the final answer.

It can become a **live view of an agent's execution and interaction with the application**.

---

# 🧠 44. Connection With My Previous Learning

My first three daily topics now connect together:

```text
DAY 1
A2A
Agent ↔ Agent


DAY 2
A2UI
Agent → UI


DAY 3
AG-UI
Agent ↔ Frontend
```

Together:

```text
                       USER
                         │
                         ▼
                    FRONTEND
                         ▲
                         │
                       AG-UI
                         │
                         ▼
                      AGENT
                    /        \
                  A2A         Tools
                  │
                  ▼
             Other Agents
```

And A2UI can be used when agents need to describe or generate UI.

---

# 🏆 45. Final Takeaway

The biggest thing I learned today:

> **AG-UI provides a standardized event-based way for AI agents and user-facing applications to communicate during an ongoing agent interaction.**

Instead of:

```text
Request → Wait → Response
```

I can think in terms of:

```text
Request
   ↓
RUN_STARTED
   ↓
Agent activity
   ↓
Tool events
   ↓
State updates
   ↓
Streaming messages
   ↓
RUN_FINISHED
```

And the frontend can react to every meaningful event.

That is what makes an agentic UI feel **live, observable, and interactive**.

---

# 🔗 46. Official Resources

### AG-UI GitHub

https://github.com/ag-ui-protocol/ag-ui

### AG-UI Event Documentation

https://github.com/ag-ui-protocol/ag-ui/blob/main/docs/concepts/events.mdx

### AG-UI SDK Events

https://github.com/ag-ui-protocol/ag-ui/blob/main/docs/sdk/js/core/events.mdx

### AG-UI Documentation

https://docs.ag-ui.com/

### A2UI Documentation

https://github.com/a2ui-project/a2ui

---

# 📝 47. Day 3 Summary

```text
Topic:
AG-UI — Agent ↔ Frontend Interaction

Core idea:
Event-based communication between an agent
and a user-facing application.

Main concepts learned:
✓ AG-UI
✓ Event-driven architecture
✓ Streaming
✓ Agent lifecycle
✓ Run events
✓ Step events
✓ Text message streaming
✓ Tool call streaming
✓ State synchronization
✓ Activity events
✓ Custom events
✓ Frontend tools
✓ Human-in-the-loop
✓ SSE
✓ WebSockets
✓ Agent ↔ frontend architecture
✓ AG-UI vs A2A
✓ AG-UI vs A2UI
✓ AG-UI + A2UI
✓ Building an event-driven frontend

Practical experiment:
Built/explored a small frontend that reacts
to streamed agent events.

Key realization:
An agentic frontend doesn't have to wait
for the final answer.

It can react to the agent while the agent works.
```

---

## 🚀 Day 3 Complete

**Day 1:** A2A → Agents communicate with agents.

**Day 2:** A2UI → Agents can describe/generate interfaces.

**Day 3:** AG-UI → Agents and frontends can continuously communicate through structured events.

**Next:** Keep building on this mental model rather than treating these protocols as isolated technologies.