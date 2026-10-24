# 🧠 Day 19 — Quantization Tools: llama.cpp, GPTQ & AWQ

> **Daily AI Learning — Day 19**  
> Explore LLM quantization and compare how different weight precisions affect model size, memory consumption, inference speed, and output quality.

## 📌 Overview

Large language models contain millions or billions of learned parameters. Storing and processing these parameters requires memory and computational resources.

**Quantization** reduces the numerical precision used to represent model weights, often making models smaller and more practical to run on limited hardware.

Today's experiment focuses on comparing a less-quantized model with a more heavily quantized version of the same underlying model.

The main tools and methods explored are:

- **llama.cpp quantization:** Creating compact GGUF models for local inference.
- **GPTQ:** Calibration-based post-training quantization.
- **AWQ:** Activation-aware weight quantization.

The objective is to understand the trade-offs between model size, inference performance, and quality rather than assume that the smallest model is always the best.

---

## 🎯 Learning Objectives

- Understand quantization in large language models.
- Learn the difference between FP32, FP16, INT8, and INT4 representations.
- Understand GGUF and common llama.cpp quantization formats.
- Explore `Q8_0`, `Q5_K_M`, and `Q4_K_M`.
- Understand the basic ideas behind GPTQ and AWQ.
- Compare less-quantized and more heavily quantized versions of a model.
- Measure model file size and generation speed.
- Observe memory consumption when measurements are available.
- Compare generated responses for quality differences.
- Calculate file-size reduction and observed speedup.
- Document the limitations of the experiment.

---

## 🧠 1. What Is Quantization?

Quantization is a technique for representing numerical values using fewer bits.

LLMs store learned weights as numerical values. Instead of representing every weight using a higher-precision format, quantization maps weights into a lower-precision representation.

This can reduce model storage requirements and memory traffic during inference.

### A simple example

Suppose a model contains these illustrative weights:

```text
Original weights:
0.123456
0.789123
0.456789

Lower-precision representation:
0.12
0.79
0.46
```

This simplified example illustrates numerical approximation. Real LLM quantization uses specific numerical formats, scales, grouping, and quantization algorithms rather than simply rounding every weight to two decimal places.

### Why quantization matters

- Smaller model files.
- Lower weight-memory requirements.
- Potentially faster inference on compatible hardware.
- Possibility of running larger models within a fixed memory budget.

However, aggressive quantization can increase numerical error and reduce model quality. The actual effect depends on the model, quantization method, runtime, and hardware.

---

## 🔢 2. Understanding Weight Precision

| Representation | Bits per value | Approximate raw weight storage |
|---|---:|---:|
| FP32 | 32 | 4 bytes |
| FP16 | 16 | 2 bytes |
| INT8 | 8 | 1 byte |
| INT4 | 4 | 0.5 bytes |

These are theoretical raw-storage estimates. Actual quantized model files also contain scales, metadata, padding, and other overhead.

### Example: a 7-billion-parameter model

Ignoring overhead:

- FP32: approximately 28 GB.
- FP16: approximately 14 GB.
- INT8: approximately 7 GB.
- INT4: approximately 3.5 GB.

These figures use decimal gigabytes and estimate weight storage only. They do not represent the total memory required to run the model.

Runtime memory also includes the KV cache, computation buffers, and other structures.

**Key takeaway:** fewer bits generally mean less weight storage, but they do not guarantee proportionally higher generation speed.

---

## 🦙 3. llama.cpp Quantization

llama.cpp is an inference engine that supports local model execution across CPUs and supported accelerators.

Its quantization utility can convert compatible higher-precision GGUF models into smaller quantized GGUF files.

### Common GGUF formats

| Format | General characteristics |
|---|---|
| `F16` | Higher-precision floating-point weights |
| `Q8_0` | 8-bit quantization format |
| `Q6_K` | Higher-bit K-quant format |
| `Q5_K_M` | 5-bit K-quant mixed-precision recipe |
| `Q4_K_M` | 4-bit K-quant mixed-precision recipe |
| `Q3_K_M` | More aggressive 3-bit quantization |
| `Q2_K` | Very aggressive 2-bit quantization |

