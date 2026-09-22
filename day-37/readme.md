# 🧑‍💻 Day 9 — Frontman

> **Exploring Browser-Aware AI Coding**

Today I explored **Frontman**, a browser-based, source-available AI coding agent designed to connect a running web application's UI with the source code behind it.

The main goal was to understand a different approach to AI browser interaction.

On Day 8, I explored **Browser Use**, where an AI agent controls a browser to accomplish tasks on websites.

Today, I explored a different idea:

> **What if the AI doesn't just control the browser, but also understands the application running inside the browser and the source code responsible for what I see?**

That is the core idea behind Frontman.

---

# 🎯 Today's Task

### Day 9 — Frontman

> Explore another approach to AI browser interaction.

### Try

> Give it a simple website task and compare the interaction style with Browser Use.

### Main objectives

- Understand what Frontman is
- Understand why Frontman is different from Browser Use
- Understand browser-aware AI coding
- Understand the browser → component → source connection
- Understand Frontman's architecture
- Understand its browser tools
- Understand its framework tools
- Understand MCP's role
- Understand DOM inspection
- Understand computed CSS
- Understand component context
- Understand source maps
- Understand source editing
- Understand hot reload
- Run a real frontend experiment
- Compare Frontman with Browser Use
- Compare Frontman with Goose
- Compare Frontman with OpenAI Agents SDK
- Understand the security/data-flow implications

---

# 🧑‍💻 What is Frontman?

Frontman is a **browser-based/source-available AI coding agent** designed to work with a running web application.

Its core idea is:

```text
User
 ↓
Running Web App
 ↓
Browser
 ↓
Frontman
 ↓
DOM + CSS + Component Context + Source
 ↓
AI Agent
 ↓
Edit Source
 ↓
Hot Reload
 ↓
Verify Result
```

Instead of interacting with only a file tree or terminal, Frontman starts from the **rendered application**.

The current Frontman documentation describes the system as an AI agent that can inspect the running application, read relevant source files, edit them, and verify the result against the live preview.

---

# 🧠 The Main Idea

The most important concept from today is:

> **Frontman connects what I see in the browser to the source code that produced it.**

Normally, the development flow is:

```text
SOURCE CODE
     ↓
BUILD
     ↓
RUNNING APPLICATION
     ↓
BROWSER
     ↓
UI
```

The developer usually works in the opposite direction:

```text
UI problem
 ↓
Figure out which component
 ↓
Find source file
 ↓
Find CSS
 ↓
Edit
 ↓
Refresh
 ↓
Check result
```

Frontman tries to make this connection explicit:

```text
BROWSER
   ↓
Rendered Element
   ↓
DOM
   ↓
Component Context
   ↓
Source
   ↓
EDIT
   ↓
HOT RELOAD
   ↓
BROWSER
```

This browser-to-source connection is the central idea of Frontman.

---

# 🌐 Why is this different from Browser Use?

This was the most important comparison of Day 9.

## Day 8 — Browser Use

The browser is primarily the **environment the agent operates in**.

```text
USER
 ↓
BROWSER AGENT
 ↓
BROWSER
 ↓
WEBSITE
 ↓
CLICK / TYPE / SCROLL
 ↓
RESULT
```

Example:

```text
"Search Google for Python."
```

The agent figures out how to:

```text
Open Google
 ↓
Find search box
 ↓
Type Python
 ↓
Submit
 ↓
Read results
```

---

# 🧑‍💻 Day 9 — Frontman

The browser is primarily a **window into the running application**.

```text
USER
 ↓
FRONTMAN
 ↓
RUNNING WEB APP
 ↓
DOM / CSS / COMPONENT / SOURCE
 ↓
EDIT SOURCE
 ↓
HOT RELOAD
 ↓
VERIFY
```

Example:

```text
"Make this button blue."
```

The agent can work through:

```text
Selected Button
 ↓
DOM
 ↓
Component Context
 ↓
CSS
 ↓
Source File
 ↓
Edit
 ↓
Hot Reload
 ↓
Verify
```

