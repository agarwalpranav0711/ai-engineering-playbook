# Day 13 — Supabase AI & Building a Tiny AI Backend

## Overview

Today I moved from **exploring individual AI models** to understanding how AI can be integrated into a real application backend.

The focus of Day 13 was:

> **Experiment → Supabase AI → Build → Tiny AI Backend**

Instead of only asking which AI model is better, today's goal was to understand how an AI-powered application is structured:

```text
User
  ↓
Frontend / API Client
  ↓
Backend
  ↓
AI Model
  ↓
Response
  ↓
User
```

For the practical part, I explored **Supabase**, its **Edge Functions**, AI capabilities, backend APIs, secrets, and the foundations required for building AI applications such as embeddings, vector search, and RAG.

The main project for today is intentionally small:

> **Build a tiny AI backend that exposes an AI capability through an API endpoint.**

Supabase Edge Functions are server-side TypeScript functions running on Supabase's Deno-compatible Edge Runtime, and Supabase documents AI inference as one of their use cases.

---

# Today's Roadmap

```text
Day 13

Experiment
    ↓
Supabase AI
    ↓
Understand Backend Architecture
    ↓
Understand Edge Functions
    ↓
Understand AI Inference
    ↓
Build Tiny AI Backend
    ↓
Test API
    ↓
Document Results
```

---

# Learning Objectives

Today's objectives were:

- Understand Supabase
- Understand Backend-as-a-Service
- Understand PostgreSQL
- Understand APIs
- Understand Edge Functions
- Understand the Supabase Edge Runtime
- Understand Supabase AI
- Understand AI inference
- Understand embeddings
- Understand `pgvector`
- Understand semantic search
- Understand vector similarity
- Understand RAG
- Understand authentication and authorization
- Understand Row Level Security
- Understand secrets and environment variables
- Understand how AI models connect to application backends
- Build a tiny AI backend
- Test the backend
- Understand the architecture behind production AI applications

---

# 1. What is Supabase?

Supabase is a backend platform built around **PostgreSQL**.

It provides several backend capabilities that applications commonly need, including:

- PostgreSQL database
- Authentication
- Storage
- APIs
- Edge Functions
- Realtime capabilities
- AI and vector tooling

Supabase's AI and vector tooling is built around PostgreSQL and `pgvector`, allowing applications to store, index, and query embeddings.

A simplified view is:

```text
                SUPABASE
                    │
       ┌────────────┼─────────────┐
       ↓            ↓             ↓
   Database       Auth         Storage
       │
       ↓
   Edge Functions
       │
       ↓
    AI / Vectors
```

---

# 2. Why Supabase Matters for AI Engineering

Before today, most of my AI exploration focused on models:

```text
Gemma
Qwen
DeepSeek
Mistral
Llama
Phi
```

Those experiments answered questions such as:

> What can this model do?

Today's question is different:

> **How do I put AI inside an actual application?**

That requires more than a model.

A real AI application may require:

```text
Frontend
+
Backend
+
Database
+
Authentication
+
AI model
+
Secrets
+
API
+
Security
```

Supabase provides many of these backend building blocks.

---

# 3. Model vs Backend

This distinction is extremely important.

## AI Model

Examples:

```text
GPT
Claude
Gemini
Llama
Qwen
DeepSeek
Mistral
Phi
```

A model generates or processes information.

## Backend

The backend handles:

```text
API requests
Authentication
Business logic
Database access
AI calls
Security
Data processing
```

Therefore:

```text
AI Model
    ≠
Backend
```

Instead:

```text
Backend
   ↓
AI Model
   ↓
AI Application
```

---

# 4. Frontend vs Backend

## Frontend

The frontend is what the user interacts with.

Examples:

- HTML
- CSS
- React
- Flutter
- JavaScript

Example:

```text
[ Enter your question ]

"What is binary search?"

[ Ask AI ]
```

## Backend

The backend processes the request.

```text
Frontend
   ↓
Backend
   ↓
AI
   ↓
Backend
   ↓
Frontend
```

