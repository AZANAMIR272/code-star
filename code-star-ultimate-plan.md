# CODE STAR — Updated Build Plan
## "Pop-Art UI + Five Working AI Modules + 3D Repository Explorer"

> **Updated to match the actual CODE STAR Project Report Book dated 26 September 2026.**
>
> The implementation plan below reflects the shipped architecture, design system, modules, API structure, AI fallback strategy, report workflow, testing, and deployment described in the project report.

---

# 1. Vision

Transform CODE STAR into a production-ready developer productivity platform that accepts a repository URL and turns the codebase into five understandable visual analyses:

1. **DNA Profiler** — repository architecture and codebase fingerprint.
2. **Cold Case Files** — stale bugs, severity, suspected causes, and suggested fixes.
3. **Mood Ring** — team mood and code-health indicators.
4. **Food Chain** — dependency ecosystem and fragile modules.
5. **3D City Explorer** — an interactive spatial representation of the repository.

The platform is powered by **IBM watsonx.ai** through the centralized `askBob()` helper. If AI credentials, network access, or response parsing fail, deterministic bundled mock data keeps the application usable.

---

# 2. Current Product Direction

The previous plan proposed a dark-first glassmorphism interface with neon gradients and blurred cards. That direction is **not part of the final CODE STAR implementation**.

The implemented product uses a distinctive **1960s pop-art / print-shop visual system**.

### Final design principles

- Print-shop / 1960s pop-art visual identity.
- Newsprint-style surfaces.
- Strong black/ink borders.
- Hard shadows instead of soft shadows.
- Ben-Day halftone dot textures.
- Bold uppercase display typography.
- No gradients.
- No backdrop blur.
- No glowing borders.
- Press-down interactions.
- Responsive desktop and mobile layouts.

The report defines the main design tokens as:

- **Sun:** `#ffc900`
- **Ink:** `#0f0d0a`
- **Signal:** `#dc341e`
- **Process:** `#1e40c9`
- **Newsprint:** `#f6f1e6`

---

# 3. Technology Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15.5.26 |
| Architecture | App Router + Route Handlers |
| UI | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS + custom design tokens |
| Animation | Framer Motion + CSS keyframes |
| Dependency graph | `@xyflow/react` / React Flow 12 |
| 3D | Three.js + `@react-three/fiber` + `@react-three/drei` |
| Icons | lucide-react |
| UI primitives | Radix UI + CVA |
| AI | IBM watsonx.ai |
| AI gateway | `lib/bob-ai.ts` / `askBob()` |
| Quality | ESLint, TypeScript, Prettier |
| Hosting | Vercel |
| Version control | GitHub |

---

# 4. Required Packages

The project uses the following major packages for animation, dependency visualization, and 3D rendering:

```bash
npm install framer-motion
npm install reactflow @xyflow/react
npm install three @react-three/fiber @react-three/drei
npm install @types/three
```

The final implementation should keep dependencies aligned with the actual project and avoid unnecessary packages.

---

# 5. Application Architecture

CODE STAR follows the Next.js 15 App Router architecture.

## Main layers

### Root layout

**File:**

```text
app/layout.tsx
```

Responsibilities:

- Global fonts.
- Metadata.
- `ReportProvider`.
- Application-wide layout foundation.

### Shell

**Files:**

```text
app/dashboard/layout.tsx
app/(modules)/layout.tsx
components/layout/*
```

Responsibilities:

- Animated background.
- Sidebar.
- Top bar.
- Mobile module rail.
- Shared application navigation.

### Landing page

**Files:**

```text
app/page.tsx
components/landing/*
```

The landing page remains outside the authenticated-style application shell and presents the product using the pop-art visual identity.

### Module pages

```text
app/(modules)/dna
app/(modules)/coldcases
app/(modules)/mood
app/(modules)/foodchain
app/(modules)/city
```

Each module owns its client-side interaction and reads persisted results from the shared report store.

### API layer

```text
app/api/**
```

All API handlers use the common response structure:

```json
{
  "status": "success",
  "data": {},
  "timestamp": "..."
}
```

The handlers call `askBob()` first and use deterministic mock data when AI execution is unavailable.