---

# ⭐ The Main Distinction

The simplest way to remember today's lesson:

```text
Browser Use
────────────────────────────
"Do something on the web."


Frontman
────────────────────────────
"Change something in my web app
based on what I can see in the browser."
```

So:

```text
Browser Use
→ Browser-task oriented


Frontman
→ Browser-aware frontend-development oriented
```

This is a difference in **purpose and interaction model**, not a ranking of the two tools.

---

# 🏗️ Frontman Architecture

The current Frontman architecture is a distributed system involving four environments:

```text
1. Browser Client
2. Frontman Server
3. LLM Provider
4. Local Dev Server / Framework Integration
```



A simplified architecture:

```text
                         USER
                           │
                           ▼
                    ┌───────────────┐
                    │    BROWSER    │
                    │               │
                    │  Chat UI      │
                    │  Live Preview │
                    │  Browser Tools│
                    └───────┬───────┘
                            │
                            │
                            ▼
                    ┌───────────────┐
                    │   FRONTMAN    │
                    │    SERVER     │
                    │               │
                    │ Agent Runtime │
                    │ Tool Routing  │
                    │ Sessions      │
                    └───────┬───────┘
                            │
                    ┌───────┴────────┐
                    ▼                ▼
             ┌─────────────┐  ┌─────────────┐
             │ LLM Provider│  │ Dev Server  │
             │             │  │             │
             │ GPT/Claude/ │  │ Source Code │
             │ Gemini/etc. │  │ Files/Logs  │
             └─────────────┘  └─────────────┘
```

The official architecture documentation describes the browser client as the UI/tool host, the Frontman server as the agent orchestrator, the LLM provider as the decision-maker, and the local dev-server integration as the bridge to project files and framework context.

---

# 🧩 The Three Main Components

## 1. Browser Client

The browser client provides:

```text
Chat
Live Preview
Screenshots
DOM inspection
Element interaction
Browser tools
```

It is also involved in relaying local development operations.

---

## 2. Frontman Server

The server handles:

```text
Agent loop
LLM calls
Tool orchestration
Sessions
Task state
Persistence
Tool routing
```

The current architecture describes the server as the central coordinator of the agent loop.

---

## 3. Framework Integration

The framework integration connects Frontman to the actual project.

It can provide access to:

```text
Source files
Components
Routes
Logs
Build information
Framework-specific context
```

Current official integrations include:

```text
Next.js
Astro
Vite
```

with Vite covering React, Vue and Svelte-based projects.

---

# 🔄 The Frontman Agent Loop

The most important process to understand:

```text
                   USER
                    │
                    ▼
             Natural Language
                    │
                    ▼
                  FRONTMAN
                    │
                    ▼
                   LLM
                    │
                    ▼
              Inspect App
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
         DOM       CSS      SOURCE
          │         │         │
          └─────────┼─────────┘
                    ▼
               Decide Action
                    │
                    ▼
                Edit Code
                    │
                    ▼
               Dev Server
                    │
                    ▼
                Hot Reload
                    │
                    ▼
              Updated Browser
                    │
                    ▼
                 VERIFY
                    │
                    ▼
                  DONE
```

The current documentation describes a typical loop as:

```text
Screenshot
 ↓
DOM inspection
 ↓
Read source
 ↓
Edit source
 ↓
Screenshot again
 ↓
Verify
```

The exact number of iterations varies with the task.

---

# 🔍 What Can Frontman See?

One of the most important differences from a normal coding agent is the amount of **runtime context** available.

Frontman can expose information such as:

```text
Screenshots
DOM tree
Interactive elements
Text
Computed CSS
Component context
Source files
Routes
Server logs
Runtime/build information
```



This allows the model to reason about both:

```text
WHAT THE APPLICATION LOOKS LIKE
```

and:

```text
HOW THE APPLICATION IS BUILT
```

---

# 🌳 DOM — Document Object Model

The DOM represents the structure of the rendered page.

For example:

```html
<div>
    <h1>Dashboard</h1>
    <button>View Projects</button>
</div>
```

