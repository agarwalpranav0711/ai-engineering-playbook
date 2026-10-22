# ⚡ Day 17 — vLLM Experiments: Concurrent Requests & Throughput

> **Today's focus:** Experiment with concurrent LLM requests and observe how a vLLM serving engine handles workload, latency, and throughput.

## 📌 Overview

Day 17 is a practical experiment with **vLLM**, a high-throughput and memory-efficient inference and serving engine for large language models.

Rather than repeating the vLLM concepts covered in my main syllabus, today's objective is to investigate what happens when multiple requests are sent to the same model server.

The experiment compares sequential and concurrent requests and records how the workload affects:

- Request throughput.
- Output-token throughput.
- End-to-end request latency.
- Successful and failed requests.
- The relationship between concurrency and serving performance.

The central question is:

**What changes when an LLM server handles multiple requests at the same time instead of one request at a time?**

---

## 🎯 Learning Objectives

By the end of this experiment, I aim to:

- Generate requests sequentially and concurrently.
- Understand concurrency versus batching.
- Observe the effects of continuous batching.
- Measure requests per second.
- Measure generated tokens per second.
- Compare average and median request latency.
- Observe failures and timeouts under increasing load.
- Understand why throughput and latency can move in different directions.
- Explore vLLM's official serving benchmark tools.
- Document measured results and hardware constraints.

---

## 🧠 1. Experiment Concept

Imagine an LLM server receiving requests from several users.

```text
Request A ──┐
Request B ──┤
Request C ──┼──► vLLM Server ──► Model Execution
Request D ──┤                         │
Request E ──┘                         ▼
                              Generated Responses
```

When requests arrive close together, the server must coordinate model execution, accelerator resources, and memory.

The experiment investigates how the server behaves as the number of overlapping requests increases.

### Sequential execution

```text
Request A → Complete
                 ↓
Request B → Complete
                 ↓
Request C → Complete
```

### Concurrent execution

```text
Request A ────────────────► Complete
Request B ─────────► Complete
Request C ───────────────────► Complete
```

Concurrent requests overlap in time. The runtime may schedule their computation together, but concurrency does not necessarily mean every request is executing simultaneously at every instant.

---

## ⚙️ 2. Why vLLM Is Relevant

vLLM is designed for efficient model serving using techniques such as PagedAttention, continuous batching, and efficient KV-cache management.

For this experiment, the important distinction is between the client workload and the serving engine:

- **Client:** creates and sends requests.
- **Server:** receives requests and schedules execution.
- **Model:** generates output tokens.
- **Benchmark:** measures the observed performance.

The experiment does not attempt to reimplement the scheduler or batching system. It measures the externally observable behavior of the running server.

---

## 📊 3. Metrics

| Metric | Meaning |
|---|---|
| Concurrency | Number of requests allowed to be in progress at overlapping times |
| Requests per second | Number of completed requests divided by elapsed time |
| Output tokens per second | Number of generated output tokens divided by elapsed time |
| Mean latency | Average duration of successful requests |
| Median latency | Middle request duration after sorting the measurements |
| TTFT | Time to first generated token |
| Inter-token latency | Time between successive generated tokens |
| Error rate | Failed requests divided by attempted requests |

These metrics describe different aspects of performance.

Higher throughput does not guarantee lower latency for each user. Similarly, low latency for one request does not guarantee high throughput under heavy concurrent load.

---

## 🧪 4. Experimental Design

The experiment compares four concurrency levels:

| Run | Maximum concurrent requests | Purpose |
|---|---:|---|
| A | 1 | Establish a baseline |
| B | 2 | Observe light concurrency |
| C | 4 | Observe moderate concurrency |
| D | 8 | Observe a higher concurrent workload |

Each run submits the same number of requests using the same prompt, model, generation settings, and server configuration.

The test uses 12 requests per run.

The workload is intentionally small for an educational experiment. If the server cannot handle a particular concurrency level, the failure should be recorded rather than hidden.

### Controlled variables

Keep the following constant:

- Model identifier.
- Prompt text.
- Maximum generated tokens.
- Sampling settings.
- Server configuration.
- Number of attempted requests.
- Client machine and network path.

### Independent variable

The maximum number of concurrent requests.

### Dependent variables

- Total elapsed time.
- Requests per second.
- Output tokens per second.
- Mean and median request latency.
- Successful and failed request counts.

---

## 🛠️ 5. Environment Setup

The vLLM server requires a compatible runtime environment. The standard installation and serving workflow targets supported Linux and accelerator configurations; platform-specific alternatives are documented separately.

For this project, the lightweight client can run on Windows while the vLLM server runs on a compatible remote GPU machine.

### Create the project

```powershell
New-Item -ItemType Directory -Force Day_17_vLLM_Experiments
Set-Location Day_17_vLLM_Experiments

python -m venv .venv
.\.venv\Scripts\Activate.ps1

python -m pip install openai
```

