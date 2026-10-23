# ⚡ Day 18 — Speculative Decoding: Faster LLM Inference

> **Today's experiment:** Explore how a smaller draft model can help a larger target model generate tokens faster, then benchmark ordinary generation against speculative decoding.

## 📌 Overview

Large language models typically generate text autoregressively: they predict a token, update their context, and continue generating the next token.

This sequential process can become a bottleneck, especially when a model is generating long responses.

**Speculative decoding** is an inference optimization technique that uses a faster draft mechanism to propose multiple candidate tokens. A target model then verifies the proposed continuation and corrects rejected proposals.

With standard lossless speculative decoding, the goal is to accelerate generation while preserving the target model's output distribution.

Today's experiment compares:

1. Ordinary generation using a target model.
2. Assisted generation using the same target model and a smaller assistant model.
3. Generation time, output tokens per second, and observed output differences.

The central question is:

> Can speculative decoding reduce the time required to generate a response on my actual hardware?

---

## 🎯 Learning Objectives

- Understand autoregressive language-model generation.
- Understand the target model and draft model.
- Learn how candidate tokens are proposed and verified.
- Understand token acceptance and rejection.
- Learn what speculative decoding means by lossless generation.
- Explore speculative decoding using Hugging Face Transformers.
- Compare baseline and speculative generation.
- Measure elapsed time and output tokens per second.
- Calculate observed speedup.
- Understand why speculative decoding may not improve every workload.
- Explore alternative implementations in vLLM and llama.cpp.
- Record the experiment and its limitations.

---

## 🧠 1. The Problem: Sequential Token Generation

A language model usually generates output one token at a time.

For example:

```text
Prompt
  ↓
Generate token 1
  ↓
Generate token 2
  ↓
Generate token 3
  ↓
Generate token 4
  ↓
Continue until completion
```

Each generation step requires model computation.

For a large model, repeatedly executing the target model can make interactive generation slow.

This is particularly important for applications such as:

- Conversational assistants.
- Coding assistants.
- Interactive AI tools.
- Streaming text generation.
- Applications where users wait for responses.

The objective is not necessarily to change the model's intelligence. It is to reduce the cost of producing its output.

---

## ⚡ 2. What Is Speculative Decoding?

Speculative decoding uses a fast draft mechanism to propose multiple candidate tokens for a larger target model to verify.

### Target model

The target model is the model whose output distribution you want to preserve.

### Draft model

The draft model is a smaller, faster model that proposes candidate tokens.

### Verification

The target model checks the candidate continuation. Accepted tokens can be retained, while rejected proposals are corrected using the target model's decoding procedure.

```text
                   User Prompt
                       |
                       v
                Small Draft Model
                       |
                       v
                Candidate Tokens
                       |
                       v
               Large Target Model
                  Verification
                       |
               +-------+-------+
               |               |
               v               v
          Accepted          Rejected
            tokens          proposals
               |               |
               |          Correct output
               +-------+-------+
                       |
                       v
                Final Response
```

The target model remains responsible for the final result.

The draft model does not simply replace the larger model, and the system does not blindly trust its predictions.

---

## 🔍 3. Why Can It Be Faster?

Ordinary generation requires repeated sequential execution of the target model.

Speculative decoding instead allows the target model to verify a group of proposed tokens in one forward pass.

This can reduce the number of expensive sequential target-model steps required to produce a response.

The important distinction is:

- Ordinary generation repeatedly generates the next target-model token.
- Speculative decoding proposes multiple tokens and verifies the continuation together.

The target model still performs the verification work. Speedup depends on the efficiency of drafting, verification, and correction.

### Important limitation

Speculative decoding is not guaranteed to be faster.

Its performance depends on:

- Target-model size.
- Draft-model size.
- Draft-token acceptance rate.
- Verification overhead.
- Hardware and memory bandwidth.
- Prompt and output lengths.
- Batch size and workload.
- Runtime implementation.

The experiment must determine whether the optimization helps on the hardware and model pair being tested.

---

## 🧩 4. Important Terminology

| Term | Meaning |
|---|---|
| Target model | The main model whose output distribution is preserved |
| Draft model | The smaller model proposing candidate tokens |
| Draft tokens | Candidate tokens proposed by the draft mechanism |
| Verification | The target model evaluates the proposed continuation |
| Acceptance rate | Fraction of proposed tokens accepted by the verifier |
| Speculation length | Number of tokens proposed in a speculative step |
| Speedup | Baseline generation time divided by speculative generation time |
| Greedy decoding | Select the highest-probability token at each step |
| Lossless speculative decoding | Preserve the target model's output distribution |

