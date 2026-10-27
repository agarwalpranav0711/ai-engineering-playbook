# 🌐 Day 22 — AI Gateway: Multi-Provider Model Routing

> **Daily AI Learning — Day 22**  
> Explore modern AI gateways and route the same request through two different LLM providers using a single API endpoint.

## 📌 Overview

Modern AI applications often depend on multiple language models and providers. Integrating every provider separately can introduce duplicated code, inconsistent APIs, scattered credentials, and more complicated error handling.

An **AI Gateway** acts as a centralized layer between an application and its model providers.

It provides a consistent interface for accessing different models and can offer routing, retries, fallbacks, authentication, usage tracking, and cost controls.

Today's practical experiment uses **LiteLLM Proxy** to send the same prompt to two different model providers through one local gateway.

The objective is to understand how the gateway works, observe differences between model responses, and compare latency and reliability.

---

## 🎯 Learning Objectives

- Understand the purpose of an AI gateway.
- Learn the difference between an AI gateway, an SDK, and an inference runtime.
- Understand multi-provider model routing.
- Explore LiteLLM Proxy.
- Configure two model providers behind one gateway.
- Send the same prompt to both models through a common endpoint.
- Compare response quality, latency, and errors.
- Understand retries, fallbacks, authentication, and usage tracking.
- Learn how gateways simplify model switching.
- Document actual results and identify limitations.

---

## 🧠 1. What Is an AI Gateway?

An AI gateway is a centralized interface through which applications access one or more AI model providers.

Instead of implementing a separate integration for each provider, an application sends requests to the gateway, which forwards them to the configured model.

### Without an AI gateway

```text
Application
   |
   +----> Provider A API
   |
   +----> Provider B API
   |
   +----> Provider C API
```

The application may need separate API clients, configuration, authentication, and error-handling logic.

### With an AI gateway

```text
                    Application
                         |
                         v
                   AI Gateway
                         |
              +----------+----------+
              |                     |
              v                     v
         Provider A             Provider B
              |                     |
              +----------+----------+
                         |
                         v
                    Responses
```

The application uses a common interface while the gateway handles provider-specific integration.

---

## 🔑 2. Why AI Gateways Matter

### Unified API

The application can use a consistent request structure for multiple supported providers.

### Model routing

Requests can be directed to a specific model or deployment.

### Reliability

Configured retries and fallbacks can help recover from certain provider errors.

### Cost management

Gateways can record usage and enforce configured budgets or limits.

### Observability

Request logs and metrics can help identify latency, errors, and usage patterns.

### Security

A gateway can centralize authentication and keep provider credentials away from application code.

These capabilities depend on the gateway configuration and the features enabled in the selected deployment.

---

## 🏗️ 3. What Is LiteLLM?

LiteLLM provides a unified interface for calling models from multiple providers. Its proxy server adds a gateway layer that applications can access through a common API.

For this experiment, LiteLLM Proxy will act as the local gateway.

### Architecture

```text
Python Client
     |
     | OpenAI-compatible request
     v
LiteLLM Proxy
     |
     +----> Provider A / Model A
     |
     +----> Provider B / Model B
     |
     v
Standardized API Response
```

The client does not need a separate endpoint for every provider. It calls the gateway and selects a configured model alias.

Official documentation:

https://docs.litellm.ai/docs/simple_proxy

---

## 🧩 4. Important Concepts

| Concept | Meaning |
|---|---|
| Gateway | Central interface between an application and model providers |
| Provider | Service that supplies access to a model |
| Model | The actual language model that generates a response |
| Model alias | A gateway-defined name for a configured model |
| Routing | Selecting which configured model receives a request |
| Fallback | Trying an alternative model after a qualifying failure |
| Retry | Attempting a request again after a failure |
| Latency | Time taken to receive a response |
| Usage tracking | Recording request and token usage where available |
| OpenAI-compatible API | An API interface that follows the OpenAI request/response conventions |

**Important distinction:** two models exposed through the same API are not necessarily equivalent. They can differ in capability, response style, latency, context length, pricing, and supported parameters.

---

## ⚖️ 5. AI Gateway vs. SDK vs. Inference Runtime

| Technology | Primary role |
|---|---|
| LiteLLM Proxy | Gateway for routing requests across providers |
| LiteLLM Python SDK | Unified Python interface for calling supported models |
| OpenRouter | Hosted service for accessing models from multiple providers |
| Ollama | Convenient local model execution |
| llama.cpp | Local LLM inference engine |
| vLLM | High-throughput model serving |

These categories can overlap. For example, LiteLLM can be used directly as a Python SDK or deployed as a gateway service.

Today's experiment uses **LiteLLM Proxy**, not just the SDK, so the requests pass through a separately running gateway server.

---

## 🧪 6. Today's Experiment

### Objective

Send the exact same prompt to two different model providers through one local gateway endpoint.

### Experiment flow

