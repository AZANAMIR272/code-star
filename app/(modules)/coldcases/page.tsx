"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bug, Loader2, AlertCircle, ChevronDown, ChevronUp, Map } from "lucide-react";
import { useReportStore } from "@/components/modules/ReportStore";

/* ── Types ── */
interface ColdCase {
  id: string;
  title: string;
  severity: string;
  lastActivity: string;
  suspectedCause: string;
  suggestedFix?: string;
}
interface HeatCell {
  file: string;
  bugCount: number;
  severity: string;
}

const SEV_COLOR: Record<string, string> = {
  critical: "text-white bg-signal",
  high: "text-ink bg-sun",
  medium: "text-white bg-process",
  low: "text-ink/70 bg-newsprint",
};
const SEV_BAR: Record<string, string> = {
  critical: "bg-signal",
  high: "bg-sun",
  medium: "bg-process",
  low: "bg-ink",
};
const HEAT_COLOR = (n: number) =>
  n >= 8
    ? "bg-signal text-white"
    : n >= 5
      ? "bg-sun text-ink"
      : n >= 3
        ? "bg-process text-white"
        : n >= 1
          ? "bg-white text-ink/60"
          : "bg-newsprint text-ink/40";

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

  /* ── shared report store ── */
  const { report, loaded, patchReport } = useReportStore();
  const hydrated = useRef(false);

  const applyScan = useCallback((data: unknown) => {
    setCases(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    if (!loaded || hydrated.current) return;
    hydrated.current = true;
    const stored = report?.coldcases;
    if (stored && typeof stored === "object") applyScan(stored);
  }, [loaded, report, applyScan]);

  const scan = async () => {
    if (!repo.trim()) return;
    setLoading(true);
    setError("");
    setCases([]);
    try {
      const r = await fetch("/api/coldcases/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: repo }),
      });
      const json = await r.json();
      const data = json.data ?? json;
      applyScan(data);
      patchReport({ coldcases: data });
    } catch {
      setError("Scan failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const getFix = async (id: string) => {
    setFixLoading((p) => ({ ...p, [id]: true }));
    try {
      const r = await fetch(`/api/coldcases/fix/${id}`, { method: "POST" });
      const json = await r.json();
      const fix = json.data?.fix ?? json.data ?? json.message ?? "No fix available.";
      setFixMap((p) => ({ ...p, [id]: typeof fix === "string" ? fix : JSON.stringify(fix) }));
    } catch {
      setFixMap((p) => ({ ...p, [id]: "Could not load fix suggestion." }));
    } finally {
      setFixLoading((p) => ({ ...p, [id]: false }));
    }
  };

  const loadHeatmap = async () => {
    setHeatLoading(true);
    setHeatmap([]);
    try {
      const r = await fetch(`/api/coldcases/heatmap?repoUrl=${encodeURIComponent(repo)}`);
      const json = await r.json();
      const data = json.data ?? json;
      setHeatmap(Array.isArray(data) ? data : []);
    } catch {
      /* silent */
    } finally {
      setHeatLoading(false);
    }
  };

  const sevKey = (s: string) => (s ?? "low").toLowerCase();

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
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-[3px] border-ink bg-signal shadow-hard-xs">
              <Bug className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl uppercase tracking-[-0.02em] text-ink">
                Cold Case Files
              </h1>
              <p className="text-xs text-ink/70">
                Investigate unsolved bugs from git history like a detective
              </p>
            </div>
          </div>
          <span className="press shrink-0 rounded-full border-[3px] border-ink bg-sun px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.24em] text-ink shadow-hard-xs">
            Live
          </span>
        </div>
      </div>

      {/* Scan form */}
      <div
        className="animate-scale-in space-y-4 rounded-xl border-[3px] border-ink bg-white p-6 opacity-0 shadow-hard"
        style={{ animationFillMode: "forwards" }}
      >
        <h2 className="font-display text-lg uppercase tracking-[-0.02em] text-ink">
          Scan for Cold Bugs
        </h2>
        <div className="flex gap-3">
          <GlassInput value={repo} onChange={setRepo} placeholder="https://github.com/owner/repo" />
          <button
            onClick={scan}
            disabled={loading || !repo.trim()}
            className="press flex items-center gap-2 rounded-xl border-[3px] border-ink bg-signal px-5 py-2.5 text-sm font-bold text-white shadow-hard-sm transition-all hover:bg-signal/90 disabled:opacity-40"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bug className="h-4 w-4" />}
            {loading ? "Scanning…" : "Open Cases"}
          </button>
        </div>
        <p className="text-xs text-ink/50">
          Scans git history for unsolved bug-related issues and builds evidence chains.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border-[3px] border-ink bg-signal px-4 py-3 text-sm font-semibold text-white shadow-hard-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Tabs */}
      {(cases.length > 0 || heatmap.length > 0) && (
        <div className="flex w-fit gap-2 rounded-xl border-[3px] border-ink bg-newsprint p-2 shadow-hard-sm">
          {[
            { id: "cases", label: `Cases (${cases.length})`, icon: Bug },
            { id: "heatmap", label: "Heatmap", icon: Map },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setTab(id as "cases" | "heatmap");
                if (id === "heatmap" && heatmap.length === 0) loadHeatmap();
              }}
              className={`flex items-center gap-2 rounded-lg border-[3px] border-ink px-4 py-2 text-sm transition-all duration-200 ${tab === id ? "press bg-process font-bold text-white shadow-hard-xs" : "border-transparent bg-transparent font-semibold text-ink/60 hover:bg-white hover:text-ink"}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Cases tab */}
      {tab === "cases" && cases.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg uppercase tracking-[-0.02em] text-ink">
              Case Files
            </h2>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-ink/50">
              {cases.length} cases found
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {cases.map((c, i) => {
              const sk = sevKey(c.severity);
              const isOpen = expanded[c.id];
              return (
                <div
                  key={c.id}
                  className="animate-fade-in-up space-y-3 rounded-xl border-[3px] border-ink bg-white p-5 opacity-0 shadow-hard"
                  style={{
                    animationDelay: `${i * 60}ms`,
                    animationFillMode: "forwards",
                    borderLeft: `6px solid ${sk === "critical" ? "#dc341e" : sk === "high" ? "#ffc900" : sk === "medium" ? "#1e40c9" : "#0f0d0a"}`,
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] text-ink/50">
                        #{c.id?.slice(0, 8) ?? i}
                      </span>
                      <h3 className="mt-0.5 text-sm font-bold leading-tight text-ink">{c.title}</h3>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border-2 border-ink px-2 py-0.5 text-[10px] font-extrabold uppercase ${SEV_COLOR[sk] ?? SEV_COLOR.low}`}
                    >
                      {c.severity}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-ink/70">{c.suspectedCause}</p>
                  <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink/50">
                    <span>Last activity: {c.lastActivity}</span>
                  </div>
                  {/* Fix section */}
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => {
                        getFix(c.id);
                        setExpanded((p) => ({ ...p, [c.id]: true }));
                      }}
                      disabled={!!fixMap[c.id] || fixLoading[c.id]}
                      className="flex items-center gap-1.5 text-xs font-bold text-ink/70 transition-colors hover:text-signal"
                    >
                      {fixLoading[c.id] ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                      {fixMap[c.id]
                        ? "Fix loaded"
                        : fixLoading[c.id]
                          ? "Getting fix…"
                          : "✦ Get AI Fix"}
                    </button>
                    {fixMap[c.id] && (
                      <div>
                        <button
                          onClick={() => setExpanded((p) => ({ ...p, [c.id]: !p[c.id] }))}
                          className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-process hover:text-ink"
                        >
                          {isOpen ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                          {isOpen ? "Hide fix" : "Show fix"}
                        </button>
                        {isOpen && (
                          <div
                            className="animate-fade-in-up mt-2 rounded-lg border-2 border-ink bg-newsprint p-3 text-xs leading-relaxed text-ink/70 opacity-0"
                            style={{ animationFillMode: "forwards" }}
                          >
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
        <div
          className="animate-scale-in space-y-3 opacity-0"
          style={{ animationFillMode: "forwards" }}
        >
          {heatLoading ? (
            <div className="flex items-center gap-2 text-sm font-semibold text-ink/70">
              <Loader2 className="h-4 w-4 animate-spin" /> Building heatmap…
            </div>
          ) : heatmap.length > 0 ? (
            <>
              <h2 className="font-display text-lg uppercase tracking-[-0.02em] text-ink">
                Bug Density Heatmap
              </h2>
              <div className="relative overflow-hidden rounded-xl border-[3px] border-ink bg-white p-6 shadow-hard">
                <div className="dots-blue-16 absolute -bottom-14 -left-12 h-40 w-64 rounded-tr-[80px] opacity-30" />
                <div className="relative z-10 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
                  {heatmap.map((cell, i) => (
                    <div
                      key={i}
                      title={`${cell.file}: ${cell.bugCount} bugs`}
                      className={`relative h-12 cursor-pointer rounded-lg border-2 border-ink transition-all hover:scale-105 ${HEAT_COLOR(cell.bugCount)}`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-bold">{cell.bugCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="relative z-10 mt-5 flex items-center gap-4 text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink/50">
                  {[
                    { c: "bg-newsprint text-ink/40", l: "0" },
                    { c: "bg-white text-ink/60", l: "1-2" },
                    { c: "bg-process text-white", l: "3-4" },
                    { c: "bg-sun text-ink", l: "5-7" },
                    { c: "bg-signal text-white", l: "8+" },
                  ].map(({ c, l }) => (
                    <div key={l} className="flex items-center gap-1.5">
                      <div className={`h-4 w-4 rounded-sm border-2 border-ink ${c}`} />
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-sm font-semibold text-ink/50">
              No heatmap data. Scan a repository first.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
