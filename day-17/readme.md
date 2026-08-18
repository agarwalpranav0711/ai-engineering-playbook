# Day 17 — PydanticAI: Building Typed AI Agents

> **Daily AI Engineering Roadmap — Day 17**

## 🚀 Overview

Day 17 focused on **PydanticAI**, a Python framework for building AI agents with strong type safety, structured outputs, validation, tools, dependencies, and reliable integration between probabilistic LLMs and deterministic Python applications.

Today's task was:

```text
Day 17

Experiment
    ↓
PydanticAI

Build
    ↓
Typed AI Agent
```

The main objective was not to build a huge AI application.
The objective was to understand one important engineering pattern deeply:

```
LLM
 ↓
Structured Output
 ↓
Pydantic Schema
 ↓
Validation
 ↓
Typed Python Object
 ↓
Application Logic
```

The practical project for today was a small:
**Typed Student Profile Agent**

## 🎯 Day 17 Objectives

Today's learning objectives were:

- Understand Pydantic
- Understand PydanticAI
- Understand why PydanticAI exists
- Understand AI agents
- Understand models vs agents
- Understand instructions
- Understand instructions vs system_prompt
- Understand structured output
- Understand output_type
- Understand Pydantic BaseModel
- Understand type hints
- Understand validation
- Understand static type checking
- Understand runtime validation
- Understand typed AI agents
- Understand dependencies
- Understand RunContext
- Understand tools
- Understand typed tool parameters
- Understand ModelRetry
- Understand generic agent types
- Understand model/provider separation
- Compare PydanticAI with previously learned technologies
- Build a typed AI agent
- Test structured output
- Understand the limitations of type safety

## 1. What Is Pydantic?

Before understanding PydanticAI, it is important to understand Pydantic.

Pydantic is a Python library used for defining and validating structured data using Python type hints.

Example:

```python
from pydantic import BaseModel


class Student(BaseModel):
    name: str
    age: int
    course: str
```

This defines a structured schema:

```
Student
├── name   → str
├── age    → int
└── course → str
```

The schema tells our application what kind of data it expects.

## 2. What Is a Type?

A type describes what kind of value a variable should contain.

Examples:

```
name: str
age: int
price: float
active: bool
```

Meaning:

```
str   → Text
int   → Whole number
float → Decimal number
bool  → True / False
```

Types are important because normal application code expects predictable data.

## 3. Why Types Matter in AI Applications

LLMs are probabilistic. Their output is not automatically guaranteed to follow the exact structure our application needs.

For example, we might ask an LLM:

> Give me information about a student.

It might return:

> The student is 20 years old and studies Computer Science.

But our application might actually need:

```json
{
  "name": "Pranav",
  "age": 20,
  "course": "Computer Science"
}
```

This is where structured output becomes useful.

## 4. The Problem With Raw LLM Output

Without validation:

```
User
 ↓
LLM
 ↓
Raw Text
 ↓
Application
```

The application has to parse and trust the model output.

Potential problems include:

- Wrong data type
- Missing fields
- Unexpected fields
- Incorrect structure
- Invalid values
- Malformed output

For example:

```json
{
  "name": "Pranav",
  "age": "twenty"
}
```

The application expects `age → int` but receives `age → string`. This can cause errors.

## 5. What Is PydanticAI?

PydanticAI is a Python framework for building AI agents with strong integration between:

```
Python Types
+
Pydantic Validation
+
LLMs
+
Tools
+
Structured Output
+
Dependencies
```

The basic architecture is:

```
User
 ↓
PydanticAI Agent
 ↓
LLM
 ↓
Structured Output
 ↓
Pydantic Validation
 ↓
Typed Python Object
 ↓
Application
```

This is the main concept of Day 17.

## 6. Why Does PydanticAI Exist?

The main problem it addresses is the gap between:

```
LLM
 ↓
Probabilistic Output
```

and:

```
Python Application
 ↓
Deterministic Data
```

PydanticAI helps create a contract between the two.

```
LLM
 ↓
Expected Schema
 ↓
Validation
 ↓
Typed Data
 ↓
Application
```

## 7. The Core Mental Model

The most important mental model for today is:

```
             TYPED AI AGENT

User Input
    ↓
PydanticAI Agent
    ↓
LLM
    ↓
Structured Output
    ↓
Pydantic Validation
    ↓
Typed Python Object
    ↓
Application Logic
```