The backend is where sensitive operations and application logic should live.

---

# 5. What is an API?

API stands for:

> **Application Programming Interface**

For today's project, an API is the interface through which the client communicates with the backend.

Example:

```http
POST /ask-ai
```

Request:

```json
{
  "prompt": "Explain binary search"
}
```

Response:

```json
{
  "answer": "Binary search is..."
}
```

The API becomes the bridge between the application and the AI backend.

---

# 6. HTTP Methods

A backend API can use different HTTP methods.

Common ones include:

```text
GET
POST
PUT
PATCH
DELETE
```

For our AI generation endpoint, `POST` is appropriate because the client is sending a prompt to the backend.

Example:

```http
POST /ask-ai
```

with:

```json
{
  "prompt": "Explain recursion"
}
```

---

# 7. What is an AI Backend?

An AI backend is a backend that uses AI as part of its application logic.

For example:

```text
User
  ↓
POST /ask-ai
  ↓
Backend
  ↓
AI Model
  ↓
Generated Answer
  ↓
JSON Response
  ↓
User
```

This is the fundamental architecture behind many AI applications.

---

# 8. What is an Edge Function?

A **Supabase Edge Function** is a server-side TypeScript function running on Supabase's Deno-compatible Edge Runtime.

Supabase describes Edge Functions as globally distributed server-side TypeScript functions that can be used for HTTP endpoints, webhooks, third-party integrations, and AI workloads.

Conceptually:

```text
TypeScript Code
      ↓
Edge Function
      ↓
HTTP Endpoint
```

For example:

```text
/functions/v1/ask-ai
```

can act as an API endpoint.

---

# 9. Why Edge Functions?

Traditionally, I could build this backend using:

```text
Node.js
+
Express
+
Server
```

For example:

```text
Node.js
   ↓
Express
   ↓
POST /ask-ai
   ↓
AI API
```

Supabase gives another approach:

```text
TypeScript
   ↓
Supabase Edge Function
   ↓
AI
```

Supabase handles much of the infrastructure surrounding the function, including deployment and edge execution.

---

# 10. Edge Runtime

Supabase Edge Functions use a Deno-compatible runtime and are TypeScript-first.

This means the function code is typically:

```text
TypeScript
```

rather than a traditional Node/Express server.

Supabase's documentation specifically notes that Edge Functions use the Deno runtime and support Web APIs and TypeScript.

---

# 11. Edge Function Request Flow

The general flow is:

```text
Client
  ↓
HTTP Request
  ↓
Supabase Edge Gateway
  ↓
Authentication / Policies
  ↓
Edge Function
  ↓
AI / Database / External API
  ↓
Response
```

Supabase describes the gateway as handling routing and authentication-related processing before the Edge Runtime executes the function.

---

# 12. What Can Edge Functions Do?

Edge Functions can be used for many backend tasks:

- REST APIs
- Webhooks
- AI inference
- Calling external AI APIs
- Payments
- Email
- Bots
- Image generation
- Data processing
- Database operations

Supabase specifically lists small AI inference tasks and orchestration of external LLM APIs as Edge Function use cases.

---

# 13. What is Supabase AI?

Supabase provides AI capabilities that can be used from Edge Functions.

The current Supabase AI API supports AI-related tasks including:

- Model inference
- Text embeddings
- Conversational AI workflows

Supabase documents the built-in AI API as an API available directly inside Edge Functions.

The important mental model is:

```text
Edge Function
      ↓
Supabase AI
      ↓
AI capability
```

---

# 14. AI Inference

Inference means:

> **Using a trained AI model to generate an output from an input.**

For example:

```text
Input:
"Explain recursion."

       ↓

AI Model

       ↓

Output:
"Recursion is a technique..."
```

During today's project, the backend performs this inference operation.

---

# 15. Supabase AI vs External AI Providers

There are two general approaches.

## Approach A — Supabase AI

```text
Edge Function
      ↓
Supabase AI
      ↓
Model
```