The OpenAI Python library is used as an HTTP client for the server's compatible API. It does not install the vLLM inference engine itself.

### Start the server

On a compatible Linux/GPU environment, the official quickstart demonstrates this command:

```bash
vllm serve Qwen/Qwen2.5-1.5B-Instruct
```

The example uses the default server port, 8000.

Model support, memory requirements, and installation details depend on the selected hardware and runtime version.

Official quickstart:

https://docs.vllm.ai/en/latest/getting_started/quickstart/

---

## 🐍 6. Concurrent Request Experiment

Create `benchmark.py`.

The script sends 12 requests at concurrency levels of 1, 2, 4, and 8. It records completed requests, total elapsed time, request throughput, token throughput when usage is returned, and successful-request latency.

```python
import asyncio
import statistics
import time

from openai import AsyncOpenAI

BASE_URL = "http://127.0.0.1:8000/v1"
MODEL = "Qwen/Qwen2.5-1.5B-Instruct"

TOTAL_REQUESTS = 12
CONCURRENCY_LEVELS = [1, 2, 4, 8]

PROMPT = (
    "Explain continuous batching in an LLM server "
    "in simple words, using one example."
)

client = AsyncOpenAI(
    base_url=BASE_URL,
    api_key="EMPTY",
    timeout=180.0,
)


async def send_request(semaphore):
    async with semaphore:
        start = time.perf_counter()

        try:
            response = await client.chat.completions.create(
                model=MODEL,
                messages=[
                    {"role": "user", "content": PROMPT}
                ],
                temperature=0,
                max_tokens=120,
            )

            elapsed = time.perf_counter() - start

            usage = response.usage
            tokens = (
                usage.completion_tokens
                if usage is not None
                else 0
            )

            return {
                "ok": True,
                "latency": elapsed,
                "tokens": tokens,
            }

        except Exception as exc:
            elapsed = time.perf_counter() - start

            print(
                f"Request failed after {elapsed:.2f}s: {exc}"
            )

            return {
                "ok": False,
                "latency": elapsed,
                "tokens": 0,
            }


async def run_experiment(concurrency):
    semaphore = asyncio.Semaphore(concurrency)

    start = time.perf_counter()

    results = await asyncio.gather(
        *[
            send_request(semaphore)
            for _ in range(TOTAL_REQUESTS)
        ]
    )

    total_time = time.perf_counter() - start

    successful = [
        result for result in results if result["ok"]
    ]

    latencies = [
        result["latency"] for result in successful
    ]

    total_tokens = sum(
        result["tokens"] for result in successful
    )

    requests_per_second = (
        len(successful) / total_time
        if total_time > 0
        else 0
    )

    tokens_per_second = (
        total_tokens / total_time
        if total_time > 0
        else 0
    )

    print(f"\n--- Concurrency: {concurrency} ---")
    print(
        f"Completed: {len(successful)}/{TOTAL_REQUESTS}"
    )
    print(f"Total elapsed: {total_time:.2f}s")
    print(
        f"Request throughput: "
        f"{requests_per_second:.2f} requests/s"
    )
    print(
        f"Output throughput: "
        f"{tokens_per_second:.2f} tokens/s"
    )

    if latencies:
        print(
            f"Mean latency: "
            f"{statistics.mean(latencies):.2f}s"
        )
        print(
            f"Median latency: "
            f"{statistics.median(latencies):.2f}s"
        )

    return {
        "concurrency": concurrency,
        "attempted": TOTAL_REQUESTS,
        "successful": len(successful),
        "elapsed_seconds": total_time,
        "requests_per_second": requests_per_second,
        "output_tokens_per_second": tokens_per_second,
        "mean_latency_seconds": (
            statistics.mean(latencies)
            if latencies
            else None
        ),
        "median_latency_seconds": (
            statistics.median(latencies)
            if latencies
            else None
        ),
    }


async def main():
    print(f"Server: {BASE_URL}")
    print(f"Model: {MODEL}")

    try:
        for concurrency in CONCURRENCY_LEVELS:
            await run_experiment(concurrency)

    finally:
        await client.close()


if __name__ == "__main__":
    asyncio.run(main())
```

### Configuration notes

- Change `BASE_URL` if the server runs remotely.
- Change `MODEL` to the identifier exposed by the running server.
- The placeholder API key is suitable only when the server is configured without authentication.
- Use appropriate authentication for a secured server.
- The script measures completed-response latency, not time to first token.
- The script is a simple educational benchmark, not a substitute for vLLM's official benchmarking tools.

Run the experiment:

```powershell
python benchmark.py
```

---

## 📈 7. Expected Observations

The following are hypotheses, not claimed results.

### At concurrency 1

- Establishes a baseline.
- Shows the duration of individual requests with little client-side overlap.
- Provides a starting point for comparison.

