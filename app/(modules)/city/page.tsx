"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Building2, Loader2, Search, Satellite, Eye, Radio, X } from "lucide-react";
import type { CityBuilding } from "@/components/modules/CityScene";

// Dynamic import — no SSR for Three.js
const CityScene = dynamic(
  () => import("@/components/modules/CityScene").then((m) => m.CityScene),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full text-white/30 text-sm"><Loader2 className="h-5 w-5 animate-spin mr-2" />Loading 3D engine…</div> }
);

const LEGEND = [
  { label: "Buildings",      desc: "Modules (height = complexity)",         color: "#8b5cf6" },
  { label: "TypeScript",     desc: "TypeScript modules",                    color: "#3178c6" },
  { label: "JavaScript",     desc: "JavaScript modules",                    color: "#f7df1e" },
  { label: "Python",         desc: "Python modules",                        color: "#3572a5" },
  { label: "Go",             desc: "Go modules",                            color: "#00add8" },
  { label: "Other",          desc: "Other languages",                       color: "#ec4899" },
];

export default function CityExplorerPage() {
  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(false);
  const [buildings, setBuildings] = useState<CityBuilding[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<CityBuilding | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cameraTarget, setCameraTarget] = useState<[number, number, number] | null>(null);
  const [viewMode, setViewMode] = useState<"satellite" | "street" | "traffic">("satellite");
  const [summary, setSummary] = useState("");

  const generateCity = async () => {
    if (!repo.trim()) return;
    setLoading(true); setBuildings([]);
    try {
      const r = await fetch(`/api/city/generate?repoUrl=${encodeURIComponent(repo)}`);
      const json = await r.json();
      const data = json.data ?? json;
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
    } catch { /* silent */ }
    finally { setLoading(false); }
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
    { id: "street",    label: "Street",    icon: Eye        },
    { id: "traffic",   label: "Traffic",   icon: Radio      },
  ] as const;

  return (
    <div className="space-y-5 max-w-6xl mx-auto">

      {/* Header */}
      <div className="animate-fade-in-up opacity-0 flex items-start justify-between" style={{ animationFillMode: "forwards" }}>
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10">
            <div className="absolute inset-0 rounded-xl bg-sky-500/10 animate-pulse-glow" />
            <Building2 className="relative h-5 w-5 text-sky-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black" style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>3D City Explorer</h1>
            <p className="text-xs text-white/40">Navigate your codebase like Google Maps — in 3D</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-widest rounded-full px-3 py-1 bg-sky-500/15 text-sky-400 border border-sky-500/25">Live</span>
      </div>

      {/* Controls bar */}
      <div className="flex flex-wrap gap-3 animate-fade-in opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
        {/* Repo input + generate */}
        <div className="flex gap-2 flex-1 min-w-60">
          <input value={repo} onChange={(e) => setRepo(e.target.value)}
            placeholder="https://github.com/owner/repo"
            className="flex-1 h-9 rounded-xl bg-white/5 border border-white/10 px-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-sky-500/50 transition-all" />
          <button onClick={generateCity} disabled={loading || !repo.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-sm font-semibold text-white transition-all shadow-lg shadow-sky-500/25 shrink-0">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Building2 className="h-3.5 w-3.5" />}
            {loading ? "Building…" : "Generate City"}
          </button>
        </div>

        {/* View mode */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/5">
          {VIEW_MODES.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setViewMode(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === id ? "bg-sky-600 text-white" : "text-white/40 hover:text-white/70"}`}>
              <Icon className="h-3 w-3" />{label}
            </button>
          ))}
        </div>

        {/* Search */}
        {buildings.length > 0 && (
          <form onSubmit={handleSearch} className="flex gap-2">
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search module…"
              className="h-9 w-40 rounded-xl bg-white/5 border border-white/10 px-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-sky-500/50 transition-all" />
            <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/8 hover:bg-white/12 text-xs text-white/60 transition-all border border-white/10">
              <Search className="h-3.5 w-3.5" />
            </button>
          </form>
        )}
      </div>

      {/* 3D Viewport */}
      <div className="glass-card rounded-2xl overflow-hidden animate-scale-in opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
        <div style={{ height: "520px", position: "relative" }}>
          {buildings.length === 0 && !loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              style={{ background: "linear-gradient(180deg, #050816 0%, #0d1117 100%)" }}>
              {/* Animated city silhouette */}
              <div className="flex items-end gap-1 mb-2 opacity-20">
                {[3,5,8,4,7,6,9,3,5,7,4,8,5,3,6].map((h, i) => (
                  <div key={i} className="w-3 rounded-t-sm animate-pulse-glow" style={{ height: h * 8, background: `hsl(${200 + i * 5}deg 60% 50%)`, animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
              <Building2 className="h-10 w-10 text-sky-400/30" />
              <p className="text-sm text-white/30">Enter a repository URL and click Generate City</p>
              <p className="text-xs text-white/15">3D city will rise from the ground with your codebase mapped as buildings</p>
            </div>
          ) : loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              style={{ background: "linear-gradient(180deg, #050816 0%, #0d1117 100%)" }}>
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-2 border-sky-500/30 animate-spin border-t-sky-400" />
                <Building2 className="absolute inset-0 m-auto h-5 w-5 text-sky-400" />
              </div>
              <p className="text-sm text-white/40">Building your city…</p>
            </div>
          ) : (
            <CityScene buildings={buildings} onBuildingClick={setSelectedBuilding} cameraTarget={cameraTarget} />
          )}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 px-4 py-2 flex items-center justify-between bg-black/20">
          <span className="text-xs text-white/30">
            {buildings.length > 0 ? `${buildings.length} modules · ${summary || "3D City loaded"}` : "No city loaded"}
          </span>
          <div className="flex items-center gap-3 text-[10px] text-white/20">
            <span>Drag to orbit</span>
            <span>Scroll to zoom</span>
            <span>Click building for info</span>
          </div>
        </div>
      </div>

      {/* Selected building panel */}
      {selectedBuilding && (
        <div className="glass-card rounded-2xl p-5 animate-slide-right opacity-0" style={{ animationFillMode: "forwards" }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-sky-400">{selectedBuilding.name}</h3>
              <p className="text-xs text-white/40">{selectedBuilding.language ?? "Unknown"} module</p>
            </div>
            <button onClick={() => setSelectedBuilding(null)} className="text-white/30 hover:text-white/60">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Lines of Code", value: selectedBuilding.linesOfCode ?? "—" },
              { label: "Complexity",    value: selectedBuilding.complexity ?? "—"  },
              { label: "Language",      value: selectedBuilding.language ?? "—"    },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-white/5 p-3">
                <p className="text-[10px] text-white/30 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-bold text-white/80 mt-1">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="space-y-3 animate-fade-in-up opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
        <h2 className="text-sm font-semibold text-white/50">City Legend</h2>
        <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-6">
          {LEGEND.map(({ label, desc, color }) => (
            <div key={label} className="glass-card rounded-xl p-3 flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm shrink-0" style={{ background: color, boxShadow: `0 0 8px ${color}60` }} />
              <div>
                <p className="text-xs font-medium text-white/60">{label}</p>
                <p className="text-[10px] text-white/25 leading-tight">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
