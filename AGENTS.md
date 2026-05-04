<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# 🧠 Agent Operating System (AOS)

This document defines how all coding agents must behave when working in this repository.
Assume this codebase is production-grade, high-scale, and will be reviewed by senior engineers.

---

# 🧱 Core Principles

## 1. Production Mindset

- Treat all code as if it will serve **real users at scale**.
- Prioritize **correctness, clarity, and maintainability** over cleverness.
- Avoid hacks, shortcuts, and temporary fixes unless explicitly instructed.

## 2. Readability > Cleverness

- Write code that another engineer can understand quickly.
- Prefer explicitness over magic.
- Use meaningful names for variables, functions, and files.

## 3. Minimal but Useful Comments

- Do NOT comment obvious code.
- ONLY add comments when:
  - Explaining _why_ something is done (not what)
  - Highlighting non-obvious decisions or tradeoffs
- Remove outdated or misleading comments.

---

# 🔐 Security Requirements (NON-NEGOTIABLE)

- Never expose secrets, API keys, or credentials.
- Always validate and sanitize all external inputs.
- Assume all user input is malicious.
- Use least-privilege principles for access control.
- Avoid insecure patterns (e.g., eval, unsafe deserialization).
- Prevent:
  - XSS
  - CSRF
  - SQL/NoSQL injection
- Use environment variables correctly.
- Do not log sensitive data.

---

# ⚡ Performance & Scalability

## Must consider from the start:

- **LCP (Largest Contentful Paint)**
- **Initial load time**
- **Backend response latency**
- **Horizontal scalability**

## Guidelines:

- Avoid unnecessary re-renders or recomputation.
- Lazy load heavy modules/components.
- Use caching where appropriate.
- Optimize database queries (no N+1 patterns).
- Avoid blocking operations in critical paths.
- Design APIs to be efficient and predictable.

---

# 🧩 Architecture & Design

- Follow clean architecture principles.
- Separate concerns clearly:
  - UI / Logic / Data access
- Avoid tight coupling.
- Prefer composition over inheritance.
- Keep functions small and focused.
- Reuse existing utilities before creating new ones.

---

# 🧪 Code Quality

- Ensure code builds and runs before considering work complete.
- Avoid dead code and unused imports.
- Keep files reasonably sized and modular.
- Maintain consistent formatting and style.

---

# 🧾 Change Logging Policy

- **Timeline log is mandatory**
- Every change MUST be appended to: `timeline-changes.m.md`

## Format:

YYYY-MM-DD HH:mm — Short description of change

## Rules:

- Append only — NEVER overwrite existing entries
- Keep entries concise and chronological

---

# 📋 Todo Tracking Policy

When the user defers work (e.g. “later”, “not now”, “remind me”):

YOU MUST append to `todo.m.md`.

## Format:

YYYY-MM-DD — [Source]
Title — One-line explanation

## Rules:

- One item per bullet
- No nesting
- Never delete items — mark complete with `[x]`
- Append only

---

# 🚢 Commit & Push Strategy

When the user says **"commit"**:

## 1. Build First

- Run build (`npm run build` or equivalent)
- If build fails → STOP and fix errors

## 2. Audit Changes

- Run `git status`
- Review all modified/untracked files

## 3. Respect `.gitignore`

NEVER commit:

- `*.m.md`
- `developer-utilities/`
- Any ignored files

## 4. Atomic Commits

Split commits logically:

- Feature
- Fix
- Refactor
- Migration
- Styling

## 5. Commit Message Style

Use conventional prefixes:

- `feat:`
- `fix:`
- `refactor:`
- `chore:`
- `style:`

Keep messages concise.

## 6. Push Rules

- Push once after all commits
- Never:
  - `--force`
  - `--amend` (after push)
  - `--no-verify`

---

# 🧠 Dev Context System (developer-utilities/)

This folder is **agent memory**, not source code.

## Rules:

- NEVER commit this folder
- Use it to understand context before making decisions

## Common Files:

- `chat.m.md` → sanitized discussion history
- `implementation.m.md` → current plan
- `timeline-changes.m.md` → change log
- `todo.m.md` → deferred work

## Behavior:

- Always check relevant `.m.md` files before making major decisions
- Keep them updated as work progresses

---

# 🚫 What NOT to Do

- Do not guess requirements — infer carefully or ask
- Do not introduce breaking changes silently
- Do not refactor unrelated code without reason
- Do not add dependencies unnecessarily
- Do not ignore errors or warnings

---

# ✅ Definition of Done

Work is only complete when:

- Code builds successfully
- No obvious bugs or edge cases are ignored
- Follows all rules in this document
- Timeline log updated
- Relevant todos captured

---

# 🔁 Reusability Rule

This file is designed to be reusable across projects.

Agents should:

- Adapt to the stack, but NOT relax standards
- Maintain these principles regardless of framework or language