A high acceptance rate can be helpful, but it does not automatically guarantee high speedup. The cost of producing and verifying the draft tokens also matters.

---

## 🔬 5. Different Speculative-Decoding Methods

### Draft-model speculation

A separate, smaller language model proposes candidate tokens for the target model.

This is the main method explored in today's experiment.

### Prompt lookup / n-gram speculation

The system looks for repeated token patterns in the prompt or previous context and proposes continuations from those patterns.

This can be useful for input-grounded tasks such as summarization and some code-generation workloads.

### Multi-Token Prediction (MTP)

A compatible model uses additional prediction layers or heads to propose future tokens. This requires a model trained with the relevant capabilities.

### EAGLE and related methods

These use specialized draft mechanisms and model-specific components to propose candidate continuations.

Support depends on the runtime, model architecture, and available checkpoints.

These methods share the goal of reducing sequential generation cost, but their implementation and hardware requirements differ.

---

## 🛠️ 6. Experiment Environment

This project uses:

- Python.
- PyTorch.
- Hugging Face Transformers.
- A target language model.
- A compatible assistant model.
- A timer for measuring generation performance.

The first experiment uses the Transformers assisted-generation interface rather than requiring a dedicated inference server.

### Suggested model pair

- **Target:** `HuggingFaceTB/SmolLM-1.7B`
- **Assistant:** `HuggingFaceTB/SmolLM-135M`

These models are from the same family, making them a reasonable pair for an introductory experiment. Verify that the selected versions remain supported by the installed Transformers release.

The target and assistant must both fit in available memory. If the pair is too large for your laptop, use a smaller compatible pair.

Official reference: https://huggingface.co/docs/transformers/assisted_decoding

---

## 📁 7. Project Structure

```text
Day_18_Speculative_Decoding/
│
├── README.md
├── benchmark.py
├── requirements.txt
├── .gitignore
└── results/
    └── experiment_log.md
```

The model files should remain in a model cache or external model directory, not inside the Git repository.

---

## 🐍 8. Environment Setup

Create a virtual environment in the project folder:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1

python -m pip install torch transformers
```

To keep Hugging Face model downloads on D:, configure the cache before loading the models:

```powershell
$env:HF_HOME = "D:\pm-cache\huggingface-cache"
```

This setting applies to the current PowerShell session. Create the directory if needed and check available disk space before downloading.

PyTorch and the two model checkpoints may require substantial storage and memory.

---

## 🧪 9. Baseline vs. Speculative Experiment

The experiment runs the same target model in two modes.

### Mode A — Baseline

The target model generates the response without an assistant model.

### Mode B — Speculative decoding

The target model uses a smaller assistant model to propose candidate tokens.

### Controlled settings

Keep these consistent:

- Target model.
- Input prompt.
- Maximum generated tokens.
- Decoding strategy.
- Runtime environment.

The assistant model is the intended experimental difference.

---

## 💻 10. Benchmark Implementation

Create `benchmark.py`:

```python
import statistics
import time

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

TARGET_ID = "HuggingFaceTB/SmolLM-1.7B"
ASSISTANT_ID = "HuggingFaceTB/SmolLM-135M"

MAX_NEW_TOKENS = 128
REPEATS = 3
DEVICE = "cpu"

PROMPT = (
    "Explain speculative decoding in a beginner-friendly way. "
    "Describe the target model, draft model, token verification, "
    "and why this technique can improve inference speed."
)

print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(TARGET_ID)

print("Loading target model...")
target = AutoModelForCausalLM.from_pretrained(
    TARGET_ID,
    dtype="auto",
).to(DEVICE).eval()

print("Loading assistant model...")
assistant = AutoModelForCausalLM.from_pretrained(
    ASSISTANT_ID,
    dtype="auto",
).to(DEVICE).eval()

inputs = tokenizer(PROMPT, return_tensors="pt")
inputs = {key: value.to(DEVICE) for key, value in inputs.items()}


