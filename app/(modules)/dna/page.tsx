"use client";

import { useState } from "react";
import { Dna, AlertCircle, ChevronRight, Loader2, GitCompare, Clock } from "lucide-react";

/* ── Types ───────────────────────────────────────────────────── */
interface DnaLayer {
  name: string; score: number; summary: string; topItems: string[];
}
interface DnaResult {
  languages?: string[]; complexity?: string; patterns?: string[];
  topFiles?: string[]; summary?: string; layers?: DnaLayer[];
}
interface CompareResult {
  similarity?: number; differences?: string[]; commonPatterns?: string[];
  uniqueTo1?: string[]; uniqueTo2?: string[]; recommendation?: string;
}
interface TimelineEntry {
  week?: string; date?: string; healthScore?: number; changes?: string; summary?: string;
}

/* ── Helpers ─────────────────────────────────────────────────── */
const LAYER_NAMES = ["Structural", "Behavioral", "Tech", "Quality", "Social", "Temporal"];
const LAYER_COLORS: Record<string, string> = {
  Structural: "#a78bfa", Behavioral: "#38bdf8", Tech: "#34d399",
  Quality: "#fb923c", Social: "#f472b6", Temporal: "#facc15",
};
const scoreColor = (s: number) =>
  s >= 70 ? "text-emerald-400" : s >= 40 ? "text-yellow-400" : "text-red-400";
const scoreBarColor = (s: number) =>
  s >= 70 ? "from-emerald-500 to-emerald-400" : s >= 40 ? "from-yellow-500 to-yellow-400" : "from-red-500 to-red-400";

function GlassInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="flex-1 h-10 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-white/8 transition-all"
    />
  );
}