Conceptually:

```text
DIV
│
├── H1
│    └── Dashboard
│
└── BUTTON
     └── View Projects
```

Frontman can inspect the DOM of the live preview.

---

# 🎨 Computed CSS

Source CSS is not always the same as what the browser actually renders.

For example:

```css
.card {
    padding: 1rem;
}
```

The browser calculates the actual styles after considering:

```text
CSS
+
Inheritance
+
Media Queries
+
Browser Rules
+
Viewport
```

Frontman can inspect computed CSS/runtime values.

This means the agent can reason about what is **actually rendered**, rather than only what the source appears to say.

---

# 🌳 Component Context

For a React application, the visible UI might come from:

```text
App
│
├── Navbar
│
├── Dashboard
│   │
│   ├── RevenueCard
│   ├── AnalyticsCard
│   └── Chart
│
└── Footer
```

Frontman can use framework-specific context to connect the rendered UI to its component/source context.

That is especially valuable for frontend development.

---

# 🗺️ Source Maps

Source maps help connect runtime/generated code back to original source.

Conceptually:

```text
Rendered Element
       ↓
Runtime Code
       ↓
Source Map
       ↓
Original Source
       ↓
Component/File
```

This helps Frontman resolve the relationship between what is rendered and where the relevant source lives.

---

# 🖼️ Screenshots

The browser-side tools can capture screenshots of the running application.

This gives the model visual information:

```text
Browser
 ↓
Screenshot
 ↓
LLM
```

The current documentation describes screenshots as a primary visual input to the agent.

---

# 🖱️ Element Interaction

Frontman can interact with elements in the live preview.

Examples include:

```text
Click
Hover
Focus
Select
Inspect
```

The current browser-tool documentation includes element interaction and discovery capabilities.

---

# 📱 Device / Responsive Mode

Frontman can also change viewport/device modes.

Conceptually:

```text
Desktop
   ↓
Tablet
   ↓
Mobile
```

This is useful for tasks such as:

```text
"Make this page responsive."
```

because the agent can inspect the application under different viewport conditions.

---

# 🧰 Frontman Tools

The current architecture divides tools into three major categories.

```text
Browser Tools
Framework Tools
Server Tools
```



---

## 🌐 Browser Tools

These run in the browser against the live preview.

Examples include:

```text
take_screenshot
get_dom
get_interactive_elements
search_text
interact_with_element
execute_js
set_device_mode
```

These tools answer:

> **What is happening in the running application?**



---

# 💻 Framework Tools

These run through the local framework/dev-server integration.

Examples:

```text
read_file
write_file
edit_file
list_files
grep
search_files
get_logs
get_routes
```

These answer:

> **How is this application implemented?**



---

# ☁️ Server Tools

These run on the Frontman server.

Examples include:

```text
Todo management
Planning
Web fetching
Task/session operations
```

These support the agent runtime rather than directly controlling the browser or filesystem.

---

# 🔌 MCP

MCP is an important part of Frontman's architecture.

The browser-side integration can expose browser capabilities through an MCP server.

Conceptually:

```text
                  FRONTMAN AGENT
                        │
                        ▼
                       MCP
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
      Browser Runtime        Dev Integration
             │                     │
             ▼                     ▼
        DOM / CSS / UI        Source / Files
```

The current architecture describes MCP as the tool-discovery/execution layer, while ACP handles task/session semantics and JSON-RPC provides the message envelope.

---

# 🧠 Protocol Stack

Frontman's current protocol architecture can be simplified as:

```text
JSON-RPC
    ↓
ACP
    ↓
MCP
```

Where:

### JSON-RPC

Provides the message envelope.

### ACP

Handles task/session interaction semantics.

### MCP

Handles tool discovery and execution.

The current architecture documentation explicitly describes this three-layer protocol stack.

---

# 🔄 Tool Routing

One of the most interesting technical details is that different tools execute in different places.

For example:

```text
Screenshot
→ Browser


Read source file
→ Local dev server


Edit source file
→ Local dev server


Agent orchestration
→ Frontman server
```

So the system does not simply have:

```text
Agent → Everything
```

Instead:

```text
                 FRONTMAN SERVER
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
     Browser        Dev Server      Server
      Tools           Tools         Tools
        │              │              │
        ▼              ▼              ▼
       DOM            Files          Tasks
       CSS            Source
     Screenshot       Logs
```

This separation is one of the important architectural ideas behind Frontman.

---

# 🔐 Filesystem Boundary

An important security/architecture detail:

> The Frontman server does not simply receive direct filesystem access to my local project.

Instead:

```text
Agent
 ↓
Frontman Server
 ↓
Browser
 ↓
Dev Server Integration
 ↓
Local Files
```

The framework integration performs the actual filesystem operations on the machine where the project is running.

However, relevant file contents and tool results can still travel through the server to the selected LLM provider during the agent loop, so sensitive code/data should still be treated carefully.

---

# 🧪 My Hands-On Experiment

## Experiment Goal

The goal was to test whether Frontman could understand a visible UI element and connect it to the source code responsible for that element.

I used a small frontend application rather than a large project.

---

# 🧪 Experiment 1 — Modify a Button

I selected a button in the running application.

Example:

```text
┌────────────────────────────┐
│                            │
│       My Dashboard         │
│                            │
│      [ View Projects ]     │
│                            │
└────────────────────────────┘
```

Then I gave Frontman the instruction:

```text
Make this button blue, rounded,
and give it a subtle shadow.
```

The expected workflow was:

```text
Select Button
      ↓
Inspect Element
      ↓
Understand Component
      ↓
Find Source
      ↓
Edit Source
      ↓
Hot Reload
      ↓
Updated Button
      ↓
Verify
```

---

# 🔬 What I Was Looking For

The important part wasn't simply whether the button changed.

I wanted to observe:

```text
1. Did Frontman identify the correct element?

2. Did it understand the component?

3. Did it find the correct source file?

4. Did it inspect the existing styles?

5. Did it make a targeted edit?

6. Did the dev server hot-reload?

7. Did the browser show the new result?

8. Did the agent verify the change?
```

---

# 🧪 Experiment 2 — Modify a Card

I selected a card in the application.

Instruction:

```text
Increase this card's padding,
make the corners more rounded,
and add a subtle shadow.
```

The important architecture being tested:

```text
UI Element
 ↓
DOM
 ↓
Component
 ↓
CSS
 ↓
Source
 ↓
Edit
 ↓
Hot Reload
```

---

# 🧪 Experiment 3 — Responsive Design

I then tested a responsive task:

```text
Make this dashboard responsive on mobile.
```

The agent could use device/viewport context to reason about the application at different sizes.

The conceptual workflow:

```text
Desktop
 ↓
Inspect
 ↓
Change CSS/Layout
 ↓
Mobile viewport
 ↓
Inspect again
 ↓
Fix
 ↓
Verify
```

Frontman currently exposes device-mode/browser tools for this kind of workflow.

---

# 🧪 Experiment 4 — Visual Bug

A useful experiment is to intentionally introduce a visual problem.

For example:

```css
.card {
    width: 800px;
}
```

Then view the application on a narrow viewport.

The task:

```text
Find and fix the horizontal overflow on mobile.
```

This tests whether the agent can go through:

```text
Visual problem
 ↓
Browser inspection
 ↓
DOM
 ↓
CSS
 ↓
Source
 ↓
Edit
 ↓
Hot reload
 ↓
Verify
```

This is much closer to Frontman's intended use case than simply asking it to generate code.

---

# 🧪 Experiment 5 — UI → Source Question

Another useful read-only experiment:

```text
Which component renders the element I selected,
and which source file contains it?
```

This directly tests Frontman's central browser-to-source capability.

---

# 🔄 Frontman Interaction Style

The interaction can be summarized as:

```text
SEE
 ↓
SELECT
 ↓
UNDERSTAND
 ↓
MAP
 ↓
EDIT
 ↓
HOT RELOAD
 ↓
VERIFY
```

