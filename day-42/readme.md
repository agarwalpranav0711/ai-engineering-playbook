# 🦙 Day 16 — llama.cpp: Local LLM Inference

> Exploring how to run large language models locally, understand GGUF quantization, and experiment with inference settings beyond a simple `ollama run` command.

## 📌 Overview

Day 16 focuses on **llama.cpp**, an open-source C/C++ inference engine designed to run large language models efficiently across a wide range of hardware.

Instead of relying only on a high-level tool that hides most runtime details, llama.cpp lets developers explore how models are loaded, how tokens are generated, how inference settings affect responses, and how local model servers expose APIs to applications.

The main experiment is:

**Load a small model → Run inference → Change settings → Compare outputs**

The central lesson:

> Running a local LLM is not just about choosing a model. It is also about understanding the model format, memory requirements, inference runtime, sampling parameters, and hardware configuration.

---

## 🎯 Learning Objectives

- Understand what llama.cpp is and why it exists.
- Understand the difference between a model, an inference runtime, and a model-serving application.
- Learn what GGUF model files contain.
- Understand model quantization and its trade-offs.
- Load and run a small local language model.
- Experiment with temperature, top-k, top-p, and maximum output tokens.
- Understand context length and its memory implications.
- Explore CPU inference and optional GPU acceleration.
- Observe prompt processing and token generation.
- Run a local inference server.
- Send requests to the server through an API.
- Record response quality, latency, and resource usage.
- Document the experiment and its limitations.

---

## 🧠 1. What Is llama.cpp?

llama.cpp is an open-source project for running LLM inference in C/C++ with a focus on efficient execution and broad hardware support.

It supports quantized model formats, CPU inference, and acceleration through supported backends such as CUDA, Metal, Vulkan, and other platform-specific implementations.

Its main purpose is to make local and remote model inference practical without requiring every application to run through a heavyweight, high-level machine-learning framework.

### Why use llama.cpp?

A model may contain billions of learned parameters. Loading and executing it requires memory, numerical computation, tokenization, and a generation loop.

llama.cpp provides the infrastructure for these operations and gives developers more direct control over inference.

It is useful for:

- Running models locally.
- Experimenting with quantized models.
- Understanding inference settings.
- Building local AI applications.
- Serving models through an HTTP API.
- Exploring CPU and GPU inference.
- Integrating local models into other applications.

Official project: https://github.com/ggml-org/llama.cpp

---

## 🔍 2. llama.cpp vs Ollama

Ollama and llama.cpp are related, but they provide different developer experiences.

| Aspect | llama.cpp | Ollama |
|---|---|---|
| Primary role | Inference engine and runtime | Convenient local model-running experience |
| Model format | Commonly GGUF | Uses a model-management and packaging workflow that can incorporate GGUF |
| Runtime control | Exposes many inference and sampling options | Provides a simplified model and API workflow |
| CLI | Direct inference and server commands | Convenient commands such as `ollama run` |
| API serving | Includes an HTTP server with OpenAI-compatible endpoints | Provides a local HTTP API |
| Learning focus | Runtime, model loading, quantization, sampling and serving | Convenient model execution and application integration |

The two are not mutually exclusive. Ollama can use llama.cpp technology internally, depending on the implementation and version.

**Today's goal is to explore the inference layer more directly**, rather than merely downloading a model and chatting with it.

---

## ⚙️ 3. The Local Inference Architecture

A simplified local inference system looks like this:

```text
User Prompt
    ↓
Tokenizer
    ↓
Token IDs
    ↓
Inference Runtime
    ↓
Model Computation
    ↓
Token Sampling
    ↓
Generated Token IDs
    ↓
Detokenization
    ↓
Text Response
```

The runtime manages model loading, computation, memory, and token generation.

The sampler determines how the next token is selected from the model's output probabilities.

The tokenizer and detokenizer convert between text and the token representation used by the model.

These components work together to turn a prompt into a response.

---

## 📦 4. What Is GGUF?

GGUF is a model-file format commonly used by llama.cpp.

A GGUF file stores model information and tensors, together with metadata needed to load and execute a supported model.

Depending on the model, its contents can include:

- Model weights.
- Model architecture metadata.
- Tokenizer information.
- Special-token configuration.
- Quantization information.
- Context and model parameters.
- Other model-specific metadata.