Supabase provides a built-in AI API for Edge Functions.

## Approach B — External AI Provider

```text
Edge Function
      ↓
External AI API
      ↓
Model
```

Supabase also documents integrations with external AI providers such as OpenAI and Hugging Face.

The important lesson is that **Supabase is the backend layer; the model/provider can be another component of the architecture.**

---

# 16. Secrets and Environment Variables

One of the most important backend security lessons today was:

> **Never expose private API keys in frontend code or commit them to GitHub.**

Bad:

```javascript
const API_KEY = "secret-key-here";
```

Good:

```text
Secret
  ↓
Environment variable
  ↓
Backend
  ↓
AI API
```

Supabase provides project secrets/environment variables for Edge Functions.

---

# 17. Why Secrets Must Stay Server-Side

Suppose an API key is placed in frontend JavaScript.

A user can inspect the browser and potentially retrieve it.

Bad architecture:

```text
Browser
   ↓
API KEY
   ↓
AI Provider
```

Better:

```text
Browser
   ↓
Backend
   ↓
Secret API KEY
   ↓
AI Provider
```

The secret stays on the server side.

---

# 18. Supabase Default Secrets

Supabase Edge Functions have access to several project-related environment variables.

The documentation lists values such as:

```text
SUPABASE_URL
SUPABASE_DB_URL
SUPABASE_PUBLISHABLE_KEYS
SUPABASE_SECRET_KEYS
SUPABASE_JWKS
```

Supabase specifically warns that secret keys should never be exposed in a browser because they can bypass Row Level Security.

---

# 19. Authentication

Supabase also provides authentication.

Authentication answers:

> **Who is the user?**

Examples:

```text
Sign Up
Login
Logout
Sessions
User identity
```

For an AI application:

```text
User
  ↓
Login
  ↓
Authenticated request
  ↓
AI Backend
```

---

# 20. Authorization

Authorization answers:

> **What is this user allowed to access?**

Example:

```text
Authentication:
"I am User A."

Authorization:
"I can access User A's conversations."
```

These are different concepts.

---

# 21. Row Level Security

**RLS = Row Level Security.**

It allows database policies to control which rows a user can access.

Imagine:

```text
messages

user_id | message
--------|---------
A       | Hello
B       | Hi
```

A policy can ensure:

```text
User A
  ↓
Only User A's rows
```

instead of allowing User A to read User B's data.

This becomes extremely important in multi-user AI applications.

---

# 22. PostgreSQL

Supabase is built around **PostgreSQL**.

PostgreSQL is a relational database.

Example:

```text
users

id | name
---|------
1  | Pranav
2  | Rahul
```

An AI application can store:

```text
Users
Conversations
Messages
Documents
Metadata
Embeddings
```

inside PostgreSQL.

---

# 23. Why AI Applications Need Databases

An AI model itself does not automatically provide application memory.

A real AI application may need to store:

```text
Conversation history
User preferences
Documents
AI results
User accounts
Embeddings
```

Therefore:

```text
AI Model
+
Database
=
Much more useful application
```

---

# 24. What is an Embedding?

An embedding converts information into a numerical vector representing semantic information.

Conceptually:

```text
"cat"
   ↓
[0.12, -0.45, 0.77, ...]
```

and:

```text
"kitten"
   ↓
[0.14, -0.43, 0.75, ...]
```

Similar meanings can produce vectors that are close together.

Supabase's semantic-search documentation describes embeddings as numerical representations used to compare semantic similarity.

---

# 25. Why Embeddings Matter

Embeddings allow applications to perform:

- Semantic search
- Similarity search
- Recommendations
- Document retrieval
- RAG

Instead of searching only exact words, the system can search based on meaning.

---

# 26. What is pgvector?

`pgvector` is a PostgreSQL extension used for storing and performing similarity searches over vector embeddings.

The architecture becomes:

```text
PostgreSQL
     +
pgvector
     ↓
Vector Storage
     ↓
Similarity Search
```

Supabase's AI/vector tooling uses PostgreSQL and `pgvector` for vector workloads.

