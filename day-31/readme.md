# Day 2 — A2UI: Agent-to-User Interface

> **30-Minute Daily Exploration — Day 2**

Today I explored **A2UI (Agent-to-User Interface)** and learned how AI agents can go beyond returning plain text and instead generate descriptions of rich, interactive user interfaces.

The most important idea I learned is:

> **An agent can decide what UI is useful for a particular task, describe that UI using A2UI, and let the client render it using trusted components.**

A2UI is an open protocol/project for agent-generated interfaces. The current production release is **v0.9.1**, while v1.0 is currently a release candidate.

---

# 1. What is A2UI?

**A2UI = Agent-to-User Interface.**

Traditional AI interaction looks like:

```text
User
 ↓
AI Agent
 ↓
Text
 ↓
User
```

A2UI allows the interaction to become:

```text
User
 ↓
AI Agent
 ↓
A2UI description
 ↓
Client Renderer
 ↓
Interactive UI
 ↓
User
```

Instead of only saying:

> "Here are the details."

The agent can describe an interface such as:

```text
Card
 ├── Image
 ├── Name
 ├── Description
 ├── Details
 └── Button
```

The client then renders those components.

A2UI is specifically designed as a **declarative, JSON-based, streaming UI protocol**.

---

# 2. The problem A2UI solves

Generative AI is very good at generating:

- text
- code
- explanations
- structured information

But returning everything as text is not always the best user experience.

For example:

```text
User:
"Help me book a table."

Traditional AI:

What date would you like?

User:
Tomorrow.

What time?

User:
7 PM.

How many people?

...
```

A2UI can allow the agent to produce something like:

```text
┌──────────────────────────────┐
│       Book Your Table        │
│                              │
│ Date: [ Tomorrow       ▼ ]   │
│ Time: [ 7:00 PM        ▼ ]   │
│ Guests: [-] 2 [+]            │
│                              │
│       [ Confirm ]             │
└──────────────────────────────┘
```

The user can interact directly with the interface.

The official A2UI quickstart demonstrates this same general pattern with generated booking UI containing text, date/time input, data bindings, and an action button.

---

# 3. My search-bar example

The best way I understood A2UI was through a normal search application.

Imagine I have:

```text
┌─────────────────────────────────┐
│ 🔍 Search person...             │
└─────────────────────────────────┘
```

I search:

```text
Elon Musk
```

The application finds the person in a database.

The result could be:

```text
┌─────────────────────────────────┐
│ 👤 Elon Musk                    │
│                                 │
│ CEO — Tesla                     │
│ Founder — SpaceX                │
│                                 │
│ Location: Texas                 │
│                                 │
│ [ View Profile ]                │
└─────────────────────────────────┘
```

At first, this looks like ordinary UI.

And that's exactly what made me realize the important question:

> **If normal applications can already search a database and display a card, what does A2UI actually add?**

---

# 4. Traditional UI vs A2UI

## Traditional UI

In a traditional application, the developer decides the UI beforehand.

The architecture might be:

```text
User
 ↓
Search Bar
 ↓
Backend/API
 ↓
Database
 ↓
Person Data
 ↓
PersonCard
 ↓
Browser
```

For example:

```javascript
const person = await searchDatabase(query);

return (
    <PersonCard
        name={person.name}
        company={person.company}
        role={person.role}
    />
);
```

The important point is:

> **The developer already decided that the result should be a PersonCard.**

The database provides:

```text
DATA
```

The frontend provides:

```text
UI
```

---

# 5. What changes with A2UI?

With A2UI, the agent can dynamically describe the UI that should be displayed.

Conceptually:

```text
User
 ↓
"Elon Musk"
 ↓
Agent
 ↓
Finds/receives person data
 ↓
Determines useful presentation
 ↓
A2UI description
 ↓
Client Renderer
 ↓
Person Card
```

For example, the agent could describe:

```text
Card
 ├── Image
 ├── Text: Elon Musk
 ├── Text: CEO — Tesla
 ├── Text: Founder — SpaceX
 └── Button: View Profile
```