This is fundamentally different from a conventional coding workflow:

```text
READ FILE
 ↓
GUESS
 ↓
EDIT
 ↓
RUN
 ↓
REFRESH
 ↓
CHECK
```

Frontman tries to make the browser itself part of the coding context.

---

# 🆚 Frontman vs Browser Use

This is the most important comparison from today.

| | Browser Use | Frontman |
|---|---|---|
| Main purpose | Browser automation | Browser-aware coding |
| Primary environment | Web browser | Running web application |
| Main task | Complete browser tasks | Modify/debug frontend application |
| Natural-language goals | Yes | Yes |
| Browser interaction | Yes | Yes |
| DOM awareness | Yes | Yes |
| Screenshots | Yes | Yes |
| Source-code awareness | Not the central purpose | **Core feature** |
| Component context | Not the central purpose | **Core feature** |
| Computed CSS | Not the central purpose | **Core feature** |
| Source maps | Not the central purpose | **Core feature** |
| Source editing | Not its main purpose | **Core feature** |
| Hot reload | Not central | **Core workflow** |
| Framework integration | Not central | **Core workflow** |
| Best mental model | Agent → Browser → Website | **Browser → UI → Source → Edit** |

The important conclusion is not that one is better.

They solve different problems.

---

# 🌐 Browser Use Mental Model

```text
GOAL
 ↓
BROWSER AGENT
 ↓
BROWSER
 ↓
WEBSITE
 ↓
ACTION
 ↓
OBSERVATION
 ↓
NEXT ACTION
```

Example:

```text
"Find the GitHub star count."
```

---

# 🧑‍💻 Frontman Mental Model

```text
UI ELEMENT
 ↓
BROWSER CONTEXT
 ↓
COMPONENT CONTEXT
 ↓
SOURCE
 ↓
EDIT
 ↓
HOT RELOAD
 ↓
VERIFY
```

Example:

```text
"Make this button blue."
```

---

# 🆚 Frontman vs Goose

## Goose

```text
GENERAL-PURPOSE AGENT
        │
        ├── Coding
        ├── Files
        ├── Tools
        ├── MCP
        └── Extensions
```

## Frontman

```text
FRONTEND-AWARE AGENT
        │
        ├── Browser
        ├── DOM
        ├── CSS
        ├── Components
        ├── Source
        ├── Logs
        └── Hot Reload
```

Therefore:

```text
Goose
→ General-purpose


Frontman
→ Specialized browser-aware frontend development
```

---

# 🆚 Frontman vs OpenAI Agents SDK

## OpenAI Agents SDK

```text
Developer
 ↓
Write code
 ↓
Create Agent
 ↓
Give Agent Tools
 ↓
Run Agent
```

The SDK provides developer primitives for building agent applications.

---

## Frontman

```text
Developer
 ↓
Existing Web App
 ↓
Install Frontman
 ↓
Agent
 ↓
Browser + Source + Framework Context
```

Frontman is a specialized application/system built around the frontend-development workflow.

---

# 🆚 Frontman vs LangGraph

## LangGraph

```text
State
 ↓
Node
 ↓
Edge
 ↓
Conditional Edge
 ↓
Node
 ↓
END
```

Main focus:

```text
Stateful orchestration
```

---

## Frontman

```text
Browser
 ↓
Agent
 ↓
Tools
 ↓
Source
 ↓
Edit
 ↓
Hot Reload
 ↓
Browser
```

Main focus:

```text
Browser-aware frontend development
```

---

# 🧠 Browser Grounding

One of today's biggest concepts was **grounding**.

A model without runtime information has to guess:

```text
"Which component is causing this problem?"
```

With browser grounding:

```text
Rendered Element
 ↓
DOM
 ↓
Computed CSS
 ↓
Component Context
 ↓
Source
```

The model receives evidence from the actual running application.

---

# 👁️ Visual Grounding

Visual grounding means giving the agent information about what is actually rendered.

