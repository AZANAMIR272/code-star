// Application-wide constants

export const APP_NAME = "CODE STAR";
export const APP_VERSION = "0.1.0";

// ─── Module metadata ───────────────────────────────────────────────────────

export const MODULES = [
  {
    id: "dna",
    label: "DNA Profiler",
    description: "Extract the unique DNA fingerprint of any codebase.",
    href: "/dna",
    icon: "dna",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    id: "coldcases",
    label: "Cold Case Files",
    description: "Investigate unsolved bugs from git history like a detective.",
    href: "/coldcases",
    icon: "bug",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    id: "mood",
    label: "Mood Ring",
    description: "Track developer wellbeing and code health in real-time.",
    href: "/mood",
    icon: "heart-pulse",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    id: "foodchain",
    label: "Food Chain",
    description: "Map module dependencies as natural ecosystem relationships.",
    href: "/foodchain",
    icon: "git-fork",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "city",
    label: "3D City Explorer",
    description: "Navigate your codebase like Google Maps — in 3D.",
    href: "/city",
    icon: "building-2",
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
  },
] as const;

export type ModuleId = (typeof MODULES)[number]["id"];

// ─── API route prefixes ──────────────────────────────────────────────────

export const API_ROUTES = {
  dna: {
    analyze: "/api/dna/analyze",
    compare: "/api/dna/compare",
    timeline: "/api/dna/timeline",
  },
  coldcases: {
    scan: "/api/coldcases/scan",
    case: (id: string) => `/api/coldcases/${id}`,
    fix: (id: string) => `/api/coldcases/fix/${id}`,
    heatmap: "/api/coldcases/heatmap",
  },
  mood: {
    developer: (username: string) => `/api/mood/developer/${username}`,
    team: "/api/mood/team",
    codeHealth: "/api/mood/code-health",
    correlation: "/api/mood/correlation",
  },
  foodchain: {
    graph: "/api/foodchain/graph",
    impact: (mod: string) => `/api/foodchain/impact/${mod}`,
    predators: "/api/foodchain/predators",
    fragile: "/api/foodchain/fragile",
  },
  city: {
    generate: "/api/city/generate",
    search: (query: string) => `/api/city/search/${query}`,
    directions: "/api/city/directions",
  },
} as const;

// ─── Health / status colors ──────────────────────────────────────────────

export const HEALTH_COLORS = {
  green: { bg: "bg-emerald-500", text: "text-emerald-500", label: "Healthy" },
  yellow: { bg: "bg-yellow-500", text: "text-yellow-500", label: "Warning" },
  red: { bg: "bg-red-500", text: "text-red-500", label: "Critical" },
} as const;