The client then maps those component descriptions to its own trusted components.

A2UI explicitly separates **UI structure** from **application data**, which is one of its core design ideas.

---

# 6. The key difference

This is the most important thing I learned today.

### Traditional UI

```text
Developer
 ↓
Decides UI
 ↓
PersonCard
 ↓
Database data fills the card
```

### A2UI

```text
Developer
 ↓
Provides trusted UI building blocks
 ↓
Agent
 ↓
Dynamically composes UI
 ↓
A2UI description
 ↓
Renderer
 ↓
Actual UI
```

So:

> **Traditional UI:** The developer generally decides the interface beforehand.

> **A2UI:** The agent can dynamically compose an interface from a set of components that the client makes available.

A2UI's catalog system is specifically designed to let clients define which components and visual language agents can use.

---

# 7. A2UI does NOT replace the database

This is extremely important.

A2UI is **not** a database.

It does not magically retrieve information from the database.

You can still have:

```text
Database
 ↓
Backend/API
 ↓
Agent
 ↓
A2UI
 ↓
Renderer
 ↓
UI
```

For example, the database could contain:

```json
{
    "name": "Elon Musk",
    "company": "Tesla",
    "role": "CEO"
}
```

The agent receives this data.

Then the agent could decide that a profile card is appropriate.

So there are separate responsibilities:

```text
DATABASE
→ Provides information

AGENT
→ Understands the task and decides what should happen

A2UI
→ Describes the desired UI

RENDERER
→ Turns the description into actual UI
```

---

# 8. Two separate questions

This is the easiest mental model I found.

## Question 1:

### "What is the data?"

The database answers:

```text
Name:
Elon Musk

Company:
Tesla

Role:
CEO
```

## Question 2:

### "How should I present this information?"

Traditional UI:

```text
Developer already decided:

PersonCard
```

A2UI:

```text
Agent decides:

Card
 + Image
 + Text
 + Button
```

Therefore:

```text
Database
   │
   │ WHAT?
   ↓
Data

Agent
   │
   │ HOW TO PRESENT?
   ↓
A2UI

Renderer
   │
   ↓
Actual UI
```

---

# 9. Traditional search architecture

A normal application could look like:

```text
                    USER
                     │
                     │ "Elon Musk"
                     ↓
                 SEARCH BAR
                     │
                     ↓
                  BACKEND
                     │
                     ↓
                 DATABASE
                     │
                     ↓
               Person JSON
                     │
                     ↓
             PRE-BUILT CARD
                     │
                     ↓
                  BROWSER
```

The data is dynamic.

But the developer already created the UI.

---

# 10. A2UI search architecture

With A2UI:

```text
                    USER
                     │
                     │ "Elon Musk"
                     ↓
                   AGENT
                  /     \
                 /       \
                ↓         ↓
         Data source    Reasoning
                │         │
                └────┬────┘
                     ↓
               A2UI Message
                     │
                     ↓
              Client Renderer
                     │
                     ↓
             Trusted Catalog
                     │
                     ↓
                 Person Card
```

The database still exists.

The difference is that the **agent can participate in deciding the interface composition**.

---

# 11. The interface can depend on intent

This is where A2UI becomes really interesting.

Suppose I search:

```text
Elon Musk
```

The agent might decide:

```text
Person
 ↓
Profile Card
```

But if I search:

```text
Tesla stock
```

it could decide:

```text
Financial Data
 ↓
Chart + Statistics
```

If I search:

```text
Tesla vs BYD
```

it could decide:

```text
Comparison
 ↓
Comparison Table
```

If I ask:

```text
Show Tesla revenue for the last 5 years.
```

it could decide:

```text
Financial Data
 ↓
Line Chart
```

So:

```text
User Intent
     ↓
Agent
     ↓
Choose useful UI
     ↓
A2UI
     ↓
Renderer
```

The interface can become **context-dependent**.

---

# 12. But normal UI can also do this

This is an important realization.

I can already write:

