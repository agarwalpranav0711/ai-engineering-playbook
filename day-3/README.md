# Day 3 — Roo Code

> **A hands-on exploration of Roo Code, an AI-powered coding assistant built on top of Claude's API.**

---

## 🎯 Objective

- Understand what Roo Code is and why it exists
- Explore its key features, built-in modes, and tool system
- Learn how context management and workspace understanding work
- Build a real project (Color Picker App) using Roo Code autonomously
- Compare Roo Code with Cursor and Cline
- Document best practices and common mistakes

---

## 🤖 What Roo Code Is

Roo Code is an **AI-powered coding assistant** that operates as a VS Code extension. It uses large language models (primarily Claude) to understand your workspace, plan solutions, write code, debug issues, and even orchestrate complex multi-step tasks — all within your editor.

Unlike a simple chat copilot, Roo Code can:

- **Read and write files** in your project
- **Execute terminal commands** and see their output
- **Search across your codebase** using regex
- **Plan architectures** before writing code
- **Switch between specialized modes** (Architect, Code, Debug, Ask, Orchestrator)
- **Use MCP servers** to extend its capabilities
- **Create checkpoints** to track progress

---

## ❓ Why Roo Code Exists

Roo Code was created to solve a fundamental problem: **AI assistants are great at generating code, but bad at understanding context and executing multi-step workflows.**

Traditional AI coding tools:

- Lack awareness of your full project structure
- Cannot run commands or see results
- Have no memory of what they've already done
- Cannot plan before acting

Roo Code bridges this gap by giving the AI **direct access to your development environment** — files, terminal, search — and a **mode-based architecture** that lets it think before it codes.

---

## 🔑 Key Features

| Feature | Description |
|---------|-------------|
| **Mode System** | Five specialized modes (Architect, Code, Debug, Ask, Orchestrator) |
| **Tool System** | Read/write files, execute commands, search code, ask questions |
| **Context Management** | Automatically sees open files, workspace structure, terminal state |
| **Workspace Understanding** | Recursive file listing, environment details on every interaction |
| **Model Providers** | Supports Claude, OpenAI, Gemini, DeepSeek, and more |
| **MCP Support** | Model Context Protocol for extending capabilities |
| **Skills** | Reusable instruction templates for common tasks |
| **Checkpoints** | Save and restore progress during complex tasks |
| **Diff-Based Editing** | Surgical code changes via search/replace blocks |

---

## 🏗️ Built-in Modes

Roo Code provides five specialized modes, each designed for a specific phase of development:

| Mode | Slug | Purpose |
|------|------|---------|
| **🏗️ Architect** | `architect` | Plan, design, and strategize before implementation. Creates technical specs and system designs. |
| **💻 Code** | `code` | Write, modify, and refactor code. Implements features and fixes bugs. |
| **❓ Ask** | `ask` | Answer questions, explain concepts, analyze code without making changes. |
| **🪲 Debug** | `debug` | Troubleshoot issues, investigate errors, add logging, find root causes. |
| **🪃 Orchestrator** | `orchestrator` | Coordinate complex multi-step projects across multiple specialties. |

Each mode has **restricted capabilities** — for example, Architect mode can only edit `.md` files, while Code mode can edit any file. This prevents the AI from accidentally modifying code when it should be planning.

---

## 🛠️ Tool System

Roo Code has a rich set of tools that it can invoke to interact with your environment:

| Tool | What It Does |
|------|-------------|
| `apply_diff` | Make surgical search/replace edits to existing files |
| `ask_followup_question` | Ask you for clarification or approval |
| `attempt_completion` | Signal that a task is finished |
| `execute_command` | Run CLI commands (with timeout support) |
| `list_files` | List directory contents (recursive or flat) |
| `new_task` | Delegate subtasks to other modes |
| `read_command_output` | Read truncated command output with search/filter |
| `read_file` | Read files with slice or indentation modes |
| `search_files` | Regex search across the codebase |
| `skill` | Load and execute reusable skill templates |
| `switch_mode` | Request to switch to a different mode |
| `update_todo_list` | Track progress with a markdown checklist |
| `write_to_file` | Create new files or overwrite existing ones |