def generate(use_speculation):
    start = time.perf_counter()

    with torch.inference_mode():
        if use_speculation:
            output = target.generate(
                **inputs,
                assistant_model=assistant,
                do_sample=False,
                max_new_tokens=MAX_NEW_TOKENS,
            )
        else:
            output = target.generate(
                **inputs,
                do_sample=False,
                max_new_tokens=MAX_NEW_TOKENS,
            )

    elapsed = time.perf_counter() - start

    prompt_length = inputs["input_ids"].shape[1]
    generated_tokens = output.shape[1] - prompt_length

    generated_text = tokenizer.decode(
        output[0, prompt_length:],
        skip_special_tokens=True,
    )

    speed = generated_tokens / elapsed if elapsed else 0

    return {
        "elapsed": elapsed,
        "tokens": generated_tokens,
        "tokens_per_second": speed,
        "text": generated_text,
    }


def summarize(name, results):
    times = [item["elapsed"] for item in results]
    speeds = [item["tokens_per_second"] for item in results]

    print(f"\n{name}")
    print(f"Median time: {statistics.median(times):.3f} seconds")
    print(f"Median output speed: {statistics.median(speeds):.2f} tokens/s")


print("\nWarm-up...")
generate(False)
generate(True)

baseline_results = []
speculative_results = []

for run in range(1, REPEATS + 1):
    print(f"\nRun {run}/{REPEATS}")

    baseline_results.append(generate(False))
    speculative_results.append(generate(True))

summarize("BASELINE", baseline_results)
summarize("SPECULATIVE", speculative_results)

baseline_time = statistics.median(
    result["elapsed"] for result in baseline_results
)

speculative_time = statistics.median(
    result["elapsed"] for result in speculative_results
)

speedup = (
    baseline_time / speculative_time
    if speculative_time > 0
    else 0
)

print("\n=== PERFORMANCE COMPARISON ===")
print(f"Baseline: {baseline_time:.3f}s")
print(f"Speculative: {speculative_time:.3f}s")
print(f"Observed speedup: {speedup:.2f}x")

print(
    "Output text matches:",
    baseline_results[-1]["text"]
    == speculative_results[-1]["text"],
)

print("\n=== SPECULATIVE OUTPUT ===")
print(speculative_results[-1]["text"])
```

### Important implementation notes

- The example uses CPU inference to avoid assuming a particular GPU configuration.
- You can investigate GPU execution later if the installed PyTorch build and hardware support it.
- The code measures total generation time and output tokens per second.
- It does not directly report the assistant's token acceptance rate.
- The output comparison is a diagnostic check, not a complete proof of distributional equivalence.
- If model loading fails, verify checkpoint compatibility, available memory, and the installed Transformers version.
- If the target and assistant are incompatible, choose a documented compatible model pair rather than forcing generation.

---

## ▶️ 11. Running the Experiment

Execute:

```powershell
python benchmark.py
```

The first run downloads model files and initializes the models. That setup time is not included in the generation timing function.

The script performs a warm-up and repeats both generation modes.

Record the following:

- Whether both models loaded.
- Baseline median generation time.
- Speculative median generation time.
- Output tokens per second.
- Whether the outputs matched.
- Any memory errors or runtime warnings.

A CPU-based experiment may show little speedup or even a slowdown. That is a valid finding if measured correctly.

---

## 📈 12. Calculating Speedup

Use the following formula:

\[
\text{Speedup} =
\frac{\text{Baseline generation time}}
{\text{Speculative generation time}}
\]

For example, if ordinary generation takes 10 seconds and speculative generation takes 7 seconds:

\[
\text{Speedup} = \frac{10}{7} \approx 1.43\times
\]

The speculative run is approximately 1.43 times as fast for that measurement.

The percentage reduction in generation time is:

\[
\text{Time reduction} =
\frac{T_{\text{baseline}}-T_{\text{speculative}}}
{T_{\text{baseline}}}\times100\%
\]

These numbers are illustrative, not benchmark results from this project.

---

## 📊 13. Results Table

Fill in the table using actual measurements.

| Metric | Baseline | Speculative |
|---|---|---|
| Target model | Record actual model | Same target model |
| Assistant model | None | Record actual model |
| Median generation time | Pending measurement | Pending measurement |
| Median output tokens/s | Pending measurement | Pending measurement |
| Output tokens | Record actual value | Record actual value |
| Output text | Record observations | Record observations |
| Memory usage | Record if measured | Record if measured |

### Questions to investigate

1. Was speculative generation faster?
2. Did output tokens per second increase?
3. Did the assistant introduce additional memory usage?
4. Did the generated text match under greedy decoding?
5. Did the result vary between repeated runs?
6. Could CPU overhead explain a lack of speedup?
7. What additional measurements would make the experiment more reliable?

Do not insert fabricated measurements into the README.

---

## ⚖️ 14. Why Speculative Decoding May Be Slower

Speculative decoding introduces extra work.

The assistant model must generate draft tokens, and the target model must verify them.

It may underperform when:

- The assistant is too expensive relative to the target.
- Draft tokens are frequently rejected.
- The target model already generates efficiently.
- Memory pressure is high.
- The workload is dominated by prompt processing.
- The implementation does not fit the hardware well.

A high acceptance rate is useful, but speedup also depends on the cost of drafting and verification.

---

## 🔄 15. Alternative Experiment: vLLM

vLLM supports several speculative-decoding methods, including draft models, EAGLE, MTP, n-gram, and suffix-based approaches.

Official documentation:

https://docs.vllm.ai/en/latest/features/speculative_decoding/

An example configuration for prompt-lookup speculation is:

```bash
vllm serve <target-model> \
  --speculative-config '{"method":"ngram","num_speculative_tokens":4,"prompt_lookup_min":2,"prompt_lookup_max":5}'
