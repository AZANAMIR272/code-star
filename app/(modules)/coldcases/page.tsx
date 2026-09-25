"use client";

import { useState } from "react";
import { Bug, Loader2, AlertCircle, ChevronDown, ChevronUp, Map } from "lucide-react";

/* ── Types ── */
interface ColdCase {
  id: string; title: string; severity: string;
  lastActivity: string; suspectedCause: string; suggestedFix?: string;
}
interface HeatCell { file: string; bugCount: number; severity: string; }

const SEV_COLOR: Record<string, string> = {
  critical: "text-red-400 border-red-500/40 bg-red-500/10",
  high:     "text-orange-400 border-orange-500/40 bg-orange-500/10",
  medium:   "text-yellow-400 border-yellow-500/40 bg-yellow-500/10",
  low:      "text-blue-400 border-blue-500/40 bg-blue-500/10",
};
const SEV_BAR: Record<string, string> = {
  critical: "bg-red-500",  high: "bg-orange-500",
  medium: "bg-yellow-500", low: "bg-blue-500",
};
const HEAT_COLOR = (n: number) =>
  n >= 8 ? "bg-red-600"    : n >= 5 ? "bg-orange-500" :
  n >= 3 ? "bg-yellow-500" : n >= 1 ? "bg-emerald-600" : "bg-white/5";

function GlassInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="flex-1 h-10 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-red-500/50 transition-all"
    />
  );
}