---

# 27. Vector Similarity

Suppose we have:

```text
Vector A
[0.1, 0.2, 0.3]

Vector B
[0.11, 0.21, 0.29]
```

They are relatively close.

Another vector:

```text
Vector C
[0.9, -0.4, 0.7]
```

could be much farther away.

A similarity/distance metric lets us determine which vectors are closest.

`pgvector` supports distance operators including:

```text
<->   Euclidean distance
<#>   negative inner product
<=>   cosine distance
```

Supabase documents these operators for vector similarity queries.

---

# 28. What is Semantic Search?

Semantic search means:

> **Search based on meaning rather than only exact keywords.**

Example.

User searches:

```text
"How can I make the text larger?"
```

A semantic search system could find:

```text
"How to adjust font size in settings"
```

even though the exact words aren't identical.

Supabase documents semantic search as an embedding-based search approach.

---

# 29. Keyword Search

Traditional keyword search looks for matching words.

Example:

```text
Query:
"binary search"
```

The system searches for matching terms.

This is useful but can miss semantically related information.

---

# 30. Hybrid Search

Hybrid search combines:

```text
Keyword Search
+
Semantic Search
```

This can provide the benefits of both approaches.

Supabase's AI/vector documentation explicitly describes semantic, keyword, and hybrid search options.

---

# 31. What is RAG?

RAG stands for:

> **Retrieval-Augmented Generation**

Without RAG:

```text
Question
   ↓
LLM
   ↓
Answer
```

With RAG:

```text
Question
   ↓
Search Knowledge Base
   ↓
Retrieve Relevant Information
   ↓
LLM
   ↓
Answer
```

Example:

```text
Question:
"What is my college attendance policy?"

       ↓

Search college documents

       ↓

Retrieve relevant section

       ↓

AI model

       ↓

Answer
```

`pgvector` can be used to store embeddings for retrieval systems such as RAG.

---

# 32. RAG Architecture

A typical RAG system can look like:

```text
Documents
    ↓
Chunking
    ↓
Embeddings
    ↓
pgvector
    ↓
User Question
    ↓
Query Embedding
    ↓
Similarity Search
    ↓
Relevant Documents
    ↓
LLM
    ↓
Final Answer
```

This is important AI engineering knowledge.

However:

> **I did not build a full RAG system today.**

It is an advanced extension of today's concepts.

---

# 33. Automatic Embeddings

Supabase also documents architectures for automatically generating embeddings as database content changes.

These architectures can involve:

```text
Postgres
+
pgvector
+
Queues
+
Edge Functions
+
Scheduled jobs
```

This allows embeddings to be generated asynchronously rather than manually for every record.

This is an advanced production concept and was outside the scope of today's tiny backend.

---

# 34. Why Queues Matter

Imagine:

```text
100,000 documents
```

Generating embeddings for all of them in one request would be inefficient.

A queue-based system can instead do:

```text
Documents
   ↓
Queue
   ↓
Workers
   ↓
Embedding generation
   ↓
Database
```

This is a production-scale pattern.

---

# 35. Today's Actual Project

## Tiny AI Backend

The goal was intentionally simple.

The backend should expose an endpoint such as:

```text
POST /ask-ai
```

The client sends:

```json
{
  "prompt": "Explain recursion simply"
}
```

The backend processes it and returns:

```json
{
  "answer": "Recursion is..."
}
```

---

# 36. Project Architecture

```text
                 CLIENT
                   │
                   │ POST
                   ▼
          /functions/v1/ask-ai
                   │
                   ▼
          SUPABASE EDGE FUNCTION
                   │
            ┌──────┴──────┐
            │             │
            ▼             ▼
       Validation      AI Inference
                          │
                          ▼
                       Model
                          │
                          ▼
                     AI Response
                          │
                          ▼
                   JSON Response
                          │
                          ▼
                       CLIENT
```

---

# 37. Request Flow

The complete request lifecycle is:

