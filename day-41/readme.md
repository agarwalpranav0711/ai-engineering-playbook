# 🚀 Day 15 — SGLang: Modern LLM Serving & Runtime

> Exploring how modern inference runtimes serve large language models efficiently through request scheduling, KV-cache management, prefix caching, and optimized token generation.

## 📌 Overview

Today's exploration focuses on **SGLang**, an open-source inference and serving framework for large language models (LLMs) and multimodal models.

An AI model is only one part of an AI application. Once a model is trained, another system must load it, process incoming requests, manage memory, generate tokens, and return responses to clients.

This is the problem that LLM serving runtimes address.

SGLang focuses on high-performance inference, efficient resource utilization, low-latency responses, high throughput, and workloads involving agents and multiple concurrent requests.

The central idea I learned today:

> **An LLM provides the learned intelligence; an inference runtime determines how efficiently that intelligence is executed and made available to applications.**

---

## 🎯 Learning Objectives

The objectives of Day 15 were to understand:

- What LLM inference and model serving mean.
- The difference between a model, an inference runtime, and an AI application.
- How prefill and decode work.
- What a KV cache stores and why it matters.
- How SGLang's RadixAttention supports prefix caching.
- How continuous batching improves request scheduling.
- How speculative decoding can accelerate token generation.
- What tensor parallelism and prefill/decode disaggregation mean.
- How an inference server exposes an API to applications.
- How to send requests to an SGLang server.
- How streaming responses work.
- How to measure latency and throughput.
- How inference infrastructure supports AI agents.
- How to document experiments without inventing performance results.

---

## 🧠 1. What Is SGLang?

SGLang is an open-source inference framework designed to serve language and multimodal models efficiently.

It provides the runtime infrastructure needed to load supported models, schedule requests, execute model computations, manage cache state, and expose serving APIs.

SGLang supports a broad ecosystem of models and hardware. Actual availability depends on the model architecture, runtime version, accelerator, and installation path.

### Why does it matter?

Imagine an AI application receiving hundreds of requests:

```text
Request A → Explain neural networks
Request B → Summarize a document
Request C → Generate Python code
Request D → Answer a follow-up question
Request E → Explain an error message
```

A serving runtime must handle these requests while balancing:

- GPU or accelerator utilization.
- Memory consumption.
- Request scheduling.
- Response latency.
- Token generation speed.
- Concurrent workloads.
- Model execution efficiency.

SGLang provides mechanisms to optimize these serving challenges.

---

## 🏗️ 2. Model vs Runtime vs Application

These three layers have different responsibilities.

| Layer | Responsibility | Examples |
|---|---|---|
| Model | Learned parameters that generate outputs | Qwen, Llama, DeepSeek |
| Inference runtime | Loads and executes the model efficiently | SGLang, vLLM |
| Application | Uses the model to perform a user-facing task | Chatbot, coding assistant, AI agent |

A simplified architecture:

```text
User
  ↓
AI Application
  ↓
Inference API
  ↓
SGLang Server
  ↓
Request Scheduler
  ↓
Model Execution
  ↓
Generated Tokens
  ↓
API Response
  ↓
AI Application
```

SGLang does not replace an agent framework. An agent framework manages decisions, tools, state, and workflow; an inference runtime serves the model that the agent calls.

---

## 🔬 3. What Is LLM Inference?

Inference is the process of using a trained model to generate an output for a given input.

For example:

```text
Prompt:
Explain artificial intelligence in simple words.

        ↓

Tokenization

        ↓

Model computation

        ↓

Token generation

        ↓

Detokenization

        ↓

Response:
Artificial intelligence allows computers
to perform tasks that normally require
human-like intelligence.
```

The model generally generates text autoregressively: each new token depends on the preceding context and generated tokens.

During inference, the runtime must manage computation and memory efficiently, especially when many requests are active at once.

---

## ⚙️ 4. Prefill and Decode

Two important phases of LLM inference are **prefill** and **decode**.

### Prefill

The model processes the input prompt and computes the internal information required to begin generation.

For example:

```text
System instructions
+
Conversation history
+
User question
        ↓
     Prefill
        ↓
Ready for generation
```

Long prompts can increase the amount of computation required before the first output token is available.

### Decode

The model generates the response token by token.

```text
Token 1 → Token 2 → Token 3 → Token 4 → ...
```

Each new token is generated using the preceding context.

### Why distinguish them?

Prefill and decode have different performance characteristics. Separating and optimizing these phases can help a serving system allocate compute resources more effectively.

---

## 🧠 5. KV Cache

KV stands for **Key-Value cache**.

Transformer attention layers calculate key and value representations for tokens. During autoregressive generation, previously computed key/value tensors can be retained and reused instead of recomputing them for every new token.

Without useful caching:

```text
Generate next token
        ↓
Recompute earlier context
        ↓
Generate another token
```

With KV caching:

```text
Process context
        ↓
Store reusable key/value tensors
        ↓
Generate next token using cached state
        ↓
Reuse cached state for subsequent tokens
```

### Why it matters

The KV cache can reduce redundant computation, but it consumes memory.

Memory requirements depend on:

- Number of transformer layers.
- Number of cached tokens.
- Number of key/value heads.
- Head dimension.
- Data precision.
- Active sequences and batch size.
- Model architecture and parallelism.

The cache is therefore both a performance optimization and a memory-management challenge.

---

## 🌳 6. RadixAttention and Prefix Caching

One of SGLang's best-known innovations is **RadixAttention**, which supports reuse of KV-cache state for shared token prefixes.

Consider a customer-support application with a shared system prompt:

```text
You are a helpful support assistant.
Follow the support policy.
Protect confidential information.
```

Multiple requests may share that prefix:

```text
Request A:
[Shared prompt] + "Where is my order?"

Request B:
[Shared prompt] + "How do I return an item?"

Request C:
[Shared prompt] + "What is the refund policy?"
```

Because the requests share a prefix, the runtime may reuse compatible cached computation for that prefix.

Conceptually:

```text
             Shared Prefix
                   |
          +--------+--------+
          |        |        |
       Request A Request B Request C
          |        |        |
       Order Q.  Return Q. Refund Q.
```

RadixAttention organizes reusable prefix cache state using a radix-tree structure.

**Important distinction:** prefix caching is not the same as caching a completed answer. It reuses model attention state associated with matching token prefixes, where the runtime determines that reuse is valid.

This is particularly useful for workloads with repeated system instructions, long shared contexts, and repeated agent prompts.

---

## 📦 7. Continuous Batching

Traditional static batching groups requests into a batch that is processed according to a fixed schedule.

Continuous batching allows requests to enter and leave the active generation workload as execution progresses.

Imagine three requests:

```text
Request A → 20 output tokens
Request B → 200 output tokens
Request C → 50 output tokens
```

The requests finish at different times.

A continuous batching scheduler can make room for new work as active sequences complete, rather than requiring the entire original group to finish together.

### Benefits

- Better utilization of available compute.
- More flexible scheduling under concurrent workloads.
- Potentially higher throughput.
- Better handling of mixed request lengths.

These benefits depend on the workload, hardware, scheduler, and memory limits. Continuous batching does not guarantee lower latency for every individual request.

---

## ⚡ 8. Speculative Decoding

Speculative decoding is a technique for potentially accelerating autoregressive generation.

A draft mechanism proposes candidate tokens, and a target model verifies those candidates according to the algorithm being used.

Conceptually:

```text
Draft mechanism
      ↓
Proposed tokens
      ↓
Target model verification
      ↓
Accept valid candidates
      ↓
Continue generation
```

The goal is to generate more useful output tokens per unit of expensive target-model computation.

Its effectiveness depends on factors such as:

- Draft and target model compatibility.
- Acceptance rate of proposed tokens.
- Model size.
- Hardware.
- Workload and implementation.

Speculative decoding is an optimization technique, not a guarantee of faster inference for every model.

---

## 🖥️ 9. Tensor Parallelism

Large models may not fit comfortably on a single accelerator, or their execution may benefit from multiple devices.

