# Day 14 — Vercel AI SDK & Tiny AI Chatbot

## 🚀 Overview

Day 14 marks an important transition in my AI Engineering roadmap.

In the previous days, I focused heavily on understanding and comparing individual AI models:

- Gemma
- Qwen
- DeepSeek
- Mistral
- Llama
- Phi

Then I moved into backend AI development with **Supabase**.

Today, I move one layer higher:

> **How do I actually build a modern AI-powered application around those models?**

Today's focus:

```text
Experiment
    ↓
Vercel AI SDK
    ↓
Understand AI application architecture
    ↓
Understand model/provider abstraction
    ↓
Understand streaming
    ↓
Understand chatbot UI
    ↓
Build
    ↓
Tiny AI Chatbot
```

The **Vercel AI SDK** is a TypeScript toolkit for building AI-powered applications across frameworks such as Next.js, Vue, Svelte, and Node.js. It abstracts many provider-specific differences and provides primitives for text generation, streaming, chat interfaces, tools, and other AI application features.

---

# 🎯 Today's Goal

The goal of Day 14 was **not** to build a full ChatGPT clone.

The goal was to understand the AI application stack and build one small working chatbot.

The final architecture should look approximately like:

```text
                         USER
                           │
                           ▼
                     CHAT INTERFACE
                           │
                           ▼
                        useChat()
                           │
                           ▼
                       /api/chat
                           │
                           ▼
                      streamText()
                           │
                           ▼
                    AI PROVIDER
                           │
                           ▼
                       AI MODEL
                           │
                           ▼
                  STREAMING RESPONSE
                           │
                           ▼
                        useChat()
                           │
                           ▼
                         UI
```

The current AI SDK documentation specifically describes `useChat()` as a chatbot UI abstraction and `streamText()` as the core primitive for streaming model output.

---

# 1. What Is an SDK?

SDK means:

> **Software Development Kit**

An SDK is a collection of developer tools, libraries, abstractions, types, and utilities designed to make it easier to build applications using a particular service, platform, or technology.

Without an SDK, developers may need to manually handle:

```text
HTTP requests
Authentication
Headers
Request formatting
Response parsing
Streaming
Error handling
Type definitions
Provider-specific differences
```

An SDK provides higher-level functions and abstractions to reduce this work.

---

# 2. API vs SDK

These two concepts should not be confused.

## API

API stands for:

> Application Programming Interface

An API defines how software communicates with another service.

Example:

```text
Your Application
       ↓
HTTP Request
       ↓
AI API
       ↓
AI Model
```

An API defines things such as:

- endpoints
- request format
- authentication
- response format
- errors
- supported operations

---

## SDK

An SDK provides developer-friendly tools for using an API or platform.

Conceptually:

```text
Your Application
       ↓
SDK
       ↓
API
       ↓
Service
```

Therefore:

```text
API
=
communication interface

SDK
=
developer toolkit
```

---

# 3. What Is the Vercel AI SDK?

The **Vercel AI SDK** is a TypeScript toolkit for building AI-powered applications.

Vercel describes it as a toolkit designed to help developers build AI applications while abstracting differences between model providers and reducing boilerplate for features such as chatbots and streaming.

Its purpose is not to be an AI model.

Instead:

```text
AI Model
=
the intelligence

AI SDK
=
the developer toolkit used to build applications around that intelligence
```

---

# 4. AI SDK ≠ AI Model

This distinction is extremely important.

Models include:

```text
GPT
Claude
Gemini
Qwen
DeepSeek
Mistral
Llama
Phi
Gemma
```

The AI SDK is not one of these models.

Instead:

```text
Your Application
       ↓
AI SDK
       ↓
Provider
       ↓
Model
```

---

# 5. Why Does the AI SDK Exist?

Integrating AI directly into applications can become complicated.

Different providers can have different:

- APIs
- request formats
- response formats
- streaming protocols
- authentication methods
- tool implementations
- model capabilities

The AI SDK provides a common development layer.

Conceptually:

```text
                    AI SDK
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       OpenAI      Anthropic     Google
          │           │           │
          ▼           ▼           ▼
         GPT         Claude      Gemini
```

The current Vercel documentation explicitly positions provider abstraction as one of the major benefits of the SDK.

---

# 6. What Problem Does This Solve?

Without an abstraction layer:

```text
Application
   ├── OpenAI integration
   ├── Anthropic integration
   ├── Google integration
   ├── Mistral integration
   └── Other integrations
```

With an AI SDK abstraction:

```text
Application
     ↓
  AI SDK
     ↓
 Provider
     ↓
  Model
```

This can make experimentation and provider/model switching easier.

---

# 7. OpenRouter vs Vercel AI SDK

This was one of the most important concepts from today's learning.

They are **not the same thing**.

## OpenRouter

OpenRouter provides a unified API for accessing hundreds of AI models through a single endpoint and also provides provider routing and fallback capabilities.

Mental model:

```text
Your Application
       ↓
   OpenRouter
       ↓
Many models/providers
```

Its primary problem is:

> **How can my application access many AI models/providers through a unified interface?**

---

## Vercel AI SDK

AI SDK is a TypeScript toolkit for building AI applications.

Mental model:

```text
Your Application
       ↓
     AI SDK
       ↓
Provider / Gateway
       ↓
     Model
```

Its primary problem is:

> **How can I build AI functionality such as chat, streaming, structured generation, and tool usage into my application?**

---

# 8. OpenRouter + AI SDK

They can work together.

For example:

```text
Next.js
   ↓
AI SDK
   ↓
OpenRouter
   ↓
Qwen / Claude / Gemini / GPT / etc.
```

This is an important distinction:

```text
OpenRouter
=
model access / routing layer

AI SDK
=
AI application development layer
```

---

# 9. OpenRouter SDK vs Vercel AI SDK

OpenRouter also provides its own SDK.

Its current documentation describes the OpenRouter Client SDK as a thin, type-safe layer over the OpenRouter REST API.

Therefore:

```text
OpenRouter SDK
=
easier way to call OpenRouter
```

while:

```text
Vercel AI SDK
=
higher-level toolkit for building AI applications
```

They solve different problems.

---

# 10. API vs SDK vs Provider vs Model

| Concept | Meaning |
|---|---|
| **API** | Interface through which software communicates |
| **SDK** | Developer toolkit that simplifies integration |
| **Provider** | Service that serves/hosts model access |
| **Model** | Actual AI model generating or processing output |
| **Router/Gateway** | Layer that provides/routs access to models/providers |
| **Application** | The actual product being built |

Example:

```text
Your Chatbot
     ↓
Vercel AI SDK
     ↓
OpenRouter
     ↓
Provider
     ↓
Qwen
```

---

# 11. AI SDK Core

AI SDK has a core layer for model interaction.

Important primitives include:

```text
generateText()
streamText()
```

The AI SDK documentation describes AI SDK Core as providing a unified API for interacting with language models.

---

# 12. `generateText()`

`generateText()` is used when we want a generated result.

Conceptually:

```text
Request
   ↓
Model
   ↓
Wait
   ↓
Complete response
```

Example:

```ts
const result = await generateText({
  model,
  prompt: "Explain binary search."
});
```

The resulting text can then be used by the application.

---

# 13. `streamText()`

`streamText()` is particularly important for today's chatbot.

It streams generated text progressively instead of making the application wait for the complete response.

The current AI SDK documentation explicitly describes `streamText()` as suitable for interactive applications such as chatbots and other real-time use cases.

Conceptually:

```text
Model
  ↓
Chunk 1
  ↓
Chunk 2
  ↓
Chunk 3
  ↓
Chunk 4
  ↓
...
```

Instead of:

```text
Model
  ↓
WAIT
  ↓
FULL RESPONSE
```

---

# 14. Why Streaming Matters

Without streaming:

```text
User
 ↓
[Waiting.............]
 ↓
Complete response
```

With streaming:

```text
User
 ↓
"The"
 ↓
"The answer"
 ↓
"The answer is"
 ↓
"The answer is..."
```

This makes an AI application feel much more responsive.

---

# 15. AI SDK UI

The AI SDK also provides UI-focused functionality.

This is where:

```text
useChat()
```

becomes important.

The current AI SDK documentation describes `useChat()` as a hook for building conversational interfaces, managing chat state, and receiving streamed messages.

---

# 16. What Is `useChat()`?

`useChat()` is a frontend abstraction for building chat interfaces.

It helps with things such as:

```text
messages
chat state
sending messages
streaming responses
status
errors
```

Current AI SDK documentation lists statuses including:

```text
submitted
streaming
ready
error
```

which can be used to control chatbot UI behavior.