## 8. What Is an AI Agent in PydanticAI?

An Agent is the main interface used to interact with an LLM through PydanticAI.

Conceptually:

```python
from pydantic_ai import Agent

agent = Agent(...)
```

The agent can contain:

```
Agent
├── Model
├── Instructions
├── Output Type
├── Dependencies
├── Tools
├── Capabilities
└── Model Settings
```

## 9. Model

The model is the actual AI model that generates the response.

```
PydanticAI
    ↓
Agent
    ↓
Model
```

Examples of model families include: GPT, Gemini, Claude, Llama, Qwen, DeepSeek, Mistral.

**Important:**
```
PydanticAI ≠ AI Model
```
PydanticAI is the framework. The model provides the language-generation capability.

## 10. Agent vs Model

```
Agent = The AI application's interface/orchestration layer
Model = The underlying language model
```

```
Application
    ↓
PydanticAI Agent
    ↓
LLM
    ↓
Model
```

## 11. Instructions

Instructions define how the agent should behave.

```python
agent = Agent(
    model,
    instructions="Return concise and accurate answers."
)
```

Think of instructions as:

```
Instructions = Behavior rules
```

They tell the agent what it should do and how it should behave.

## 12. instructions vs system_prompt

PydanticAI provides both concepts.

```
instructions   = Agent instructions
system_prompt  = System prompt behavior with specific message-history semantics
```

For normal usage, `instructions` is the simpler choice. Both influence the agent's behavior, but they have different message/history semantics.

## 13. What Is Structured Output?

Structured output means asking the AI to return data matching a defined schema rather than simply returning arbitrary text.

Without structured output:
```
LLM → Plain Text
```

With structured output:
```
LLM → Schema → Validated Object
```

Example:

```python
class Product(BaseModel):
    name: str
    price: float
    available: bool
```

## 14. Why Structured Output Is Important

Suppose an e-commerce application asks:

> Extract the product information.

Raw response:
> The laptop costs ₹75,000 and is available.

Structured response:

```json
{
  "name": "Laptop",
  "price": 75000,
  "available": true
}
```

Now Python can work directly with the data:

```python
result.output.price
```

This is much easier than manually parsing natural language.

## 15. What Is BaseModel?

BaseModel is the foundation for defining Pydantic models.

```python
from pydantic import BaseModel


class StudentProfile(BaseModel):
    name: str
    age: int
    course: str
    skills: list[str]
```

```
StudentProfile
├── name    → str
├── age     → int
├── course  → str
└── skills  → list[str]
```

## 16. What Is output_type?

`output_type` tells the PydanticAI agent what type of final output is expected.

```python
agent = Agent(
    model,
    output_type=StudentProfile
)
```

```
Agent → Expected output → StudentProfile
```

This is one of the most important concepts of Day 17.

## 17. Typed AI Agent

A typed AI agent has an explicitly defined output structure.

```python
class StudentProfile(BaseModel):
    name: str
    age: int
    course: str
    skills: list[str]

agent = Agent(
    model,
    output_type=StudentProfile
)
```

```
LLM → StudentProfile → Validation → Typed Object
```

## 18. Type Safety

Type safety means the application knows what type of data it expects.

```
age: int   → age must be an integer
name: str  → name should be a string
```

This makes AI output easier and safer to consume in application code.

## 19. Static Type Checking

Static type checking happens before the application runs, using tools like `mypy` or `pyright`.

```python
age: int = "hello"
```

A type checker can identify: expected `int`, got `str`. This helps developers catch certain mistakes early.

## 20. Runtime Validation

Runtime validation happens while the program is running.

```
Application
 ↓
Data arrives
 ↓
Pydantic
 ↓
Validation
 ↓
Valid / Invalid
```

## 21. Static Typing vs Runtime Validation

**Static Type Checking:**
```
Code → Type Checker → Potential Type Error
```

**Runtime Validation:**
```
Program → Incoming Data → Pydantic → Validation
```

Both are useful.

## 22. What Happens if the Output Is Invalid?

Suppose our schema says:

```python
class Student(BaseModel):
    name: str
    age: int
```

but the model produces:

```json
{
  "name": "Pranav",
  "age": "twenty"
}
```