Examples:

```text
Screenshot
DOM
Element position
Viewport
Computed CSS
```

This lets the agent understand:

```text
WHAT THE USER ACTUALLY SEES
```

---

# 💻 Source Grounding

Source grounding means connecting that runtime information to:

```text
Component
 ↓
Source File
 ↓
Code
```

This lets the agent understand:

```text
HOW THE UI IS IMPLEMENTED
```

---

# 🔥 Frontman's Core Idea

The real value comes from combining:

```text
Visual Grounding
        +
Runtime Grounding
        +
Source Grounding
        ↓
Browser-Aware Coding
```

That is what makes Frontman particularly interesting for frontend development.

---

# 🧠 Why Source Code Alone Is Not Enough

A traditional coding agent may see:

```text
src/
├── App.jsx
├── Card.jsx
└── styles.css
```

It can read the code.

But it may not know exactly:

```text
What is actually rendered?
What CSS is actually applied?
What does the page look like?
Which element is causing the visual problem?
What happens at this viewport?
```

Frontman adds runtime browser context.

The current Frontman project explicitly frames this as a problem: source files do not contain all the runtime information needed for accurate visual frontend changes.

---

# 🔄 The Browser-to-Source Pipeline

This is the most important technical diagram from today:

```text
                  USER
                   │
                   ▼
             RUNNING APP
                   │
                   ▼
                BROWSER
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
       DOM        CSS      SCREENSHOT
        │          │          │
        └──────────┼──────────┘
                   ▼
             COMPONENT
              CONTEXT
                   │
                   ▼
              SOURCE MAP
                   │
                   ▼
              SOURCE FILE
                   │
                   ▼
                 LLM
                   │
                   ▼
                 EDIT
                   │
                   ▼
              DEV SERVER
                   │
                   ▼
              HOT RELOAD
                   │
                   ▼
                BROWSER
                   │
                   ▼
                VERIFY
```

---

# 🔌 MCP in Frontman

MCP is another important connection to my previous AI Systems learning.

Frontman uses MCP for tool discovery/execution, including browser-side capabilities.

The architecture can therefore be understood as:

```text
LLM
 ↓
Frontman Agent
 ↓
MCP
 ↓
Tools
 ├── Browser
 ├── DOM
 ├── Screenshot
 ├── Source
 ├── Files
 └── Logs
```

The current architecture documentation also describes MCP alongside ACP and JSON-RPC as part of the protocol stack.

---

# 🧱 Frontman Architecture by Responsibility

```text
┌─────────────────────────────────────────────┐
│                   FRONTMAN                  │
│                                             │
│  Browser Client                             │
│  ├── Chat                                   │
│  ├── Live Preview                           │
│  ├── Screenshots                            │
│  ├── DOM tools                              │
│  └── Element interaction                    │
│                                             │
│  Frontman Server                            │
│  ├── Agent Runtime                          │
│  ├── LLM Calls                              │
│  ├── Tool Routing                           │
│  ├── Sessions                               │
│  └── Persistence                            │
│                                             │
│  Framework Integration                      │
│  ├── Source Files                           │
│  ├── Components                             │
│  ├── Routes                                 │
│  ├── Logs                                   │
│  └── Build Context                          │
└─────────────────────────────────────────────┘
```

---

# 📦 Supported Frameworks

Current official integrations include:

```text
Next.js
Astro
Vite
```

Vite integration supports:

```text
React
Vue
Svelte
```

The current repository also lists SvelteKit support through the Vite integration.

For my own learning, **React + Vite** is the natural experiment because I already work with that stack.

---

# 🤖 Model Providers

Frontman currently follows a BYOK-style model-provider approach.

The current repository lists providers including:

```text
OpenAI
Anthropic
OpenRouter
Fireworks AI
NVIDIA
Google
xAI
```

The exact model/provider availability can change over time.

The architecture therefore remains:

```text
FRONTMAN
   │
   ▼
LLM PROVIDER
   │
   ▼
MODEL
```

Frontman itself is not the model.

---

