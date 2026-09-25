# CODE STAR — Project Scaffold Plan

## Top-Level Overview

Build the initial **project scaffold** for CODE STAR, a 5-module developer productivity platform.

**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui  
**Deployment target:** Vercel (frontend + serverless API routes)  
**Scope of this plan:** Folder structure, config files, routing skeleton, shared types, and API route stubs for all 5 modules. No database wiring yet.  
**Out of scope:** Database, auth, real analysis logic, 3D rendering, actual Bob 2.0 API calls.

---

## Architecture Overview

```
3-Tier Serverless
┌─────────────────────────────────────────────┐
│  TIER 1 — Presentation (Next.js App Router) │
│  /app  — pages, layouts, module UIs         │
└─────────────────────────────────────────────┘
                      │
┌─────────────────────────────────────────────┐
│  TIER 2 — Logic (Vercel Serverless)         │
│  /app/api  — route handlers per module      │
└─────────────────────────────────────────────┘
                      │
┌─────────────────────────────────────────────┐
│  TIER 3 — Data (TBD)                        │
│  Stubbed service layer, no DB wiring yet    │
└─────────────────────────────────────────────┘
```

---

## Sub-Tasks

---

### Sub-Task 1 — Root Config Files

**Intent:** Establish the project foundation so every subsequent file has correct TypeScript, Tailwind, and Next.js context.

**Expected Outcomes:**
- `package.json` with all required dependencies declared
- `tsconfig.json` with strict mode and path aliases (`@/*`)
- `next.config.ts` with basic settings
- `tailwind.config.ts` referencing the `app/` and `components/` directories
- `postcss.config.mjs` for Tailwind processing
- `.eslintrc.json` with Next.js recommended rules
- `prettier.config.js` for consistent formatting
- `.gitignore` with standard Next.js entries

**Todo List:**
- [ ] Create `package.json` with next, react, react-dom, typescript, tailwindcss, shadcn dependencies and scripts
- [ ] Create `tsconfig.json` with `@/*` path alias pointing to root
- [ ] Create `next.config.ts`
- [ ] Create `tailwind.config.ts`
- [ ] Create `postcss.config.mjs`
- [ ] Create `.eslintrc.json`
- [ ] Create `prettier.config.js`
- [ ] Create `.gitignore`

**Status:** `[ ] pending`

---

### Sub-Task 2 — Shared Types & Utilities

**Intent:** Define the TypeScript contracts shared across all 5 modules so API routes and UI components agree on shape.

**Expected Outcomes:**
- `/types/dna.ts` — DNA Profiler types
- `/types/coldcase.ts` — Cold Case Files types
- `/types/mood.ts` — Mood Ring types
- `/types/foodchain.ts` — Food Chain types
- `/types/city.ts` — 3D City Explorer types
- `/types/api.ts` — Generic API response envelope (`ApiResponse<T>`, `ApiError`)
- `/lib/utils.ts` — shadcn `cn()` utility + any shared helpers
- `/lib/constants.ts` — Module names, route paths, status enums

**Todo List:**
- [ ] Create `/types/api.ts` with `ApiResponse<T>` and `ApiError` types
- [ ] Create `/types/dna.ts`
- [ ] Create `/types/coldcase.ts`
- [ ] Create `/types/mood.ts`
- [ ] Create `/types/foodchain.ts`
- [ ] Create `/types/city.ts`
- [ ] Create `/lib/utils.ts` with `cn()` helper
- [ ] Create `/lib/constants.ts` with route constants and module metadata

**Status:** `[ ] pending`

---

### Sub-Task 3 — App Router Layout & Navigation

**Intent:** Set up the root layout, global styles, and top-level navigation so all 5 module pages are reachable.

**Expected Outcomes:**
- `/app/layout.tsx` — root layout with Tailwind base, font, and sidebar shell
- `/app/page.tsx` — landing/redirect page pointing to dashboard
- `/app/globals.css` — Tailwind directives + CSS variables for shadcn
- `/components/layout/Sidebar.tsx` — left nav with links to all 5 modules
- `/components/layout/TopBar.tsx` — top bar with repo selector placeholder and theme toggle
- `/components/layout/Shell.tsx` — composable wrapper used by module pages

**Todo List:**
- [ ] Create `/app/globals.css`
- [ ] Create `/app/layout.tsx` with font and Shell wrapper
- [ ] Create `/app/page.tsx` redirecting to `/dashboard`
- [ ] Create `/components/layout/Sidebar.tsx` with 5 module nav items
- [ ] Create `/components/layout/TopBar.tsx`
- [ ] Create `/components/layout/Shell.tsx`

**Status:** `[ ] pending`

---

### Sub-Task 4 — Module Page Skeletons (5 pages)

**Intent:** Create a stub UI page for each module under `/app/(modules)/` so routing works and each module has a placeholder to build into.

**Expected Outcomes:**
- `/app/(modules)/dna/page.tsx` — DNA Profiler stub
- `/app/(modules)/coldcases/page.tsx` — Cold Case Files stub
- `/app/(modules)/mood/page.tsx` — Mood Ring stub
- `/app/(modules)/foodchain/page.tsx` — Food Chain stub
- `/app/(modules)/city/page.tsx` — 3D City Explorer stub
- `/app/dashboard/page.tsx` — unified dashboard with cards linking to each module
- Each page renders the Shell layout, a module title, a brief description, and a "Coming Soon" badge