The number in a quantization label is an approximate indicator, not necessarily the exact effective number of bits per model parameter.

### Why use llama.cpp?

- Direct access to GGUF quantization.
- Convenient local inference.
- Support for CPU execution and supported accelerator backends.
- Multiple quantization choices.
- Straightforward model-size comparisons.

### Typical workflow

```text
Higher-precision model
          ↓
Compatible GGUF file
          ↓
llama-quantize
          ↓
Quantized GGUF file
          ↓
Run inference
          ↓
Measure size, speed, and quality
```

Official documentation:

https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md

---

## 🔬 4. GPTQ

GPTQ is a post-training quantization method that uses calibration information to reduce the error introduced when weights are quantized.

Instead of treating quantization as a simple file-compression operation, GPTQ uses an optimization procedure to determine how weights should be represented at lower precision.

### Main ideas

- Starts with an existing trained model.
- Uses representative calibration data.
- Quantizes weights, often to low-bit representations.
- Attempts to minimize quantization error.
- Requires compatible model-loading and inference support.

### When is GPTQ useful?

GPTQ is useful when a supported model and inference backend provide an effective low-bit quantized checkpoint.

It is especially relevant when the objective is to reduce weight-memory requirements while retaining useful model quality.

Current references:

- https://huggingface.co/docs/transformers/main/en/quantization/gptq
- https://github.com/ModelCloud/GPTQModel

**Important:** GPTQ is a quantization method and checkpoint ecosystem, not a guarantee of higher inference speed on every device. Hardware kernels and runtime compatibility matter.

---

## ⚡ 5. AWQ — Activation-aware Weight Quantization

AWQ stands for **Activation-aware Weight Quantization**.

The central idea is that some weight channels are more important to the model's behavior than others. Activation information can help identify these important channels and guide quantization so that important behavior is better preserved.

### Why is this useful?

Imagine two groups of model weights:

- One group strongly influences important model outputs.
- Another group has a smaller influence for typical inputs.

A quantization approach that accounts for activation behavior can protect important channels more effectively than one that treats every weight identically.

### Key characteristics

- Post-training quantization.
- Uses activation information to guide weight quantization.
- Commonly associated with low-bit weight formats.
- Requires compatible checkpoints and inference kernels.

References:

- https://github.com/mit-han-lab/llm-awq
- https://huggingface.co/docs/transformers/en/main_classes/quantization

AWQ and GPTQ aim at related goals, but use different approaches to managing quantization error.

---

## ⚖️ 6. Comparing the Three Approaches

| Dimension | llama.cpp quantization | GPTQ | AWQ |
|---|---|---|---|
| Main focus | GGUF quantization and local inference | Calibration-based quantization | Activation-aware quantization |
| Typical model representation | GGUF | GPTQ checkpoint | AWQ checkpoint |
| Calibration | Optional for basic quantization; importance data can improve some workflows | Typically used | Uses activation information |
| Common objective | Smaller models for local execution | Low-bit weights with controlled error | Low-bit weights while protecting important channels |
| Runtime | llama.cpp and compatible applications | Compatible GPTQ backends | Compatible AWQ backends |
| Practical consideration | CPU/GPU support and quantization type | Checkpoint and kernel compatibility | Checkpoint and kernel compatibility |

These approaches overlap in purpose but are not interchangeable formats. A model quantized using one method cannot automatically be loaded by every runtime that supports another.

---

## 🧪 7. Today's Experiment

### Objective

Compare two quantization levels of the same underlying model.

For example:

- Higher precision: `F16`.
- Less precise: `Q8_0`.
- More aggressive quantization: `Q4_K_M`.