```
LLM
 ↓
Invalid Output
 ↓
Pydantic Validation
 ↓
Validation Error
 ↓
Retry / Correction
 ↓
Valid Output
```

PydanticAI can communicate validation failures back to the model and retry according to its retry configuration.

## 23. Important Lesson: Type Correctness ≠ Factual Correctness

This is one of the biggest lessons from today.

```json
{
  "name": "Pranav",
  "age": 20
}
```

This may be perfectly valid according to the schema — but the real person could actually be 21.

Pydantic can verify `age is an integer`. It cannot automatically verify `age is factually correct`.

```
Type correctness ≠ Factual correctness
```

This distinction is extremely important in AI engineering.

## 24. Dependencies

Dependencies are runtime application data that an agent may need.

```
Agent → Database → User information
```

Instead of putting everything into global variables, application-specific information can be passed as dependencies.

```python
agent.run_sync(
    "What is my account status?",
    deps=my_dependencies
)
```

## 25. Why Dependencies Matter

Imagine an agent needs: User ID, Database, API client, Configuration, Authentication information — these are application-level resources, provided through dependencies.

```
Application → Dependencies → Agent
```

## 26. RunContext

RunContext gives tools and dynamic instructions access to the current runtime context.

```
Agent Run → RunContext → Dependencies
```

```python
from pydantic_ai import RunContext
```

`ctx.deps` can provide access to dependency data.

## 27. Typed Dependencies

Dependencies can also be typed.

```
Agent[MyDependencies, MyOutput]
```

For example, `Agent[UserDependencies, UserProfile]` means:

```
This agent expects: UserDependencies
This agent produces: UserProfile
```

Another major example of type safety.

## 28. Tools

Tools are functions that an agent can use to perform actions or retrieve external information.

Examples: Web Search, Database, Calculator, API, File System, GitHub, External Service.

```
Agent
 ↓
LLM decides to use a tool
 ↓
Tool
 ↓
External System
 ↓
Tool Result
 ↓
Agent
```

## 29. Typed Tool Parameters

PydanticAI also uses Python type annotations for tool parameters.

```python
@agent.tool
def get_student(student_id: int) -> str:
    ...
```

`student_id → int`, `return → str`. The type hints help define a clear contract for tool usage.

## 30. Tool vs Output

Do not confuse these.

**Tool:**
```
Agent → Tool → External information/action
```

**Output:**
```
Agent → Final structured result
```

Example: Tool = `get_weather()`, Output = `WeatherReport`.

## 31. ModelRetry

ModelRetry is related to telling the model that an attempted tool/output action should be corrected and retried.

```
Agent → Tool / Output → Problem → ModelRetry → LLM → Corrected attempt
```

This is part of the broader validation/retry mechanism.

## 32. Generic Agent Types

PydanticAI agents can be typed around dependencies and outputs.

```
Agent[DepsType, OutputType]
```

For example: `Agent[DatabaseDependencies, StudentProfile]`. This communicates the expected contract to both developers and type checkers.

## 33. Model/Provider Separation

PydanticAI separates the agent framework from the underlying model provider.

```
Application → PydanticAI → Provider → Model
```

This means you don't have to think of the framework itself as the model.

## 34. PydanticAI vs Pydantic

**Pydantic** mainly provides: Data Models, Validation, Schemas, Type handling.

**PydanticAI** builds an AI-agent layer around: Agents, LLMs, Structured Output, Tools, Dependencies, Validation.

```
Pydantic   → Validation Foundation
PydanticAI → AI Agent Framework
```

## 35. PydanticAI vs CrewAI

**CrewAI:**
```
Crew → Agents → Tasks → Collaboration
```

**PydanticAI:**
```
Agent → Instructions → Tools → Dependencies → Typed Output → Validation
```

```
CrewAI     = Multi-agent orchestration focus
PydanticAI = Typed AI-agent/application focus
```

This is a mental model, not a strict capability boundary.

## 36. PydanticAI vs Mastra

**Mastra:**
```
TypeScript → Agents → Workflows → Tools → Memory
```

**PydanticAI:**
```
Python → Agents → Typed Outputs → Typed Dependencies → Tools → Validation
```

```
Mastra     = TypeScript AI application/workflow framework
PydanticAI = Python typed AI-agent framework
```

## 37. PydanticAI vs Vercel AI SDK

