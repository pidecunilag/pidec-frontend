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
   - The full dashboard **chrome** (top nav, status bar, persistent banners per PRD §4.1, sidebar if you choose) is yours to design and own. The protected route group already has an auth/role gate — you build everything inside.
   - Team creation, invite link generation, and team-lock logic.
2. **Submissions Portal (`/app/(protected)/dashboard/submissions/*`)**
   - Multi-stage forms (Stage 1 Proposal, Stage 2 Video Links).
   - Integration with the pre-existing `useAutosave` hook for draft persistence.
3. **Judge Portal (`/app/(protected)/judge/*`)**
   - Judge-facing dashboard listing assigned teams (chrome included — same pattern).
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
- **Data hooks (`/lib/hooks/*`)**: All server data flows through React Query hooks the Lead Dev maintains. **Just consume them — do not write your own `fetch` calls or `useEffect`-based loaders.** Pattern:
  ```tsx
  const { team, invites, isLoading, acceptInvite } = useTeam();
  ```
  Cache, polling, optimistic updates, and invalidation already live behind the hook. If a hook is missing data you need, ask the Lead Dev to extend it — do not bypass it.
- **Query keys**: If you ever need direct cache control (rare — most use cases don't), use the `qk` registry from `lib/api/query-keys.ts`. Never inline literal key strings.
- **Motion vocabulary**: Every element on the platform must have an entrance, and any element that leaves (conditional render, route transition, list mutation) must have an exit. Do not roll your own variants per page — use the shared primitives in `components/landing/motion-primitives.tsx`:
  ```tsx
  import { Reveal, StaggerGroup, StaggerItem } from '@/components/landing/motion-primitives';

  <Reveal>                        {/* fade + rise on scroll, fires once */}
    <h2>Section heading</h2>
  </Reveal>

  <StaggerGroup as="ul">           {/* parent — orchestrates stagger */}
    {items.map(i => (
      <StaggerItem as="li" key={i.id}>{i.label}</StaggerItem>
    ))}
  </StaggerGroup>
  ```
  For lists that mutate (invites disappearing, notifications appearing, modals), wrap with `<AnimatePresence>` from `motion/react` and give each child a stable `key`. Do not skip exit animations — that is the project's design contract. If you need a new motion primitive that several pages will use, add it to `motion-primitives.tsx` rather than duplicating variants.
- **Zustand Stores (`/lib/stores/*`)**: Only two survive — `auth-store` (session identity, sync reads) and `ui-store` (announcement banner, global loading flags). Server state lives in React Query, not Zustand. If you need a new client-state slice, ask first.
- **Verification Loop**: You will build the UI that shows "Pending Verification" or "Rejected" status on the dashboard. The Lead Dev builds the Admin UI that actually triggers those state changes in the database.
- **API Endpoints**: If you find an endpoint missing or poorly typed in `lib/types.ts`, do not hack a workaround—request the addition from the Lead Dev.

---

## 📐 Page & Layout Convention (Non-Negotiable)

**Never put `"use client"` on a `page.tsx` or `layout.tsx`.** Every route file in this app is a server component that exports `metadata` and renders a co-located client child for interactivity. This is for SEO, smaller client bundles, and proper streaming.

The pattern, copied from `app/(public)/login/`:

```tsx
// page.tsx — SERVER COMPONENT (no "use client")
import type { Metadata } from "next";
import { TeamView } from "./team-view";

export const metadata: Metadata = {
  title: "My Team",                    // becomes "My Team · PIDEC 1.0"
  description: "Manage your PIDEC 1.0 team — invites, members, and submissions.",
};

export default function TeamPage() {
  return <TeamView />;
}
```

```tsx
// team-view.tsx — CLIENT COMPONENT
"use client";

import { useTeam } from "@/lib/hooks/use-team";

export function TeamView() {
  const { team, invites, isLoading } = useTeam();
  // ...all your interactive UI here
}
```

**Rules:**
- Every new `page.tsx` you create **must** export `metadata` with at least a `title` and `description`. The root layout supplies the title template, so just write the short title (`"My Team"` not `"My Team · PIDEC 1.0"`).
- Naming the client child: `*-form.tsx` for forms, `*-view.tsx` or `*-shell.tsx` for layouts/views, `*-flow.tsx` for multi-step flows. Match the existing siblings in `(public)/`.
- The `(protected)` route group already exports `robots: { index: false }` from its layout — your dashboard pages inherit that automatically. Don't override it.
- If you need to wrap in `<Suspense>` (e.g. a page that reads `useSearchParams`), put the Suspense boundary in the server-component `page.tsx`, not in the client child. See `app/(public)/reset-password/` for the pattern.

---

## 📋 YOUR FIRST INSTRUCTION

Now that you have read this file, please output a structured summary for your developer containing:
1. A brief overview of what your exclusive tasks are.
2. A clear list of the files/folders you are strictly forbidden from touching.
3. Your proposed immediate next step to begin work on the **Student Dashboard**.
