# Day 9 — Exploring DeepSeek & Reasoning Models

## Overview

Today I explored **DeepSeek**, one of the most influential AI model families focused on reasoning. Unlike previous days that concentrated on AI development tools or coding-focused models, today's learning focused on understanding **reasoning-first language models**, reinforcement learning, and how modern AI systems improve logical thinking.

The main objective was to understand:

* What DeepSeek is
* Why DeepSeek became famous
* DeepSeek-R1 and DeepSeek-R1-Zero
* Reinforcement Learning (RL)
* Model Distillation
* Reasoning Benchmarks
* DeepSeek vs GPT
* DeepSeek vs Qwen
* DeepSeek vs Gemma

---

# Learning Objectives

Today's roadmap:

* ✅ Explore DeepSeek
* ✅ Understand reasoning models
* ✅ Learn Reinforcement Learning
* ✅ Study DeepSeek-R1
* ✅ Compare reasoning capabilities with GPT

---

# What is DeepSeek?

DeepSeek is an AI company that develops **Large Language Models (LLMs)** with a strong focus on reasoning, mathematics, programming, and scientific problem solving.

Unlike AI coding assistants such as Cursor or Claude Code, DeepSeek is **the AI model itself**, not the interface or tool used to access it.

Its most well-known model family is **DeepSeek-R1**, which was specifically designed to improve multi-step reasoning through reinforcement learning.

---

# AI Tools vs AI Models

One of the biggest lessons from this week is understanding the difference between AI tools and AI models.

## AI Tools

* Cursor
* Cline
* Roo Code
* Claude Code
* Gemini CLI
* OpenCode

These provide the interface and workflow for interacting with AI.

## AI Models

* GPT
* Claude
* Gemini
* Gemma
* Qwen
* DeepSeek

These are the intelligence engines that actually generate responses.

Understanding this distinction is an important milestone in becoming an AI engineer.

---

# Why DeepSeek Became Famous

DeepSeek attracted worldwide attention because it demonstrated that **reinforcement learning can significantly improve reasoning capabilities**.

Instead of relying only on supervised learning, DeepSeek used reinforcement learning to encourage better mathematical reasoning, logical thinking, coding ability, and scientific problem solving.

Its performance became competitive with leading proprietary reasoning models while also releasing open-weight versions for the research community.

---

# DeepSeek Model Family

The DeepSeek ecosystem includes several important models.

## DeepSeek-V3

A general-purpose language model suitable for:

* Chat
* Writing
* Programming
* General AI tasks

---

## DeepSeek-R1

The flagship reasoning model.

Designed for:

* Mathematics
* Logic
* Programming
* Scientific reasoning
* Multi-step problem solving

---

## DeepSeek-R1-Zero

An experimental reasoning model trained almost entirely through reinforcement learning without supervised fine-tuning at the beginning.

It demonstrated remarkable reasoning ability but also suffered from readability issues and language mixing.

---

# DeepSeek-R1 vs DeepSeek-R1-Zero

## DeepSeek-R1-Zero

Characteristics:

* Pure Reinforcement Learning
* No initial Supervised Fine-Tuning (SFT)
* Strong reasoning
* Self-verification
* Reflection abilities

Challenges:

* Endless repetition
* Poor readability
* Mixed languages

---

## DeepSeek-R1

DeepSeek improved the pipeline by introducing **cold-start supervised data before reinforcement learning**.

Advantages:

* Better reasoning
* Better readability
* More stable responses
* Better alignment with human preferences

This became the official flagship reasoning model.

---

# Reinforcement Learning (RL)

One of today's most important concepts.

Traditional supervised learning:

```text
Question
      ↓
Correct Answer
      ↓
Model Learns
```

Reinforcement Learning:

```text
Question
      ↓
Model Attempts
      ↓
Reward Signal
      ↓
Model Improves
```

DeepSeek showed that reinforcement learning can significantly improve reasoning capability after pretraining, making it one of the defining ideas behind the R1 family.

---

# Model Distillation

Another important concept learned today.

Large reasoning models require expensive hardware.

To make reasoning more accessible, DeepSeek released **distilled models** based on Qwen and Llama architectures.

Examples include:

* 1.5B
* 7B
* 8B
* 14B
* 32B
* 70B

These smaller models retain much of the reasoning ability while requiring significantly fewer computational resources.

---

# Why DeepSeek Excels at Reasoning

DeepSeek is particularly strong at:

* Mathematics
* Logical reasoning
* Algorithm design
* Programming
* Scientific analysis
* Multi-step thinking
* Competitive programming

These strengths make it well suited for reasoning-intensive applications.

---

# Reasoning Benchmark

Today's experiment focused on evaluating reasoning rather than coding.

Example benchmark tasks include:

* Mathematical problem solving
* Logic puzzles
* Algorithm correctness proofs
* Scientific reasoning
* Multi-step planning
* Complex debugging scenarios

Evaluation metrics:

* Logical correctness
* Step-by-step reasoning
* Mathematical accuracy
* Clarity
* Final answer quality

---

# DeepSeek vs GPT

| Feature                | GPT                  | DeepSeek                               |
| ---------------------- | -------------------- | -------------------------------------- |
| Model Type             | Proprietary          | Open-weight reasoning family available |
| Main Focus             | General intelligence | Reasoning-first                        |
| Coding                 | Excellent            | Excellent                              |
| Mathematical Reasoning | Excellent            | Excellent                              |
| Local Deployment       | No                   | Yes (supported releases)               |
| Research Accessibility | Limited              | Open-weight releases available         |

---

# DeepSeek vs Qwen

| Qwen                           | DeepSeek                          |
| ------------------------------ | --------------------------------- |
| Strong coding ecosystem        | Strong reasoning focus            |
| Excellent AI agents            | Excellent mathematical reasoning  |
| Long-context optimization      | Reinforcement learning innovation |
| Great for software engineering | Great for complex reasoning       |

---

# DeepSeek vs Gemma

| Gemma                              | DeepSeek                             |
| ---------------------------------- | ------------------------------------ |
| Developed by Google                | Developed by DeepSeek AI             |
| General-purpose open-weight family | Reasoning-focused open-weight family |
| Research-friendly                  | Reasoning and mathematics focused    |
| Local deployment                   | Local deployment                     |

---

# Strengths

* Excellent reasoning ability
* Strong mathematical performance
* Excellent programming capability
* Reinforcement learning innovation
* Open-weight releases
* Distilled models for smaller hardware
* Strong benchmark performance

---

# Limitations

* Smaller distilled models cannot fully match the flagship model.
* Local deployment still requires suitable hardware.
* Like all LLMs, outputs should be verified for important tasks.
* Reinforcement-learning-only approaches (R1-Zero) initially produced readability issues before later improvements.

---

# What I Learned Today

Today I learned:

* The difference between general LLMs and reasoning-first models.
* How reinforcement learning can improve reasoning.
* The difference between DeepSeek-R1 and DeepSeek-R1-Zero.
* Why model distillation is important.
* How reasoning benchmarks differ from coding benchmarks.
* How DeepSeek compares with GPT, Qwen, and Gemma.

---

# What Surprised Me

The most surprising discovery was that **reasoning ability can emerge through reinforcement learning without relying entirely on supervised fine-tuning**.

I also found it impressive that DeepSeek released distilled models, making advanced reasoning capabilities available to developers who do not have access to extremely large GPU clusters.

---

# Key Takeaways

* DeepSeek is a reasoning-focused AI model family.
* Reinforcement Learning is one of the biggest innovations behind DeepSeek-R1.
* DeepSeek-R1 significantly improved the experimental R1-Zero pipeline.
* Distillation allows smaller models to inherit reasoning abilities from larger models.
* Reasoning benchmarks evaluate thinking quality rather than only code generation.
* DeepSeek has become one of the most influential open reasoning model families.

---

# Conclusion

Day 9 introduced me to one of the most important developments in modern AI reasoning.

Understanding **DeepSeek-R1**, **reinforcement learning**, **reasoning benchmarks**, and **model distillation** helped me move beyond simply using AI models toward understanding **how advanced reasoning models are trained and improved**.

This marks another important milestone in my AI Engineering journey, expanding my understanding of how modern LLMs achieve strong reasoning performance and how different model families specialize in different areas of artificial intelligence.