---

# 17. Current `useChat()` Architecture

One important lesson from today's research is that older tutorials may show outdated AI SDK APIs.

The current `useChat()` architecture uses a **transport-based architecture**.

The current default transport communicates with:

```text
/api/chat
```

and the current API no longer manages input state internally in the same way older versions did.

Therefore:

> **Always check the current AI SDK documentation before copying old tutorials.**

---

# 18. Chat Transport

The transport defines how the frontend communicates with the backend.

Conceptually:

```text
useChat()
    ↓
Transport
    ↓
HTTP
    ↓
/api/chat
```

The current default transport uses `/api/chat`.

---

# 19. Chat Messages

A chatbot conversation consists of messages.

Conceptually:

```json
[
  {
    "role": "user",
    "content": "Hello"
  },
  {
    "role": "assistant",
    "content": "Hi!"
  }
]
```

Common roles include:

```text
system
user
assistant
```

The current AI SDK UI uses `UIMessage` objects with message parts for rendering richer content.

---

# 20. Message Parts

Current AI SDK UI recommends rendering messages using their `parts` property rather than assuming every message is just plain text.

Parts can represent different kinds of content, including:

```text
text
tool calls
tool results
```

This makes the UI architecture more flexible for advanced AI applications.

---

# 21. Conversation History

A chatbot needs context.

Example:

```text
User:
My name is Pranav.

Assistant:
Nice to meet you.

User:
What is my name?
```

The application needs to preserve relevant conversation context for the model.

Therefore:

```text
Current message
+
Previous messages
=
Conversation context
```

---

# 22. System Instructions

A chatbot can also have instructions that define its behavior.

Example:

```text
You are a helpful programming tutor.
Explain concepts simply.
Use practical examples.
```

Then:

```text
User:
Explain recursion.
```

The model generates its answer according to the system instructions.

---

# 23. Provider

A provider is the service through which a model is made available.

Conceptually:

```text
Provider
    ↓
Model
```

Examples include:

```text
OpenAI
Anthropic
Google
Mistral
```

---

# 24. Model

A model is the actual AI system.

Examples:

```text
GPT
Claude
Gemini
Qwen
DeepSeek
Mistral
Llama
```

So:

```text
Provider
   ↓
Model
```

---

# 25. AI SDK Provider Abstraction

The AI SDK tries to provide a consistent application interface across providers.

Conceptually:

```text
             AI SDK
                │
        ┌───────┼────────┐
        ▼       ▼        ▼
      OpenAI  Google   Anthropic
        │       │        │
        ▼       ▼        ▼
       GPT    Gemini   Claude
```

The goal is to reduce provider-specific application code.

---

# 26. Vercel AI Gateway

The current Vercel ecosystem also includes **AI Gateway**.

This should not be confused with AI SDK.

Conceptually:

```text
Application
    ↓
AI SDK
    ↓
AI Gateway
    ↓
Models / Providers
```

AI Gateway focuses on model access, routing, and provider flexibility.

AI SDK focuses on application development.

---

# 27. AI SDK vs AI Gateway

```text
AI SDK
=
Build AI applications

AI Gateway
=
Access / route across models and providers
```

Together:

```text
Your App
   ↓
AI SDK
   ↓
AI Gateway
   ↓
Model
```

---

# 28. Tiny Chatbot Architecture

The project built today is intentionally small.

Recommended architecture:

```text
tiny-chatbot/
│
├── app/
│   ├── page.tsx
│   └── api/
│       └── chat/
│           └── route.ts
│
├── package.json
├── tsconfig.json
├── .env.local
└── .gitignore
```

The exact generated files can vary depending on the current Next.js starter.

---

# 29. Frontend

The frontend contains:

```text
Chat window
Input
Send button
Messages
Status
```

Conceptually:

```text
┌───────────────────────────────┐
│        Tiny AI Chat           │
├───────────────────────────────┤
│                               │
│ User: Explain recursion       │
│                               │
│ AI: Recursion is...           │
│     ...streaming...           │
│                               │
├───────────────────────────────┤
│ Ask something...       Send   │
└───────────────────────────────┘
```

---

# 30. Backend

The backend endpoint is:

```text
/api/chat
```

Its job is approximately:

```text
Receive messages
      ↓
Convert/process messages
      ↓
Call streamText()
      ↓
AI model
      ↓
Return streaming response
```