```text
1. User enters a prompt

        ↓

2. Client sends POST request

        ↓

3. Edge Function receives request

        ↓

4. Function parses JSON

        ↓

5. Function validates prompt

        ↓

6. Function calls AI

        ↓

7. AI generates response

        ↓

8. Function returns JSON

        ↓

9. Client displays answer
```

This is the most important practical flow from Day 13.

---

# 38. Request Example

```http
POST /functions/v1/ask-ai
Content-Type: application/json
```

Body:

```json
{
  "prompt": "Explain binary search to a beginner."
}
```

---

# 39. Response Example

```json
{
  "answer": "Binary search is an algorithm..."
}
```

The exact output depends on the model and prompt.

---

# 40. Input Validation

A backend should never blindly trust input.

For example:

```text
if prompt is missing
    return error

if prompt isn't a string
    return error

if prompt is empty
    return error

if prompt is too long
    return error

otherwise
    call AI
```

This protects the API from invalid requests.

---

# 41. Error Handling

A good AI backend should handle failures.

Potential failures include:

```text
Missing prompt
Invalid JSON
AI failure
Timeout
Rate limit
Authentication failure
Invalid API credentials
Unexpected model response
```

Instead of crashing, the backend should return a structured error.

Example:

```json
{
  "error": "Prompt is required"
}
```

---

# 42. CORS

If a browser-based frontend calls your Edge Function from another origin, Cross-Origin Resource Sharing (**CORS**) may need to be configured.

Conceptually:

```text
Frontend
   │
   │ Browser request
   ▼
Different origin
   │
   ▼
Edge Function
```

The backend needs appropriate CORS headers.

Supabase's Edge Function documentation specifically notes that functions invoked from an app should handle CORS correctly.

---

# 43. Local Development

Supabase provides a CLI workflow for developing Edge Functions locally.

The documented flow is approximately:

```text
supabase init
        ↓
supabase functions new ask-ai
        ↓
supabase functions serve ask-ai
        ↓
Test locally
        ↓
supabase functions deploy ask-ai
```

Supabase notes that local Edge Function development uses Docker or a compatible runtime.

---

# 44. Deployment

After development, the function can be deployed.

Conceptually:

```text
Local Function
      ↓
Supabase CLI
      ↓
Supabase Project
      ↓
Global Edge Network
```

Supabase documents:

```bash
supabase functions deploy ask-ai
```

for deploying a function.

---

# 45. Dashboard Alternative

Supabase also allows Edge Functions to be created and deployed directly through the Dashboard.

The Dashboard provides an editor and testing interface.

For today's learning, this is useful to know:

```text
CLI
or
Dashboard
```

can be used to work with Edge Functions.

---

# 46. CLI vs Dashboard

| CLI | Dashboard |
|---|---|
| Terminal-based | Browser-based |
| Better for Git workflows | Easier for quick testing |
| Local development | Direct editing |
| Better for repeatable development | Convenient prototype workflow |
| Works with local project files | No built-in version control for dashboard edits |

Supabase currently recommends the Dashboard editor mainly for quick testing/prototyping because its editor does not provide version control or rollbacks.

---

# 47. What I Built

The Day 13 build is intentionally small:

```text
Tiny AI Backend
```

Its responsibility is simply:

```text
Receive prompt
      ↓
Call AI
      ↓
Return answer
```

It is not intended to be a full production AI platform.

---

# 48. What I Did NOT Build

I intentionally did not turn today's project into:

- Full ChatGPT clone
- Multi-agent system
- Full RAG application
- Document ingestion system
- Vector database application
- Authentication-heavy SaaS
- Streaming chat application
- Complex frontend
- MCP system

These are future projects.

The goal today was to understand the **minimum architecture required to expose AI through a backend API.**

---

# 49. Supabase vs Express

I already have experience with Node.js and Express, so this comparison helped connect today's concepts to previous knowledge.