A model distributed as a GGUF file can often be downloaded and run without first converting it into a different framework's checkpoint format.

However, not every model architecture or model variant is automatically supported by every llama.cpp release.

### Why does GGUF matter?

A model's architecture and weights describe what the model has learned. The runtime needs a compatible representation of those weights and the associated metadata to execute it.

GGUF provides a standardized container for this purpose within the llama.cpp ecosystem.

---

## 🔢 5. What Is Quantization?

Quantization represents model weights using lower-precision numerical formats.

For example, a model may use 16-bit floating-point weights or a quantized representation using approximately 4 bits per weight, depending on the selected format.

Quantization can reduce model memory requirements and may improve inference speed on supported hardware.

### Common quantization labels

| Label | General meaning |
|---|---|
| F16 | 16-bit floating-point representation |
| Q8_0 | 8-bit quantized format |
| Q6_K | 6-bit K-quant format |
| Q5_K_M | 5-bit K-quant variant |
| Q4_K_M | 4-bit K-quant variant |
| Q3_K_M | 3-bit K-quant variant |
| Q2_K | 2-bit K-quant format |

These labels identify particular representations; they are not exact predictions of the final file size or quality.

### Quantization trade-offs

| Lower precision | Higher precision |
|---|---|
| Usually requires less model-weight memory | Usually requires more memory |
| Can be faster on compatible hardware | May preserve more numerical information |
| Can introduce greater quantization error | Often reduces quantization error |
| Useful for constrained hardware | Useful when memory permits |

Actual quality and speed depend on the model, quantization method, hardware, runtime, and workload.

**Important:** quantization reduces the storage needed for model weights, but it does not eliminate the memory needed for the context, KV cache, computation, and other runtime structures.

---

## 💾 6. Model Size and Memory

Before loading a model, check its file size and the memory available on your machine.

For a rough estimate, the storage for raw model weights is:

\[
\text{Weight size in bytes}
\approx
\frac{\text{Number of parameters}\times\text{Bits per parameter}}{8}
\]

For example, a hypothetical 1-billion-parameter model using 4-bit weights has a raw weight-size estimate of:

\[
\frac{1{,}000{,}000{,}000\times4}{8}
=500{,}000{,}000\text{ bytes}
\]

That is approximately 500 MB in decimal units, before metadata, quantization overhead, and runtime memory.

The actual GGUF file may be larger.

Total runtime memory must also accommodate the KV cache, temporary buffers, and other execution requirements.

A small model is therefore a good starting point for this experiment.

---

## 🧪 7. Hands-On Experiment

### Objective

Load a small GGUF model, generate a response locally, and compare the effects of different inference settings.

### Suggested starting model

The official llama.cpp README currently demonstrates this model:

`ggml-org/Qwen3.5-0.8B-GGUF`

It is a small model suitable for a first exploration, but actual performance depends on the hardware, runtime version, and supported model features.

Before running it, verify the model's current repository contents and the version-specific instructions.

Official project: https://github.com/ggml-org/llama.cpp

### Experiment plan

1. Install or obtain a compatible llama.cpp build.
2. Run the model with default settings.
3. Record the response and execution time.
4. Change temperature.
5. Change top-p and top-k.
6. Change the maximum number of generated tokens.
7. Repeat the same prompt under each configuration.
8. Compare the responses.
9. Optionally start a local server and send a request from Python.

---

## 🛠️ 8. Getting Started on Windows

For Windows, the simplest starting point is usually a compatible prebuilt binary from the official releases.

Official releases:

https://github.com/ggml-org/llama.cpp/releases

Alternatively, follow the official build guide if you need to compile llama.cpp yourself.

### Step 1 — Create a project folder

Since I prefer to keep development work on D:, a possible location is:

```powershell
New-Item -ItemType Directory -Force -Path "D:\AI-Learning\Day_16_llama_cpp"
Set-Location "D:\AI-Learning\Day_16_llama_cpp"
```

Adjust the path to match the actual location of your daily AI-learning repository.

### Step 2 — Obtain llama.cpp

Download a Windows build compatible with your machine from the official releases page.

Choose a build that matches your hardware and supported backend.

For a first CPU-based experiment, use a compatible CPU build rather than assuming that a CUDA-enabled build will work.

