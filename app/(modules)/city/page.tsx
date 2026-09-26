"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Building2, Loader2, Search, Satellite, Eye, Radio, X } from "lucide-react";
import type { CityBuilding } from "@/components/modules/CityScene";
import { useReportStore } from "@/components/modules/ReportStore";

// Dynamic import — no SSR for Three.js
const CityScene = dynamic(() => import("@/components/modules/CityScene").then((m) => m.CityScene), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-ink/70">
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      Loading 3D engine…
    </div>
  ),
});

const LEGEND = [
  { label: "Buildings", desc: "Modules (height = complexity)", color: "#8b5cf6" },
  { label: "TypeScript", desc: "TypeScript modules", color: "#3178c6" },
  { label: "JavaScript", desc: "JavaScript modules", color: "#f7df1e" },
  { label: "Python", desc: "Python modules", color: "#3572a5" },
  { label: "Go", desc: "Go modules", color: "#00add8" },
  { label: "Other", desc: "Other languages", color: "#ec4899" },
];

const SKYLINE_COLORS = ["#dc341e", "#1e40c9", "#0f0d0a", "#ffc900"];

interface CityPayload {
  buildings?: CityBuilding[];
  summary?: string;
}

export default function CityExplorerPage() {
  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(false);
  const [buildings, setBuildings] = useState<CityBuilding[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<CityBuilding | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cameraTarget, setCameraTarget] = useState<[number, number, number] | null>(null);
  const [viewMode, setViewMode] = useState<"satellite" | "street" | "traffic">("satellite");
  const [summary, setSummary] = useState("");

  /* ── shared report store ── */
  const { report, loaded, patchReport } = useReportStore();
  const hydrated = useRef(false);

  const applyCity = useCallback((data: CityPayload) => {
    const raw: CityBuilding[] = Array.isArray(data.buildings) ? data.buildings : [];
    setSummary(data.summary ?? "");
    // Normalize buildings
    const normalized: CityBuilding[] = raw.map((b, i) => ({
      id: b.id ?? String(i),
      name: b.name ?? `Module ${i}`,
      height: Math.max(1, (b.height ?? 2) * 0.5),
      width: Math.max(0.5, (b.width ?? 1) * 0.4),
      depth: Math.max(0.5, (b.depth ?? 1) * 0.4),
      x: b.x ?? (i % 8) * 4 - 14,
      z: b.z ?? Math.floor(i / 8) * 4 - 14,
      color: b.color,
      language: b.language,
      linesOfCode: b.linesOfCode,
      complexity: b.complexity,
    }));
    setBuildings(normalized);
  }, []);

  useEffect(() => {
    if (!loaded || hydrated.current) return;
    hydrated.current = true;
    const stored = report?.city;
    if (stored && typeof stored === "object") applyCity(stored as CityPayload);
  }, [loaded, report, applyCity]);

  const generateCity = async () => {
    if (!repo.trim()) return;
    setLoading(true);
    setBuildings([]);
    try {
      const r = await fetch(`/api/city/generate?repoUrl=${encodeURIComponent(repo)}`);
      const json = await r.json();
      const data = json.data ?? json;
      applyCity(data);
      patchReport({ city: data });
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = buildings.find((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (found) {
      setCameraTarget([found.x, found.height, found.z]);
      setSelectedBuilding(found);
    }
  };

  const VIEW_MODES = [
    { id: "satellite", label: "Satellite", icon: Satellite },
    { id: "street", label: "Street", icon: Eye },
    { id: "traffic", label: "Traffic", icon: Radio },
  ] as const;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Header */}
      <div
        className="animate-fade-in-up relative overflow-hidden rounded-xl border-[3px] border-ink bg-white p-5 opacity-0 shadow-hard"
        style={{ animationFillMode: "forwards" }}
      >
        <div className="dots-red-16 absolute -right-10 -top-10 h-40 w-64 rounded-bl-[80px] opacity-40" />
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-[3px] border-ink bg-sun shadow-hard-xs">
              <Building2 className="h-6 w-6 text-ink" />
            </div>
            <div>
              <h1 className="font-display text-2xl uppercase tracking-[-0.02em] text-ink">
                3D City Explorer
              </h1>
              <p className="text-xs text-ink/70">Navigate your codebase like Google Maps — in 3D</p>
            </div>
          </div>
          <span className="press shrink-0 rounded-full border-[3px] border-ink bg-sun px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.24em] text-ink shadow-hard-xs">
            Live
          </span>
        </div>
      </div>

      {/* Controls bar */}
      <div
        className="animate-fade-in flex flex-wrap gap-3 opacity-0"
        style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
      >
        {/* Repo input + generate */}
        <div className="flex min-w-60 flex-1 gap-2">
          <input
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="https://github.com/owner/repo"
            className="h-11 flex-1 rounded-md border-[3px] border-ink bg-white px-4 text-sm text-ink transition-all placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-process focus:ring-offset-2 focus:ring-offset-sun"
          />
          <button
            onClick={generateCity}
            disabled={loading || !repo.trim()}
            className="press flex shrink-0 items-center gap-2 rounded-xl border-[3px] border-ink bg-signal px-5 py-2.5 text-sm font-bold text-white shadow-hard transition-all hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Building2 className="h-4 w-4" />
            )}
            {loading ? "Building…" : "Generate City"}
          </button>
        </div>

        {/* View mode */}
        <div className="flex gap-1 rounded-xl border-[3px] border-ink bg-newsprint p-1 shadow-hard-sm">
          {VIEW_MODES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setViewMode(id)}
              className={`flex items-center gap-1.5 rounded-lg border-[3px] px-3 py-1.5 text-xs transition-all duration-200 ${
                viewMode === id
                  ? "press border-transparent bg-ink font-bold text-white shadow-hard-xs"
                  : "border-transparent bg-transparent font-semibold text-ink/60 hover:bg-white hover:text-ink"
              }`}
            >
              <Icon className="h-3 w-3" />
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        {buildings.length > 0 && (
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search module…"
              className="h-11 w-44 rounded-md border-[3px] border-ink bg-white px-4 text-sm text-ink transition-all placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-process focus:ring-offset-2 focus:ring-offset-sun"
            />
            <button
              type="submit"
              className="press flex items-center gap-1.5 rounded-xl border-[3px] border-ink bg-white px-3 py-2 text-xs font-bold text-ink shadow-hard-xs transition-all hover:bg-sun"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>

      {/* 3D Viewport */}
      <div
        className="animate-scale-in overflow-hidden rounded-xl border-[3px] border-ink bg-white opacity-0 shadow-hard"
        style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
      >
        <div style={{ height: "520px", position: "relative" }}>
          {buildings.length === 0 && !loading ? (
            <div className="absolute inset-0 overflow-hidden bg-newsprint">
              <div className="dots-blue-16 absolute -left-16 -top-16 h-48 w-72 rounded-br-[96px] opacity-30" />
              <div className="relative flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
                {/* Animated city silhouette */}
                <div className="mb-2 flex items-end gap-1">
                  {[3, 5, 8, 4, 7, 6, 9, 3, 5, 7, 4, 8, 5, 3, 6].map((h, i) => (
                    <div
                      key={i}
                      className="w-3 animate-pulse rounded-t-sm border-2 border-ink"
                      style={{
                        height: h * 8,
                        background: SKYLINE_COLORS[i % SKYLINE_COLORS.length],
                        animationDelay: `${i * 150}ms`,
                      }}
                    />
                  ))}
                </div>
                <Building2 className="h-10 w-10 text-ink/70" />
                <p className="text-sm font-semibold text-ink/70">
                  Enter a repository URL and click Generate City
                </p>
                <p className="text-xs text-ink/50">
                  3D city will rise from the ground with your codebase mapped as buildings
                </p>
              </div>
            </div>
          ) : loading ? (
            <div className="absolute inset-0 overflow-hidden bg-newsprint">
              <div className="dots-blue-16 absolute -bottom-16 -right-16 h-48 w-72 rounded-tl-[96px] opacity-30" />
              <div className="relative flex h-full flex-col items-center justify-center gap-3">
                <div className="relative">
                  <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-ink/20 border-t-signal" />
                  <Building2 className="absolute inset-0 m-auto h-5 w-5 text-ink" />
                </div>
                <p className="text-sm font-semibold text-ink/70">Building your city…</p>
              </div>
            </div>
          ) : (
            <CityScene
              buildings={buildings}
              onBuildingClick={setSelectedBuilding}
              cameraTarget={cameraTarget}
            />
          )}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between border-t-[3px] border-ink bg-newsprint px-4 py-2">
          <span className="text-xs font-medium text-ink/70">
            {buildings.length > 0
              ? `${buildings.length} modules · ${summary || "3D City loaded"}`
              : "No city loaded"}
          </span>
          <div className="flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.24em] text-ink/50">
            <span>Drag to orbit</span>
            <span>Scroll to zoom</span>
            <span>Click building for info</span>
          </div>
        </div>
      </div>

      {/* Selected building panel */}
      {selectedBuilding && (
        <div
          className="animate-slide-right rounded-xl border-[3px] border-ink bg-white p-5 opacity-0 shadow-hard"
          style={{ animationFillMode: "forwards" }}
        >
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h3 className="font-display text-sm uppercase tracking-[-0.02em] text-ink">
                {selectedBuilding.name}
              </h3>
              <p className="text-xs text-ink/70">{selectedBuilding.language ?? "Unknown"} module</p>
            </div>
            <button
              onClick={() => setSelectedBuilding(null)}
              className="press rounded-lg border-[3px] border-ink bg-white p-1.5 text-ink shadow-hard-xs transition-all hover:bg-sun"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Lines of Code", value: selectedBuilding.linesOfCode ?? "—" },
              { label: "Complexity", value: selectedBuilding.complexity ?? "—" },
              { label: "Language", value: selectedBuilding.language ?? "—" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border-[3px] border-ink bg-newsprint p-3">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-ink/50">
                  {label}
                </p>
                <p className="mt-1 text-sm font-extrabold text-ink">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div
        className="animate-fade-in-up space-y-3 opacity-0"
        style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
      >
        <h2 className="font-display text-sm uppercase tracking-[-0.02em] text-ink">City Legend</h2>
        <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-6">
          {LEGEND.map(({ label, desc, color }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-xl border-[3px] border-ink bg-white p-3 shadow-hard"
            >
              <div
                className="h-3.5 w-3.5 shrink-0 rounded-sm border-2 border-ink"
                style={{ background: color }}
              />
              <div>
                <p className="text-xs font-bold text-ink">{label}</p>
                <p className="text-[10px] leading-tight text-ink/50">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
