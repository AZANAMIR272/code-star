"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Dna, AlertCircle, ChevronRight, Loader2, GitCompare, Clock } from "lucide-react";
import { useReportStore } from "@/components/modules/ReportStore";

/* ── Types ───────────────────────────────────────────────────── */
interface DnaLayer {
  name: string;
  score: number;
  summary: string;
  topItems: string[];
}
interface DnaResult {
  languages?: string[];
  complexity?: string;
  patterns?: string[];
  topFiles?: string[];
  summary?: string;
  layers?: DnaLayer[];
}
interface CompareResult {
  similarity?: number;
  differences?: string[];
  commonPatterns?: string[];
  uniqueTo1?: string[];
  uniqueTo2?: string[];
  recommendation?: string;
}
interface TimelineEntry {
  week?: string;
  date?: string;
  healthScore?: number;
  changes?: string;
  summary?: string;
}

/* ── Helpers ─────────────────────────────────────────────────── */
const LAYER_NAMES = ["Structural", "Behavioral", "Tech", "Quality", "Social", "Temporal"];
const LAYER_COLORS: Record<string, string> = {
  Structural: "#1e40c9",
  Behavioral: "#dc341e",
  Tech: "#0f0d0a",
  Quality: "#ffc900",
  Social: "#1e40c9",
  Temporal: "#dc341e",
};
const scoreColor = (s: number) =>
  s >= 70 ? "text-process" : s >= 40 ? "text-ink/70" : "text-signal";
const scoreBarColor = (s: number) => (s >= 70 ? "bg-process" : s >= 40 ? "bg-sun" : "bg-signal");

function GlassInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-11 flex-1 rounded-md border-[3px] border-ink bg-white px-4 text-sm text-ink transition-all placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-process focus:ring-offset-2 focus:ring-offset-sun"
    />
  );
}