---

## 📋 Context Management

One of Roo Code's most powerful features is its **automatic context awareness**. On every interaction, Roo Code receives:

- **VSCode Visible Files** — Which files you have open in tabs
- **VSCode Open Tabs** — The full list of your open editor tabs
- **Current Time** — ISO 8601 timestamp and your timezone
- **Current Cost** — Running token cost for the session
- **Current Mode** — Which mode is active
- **Workspace Files** — Recursive listing of all files in the project
- **Actively Running Terminals** — Any ongoing terminal processes
- **System Information** — OS, shell, home directory

This means Roo Code **already knows your project structure** without you having to explain it. It can see what you're working on, what files exist, and what's running in your terminal.

---

## 📂 Workspace Understanding

When you give Roo Code a task, it automatically receives a recursive list of all file paths in the current workspace. This provides:

- **Structural insights** — How developers organize their code (directory names)
- **Language detection** — File extensions reveal the tech stack
- **Dependency awareness** - Manifest files (package.json, requirements.txt, etc.) reveal dependencies

Roo Code uses this to make informed decisions about which files to read, which tools to use, and how to structure its approach.

---

## 🧠 Model Providers

Roo Code is **model-agnostic** and supports multiple LLM providers:

| Provider | Models |
|----------|--------|
| **Anthropic** | Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku |
| **OpenAI** | GPT-4o, GPT-4, GPT-3.5 Turbo |
| **Google** | Gemini 1.5 Pro, Gemini 1.5 Flash |
| **DeepSeek** | DeepSeek V2, DeepSeek Coder |
| **OpenRouter** | Access to many models via a single API |
| **Ollama** | Local models (Llama, Mistral, etc.) |

This flexibility lets you choose the best model for your task — cheaper models for simple tasks, more powerful models for complex reasoning.

---

## 🔌 MCP Overview

**MCP (Model Context Protocol)** is an open standard that allows AI assistants to connect with external tools and data sources. Think of it as a **USB-C for AI** — a universal way to plug in new capabilities.

With MCP, Roo Code can:

- Query databases
- Fetch data from APIs
- Access file systems
- Use web search
- Interact with version control
- And much more

MCP servers are configured in a JSON file and can be added or removed without changing the AI's core code.

---

## 🎯 Skills

Skills are **reusable instruction templates** that teach Roo Code how to handle specific types of tasks. For example, the `learn-ai-topic` skill (seen in Day 1) defines a 15-step workflow for teaching any AI concept.

Skills are useful for:

- Standardizing common workflows
- Ensuring consistency across tasks
- Reducing repetitive instructions
- Sharing best practices across a team

---

## 📍 Checkpoints

Checkpoints allow Roo Code to **save its progress** during long or complex tasks. If something goes wrong, it can restore a previous checkpoint and continue from there.

This is especially useful for:

- Multi-step refactoring tasks
- Long debugging sessions
- Complex project setups
- Any task where intermediate state matters

---

## 🧪 My Hands-On Experiments Today

### Project: Color Picker App

I built a **Color Picker App** — a single-file HTML application that demonstrates:

- **Live color preview** — Background updates in real-time as you pick a color
- **HEX and RGB display** — Both color formats shown and copyable
- **Clipboard integration** — Copy HEX or RGB with one click
- **Reset functionality** — Reset to default color
- **Responsive design** — Works on mobile and desktop
- **Smooth animations** — Transitions on color changes and interactions
- **Accessibility** — ARIA labels, semantic HTML, keyboard support

The entire project is a single `index.html` file containing HTML, CSS, and vanilla JavaScript.

---

## 📚 What I Learned Today

1. **Roo Code's mode system** is its killer feature — separating planning from coding prevents half-baked solutions
2. **Context is automatically provided** — Roo Code sees my open files, workspace structure, and terminal state without me explaining it
3. **The tool system is extensive** — 14+ tools for different operations, from file editing to command execution
4. **Diff-based editing** (`apply_diff`) is more precise than full file rewrites for small changes
5. **MCP extends capabilities** — Roo Code can connect to databases, APIs, and external services
6. **Skills standardize workflows** — Reusable templates for common tasks
7. **Checkpoints provide safety** — Save and restore progress during complex tasks