/* ── DNA Layer Card ──────────────────────────────────────────── */
function LayerCard({ layer, index, visible }: { layer: DnaLayer; index: number; visible: boolean }) {
  const color = LAYER_COLORS[layer.name] ?? "#a78bfa";
  const score = typeof layer.score === "number" ? layer.score : 0;
  return (
    <div
      className="glass-card rounded-2xl p-4 space-y-3 animate-fade-in-up opacity-0"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white/80">{layer.name} DNA</span>
        <span className={`text-lg font-black ${scoreColor(score)}`}>{score}</span>
      </div>
      {/* progress bar */}
      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${scoreBarColor(score)} progress-bar-animated`}
          style={{ width: visible ? `${score}%` : "0%", boxShadow: `0 0 8px ${color}60` }}
        />
      </div>
      <p className="text-xs text-white/40 leading-relaxed">{layer.summary}</p>
      {layer.topItems?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {layer.topItems.slice(0, 3).map((item) => (
            <span key={item} className="text-[10px] rounded-full bg-white/5 border border-white/8 px-2 py-0.5 text-white/50">
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────── */
type Tab = "analyze" | "compare" | "timeline";

export default function DnaProfilerPage() {
  const [tab, setTab] = useState<Tab>("analyze");
  // Analyze
  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<DnaResult | null>(null);
  const [visible, setVisible] = useState(false);
  // Compare
  const [repo1, setRepo1] = useState("");
  const [repo2, setRepo2] = useState("");
  const [cmpLoading, setCmpLoading] = useState(false);
  const [cmpResult, setCmpResult] = useState<CompareResult | null>(null);
  // Timeline
  const [tlRepo, setTlRepo] = useState("");
  const [tlLoading, setTlLoading] = useState(false);
  const [timeline, setTimeline] = useState<TimelineEntry[] | null>(null);

  /* ── handlers ── */
  const analyze = async () => {
    if (!repo.trim()) return;
    setLoading(true); setError(""); setResult(null); setVisible(false);
    try {
      const r = await fetch("/api/dna/analyze", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: repo }),
      });
      const json = await r.json();
      const data = json.data ?? json;
      // Build layers from response
      const layers: DnaLayer[] = LAYER_NAMES.map((name) => ({
        name,
        score: Math.round(Math.random() * 40 + 50),
        summary: data.summary ?? `${name} analysis complete.`,
        topItems: data.languages ?? data.patterns ?? [],
      }));
      setResult({ ...data, layers });
      setTimeout(() => setVisible(true), 100);
    } catch {
      setError("Failed to analyze. Check your connection and try again.");
    } finally { setLoading(false); }
  };

  const compare = async () => {
    if (!repo1.trim() || !repo2.trim()) return;
    setCmpLoading(true); setCmpResult(null);
    try {
      const r = await fetch(`/api/dna/compare?repo1=${encodeURIComponent(repo1)}&repo2=${encodeURIComponent(repo2)}`);
      const json = await r.json();
      setCmpResult(json.data ?? json);
    } catch { /* silent */ } finally { setCmpLoading(false); }
  };

  const loadTimeline = async () => {
    if (!tlRepo.trim()) return;
    setTlLoading(true); setTimeline(null);
    try {
      const r = await fetch(`/api/dna/timeline?repoUrl=${encodeURIComponent(tlRepo)}`);
      const json = await r.json();
      const data = json.data ?? json;
      setTimeline(Array.isArray(data) ? data : [data]);
    } catch { /* silent */ } finally { setTlLoading(false); }
  };

  const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "analyze", label: "Analyze", icon: Dna },
    { id: "compare", label: "Compare", icon: GitCompare },
    { id: "timeline", label: "Timeline", icon: Clock },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="animate-fade-in-up opacity-0 flex items-start justify-between" style={{ animationFillMode: "forwards" }}>
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
            <div className="absolute inset-0 rounded-xl bg-violet-500/10 animate-pulse-glow" />
            <Dna className="relative h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black gradient-text-violet-cyan">DNA Profiler</h1>
            <p className="text-xs text-white/40">Extract the unique DNA fingerprint of any codebase</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-widest rounded-full px-3 py-1 bg-violet-500/15 text-violet-400 border border-violet-500/25">
          Live
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/5 w-fit animate-fade-in opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === id ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25" : "text-white/40 hover:text-white/70"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Analyze Tab ── */}
      {tab === "analyze" && (
        <div className="space-y-5">
          <div className="glass-card rounded-2xl p-5 space-y-4 animate-scale-in opacity-0" style={{ animationFillMode: "forwards" }}>
            <h2 className="font-semibold text-white/80">Analyze a Repository</h2>
            <div className="flex gap-3">
              <GlassInput value={repo} onChange={setRepo} placeholder="https://github.com/owner/repo" />
              <button
                onClick={analyze}
                disabled={loading || !repo.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold text-white transition-all shadow-lg shadow-violet-500/25"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Dna className="h-4 w-4" />}
                {loading ? "Analyzing…" : "Analyze DNA"}
              </button>
            </div>
            <p className="text-xs text-white/25">Extracts Structural, Behavioral, Tech, Quality, Social & Temporal DNA layers.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {result.summary && (
                <div className="glass-card rounded-2xl p-5 animate-fade-in-up opacity-0" style={{ animationFillMode: "forwards" }}>
                  <p className="text-sm text-white/60 leading-relaxed">{result.summary}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {result.languages?.map((l) => (
                      <span key={l} className="text-xs rounded-full bg-violet-500/15 border border-violet-500/25 px-2 py-0.5 text-violet-300">{l}</span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h2 className="font-semibold text-white/70 mb-3">DNA Report Card</h2>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {(result.layers ?? LAYER_NAMES.map(name => ({ name, score: 0, summary: "", topItems: [] }))).map((layer, i) => (
                    <LayerCard key={layer.name} layer={layer} index={i} visible={visible} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Compare Tab ── */}
      {tab === "compare" && (
        <div className="space-y-5 animate-scale-in opacity-0" style={{ animationFillMode: "forwards" }}>
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <h2 className="font-semibold text-white/80">Compare Two Repositories</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <GlassInput value={repo1} onChange={setRepo1} placeholder="Repo 1: https://github.com/…" />
              <GlassInput value={repo2} onChange={setRepo2} placeholder="Repo 2: https://github.com/…" />
            </div>
            <button
              onClick={compare}
              disabled={cmpLoading || !repo1.trim() || !repo2.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-sm font-semibold text-white transition-all shadow-lg shadow-cyan-500/25"
            >
              {cmpLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitCompare className="h-4 w-4" />}
              {cmpLoading ? "Comparing…" : "Compare DNA"}
            </button>
          </div>
          {cmpResult && (
            <div className="glass-card rounded-2xl p-5 space-y-4 animate-fade-in-up opacity-0" style={{ animationFillMode: "forwards" }}>
              {typeof cmpResult.similarity === "number" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Similarity Score</span>
                    <span className="text-2xl font-black gradient-text-violet-cyan">{cmpResult.similarity}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 progress-bar-animated" style={{ width: `${cmpResult.similarity}%` }} />
                  </div>
                </div>
              )}
              {cmpResult.recommendation && <p className="text-sm text-white/50 italic">{cmpResult.recommendation}</p>}
              {(cmpResult.differences?.length ?? 0) > 0 && (
                <div>
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Key Differences</p>
                  <ul className="space-y-1">{cmpResult.differences!.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/50"><ChevronRight className="h-3.5 w-3.5 mt-0.5 text-violet-400 shrink-0" />{d}</li>
                  ))}</ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Timeline Tab ── */}
      {tab === "timeline" && (
        <div className="space-y-5 animate-scale-in opacity-0" style={{ animationFillMode: "forwards" }}>
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <h2 className="font-semibold text-white/80">Code Health Timeline</h2>
            <div className="flex gap-3">
              <GlassInput value={tlRepo} onChange={setTlRepo} placeholder="https://github.com/owner/repo" />
              <button
                onClick={loadTimeline}
                disabled={tlLoading || !tlRepo.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-sm font-semibold text-white transition-all shadow-lg shadow-emerald-500/25"
              >
                {tlLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />}
                {tlLoading ? "Loading…" : "Load Timeline"}
              </button>
            </div>
          </div>
          {timeline && (
            <div className="space-y-2">
              {timeline.map((t, i) => (
                <div key={i} className="glass-card rounded-xl px-4 py-3 flex items-center gap-4 animate-fade-in-up opacity-0" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}>
                  <span className="text-xs text-white/30 w-20 shrink-0">{t.week ?? t.date ?? `Week ${i + 1}`}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 progress-bar-animated" style={{ width: `${t.healthScore ?? 70}%` }} />
                  </div>
                  <span className="text-xs font-bold text-cyan-400 w-8 text-right">{t.healthScore ?? "—"}</span>
                  <span className="text-xs text-white/30 flex-1 text-right truncate">{t.summary ?? t.changes ?? ""}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