### At concurrency 2 and 4

- More requests overlap.
- The server may achieve better accelerator utilization.
- Request throughput may increase.
- Individual request latency may also increase.

### At concurrency 8

- The server may achieve higher throughput.
- Queueing or memory pressure may become more noticeable.
- Latency may rise, throughput may flatten, or errors may appear.

The actual outcome depends on the hardware, model, server configuration, prompt lengths, output lengths, and workload.

---

## 📊 8. Results Table

Fill in the values from the actual benchmark output.

| Concurrency | Successful requests | Total elapsed time | Requests/s | Tokens/s | Mean latency |
|---:|---:|---:|---:|---:|---:|
| 1 | Pending | Pending | Pending | Pending | Pending |
| 2 | Pending | Pending | Pending | Pending | Pending |
| 4 | Pending | Pending | Pending | Pending | Pending |
| 8 | Pending | Pending | Pending | Pending | Pending |

### Questions to answer

1. Which concurrency level produced the highest observed request throughput?
2. Did output-token throughput increase as concurrency increased?
3. Did average latency rise?
4. Did any requests fail or time out?
5. Did throughput eventually stop improving?
6. What limitations of the test could affect the results?

Do not invent benchmark values. Record the actual output and explain any limitations.

---

## 🔬 9. Explore the Official vLLM Benchmark

After the basic Python experiment works, investigate vLLM's own serving benchmark CLI.

Start with:

```bash
vllm bench serve --help
```

Consult the current official documentation to select the supported workload, request-rate, concurrency, and output options.

Official benchmark guide:

https://github.com/vllm-project/vllm/blob/main/docs/benchmarking/cli.md

The official tooling is preferable for detailed serving measurements, including time to first token and token-generation timing.

Use a consistent model, workload, and configuration when comparing results.

---

## 🧠 10. Key Takeaways

- Concurrency means requests overlap in time.
- Batching groups model work for efficient execution.
- Continuous batching can schedule new work as active sequences finish.
- PagedAttention manages KV-cache memory using blocks.
- Throughput measures completed work per unit of time.
- Latency measures how long an individual request takes.
- Higher concurrency does not guarantee higher throughput.
- Higher throughput does not guarantee lower latency.
- Controlled experiments are more informative than isolated measurements.

---

## ⚠️ 11. Limitations

This experiment has several limitations:

- A small number of requests provides limited statistical confidence.
- Repeated prompts may interact with caching behavior.
- Model warm-up can affect measurements.
- Client-side timing includes network and request overhead.
- Completed-response latency does not reveal true time to first token.
- The experiment does not directly inspect the server's internal batch composition.
- Results are specific to the tested hardware, model, and configuration.

For more rigorous analysis, repeat each run, report percentiles, collect server-side metrics, and use vLLM's official benchmark utilities.

---

## 📁 12. Project Structure

```text
Day_17_vLLM_Experiments/
│
├── README.md
├── benchmark.py
├── requirements.txt
├── .gitignore
└── results/
    └── experiment_log.md
```

Suggested `requirements.txt`:

```text
openai
```

For reproducibility, pin the tested client version after validating the environment.

Suggested `.gitignore`:

```gitignore
.venv/
.env
__pycache__/
*.pyc
results/*.jsonl
```

Do not commit credentials, private prompts, or unrelated environment files.

---

## 🔐 13. Security Considerations

- Keep the inference server on a trusted network.
- Use authentication and network controls for remote deployments.
- Do not expose an unauthenticated inference endpoint publicly.
- Avoid sending confidential information during load tests.
- Set sensible request and timeout limits.
- Monitor server resource usage during experiments.

API-key authentication alone may not protect every endpoint in a deployment; consult vLLM's current security documentation before exposing a server.

---

## 📚 14. Official References

- [vLLM Quickstart](https://docs.vllm.ai/en/latest/getting_started/quickstart/)
- [OpenAI-Compatible Server](https://github.com/vllm-project/vllm/blob/main/docs/serving/online_serving/openai_compatible_server.md)
- [Benchmark CLI](https://github.com/vllm-project/vllm/blob/main/docs/benchmarking/cli.md)
- [vLLM Performance Dashboard](https://docs.vllm.ai/en/latest/benchmarking/dashboard/)
- [vLLM Official Website](https://vllm.ai/)

---

## 🏁 Final Summary

Day 17 focuses on experimentally understanding how a serving engine behaves under concurrent requests.

The workflow is:

```text
Start vLLM Server
       ↓
Send Sequential Requests
       ↓
Record Baseline
       ↓
Send Concurrent Requests
       ↓
Measure Latency and Throughput
       ↓
Compare Results
       ↓
Document Findings
```

> **Day 17 takeaway:** A useful LLM serving system must balance throughput, latency, memory, and concurrency. The goal of this experiment is to measure that balance rather than assume that more concurrent requests always produce better performance.