Tensor parallelism divides parts of model computation across multiple devices.

```text
                 Model
                   |
          +--------+--------+
          |        |        |
        GPU 1    GPU 2    GPU 3
          |        |        |
          +--------+--------+
                   |
             Model output
```

This can enable larger models and faster computation in appropriate configurations.

However, distributing computation introduces communication overhead. The benefits depend on the model, accelerator interconnect, parallelism strategy, and workload.

---

## 🔀 10. Prefill/Decode Disaggregation

Prefill and decode can have different resource requirements.

Disaggregation separates these stages across different worker groups so that each can be scheduled or scaled more independently.

```text
Incoming requests
        ↓
Prefill workers
        ↓
Processed context / cache state
        ↓
Decode workers
        ↓
Generated response
```

Potential benefits include better resource allocation and improved throughput in appropriate deployments.

Trade-offs include communication overhead, coordination complexity, cache transfer, and additional infrastructure.

This is an advanced serving architecture. It is not necessary for a basic local experiment.

---

## 🔢 11. Structured Outputs and Quantization

### Structured outputs

Applications often require machine-readable responses rather than unrestricted text.

For example:

```json
{
  "topic": "LLM serving",
  "difficulty": "intermediate",
  "summary": "Efficient model execution and request scheduling"
}
```

Structured-output mechanisms can constrain generation to supported schemas or formats, depending on the model and serving configuration.

### Quantization

Quantization represents model weights or other tensors using lower-precision formats.

Potential benefits include:

- Lower memory consumption.
- Reduced memory bandwidth requirements.
- Faster inference on compatible hardware.

Trade-offs include potential accuracy changes, kernel requirements, and hardware-specific compatibility.

Neither structured outputs nor quantization automatically improve every workload. They must be selected according to the task and runtime support.

---

## 🌐 12. How SGLang Serves Requests

SGLang provides serving endpoints that applications can call over HTTP. Its OpenAI-compatible API enables clients to use familiar chat-completion request structures when supported by the deployed model and configuration.

A simplified request flow:

```text
Python Client
     ↓ HTTP Request
SGLang API Server
     ↓
Request Processing
     ↓
Scheduler
     ↓
Model Execution
     ↓
Generated Tokens
     ↓ HTTP Response
Python Client
```

This separation allows the client application to run on a different machine from the model server.

It also means the client can be relatively lightweight while the model server runs on suitable accelerator hardware.

---

## 🧪 13. Hands-On Experiment

### Objective

Send a prompt to an SGLang server, receive a response, and understand how the client communicates with the inference runtime.

### Experimental task

```text
Explain continuous batching and RadixAttention
in simple words, with one example of each.
```

### Steps

1. Identify a compatible environment for running SGLang.
2. Start a supported model server using the official instructions.
3. Confirm that the server is ready.
4. Send a chat-completion request.
5. Read the returned response.
6. Try streaming output.
7. Record the model, runtime version, hardware, and observations.
8. If possible, repeat with a different prompt and compare the interaction.

### Important hardware note

SGLang's supported hardware and installation options evolve. A command that works on one GPU and software stack may not work on another.

Use the official installation instructions and model/hardware cookbook for the environment you actually have. Do not assume that a small model will automatically run on every machine.

---

## 🐍 14. Example Python Client

Once an SGLang server is running and its API endpoint is accessible, the following client demonstrates a simple chat-completion request.

Install the client library:

```bash
python -m pip install openai
```

Create `client.py`:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://127.0.0.1:30000/v1",
    api_key="EMPTY",
)

response = client.chat.completions.create(
    model="YOUR_SERVER_MODEL_ID",
    messages=[
        {
            "role": "system",
            "content": "You are a concise and helpful assistant.",
        },
        {
            "role": "user",
            "content": (
                "Explain continuous batching and RadixAttention "
                "with a simple example."
            ),
        },
    ],
    temperature=0,
    max_tokens=180,
)

