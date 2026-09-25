# CODE STAR — Ultimate Build Plan
## "3D Animations + Superb Modern UI + Fully Workable A to Z"

---

## Vision

Transform CODE STAR into a stunning, production-grade developer platform with:
- **Dark-first glassmorphism UI** — blurred glass cards, neon glow accents, gradient text
- **3D animations everywhere** — floating particles, animated backgrounds, smooth transitions
- **Fully functional all 5 modules** — real IBM Bob AI data, real interactions
- **3D City Explorer** — Three.js interactive city with orbit controls
- **Food Chain** — ReactFlow animated dependency graph
- **Git-style analytics** — heatmaps, timelines, trend charts

---

## Design System (Applied Globally)

- **Theme:** Dark mode by default, deep navy/black background (`#050816`)
- **Glass cards:** `backdrop-blur-md bg-white/5 border border-white/10`
- **Neon accents:** violet (#7c3aed), cyan (#06b6d4), pink (#ec4899), emerald (#10b981)
- **Gradient text:** `bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent`
- **Animations:** Framer Motion page transitions, floating orbs background, shimmer effects
- **Typography:** Inter font, large bold headings, tight tracking

---

## Packages to Install

```
npm install framer-motion
npm install reactflow @xyflow/react
npm install three @react-three/fiber @react-three/drei
npm install @types/three
```

---

## Sub-Tasks

---

### Sub-Task 1 — Dark Theme + Animated Global UI Shell

**Status:** `[ ] pending`

**Intent:**
Overhaul the global design: dark theme forced on, animated floating particle background, glassmorphism sidebar + topbar, page transition animations.

**Expected Outcomes:**
- App opens in dark mode (no light mode flash)
- Sidebar: glass effect, glowing active nav item, animated logo
- TopBar: glass blur, gradient accent
- Background: animated floating orb/particle effect behind all pages
- Page content fades in on route change

**Todo List:**
1. Update `app/globals.css` — force dark variables as `:root` defaults, add custom keyframes: `float`, `pulse-glow`, `shimmer`, `fade-in-up`, gradient animation
2. Update `tailwind.config.ts` — add custom colors: `neon-violet`, `neon-cyan`, `neon-pink`, `neon-emerald`; add keyframe animations
3. Create `components/layout/AnimatedBackground.tsx` — floating orbs using CSS animation (no heavy lib), 6 blurred gradient circles that float slowly
4. Update `components/layout/Shell.tsx` — add `AnimatedBackground` behind content, wrap main in framer-motion `<motion.main>` with `fadeInUp` variant
5. Update `components/layout/Sidebar.tsx` — glass sidebar: `bg-black/40 backdrop-blur-xl border-r border-white/10`, glowing active item with violet neon, animated hover states, CODE STAR logo with gradient text + animated star icon
6. Update `components/layout/TopBar.tsx` — glass topbar: `bg-black/40 backdrop-blur-xl border-b border-white/10`, add animated notification dot, gradient avatar

**Relevant Context:**
- `app/globals.css` — where CSS variables and keyframes go
- `tailwind.config.ts` — where custom colors/animations go
- `components/layout/` — Shell, Sidebar, TopBar

---

### Sub-Task 2 — Dashboard: Animated Hero + Real AI Stats

**Status:** `[ ] pending`

**Intent:**
Transform dashboard into a stunning hero page with animated stat counters, glowing module cards, and real AI data.

**Expected Outcomes:**
- Header: large gradient title "CODE STAR" with animated subtitle typewriter effect
- 4 stat cards: animated number count-up from 0 to real AI values, each with icon + glow
- Module cards: glass cards with hover 3D tilt effect, glowing colored borders, status badge
- Background: subtle animated grid/mesh overlay
- Real data from `/api/dashboard/stats`

**Todo List:**
1. Create `app/api/dashboard/stats/route.ts` — GET → askBob returns `{ repos, bugsFound, modulesMapped, activeAlerts, healthScore, tagline }`
2. Convert `app/dashboard/page.tsx` to `"use client"`
3. Add state: `stats`, `loading`; useEffect → fetch `/api/dashboard/stats`
4. Build animated stat cards: use CSS counter animation or framer-motion `useMotionValue` count-up effect
5. Each stat card: glass card, large glowing number, colored icon, label
6. Animated hero header: gradient "CODE STAR" text, blinking cursor subtitle
7. Module cards: upgrade `ModuleCard` to glass variant with colored glow border on hover, 3D tilt on hover (CSS `transform: perspective rotateX rotateY` on mousemove)
8. Add "Live" badge to all module cards

**Relevant Context:**
- `app/dashboard/page.tsx` — currently server component with hardcoded zeros
- `components/modules/ModuleCard.tsx` — needs glass + tilt upgrade
- `lib/bob-ai.ts` — `askBob()`

---

### Sub-Task 3 — DNA Profiler: Fully Working + Animated

**Status:** `[ ] pending`

**Intent:**
Full DNA analysis workflow with animated helix visualization, glowing layer cards with real scores, compare + timeline tabs.

**Expected Outcomes:**
- DNA helix CSS animation in header section
- Input form: glass input, glowing submit button, animated loading state
- 6 DNA layer cards: real AI scores, animated progress bars filling on load, color-coded by score
- Tabs: Analyze / Compare / Timeline
- Compare: similarity gauge with animated arc, diff lists
- Timeline: scrollable weekly snapshot cards

**Todo List:**
1. Convert `app/(modules)/dna/page.tsx` to `"use client"`
2. Add state: `repoUrl`, `loading`, `error`, `dnaResult`, `activeTab` (`analyze`/`compare`/`timeline`), `compareRepo`, `compareResult`, `timeline`
3. Build glass input + animated "Analyze DNA" button with loading spinner
4. On submit → POST `/api/dna/analyze` → parse response → animate layer cards appearing with stagger
5. Each DNA layer card: glass card, colored icon per layer type, animated fill progress bar (score %), key metrics as small badges, summary text
6. Layer score color logic: 0-40=red, 41-70=yellow, 71-100=green
7. Compare tab: two glass inputs, GET `/api/dna/compare`, similarity shown as large animated arc/gauge (CSS conic-gradient), diff items as animated list
8. Timeline tab: GET `/api/dna/timeline`, render horizontal scroll of weekly snapshot mini-cards
9. Add framer-motion stagger animation for cards appearing
10. Update `/api/dna/timeline/route.ts` — implement with askBob

**Relevant Context:**
- `app/(modules)/dna/page.tsx` — current static skeleton UI
- `types/dna.ts` — DnaProfile, DnaLayer, DnaComparison, DnaTimeline
- `app/api/dna/` — analyze (partial), compare (partial), timeline (stub)

---

### Sub-Task 4 — Cold Case Files: Fully Working + Detective UI

**Status:** `[ ] pending`

**Intent:**
Detective-themed cold case investigation UI with animated case cards, severity indicators, fix suggestion reveal, and a heatmap grid.

**Expected Outcomes:**
- Detective/noir aesthetic: case file cards look like manila folders
- Scan form → animated "scanning" loader → case cards appear with stagger
- Each case card: case number badge, severity color bar, suspect + evidence text, "Get AI Fix" button
- AI Fix reveals with smooth expand animation, code-like fix suggestions
- Heatmap tab: colored grid of files by bug density
- Cases counter animates from 0 to N

**Todo List:**
1. Convert `app/(modules)/coldcases/page.tsx` to `"use client"`
2. Add state: `repoUrl`, `loading`, `cases`, `activeTab`, `fixMap`, `heatmap`, `fixLoading`
3. Scanning animation: animated radar/pulse circle during fetch
4. Case cards: glass card with left colored border (severity), case ID badge, title, last activity, suspected cause, evidence count
5. Severity colors: critical=red glow, high=orange, medium=yellow, low=blue
6. "Get AI Fix" button → POST `/api/coldcases/fix/[id]` → expand panel with fix steps (animated height transition)
7. Heatmap tab: grid of rectangles colored by bug count (green→yellow→red), file path labels
8. Implement `/api/coldcases/heatmap/route.ts` with askBob
9. Create `/api/coldcases/[bugId]/route.ts` GET endpoint
10. Implement `/api/coldcases/fix/[bugId]/route.ts` with askBob fix suggestions

**Relevant Context:**
- `app/(modules)/coldcases/page.tsx` — current static skeleton
- `types/coldcase.ts` — ColdCase, HeatmapCell, CaseSeverity
- `app/api/coldcases/` — scan (partial), heatmap (stub), fix/[bugId] (stub)

---

### Sub-Task 5 — Mood Ring: Fully Working + Pulse Animations

**Status:** `[ ] pending`

**Intent:**
Living, breathing mood dashboard with pulsing heart animations, real-time mood ring visualization, developer cards with mood auras, and a 7-day trend chart.

**Expected Outcomes:**
- Animated pulsing heart/ring in header
- Auto-fetch on load → KPI cards animate in with real values
- Mood ring: large animated circular gauge showing team morale score
- Mood distribution: animated horizontal bars filling to percentages
- Developer cards: avatar with colored mood aura glow, real name/mood/commits
- 7-day trend: mini bar chart with animated bars
- Clicking a developer → side panel with their mood history

**Todo List:**
1. Convert `app/(modules)/mood/page.tsx` to `"use client"`
2. Add state: `loading`, `teamMood`, `selectedDev`, `devMood`, `codeHealth`, `activeTab`
3. Auto-fetch on mount → GET `/api/mood/team`
4. KPI cards: animate value count-up, color-code by score range
5. Build animated mood ring: CSS `conic-gradient` circle that fills to morale score on load, animated
6. Mood distribution bars: `framer-motion` width animation from 0 to percentage
7. Developer cards: colored left-border aura by mood, name + role + commits + quality bar
8. Developer click → GET `/api/mood/developer/[username]` → side panel slides in
9. 7-day trend: 7 animated bars with day labels
10. Code Health tab → GET `/api/mood/code-health` → metric cards with scores
11. Implement `/api/mood/developer/[username]/route.ts` with askBob
12. Implement `/api/mood/code-health/route.ts` with askBob
13. Implement `/api/mood/correlation/route.ts` with askBob

**Relevant Context:**
- `app/(modules)/mood/page.tsx` — current static skeleton
- `types/mood.ts` — TeamMood, DeveloperMood, CodeHealthScore

---

### Sub-Task 6 — Food Chain: ReactFlow Animated Graph

**Status:** `[ ] pending`

**Intent:**
Interactive animated dependency graph using ReactFlow. Nodes are color-coded by ecosystem role, edges animate with flow particles, clicking a node shows impact analysis.

**Expected Outcomes:**
- Repo URL input + "Load Graph" button
- Loading: animated "mapping ecosystem" pulse
- ReactFlow canvas: full-height animated graph with custom node types
- Node colors: Apex=red, Herbivore=green, Parasite=yellow, Decomposer=gray
- Edges: animated dashed lines with `animated: true`, thickness by dependency count
- Clicking node: right side panel shows ImpactAnalysis (dependents, risk score, recommendations)
- Fragile modules list below with risk score bars and animated highlight

**Todo List:**
1. Install `reactflow` (Sub-Task 1)
2. Convert `app/(modules)/foodchain/page.tsx` to `"use client"`
3. Add state: `repoUrl`, `loading`, `graph`, `fragile`, `selectedNode`, `impact`, `impactLoading`
4. Create `components/modules/FoodChainGraph.tsx` — ReactFlow wrapper component
5. Custom node component: glass card node with icon, label, type badge, glow by type color
6. Map API nodes → ReactFlow nodes with `position` (use simple grid layout: x = index % 4 * 200, y = Math.floor(index/4) * 150)
7. Map API edges → ReactFlow edges with `animated: true`, `style: { stroke: colorByType }`
8. Add ReactFlow `<Background variant="dots">` and `<Controls>` and `<MiniMap>`
9. Node click → `onNodeClick` → GET `/api/foodchain/impact/[id]` → side panel
10. Fragile modules: animated risk bars, warning icons
11. Implement all 4 remaining foodchain API stubs: `/fragile`, `/predators`, `/impact/[module]`

**Relevant Context:**
- `app/(modules)/foodchain/page.tsx` — current placeholder
- `types/foodchain.ts` — FoodChainNode, FoodChainGraph, ImpactAnalysis
- ReactFlow: `<ReactFlow nodes edges onNodeClick fitView>`, `<Background>`, `<Controls>`, `<MiniMap>`

---

### Sub-Task 7 — 3D City Explorer: Three.js Interactive City

**Status:** `[ ] pending`

**Intent:**
Full Three.js 3D city where each module is a building. Users can orbit, zoom, pan, click buildings for details, and search by module name. Buildings animate rising from the ground on load.

**Expected Outcomes:**
- Dark city scene with ambient + directional lighting
- Buildings (Box geometry): height = complexity, color by language, glow outline on hover
- Roads (plane lines) connecting districts
- Camera: OrbitControls — drag to orbit, scroll to zoom, right-click pan
- Buildings animate rising from y=0 upward on initial load (staggered)
- Clicking a building: info panel slides in (module name, LOC, language, complexity)
- Search: type module name → camera smoothly flies to that building
- Minimap: small 2D canvas overlay showing top-down view
- Stars/particles in the sky background
- View modes: Satellite (top-down), Street (ground level), Traffic (edge highlights)

**Todo List:**
1. Install `three @react-three/fiber @react-three/drei @types/three`
2. Convert `app/(modules)/city/page.tsx` to `"use client"`
3. Add state: `repoUrl`, `loading`, `cityData`, `selectedBuilding`, `searchQuery`, `viewMode`
4. Create `components/modules/CityScene.tsx` — React Three Fiber `<Canvas>` component
5. CityScene props: `buildings[]`, `onBuildingClick`, `searchTarget`
6. Add `<Stars>` from drei for night sky background
7. Add `<ambientLight intensity={0.3}>` + `<directionalLight position={[10,20,10]} castShadow>`
8. Add `<fog color="#050816" near={20} far={100}>`
9. Create `Building` component: `<mesh>` with `<boxGeometry>`, `<meshStandardMaterial>`, `onPointerOver` glow effect (emissive color), click handler
10. Animate buildings: use `useSpring` from `@react-spring/three` OR manual `useFrame` — buildings start at y=-height/2, animate to final position on mount
11. Add ground plane: dark grid texture using `<gridHelper>`
12. Add `<OrbitControls>` with min/max distance limits
13. Minimap: second small `<Canvas>` with orthographic camera top-down, same buildings flat
14. Search: on query change, find building by name, use `useThree` camera to `lookAt` target position with smooth lerp in `useFrame`
15. View modes: Satellite = camera.position.y = 80 top-down; Street = camera near ground; Traffic = edges highlighted
16. Wire "Generate City" button → GET `/api/city/generate` → parse CityMap → render CityScene
17. Implement `/api/city/search/[query]/route.ts` with askBob
18. Implement `/api/city/directions/route.ts` with askBob

**Relevant Context:**
- `app/(modules)/city/page.tsx` — current placeholder
- `types/city.ts` — CityBuilding, CityMap, CityRoad, CityDistrict
- `@react-three/fiber`: `<Canvas>`, `useFrame`, `useThree`
- `@react-three/drei`: `OrbitControls`, `Stars`, `Html`, `Text`, `MiniMap`

---

## Execution Order

```
Sub-Task 1: Dark Theme + Shell  (foundation — do first)
    ↓
Sub-Task 2: Dashboard
    ↓
Sub-Tasks 3, 4, 5 (can run in parallel)
    ↓
Sub-Task 6: Food Chain (needs reactflow from install)
    ↓
Sub-Task 7: 3D City (needs three.js from install)
```

---

## npm packages needed

```bash
npm install framer-motion reactflow @xyflow/react three @react-three/fiber @react-three/drei @types/three
```

---

## What You Already Have ✅

- IBM Bob API key in `.env.local`
- `lib/bob-ai.ts` — inference client
- All TypeScript types in `types/`
- shadcn/ui components (badge, button, card, skeleton)
- `lib/constants.ts` with all route URLs
- Partial API routes for analyze, compare, scan, team, graph, generate