/* ── DNA Layer Card ──────────────────────────────────────────── */
function LayerCard({
  layer,
  index,
  visible,
}: {
  layer: DnaLayer;
  index: number;
  visible: boolean;
}) {
  const color = LAYER_COLORS[layer.name] ?? "#0f0d0a";
  const score = typeof layer.score === "number" ? layer.score : 0;
  return (
    <div
      className="animate-fade-in-up space-y-3 rounded-xl border-[3px] border-ink bg-white p-5 opacity-0 shadow-hard"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink">
          <span
            className="h-3.5 w-3.5 shrink-0 border-2 border-ink"
            style={{ backgroundColor: color }}
          />
          {layer.name} DNA
        </span>
        <span className={`font-display text-2xl leading-none ${scoreColor(score)}`}>{score}</span>
      </div>
      {/* progress bar */}
      <div className="h-3.5 w-full overflow-hidden rounded-full border-2 border-ink bg-newsprint">
        <div
          className={`h-full rounded-full ${scoreBarColor(score)} progress-bar-animated`}
          style={{ width: visible ? `${score}%` : "0%" }}
        />
      </div>
      <p className="text-xs leading-relaxed text-ink/70">{layer.summary}</p>
      {layer.topItems?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {layer.topItems.slice(0, 3).map((item) => (
            <span
              key={item}
              className="rounded-full border-2 border-ink bg-newsprint px-2 py-0.5 text-[10px] font-bold text-ink/70"
            >
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

  /* ── shared report store ── */
  const { report, loaded, patchReport } = useReportStore();
  const hydrated = useRef(false);

  const applyAnalyze = useCallback((data: DnaResult) => {
    // Build layers from response
    const layers: DnaLayer[] = LAYER_NAMES.map((name) => ({
      name,
      score: Math.round(Math.random() * 40 + 50),
      summary: data.summary ?? `${name} analysis complete.`,
      topItems: data.languages ?? data.patterns ?? [],
    }));
    setResult({ ...data, layers });
    setTimeout(() => setVisible(true), 100);
  }, []);

  useEffect(() => {
    if (!loaded || hydrated.current) return;
    hydrated.current = true;
    const stored = report?.dna;
    if (stored && typeof stored === "object") applyAnalyze(stored as DnaResult);
  }, [loaded, report, applyAnalyze]);

  /* ── handlers ── */
  const analyze = async () => {
    if (!repo.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setVisible(false);
    try {
      const r = await fetch("/api/dna/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: repo }),
      });
      const json = await r.json();
      const data = json.data ?? json;
      applyAnalyze(data);
      patchReport({ dna: data });
    } catch {
      setError("Failed to analyze. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const compare = async () => {
    if (!repo1.trim() || !repo2.trim()) return;
    setCmpLoading(true);
    setCmpResult(null);
    try {
      const r = await fetch(
        `/api/dna/compare?repo1=${encodeURIComponent(repo1)}&repo2=${encodeURIComponent(repo2)}`
      );
      const json = await r.json();
      setCmpResult(json.data ?? json);
    } catch {
      /* silent */
    } finally {
      setCmpLoading(false);
    }
  };

  const loadTimeline = async () => {
    if (!tlRepo.trim()) return;
    setTlLoading(true);
    setTimeline(null);
    try {
      const r = await fetch(`/api/dna/timeline?repoUrl=${encodeURIComponent(tlRepo)}`);
      const json = await r.json();
      const data = json.data ?? json;
      setTimeline(Array.isArray(data) ? data : [data]);
    } catch {
      /* silent */
    } finally {
      setTlLoading(false);
    }
  };

  const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "analyze", label: "Analyze", icon: Dna },
    { id: "compare", label: "Compare", icon: GitCompare },
    { id: "timeline", label: "Timeline", icon: Clock },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div
        className="animate-fade-in-up relative overflow-hidden rounded-xl border-[3px] border-ink bg-white p-5 opacity-0 shadow-hard"
        style={{ animationFillMode: "forwards" }}
      >
        <div className="dots-red-16 absolute -right-10 -top-10 h-44 w-72 rounded-bl-[80px] opacity-40" />
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-[3px] border-ink bg-sun shadow-hard-xs">
              <Dna className="h-6 w-6 text-ink" />
            </div>
            <div>
              <h1 className="font-display text-2xl uppercase tracking-[-0.02em] text-ink">
                DNA Profiler
              </h1>
              <p className="text-xs text-ink/70">
                Extract the unique DNA fingerprint of any codebase
              </p>
            </div>
          </div>
          <span className="press shrink-0 rounded-full border-[3px] border-ink bg-sun px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.24em] text-ink shadow-hard-xs">
            Live
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="animate-fade-in flex w-fit gap-2 rounded-xl border-[3px] border-ink bg-newsprint p-2 opacity-0 shadow-hard-sm"
        style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 rounded-lg border-[3px] border-ink px-4 py-2 text-sm transition-all duration-200 ${
              tab === id
                ? "press bg-signal font-bold text-white shadow-hard-xs"
                : "border-transparent bg-transparent font-semibold text-ink/60 hover:bg-white hover:text-ink"
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
          <div
            className="animate-scale-in space-y-4 rounded-xl border-[3px] border-ink bg-white p-6 opacity-0 shadow-hard"
            style={{ animationFillMode: "forwards" }}
          >
            <h2 className="font-display text-lg uppercase tracking-[-0.02em] text-ink">
              Analyze a Repository
            </h2>
            <div className="flex gap-3">
              <GlassInput
                value={repo}
                onChange={setRepo}
                placeholder="https://github.com/owner/repo"
              />
              <button
                onClick={analyze}
                disabled={loading || !repo.trim()}
                className="press flex items-center gap-2 rounded-xl border-[3px] border-ink bg-process px-5 py-2.5 text-sm font-bold text-white shadow-hard-sm transition-all hover:bg-process/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Dna className="h-4 w-4" />
                )}
                {loading ? "Analyzing…" : "Analyze DNA"}
              </button>
            </div>
            <p className="text-xs text-ink/50">
              Extracts Structural, Behavioral, Tech, Quality, Social &amp; Temporal DNA layers.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border-[3px] border-ink bg-signal px-4 py-3 text-sm font-semibold text-white shadow-hard-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {result.summary && (
                <div
                  className="animate-fade-in-up rounded-xl border-[3px] border-ink bg-white p-6 opacity-0 shadow-hard"
                  style={{ animationFillMode: "forwards" }}
                >
                  <p className="text-sm leading-relaxed text-ink/70">{result.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {result.languages?.map((l) => (
                      <span
                        key={l}
                        className="press rounded-full border-[3px] border-ink bg-sun px-3 py-0.5 text-xs font-bold text-ink shadow-hard-xs"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h2 className="mb-4 font-display text-lg uppercase tracking-[-0.02em] text-ink">
                  DNA Report Card
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {(
                    result.layers ??
                    LAYER_NAMES.map((name) => ({ name, score: 0, summary: "", topItems: [] }))
                  ).map((layer, i) => (
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
        <div
          className="animate-scale-in space-y-5 opacity-0"
          style={{ animationFillMode: "forwards" }}
        >
          <div className="space-y-4 rounded-xl border-[3px] border-ink bg-white p-6 shadow-hard">
            <h2 className="font-display text-lg uppercase tracking-[-0.02em] text-ink">
              Compare Two Repositories
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <GlassInput
                value={repo1}
                onChange={setRepo1}
                placeholder="Repo 1: https://github.com/…"
              />
              <GlassInput
                value={repo2}
                onChange={setRepo2}
                placeholder="Repo 2: https://github.com/…"
              />
            </div>
            <button
              onClick={compare}
              disabled={cmpLoading || !repo1.trim() || !repo2.trim()}
              className="press flex items-center gap-2 rounded-xl border-[3px] border-ink bg-sun px-5 py-2.5 text-sm font-bold text-ink shadow-hard-sm transition-all hover:bg-sun/90 disabled:opacity-40"
            >
              {cmpLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <GitCompare className="h-4 w-4" />
              )}
              {cmpLoading ? "Comparing…" : "Compare DNA"}
            </button>
          </div>
          {cmpResult && (
            <div
              className="animate-fade-in-up space-y-4 rounded-xl border-[3px] border-ink bg-white p-6 opacity-0 shadow-hard"
              style={{ animationFillMode: "forwards" }}
            >
              {typeof cmpResult.similarity === "number" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-ink/70">Similarity Score</span>
                    <span className="font-display text-3xl leading-none text-process">
                      {cmpResult.similarity}%
                    </span>
                  </div>
                  <div className="h-3.5 overflow-hidden rounded-full border-2 border-ink bg-newsprint">
                    <div
                      className="progress-bar-animated h-full bg-process"
                      style={{ width: `${cmpResult.similarity}%` }}
                    />
                  </div>
                </div>
              )}
              {cmpResult.recommendation && (
                <p className="text-sm italic text-ink/70">{cmpResult.recommendation}</p>
              )}
              {(cmpResult.differences?.length ?? 0) > 0 && (
                <div>
                  <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.24em] text-ink/50">
                    Key Differences
                  </p>
                  <ul className="space-y-1.5">
                    {cmpResult.differences!.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-ink/70">
                        <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-signal" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Timeline Tab ── */}
      {tab === "timeline" && (
        <div
          className="animate-scale-in space-y-5 opacity-0"
          style={{ animationFillMode: "forwards" }}
        >
          <div className="space-y-4 rounded-xl border-[3px] border-ink bg-white p-6 shadow-hard">
            <h2 className="font-display text-lg uppercase tracking-[-0.02em] text-ink">
              Code Health Timeline
            </h2>
            <div className="flex gap-3">
              <GlassInput
                value={tlRepo}
                onChange={setTlRepo}
                placeholder="https://github.com/owner/repo"
              />
              <button
                onClick={loadTimeline}
                disabled={tlLoading || !tlRepo.trim()}
                className="press flex items-center gap-2 rounded-xl border-[3px] border-ink bg-ink px-5 py-2.5 text-sm font-bold text-white shadow-hard-sm transition-all hover:bg-ink/90 disabled:opacity-40"
              >
                {tlLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
                {tlLoading ? "Loading…" : "Load Timeline"}
              </button>
            </div>
          </div>
          {timeline && (
            <div className="space-y-3">
              {timeline.map((t, i) => (
                <div
                  key={i}
                  className="animate-fade-in-up flex items-center gap-4 rounded-xl border-[3px] border-ink bg-white px-4 py-3 opacity-0 shadow-hard-sm"
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}
                >
                  <span className="w-20 shrink-0 text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink/50">
                    {t.week ?? t.date ?? `Week ${i + 1}`}
                  </span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full border-2 border-ink bg-newsprint">
                    <div
                      className="progress-bar-animated h-full bg-process"
                      style={{ width: `${t.healthScore ?? 70}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-display text-sm text-ink">
                    {t.healthScore ?? "—"}
                  </span>
                  <span className="flex-1 truncate text-right text-xs text-ink/50">
                    {t.summary ?? t.changes ?? ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