**Todo List:**
- [ ] Create route group `/app/(modules)/` with a shared layout
- [ ] Create `/app/dashboard/page.tsx` with 5 module summary cards
- [ ] Create `/app/(modules)/dna/page.tsx`
- [ ] Create `/app/(modules)/coldcases/page.tsx`
- [ ] Create `/app/(modules)/mood/page.tsx`
- [ ] Create `/app/(modules)/foodchain/page.tsx`
- [ ] Create `/app/(modules)/city/page.tsx`

**Status:** `[ ] pending`

---

### Sub-Task 5 — API Route Stubs (Serverless Functions)

**Intent:** Create a stub Vercel serverless API route for every endpoint across all 5 modules. Each route returns a typed mock response so the frontend can be wired up before real logic exists.

**Expected Outcomes — routes created:**

| Module | Route | Method |
|---|---|---|
| DNA | `/api/dna/analyze` | POST |
| DNA | `/api/dna/compare` | GET |
| DNA | `/api/dna/timeline` | GET |
| Cold Cases | `/api/coldcases/scan` | POST |
| Cold Cases | `/api/coldcases/[bugId]` | GET |
| Cold Cases | `/api/coldcases/fix/[bugId]` | POST |
| Cold Cases | `/api/coldcases/heatmap` | GET |
| Mood | `/api/mood/developer/[username]` | GET |
| Mood | `/api/mood/team` | GET |
| Mood | `/api/mood/code-health` | GET |
| Mood | `/api/mood/correlation` | GET |
| Food Chain | `/api/foodchain/graph` | GET |
| Food Chain | `/api/foodchain/impact/[module]` | GET |
| Food Chain | `/api/foodchain/predators` | GET |
| Food Chain | `/api/foodchain/fragile` | GET |
| City | `/api/city/generate` | GET |
| City | `/api/city/search/[query]` | GET |
| City | `/api/city/directions` | GET |

All routes follow the `ApiResponse<T>` envelope and return HTTP 200 with `{ data: null, status: "stub", message: "..." }`.

**Todo List:**
- [ ] Create a shared `withApiHandler` wrapper in `/lib/api-handler.ts` for consistent error enveloping
- [ ] Create DNA API routes (3 files)
- [ ] Create Cold Cases API routes (4 files)
- [ ] Create Mood API routes (4 files)
- [ ] Create Food Chain API routes (4 files)
- [ ] Create City API routes (3 files)

**Status:** `[ ] pending`

---

### Sub-Task 6 — shadcn/ui Component Init & Module Cards

**Intent:** Initialize shadcn/ui component library and add the base set of components used by the dashboard and module pages.

**Expected Outcomes:**
- `components.json` — shadcn config
- `/components/ui/` — button, card, badge, separator, skeleton (generated by shadcn CLI pattern, written manually since no CLI available in plan mode)
- `/components/modules/ModuleCard.tsx` — reusable card component used on the dashboard showing module name, description, status badge, and a link

**Todo List:**
- [ ] Create `components.json` for shadcn config
- [ ] Create `/components/ui/button.tsx`
- [ ] Create `/components/ui/card.tsx`
- [ ] Create `/components/ui/badge.tsx`
- [ ] Create `/components/ui/skeleton.tsx`
- [ ] Create `/components/modules/ModuleCard.tsx`

**Status:** `[ ] pending`

---

## File Tree (End State)

```
/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── (modules)/
│   │   ├── layout.tsx
│   │   ├── dna/page.tsx
│   │   ├── coldcases/page.tsx
│   │   ├── mood/page.tsx
│   │   ├── foodchain/page.tsx
│   │   └── city/page.tsx
│   └── api/
│       ├── dna/
│       │   ├── analyze/route.ts
│       │   ├── compare/route.ts
│       │   └── timeline/route.ts
│       ├── coldcases/
│       │   ├── scan/route.ts
│       │   ├── [bugId]/route.ts
│       │   ├── fix/[bugId]/route.ts
│       │   └── heatmap/route.ts
│       ├── mood/
│       │   ├── developer/[username]/route.ts
│       │   ├── team/route.ts
│       │   ├── code-health/route.ts
│       │   └── correlation/route.ts
│       ├── foodchain/
│       │   ├── graph/route.ts
│       │   ├── impact/[module]/route.ts
│       │   ├── predators/route.ts
│       │   └── fragile/route.ts
│       └── city/
│           ├── generate/route.ts
│           ├── search/[query]/route.ts
│           └── directions/route.ts
├── components/
│   ├── layout/
│   │   ├── Shell.tsx
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── modules/
│   │   └── ModuleCard.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       └── skeleton.tsx
├── types/
│   ├── api.ts
│   ├── dna.ts
│   ├── coldcase.ts
│   ├── mood.ts
│   ├── foodchain.ts
│   └── city.ts
├── lib/
│   ├── utils.ts
│   ├── constants.ts
│   └── api-handler.ts
├── components.json
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── prettier.config.js
├── .eslintrc.json
└── .gitignore
```

---

## Notes for Implementation

- Use Next.js 14 App Router conventions throughout (`route.ts` for API, `page.tsx` for pages, `layout.tsx` for layouts).
- All API routes use the Next.js `NextRequest` / `NextResponse` pattern — no Express.
- No `src/` wrapper — files live directly at root to match Vercel's preferred Next.js layout.
- Database service stubs go in `/lib/services/` in a future sub-task when DB is decided.
- shadcn components are written manually (no CLI execution in plan mode) following shadcn's source patterns.
