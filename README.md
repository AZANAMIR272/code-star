# CODE STAR ⭐

> **Crack the code.** — Read your repo once, and get every answer: codebase DNA, cold-case bugs,
> team mood, dependency food chain and a 3D city map of your project — powered by **IBM watsonx.ai**.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel)](https://playground-nu-rose.vercel.app)
[![License](https://img.shields.io/badge/license-UNLICENSED-lightgrey)](#license)

**Live:** https://playground-nu-rose.vercel.app

---

## Modules

| Module               | Route        | What it does                                                                                                                                      |
| -------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **DNA Profiler**     | `/dna`       | Fingerprint of your codebase — languages, patterns, complexity and six analysis layers (Structural, Behavioral, Tech, Quality, Social, Temporal). |
| **Cold Case Files**  | `/coldcases` | Detective-style investigation of stale bugs: severity, suspected cause, suggested fix.                                                            |
| **Mood Ring**        | `/mood`      | Developer wellbeing + code health — team mood, KPIs, weekly trend and recommendations.                                                            |
| **Food Chain**       | `/foodchain` | Module dependencies as an ecosystem — apex predators, fragile links, risk scores (React Flow graph).                                              |
| **3D City Explorer** | `/city`      | Navigate your codebase like a city — districts and buildings in a real 3D scene (Three.js).                                                       |

## Features

- **Landing page** — 1960s pop-art / comic-print design system: sun yellow, signal red, process blue,
  ink-black 3px borders, hard zero-blur shadows, ben-day halftone dots, Archivo Black display type.
- **Dashboard** — animated stat cards, health score, module grid, and **Generate all modules**:
  one repo URL in → all five modules generated in parallel (`Promise.allSettled`) with live progress.
- **Shared report store** — every module writes its results to a single store (`lib/report-store.ts`),
  so results survive navigation and are always ready for the report.
- **Printable report** — `/report` renders dashboard stats + every module's latest results in a
  print-ready sheet; **Download PDF** uses the browser's native print-to-PDF. No extra dependencies.
- **Single-module flows still work** — each module keeps its own generate button and also writes
  back into the shared store.
- **IBM watsonx.ai** — every API route asks `lib/bob-ai.ts` (`askBob`) first and falls back to
  deterministic mock data, so the app always works without credentials.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint (next lint)
npm run format     # prettier write
```

Optional: add your IBM watsonx credentials to `.env.local` to get live AI answers;
without them the app runs on bundled mock data.

## Tech stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Framer Motion ·
React Flow · Three.js / R3F · lucide-react · Radix UI · IBM watsonx.ai via `askBob`

## Project structure

```
app/
  page.tsx              # landing page
  dashboard/            # stats, generate-all, module grid
  (modules)/            # dna | coldcases | mood | foodchain | city
  report/               # printable / print-to-PDF report
  api/                  # module APIs (watsonx first, mock fallback)
components/
  landing/              # hero, proof, panels, testimonials, cta
  layout/               # shell, sidebar, topbar, background
  modules/              # module cards + report store context
lib/
  bob-ai.ts             # askBob → IBM watsonx.ai
  report-store.ts       # persisted cross-module report
```

## Team

| Name                   | Role                                 |
| ---------------------- | ------------------------------------ |
| **Syed Muhammad Azan** | Team Lead — AI Engineer & Researcher |
| **Isbah Ali**          | Backend Developer                    |
| **Mariam Zuberi**      | Frontend Developer & AI              |
| **Muhammad Safwan**    | Backend AI & ML                      |

## License

UNLICENSED — all rights reserved by the CODE STAR team.