```text
Choose One Prompt
       |
       v
Configure Two Models
       |
       v
Start LiteLLM Proxy
       |
       +------------------+
       |                  |
       v                  v
   Model A             Model B
       |                  |
       v                  v
  Response A          Response B
       |                  |
       +--------+---------+
                |
                v
      Compare the Results
```

### What stays the same?

- User prompt.
- Gateway endpoint.
- Client library.
- Measurement method.
- Requested output length, where both models support the parameter.

### What changes?

- Model alias.
- Underlying provider and model.

This design makes it easier to investigate how different models respond to the same task.

---

## 🛠️ 7. Environment Setup

This project uses Python, LiteLLM Proxy, and the OpenAI Python client.

Create a project directory in your preferred development location:

```powershell
New-Item -ItemType Directory -Force `
  -Path "D:\AI-Learning\Day_22_AI_Gateway"

Set-Location "D:\AI-Learning\Day_22_AI_Gateway"

python -m venv .venv
.\.venv\Scripts\Activate.ps1

python -m pip install "litellm[proxy]" openai
```

If your daily AI-learning repository is stored elsewhere, use that location instead.

The gateway needs valid credentials for the two providers. Choose providers and models available to your accounts.

---

## 🔐 8. Configure API Keys

Set the provider credentials and local gateway key in the current PowerShell session.

```powershell
$env:OPENAI_API_KEY = "your-provider-a-api-key"
$env:GROQ_API_KEY = "your-provider-b-api-key"

$env:LITELLM_MASTER_KEY = "sk-local-gateway-change-this"
```

These are placeholders. Replace the provider keys with your own credentials.

Do not commit actual credentials to GitHub.

The example below uses OpenAI and Groq as the two providers. Confirm that the selected model identifiers are currently available to your accounts. You can substitute other providers supported by LiteLLM if necessary.

---

## ⚙️ 9. Configure the Gateway

Create `config.yaml` in the project root.

```yaml
model_list:
  - model_name: provider-a
    litellm_params:
      model: openai/gpt-4o-mini
      api_key: os.environ/OPENAI_API_KEY

  - model_name: provider-b
    litellm_params:
      model: groq/llama-3.3-70b-versatile
      api_key: os.environ/GROQ_API_KEY

general_settings:
  master_key: os.environ/LITELLM_MASTER_KEY
```

### How this configuration works

- `provider-a` is a gateway alias for the configured OpenAI model.
- `provider-b` is a gateway alias for the configured Groq model.
- The gateway reads provider credentials from environment variables.
- The master key protects access to the gateway.
- The application sends requests to the gateway rather than calling the provider endpoints directly.

Model identifiers can change as providers update their offerings. If either example is unavailable, replace it with a currently supported model from the corresponding provider's documentation.

---

## 🚀 10. Start the Gateway

With the virtual environment activated and the environment variables configured, run:

```powershell
litellm --config config.yaml --port 4000
```

The local gateway should listen on port `4000`.

Keep this terminal running.

The client will use the OpenAI-compatible base URL:

```text
http://localhost:4000/v1
```

If the server fails to start, inspect the error message, verify the configuration, and confirm that the installed LiteLLM version supports the configuration fields.

---

## 🐍 11. Route the Same Request Through Two Models

Create `compare_models.py`.

```python
import os
import time
from openai import OpenAI

GATEWAY_URL = "http://localhost:4000/v1"
GATEWAY_KEY = os.environ["LITELLM_MASTER_KEY"]

client = OpenAI(
    base_url=GATEWAY_URL,
    api_key=GATEWAY_KEY,
)

PROMPT = """
Explain how an AI gateway works to a beginner.
Use one real-world analogy, list three benefits,
and mention two limitations.
"""

MODELS = ["provider-a", "provider-b"]


def query_model(model_name):
    start = time.perf_counter()

    response = client.chat.completions.create(
        model=model_name,
        messages=[
            {
                "role": "user",
                "content": PROMPT,
            }
        ],
        temperature=0,
        max_tokens=250,
    )

    elapsed = time.perf_counter() - start

    text = response.choices[0].message.content or ""

    usage = response.usage
    total_tokens = usage.total_tokens if usage else None

    return {
        "model": model_name,
        "latency_seconds": elapsed,
        "total_tokens": total_tokens,
        "response": text,
    }


def main():
    results = []

    for model_name in MODELS:
        print(f"\nRequesting model: {model_name}")

        try:
            result = query_model(model_name)
            results.append(result)

            print(f"Latency: {result['latency_seconds']:.2f}s")
            print(f"Total tokens: {result['total_tokens']}")
            print("\nResponse:")
            print(result["response"])

        except Exception as exc:
            print(f"Request failed for {model_name}: {exc}")

    print("\n========== COMPARISON ==========")

    for result in results:
        print(f"\nModel: {result['model']}")
        print(f"Latency: {result['latency_seconds']:.2f}s")
        print(f"Total tokens: {result['total_tokens']}")
        print(f"Response characters: {len(result['response'])}")

    client.close()


if __name__ == "__main__":
    main()
