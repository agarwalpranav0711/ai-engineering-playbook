# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This repository is a structured knowledge base for learning AI Engineering concepts and tools. It documents a hands‑on exploration of various AI coding assistants (Cursor, Cline, Roo Code) through daily projects. The goal is to produce high‑quality, well‑structured learning notes that are technically correct and easy to revise later.

## Directory Structure

- **day‑1/** – Cursor rules and Claude skill templates that establish the learning standards for the repository.
  - `cursor-project-rule.mdc` – Repository‑wide standards for documenting AI topics.
  - `cursor-user-rule.md` – Teaching style and coding standards for an AI engineering mentor.
  - `claude-skill/SKILL.md` – A reusable skill template for teaching any AI topic.

- **day‑2/** – Exploration of Cline (an AI coding assistant) using its Plan Mode and Act Mode.
  - `cline-first-project/todo-app/` – A responsive Todo application built by Cline (HTML/CSS/JS using localStorage).

- **day‑3/** – Exploration of Roo Code (a VS Code‑based AI assistant with modes, MCP, and skills).
  - `color-picker-app/index.html` – A single‑file Color Picker web app built with Roo Code.

- **day‑4/** – (Current day) – Likely continuation of the learning journey.

Each day folder contains a README (or readme.md) that summarizes the day’s objectives, what was learned, and key takeaways.

## Key Standards and Conventions

- **Learning structure**: Every topic should follow the template outlined in `day‑1/cursor-project-rule.mdc`:
  1. What is it?
  2. Why does it exist?
  3. How does it work?
  4. Architecture
  5. Workflow
  6. Example
  7. Best Practices
  8. Common Mistakes
  9. Summary

- **Teaching style**: Adopt the persona of a senior AI engineering mentor as described in `day‑1/cursor-user-rule.md`. Explain concepts before writing code, keep explanations beginner‑friendly, and follow the prescribed response format (Problem Understanding → Intuition → Approach → Algorithm → Code → Complexity → Edge Cases → Improvements).

- **Claude skill**: The `learn‑ai‑topic` skill (`day‑1/claude-skill/SKILL.md`) provides a 15‑step workflow for teaching any AI concept. Use it when the user wants to deeply understand an AI framework, tool, protocol, or workflow.

## Common Tasks

When working in this repository you may be asked to:

1. **Add a new day** – Create a new folder (e.g., `day‑5/`) with a README and possibly a practical project that explores another AI tool or concept. Follow the existing structure and learning standards.

2. **Update or expand notes** – Revise existing READMEs or create new markdown files that explain a topic in the prescribed structured format.

3. **Create a simple example project** – Build a small web app (like the Todo app or Color Picker) that demonstrates a concept. Prefer vanilla HTML/CSS/JS in a single file unless the topic requires a different stack.

4. **Compare AI tools** – Provide detailed comparisons between different coding assistants (Cursor vs Cline vs Roo Code vs others) using the comparison template from the existing READMEs.

## Running the Existing Projects

The repository contains two simple web applications:

- **Todo app** (`day‑2/cline-first-project/todo-app/`) – Open `index.html` in a browser (no build step).
- **Color Picker app** (`day‑3/color-picker-app/`) – Open `index.html` in a browser (no build step).

Both are static HTML files with inline CSS and JavaScript; they can be viewed directly in any modern browser.

## Development Commands

There are no traditional build, lint, or test commands in this repository. The focus is on documentation and learning. However, you can:

- Use `git status`, `git diff`, etc., to inspect changes.
- Use `open file.html` (on macOS) or `start file.html` (on Windows) to open a file in the default browser.

## Important Notes

- This repository does not contain sensitive information (API keys, tokens) – do not add any.
- All code examples should be production‑quality where practical, compile correctly, and follow best practices as per the cursor rules.
- Avoid unnecessary repetition; strive for concise but complete explanations.
- When comparing concepts, use the comparison framework established in the day‑3 README (advantages, limitations, best‑for scenarios).

## Resources

- Cursor rules: `day‑1/cursor-project-rule.mdc` and `day‑1/cursor-user-rule.md`
- Claude skill: `day‑1/claude-skill/SKILL.md`
- Day‑2 README: `day‑2/readme.md`
- Day‑3 README: `day‑3/README.md`