### AI gateway

```text
lib/bob-ai.ts
```

Central responsibility:

```text
Module/API request
      ↓
askBob()
      ↓
IBM watsonx.ai
      ↓
Structured response
      ↓
Module
```

Failure path:

```text
IBM watsonx.ai unavailable
      ↓
Fallback mock data
      ↓
Module still works
```

---

# 6. Global Design System

## Typography

Use:

- **Archivo Black** for major display headings.
- **Inter** for normal body text.

## Borders

All major cards, inputs, chips, and tables use:

```css
border: 3px solid #0f0d0a;
```

## Hard shadow

Use the project hard-shadow concept:

```text
4px 4px 0 #0f0d0a
```

Do not use soft blurred shadows.

## Interaction

The `.press` interaction moves elements into their hard shadow during hover/active states.

## Texture

Use Ben-Day halftone utilities:

```text
.dots-red-16
.dots-ink-8
.dots-white-16
.dots-blue-16
```

## Explicitly avoid

```text
linear-gradient
backdrop-blur
glowing borders
soft blur shadows
neon glassmorphism
```

---

# 7. Sub-Task 1 — Global Shell and Pop-Art Theme

**Status:** `[x] implemented`

## Intent

Create a consistent print-shop-inspired visual system across the entire application.

## Implementation

Update:

```text
tailwind.config.ts
app/globals.css
components/layout/*
```

Implement:

- Global color tokens.
- Archivo Black + Inter.
- Hard shadows.
- Halftone backgrounds.
- Press-down interaction.
- Responsive sidebar.
- Responsive module navigation.
- Shared background treatment.
- No legacy neon/glass styling.

## Verification

Audit all major routes at:

```text
1440px
390px
```

Expected:

```text
0 blurred box shadows
0 linear gradients
0 backdrop blur
0 horizontal overflow
```

---

# 8. Sub-Task 2 — Dashboard

**Status:** `[x] implemented**

## Purpose

The dashboard is the central entry point for repository analysis.

## Main workflow

User enters:

```text
Repository URL
```

Then CODE STAR launches five analysis jobs in parallel:

```text
DNA
Cold Cases
Mood
Food Chain
3D City
```

Use:

```javascript
Promise.allSettled()
```

instead of sequential execution.

## Dashboard features

- Repository overview.
- Animated/count-up statistics.
- Overall health score.
- Active alerts.
- Bugs found.
- Modules mapped.
- Download report shortcut.
- Generate-all workflow.
- Per-module progress state.
- Open buttons after successful generation.

## Data flow

```text
Repository URL
       ↓
Dashboard
       ↓
Promise.allSettled()
       ↓
┌────────┬───────────┬──────┬────────────┬──────┐
│  DNA   │ Cold Case │ Mood │ Food Chain │ City │
└────────┴───────────┴──────┴────────────┴──────┘
       ↓
Shared Report Store
       ↓