Start with a comparison of `Q8_0` and `Q4_K_M` if suitable model files are available. Use `F16` as the reference if you have enough disk space and memory.

### Variables

**Independent variable:** model quantization format.

**Dependent variables:**

- Model file size.
- Memory usage.
- Prompt-processing speed.
- Output-generation speed.
- Response quality.

**Controlled variables:**

- Underlying model.
- Prompt.
- Maximum generated tokens.
- Context size.
- Runtime version.
- Thread count and hardware configuration.

A controlled experiment makes it easier to attribute observed differences to quantization rather than unrelated changes.

---

## 🛠️ 8. Prepare the Environment

Obtain a compatible llama.cpp build from:

https://github.com/ggml-org/llama.cpp/releases

Create a project folder:

```powershell
New-Item -ItemType Directory -Force `
  -Path "D:\AI-Learning\Day_19_Quantization_Tools"

Set-Location "D:\AI-Learning\Day_19_Quantization_Tools"
```

Use your actual daily AI-learning repository path if it differs.

Keep model files in a separate directory, for example:

```text
D:\AI-Models\GGUF\
```

This helps avoid duplicating large model files inside each daily project.

---

## 📦 9. Quantize a GGUF Model

If you have a compatible higher-precision GGUF file, you can create lower-precision versions using `llama-quantize`.

Example for Q8:

```powershell
.\llama-quantize.exe `
  "D:\AI-Models\GGUF\model-f16.gguf" `
  "D:\AI-Models\GGUF\model-q8_0.gguf" `
  Q8_0
```

Example for Q4:

```powershell
.\llama-quantize.exe `
  "D:\AI-Models\GGUF\model-f16.gguf" `
  "D:\AI-Models\GGUF\model-q4_k_m.gguf" `
  Q4_K_M
```

These are example commands. Replace the executable and model paths with the files you actually have, and verify supported quantization types with the installed utility's help.

If you only have the original Hugging Face model weights, you may first need to convert the model into a compatible GGUF representation using the supported conversion workflow.

If you download pre-quantized files instead, you can skip the conversion stage and proceed directly to inference.

**Do not requantize a heavily quantized model when a higher-precision source is available.** Requantization can significantly degrade model quality.

---

## ▶️ 10. Run Inference on Both Models

Use the same prompt and generation settings for both versions.

Example Q8 run:

```powershell
.\llama-cli.exe `
  -m "D:\AI-Models\GGUF\model-q8_0.gguf" `
  -p "Explain quantization in simple words with three examples." `
  -n 150 `
  -t 4
```

Example Q4 run:

```powershell
.\llama-cli.exe `
  -m "D:\AI-Models\GGUF\model-q4_k_m.gguf" `
  -p "Explain quantization in simple words with three examples." `
  -n 150 `
  -t 4
```

These commands assume a compatible executable interface. Use the syntax supported by your downloaded llama.cpp version.

Observe:

- Whether the model loads successfully.
- Time required to begin generating.
- Output-generation speed.
- Whether the answer follows the instructions.
- Whether the answer is repetitive or incomplete.
- How memory usage changes.

Repeat the experiment several times and compare the median performance rather than relying on a single run.

---

## 📊 11. Measure File-Size Reduction

Use this formula:

\[
\text{Size reduction (\%)} =
\frac{S_{\text{original}}-S_{\text{quantized}}}
{S_{\text{original}}}\times100
\]

For example, a hypothetical model shrinking from 4 GB to 2 GB has a 50% file-size reduction.

The actual size reduction depends on the model, quantization recipe, metadata, and tensor types.

On Windows, you can inspect model file sizes with:

```powershell
Get-Item "D:\AI-Models\GGUF\model-q8_0.gguf" |
    Select-Object Name, Length

Get-Item "D:\AI-Models\GGUF\model-q4_k_m.gguf" |
    Select-Object Name, Length