print(response.choices[0].message.content)
```

Replace `YOUR_SERVER_MODEL_ID` with the model identifier accepted by your running server. If the server is remote, replace `127.0.0.1` with the appropriate server address.

The example assumes that the server uses the standard port and OpenAI-compatible chat-completion endpoint. Adjust the configuration if your deployment differs.

The placeholder API key is appropriate only for a local server configured without API-key authentication. Remote deployments should use appropriate authentication and network protection.

---

## 🌊 15. Streaming Responses

Streaming allows the client to receive generated output incrementally.

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://127.0.0.1:30000/v1",
    api_key="EMPTY",
)

stream = client.chat.completions.create(
    model="YOUR_SERVER_MODEL_ID",
    messages=[
        {
            "role": "user",
            "content": "Explain KV caching in simple words.",
        }
    ],
    stream=True,
    max_tokens=150,
)

for chunk in stream:
    if not chunk.choices:
        continue

    content = chunk.choices[0].delta.content

    if content:
        print(content, end="", flush=True)

print()
```

This demonstrates streaming through the client API. It does not independently prove that a particular internal optimization is enabled.

The purpose of the experiment is to observe how generated output arrives and understand the difference between streaming and waiting for the complete response.

---

## 📊 16. Performance Metrics

A serving runtime must be evaluated using measurements, not just by whether it produces a correct answer.

| Metric | Meaning |
|---|---|
| TTFT — Time to First Token | Time until the first output token arrives |
| ITL — Inter-Token Latency | Delay between successive output tokens |
| End-to-end latency | Total request duration |
| Throughput | Tokens or requests processed per unit of time |
| Concurrency | Number of simultaneously active requests |
| Queue time | Time spent waiting for execution |
| Prefix-cache reuse | Reuse of compatible cached prefix state, when exposed by metrics |

### Why multiple metrics matter

Low time to first token can make a chatbot feel responsive.

Low inter-token latency helps maintain smooth streaming.

High throughput helps a server handle more work.

Low end-to-end latency helps individual requests finish quickly.

These objectives can conflict. For example, increasing concurrency may improve overall throughput while increasing the latency experienced by an individual request.

### Experiment log

Record:

```text
Model:
SGLang version:
Hardware:
Input prompt:
Maximum output tokens:
Time to first token:
Total response time:
Output tokens:
Streaming behavior:
Errors:
```

Do not invent latency values or compare measurements from incompatible hardware and workloads.

---

## 🤖 17. SGLang and AI Agents

SGLang is especially relevant to AI systems that make many model calls.

An agent might request a plan, select a tool, inspect a result, and generate a final answer. Each stage can require additional model inference.

```text
User
 ↓
AI Agent
 ├── Model call: plan
 ├── Model call: choose tool
 ├── Tool execution
 ├── Model call: inspect result
 └── Model call: final response
             ↓
       SGLang Server
             ↓
   Scheduling + Model Execution
             ↓
       Generated Tokens
```

Shared instructions and repeated context can make prefix caching useful for agentic workloads.

SGLang serves the model used by the agent; it does not replace the agent's workflow or decision-making framework.

---

## ⚖️ 18. SGLang vs vLLM vs Ollama

| Tool | Primary focus |
|---|---|
| SGLang | High-performance inference and serving, including agentic workloads |
| vLLM | High-throughput model serving and efficient memory management |
| Ollama | Convenient local model execution and developer workflows |
| Hugging Face Transformers | Flexible model loading, inference, research, and development |

These tools overlap, but they are not identical.

SGLang and vLLM are useful for studying the serving-runtime layer. Ollama is often more convenient for quick local experiments, while Transformers offers a broad model-development interface.

The best choice depends on your hardware, deployment target, model support, and performance requirements.

---

## 💻 19. Hardware and Environment Considerations

SGLang supports multiple accelerator and platform families, but support for a platform does not imply that every model and optimization works on every device.

Before running a model, verify:

- Operating system and installation method.
- Python and package compatibility.
- Accelerator type and driver requirements.
- Available memory.
- Model size and supported architecture.
- Runtime version.
- Required model-specific configuration.