Module Pages + /report
```

---

# 9. Sub-Task 3 — DNA Profiler

**Status:** `[x] implemented`

## Route

```text
/dna
```

## API

```text
POST /api/dna/analyze
POST /api/dna/compare
GET  /api/dna/timeline
```

## Output

The DNA profiler returns:

- Programming languages.
- Complexity.
- Patterns.
- Top files.
- Written summary.
- Six analysis layers.

### Six layers

```text
Structural
Behavioral
Tech
Quality
Social
Temporal
```

Each layer receives a score from:

```text
0–100
```

## UI

- DNA fingerprint header.
- Language chips.
- Score bars.
- Summary.
- Compare tab.
- Timeline tab.

## Compare

Compare two repositories and display their differences.

## Timeline

Display repository activity/history information.

---

# 10. Sub-Task 4 — Cold Case Files

**Status:** `[x] implemented`

## Route

```text
/coldcases
```

## API

```text
POST /api/coldcases/scan
GET  /api/coldcases/heatmap
GET/POST /api/coldcases/[bugId]
GET/POST /api/coldcases/fix/[bugId]
```

## Case structure

Each case contains:

```text
id
title
severity
lastActivity
suspectedCause
suggestedFix
```

## Severity levels

```text
low
medium
high
critical
```

## UI

The interface uses an evidence-board / investigation concept:

- Severity chips.
- Case cards.
- Case detail.
- Fix recipe.
- Bug density heatmap.

The module should clearly communicate which bugs have become stale and what the AI suggests doing next.

---

# 11. Sub-Task 5 — Mood Ring

**Status:** `[x] implemented`

## Route

```text
/mood
```

## APIs

```text
GET /api/mood/team
GET /api/mood/code-health
GET /api/mood/correlation
GET /api/mood/developer/[username]
```

## Team data

The team endpoint provides:

- Overall mood.
- Mood score.
- Members.
- Commits.
- Quality.
- Recommendations.
- Seven-day trend.

## Code health

Display:

- Overall code-health score.
- Test coverage.
- Technical debt.
- Metric breakdown.

## UI

- KPI cards.
- Mood/trend visualization.
- Team member table.
- Code-health tab.
- Recommendations.

The module should make team and code-health information easy to understand without presenting it as a medical or psychological diagnosis.

---

# 12. Sub-Task 6 — Food Chain

**Status:** `[x] implemented`

## Route

```text
/foodchain
```

## APIs

```text
GET /api/foodchain/graph
GET /api/foodchain/fragile
GET /api/foodchain/predators
GET /api/foodchain/impact/[module]
```

## Main graph

Use:

```text
React Flow
```

The graph contains:

```text
Nodes
Edges
```

## Main purpose

Show:

- Dependency relationships.
- Fragile modules.
- Risk scores.
- Dependents.
- Reasons for risk.
- Module impact / blast radius.

## Interactive behaviour

Users can inspect the dependency ecosystem and identify modules where a change could affect many other parts of the application.

---

# 13. Sub-Task 7 — 3D City Explorer

**Status:** `[x] implemented`

## Route

```text
/city
```

## APIs

```text
GET /api/city/generate
GET /api/city/search/[query]
GET /api/city/directions
```

## Purpose

Convert repository structure into a spatial city metaphor.

### Repository mapping

```text
Repository
   ↓
Districts
   ↓
Buildings
   ↓
Files / Modules
```

Buildings contain information such as:

- Height.
- Footprint.
- Colour.
- Lines of code.
- Programming language.

## Technology

```text
three
@react-three/fiber
@react-three/drei
```

## Interaction

Support:

- Orbiting.
- Zoom.
- Navigation.
- Building inspection.
- Search.
- Direction hints.

## Fallback

Provide a 2D fallback for devices where WebGL is unavailable.

---

# 14. Shared Report Store

**Status:** `[x] implemented`

## Files

```text
lib/report-store.ts
components/modules/ReportStore.tsx
```

## Storage key

```text
codestar:report
```

## Stored structure

```text
{
  repo,
  savedAt,
  dna,
  coldcases,
  mood,
  foodchain,
  city
}
```

## Responsibilities

The store must:

- Persist analysis results.
- Survive page navigation.
- Avoid unnecessary AI regeneration.
- Allow individual modules to update their own result.
- Support the final report.

## Context methods

```text
report
loaded
saveReport
patchReport
clearReport
```

---

# 15. Printable Report

**Status:** `[x] implemented`

## Route

```text
/report
```

The report is intentionally outside the main shell so the sidebar and application controls do not appear in print.

## Sections

1. Repository header.
2. Dashboard overview.
3. Overall health score.
4. DNA.
5. Cold Case Files.
6. Mood.
7. Code Health.
8. Food Chain.
9. 3D City.
10. Footer.

## PDF generation

Do not add a server-side PDF library.

Use:

```javascript
window.print()
```

and the browser's native:

```text
Print → Save as PDF
```

## Print CSS

Use:

```css
@media print
```

to:

- Hide toolbar.
- Remove screen-only borders/shadows.
- Preserve intended colours.
- Prevent sections from breaking across pages.

---

# 16. API Reference

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/dashboard/stats` | Dashboard statistics |
| POST | `/api/dna/analyze` | Repository DNA analysis |
| POST | `/api/dna/compare` | Repository comparison |
| GET | `/api/dna/timeline` | Activity timeline |
| POST | `/api/coldcases/scan` | Find stale bugs |
| GET | `/api/coldcases/heatmap` | Bug density |
| GET/POST | `/api/coldcases/[bugId]` | Case details |
| GET/POST | `/api/coldcases/fix/[bugId]` | Suggested fix |
| GET | `/api/mood/team` | Team mood |
| GET | `/api/mood/code-health` | Code health |
| GET | `/api/mood/correlation` | Mood/delivery correlation |
| GET | `/api/mood/developer/[username]` | Developer profile |
| GET | `/api/foodchain/graph` | Dependency graph |
| GET | `/api/foodchain/fragile` | Fragile modules |
| GET | `/api/foodchain/predators` | High-impact modules |
| GET | `/api/foodchain/impact/[module]` | Module blast radius |
| GET | `/api/city/generate` | Generate repository city |
| GET | `/api/city/search/[query]` | Search city objects |
| GET | `/api/city/directions` | Navigation hints |