The current official chatbot documentation demonstrates this general `useChat()` + server-side `streamText()` architecture.

---

# 31. Complete Request Flow

Memorize this:

```text
                         USER
                           │
                           ▼
                      CHAT UI
                           │
                           ▼
                       useChat()
                           │
                           ▼
                        /api/chat
                           │
                           ▼
                       streamText()
                           │
                           ▼
                       PROVIDER
                           │
                           ▼
                         MODEL
                           │
                           ▼
                  STREAMING RESPONSE
                           │
                           ▼
                       useChat()
                           │
                           ▼
                          UI
```

🔥 This is the main architecture of Day 14.

---

# 32. What Happens When I Send a Message?

Suppose the user enters:

```text
Explain binary search.
```

The flow is:

```text
1. User enters prompt

        ↓

2. Chat UI sends message

        ↓

3. useChat() sends request

        ↓

4. /api/chat receives request

        ↓

5. Backend calls streamText()

        ↓

6. Model generates response

        ↓

7. Response streams back

        ↓

8. UI updates progressively

        ↓

9. User sees final response
```

---

# 33. Streaming Example

Imagine the model generates:

```text
Binary search is an algorithm
that works on sorted arrays...
```

The UI may receive chunks progressively:

```text
"Binary"
" search"
" is"
" an"
" algorithm"
...
```

The user sees the response being constructed.

---

# 34. Chatbot State

The chatbot needs to know its current state.

The current AI SDK `useChat()` API exposes statuses such as:

```text
ready
submitted
streaming
error
```

These can control the interface.

For example:

```text
submitted
→ show "Thinking..."

streaming
→ show generated response

ready
→ enable Send

error
→ show error message
```

---

# 35. Error Handling

A real chatbot needs to handle failures.

Possible failures:

```text
Invalid API key
Provider failure
Network failure
Rate limit
Invalid request
Model unavailable
Server error
```

The application should fail gracefully.

Example:

```text
⚠️ Something went wrong.
Please try again.
```

---

# 36. Environment Variables

AI credentials should not be hardcoded.

Bad:

```ts
const API_KEY = "secret-key";
```

Good:

```text
.env.local
```

with:

```text
AI_PROVIDER_API_KEY=...
```

The server reads the secret.

---

# 37. Why Secrets Must Stay Server-Side

Bad:

```text
Browser
   ↓
API Key
   ↓
AI Provider
```

Better:

```text
Browser
   ↓
Your Backend
   ↓
Secret API Key
   ↓
AI Provider
```

Never commit real API keys to GitHub.

---

# 38. `.gitignore`

The project should ignore secret files such as:

```text
.env.local
.env
```

An example configuration can be documented safely in:

```text
.env.example
```

without exposing the actual key.

---

# 39. Why `.env.example`?

It communicates required configuration without revealing secrets.

Example:

```text
AI_PROVIDER_API_KEY=
```

Actual local file:

```text
AI_PROVIDER_API_KEY=actual-secret
```

Only the placeholder version belongs in Git.

---

# 40. AI SDK and OpenRouter Together

One possible Day 14 architecture is:

```text
Next.js
   ↓
AI SDK
   ↓
OpenRouter
   ↓
Selected Model
```

This is useful because:

```text
AI SDK
→ handles application-level AI functionality

OpenRouter
→ provides access to many models
```

OpenRouter's current documentation explicitly supports using third-party SDKs and its own SDK, and its API is designed around a unified model-access layer.

---

# 41. Model Switching Experiment

One of today's best experiments is switching the model while keeping the application architecture the same.

For example:

```text
Model A
   ↓
Chatbot
```

then:

```text
Model B
   ↓
Same chatbot
```

The goal is to observe:

```text
Response quality
Speed
Cost
Reasoning
Coding ability
Streaming behavior
```

OpenRouter's documentation similarly demonstrates that changing the model identifier can switch between available models while retaining the same basic application structure.

---

# 42. What Should Be Compared?

For each model, record:

| Category | Observation |
|---|---|
| Response quality | How useful was the answer? |
| Speed | How quickly did output begin? |
| Streaming | Was output smooth? |
| Coding | How good was generated code? |
| Reasoning | How accurate was the explanation? |
| Context | Did follow-ups work? |
| Cost | What was the token/model cost? |
| Reliability | Did requests succeed consistently? |

---

# 43. Test Prompts

### Test 1 — Basic