Extract the files into a project tools directory or another location of your choice.

### Step 3 — Verify the executable

If the downloaded version provides the current unified CLI, check:

```powershell
.\llama-cli.exe --help
```

The executable names can vary between release packages. Some versions use separate binaries such as `llama-cli.exe` and `llama-server.exe`, while the current unified CLI also exposes commands such as `llama cli` and `llama serve`.

Always use the commands supported by the build you actually downloaded.

### Step 4 — Choose a model location

For example:

```text
D:\AI-Models\GGUF\
```

Store model files there rather than repeatedly downloading them into the project folder.

Large models should not be committed to GitHub.

---

## 🚀 9. Run a Model

The current official llama.cpp README demonstrates running a model directly from Hugging Face using the unified CLI.

For a compatible build:

```powershell
llama cli -hf ggml-org/Qwen3.5-0.8B-GGUF
```

This approach downloads the model as needed and starts an interactive session.

The first run requires network access and enough disk space for the model and any required files.

If your build uses the separate executable interface, follow that release's documented model-path and argument syntax instead.

### What to observe

- Does the model load successfully?
- How much memory does it use?
- How long does initial loading take?
- How quickly does the first response begin?
- Does generation continue at a steady rate?
- What happens if the prompt becomes longer?

Record actual results instead of assuming that a model will run at a particular speed.

---

## 🎛️ 10. Experiment With Inference Settings

Inference settings influence how tokens are selected and how much output is generated.

The following parameters are especially useful for today's experiment.

### Temperature

Temperature controls the sharpness of the probability distribution used during sampling.

- Lower temperature generally favors more likely tokens.
- Higher temperature generally permits more varied choices.
- Temperature does not guarantee correctness or creativity.

Example:

```text
Low temperature  → More conservative sampling
High temperature → More varied sampling
```

### Top-k

Top-k restricts token selection to a set of the K most likely candidates before subsequent sampling stages.

A smaller value restricts the candidate set more strongly.

### Top-p

Top-p, also called nucleus sampling, selects from a set of candidate tokens whose cumulative probability reaches the configured threshold.

A smaller threshold generally narrows the candidate set.

### Maximum output tokens

This setting limits how many tokens the model may generate for the response.

It is useful for controlling response length, runtime, and memory-related workload.

### Context size

The context size determines how much token context the runtime can accommodate.

A larger context can allow longer prompts and conversation histories, but it can also increase memory consumption, especially when the KV cache grows.

The exact meaning of each option depends on the runtime interface. Use the current CLI help for your installed version.

---

## 🧪 11. Controlled Sampling Experiment

Use the same prompt for each run:

> Explain the difference between an AI model and an inference runtime in five simple bullet points.

Keep the model, prompt, and output-token limit the same while changing one sampling parameter at a time.

| Run | Temperature | Top-k | Top-p | Purpose |
|---|---:|---:|---:|---|
| A | 0.1 | 40 | 0.95 | More conservative sampling |
| B | 0.7 | 40 | 0.95 | Moderate variation |
| C | 1.0 | 40 | 0.95 | Higher sampling randomness |
| D | 0.7 | 10 | 0.95 | Narrower top-k candidate set |
| E | 0.7 | 40 | 0.80 | Narrower nucleus candidate set |

These are illustrative experiment settings, not universal optimal values.

If the installed CLI supports the documented options, a run might look like:

```powershell
llama-cli.exe -m "D:\AI-Models\GGUF\model.gguf" -p "Explain the difference between an AI model and an inference runtime in five simple bullet points." -n 150 --temp 0.1 --top-k 40 --top-p 0.95
```

Replace the model path and executable name with the actual ones from your installation. Confirm the options using `--help`.

If you use the unified CLI, the equivalent invocation syntax may differ.

### What to record

- Was the response more repetitive or more varied?
- Did it stay focused on the question?
- Did it follow the requested bullet-point format?
- Did it finish within the output-token limit?
- How did response time change?
- Did changing a setting make an obvious difference?

Sampling is stochastic, so different outputs do not prove that one configuration is universally better. A controlled experiment should compare several runs and distinguish observed variation from reliable trends.

---

## 📏 12. Other Important Inference Parameters

### Seed

A fixed seed can help make sampling experiments more reproducible under the same runtime, model, settings, and execution conditions.