```

The `Length` field reports the file size in bytes.

---

## 🧠 12. Evaluate Output Quality

Use the same prompts for every model version.

Suggested test prompts:

1. Explain quantization to a beginner.
2. Write a simple Python function and explain it.
3. Summarize a short paragraph.
4. Follow a specific output format.
5. Answer a factual question with a concise explanation.

Evaluate each response using a consistent checklist:

- Accuracy.
- Instruction following.
- Completeness.
- Repetition.
- Formatting.
- Readability.

A few prompts can reveal obvious problems but cannot establish that two models have equivalent quality. More rigorous evaluation would use a larger test set and metrics such as perplexity or task-specific accuracy.

---

## 📈 13. Results Table

Record actual measurements from your machine.

| Metric | Higher precision | Q8 | Q4 |
|---|---|---|---|
| Model file size | Measure | Measure | Measure |
| Memory usage | Measure | Measure | Measure |
| Prompt processing speed | Measure | Measure | Measure |
| Generation speed | Measure | Measure | Measure |
| Response quality | Evaluate | Evaluate | Evaluate |
| Loading success | Record | Record | Record |

Do not fill in estimated values as if they were measured results.

### Questions to answer

1. How much smaller was the quantized model?
2. Did memory usage decrease?
3. Did generation speed improve, worsen, or remain similar?
4. Did the response quality noticeably change?
5. Which quantization level gave the best trade-off?
6. What limitations affected the experiment?

---

## 🧮 14. Calculate Observed Speedup

\[
\text{Speedup} =
\frac{\text{Baseline generation time}}
{\text{Quantized generation time}}
\]

A result greater than \(1\times\) means the quantized run was faster in that measurement. A result below \(1\times\) means it was slower.

The same quantized model may perform differently on different CPUs, GPUs, and inference backends. Record your hardware and software versions with the result.

---

## ⚠️ 15. Limitations and Lessons

- Lower-bit quantization can reduce output quality.
- Model size does not equal total runtime memory.
- Lower precision does not guarantee higher speed.
- GPTQ and AWQ require compatible model formats and runtime support.
- The quality impact depends on the model and quantization recipe.
- A small collection of prompts is not a comprehensive quality benchmark.
- Results from one hardware setup should not be generalized to all devices.

The purpose of quantization is to find a practical balance between model size, inference performance, and useful output quality.

---

## 📁 16. Suggested Project Structure

```text
Day_19_Quantization_Tools/
│
├── README.md
├── notes/
│   └── quantization_concepts.md
└── results/
    └── experiment_log.md
```

Keep large model files outside the Git repository.

Suggested `.gitignore`:

```gitignore
models/
*.gguf
.venv/
__pycache__/
*.pyc
.env
results/*.jsonl
```

---

## 📚 17. Official References

- [llama.cpp quantization utility](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md)
- [Hugging Face quantization documentation](https://huggingface.co/docs/transformers/en/main_classes/quantization)
- [Selecting a quantization method](https://huggingface.co/docs/transformers/en/quantization/selecting)
- [GPTQ documentation](https://huggingface.co/docs/transformers/main/en/quantization/gptq)
- [GPTQModel](https://github.com/ModelCloud/GPTQModel)
- [AWQ project](https://github.com/mit-han-lab/llm-awq)

---

## 🏁 Final Summary

Day 19 explores how quantization reduces the storage requirements of LLM weights and how different methods approach the trade-off between efficiency and quality.

The practical workflow is:

```text
Choose a Model
      ↓
Obtain Higher-Precision Weights
      ↓
Create or Download Quantized Versions
      ↓
Run the Same Inference Workload
      ↓
Measure Size, Memory, and Speed
      ↓
Compare Output Quality
      ↓
Document Results
```

**Key takeaway:** Quantization makes LLMs more practical to run on limited hardware, but the best quantization level depends on the workload, runtime, and acceptable quality loss.

**Completion criteria:** compare at least two precision levels of the same model, record actual file sizes and inference measurements, evaluate the outputs, and document which version best fits your hardware.