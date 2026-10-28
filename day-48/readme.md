# 🧭 Day 24 — Model Routing: Cheap Model for Easy Tasks, Powerful Model for Hard Tasks

> **Daily AI Learning — Day 24**  
> Build a minimal model router that selects an appropriate LLM based on request complexity.

## 📌 Overview

Not every AI request needs the most powerful and expensive language model.

A simple question such as "What is a Python list?" may be handled effectively by a smaller, less expensive model. A complex request involving debugging, multi-step reasoning, or system architecture may benefit from a more capable model.

**Model routing** is the process of selecting an appropriate model for a request based on factors such as task complexity, quality requirements, latency, cost, and model availability.

In this experiment, I built a minimal rule-based router that classifies incoming prompts as easy or hard and selects one of two configured model aliases.

The router sends the request through a LiteLLM gateway, separating the model-selection decision from the provider-specific API integration.

### Core idea

```text
User Request
     |
     v
Complexity Classifier
     |
     +---- Easy -----> Cheap Model
     |
     +---- Hard -----> Powerful Model
                            |
                            v
                       AI Response
```

The goal is to balance response quality, latency, and cost rather than route every request to the same model.

---

## 🎯 Learning Objectives

- Understand complexity-based model routing.
- Distinguish model routing from load balancing and fallback routing.
- Build a rule-based classifier.
- Configure cheap and powerful model aliases.
- Integrate the router with LiteLLM Proxy.
- Route prompts through a single gateway endpoint.
- Compare the selected models' responses.
- Measure latency and token usage where available.
- Identify misclassifications and limitations.
- Understand classifier-based and adaptive routing.
- Document the experiment and its actual results.

---

## 🧠 1. What Is Model Routing?

Model routing is a decision-making layer between an incoming request and the model that processes it.

A routing system evaluates a request and selects a model according to a routing policy.

For example:

| Request | Expected route | Reason |
|---|---|---|
| Define a Python tuple | Cheap model | Straightforward explanation |
| Convert Celsius to Fahrenheit | Cheap model | Simple calculation |
| Summarize a short paragraph | Cheap model | Routine text processing |
| Debug a concurrency problem | Powerful model | Requires careful technical reasoning |
| Design a fault-tolerant multi-agent architecture | Powerful model | Multiple interacting design constraints |
| Prove a mathematical statement | Powerful model | May require multi-step reasoning |

These are initial routing choices, not guarantees that a particular model will solve a task correctly.

The ideal routing policy depends on the application's quality requirements and available models.

---

## ⚖️ 2. Model Routing vs. Other Techniques

| Technique | Purpose |
|---|---|
| AI Gateway | Provides a common interface to model providers |
| Model routing | Selects which model should process a request |
| Load balancing | Distributes requests across suitable deployments |
| Fallback routing | Tries another configured model after an eligible failure |
| Speculative decoding | Uses draft proposals to accelerate token generation |
| Quantization | Reduces the numerical precision of model weights |
| Model serving | Executes and manages inference requests |

An AI gateway can implement routing, but the two concepts are not identical.

For this project, LiteLLM provides the gateway interface, while the Python application implements the complexity-based decision.

---

## 🏗️ 3. System Architecture

```text
                   User Prompt
                        |
                        v
                Python Model Router
                        |
                        v
                Complexity Classifier
                        |
              +---------+---------+
              |                   |
              v                   v
         Easy Request        Hard Request
              |                   |
              v                   v
         cheap-model        powerful-model
              |                   |
              +---------+---------+
                        |
                        v
                  LiteLLM Proxy
                        |
              +---------+---------+
              |                   |
              v                   v
          Provider A           Provider B
              |                   |
              +---------+---------+
                        |
                        v
                  Model Response
```

The architecture separates three responsibilities:

1. **Classification:** estimates request complexity.
2. **Selection:** chooses a configured model alias.
3. **Inference:** sends the request through the gateway and receives the response.

This separation makes it possible to improve the routing policy without rewriting the provider integration.

---

## 🧩 4. Routing Strategies

### Rule-based routing

Uses explicit rules such as keywords, request categories, or length thresholds.

Advantages:

- Simple to implement.
- Low overhead.
- Easy to debug.
- No separate classifier model is required.

Limitation: the rules may not understand the real difficulty of a request.

### Classifier-based routing

Uses a classifier or language model to estimate request complexity.

Advantages:

- Can recognize more varied phrasing.
- Can use semantic information rather than only keywords.

Limitations:

- Adds inference cost and latency when using an LLM.
- May misclassify requests.
- Requires testing and evaluation.

### Adaptive routing

Uses observed outcomes, quality evaluations, costs, and latency measurements to improve routing decisions.

This approach can be useful in larger applications, but requires reliable data and monitoring.

**Today's implementation starts with rule-based routing** because the decision process is transparent and easy to inspect.