# 🔐 Security and Data Flow

Because Frontman can inspect source files and browser state, understanding data flow is important.

The current architecture deliberately separates:

```text
Browser
Filesystem
Server
LLM
```

For example:

```text
Browser Tool
→ Browser

File Tool
→ Local Dev Server

Agent Orchestration
→ Frontman Server

Reasoning
→ LLM Provider
```

The local filesystem is not simply mounted directly into the Frontman server.

However, source content/tool results used by the agent can pass through the server to the selected LLM provider.

Therefore, for experiments:

```text
Small project
+
Dummy data
+
No secrets
```

is the safest approach.

---

# ⚠️ Development Mode

Frontman is designed to work with development environments.

The current repository states that framework integrations run in development mode and are removed from production builds.

So the intended workflow is:

```text
Local Development
      ↓
Frontman
      ↓
AI Editing
      ↓
Hot Reload
      ↓
Verify
      ↓
Production Build
```

---

# 🧠 Frontman Is Not Just "AI That Clicks"

This is probably the most important correction to make from Day 8.

A simplistic description would be:

> "Frontman is an AI that controls a browser."

That misses the important part.

A better description is:

> **Frontman is a browser-aware coding agent that uses the running application's browser state together with framework/source context to make and verify code changes.**

---

# 🧠 General Browser Agent vs Browser-Aware Coding Agent

```text
GENERAL BROWSER AGENT
────────────────────────────
Goal
 ↓
Browser
 ↓
Website
 ↓
Action
 ↓
Result
```

```text
BROWSER-AWARE CODING AGENT
────────────────────────────
UI
 ↓
Browser Runtime
 ↓
Component Context
 ↓
Source
 ↓
Edit
 ↓
Hot Reload
 ↓
UI
```

This is the central conceptual difference between Day 8 and Day 9.

---

# 🌎 AI Agent Ecosystem After Day 9

My current mental map:

```text
                        AI AGENT ECOSYSTEM
                                │
       ┌────────────────────────┼────────────────────────┐
       │                        │                        │
       ▼                        ▼                        ▼
   PROTOCOLS                FRAMEWORKS              AGENTS
       │                        │                        │
       ▼                        ▼                        ▼
      MCP                    LangGraph               Goose
      A2A                    Google ADK
      AG-UI                  OpenAI Agents SDK
      A2UI                   CrewAI
                             AutoGen
                                │
                                ▼
                       SPECIALIZED SYSTEMS
                                │
                     ┌──────────┴──────────┐
                     ▼                     ▼
                Browser Use            Frontman
                     │                     │
                     ▼                     ▼
                 Browser             Browser + Source
                     │                     │
                     ▼                     ▼
                   WEB                WEB APP
```

---

# 🧠 Framework-Independent Agent Model

After learning:

```text
Vanilla Agent
OpenAI Agents SDK
Google ADK
Goose
Browser Use
Frontman
```

a useful framework-independent model is:

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

Different systems simply expose these concepts at different levels.

---

# 🔥 The Biggest Lesson of Day 9

The biggest lesson today was:

> **An AI agent becomes much more useful when it is grounded in the actual environment it is operating in.**

For frontend development:

```text
LLM
+
Browser Runtime
+
DOM
+
CSS
+
Component Context
+
Source Code
+
Tool Execution
=
Browser-Aware Coding Agent
```

This is more powerful than asking an LLM to guess how a page works from source code alone.

---

# 🆚 Day 8 vs Day 9

## Day 8 — Browser Use

```text
                    USER
                     │
                     ▼
                 AI AGENT
                     │
                     ▼
                  BROWSER
                     │
                     ▼
                  WEBSITE
                     │
                     ▼
              CLICK / TYPE / SCROLL
                     │
                     ▼
                  RESULT
```

---

## Day 9 — Frontman