```javascript
if (queryType === "person") {
    return <PersonCard />;
}

if (queryType === "stock") {
    return <StockChart />;
}

if (queryType === "comparison") {
    return <ComparisonTable />;
}
```

So A2UI is not simply:

> "Dynamic UI exists."

Dynamic UI already existed.

The more interesting difference is:

```text
Traditional:

Developer explicitly programs
the possible UI decisions.

A2UI:

Developer provides a component vocabulary,
and an agent can dynamically compose
those components based on the task.
```

This distinction is central to A2UI's catalog-based design.

---

# 13. Component Catalog

A **component catalog** is the set of UI components available to the agent.

For example:

```text
My Application Catalog

├── Text
├── Image
├── Card
├── Button
├── TextField
├── DateTimeInput
├── Table
├── Chart
├── List
├── Tabs
└── Modal
```

The agent can compose interfaces using the components supported by the catalog.

The current A2UI documentation describes the catalog as defining the available components and functions, and production applications can define their own catalogs to match their design system.

---

# 14. Why a trusted catalog matters

A2UI does **not** require the agent to generate arbitrary executable frontend code.

Instead:

```text
Agent
 ↓
"I want a Card"
 ↓
Client checks catalog
 ↓
Card is an approved component
 ↓
Renderer
 ↓
UI
```

This is fundamentally different from:

```text
Agent
 ↓
Generate arbitrary JavaScript
 ↓
Execute JavaScript
```

A2UI is designed as a declarative format rather than executable UI code, allowing the client to maintain control over the actual components it renders.

---

# 15. Declarative UI

Another major concept I learned today is:

## Imperative

Tell the computer **how to do something**.

```javascript
const button = document.createElement("button");

button.innerText = "Submit";

document.body.appendChild(button);
```

You're describing the steps.

---

## Declarative

Describe **what you want**.

Conceptually:

```json
{
    "component": "Button",
    "text": "Submit"
}
```

Then the renderer determines how to actually create it.

A2UI is based around this declarative approach.

---

# 16. Surface

A **surface** is a cohesive UI area.

For example:

```text
┌───────────────────────────────┐
│           Surface             │
│                               │
│  Profile                      │
│                               │
│  👤 Elon Musk                 │
│                               │
│  CEO — Tesla                  │
│                               │
│  [View Profile]               │
│                               │
└───────────────────────────────┘
```

A surface can represent something like:

- a form
- a dashboard
- a card-based interface
- a chat UI
- another cohesive UI area

The current v0.9.1 protocol uses `createSurface` to initialize a surface and associate it with a component catalog.

---

# 17. Components

Components are the building blocks inside the surface.

For example:

```text
Surface
│
├── Card
│
├── Image
│
├── Text
│
├── Text
│
└── Button
```

A2UI's basic catalog includes components such as:

- Text
- Image
- Icon
- Video
- AudioPlayer
- Row
- Column
- List
- Card
- Tabs
- Divider
- Modal

The exact available catalog can be customized by the application.

---

# 18. A2UI's component structure

A2UI v0.9.1 uses a **flat component list with IDs** rather than requiring deeply nested JSON.

Conceptually:

```text
root
 ├── profile-card
 ├── profile-image
 ├── profile-name
 └── view-button
```

The components reference each other by IDs.

This is called an **adjacency-list model**.

Why?

Because it makes it easier to:

- stream components incrementally
- update one component
- add components
- remove components
- avoid huge deeply nested structures

The current documentation specifically explains this flat component model and its benefits for LLM generation and incremental updates.

---

# 19. Data Model

A2UI separates:

```text
UI structure
```

from:

```text
Application data
```

For example:

```text
UI:

PersonCard
 ├── Name
 ├── Company
 └── Role
```

Data:

```json
{
    "name": "Elon Musk",
    "company": "Tesla",
    "role": "CEO"
}
```

The UI can bind to data paths.

Conceptually:

```text
Text
  ↓
/person/name
```

The current A2UI specification uses data bindings and JSON Pointer paths to connect component properties with the data model.

---

# 20. Why separate structure and data?

Because the same UI can display different data.

For example:

```text
PersonCard
```