**Vercel AI SDK** focus: AI Application Development → Chat, Streaming, UI, Tool Calling, Structured Generation.

**PydanticAI** focus: Python AI Agents → Typed Output, Dependencies, Tools, Validation.

## 38. PydanticAI vs OpenRouter

These operate at different layers.

```
OpenRouter = Model access / routing
PydanticAI = Agent framework
```

Possible architecture:

```
Your Application → PydanticAI → OpenRouter → Model
```

```
PydanticAI ≠ OpenRouter
```

## 39. PydanticAI vs an LLM

An LLM is the underlying model. PydanticAI is the application/agent framework around the model.

```
PydanticAI → Agent → LLM → Model
```

```
PydanticAI ≠ GPT
PydanticAI ≠ Gemini
PydanticAI ≠ Claude
PydanticAI ≠ Llama
```

## 40. FastAPI Connection

A useful mental model is the relationship with FastAPI.

**FastAPI:**
```
API → Typed Request → Validation → Typed Response
```

**PydanticAI:**
```
AI Agent → Typed Output → Validation → Typed Python Object
```

PydanticAI aims to provide a similar developer experience around type-safe GenAI development.

## 41. Advantages of PydanticAI

1. **Strong Typing** — Agent → Typed Output
2. **Structured Output** — Applications can receive predictable data structures
3. **Validation** — Pydantic can validate structured model outputs
4. **Python Ecosystem** — Fits naturally into Python applications
5. **Provider Flexibility** — Supports many model providers
6. **Tools** — Agents can interact with external systems
7. **Dependencies** — Runtime application context can be injected cleanly
8. **Observability** — Integrates with observability tooling
9. **Evaluation** — AI systems can be evaluated systematically

## 42. Disadvantages of PydanticAI

1. **More Code** — For a simple request like "Hello", you don't necessarily need an agent framework
2. **Python-Centric** — If your entire application is TypeScript, another framework may fit more naturally
3. **Schema Complexity** — Large schemas can become complicated
4. **Types Do Not Guarantee Truth** — Valid Schema ≠ Correct Information
5. **Additional Complexity** — Architecture becomes `LLM → Structured Output → Validation → Application` instead of simply `LLM → Text`

The added complexity is useful when reliability and structure matter.

## 43. When Should I Use PydanticAI?

Good use cases include: Structured AI output, AI agents, Backend AI systems, Data extraction, Classification, AI APIs, Tool-using agents, Production AI applications — especially when your application needs predictable Python objects.

## 44. When Should I NOT Use PydanticAI?

Don't automatically use it for: Simple one-off prompts, Simple text generation, Tiny scripts, Basic experimentation.

If a simple model call solves the problem, keep the architecture simple.

## 45. Day 17 Practical Build

**Project:** Typed Student Profile Agent

The user provides information such as:

> Create a profile for a 20-year-old Computer Science student with Python and React skills.

The agent should return a `StudentProfile`.

## 46. Project Schema

```python
from pydantic import BaseModel


class StudentProfile(BaseModel):
    name: str
    age: int
    course: str
    skills: list[str]
```

```
StudentProfile
├── name → str
├── age → int
├── course → str
└── skills → list[str]
```

## 47. Project Architecture

```
                    USER
                      ↓
              PYDANTICAI AGENT
                      ↓
                     LLM
                      ↓
             STRUCTURED OUTPUT
                      ↓
             PYDANTIC VALIDATION
                      ↓
            StudentProfile OBJECT
                      ↓
               APPLICATION
```

## 48. Agent Configuration

```python
from pydantic_ai import Agent

agent = Agent(
    model,
    output_type=StudentProfile,
    instructions=(
        "Extract student information and "
        "return a valid student profile."
    )
)
```

The most important line is `output_type=StudentProfile` — that establishes the expected output contract.

## 49. Running the Agent

```python
result = agent.run_sync(
    "Create a profile for a 20 year old "
    "Computer Science student with Python "
    "and React skills."
)

print(result.output)
```

The result should be a typed `StudentProfile`.

## 50. Accessing Typed Fields

Instead of manually parsing text:

```python
result.output.name
result.output.age
result.output.course
result.output.skills
```

This is the key benefit of typed structured output.

## 51. Example Result

Input:

> Create a profile for Rahul, age 21, studying Computer Science, with Python and React skills.

Expected conceptual result:

```python
StudentProfile(
    name="Rahul",
    age=21,
    course="Computer Science",
    skills=["Python", "React"]
)
```

Now the application can work with the object directly.

## 52. Experiment 1 — Different Topics

Test different inputs:

- Test 1: Create a student profile for a Computer Science student.
- Test 2: Create a student profile for a Data Science student.
- Test 3: Create a student profile for a student learning Python, JavaScript and React.

Observe how the structured output remains consistent.

## 53. Experiment 2 — Different Schemas

```python
class Movie(BaseModel):
    title: str
    year: int
    rating: float
```

Now the agent can be configured around `Movie` instead of `StudentProfile`. This demonstrates that the schema defines the output contract.

## 54. Experiment 3 — Invalid Data

```python
class Product(BaseModel):
    name: str
    price: float
```

Then test unusual input:

> Create a product whose price is "very expensive".

Observe how structured output and validation behave.

## 55. Experiment 4 — Add a Field

Start with:

```python
class StudentProfile(BaseModel):
    name: str
    age: int
```

Then add `course: str` and `skills: list[str]`. Observe how the expected structure changes.

## 56. Experiment 5 — Add a Tool

Create a simple tool such as `get_university_info()`.

```
User → Agent → Tool → University Information → Agent → StudentProfile
```

This demonstrates the combination of Tools + Typed Output.

## 57. Experiment 6 — Add Dependencies

Create runtime context such as:

```python
university = "BML Munjal University"
```

Pass it as a dependency:

```
Application → Dependencies → RunContext → Agent
```

This demonstrates how application data can be provided to an agent at runtime.

## 58. What I Learned About Reliability

The deeper lesson of Day 17 is:

> LLMs are probabilistic. Applications require predictable data.

```
LLM → Schema → Validation → Typed Object → Application
```

This creates a stronger boundary between AI behavior and application logic.

## 59. Day 15 → Day 16 → Day 17

The roadmap is now progressing through different AI architecture layers.

```
Day 15 — Mastra   → AI Workflows
Day 16 — CrewAI    → Multi-Agent Collaboration
Day 17 — PydanticAI → Typed AI Agents
```

Progression:

```
AI Application → AI Workflow → Multi-Agent System → Typed AI System
```

## 60. My AI Engineering Learning Progression

```
AI Models
    ↓
AI Application Development
    ↓
AI Workflows
    ↓
Multi-Agent Systems
    ↓
Typed AI Agents
    ↓
Reliable AI Application Architecture
```

Each new framework is teaching a different architectural concept.

## 61. Important Mental Models

```
Pydantic      = Data validation + schemas
PydanticAI    = AI agent framework using strong typing and validation
Agent         = Interface to the model + agent behavior
Model         = Underlying AI model
Output Type   = Expected final data structure
Dependency    = Runtime application context
Tool          = Function the agent can use
RunContext    = Current execution context
Validation    = Check whether structured data matches expectations
```

## 62. The Most Important Architecture

```
                  TYPED AI AGENT
                        │
                        ↓
                      USER
                        │
                        ↓
                     AGENT
                        │
             ┌──────────┼──────────┐
             ↓          ↓          ↓
         Instructions  Tools   Dependencies
                        │
                        ↓
                       LLM
                        │
                        ↓
                Structured Output
                        │
                        ↓
                 Pydantic Model
                        │
                        ↓
                   Validation
                        │
                        ↓
                Typed Python Object
                        │
                        ↓
                  Application Logic
```

## 63. Biggest Lesson of Day 17

> An LLM should not be treated as a perfectly reliable source of application-ready data.

```
LLM → Expected Structure → Validation → Typed Data → Application
```

This gives the application a much stronger contract.

## 64. Another Important Lesson

More framework features do not automatically mean a better system.

For a simple task like "Generate a greeting," a direct model call may be enough. For "Extract structured customer information and send it to a database," typed output and validation become much more valuable.

```
Simple Problem              → Simple Architecture
Structured / Production Problem → Typed AI Architecture
```

## 65. Day 17 Completion Checklist