| Express | Supabase Edge Functions |
|---|---|
| Node.js ecosystem | Deno-compatible runtime |
| I manage server application | Supabase manages infrastructure |
| Express routes | Edge Function endpoints |
| Custom deployment | Supabase deployment |
| Database must be configured separately | PostgreSQL included |
| Auth must be added separately | Supabase Auth available |
| AI integration is custom | Supabase AI/integrations available |

This does not mean Supabase replaces Express in every project.

It is another backend architecture.

---

# 50. Supabase vs OpenRouter

These are also very different.

## OpenRouter

Primarily:

```text
AI Model Routing / API Access
```

It can provide access to different AI models through an API.

## Supabase

Primarily:

```text
Backend Infrastructure
+
Database
+
Auth
+
Storage
+
Edge Functions
+
AI/Vector Tooling
```

They can even be used together:

```text
Frontend
   ↓
Supabase Edge Function
   ↓
OpenRouter
   ↓
AI Model
```

---

# 51. Supabase + AI Coding Agents

Another connection to my previous days is AI coding agents.

I have already explored:

```text
Claude Code
Gemini CLI
OpenCode
```

These tools help me **write and operate code**.

Supabase provides the backend infrastructure that my code can interact with.

So:

```text
AI Coding Agent
        ↓
writes / modifies
        ↓
Supabase Project
        ↓
Backend + Database + AI
```

Supabase also documents AI-tool/MCP integrations for coding workflows.

---

# 52. Complete AI Application Architecture

Today's concepts can be combined into a larger architecture:

```text
                         USER
                           │
                           ▼
                       FRONTEND
                           │
                           ▼
                         API
                           │
                           ▼
                  SUPABASE EDGE FUNCTION
                           │
             ┌─────────────┼──────────────┐
             │             │              │
             ▼             ▼              ▼
            AUTH        POSTGRES        AI MODEL
             │             │              │
             │             ▼              │
             │         pgvector           │
             │             │              │
             │             ▼              │
             │       Vector Search        │
             │             │              │
             └─────────────┼──────────────┘
                           ▼
                         RAG
                           │
                           ▼
                         OUTPUT
```

This is the bigger picture behind today's learning.

---

# 53. What Surprised Me

The biggest surprise from today's exploration was how quickly a backend can become an AI backend.

The basic architecture is actually simple:

```text
Request
  ↓
Edge Function
  ↓
AI
  ↓
Response
```

But around that simple flow, production applications can add:

```text
Authentication
Authorization
Database
RLS
Embeddings
Vector Search
RAG
Storage
Queues
Monitoring
Rate Limiting
```

This showed me that building AI applications is not only about understanding models.

It is also about understanding **software engineering and backend architecture**.

---

# 54. Biggest Lesson

The biggest lesson from Day 13 is:

> **An AI model is only one component of an AI application.**

A real AI system often needs:

```text
Model
+
Backend
+
Database
+
API
+
Security
+
Data
+
Deployment
```

This is the beginning of thinking like an **AI Engineer** instead of only an AI model user.

---

# 55. Model → Backend → Application

My learning progression now looks like:

```text
AI Models
    ↓
Model Capabilities
    ↓
Model Selection
    ↓
Backend Integration
    ↓
AI Application
```

Previous days taught me about models.

Day 13 teaches me how those models become part of software.

---

# 56. Day 13 vs Previous Days

| Day | Focus | Main Lesson |
|---|---|---|
| Day 7 | Gemma | General model exploration |
| Day 8 | Qwen | Coding |
| Day 9 | DeepSeek | Reasoning |
| Day 10 | Mistral | Writing |
| Day 11 | Llama | Long context |
| Day 12 | Phi | Small models |
| **Day 13** | **Supabase AI** | **AI backend development** |

This is an important progression.

---

# 57. Important Concepts Learned

### Supabase

Backend platform built around PostgreSQL.

### PostgreSQL

Relational database used by Supabase.

### Edge Function

Server-side TypeScript function running in Supabase's Edge Runtime.

### API

Interface used by applications to communicate with the backend.

### AI Inference

Using a model to produce an output from an input.

### Secret

Sensitive credential stored outside source code.