A practical approach is to keep the lightweight client and notes in the local learning repository while using a compatible remote server for model inference if your laptop cannot support the desired configuration.

Do not install a heavyweight runtime blindly into an unrelated Python environment.

---

## 🔐 20. Security and Reliability

An inference server can expose powerful models to applications and users. Its API should be treated as a service that requires operational controls.

Important considerations:

- Protect the server endpoint.
- Use authentication where appropriate.
- Avoid exposing an unauthenticated service to the public internet.
- Apply resource and request limits.
- Monitor latency, errors, and memory usage.
- Validate client inputs.
- Protect private prompts and model outputs.
- Record metrics without leaking secrets.

A successful response from a local test is not proof that the deployment is ready for production.

---

## 📁 21. Project Structure

Suggested structure for the Day 15 learning project:

```text
Day_15_SGLang/
│
├── README.md
├── client.py
├── requirements.txt
├── .env.example
├── .gitignore
├── notes/
│   └── concepts.md
└── benchmarks/
    └── README.md
```

The client can use a lightweight Python environment even if the actual inference server runs remotely.

Example `.gitignore`:

```gitignore
.venv/
.env
__pycache__/
*.pyc
models/
benchmarks/*.jsonl
```

Do not commit API credentials, large model files, private prompts, or unrelated environment files.

---

## 🧠 22. Key Takeaways

### Takeaway 1 — Models and runtimes are different

The model generates outputs; the runtime manages execution and serving.

### Takeaway 2 — Prefill and decode have different characteristics

The input context is processed before or as generation begins, while subsequent tokens are generated autoregressively.

### Takeaway 3 — KV caching is a major memory and performance concern

Caching reusable attention state can reduce redundant computation, but consumes memory.

### Takeaway 4 — RadixAttention supports prefix reuse

Compatible requests can reuse cached computation associated with shared token prefixes.

### Takeaway 5 — Scheduling matters

Continuous batching can improve resource utilization under concurrent workloads.

### Takeaway 6 — Performance requires measurement

Latency, throughput, concurrency, and cache behavior provide different views of serving performance.

### Takeaway 7 — Inference infrastructure supports agentic systems

Efficient model serving can improve the infrastructure behind agents that make multiple model calls.

---

## 🚀 23. Future Improvements

After the basic client/server experiment works, explore:

1. Comparing SGLang and vLLM under the same workload.
2. Measuring TTFT and inter-token latency.
3. Investigating prefix-cache behavior.
4. Studying continuous batching under concurrency.
5. Exploring quantization and memory usage.
6. Learning about speculative decoding.
7. Investigating prefill/decode disaggregation.
8. Serving structured outputs.
9. Integrating a compatible endpoint into an AI agent.
10. Comparing performance across supported hardware.

These are future experiments rather than requirements for the first session.

---

## 📚 24. Official References

- [SGLang official website](https://www.sglang.io/)
- [SGLang GitHub repository](https://github.com/sgl-project/sglang)
- [SGLang documentation](https://docs.sglang.io/)
- [SGLang Cookbook](https://cookbook.sglang.io/)
- [SGLang serving benchmark guide](https://docs.sglang.ai/developer_guide/bench_serving)
- [vLLM documentation](https://docs.vllm.ai/)
- [Hugging Face Transformers documentation](https://huggingface.co/docs/transformers/)

Use the current official installation and model-specific guides when running commands because hardware support, model identifiers, and installation instructions evolve.

---

## 🏁 Final Summary

Day 15 explores the infrastructure behind serving large language models efficiently.

The main architecture is:

```text
Application
    ↓
Serving API
    ↓
Request Scheduler
    ↓
Prefill / Decode
    ↓
Model Execution + KV Cache
    ↓
Generated Tokens
    ↓
Streaming or Final Response
```

The central lesson is that high-performance AI applications depend on more than model quality. They also depend on the runtime that manages computation, memory, request scheduling, and response delivery.

> **Day 15 takeaway:** SGLang demonstrates how an inference runtime turns a model into a scalable serving system by optimizing token generation, cache reuse, request scheduling, and hardware utilization.