export default function ColdCasesPage() {
  const [tab, setTab] = useState<"cases" | "heatmap">("cases");
  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState<ColdCase[]>([]);
  const [error, setError] = useState("");
  const [fixMap, setFixMap] = useState<Record<string, string>>({});
  const [fixLoading, setFixLoading] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [heatLoading, setHeatLoading] = useState(false);
  const [heatmap, setHeatmap] = useState<HeatCell[]>([]);

  const scan = async () => {
    if (!repo.trim()) return;
    setLoading(true); setError(""); setCases([]);
    try {
      const r = await fetch("/api/coldcases/scan", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: repo }),
      });
      const json = await r.json();
      const data = json.data ?? json;
      setCases(Array.isArray(data) ? data : []);
    } catch { setError("Scan failed. Try again."); }
    finally { setLoading(false); }
  };

  const getFix = async (id: string) => {
    setFixLoading((p) => ({ ...p, [id]: true }));
    try {
      const r = await fetch(`/api/coldcases/fix/${id}`, { method: "POST" });
      const json = await r.json();
      const fix = json.data?.fix ?? json.data ?? json.message ?? "No fix available.";
      setFixMap((p) => ({ ...p, [id]: typeof fix === "string" ? fix : JSON.stringify(fix) }));
    } catch { setFixMap((p) => ({ ...p, [id]: "Could not load fix suggestion." })); }
    finally { setFixLoading((p) => ({ ...p, [id]: false })); }
  };

  const loadHeatmap = async () => {
    setHeatLoading(true); setHeatmap([]);
    try {
      const r = await fetch(`/api/coldcases/heatmap?repoUrl=${encodeURIComponent(repo)}`);
      const json = await r.json();
      const data = json.data ?? json;
      setHeatmap(Array.isArray(data) ? data : []);
    } catch { /* silent */ }
    finally { setHeatLoading(false); }
  };

  const sevKey = (s: string) => (s ?? "low").toLowerCase();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="animate-fade-in-up opacity-0 flex items-start justify-between" style={{ animationFillMode: "forwards" }}>
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
            <div className="absolute inset-0 rounded-xl bg-red-500/10 animate-pulse-glow" />
            <Bug className="relative h-5 w-5 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black gradient-text-pink-violet">Cold Case Files</h1>
            <p className="text-xs text-white/40">Investigate unsolved bugs from git history like a detective</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-widest rounded-full px-3 py-1 bg-red-500/15 text-red-400 border border-red-500/25">Live</span>
      </div>

      {/* Scan form */}
      <div className="glass-card rounded-2xl p-5 space-y-4 animate-scale-in opacity-0" style={{ animationFillMode: "forwards" }}>
        <h2 className="font-semibold text-white/80">Scan for Cold Bugs</h2>
        <div className="flex gap-3">
          <GlassInput value={repo} onChange={setRepo} placeholder="https://github.com/owner/repo" />
          <button onClick={scan} disabled={loading || !repo.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-sm font-semibold text-white transition-all shadow-lg shadow-red-500/25">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bug className="h-4 w-4" />}
            {loading ? "Scanning…" : "Open Cases"}
          </button>
        </div>
        <p className="text-xs text-white/25">Scans git history for unsolved bug-related issues and builds evidence chains.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />{error}
        </div>
      )}

      {/* Tabs */}
      {(cases.length > 0 || heatmap.length > 0) && (
        <div className="flex gap-1 p-1 rounded-xl bg-white/5 w-fit">
          {[{ id: "cases", label: `Cases (${cases.length})`, icon: Bug }, { id: "heatmap", label: "Heatmap", icon: Map }].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setTab(id as "cases" | "heatmap"); if (id === "heatmap" && heatmap.length === 0) loadHeatmap(); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${tab === id ? "bg-red-600 text-white shadow-lg shadow-red-500/25" : "text-white/40 hover:text-white/70"}`}>
              <Icon className="h-3.5 w-3.5" />{label}
            </button>
          ))}
        </div>
      )}

      {/* Cases tab */}
      {tab === "cases" && cases.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white/70">Case Files</h2>
            <span className="text-xs text-white/30">{cases.length} cases found</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {cases.map((c, i) => {
              const sk = sevKey(c.severity);
              const isOpen = expanded[c.id];
              return (
                <div key={c.id} className="glass-card rounded-2xl p-4 space-y-3 animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards", borderLeft: `2px solid ${sk === "critical" ? "#ef4444" : sk === "high" ? "#f97316" : sk === "medium" ? "#eab308" : "#3b82f6"}` }}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-white/30 font-mono">#{c.id?.slice(0,8) ?? i}</span>
                      <h3 className="text-sm font-semibold text-white/80 leading-tight mt-0.5">{c.title}</h3>
                    </div>
                    <span className={`shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${SEV_COLOR[sk] ?? SEV_COLOR.low}`}>{c.severity}</span>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">{c.suspectedCause}</p>
                  <div className="flex items-center gap-2 text-[10px] text-white/25">
                    <span>Last activity: {c.lastActivity}</span>
                  </div>
                  {/* Fix section */}
                  <div className="pt-1 space-y-2">
                    <button onClick={() => { getFix(c.id); setExpanded((p) => ({ ...p, [c.id]: true })); }}
                      disabled={!!fixMap[c.id] || fixLoading[c.id]}
                      className="flex items-center gap-1.5 text-xs font-medium text-white/40 hover:text-white/70 transition-colors">
                      {fixLoading[c.id] ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                      {fixMap[c.id] ? "Fix loaded" : fixLoading[c.id] ? "Getting fix…" : "✦ Get AI Fix"}
                    </button>
                    {fixMap[c.id] && (
                      <div>
                        <button onClick={() => setExpanded((p) => ({ ...p, [c.id]: !p[c.id] }))}
                          className="flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300">
                          {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          {isOpen ? "Hide fix" : "Show fix"}
                        </button>
                        {isOpen && (
                          <div className="mt-2 rounded-lg bg-white/5 border border-white/8 p-3 text-xs text-white/50 leading-relaxed animate-fade-in-up opacity-0" style={{ animationFillMode: "forwards" }}>
                            {fixMap[c.id]}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Heatmap tab */}
      {tab === "heatmap" && (
        <div className="space-y-3 animate-scale-in opacity-0" style={{ animationFillMode: "forwards" }}>
          {heatLoading ? (
            <div className="flex items-center gap-2 text-sm text-white/40"><Loader2 className="h-4 w-4 animate-spin" /> Building heatmap…</div>
          ) : heatmap.length > 0 ? (
            <>
              <h2 className="font-semibold text-white/70">Bug Density Heatmap</h2>
              <div className="glass-card rounded-2xl p-5">
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
                  {heatmap.map((cell, i) => (
                    <div key={i} title={`${cell.file}: ${cell.bugCount} bugs`}
                      className={`relative h-12 rounded-lg cursor-pointer transition-all hover:scale-105 ${HEAT_COLOR(cell.bugCount)}`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white/70">{cell.bugCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-4 text-[10px] text-white/30">
                  {[{c:"bg-white/5",l:"0"},{c:"bg-emerald-600",l:"1-2"},{c:"bg-yellow-500",l:"3-4"},{c:"bg-orange-500",l:"5-7"},{c:"bg-red-600",l:"8+"}].map(({c,l})=>(
                    <div key={l} className="flex items-center gap-1"><div className={`h-3 w-3 rounded ${c}`}/>{l}</div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-sm text-white/30 text-center py-12">No heatmap data. Scan a repository first.</div>
          )}
        </div>
      )}
    </div>
  );
}