---

## 🛠️ 5. Technology Stack

- Python.
- OpenAI Python client.
- LiteLLM Proxy.
- Two configured LLM model aliases.
- Regular expressions for the baseline complexity classifier.

The OpenAI Python client is used to call the gateway's OpenAI-compatible endpoint. It does not mean both underlying providers are OpenAI models.

---

## 📁 6. Project Structure

```text
Day_24_Model_Routing/
│
├── README.md
├── router.py
├── requirements.txt
├── .gitignore
└── results/
    └── experiment_log.md
```

The gateway configuration can be maintained separately or in a protected local configuration file.

---

## ⚙️ 7. Environment Setup

Create the project directory:

```powershell
New-Item -ItemType Directory -Force `
  -Path "D:\AI-Learning\Day_24_Model_Routing"

Set-Location "D:\AI-Learning\Day_24_Model_Routing"

python -m venv .venv
.\.venv\Scripts\Activate.ps1

python -m pip install openai
```

The project calls an existing LiteLLM Proxy instance. If a gateway is not already available, follow the official LiteLLM Proxy installation guide.

Official documentation:

https://docs.litellm.ai/docs/simple_proxy

---

## 🔐 8. Configure Model Aliases

The gateway needs two model aliases: `cheap-model` and `powerful-model`.

An illustrative LiteLLM configuration is:

```yaml
model_list:
  - model_name: cheap-model
    litellm_params:
      model: groq/llama-3.1-8b-instant
      api_key: os.environ/GROQ_API_KEY

  - model_name: powerful-model
    litellm_params:
      model: openai/gpt-4o
      api_key: os.environ/OPENAI_API_KEY

general_settings:
  master_key: os.environ/LITELLM_MASTER_KEY
```

These model identifiers are examples. Confirm current availability and replace them if necessary.

Configure credentials using environment variables. Never commit actual API keys to version control.

---

## 🧠 9. The Rule-Based Classifier

The first version uses a list of complexity signals.

```python
HARD_PATTERNS = [
    r"\bdebug\b",
    r"\brace condition\b",
    r"\barchitecture\b",
    r"\bprove\b",
    r"\boptimi[sz]e\b",
    r"\btrade-?offs?\b",
    r"\bmultiple steps?\b",
    r"\bcompare and evaluate\b",
    r"\bcomplex\b",
    r"\bdistributed system\b",
    r"\bdesign a system\b",
]
```

If a prompt matches one of these patterns, it is classified as hard. Otherwise, the classifier checks its length and defaults to easy.

This approach is deliberately small and transparent.

It is not a comprehensive measure of reasoning difficulty. A short mathematical proof may be difficult without matching any of the keywords, while a simple question about architecture might match a rule unnecessarily.

---

## 💻 10. Implementation

The main program lives in `router.py`.

```python
import os
import re
import time
from openai import OpenAI

GATEWAY_URL = "http://localhost:4000/v1"

client = OpenAI(
    base_url=GATEWAY_URL,
    api_key=os.environ["LITELLM_MASTER_KEY"],
)

CHEAP_MODEL = "cheap-model"
POWERFUL_MODEL = "powerful-model"

HARD_PATTERNS = [
    r"\bdebug\b",
    r"\brace condition\b",
    r"\barchitecture\b",
    r"\bprove\b",
    r"\boptimi[sz]e\b",
    r"\btrade-?offs?\b",
    r"\bmultiple steps?\b",
    r"\bcompare and evaluate\b",
    r"\bcomplex\b",
    r"\bdistributed system\b",
    r"\bdesign a system\b",
]


def classify_request(prompt):
    text = prompt.lower()

    if any(
        re.search(pattern, text)
        for pattern in HARD_PATTERNS
    ):
        return "hard"

    if len(text.split()) > 80:
        return "hard"

    return "easy"


def choose_model(prompt):
    complexity = classify_request(prompt)

    if complexity == "hard":
        return POWERFUL_MODEL, complexity

    return CHEAP_MODEL, complexity


def route_request(prompt):
    model, complexity = choose_model(prompt)

    print(f"\nComplexity: {complexity}")
    print(f"Selected model: {model}")

    start = time.perf_counter()

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0,
        max_tokens=500,
    )

    elapsed = time.perf_counter() - start

    answer = response.choices[0].message.content or ""

    print(f"Latency: {elapsed:.2f} seconds")

    if response.usage:
        print(f"Total tokens: {response.usage.total_tokens}")

    print("\nResponse:\n")
    print(answer)

    return {
        "complexity": complexity,
        "model": model,
        "latency_seconds": elapsed,
        "response": answer,
    }


if __name__ == "__main__":
    while True:
        prompt = input("\nEnter a prompt (or 'exit'): ").strip()

        if prompt.lower() == "exit":
            break

        if not prompt:
            continue

        try:
            route_request(prompt)
        except Exception as exc:
            print(f"Request failed: {exc}")

    client.close()
