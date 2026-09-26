"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { useReportStore } from "@/components/modules/ReportStore";
import { Starburst } from "@/components/landing/Bits";

/* ── Types (mirror the module API payloads) ─────────────── */
interface Stats {
  repos: number;
  bugsFound: number;
  modulesMapped: number;
  activeAlerts: number;
  healthScore: number;
  tagline?: string;
}

interface DnaReport {
  languages?: string[];
  complexity?: string;
  patterns?: string[];
  summary?: string;
  layers?: { name: string; score: number; summary?: string }[];
}

interface CaseReport {
  id?: string;
  title: string;
  severity?: string;
  lastActivity?: string;
  suspectedCause?: string;
  suggestedFix?: string;
}

interface MemberReport {
  name: string;
  mood?: string;
  commits?: number;
  codeQuality?: number;
}

interface TeamReport {
  overallMood?: string;
  score?: number;
  members?: MemberReport[];
  recommendations?: string[];
}

interface CodeHealthReport {
  score?: number;
  testCoverage?: number;
  techDebt?: number;
  metrics?: { name: string; value: number }[];
  summary?: string;
}

interface FragileReport {
  name: string;
  riskScore?: number;
  dependents?: number;
  reason?: string;
}

interface GraphReport {
  nodes?: unknown[];
  edges?: unknown[];
  apex?: string | { name?: string };
  summary?: string;
}

interface CityReport {
  totalFiles?: number;
  summary?: string;
  buildings?: { id: string; name: string; language?: string; linesOfCode?: number }[];
  districts?: { name: string; buildings?: string[] }[];
}

const SEVERITY_CLASS: Record<string, string> = {
  critical: "bg-signal text-white",
  high: "bg-sun text-ink",
  medium: "bg-process text-white",
  low: "bg-newsprint text-ink",
};

const MOOD_CLASS: Record<string, string> = {
  happy: "bg-sun text-ink",
  neutral: "bg-newsprint text-ink",
  stressed: "bg-signal text-white",
  burnout: "bg-ink text-white",
};

/* ── Small building blocks ──────────────────────────────── */
function SectionHead({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center border-[3px] border-ink bg-sun font-display text-sm text-ink">
        {n}
      </span>
      <h2 className="font-display text-lg uppercase tracking-[-0.02em] text-ink">{title}</h2>
      <div className="h-[3px] flex-1 bg-ink" />
    </div>
  );
}