```text
Hello, explain what you can do.
```

### Test 2 — Coding

```text
Write a C++ binary search function.
```

### Test 3 — Explanation

```text
Explain recursion to a beginner.
```

### Test 4 — Long response

```text
Explain linked lists in detail.
```

### Test 5 — Follow-up

```text
Give me a practical example.
```

### Test 6 — Context

```text
What was the previous topic we discussed?
```

These tests help evaluate both the model and the application.

---

# 44. `generateText()` vs `streamText()`

| Feature | `generateText()` | `streamText()` |
|---|---|---|
| Complete response | ✅ | Eventually |
| Progressive output | ❌ | ✅ |
| Simple generation | ✅ | ✅ |
| Chat UX | Possible | Excellent |
| Real-time experience | ❌ | ✅ |
| Today's chatbot | Not primary | **Recommended** |

The current documentation specifically recommends `streamText()` for interactive use cases such as chatbots.

---

# 45. `useChat()` vs Manual `fetch()`

Without AI SDK UI, I would have to manually implement:

```text
fetch()
stream handling
message state
UI updates
loading state
error state
conversation state
```

With `useChat()`:

```text
useChat()
```

provides a higher-level abstraction for chat state and streamed responses.

This is one of the main benefits of an AI application SDK.

---

# 46. Why AI SDK Is Useful

The SDK allows me to focus more on:

```text
Product
UX
Application logic
AI behavior
```

instead of spending all my time implementing:

```text
Provider-specific API calls
Streaming plumbing
Chat state
Message parsing
```

Vercel's own documentation highlights reduced boilerplate and abstraction of provider differences as key benefits.

---

# 47. Tools

AI SDK also supports tool usage in chatbot applications.

Conceptually:

```text
User
 ↓
AI
 ↓
Tool
 ↓
Tool Result
 ↓
AI
 ↓
Final Answer
```

Example:

```text
User:
What's the weather?

AI
 ↓
Weather Tool
 ↓
Weather API
 ↓
Result
 ↓
AI
 ↓
Answer
```

The current AI SDK chatbot documentation describes server-side, client-side, and user-interaction tool patterns.

---

# 48. Why Tools Matter

Tools are the foundation for more advanced AI agents.

Instead of only:

```text
User → Model → Answer
```

we can have:

```text
User
 ↓
Model
 ↓
Tool
 ↓
External system
 ↓
Result
 ↓
Model
 ↓
Answer
```

This connects today's learning to future agent development.

---

# 49. Structured Output

AI applications often need machine-readable output.

Instead of:

```text
The laptop costs approximately ₹50,000...
```

we may want:

```json
{
  "name": "Laptop",
  "price": 50000,
  "category": "electronics"
}
```

Structured generation is another important AI SDK capability.

This becomes useful when AI output needs to feed directly into application logic.

---

# 50. AI SDK and Agents

The AI SDK ecosystem now extends beyond simple chat applications into agent development.

Current Vercel material describes capabilities around:

```text
tool calls
reasoning
agent loops
MCP
approvals
durable workflows
```

AI SDK 7, released in June 2026, expanded the framework substantially toward production agent development.

But:

> **I did not build an agent today.**

Today's goal remains the tiny chatbot.

---

# 51. Multimodal AI

Modern AI applications can also work with:

```text
Text
Images
Audio
Files
```

depending on the provider/model.

For today's project:

```text
Text-only chatbot
```

is enough.

---

# 52. Context Window

Every conversation uses model context.

Conceptually:

```text
System instructions
+
Previous messages
+
Current message
=
Model context
```

As the conversation becomes longer, more tokens are consumed.

This connects directly to the long-context experiments from Day 11.

---

# 53. Token Usage

A chatbot can consume tokens from:

```text
System prompt
+
Conversation history
+
Current user message
+
AI response
```

Therefore:

```text
Longer conversation
→ more context
→ more tokens
→ potentially higher cost
```

This becomes important when building production chatbots.

---

# 54. Persistent Chat

Today's tiny chatbot does not need a database.

But a production chatbot might store:

```text
User
Conversation
Messages
Timestamp
Model
Usage
Metadata
```

This connects today's AI SDK learning with Day 13's Supabase knowledge.

Future architecture:

```text
AI SDK
   ↓
Backend
   ↓
Supabase
   ├── Auth
   ├── PostgreSQL
   └── Storage
```

