# CODE STAR — Full Build Plan (A to Z Workable)

## Overview

Transform CODE STAR from a skeleton scaffold into a fully working, interactive developer productivity platform powered by IBM Bob AI. Every module gets real data fetching, real UI rendering, and real interactivity.

**Scope:**
- 5 modules fully working: DNA Profiler, Cold Case Files, Mood Ring, Food Chain, 3D City Explorer
- Dashboard shows real AI-generated stats
- All 18 API endpoints powered by IBM Bob AI (no more stubs)
- Two new npm packages: `reactflow` (Food Chain graph) + `three` + `@react-three/fiber` + `@react-three/drei` (3D City)

**Non-goals:**
- No database / persistence layer (AI generates fresh data per request)
- No user auth / login system
- No real git repo integration (AI simulates analysis)

---

## Dependencies to Install

```
npm install reactflow @xyflow/react
npm install three @react-three/fiber @react-three/drei
npm install @types/three
```

---

## Sub-Tasks

---

### Sub-Task 1 — Install Dependencies + Complete All API Routes

**Status:** `[ ] pending`

**Intent:**
Install the two new npm packages needed for visualization, then wire every remaining stub API route with a real IBM Bob AI call. This ensures all 18 endpoints return real data before the frontend tries to consume them.

**Expected Outcomes:**
- `npm install` succeeds with reactflow and three/fiber/drei
- Zero stub responses remain — every endpoint calls `askBob()` and returns a typed JSON response
- Missing route `/api/coldcases/[bugId]/route.ts` is created

**Todo List:**
1. Run `npm install reactflow @xyflow/react three @react-three/fiber @react-three/drei @types/three`
2. Implement `/api/dna/timeline/route.ts` — GET ?repoUrl= → askBob returns timeline array (weekly snapshots of code health metrics)
3. Implement `/api/coldcases/heatmap/route.ts` — GET ?repoUrl= → askBob returns heatmap grid (file path, bug count, severity)
4. Create `/api/coldcases/[bugId]/route.ts` — GET → askBob returns single ColdCase detail by ID
5. Implement `/api/coldcases/fix/[bugId]/route.ts` — POST → askBob returns suggested fix steps for the bug
6. Implement `/api/mood/developer/[username]/route.ts` — GET → askBob returns DeveloperMood object
7. Implement `/api/mood/code-health/route.ts` — GET ?repoUrl= → askBob returns CodeHealthScore
8. Implement `/api/mood/correlation/route.ts` — GET → askBob returns MoodCodeCorrelation data
9. Implement `/api/foodchain/fragile/route.ts` — GET ?repoUrl= → askBob returns array of fragile modules
10. Implement `/api/foodchain/predators/route.ts` — GET ?repoUrl= → askBob returns apex predator modules
11. Implement `/api/foodchain/impact/[module]/route.ts` — GET → askBob returns ImpactAnalysis for that module
12. Implement `/api/city/search/[query]/route.ts` — GET → askBob returns CitySearchResult (building id + coordinates)
13. Implement `/api/city/directions/route.ts` — GET ?from=&to= → askBob returns path array of building IDs

**Relevant Context:**
- `lib/bob-ai.ts` — `askBob(prompt, systemPrompt)` helper
- `lib/api-handler.ts` — `withApiHandler`, `withDynamicHandler`
- `types/` — all TypeScript types for response shapes
- Pattern: call askBob with clear JSON-returning prompt, JSON.parse result, return NextResponse.json

---

### Sub-Task 2 — Dashboard: Real AI Stats

**Status:** `[ ] pending`

**Intent:**
Replace the hardcoded "0" values on the dashboard with AI-generated stats. The dashboard fetches a summary from a new `/api/dashboard/stats` route and displays live numbers.

**Expected Outcomes:**
- Dashboard shows: active repos, bugs found, modules mapped, active alerts (AI-generated numbers)
- Loading skeleton shows while fetching
- Module cards show "Live" badge instead of "Stub"

**Todo List:**
1. Create `/api/dashboard/stats/route.ts` — GET → askBob returns `{ repos: number, bugsFound: number, modulesMapped: number, activeAlerts: number, healthScore: number }`
2. Convert `app/dashboard/page.tsx` to a client component (`"use client"`)
3. Add `useState` for stats data + loading state
4. Add `useEffect` to fetch `/api/dashboard/stats` on mount
5. Replace hardcoded "0" values with fetched data
6. Show `<Skeleton>` while loading
7. Change all `ModuleCard` status props from `"stub"` to `"live"`

**Relevant Context:**
- `app/dashboard/page.tsx` — currently a server component with hardcoded zeros
- `components/modules/ModuleCard.tsx` — accepts `status` prop
- `components/ui/skeleton.tsx` — use for loading state

---

### Sub-Task 3 — DNA Profiler: Fully Working

**Status:** `[ ] pending`