```

Run the client in a second PowerShell terminal:

```powershell
.\.venv\Scripts\Activate.ps1
python compare_models.py
```

If your terminal opens in a different directory, navigate to the project folder first.

### What the script does

1. Connects to the local LiteLLM gateway.
2. Sends the same prompt to `provider-a`.
3. Sends the same prompt to `provider-b`.
4. Measures elapsed request time.
5. Records token usage when returned.
6. Prints both responses for comparison.
7. Handles individual request failures so one error does not automatically prevent the other model from being tested.

This measures client-observed latency, which includes network and gateway overhead. It is not a pure measurement of model inference time.

---

## 📊 12. Compare the Results

Record the actual measurements from your experiment.

| Metric | Provider A | Provider B |
|---|---|---|
| Model identifier | Record actual model | Record actual model |
| Request successful | Record result | Record result |
| Client-observed latency | Measure | Measure |
| Token usage | Record if available | Record if available |
| Response quality | Evaluate | Evaluate |
| Instruction following | Evaluate | Evaluate |
| Errors | Record if any | Record if any |

### Quality evaluation

Assess each response using the same criteria:

- Correctness.
- Clarity.
- Completeness.
- Instruction following.
- Relevance.
- Unnecessary repetition.

Do not assume that the faster response is automatically better.

The models may have different capabilities, so evaluate response quality separately from speed.

---

## 🔁 13. Routing, Retries, and Fallbacks

Routing allows an application to select a model by its gateway alias.

Retries can help with transient failures, while fallbacks can direct a request to another configured model when the primary model fails in a way that qualifies for fallback handling.

These are different behaviors:

- **Routing:** selects the intended model or deployment.
- **Retry:** attempts a request again.
- **Fallback:** switches to another configured option after an eligible failure.

A useful follow-up experiment is to configure a fallback from `provider-a` to `provider-b`, then test what happens when the primary route becomes unavailable.

Official documentation:

https://docs.litellm.ai/docs/routing

Do not intentionally overload a provider or create unnecessary requests. A controlled test using a temporarily invalid model alias can help you understand configuration and error handling, but an invalid alias is not the same as simulating every kind of provider outage.

---

## 🔒 14. Security and Cost Considerations

- Keep provider API keys in environment variables or a secret manager.
- Never commit credentials or `.env` files to GitHub.
- Use authentication for the gateway.
- Do not expose a development gateway publicly without suitable access controls.
- Check model pricing and provider rate limits before repeated testing.
- Remember that sending the same prompt to two providers sends that prompt to both services.
- Avoid using confidential data in experiments.
- Use logs and usage information responsibly.

A local gateway does not automatically make provider requests local or private. Prompts still travel to the configured providers unless you route them to suitable local deployments.

---

## 📁 15. Suggested Project Structure

```text
Day_22_AI_Gateway/
│
├── README.md
├── config.yaml
├── compare_models.py
├── requirements.txt
├── .gitignore
└── results/
    └── experiment_log.md
```

Suggested `requirements.txt`:

```text
litellm[proxy]
openai
```

For a reproducible environment, record the versions actually tested and pin them after validating your setup.

Suggested `.gitignore`:

```gitignore
.venv/
__pycache__/
*.pyc
.env
config.local.yaml
results/*.jsonl
```

The example `config.yaml` contains model names and environment-variable references, not actual secrets. Keep any configuration containing credentials out of version control.

---

## 🧠 16. Key Takeaways

- An AI gateway provides a common interface for multiple model providers.
- LiteLLM Proxy can expose configured models through a local endpoint.
- Model aliases make provider selection easier.
- The same prompt can be routed to different models without rewriting the whole client.
- Latency, quality, token usage, and reliability are separate evaluation dimensions.
- Retries and fallbacks improve resilience only when configured correctly.
- Provider API keys must be protected.
- A common API does not make different models behave identically.

---

## 📚 17. Official References

- [LiteLLM documentation](https://docs.litellm.ai/)
- [LiteLLM Proxy quickstart](https://docs.litellm.ai/docs/simple_proxy)
- [LiteLLM routing and load balancing](https://docs.litellm.ai/docs/routing)
- [LiteLLM request architecture](https://docs.litellm.ai/docs/proxy/architecture)
- [OpenRouter quickstart](https://openrouter.ai/docs/quickstart)

---

## 🏁 Final Summary

Day 22 explores how an AI gateway simplifies access to multiple LLM providers.

The experiment follows this workflow:

```text
Configure Two Providers
         ↓
Start LiteLLM Proxy
         ↓
Send the Same Prompt to Model A
         ↓
Send the Same Prompt to Model B
         ↓
Compare Responses and Latency
         ↓
Record Findings
```

**Day 22 takeaway:** An AI gateway separates application logic from provider-specific integrations. This makes model switching, routing, and operational management easier while providing a common place to manage reliability, access, and usage.

**Completion criteria:** run both requests through the same local gateway endpoint, record the models and actual measurements, compare the responses, and document any limitations or failures.