```

Replace `<target-model>` with a supported model identifier. Check the installed vLLM version's configuration and hardware requirements before running the command.

**Note:** n-gram speculation is different from using a separate draft language model. It is an alternative method for exploring the same broad optimization goal.

---

## 🦙 16. Alternative Experiment: llama.cpp

llama.cpp also supports speculative decoding.

Its documentation covers draft-model speculation and other approaches, along with server-side statistics and benchmarking guidance.

Reference:

https://github.com/ggml-org/llama.cpp/blob/master/docs/speculative.md

This makes llama.cpp a useful next step if you want to investigate speculative decoding within a local inference runtime.

For the initial experiment, keep one implementation fixed so that the baseline and speculative measurements remain comparable.

---

## 🔗 17. Connection to Previous AI Learning Days

| Day | Topic | Main performance question |
|---|---|---|
| Day 15 | SGLang | How can a serving runtime execute requests efficiently? |
| Day 16 | llama.cpp | How do model format and inference settings affect local execution? |
| Day 17 | vLLM | How does concurrent request load affect throughput and latency? |
| **Day 18** | **Speculative decoding** | **Can drafting reduce sequential generation latency?** |

These experiments explore different levels of the AI inference stack.

Concurrency and batching focus on serving multiple requests. Speculative decoding focuses on accelerating token generation within a request.

---

## 🔐 18. Practical Considerations

- Model downloads may require substantial disk space.
- Both models must fit within available memory.
- The assistant and target must be compatible with the chosen implementation.
- CPU and GPU measurements should not be compared without accounting for hardware differences.
- Model loading time should be separated from generation time.
- Warm-up and repeated runs improve measurement quality.
- A single run is not sufficient to establish a reliable performance result.
- Never claim a speedup unless it was actually measured.

---

## 📁 19. Suggested `.gitignore`

```gitignore
.venv/
__pycache__/
*.pyc
.env
models/
*.gguf
results/*.jsonl
```

Keep large model files outside the repository. Commit the script, documentation, and useful non-sensitive benchmark results instead.

---

## 📚 20. Official References

- [Hugging Face — Assisted Decoding](https://huggingface.co/docs/transformers/assisted_decoding)
- [vLLM — Speculative Decoding](https://docs.vllm.ai/en/latest/features/speculative_decoding/)
- [llama.cpp — Speculative Decoding](https://github.com/ggml-org/llama.cpp/blob/master/docs/speculative.md)
- [vLLM Speculators](https://github.com/vllm-project/speculators)
- [Hugging Face Transformers](https://github.com/huggingface/transformers)

---

## 🏁 Final Summary

Day 18 explores a technique for reducing the sequential cost of generating tokens from a large language model.

The workflow is:

```text
Load Target Model
        ↓
Run Baseline Generation
        ↓
Load Compatible Assistant Model
        ↓
Run Speculative Generation
        ↓
Measure Both
        ↓
Calculate Speedup
        ↓
Document Findings
```

The main takeaway is that speculative decoding uses a faster draft mechanism to propose tokens and a target model to verify them. When drafting and verification are efficient, generation can become faster while preserving the target model's output distribution.

**Completion criteria:** run both generation modes, measure them repeatedly, compare output tokens per second, calculate observed speedup, and document what actually happened on the tested hardware.