It does not guarantee bit-for-bit identical results across all hardware and runtime configurations.

### Repeat penalty

Repeat penalties can discourage the model from repeating recent tokens or phrases.

Excessive penalties may make output unnatural or cause the model to avoid words that it legitimately needs.

### Stop sequences

Stop sequences tell the generator to stop when a configured sequence is encountered.

They are useful for controlling output boundaries in some completion workflows.

### Batch size and parallel requests

Batching and parallelism can affect throughput, memory usage, and latency.

A setting that improves throughput under concurrent requests may not improve latency for a single prompt.

### GPU offloading

When using a compatible GPU backend, some model layers or computation can be offloaded to the GPU.

The appropriate configuration depends on the GPU, available VRAM, driver, backend, and model.

For an initial experiment, establish a working CPU or default configuration before attempting advanced GPU tuning.

---

## 🌐 13. Run a Local Inference Server

llama.cpp can expose a local HTTP server that applications can call.

The current official README demonstrates this form:

```powershell
llama serve -hf ggml-org/Qwen3.5-0.8B-GGUF
```

Check the actual executable and command syntax for the release you installed.

A server allows a separate client to send prompts instead of requiring the user to interact directly with the command-line interface.

### Server architecture

```text
Python Client
     ↓
HTTP Request
     ↓
llama.cpp Server
     ↓
Model Inference
     ↓
Generated Tokens
     ↓
HTTP Response
     ↓
Python Client
```

The server includes OpenAI-compatible endpoints, making it possible to reuse compatible client libraries.

Keep the server bound to a trusted local interface unless you have configured appropriate authentication and network protection.

---

## 🐍 14. Call the Local Server From Python

Install the Python client in a separate virtual environment if you want to explore the API:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install openai
```

Create `client.py`:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://127.0.0.1:8080/v1",
    api_key="local",
)

response = client.chat.completions.create(
    model="local-model",
    messages=[
        {
            "role": "system",
            "content": "You are a concise and helpful assistant.",
        },
        {
            "role": "user",
            "content": (
                "Explain temperature and top-p sampling "
                "with a simple example."
            ),
        },
    ],
    temperature=0.2,
    max_tokens=150,
)

print(response.choices[0].message.content)
```

This example assumes your server listens on port 8080 and accepts the placeholder model identifier. If your server uses a different port or requires a specific model identifier, update the configuration accordingly.

The server's model listing endpoint can help identify the model identifier it exposes.

The `local` API-key placeholder is only suitable when the server does not require real authentication. Do not expose an unauthenticated server to an untrusted network.

---

## 🌊 15. Try Streaming

Instead of waiting for the entire answer, you can request streamed output:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://127.0.0.1:8080/v1",
    api_key="local",
)

stream = client.chat.completions.create(
    model="local-model",
    messages=[
        {
            "role": "user",
            "content": "Explain GGUF quantization in simple words.",
        }
    ],
    stream=True,
    max_tokens=150,
)

for chunk in stream:
    if not chunk.choices:
        continue

    text = chunk.choices[0].delta.content

    if text:
        print(text, end="", flush=True)

print()
```

This demonstrates streaming at the client/API layer. It lets you observe incremental text delivery without waiting for the full response.

---

## 📊 16. Performance Metrics

Local inference performance depends on the model, quantization, hardware, context length, and runtime configuration.

Record the following metrics when available:

| Metric | Meaning |
|---|---|
| Model loading time | Time required to load the model |
| Time to first token | Delay before the first generated token |
| Prompt processing speed | Rate at which input tokens are processed |
| Generation speed | Rate at which output tokens are generated |
| End-to-end latency | Total time for a request |
| Memory usage | RAM and/or VRAM consumed |
| Output length | Number of generated tokens |
| CPU/GPU utilization | How the available hardware is used |

The runtime can report timing information for prompt processing and generation. Prefer measured values from your actual run over estimates.

### Experiment log

```text
Model:
GGUF quantization:
llama.cpp version:
Hardware:
Context size:
Temperature:
Top-k:
Top-p:
Maximum output tokens:
Model loading time:
Prompt processing speed:
Generation speed:
Memory usage:
Observed output:
```

---

## 🧩 17. llama.cpp in the AI Systems Stack

llama.cpp belongs to the model-inference layer.

```text
User
  ↓