```

Run the program:

```powershell
python router.py
```

The program classifies each prompt, prints the selected model, sends the request through LiteLLM, and displays the response.

---

## 🧪 11. Test Cases

Use the following prompts to test the router.

### Easy requests

1. What is a Python list?
2. Explain a `for` loop.
3. Convert 25 degrees Celsius to Fahrenheit.
4. Summarize a short paragraph.
5. Define a database index.

### Hard requests

1. Debug this race condition and explain the synchronization problem.
2. Design a fault-tolerant multi-agent architecture with retries and persistent state.
3. Compare two caching strategies and analyze their trade-offs.
4. Prove a mathematical statement and justify each step.
5. Optimize a slow database query and explain the execution plan.

Record the actual selected model for each request. Investigate any incorrect decisions.

---

## 📊 12. Evaluation

A useful routing experiment should measure more than whether the program runs.

### Routing accuracy

Compare the selected category with the expected category in your test set.

\[
\text{Accuracy} =
\frac{\text{Correct classifications}}
{\text{Total test requests}}
\times 100\%
\]

For this experiment, the expected labels are manually assigned for the test prompts.

### Latency

Record client-observed request time for each model.

This includes gateway and network overhead, so it should not be treated as pure inference latency.

### Token usage and cost

Record usage when the provider returns it. Estimate costs using the applicable provider pricing and actual token counts.

### Response quality

Evaluate:

- Correctness.
- Completeness.
- Instruction following.
- Reasoning quality.
- Clarity.
- Relevance.

Do not assume that a more expensive model is always better, or that a cheaper model is sufficient for every easy-looking request.

---

## 📋 13. Results Table

Fill in the table after running the experiment.

| Prompt category | Expected route | Actual route | Latency | Quality |
|---|---|---|---|---|
| Simple definition | Cheap | Record | Measure | Evaluate |
| Basic explanation | Cheap | Record | Measure | Evaluate |
| Debugging task | Powerful | Record | Measure | Evaluate |
| System architecture | Powerful | Record | Measure | Evaluate |
| Mathematical proof | Powerful | Record | Measure | Evaluate |

Do not substitute hypothetical results for actual measurements.

---

## 💰 14. Cost and Quality Trade-Off

Suppose easy requests form a fraction \(p_e\) of all requests, and hard requests form a fraction \(p_h\).

If the average costs of the two routes are \(C_e\) and \(C_h\), respectively:

\[
C_{\text{avg}} = p_e C_e + p_h C_h
\]

where:

\[
p_e + p_h = 1
\]

This is a simplified estimate. It excludes classifier overhead, retries, fallbacks, and other operational costs.

A useful router sends routine requests to the cheaper model while reserving the more capable model for tasks where its additional quality is worthwhile.

The aim is not to minimize cost at all costs. It is to balance cost, quality, and latency.

---

## ⚠️ 15. Limitations

- Keyword-based rules can misclassify requests.
- Prompt length is only a weak proxy for complexity.
- Different models can behave differently even when they use the same API format.
- Provider rate limits and availability can affect results.
- Latency varies with network conditions and workload.
- Token usage does not necessarily equal billed cost.
- A small test set cannot establish general routing accuracy.
- The selected model's quality should be evaluated independently of routing accuracy.

---

## 🔒 16. Security

- Keep provider credentials in environment variables or a secret manager.
- Do not commit API keys or secret configuration files.
- Protect the gateway with authentication.
- Avoid sending confidential prompts to providers without understanding their data-handling policies.
- Apply appropriate usage limits and monitor unexpected requests.

---

## 📚 17. Official References

- [LiteLLM Documentation](https://docs.litellm.ai/docs/)
- [LiteLLM Routing and Load Balancing](https://docs.litellm.ai/docs/routing)
- [LiteLLM Proxy Quickstart](https://docs.litellm.ai/docs/simple_proxy)
- [LiteLLM Auto Routing](https://docs.litellm.ai/docs/proxy/auto_routing)

---

## 🏁 Final Summary

Day 24 explores complexity-based model routing: selecting a model based on the needs of each request.

The workflow is:

```text
Receive Prompt
      ↓
Classify Complexity
      ↓
Select Model Alias
      ↓
Call LiteLLM Gateway
      ↓
Generate Response
      ↓
Measure and Evaluate
```

**Key takeaway:** A well-designed router can reduce unnecessary expensive model calls while preserving access to more capable models for difficult tasks.

The first version deliberately uses transparent rules. Future versions can replace these rules with a classifier, quality-based escalation, or adaptive routing.

**Completion criteria:** run the router against easy and hard prompts, verify the selected model, measure latency and usage, evaluate response quality, and document actual results and limitations.