**Intent:**
Wire the DNA Profiler page so the form works, the Analyze button fetches real AI data, and the 6 DNA layer cards render with real content instead of skeletons.

**Expected Outcomes:**
- User enters a repo URL, clicks "Analyze DNA" → loading state → real results appear
- 6 DNA layer cards show: name, score bar, key metrics, badges
- Compare tab: enter two repos → see similarity score + differences
- Timeline tab: see weekly code health trend
- Error state shown if API fails

**Todo List:**
1. Convert `app/(modules)/dna/page.tsx` to `"use client"`
2. Add state: `repoUrl`, `loading`, `error`, `dnaData` (DnaProfile), `activeTab` (analyze/compare/timeline)
3. Wire "Analyze DNA" button → POST `/api/dna/analyze` → parse DnaProfile → render layers
4. Each DNA layer card: show `score` as colored progress bar, `topItems` as badge list, `summary` as description text
5. Add Compare tab: two URL inputs → GET `/api/dna/compare` → show similarity gauge + diff lists
6. Add Timeline tab: GET `/api/dna/timeline` → render table/list of weekly snapshots
7. Add proper loading (skeleton) and error states

**Relevant Context:**
- `app/(modules)/dna/page.tsx` — has existing skeleton UI, needs client-side state
- `types/dna.ts` — DnaProfile, DnaLayer, DnaComparison, DnaTimeline shapes
- `lib/constants.ts` API_ROUTES.dna — use these for fetch URLs

---

### Sub-Task 4 — Cold Case Files: Fully Working

**Status:** `[ ] pending`

**Intent:**
Wire the Cold Cases page so scanning works, cases render as cards, each case can be clicked for detail + AI fix suggestion, and the heatmap view is displayed.

**Expected Outcomes:**
- User enters repo URL, clicks "Open Cases" → list of bug cards appears
- Each bug card shows: title, severity badge, lastActivity, suspectedCause
- "Get Fix" button on each card fetches AI fix suggestion and shows it inline
- Heatmap tab shows a grid of files with color-coded bug density
- Cases counter shows real number found

**Todo List:**
1. Convert `app/(modules)/coldcases/page.tsx` to `"use client"`
2. Add state: `repoUrl`, `loading`, `cases` (ColdCase[]), `activeTab` (cases/heatmap), `fixMap` (Map<id, string>)
3. Wire "Open Cases" button → POST `/api/coldcases/scan` → parse ColdCase[] → render case cards
4. Each case card: title (h3), severity badge (color-coded), lastActivity date, suspectedCause text
5. "Get Fix" button per card → POST `/api/coldcases/fix/[id]` → show fix suggestion text below card
6. Add Heatmap tab → GET `/api/coldcases/heatmap` → render grid of colored cells (file path + bug count)
7. Add loading and error states

**Relevant Context:**
- `app/(modules)/coldcases/page.tsx` — existing skeleton UI
- `types/coldcase.ts` — ColdCase, HeatmapCell, CaseSeverity
- `lib/constants.ts` API_ROUTES.coldcases

---

### Sub-Task 5 — Mood Ring: Fully Working

**Status:** `[ ] pending`

**Intent:**
Wire the Mood Ring page to fetch team mood, render developer cards with real data, show mood distribution bars, and allow clicking a developer to see their individual mood detail.

**Expected Outcomes:**
- Page loads → automatically fetches team mood → KPI cards show real score/risk values
- Mood distribution bars show proportional fill based on team data
- Developer cards show real names, mood badges, commit counts, code quality score
- Clicking a developer card fetches `/api/mood/developer/[username]` → shows detail panel
- Code Health tab shows health score metrics
- Weekly trend shows 7-day mood data as a bar visualization

**Todo List:**
1. Convert `app/(modules)/mood/page.tsx` to `"use client"`
2. Add state: `loading`, `teamMood` (TeamMood), `selectedDev` (string|null), `devMood` (DeveloperMood|null), `activeTab` (team/developer/code-health)
3. Wire `useEffect` → GET `/api/mood/team` on mount → parse TeamMood → populate KPI cards
4. Render KPI cards: moralIndex as score/100, burnoutRisk as percentage, overallCodeHealth as colored badge
5. Render mood distribution: iterate MOOD_LEVELS, calculate percentage from members array, render color bar
6. Render developer grid: real member cards with name, mood emoji/badge, commits count, code quality bar
7. Developer click → GET `/api/mood/developer/[username]` → show side panel with history
8. Code Health tab → GET `/api/mood/code-health` → show health metric cards
9. Weekly trend: render 7 bars using weeklyTrend array (height = score)

**Relevant Context:**
- `app/(modules)/mood/page.tsx` — existing skeleton UI
- `types/mood.ts` — TeamMood, DeveloperMood, CodeHealthScore

---

### Sub-Task 6 — Food Chain: Fully Working with ReactFlow

**Status:** `[ ] pending`