function Bar({ value, tone = "bg-signal" }: { value: number; tone?: string }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full border-[3px] border-ink bg-newsprint">
      <div
        className={`h-full ${tone}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink/60">
          {label}
        </span>
        <span className="font-display text-sm text-ink">{value}%</span>
      </div>
      <Bar value={value} tone="bg-process" />
    </div>
  );
}

function Missing() {
  return (
    <p className="rounded-md border-[3px] border-dashed border-ink/40 bg-newsprint px-4 py-3 text-xs font-semibold text-ink/60">
      Not generated yet — run “Generate all modules” on the dashboard.
    </p>
  );
}

/* ── Page ───────────────────────────────────────────────── */
export default function ReportPage() {
  const { report, loaded } = useReportStore();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((j) => setStats((j?.data as Stats) ?? null))
      .catch(() => setStats(null));
  }, []);

  const dna = report?.dna as DnaReport | undefined;
  const cases = report?.coldcases as CaseReport[] | undefined;
  const team = report?.mood?.team as TeamReport | undefined;
  const health = report?.mood?.codeHealth as CodeHealthReport | undefined;
  const graph = report?.foodchain?.graph as GraphReport | undefined;
  const fragile = report?.foodchain?.fragile as FragileReport[] | undefined;
  const city = report?.city as CityReport | undefined;

  const savedLabel = report?.savedAt
    ? new Date(report.savedAt).toLocaleString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="min-h-screen bg-newsprint px-4 py-8 sm:py-12">
      {/* ── Toolbar ────────────────────────────────── */}
      <div className="no-print mx-auto mb-6 flex max-w-[900px] flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="press inline-flex items-center gap-2 rounded-md border-[3px] border-ink bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-ink shadow-hard-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
        </Link>
        <button
          onClick={() => window.print()}
          className="press inline-flex items-center gap-2 rounded-md border-[3px] border-ink bg-signal px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-white shadow-hard-xs"
        >
          <Download className="h-3.5 w-3.5" /> Download PDF
        </button>
      </div>

      {/* ── Sheet ──────────────────────────────────── */}
      <div className="print-sheet mx-auto max-w-[900px] space-y-8 border-[3px] border-ink bg-white p-6 shadow-hard sm:p-10">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-4 border-b-[3px] border-ink pb-5">
          <div className="flex items-center gap-3">
            <Starburst className="h-11 w-11" />
            <div>
              <div className="font-display text-2xl uppercase leading-none tracking-[-0.03em] text-ink">
                CODE STAR
              </div>
              <div className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.24em] text-ink/60">
                Repository report
              </div>
            </div>
          </div>
          <div className="border-[3px] border-ink bg-newsprint px-3 py-2 text-right text-[11px] font-bold leading-relaxed text-ink">
            {savedLabel && <div>{savedLabel}</div>}
            <div className="text-ink/60">Generated by IBM watsonx.ai</div>
          </div>
        </header>

        {/* Repo */}
        <section className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-ink/60">
            Repository
          </span>
          <p className="break-all font-display text-xl uppercase tracking-[-0.02em] text-ink">
            {loaded && report?.repo ? report.repo : "—"}
          </p>
        </section>

        {!loaded || !report ? (
          <div className="space-y-4 py-10 text-center">
            <h1 className="font-display text-2xl uppercase tracking-[-0.02em] text-ink">
              No report yet
            </h1>
            <p className="text-sm text-ink/70">
              Generate all modules from the dashboard and this report will fill itself in.
            </p>
            <Link
              href="/dashboard"
              className="press inline-flex items-center gap-2 rounded-md border-[3px] border-ink bg-sun px-5 py-2.5 text-xs font-extrabold uppercase tracking-widest text-ink shadow-hard-xs"
            >
              Go to dashboard
            </Link>
          </div>
        ) : (
          <>
            {/* ── Overview ─────────────────────────── */}
            <section className="report-section space-y-4">
              <SectionHead n="01" title="Dashboard overview" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Repositories", value: stats?.repos ?? 0 },
                  { label: "Bugs found", value: stats?.bugsFound ?? 0 },
                  { label: "Modules mapped", value: stats?.modulesMapped ?? 0 },
                  { label: "Active alerts", value: stats?.activeAlerts ?? 0 },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-md border-[3px] border-ink bg-newsprint p-3"
                  >
                    <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink/60">
                      {s.label}
                    </div>
                    <div className="mt-1 font-display text-2xl text-ink">{s.value}</div>
                  </div>
                ))}
              </div>
              <Metric label="Overall health score" value={stats?.healthScore ?? 0} />
            </section>

            {/* ── DNA ──────────────────────────────── */}
            <section className="report-section space-y-4">
              <SectionHead n="02" title="DNA Profiler" />
              {!dna ? (
                <Missing />
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    {dna.languages?.map((l) => (
                      <span
                        key={l}
                        className="border-2 border-ink bg-white px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-ink"
                      >
                        {l}
                      </span>
                    ))}
                    {dna.complexity && (
                      <span className="border-2 border-ink bg-sun px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-ink">
                        {dna.complexity} complexity
                      </span>
                    )}
                  </div>
                  {dna.summary && (
                    <p className="text-sm leading-relaxed text-ink/80">{dna.summary}</p>
                  )}
                  {dna.layers && dna.layers.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {dna.layers.map((l) => (
                        <div key={l.name} className="rounded-md border-[3px] border-ink p-3">
                          <div className="mb-2 flex items-baseline justify-between gap-2">
                            <span className="font-display text-sm uppercase text-ink">
                              {l.name}
                            </span>
                            <span className="font-display text-sm text-signal">{l.score}</span>
                          </div>
                          <Bar value={l.score} />
                          {l.summary && (
                            <p className="mt-2 text-[11px] leading-snug text-ink/60">{l.summary}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>

            {/* ── Cold cases ───────────────────────── */}
            <section className="report-section space-y-4">
              <SectionHead n="03" title="Cold Case Files" />
              {!cases || cases.length === 0 ? (
                <Missing />
              ) : (
                <ul className="space-y-3">
                  {cases.map((c, i) => (
                    <li key={c.id ?? i} className="rounded-md border-[3px] border-ink p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`border-2 border-ink px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest ${
                            SEVERITY_CLASS[(c.severity ?? "low").toLowerCase()] ??
                            SEVERITY_CLASS.low
                          }`}
                        >
                          {c.severity ?? "unknown"}
                        </span>
                        <span className="text-[11px] font-bold text-ink/50">
                          {c.id}
                          {c.lastActivity ? ` · last activity ${c.lastActivity}` : ""}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm font-bold text-ink">{c.title}</p>
                      {c.suspectedCause && (
                        <p className="mt-1 text-[11px] leading-snug text-ink/70">
                          <span className="font-extrabold uppercase tracking-wide">Cause: </span>
                          {c.suspectedCause}
                        </p>
                      )}
                      {c.suggestedFix && (
                        <p className="mt-1 text-[11px] leading-snug text-ink/70">
                          <span className="font-extrabold uppercase tracking-wide">Fix: </span>
                          {c.suggestedFix}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* ── Mood ─────────────────────────────── */}
            <section className="report-section space-y-4">
              <SectionHead n="04" title="Mood Ring" />
              {!team && !health ? (
                <Missing />
              ) : (
                <>
                  {team && (
                    <>
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`border-[3px] border-ink px-3 py-1 text-xs font-extrabold uppercase tracking-widest ${
                            MOOD_CLASS[(team.overallMood ?? "neutral").toLowerCase()] ??
                            MOOD_CLASS.neutral
                          }`}
                        >
                          {team.overallMood ?? "neutral"} team
                        </span>
                        {typeof team.score === "number" && (
                          <span className="border-[3px] border-ink bg-white px-3 py-1 font-display text-sm text-ink">
                            score {team.score}/100
                          </span>
                        )}
                      </div>
                      {team.members && team.members.length > 0 && (
                        <div className="overflow-hidden rounded-md border-[3px] border-ink">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-ink text-white">
                              <tr>
                                <th className="px-3 py-2 font-extrabold uppercase tracking-widest">
                                  Member
                                </th>
                                <th className="px-3 py-2 font-extrabold uppercase tracking-widest">
                                  Mood
                                </th>
                                <th className="px-3 py-2 font-extrabold uppercase tracking-widest">
                                  Commits
                                </th>
                                <th className="px-3 py-2 font-extrabold uppercase tracking-widest">
                                  Quality
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {team.members.map((m) => (
                                <tr key={m.name} className="border-t-[3px] border-ink">
                                  <td className="px-3 py-2 font-bold text-ink">{m.name}</td>
                                  <td className="px-3 py-2">
                                    <span
                                      className={`border-2 border-ink px-1.5 py-0.5 text-[10px] font-extrabold uppercase ${
                                        MOOD_CLASS[(m.mood ?? "neutral").toLowerCase()] ??
                                        MOOD_CLASS.neutral
                                      }`}
                                    >
                                      {m.mood}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-ink/70">{m.commits}</td>
                                  <td className="px-3 py-2 text-ink/70">{m.codeQuality}%</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {team.recommendations && team.recommendations.length > 0 && (
                        <ul className="space-y-1.5">
                          {team.recommendations.map((r, i) => (
                            <li key={i} className="flex gap-2 text-xs leading-snug text-ink/80">
                              <span className="mt-1 h-2 w-2 shrink-0 border-2 border-ink bg-signal" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                  {health && (
                    <div className="rounded-md border-[3px] border-ink bg-newsprint p-3">
                      <div className="mb-3 font-display text-sm uppercase text-ink">
                        Code health
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <Metric label="Score" value={health.score ?? 0} />
                        <Metric label="Test coverage" value={health.testCoverage ?? 0} />
                        <Metric label="Tech debt" value={health.techDebt ?? 0} />
                      </div>
                      {health.summary && (
                        <p className="mt-3 text-[11px] leading-snug text-ink/70">
                          {health.summary}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </section>

            {/* ── Food chain ───────────────────────── */}
            <section className="report-section space-y-4">
              <SectionHead n="05" title="Food Chain" />
              {!graph && (!fragile || fragile.length === 0) ? (
                <Missing />
              ) : (
                <>
                  {graph && (
                    <div className="flex flex-wrap gap-3">
                      <span className="border-[3px] border-ink bg-newsprint px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-ink">
                        {graph.nodes?.length ?? 0} nodes
                      </span>
                      <span className="border-[3px] border-ink bg-newsprint px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-ink">
                        {graph.edges?.length ?? 0} links
                      </span>
                      {graph.apex && (
                        <span className="border-[3px] border-ink bg-sun px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-ink">
                          apex:{" "}
                          {typeof graph.apex === "string" ? graph.apex : (graph.apex?.name ?? "—")}
                        </span>
                      )}
                    </div>
                  )}
                  {graph?.summary && (
                    <p className="text-sm leading-relaxed text-ink/80">{graph.summary}</p>
                  )}
                  {fragile && fragile.length > 0 && (
                    <ul className="space-y-2.5">
                      {fragile.slice(0, 6).map((f, i) => (
                        <li key={f.name ?? i} className="rounded-md border-[3px] border-ink p-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-mono text-xs font-bold text-ink">{f.name}</span>
                            <span className="border-2 border-ink bg-signal px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">
                              risk {f.riskScore ?? 0}
                            </span>
                          </div>
                          <div className="my-2">
                            <Bar value={f.riskScore ?? 0} />
                          </div>
                          {f.reason && (
                            <p className="text-[11px] leading-snug text-ink/70">{f.reason}</p>
                          )}
                          {typeof f.dependents === "number" && (
                            <p className="mt-1 text-[10px] font-extrabold uppercase tracking-widest text-ink/50">
                              {f.dependents} dependents
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </section>

            {/* ── City ─────────────────────────────── */}
            <section className="report-section space-y-4">
              <SectionHead n="06" title="3D City Explorer" />
              {!city ? (
                <Missing />
              ) : (
                <>
                  <div className="flex flex-wrap gap-3">
                    <span className="border-[3px] border-ink bg-newsprint px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-ink">
                      {city.totalFiles ?? city.buildings?.length ?? 0} files
                    </span>
                    <span className="border-[3px] border-ink bg-newsprint px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-ink">
                      {city.buildings?.length ?? 0} buildings
                    </span>
                    <span className="border-[3px] border-ink bg-sun px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-ink">
                      {city.districts?.length ?? 0} districts
                    </span>
                  </div>
                  {city.summary && (
                    <p className="text-sm leading-relaxed text-ink/80">{city.summary}</p>
                  )}
                  {city.buildings && city.buildings.length > 0 && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {[...city.buildings]
                        .sort((a, b) => (b.linesOfCode ?? 0) - (a.linesOfCode ?? 0))
                        .slice(0, 8)
                        .map((b) => (
                          <div
                            key={b.id}
                            className="flex items-center justify-between gap-3 rounded-md border-[3px] border-ink px-3 py-2"
                          >
                            <span className="truncate font-mono text-xs font-bold text-ink">
                              {b.name}
                            </span>
                            <span className="shrink-0 text-[11px] text-ink/60">
                              {b.language} · {(b.linesOfCode ?? 0).toLocaleString()} LOC
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )}
            </section>

            {/* Footer */}
            <footer className="flex flex-wrap items-center justify-between gap-2 border-t-[3px] border-ink pt-4 text-[10px] font-extrabold uppercase tracking-[0.24em] text-ink/50">
              <span>© 2026 CODE STAR</span>
              <span>Analyze. Fix. Ship.</span>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