---

## ⚖️ Comparison: Roo Code vs Cursor vs Cline

| Aspect | Roo Code | Cursor | Cline |
|--------|----------|--------|-------|
| **Base** | VS Code Extension | Forked VS Code | VS Code Extension |
| **Modes** | 5 built-in modes (Architect, Code, Debug, Ask, Orchestrator) | Chat + Edit + Agent | Plan Mode + Act Mode |
| **Tool System** | 14+ tools (files, terminal, search, MCP) | Limited to code editing | File + terminal access |
| **Context** | Automatic (open files, workspace, terminals) | Manual (you select context) | Manual (you provide instructions) |
| **MCP Support** | ✅ Yes | ❌ No | ❌ No |
| **Skills** | ✅ Yes | ❌ No | ❌ No |
| **Checkpoints** | ✅ Yes | ❌ No | ❌ No |
| **Model Flexibility** | Multiple providers | Limited to their own models | Multiple providers |
| **Best For** | Complex multi-step tasks | Quick code edits | Autonomous single tasks |

### Key Differences

- **Roo Code** is the most **feature-rich** — it has modes, MCP, skills, checkpoints, and a comprehensive tool system. It's designed for complex, multi-step workflows.
- **Cursor** is the most **polished** for everyday coding — its fork of VS Code gives it deep editor integration, but it lacks the advanced tooling and mode system of Roo Code.
- **Cline** is the **simplest** — Plan Mode and Act Mode are straightforward, but it lacks the depth of Roo Code's mode system and extensibility.

---

## ✅ Best Practices

1. **Start with Architect mode** for complex tasks — plan before you code
2. **Use the right mode for the job** — don't debug in Code mode, don't code in Architect mode
3. **Review diffs before approving** — always check what changed
4. **Leverage context** — keep relevant files open in tabs so Roo Code can see them
5. **Use checkpoints** for long tasks — save progress regularly
6. **Write clear task descriptions** — the more specific you are, the better the result
7. **Combine modes** — use Architect to plan, Code to implement, Debug to fix issues
8. **Use skills for repetitive tasks** — create reusable templates for common workflows

---

## ❌ Mistakes to Avoid

1. **Skipping the planning phase** — jumping straight to code leads to poor architecture
2. **Using the wrong mode** — asking Code mode to design architecture, or Architect mode to write code
3. **Not reviewing changes** — AI can make mistakes; always review before approving
4. **Overloading a single task** — break complex projects into smaller, focused tasks
5. **Ignoring context** — Roo Code sees your workspace; keep it organized
6. **Not using MCP** — external tools can dramatically expand what Roo Code can do
7. **Forgetting checkpoints** — losing progress on a long task is frustrating

---

## 🔑 Key Takeaways

1. **Roo Code is not just a code generator** — it's a full development assistant that can plan, build, debug, and orchestrate
2. **The mode system is revolutionary** — separating concerns (planning vs coding vs debugging) leads to better outcomes
3. **Context is king** — Roo Code's automatic context awareness makes it more effective than tools that require manual context selection
4. **Extensibility matters** — MCP and skills make Roo Code adaptable to any workflow
5. **Tool diversity is powerful** — having 14+ tools means Roo Code can handle almost any development task

---

## 🏁 Conclusion

Roo Code is the most **comprehensive AI coding assistant** I've explored so far. Its mode system, tool diversity, MCP support, and automatic context management make it ideal for complex, multi-step development tasks. While Cursor offers a more polished editing experience and Cline offers simplicity, Roo Code's **depth and flexibility** make it the best choice for serious software engineering work.

The Color Picker App I built today demonstrates how Roo Code can take a task from planning to completion — understanding the requirements, creating the files, and delivering a production-quality result — all within a single workflow.

---

*Built with Roo Code on Day 3 of the AI Engineering learning journey.*