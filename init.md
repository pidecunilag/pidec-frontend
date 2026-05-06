# Welcome to PIDEC 1.0 (Frontend Team Workspace)

Hello Agent! You have been invoked by the new Frontend Developer joining the PIDEC 1.0 project.
This repository is shared with the Lead Developer (Tayo), who is also utilizing an AI agent. To prevent catastrophic merge conflicts, architectural divergence, and duplicated effort, you must strictly follow the operational boundaries outlined in this document.

## 🛑 REQUIRED FIRST STEPS
Before you write any code, execute any commands, or propose any architecture, you **MUST** read the following documents to understand the platform constraints and coding standards:
1. `prd.md` - The Product Requirements Document (explains the competition stages, constraints, and business logic).
2. `AGENTS.md` - The Agent Operating System rules (strict coding, committing, and architectural guidelines).

---

## 🏗️ The Two-Man Action Plan & Scope Delegation

The frontend workload has been strictly divided into exclusive domains. 

### What You (and your Developer) Are Building:
You have **EXCLUSIVE OWNERSHIP** over the following domains. You may freely create, modify, and delete files within these directories to implement your features:

1. **Student Dashboard & Team Management (`/app/(protected)/dashboard/*`)**
   - Main dashboard layout reacting dynamically to competition stages.
   - Team creation, invite link generation, and team-lock logic.
2. **Submissions Portal (`/app/(protected)/dashboard/submissions/*`)**
   - Multi-stage forms (Stage 1 Proposal, Stage 2 Video Links).
   - Integration with the pre-existing `useAutosave` hook for draft persistence.
3. **Judge Portal (`/app/(protected)/judge/*`)**
   - Judge-facing dashboard listing assigned teams.
   - Dynamic scoring rubrics and feedback submission forms.

### What the Lead Developer is Building (DO NOT TOUCH):
The Lead Developer (Tayo) has **EXCLUSIVE OWNERSHIP** over the following domains. **DO NOT MODIFY** files in these domains without explicit permission from the Lead Dev:

1. **The Admin Portal (`/app/(protected)/admin/*`)** 
   - Handles stage gates, team moderation, and manual document verification.
2. **Global Architecture & Authentication (`/lib/api/*`, `/lib/hooks/use-auth.ts`, `/components/auth/*`)**
   - The auth and API interceptor layers are already perfected. Do not touch them.
3. **Core Configuration (`globals.css`, `tailwind.config.ts`, `package.json`, `components.json`)**
   - Do not alter global themes or install new dependencies to solve local UI problems. Use the existing `shadcn/ui` components and brand tokens.

### Where You Intertwine (Coordinate Here):
- **Zustand Stores (`/lib/stores/*`)**: You will heavily consume global stores like `useTeamStore` and `useSubmissionStore`. If you need to alter the global state payloads to support your UI, ask the Lead Dev first.
- **Verification Loop**: You will build the UI that shows "Pending Verification" or "Rejected" status on the dashboard. The Lead Dev builds the Admin UI that actually triggers those state changes in the database.
- **API Endpoints**: If you find an endpoint missing or poorly typed in `lib/types.ts`, do not hack a workaround—request the addition from the Lead Dev.

---

## 📋 YOUR FIRST INSTRUCTION

Now that you have read this file, please output a structured summary for your developer containing:
1. A brief overview of what your exclusive tasks are.
2. A clear list of the files/folders you are strictly forbidden from touching.
3. Your proposed immediate next step to begin work on the **Student Dashboard**.