---

# 55. Day 13 → Day 14

This is one of the most important connections in the roadmap.

### Day 13

```text
Supabase
   ↓
Backend infrastructure
   ↓
Database
   ↓
Auth
   ↓
Edge Functions
   ↓
AI backend
```

### Day 14

```text
Vercel AI SDK
   ↓
AI application layer
   ↓
Streaming
   ↓
Chat UI
   ↓
Model interaction
```

Together:

```text
                  AI APPLICATION

                    FRONTEND
                       │
                       ▼
                    AI SDK
                       │
                       ▼
                  API / BACKEND
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
          AI MODEL            SUPABASE
                                 │
                         ┌───────┼───────┐
                         ▼       ▼       ▼
                        Auth     DB    Storage
```

---

# 56. Previous Model Days → Day 14

My roadmap now becomes:

```text
Day 7
Gemma
↓
Model exploration

Day 8
Qwen
↓
Coding

Day 9
DeepSeek
↓
Reasoning

Day 10
Mistral
↓
Writing

Day 11
Llama
↓
Long context

Day 12
Phi
↓
Small models

Day 13
Supabase AI
↓
AI backend

Day 14
Vercel AI SDK
↓
AI application
↓
Tiny chatbot
```

This is a major progression.

---

# 57. From "Using AI" to "Building AI Applications"

My learning progression is becoming:

```text
                    AI ENGINEERING

                         │
                         ▼
                 Understand Models
                         │
                         ▼
                  Compare Models
                         │
                         ▼
                Use Model APIs
                         │
                         ▼
                  Build Backend
                         │
                         ▼
                 Build AI Features
                         │
                         ▼
                  Build AI Apps
                         │
                         ▼
                 Build AI Agents
```

Day 14 is the **AI application** step.

---

# 58. What I Built

The practical project is:

> **Tiny AI Chatbot**

Its responsibilities are intentionally limited:

```text
Receive user message
        ↓
Send to backend
        ↓
Call AI model
        ↓
Stream response
        ↓
Display response
```

---

# 59. What I Did NOT Build

I intentionally did not turn this into:

- Full ChatGPT clone
- RAG system
- Vector database
- Multi-agent system
- Voice assistant
- Image chatbot
- MCP system
- Authentication system
- Complex SaaS
- Production analytics platform

Those are future extensions.

The purpose of today's project is to understand the fundamental AI application loop.

---

# 60. Day 14 Experiment

The most useful experiment is:

```text
Same application
+
Same prompt
+
Different model
```

Compare:

```text
Model A
vs
Model B
```

Observe:

```text
Quality
Speed
Streaming
Cost
Coding
Reasoning
Context
Reliability
```

This connects today's application-level experiment with the model benchmarks from Days 7–12.

---

# 61. Questions I Can Now Answer

After Day 14, I should be able to explain:

### What is an SDK?

A developer toolkit that simplifies working with a service or platform.

### What is Vercel AI SDK?

A TypeScript toolkit for building AI applications.

### What is OpenRouter?

A unified AI model access/routing layer.

### Are OpenRouter and AI SDK competitors?

Not directly.

They operate at different layers and can be used together.

### What is `generateText()`?

A primitive for generating complete text output.

### What is `streamText()`?

A primitive for streaming generated output.

### What is `useChat()`?

A UI abstraction for building conversational interfaces.

### What is a provider?

A service through which models are made available.

### What is a model?

The actual AI system generating the response.

### What is streaming?

Receiving generated output progressively instead of waiting for the complete response.

### What is a chatbot?

An application that maintains a conversational interaction between a user and an AI system.

---

# 62. Final Architecture

The complete architecture I learned today:

```text
                           USER
                             │
                             ▼
                       NEXT.JS / UI
                             │
                             ▼
                         useChat()
                             │
                             ▼
                         /api/chat
                             │
                             ▼
                        streamText()
                             │
                             ▼
                      AI SDK PROVIDER
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
                OpenRouter         Direct Provider
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
         GPT      Claude    Gemini
          │
          ▼
      AI RESPONSE
          │
          ▼
      STREAMING DATA
          │
          ▼
        useChat()
          │
          ▼
           UI
```

---

# 63. Security Checklist

Before pushing the project to GitHub:

```text
[ ] No API key inside source code
[ ] .env.local ignored
[ ] .env ignored if used
[ ] No secrets in README
[ ] .env.example contains placeholders only
[ ] API credentials stay server-side
```