```text
                    USER
                     │
                     ▼
                RUNNING APP
                     │
                     ▼
                  BROWSER
                     │
              ┌──────┼──────┐
              ▼      ▼      ▼
             DOM    CSS   SCREENSHOT
              │      │      │
              └──────┼──────┘
                     ▼
               COMPONENT
                  CONTEXT
                     │
                     ▼
                  SOURCE
                     │
                     ▼
                   EDIT
                     │
                     ▼
                HOT RELOAD
                     │
                     ▼
                  VERIFY
```

---

# 🚀 Day 9 Progress

```text
[✓] Understood Frontman
[✓] Understood browser-aware AI coding
[✓] Understood Frontman vs Browser Use
[✓] Understood the browser-to-source concept
[✓] Understood Frontman architecture
[✓] Understood browser client
[✓] Understood Frontman server
[✓] Understood framework integration
[✓] Understood the agent loop
[✓] Understood DOM inspection
[✓] Understood computed CSS
[✓] Understood component context
[✓] Understood source maps
[✓] Understood screenshots
[✓] Understood element interaction
[✓] Understood device/viewport control
[✓] Understood browser tools
[✓] Understood framework tools
[✓] Understood server tools
[✓] Understood MCP
[✓] Understood tool routing
[✓] Understood source editing
[✓] Understood hot reload
[✓] Understood visual verification
[✓] Compared Frontman with Browser Use
[✓] Compared Frontman with Goose
[✓] Compared Frontman with OpenAI Agents SDK
[✓] Compared Frontman with LangGraph
[✓] Understood browser/runtime grounding
[✓] Understood source grounding
[✓] Considered security and data flow
```

---

# 🧠 Final Mental Model

The one diagram I want to remember from Day 9:

```text
                         FRONTMAN
                            │
                            ▼
                      RUNNING WEB APP
                            │
                            ▼
                         BROWSER
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
             DOM           CSS        SCREENSHOT
              │             │             │
              └─────────────┼─────────────┘
                            ▼
                    COMPONENT CONTEXT
                            │
                            ▼
                       SOURCE CODE
                            │
                            ▼
                           LLM
                            │
                            ▼
                          EDIT
                            │
                            ▼
                       DEV SERVER
                            │
                            ▼
                        HOT RELOAD
                            │
                            ▼
                         BROWSER
                            │
                            ▼
                         VERIFY
```

---

# ⭐ One Sentence to Remember

> **Frontman connects the live browser UI of a web application to the source code behind it, allowing an AI agent to inspect the rendered application, understand its component/source context, edit the code, hot-reload the app, and verify the result.**

---

# 📌 The Most Important Day 8 → Day 9 Difference

```text
Browser Use
────────────────────────────────
"Do something on the web."


Frontman
────────────────────────────────
"Understand this part of my web app
and change the code behind it."
```

---

# 🔗 Official Resources

- [Frontman Official Documentation](https://frontman.sh/docs/)
- [Frontman GitHub Repository](https://github.com/frontman-ai/frontman)
- [How the Agent Works](https://frontman.sh/docs/using/how-the-agent-works/)
- [Frontman Architecture](https://frontman.sh/docs/reference/architecture/)
- [Frontman Tool Capabilities](https://frontman.sh/docs/using/tool-capabilities/)
- [Frontman Web Preview](https://frontman.sh/docs/using/web-preview/)
- [Frontman Quickstart](https://frontman.sh/blog/getting-started/)
- [How Frontman Works](https://frontman.sh/how-it-works/)

---

# 🏁 Final Takeaway

Day 8 taught me:

```text
AI Agent
    ↓
Browser
    ↓
Website
```

Day 9 added another layer:

```text
AI Agent
    ↓
Browser
    ↓
Running Web App
    ↓
DOM / CSS / Components
    ↓
Source Code
    ↓
Edit
    ↓
Hot Reload
    ↓
Verify
```

So the progression is:

```text
Day 8
Browser-controlling AI

        ↓

Day 9
Browser-aware coding AI
```

The deeper lesson is that **the browser is not only an interface to control — it is also a source of runtime information about what the application actually looks like and how it behaves.**

Frontman uses that runtime context together with source/framework context to make frontend development more grounded and interactive.