can display:

```text
Elon Musk
```

or:

```text
Sundar Pichai
```

or:

```text
Satya Nadella
```

without changing the underlying component structure.

So:

```text
UI Structure
      +
Data
      ↓
Rendered UI
```

---

# 21. Streaming UI

A2UI isn't necessarily:

```text
Generate everything
 ↓
Wait
 ↓
Render everything
```

The protocol is designed around **streaming JSON messages**.

The client can progressively build the UI.

For example:

```text
createSurface
      ↓
updateComponents
      ↓
updateDataModel
      ↓
More components
      ↓
More data
```

The current v0.9.1 specification defines messages including:

```text
createSurface
updateComponents
updateDataModel
deleteSurface
```

and describes incremental processing of those messages.

---

# 22. User interaction

A2UI isn't only about displaying information.

The UI can contain actions.

For example:

```text
┌─────────────────────────────┐
│ Elon Musk                   │
│                             │
│ CEO — Tesla                 │
│                             │
│ [ View Profile ]            │
└─────────────────────────────┘
```

The user clicks:

```text
View Profile
```

The action can be sent back to the agent/application.

The flow becomes:

```text
Agent
 ↓
A2UI
 ↓
UI
 ↓
User clicks
 ↓
Action
 ↓
Agent/Application
 ↓
Updated UI
```

The current v0.9.1 protocol supports component actions, while the v1.0 candidate adds an `actionResponse` message for client-to-server synchronous RPC-style interactions.

---

# 23. A2UI is not "AI replaces frontend developers"

This is another important distinction.

A2UI doesn't mean:

```text
AI
 ↓
Creates entire frontend
 ↓
Developer unnecessary
```

A better mental model is:

```text
Developer
 ↓
Defines:
- components
- design system
- allowed interactions
- security boundaries
- renderer
 ↓
Agent
 ↓
Chooses/composes UI
 ↓
Client
 ↓
Renders it
```

The developer still controls the environment.

---

# 24. A2UI vs traditional UI

| Traditional UI | A2UI |
|---|---|
| Developer defines page structure | Agent can dynamically describe UI |
| UI usually predetermined | UI can adapt to task/context |
| Backend provides data | Backend/data sources still provide data |
| React/Vue/etc. components | A2UI component descriptions mapped to client components |
| Developer writes each layout | Agent can compose from available catalog |
| Usually static application structure | Incrementally updateable UI |
| Code defines UI behavior | Declarative messages describe UI |
| Direct framework implementation | Protocol can be rendered by different clients |

A2UI does not eliminate normal frontend development. It introduces a protocol for **agent-driven, declarative, dynamically composed UI**.

---

# 25. A2UI vs A2A

This connects directly to yesterday.

## Day 1 — A2A

```text
Agent A
   ↕
Agent B
```

Purpose:

> **Agent-to-agent collaboration.**

---

## Day 2 — A2UI

```text
Agent
   ↓
UI
   ↓
Human
```

Purpose:

> **Agent-driven user interface.**

---

## Together

```text
                         USER
                          │
                          ↓
                   Manager Agent
                          │
                         A2A
                          ↓
                   Research Agent
                          │
                          ↓
                       Result
                          │
                         A2UI
                          ↓
                      Renderer
                          │
                          ↓
                     Interactive UI
```

A2A can be used as a transport for A2UI messages between agents and clients. The A2UI project explicitly lists A2A among the transports that can carry A2UI messages.

---

# 26. A2UI vs MCP

Another useful distinction:

### MCP

```text
Agent
 ↓
MCP
 ↓
Tools / Resources / Data
```

### A2UI

```text
Agent
 ↓
A2UI
 ↓
User Interface
```

So:

```text
MCP
= Agent ↔ capabilities

A2A
= Agent ↔ Agent

A2UI
= Agent ↔ User Interface
```

These technologies can exist together in one system.

---

# 27. A complete architecture

A more advanced AI system could look like:

```text
                         USER
                           │
                           ↓
                    ┌────────────┐
                    │   Agent    │
                    └─────┬──────┘
                          / \
                         /   \
                       A2A   MCP
                       /       \
                      ↓         ↓
                Other Agent    Tools
                      │         │
                      ↓         ↓
                   Results    Data
                      \         /
                       \       /
                        ↓     ↓
                         Agent
                           │
                          A2UI
                           │
                           ↓
                    Client Renderer
                           │
                           ↓
                     Interactive UI
```

This is where the concepts from Day 1 and Day 2 start fitting together.

---

# 28. My biggest realization today

Before exploring A2UI, I thought:

> "A2UI means AI generates a UI instead of text."

That's correct, but incomplete.

The deeper idea is:

> **A2UI separates the agent's decision about what interface is useful from the client's responsibility to safely render that interface.**

The agent doesn't need to generate arbitrary frontend code.

Instead:

```text
Agent
 ↓
Declarative UI description
 ↓
Client
 ↓
Trusted components
 ↓
Actual UI
```

That separation is what makes the concept powerful.

---

# 29. My mental model

I can now think of an AI application as three layers:

```text
┌──────────────────────────────────┐
│            DATA                  │
│                                  │
│ Database / APIs / Tools          │
└────────────────┬─────────────────┘
                 │
                 ↓
┌──────────────────────────────────┐
│            AGENT                 │
│                                  │
│ Understands task                 │
│ Reasons                          │
│ Decides what to do               │
│ Decides useful presentation      │
└────────────────┬─────────────────┘
                 │
                 ↓
┌──────────────────────────────────┐
│             A2UI                 │
│                                  │
│ Describes UI structure           │
│ Components                       │
│ Data bindings                    │
│ Actions                          │
└────────────────┬─────────────────┘
                 │
                 ↓
┌──────────────────────────────────┐
│           RENDERER               │
│                                  │
│ Uses trusted/native components   │
└────────────────┬─────────────────┘
                 │
                 ↓
┌──────────────────────────────────┐
│             USER                 │
│                                  │
│ Interactive UI                   │
└──────────────────────────────────┘
```

---

# 30. What I actually learned today

```text
A2UI
│
├── Agent-to-User Interface
│
├── Generative UI
│
├── Declarative UI
│
├── Surfaces
│
├── Components
│
├── Component Catalogs
│
├── Data Model
│
├── Data Binding
│
├── Component IDs
│
├── Adjacency List Model
│
├── Streaming
│
├── Incremental Updates
│
├── User Actions
│
├── Trusted Rendering
│
├── Agent-generated UI
│
├── A2UI vs Traditional UI
│
├── A2UI vs A2A
│
└── A2UI vs MCP
```

---

# 31. Current A2UI protocol knowledge

As of this exploration:

```text
A2UI v0.8
→ Legacy

A2UI v0.9
→ Stable

A2UI v0.9.1
→ Current production release

A2UI v1.0
→ Candidate / release candidate
```

So when experimenting, I should make sure tutorials/examples match the protocol version I'm using.

The official project currently identifies **v0.9.1 as the current production release** and **v1.0 as a candidate**.

---

# 32. My Day 2 experiment

## Goal

Build or explore:

```text
AI Search
```

where the result isn't only text.

Example:

```text
User:

"Elon Musk"
```

Agent/data source:

```text
{
    "name": "Elon Musk",
    "company": "Tesla",
    "role": "CEO"
}
```

Agent decides:

```text
Person → Profile Card
```

A2UI describes:

```text
Card
 ├── Image
 ├── Name
 ├── Company
 ├── Role
 └── Button
```

Renderer:

```text
↓
Actual Profile Card
```

---

# 33. The experiment architecture

```text
             USER
               │
               │ "Elon Musk"
               ↓
             AGENT
             /   \
            /     \
       DATABASE   REASONING
            │       │
            └───┬───┘
                ↓
             A2UI
                ↓
         Client Renderer
                ↓
        Trusted Components
                ↓
          Profile Card
```

---

# 34. What I should experiment with

### Experiment 1

Search:

```text
Elon Musk
```

Try to display:

```text
Person Card
```