---

# 64. Day 14 Checklist

## Concepts

- [x] What is an SDK?
- [x] API vs SDK
- [x] What is Vercel AI SDK?
- [x] AI SDK Core
- [x] AI SDK UI
- [x] `generateText()`
- [x] `streamText()`
- [x] `useChat()`
- [x] Chat transports
- [x] Providers
- [x] Models
- [x] Model/provider abstraction
- [x] Streaming
- [x] Chat state
- [x] Conversation history
- [x] System instructions
- [x] Structured output
- [x] Tool calling
- [x] AI Gateway
- [x] OpenRouter
- [x] OpenRouter SDK
- [x] OpenRouter vs AI SDK
- [x] Environment variables
- [x] Security
- [x] Error handling
- [x] Token/context considerations

## Build

- [x] Create tiny chatbot
- [x] Create frontend
- [x] Create chat API
- [x] Connect AI SDK
- [x] Connect model/provider
- [x] Implement streaming
- [x] Display messages
- [x] Test conversation history
- [x] Test errors
- [x] Test model switching

---

# 65. What Surprised Me

The biggest realization from Day 14 was that building an AI application involves much more than simply calling a model.

The model is only one component:

```text
Model
+
Provider
+
API
+
Backend
+
Streaming
+
UI
+
Conversation State
+
Security
=
AI Application
```

The AI SDK provides abstractions that simplify many of these AI-specific application concerns.

---

# 66. Biggest Lesson

> **The AI model is not the application.**

A model can generate text, but an AI product needs an entire software system around it.

The application must handle:

```text
User input
↓
API
↓
Model
↓
Streaming
↓
State
↓
UI
↓
Errors
↓
Security
```

That is the real beginning of AI Engineering.

---

# 67. Most Important Mental Model

If I remember only one architecture from Day 14, it is:

```text
              AI APPLICATION

                  USER
                    ↓
                FRONTEND
                    ↓
                 AI SDK
                    ↓
                BACKEND
                    ↓
              AI PROVIDER
                    ↓
                 MODEL
                    ↓
               RESPONSE
                    ↓
                STREAM
                    ↓
                FRONTEND
```

And if OpenRouter is used:

```text
Frontend
   ↓
AI SDK
   ↓
OpenRouter
   ↓
Provider
   ↓
Model
```

---

# 68. Final Takeaways

### 1. SDK

```text
Software Development Kit
```

A developer toolkit.

### 2. AI SDK

A toolkit specifically designed to make building AI-powered applications easier.

### 3. OpenRouter

A unified model access/routing layer.

### 4. AI SDK + OpenRouter

They can work together.

```text
AI SDK
   ↓
OpenRouter
   ↓
Model
```

### 5. `generateText()`

Generate a complete result.

### 6. `streamText()`

Stream generated output progressively.

### 7. `useChat()`

Build conversational UI and manage chat state/streamed messages.

### 8. Provider

Service through which model access is provided.

### 9. Model

The actual AI system.

### 10. Streaming

A better real-time experience for AI applications.

---

# 🧠 Final Conclusion

Day 14 was about moving from **AI model experimentation** to **AI application development**.

The previous model experiments taught me:

```text
Which models exist?
What are their strengths?
How do they compare?
```

Day 13 taught me:

```text
How can AI be integrated into a backend?
```

Day 14 taught me:

```text
How can I build a user-facing AI application?
```

The final progression is:

```text
              MODEL
                ↓
             PROVIDER
                ↓
               API
                ↓
          AI APPLICATION
                ↓
             AI SDK
                ↓
          CHAT / STREAMING
                ↓
              USER
```

The most important lesson is:

> **Don't just learn how to call AI models. Learn how to build software around them.**

That is what turns model knowledge into AI Engineering.

---

## 🔗 Official References

- Vercel AI SDK documentation: https://vercel.com/docs/ai-sdk
- AI SDK chatbot documentation: https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
- AI SDK `useChat()` reference: https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat
- AI SDK `streamText()` reference: https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text
- OpenRouter Quickstart: https://openrouter.ai/docs/quickstart
- OpenRouter models: https://openrouter.ai/docs/guides/overview/models

The current documentation confirms that AI SDK 7 is the latest major release, while the current chatbot APIs use `useChat()` and streaming primitives such as `streamText()`.