**Intent:**
Replace the placeholder box in Food Chain with a real interactive ReactFlow graph. Nodes represent modules categorized as Apex Predators, Herbivores, Parasites, Decomposers. Edges show dependency direction. Clicking a node shows impact analysis.

**Expected Outcomes:**
- User enters repo URL, clicks "Load Graph" → ReactFlow graph renders with real nodes and edges
- Node color matches ecosystem category (apex=red, herbivore=green, parasite=yellow, decomposer=gray)
- Clicking a node fetches `/api/foodchain/impact/[module]` → side panel shows impact analysis
- Fragile Modules list at bottom shows real data with risk scores
- Predators list shows apex modules

**Todo List:**
1. Install reactflow is done in Sub-Task 1
2. Convert `app/(modules)/foodchain/page.tsx` to `"use client"`
3. Add state: `repoUrl`, `loading`, `graph` (FoodChainGraph), `fragile` (FragileModule[]), `selectedNode` (string|null), `impact` (ImpactAnalysis|null)
4. Wire "Load Graph" button → GET `/api/foodchain/graph` → parse nodes/edges
5. Map FoodChainNode type to ReactFlow node: `{ id, data: { label }, position: { x, y }, style: { background: colorByType } }`
6. Map edges to ReactFlow edges: `{ id, source, target, animated: true }`
7. Render `<ReactFlow nodes edges fitView>` with `<Background>` and `<Controls>` panels
8. Node click handler → GET `/api/foodchain/impact/[node.id]` → show impact side panel
9. Fetch `/api/foodchain/fragile` → render fragile module rows with risk score bars
10. Fetch `/api/foodchain/predators` → highlight apex predator nodes

**Relevant Context:**
- `app/(modules)/foodchain/page.tsx` — existing placeholder
- `types/foodchain.ts` — FoodChainNode, FoodChainGraph, ImpactAnalysis, FragileModule
- ReactFlow docs: nodes need `id`, `position`, `data.label`; edges need `id`, `source`, `target`

---

### Sub-Task 7 — 3D City Explorer: Fully Working with Three.js

**Status:** `[ ] pending`

**Intent:**
Replace the dark placeholder in 3D City with a real Three.js scene. Buildings represent modules (height = complexity, color = language), roads connect them, and the user can orbit/pan/zoom. Search focuses camera on a building.

**Expected Outcomes:**
- User enters repo URL, clicks "Generate City" → 3D city renders with colored buildings
- Mouse drag = orbit, scroll = zoom, right-click drag = pan
- Clicking a building shows a tooltip with module name, lines of code, language
- Search bar finds a building by name → camera animates to it
- Minimap shows top-down 2D overview

**Todo List:**
1. Three.js packages installed in Sub-Task 1
2. Convert `app/(modules)/city/page.tsx` to `"use client"`
3. Add state: `repoUrl`, `loading`, `cityData` (CityMap), `selectedBuilding` (CityBuilding|null), `searchQuery`
4. Create `components/modules/CityScene.tsx` — a React Three Fiber `<Canvas>` component
5. In CityScene: map each CityBuilding to a `<Box>` mesh — position=(x, 0, z), scale=(width, height, depth), color by language
6. Add `<OrbitControls>` from drei for camera controls
7. Add `<ambientLight>` + `<directionalLight>` for realistic shading
8. Add `<fog>` for depth effect
9. Building click → `onPointerDown` → set selectedBuilding → show tooltip/panel
10. Search → GET `/api/city/search/[query]` → animate camera to building position using drei `useThree`
11. Minimap: render a small top-down `<Canvas>` overlay with same buildings (no lighting, flat colors)
12. Wire "Generate City" → GET `/api/city/generate` → pass cityData to CityScene

**Relevant Context:**
- `app/(modules)/city/page.tsx` — existing placeholder with disabled button
- `types/city.ts` — CityBuilding, CityMap, CityRoad, CityDistrict
- React Three Fiber: use `<Canvas>`, `<mesh>`, `<boxGeometry>`, `<meshStandardMaterial>`
- drei helpers: `OrbitControls`, `Html` (for tooltips), `useThree`

---

## What You Need (External)

Nothing extra needed — everything runs with:
- IBM Bob API key (already in `.env.local`) ✅
- Node.js + npm (already installed) ✅
- Two npm packages to install: `reactflow` + `three/@react-three/fiber/@react-three/drei` (handled in Sub-Task 1)

---

## Execution Order

```
Sub-Task 1 (APIs + npm install)
    ↓
Sub-Task 2 (Dashboard)
    ↓
Sub-Task 3 (DNA)   Sub-Task 4 (Cold Cases)   Sub-Task 5 (Mood)
    ↓                     ↓                         ↓
Sub-Task 6 (Food Chain - ReactFlow)
    ↓
Sub-Task 7 (3D City - Three.js)
```

Sub-Tasks 3, 4, 5 can run in parallel after Sub-Task 2.
Sub-Tasks 6 and 7 depend on Sub-Task 1 (npm packages).