---

### Experiment 2

Search:

```text
Tesla stock
```

Try to display:

```text
Chart
```

---

### Experiment 3

Search:

```text
Tesla vs BYD
```

Try:

```text
Comparison Table
```

---

### Experiment 4

Ask:

```text
"Show Tesla revenue for 5 years."
```

Try:

```text
Line Chart
```

---

### Experiment 5

Ask:

```text
"Find people with Python skills."
```

Try:

```text
Search/filter UI
+
Result cards
```

The goal isn't to implement all of these.

The goal is to understand the idea:

```text
Different user intent
        ↓
Different useful UI
```

---

# 35. My 30-minute Day 2 plan

## 0–5 minutes

Understand:

```text
A2UI
Generative UI
Declarative UI
```

---

## 5–10 minutes

Understand:

```text
Surface
Component
Catalog
Renderer
Data Model
```

---

## 10–20 minutes

Explore the official A2UI examples/quickstart and inspect how an agent's JSON messages become UI. The official quickstart shows the flow:

```text
User
 ↓
App
 ↓
Agent
 ↓
LLM
 ↓
A2UI JSON
 ↓
App
 ↓
Renderer
 ↓
UI
```



---

## 20–27 minutes

Experiment with a tiny:

```text
Search → Person Card
```

system.

---

## 27–30 minutes

Write down:

```text
What I learned
What surprised me
What I built
What confused me
Traditional UI vs A2UI
A2UI vs A2A
A2UI vs MCP
Next experiment
```

---

# 36. My biggest takeaway

> **Normal UI:** The developer usually decides the UI structure and the database supplies the data.

> **A2UI:** The application still has data sources and trusted UI components, but an agent can dynamically describe and compose an interface appropriate to the user's current task.

So:

```text
Traditional UI

Developer
   ↓
Pre-built UI
   +
Database
   ↓
Result
```

versus:

```text
A2UI

Database/API
   ↓
Agent
   ↓
Decides useful UI
   ↓
A2UI
   ↓
Trusted Renderer
   ↓
Result
```

---

# 37. One-line memory trick

> **A2A = agents talk to agents.**
>
> **A2UI = agents speak UI.**
>
> **Database = provides the data.**
>
> **Renderer = turns the UI description into the actual interface.**

---

# 38. Official references

- **A2UI official site:** protocol overview, current versions, concepts, quickstart, and examples.
- **A2UI GitHub:** source repository and current project status.
- **A2UI v0.9.1 specification:** current production protocol and message definitions.
- **Components & Structure:** surfaces, components, catalogs, data binding, and adjacency-list model.
- **Quickstart:** end-to-end agent → A2UI JSON → renderer flow.

---

# Day 2 Status

```text
┌──────────────────────────────────┐
│          DAY 2 — A2UI            │
├──────────────────────────────────┤
│ Topic: Agent-to-User Interface   │
│ Time: ~30 minutes                │
│                                  │
│ Learned:                          │
│ ✓ Generative UI                  │
│ ✓ Declarative UI                 │
│ ✓ Components                     │
│ ✓ Catalogs                       │
│ ✓ Surfaces                       │
│ ✓ Data Models                    │
│ ✓ Data Binding                   │
│ ✓ Streaming                      │
│ ✓ A2UI vs traditional UI         │
│ ✓ A2UI vs A2A                    │
│ ✓ A2UI vs MCP                    │
│                                  │
│ Core idea:                       │
│ Agent → A2UI → Renderer → UI     │
│                                  │
│ Status: 🟢 Learned               │
│                                  │
│ Next: Build a tiny dynamic       │
│ search → profile-card experiment │
└──────────────────────────────────┘
```

**The single thing I want to be able to demonstrate after Day 2 is:**  

```text
"Search Elon Musk"
        ↓
Get data
        ↓
Agent decides:
"Profile Card is useful"
        ↓
A2UI description
        ↓
Trusted renderer
        ↓
Interactive Profile Card
```

If I can make that happen, **Day 2 is genuinely complete**, rather than just being another day of reading documentation.