Application / AI Agent
  ↓
Local HTTP API or CLI
  ↓
llama.cpp Runtime
  ↓
GGUF Model
  ↓
CPU / GPU Computation
  ↓
Generated Response
```

An AI agent can call a local llama.cpp server instead of relying on a remote hosted model, provided the model's capabilities are sufficient for the task.

This can be useful for experimentation, privacy-sensitive local workflows, offline applications, and reducing dependence on external inference APIs.

However, local inference does not automatically guarantee privacy or security. Application logging, stored prompts, exposed network endpoints, and local files still require appropriate protection.

---

## 🔐 18. Limitations and Practical Considerations

- Small models may be less capable than larger models.
- Quantization can affect output quality.
- CPU inference may be slower than a well-configured GPU deployment.
- Long contexts consume additional memory.
- Some model architectures or features may not be supported by every runtime version.
- GPU acceleration requires a compatible backend and environment.
- Local models can still produce inaccurate or unsafe responses.
- A working local CLI does not automatically mean the HTTP server or Python client is configured correctly.

The goal of Day 16 is to understand these trade-offs, not to maximize performance at any cost.

---

## 📁 19. Suggested Project Structure

```text
Day_16_llama_cpp/
│
├── README.md
├── client.py
├── requirements.txt
├── .gitignore
├── notes/
│   └── inference_settings.md
└── results/
    └── experiment_log.md
```

The GGUF model itself should remain outside the Git repository.

Example `.gitignore`:

```gitignore
.venv/
__pycache__/
*.pyc
.env
models/
*.gguf
results/*.jsonl
```

The `requirements.txt` file should contain only dependencies used by the project, such as the OpenAI Python client if you use the local server example.

If you only use the CLI, a Python environment may not be necessary at all.

---

## 💡 20. What I Learned

After completing the experiment, record the answers to these questions:

1. What is llama.cpp, and how is it different from a high-level model runner?
2. What is GGUF, and why is it useful for local inference?
3. What is quantization, and what trade-offs does it introduce?
4. How does the runtime generate tokens?
5. What does temperature change?
6. How do top-k and top-p affect sampling?
7. Why does context size affect memory usage?
8. How does CPU or GPU execution affect inference?
9. How can a local model be exposed through an HTTP API?
10. How do streaming and ordinary responses differ?
11. Which settings changed the output in my experiment?
12. What hardware and memory constraints did I observe?

---

## 🚀 21. Future Experiments

After the initial model works, consider:

- Comparing two quantization levels of the same model.
- Comparing CPU and GPU execution when supported.
- Measuring generation speed under different output lengths.
- Testing different context sizes.
- Comparing streaming and non-streaming responses.
- Comparing llama.cpp with Ollama and other serving runtimes.
- Integrating a local endpoint with an AI agent.
- Testing structured output or grammar constraints.
- Exploring supported multimodal models.
- Benchmarking repeated prompts and prefix-cache reuse.

These are optional extensions rather than requirements for the initial task.

---

## 📚 22. Official References

- [llama.cpp GitHub repository](https://github.com/ggml-org/llama.cpp)
- [Official llama.cpp releases](https://github.com/ggml-org/llama.cpp/releases)
- [llama.cpp build guide](https://github.com/ggml-org/llama.cpp/blob/master/docs/build.md)
- [llama.cpp server documentation](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md)
- [GGUF format documentation](https://github.com/ggml-org/ggml/blob/master/docs/gguf.md)

Use the current documentation for the specific release you install because command names, model support, and configuration options can evolve.

---

## 🏁 Final Summary

Day 16 explores local LLM inference through llama.cpp.

The central architecture is:

```text
Prompt
  ↓
Tokenizer
  ↓
Inference Runtime
  ↓
Model Computation
  ↓
Sampling
  ↓
Generated Tokens
  ↓
Response
```

The main lesson is that local inference involves more than downloading a model. Model format, quantization, memory, context length, sampling, hardware acceleration, and serving configuration all influence the final experience.

> **Day 16 takeaway:** llama.cpp gives developers a direct way to explore local model execution and experiment with the settings that control how a model generates its responses.

**Completion criteria:** load a small supported model, generate a response, change at least two inference settings, compare the outputs, and document the actual results. If you also start the server and call it from Python, record that as an additional experiment.