### Authentication

Determining who the user is.

### Authorization

Determining what the user is allowed to access.

### RLS

Database-level row access policies.

### Embedding

Numerical representation of semantic information.

### pgvector

PostgreSQL extension for vector storage and similarity search.

### Semantic Search

Search based on meaning.

### RAG

Retrieval-Augmented Generation.

---

# 58. Day 13 Checklist

## Understanding

- [x] What is Supabase?
- [x] What is BaaS?
- [x] What is PostgreSQL?
- [x] What is an API?
- [x] What is an Edge Function?
- [x] What is Deno?
- [x] What is Supabase AI?
- [x] What is AI inference?
- [x] What are secrets?
- [x] What is authentication?
- [x] What is authorization?
- [x] What is RLS?
- [x] What are embeddings?
- [x] What is `pgvector`?
- [x] What is vector similarity?
- [x] What is semantic search?
- [x] What is hybrid search?
- [x] What is RAG?
- [x] How does an AI backend work?

## Building

- [x] Create tiny AI backend
- [x] Create Edge Function
- [x] Accept JSON input
- [x] Validate input
- [x] Call AI
- [x] Return JSON
- [x] Test successful request
- [x] Test invalid request
- [x] Keep secrets out of source code

---

# 59. What I Would Build Next

The tiny backend is only the beginning.

Possible future projects:

### Level 1

```text
Tiny AI API
```

### Level 2

```text
AI Chat + Database
```

### Level 3

```text
Authenticated AI Chat
```

### Level 4

```text
Document Upload
+
Embeddings
+
pgvector
```

### Level 5

```text
Full RAG Application
```

### Level 6

```text
AI Agent
+
Tools
+
Memory
+
RAG
```

This provides a natural progression from today's project.

---

# 60. Future Production Architecture

A mature AI application could eventually look like:

```text
                       USER
                         │
                         ▼
                     FRONTEND
                         │
                         ▼
                     API LAYER
                         │
                         ▼
                SUPABASE EDGE FUNCTION
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
       ▼                 ▼                 ▼
      AUTH           POSTGRES            AI
       │                 │                 │
       │                 ▼                 │
       │              pgvector             │
       │                 │                 │
       │                 ▼                 │
       │           SEMANTIC SEARCH         │
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ▼
                        RAG
                         │
                         ▼
                     AI MODEL
                         │
                         ▼
                      RESPONSE
```

This is the bigger system I now understand conceptually.

---

# 61. Final Takeaways

The most important lessons from Day 13 are:

### 1. AI models are only one component.

```text
Model ≠ Application
```

### 2. Backend infrastructure matters.

An AI product needs APIs, data, security, and deployment.

### 3. Edge Functions provide a convenient serverless backend layer.

They can expose APIs and orchestrate AI calls.

### 4. Supabase combines backend and database capabilities.

PostgreSQL, Auth, Storage, Edge Functions, and AI/vector tooling can work together.

### 5. Embeddings unlock semantic AI applications.

They enable similarity search and retrieval.

### 6. `pgvector` brings vector search into PostgreSQL.

This is useful for semantic search and RAG.

### 7. Security is part of AI engineering.

API keys and other sensitive credentials must remain server-side.

### 8. Start small.

A tiny working AI API teaches more than an unfinished giant AI project.

---

# Conclusion

Day 13 was a major transition in my AI Engineering roadmap.

Previously, I focused heavily on understanding and comparing AI models:

```text
Gemma
Qwen
DeepSeek
Mistral
Llama
Phi
```

Today I moved one level higher:

```text
AI Model
   ↓
Backend
   ↓
API
   ↓
Application
```

I learned how **Supabase** can provide the backend infrastructure around an AI application, how **Edge Functions** can expose server-side APIs, how AI inference can be integrated into those functions, and how PostgreSQL and `pgvector` can eventually support semantic search and RAG systems.

The most important mindset shift from today is:

> **Don't just learn how to use AI. Learn how to build software around AI.**

That is the core lesson of Day 13.