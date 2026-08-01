# Day 6 — OpenCode

## Overview

Today I explored **OpenCode**, an open-source AI coding agent designed for modern software development. Unlike tools that are tied to a single AI model, OpenCode allows developers to connect multiple AI providers and choose the best model for each task.

The goal of today's session was to understand how OpenCode works, how it differs from other AI coding assistants, and why it is becoming popular among developers who want flexibility instead of being locked into one ecosystem.

---

# What is OpenCode?

OpenCode is an **AI coding agent** rather than just an AI chatbot.

Instead of only answering programming questions, it can:

* Read an entire project
* Edit existing code
* Create new files
* Execute terminal commands
* Work with Git repositories
* Search documentation
* Understand project structure
* Manage coding workflows

It acts as the layer between an AI model and the developer's project.

---

# Why OpenCode Exists

Most AI coding assistants are tied to a single model.

Examples:

* Claude Code → Claude
* Gemini CLI → Gemini

OpenCode takes a different approach.

It allows developers to choose whichever AI model is best for the current task.

Examples include:

* Claude
* GPT
* Gemini
* DeepSeek
* Qwen
* Grok
* Local LLMs
* OpenRouter models

This makes OpenCode a flexible and provider-independent coding agent.

---

# Core Architecture

```
User

↓

OpenCode

↓

Selected AI Model

↓

Planning

↓

Tool Execution

↓

Filesystem

↓

Terminal

↓

Git

↓

Result
```

The AI model performs the reasoning.

OpenCode provides the tools needed to interact with the development environment.

---

# Installation Methods

OpenCode can be used through:

* Terminal (CLI)
* Desktop Application
* IDE Extension

This makes it usable in different development workflows depending on personal preference.

---

# Features I Learned

* Open-source
* Model-agnostic
* Terminal-based workflow
* Git integration
* Multiple AI providers
* Parallel coding sessions
* Project instructions through `AGENTS.md`
* Reusable Skills (`SKILL.md`)
* MCP server support
* Multi-project workflow
* Desktop and IDE support

---

# Advanced Concepts

## AGENTS.md

OpenCode uses an `AGENTS.md` file to provide project-specific instructions.

Running `/init` analyzes the repository and creates this file automatically.

The documentation recommends committing `AGENTS.md` to Git because it helps future OpenCode sessions understand the repository's structure, commands, conventions, and workflows.

---

## Skills

OpenCode supports reusable **Skills**.

A skill is stored in a `SKILL.md` file with metadata and instructions.

Skills allow the agent to perform specialized workflows without rewriting prompts each time.

Examples include:

* Release automation
* Documentation generation
* Refactoring
* Testing workflows

OpenCode can discover project and global skills automatically.

---

## Parallel Sessions

One feature that stood out is the ability to work on multiple coding tasks simultaneously.

For example:

* Session 1 → Fix authentication
* Session 2 → Refactor UI
* Session 3 → Write documentation

This helps reduce the attention bottleneck when managing several tasks at once.

---

## MCP Servers

OpenCode supports MCP (Model Context Protocol) servers.

These allow the agent to connect to external tools and documentation sources, providing richer context while reducing repeated prompt content.

---

# My Experiment

Today I:

* Learned the purpose of OpenCode
* Studied its architecture
* Understood how it differs from other AI coding assistants
* Learned about `AGENTS.md`
* Learned about reusable Skills
* Explored parallel workflows
* Studied MCP server support
* Compared it with the tools I had already used

---

# Comparison

| Tool         | Main Strength                                     |
| ------------ | ------------------------------------------------- |
| Cursor       | AI-assisted IDE with project rules                |
| Cline        | Autonomous coding inside VS Code                  |
| Roo Code     | Multiple specialized AI modes                     |
| Claude Code  | Deep reasoning in the terminal                    |
| Gemini CLI   | Fast structured code generation                   |
| **OpenCode** | Open-source, model-independent AI coding platform |

---

# What Surprised Me

The biggest surprise was that OpenCode is **not tied to a single AI model**.

Instead of forcing developers to use one provider, it allows choosing the most suitable model for each task.

I also found the concepts of **AGENTS.md**, reusable **Skills**, and **parallel sessions** especially interesting because they make AI workflows more organized and reusable.

---

# Key Takeaways

* OpenCode is an AI coding platform rather than a single AI model.
* It works with multiple AI providers.
* `AGENTS.md` stores project instructions.
* Skills make workflows reusable.
* Parallel sessions improve productivity.
* MCP support enables richer integrations.
* OpenCode is designed for flexible, long-term AI-assisted software development.

---

# Conclusion

OpenCode introduces a more flexible approach to AI-assisted programming by separating the coding workflow from the underlying AI model.

Compared with the tools I explored in previous days, it provides the highest level of customization and freedom, making it well suited for developers who want to experiment with different models and build reusable AI development workflows.