**Theory**
- [x] What is Pydantic?
- [x] What is PydanticAI?
- [x] Why PydanticAI exists
- [x] What is an Agent?
- [x] What is a Model?
- [x] What are Instructions?
- [x] instructions vs system_prompt
- [x] What is output_type?
- [x] Structured output
- [x] BaseModel
- [x] Type hints
- [x] Static type checking
- [x] Runtime validation
- [x] Typed AI agents
- [x] Dependencies
- [x] RunContext
- [x] Tools
- [x] Typed tool parameters
- [x] ModelRetry
- [x] Generic agent types
- [x] Model/provider separation
- [x] Type correctness vs factual correctness

**Comparisons**
- [x] PydanticAI vs Pydantic
- [x] PydanticAI vs CrewAI
- [x] PydanticAI vs Mastra
- [x] PydanticAI vs Vercel AI SDK
- [x] PydanticAI vs OpenRouter
- [x] PydanticAI vs an LLM

**Practical Build**
- [x] Create Python project
- [x] Install PydanticAI
- [x] Create Pydantic model
- [x] Define StudentProfile
- [x] Create PydanticAI Agent
- [x] Configure output_type
- [x] Configure instructions
- [x] Run the agent
- [x] Inspect structured output
- [x] Access typed fields
- [x] Test different inputs
- [x] Test validation behavior

**Optional Experiments**
- [x] Add a tool
- [x] Understand dependencies
- [x] Understand RunContext
- [x] Try dynamic instructions
- [x] Try another output schema
- [x] Test invalid/edge-case inputs

## 66. Day 17 Success Condition

The day is complete when I can explain and demonstrate:

```
User → PydanticAI Agent → LLM → Structured Output → Pydantic Validation → Typed Python Object → Application Logic
```

and explain what every stage does.

## 67. Final Summary

Day 17 introduced PydanticAI and the idea of building typed AI agents.

The most important concepts learned were: Pydantic, BaseModel, Type Hints, Validation, Structured Output, PydanticAI, Agent, Model, Instructions, Output Type, Dependencies, RunContext, Tools, ModelRetry, Generic Types, Provider Separation.

The practical project was: **Typed Student Profile Agent**

Its architecture was:

```
User → PydanticAI Agent → LLM → StudentProfile Schema → Pydantic Validation → Typed Python Object
```

## 🧠 Final Mental Model

The single most important thing to remember from Day 17 is:

```
             PROBABILISTIC AI
                    │
                    ↓
                   LLM
                    │
                    ↓
             STRUCTURED OUTPUT
                    │
                    ↓
             PYDANTIC SCHEMA
                    │
                    ↓
               VALIDATION
                    │
                    ↓
             TYPED PYTHON OBJECT
                    │
                    ↓
           DETERMINISTIC APPLICATION
```

The goal is not to make the LLM magically deterministic. The goal is to create a reliable contract around the LLM.

## 🔥 Final Takeaway

PydanticAI connects probabilistic LLM behavior with deterministic Python application logic through typed agents, structured outputs, validation, dependencies, and tools.

The key engineering principle from today is:

> Don't blindly trust raw LLM output. Define the structure. Validate the structure. Then let the application use it.

And the most important distinction to remember is:

```
Type-safe ≠ Factually correct
```

PydanticAI can help ensure that the output has the expected shape and types, but application-level validation, business rules, retrieval, evaluation, and other safeguards are still required to determine whether the information is actually correct.

## 📚 Official References

- PydanticAI: https://ai.pydantic.dev/
- PydanticAI GitHub: https://github.com/pydantic/pydantic-ai
- Pydantic: https://docs.pydantic.dev/
- PydanticAI Agent Documentation: https://ai.pydantic.dev/agent/
- PydanticAI Models: https://ai.pydantic.dev/models/
- PydanticAI Dependencies: https://ai.pydantic.dev/dependencies/
- PydanticAI Tools: https://ai.pydantic.dev/tools/
- PydanticAI Output: https://ai.pydantic.dev/output/

## ✅ DAY 17 STATUS

```
Experiment      → PydanticAI            → COMPLETE ✅
Build           → Typed AI Agent        → COMPLETE ✅
Theory          →                       → COMPLETE ✅
Comparisons     →                       → COMPLETE ✅
Experiments     →                       → COMPLETE ✅
Documentation   →                       → COMPLETE ✅
```

## 🎉 DAY 17 COMPLETE

**Day 17 — PydanticAI — Typed AI Agent — Structured Output — Type Safety — Validation**

The main lesson:

```
LLM → Schema → Validation → Typed Data → Application
```