All handlers should follow the common:

```json
{
  "status": "...",
  "data": {},
  "timestamp": "..."
}
```

response envelope.

---

# 17. AI Integration

## Central gateway

```text
lib/bob-ai.ts
```

Use:

```text
askBob(prompt, system)
```

for the AI interaction.

## Required behaviour

Every API route should:

1. Prepare the analysis prompt.
2. Call IBM watsonx.ai through `askBob()`.
3. Parse the result.
4. Return structured JSON.
5. Fall back to deterministic mock data if:
   - credentials are missing,
   - network connection fails,
   - timeout occurs,
   - AI returns invalid JSON.

This makes CODE STAR demonstrable even when the AI service is temporarily unavailable.

---

# 18. Performance Strategy

The main performance problem is AI latency.

Instead of:

```text
DNA → wait → Cold Case → wait → Mood → wait → Food Chain → wait → City
```

use:

```text
DNA ─────┐
Cold ────┤
Mood ────┼──→ Promise.allSettled()
Food ────┤
City ────┘
```

Benefits:

- Modules run independently.
- One failure does not stop the others.
- Progress can be displayed per module.
- Mock fallback prevents complete workflow failure.

---

# 19. Problems and Solutions

## Problem 1 — Theme inconsistency

**Problem:** Old neon/glass styling conflicted with the required pop-art system.

**Solution:** Rebuilt the Tailwind tokens and global CSS around the final palette, hard shadows, halftone textures, and press interactions.

## Problem 2 — Soft shadows and gradients

**Problem:** Shared components still contained old visual styles.

**Solution:** Restyled buttons, cards, badges, and module cards and audited the DOM.

## Problem 3 — Mobile overflow

**Problem:** Sidebar squeezed the main content.

**Solution:**

- Hide sidebar below large screens.
- Add mobile module rail.
- Hide horizontal overflow.

## Problem 4 — Slow AI calls

**Problem:** Sequential generation could take too long.

**Solution:** `Promise.allSettled()` + per-module progress + mock fallback.

## Problem 5 — Lost state

**Problem:** Navigating between pages lost generated analysis.

**Solution:** Shared React context + localStorage report store.

## Problem 6 — No single deliverable

**Problem:** Each module generated independently.

**Solution:** Generate-all dashboard workflow + printable `/report`.

## Problem 7 — App shell appeared in PDF

**Problem:** Sidebar and buttons appeared during printing.

**Solution:** Report page outside shell + print-specific CSS.

## Problem 8 — No PDF dependency

**Problem:** Adding a PDF library was unnecessary.

**Solution:** Browser-native `window.print()`.

---

# 20. Testing and Verification

The implementation should be verified using the following checks.

## Type checking

```bash
npx tsc --noEmit
```

Expected:

```text
0 errors
```

## Linting

```bash
npx next lint --dir app
```

Expected:

```text
Only known/pre-existing warnings
```

## Formatting

```bash
npx prettier --write
```

## Production build

```bash
npx next build
```

Expected:

```text
Compiled successfully
```

## Route smoke testing

Verify:

```text
/
 /dashboard
 /report
 /dna
 /coldcases
 /mood
 /foodchain
 /city
```

Expected:

```text
HTTP 200
```

## Responsive audit

Test at:

```text
1440px
390px
```

Verify:

```text
0 soft shadows
0 gradients
0 backdrop blur
0 horizontal overflow
```

---

# 21. Deployment

## Vercel

The application is deployed on Vercel.

Next.js automatically handles:

- Application build.
- Static routes.
- Serverless API functions.

## GitHub

Repository:

```text
https://github.com/AZANAMIR272/code-star
```

The repository should exclude:

```text
node_modules
.next
.env*
.vercel
```

No API credentials or secrets should be committed.

---

# 22. Team Responsibilities

| Team Member | Role | Responsibility |
|---|---|---|
| Syed Muhammad Azan | Team Lead — AI Engineer & Researcher | Architecture, AI integration, `askBob`, prompts, leadership |
| Isbah Ali | Backend Developer | API handlers, data contracts, fallback logic, performance |
| Mariam Zuberi | Frontend Developer & AI UI | Design system, module pages, report/print experience |
| Muhammad Safwan | Backend AI & ML | AI pipelines, model responses, graph/city/mood data shaping |

---

# 23. Execution Order

```text
Phase 1
Global Pop-Art Design System
        ↓
Phase 2
Application Shell + Dashboard
        ↓
Phase 3
DNA Profiler
Cold Case Files
Mood Ring
        ↓
Phase 4
Food Chain
        ↓
Phase 5
3D City Explorer
        ↓
Phase 6
Shared Report Store
        ↓
Phase 7
Printable Report
        ↓
Phase 8
Testing + Responsive Audit
        ↓
Phase 9
Vercel Deployment + GitHub
```

The five analysis modules can execute in parallel at runtime through the dashboard's `Promise.allSettled()` workflow.

---

# 24. Future Scope

The following capabilities are intentionally future work:

- Real GitHub repository ingestion.
- Repository cloning and indexing.
- GitHub App integration.
- Authentication.
- Multi-repository workspaces.
- Shared team reports.
- Scheduled re-scans.
- Historical trend deltas.
- Server-side PDF generation.
- Email delivery.
- Pull-request DNA and impact analysis.
- CI/CD integration.
- GitHub Actions risk gates.
- Additional accessibility/high-contrast theme variants.

---

# 25. Final Acceptance Criteria

CODE STAR is considered complete when:

- [x] One repository URL can start the complete analysis workflow.
- [x] Five analysis modules are available.
- [x] IBM watsonx.ai is integrated through `askBob()`.
- [x] Deterministic mock fallback exists.
- [x] Generate-all runs modules in parallel.
- [x] Results persist through the shared report store.
- [x] DNA analysis provides six scored layers.
- [x] Cold Case Files provide severity, cause, and fix information.
- [x] Mood Ring provides team and code-health analysis.
- [x] Food Chain provides dependency and fragile-module analysis.
- [x] 3D City Explorer provides repository visualization.
- [x] 2D fallback exists for unsupported WebGL devices.
- [x] `/report` provides a complete printable report.
- [x] Browser-native PDF printing works.
- [x] Mobile layout has no horizontal overflow.
- [x] Production build succeeds.
- [x] Main routes return HTTP 200.
- [x] Project is deployed on Vercel.
- [x] Source is maintained in GitHub.

---

# 26. Final Product Definition

CODE STAR is not simply a dashboard or an AI chatbot.

It is a **developer productivity platform** that translates a software repository into multiple visual and analytical perspectives:

```text
                 CODE STAR
                     │
             Repository URL
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
      DNA        Cold Cases      Mood
        │            │            │
        └────────────┼────────────┘
                     ↓
                Food Chain
                     │
                     ↓
                3D City
                     │
                     ↓
             Shared Report Store
                     │
                     ↓
              Printable Report
```

The final product combines:

```text
AI analysis
+
developer productivity
+
visual storytelling
+
dependency intelligence
+
3D repository navigation
+
automated reporting
```

**CODE STAR — Analyze. Fix. Ship.**
