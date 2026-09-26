"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Dna,
  Bug,
  HeartPulse,
  GitFork,
  Building2,
  ArrowRight,
  TrendingUp,
  Activity,
  Shield,
  Zap,
  Check,
  X,
  Loader2,
  FileText,
} from "lucide-react";
import { useReportStore } from "@/components/modules/ReportStore";
import type { StoredReport } from "@/lib/report-store";

/* ── Types ─────────────────────────────────────────────── */
interface Stats {
  repos: number;
  bugsFound: number;
  modulesMapped: number;
  activeAlerts: number;
  healthScore: number;
  tagline: string;
}

/* ── Animated counter hook ──────────────────────────────── */
function useCountUp(target: number, duration = 1500, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start || target === 0) return;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, start]);
  return value;
}

/* ── Stat Card ──────────────────────────────────────────── */
function StatCard({
  label,
  value,
  icon: Icon,
  color,
  delay,
  started,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  glow: string;
  delay: number;
  started: boolean;
}) {
  const count = useCountUp(value, 1400, started);
  return (
    <div
      className="press animate-fade-in-up space-y-3 rounded-xl border-[3px] border-ink bg-white p-5 opacity-0 shadow-hard"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-ink/50">
          {label}
        </span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center border-[3px] border-ink bg-sun text-ink">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className={`font-display text-3xl tracking-[-0.02em] ${color}`}>{count}</div>
      <div className="h-[3px] bg-ink/20" />
      <div className="flex items-center gap-1 text-xs font-medium text-ink/50">
        <TrendingUp className="h-3 w-3 text-signal" />
        <span>Updated just now</span>
      </div>
    </div>
  );
}

/* ── Module Card ────────────────────────────────────────── */
const MODULE_META = [
  {
    id: "dna",
    label: "DNA Profiler",
    desc: "Extract codebase DNA fingerprint",
    href: "/dna",
    Icon: Dna,
    color: "text-process",
    border: "",
    glow: "rgba(139,92,246,0.3)",
  },
  {
    id: "coldcases",
    label: "Cold Case Files",
    desc: "Investigate unsolved bugs like a detective",
    href: "/coldcases",
    Icon: Bug,
    color: "text-signal",
    border: "",
    glow: "rgba(239,68,68,0.3)",
  },
  {
    id: "mood",
    label: "Mood Ring",
    desc: "Track dev wellbeing & code health",
    href: "/mood",
    Icon: HeartPulse,
    color: "text-ink",
    border: "",
    glow: "rgba(236,72,153,0.3)",
  },
  {
    id: "foodchain",
    label: "Food Chain",
    desc: "Map module dependencies as ecosystems",
    href: "/foodchain",
    Icon: GitFork,
    color: "text-process",
    border: "",
    glow: "rgba(16,185,129,0.3)",
  },
  {
    id: "city",
    label: "3D City Explorer",
    desc: "Navigate your codebase like Google Maps in 3D",
    href: "/city",
    Icon: Building2,
    color: "text-ink",
    border: "",
    glow: "rgba(14,165,233,0.3)",
  },
];

function ModCard({
  label,
  desc,
  href,
  Icon,
  color,
  delay,
}: {
  label: string;
  desc: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  color: string;
  glow: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
  };
  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      className="animate-fade-in-up cursor-pointer rounded-xl border-[3px] border-ink bg-white p-5 opacity-0 shadow-hard transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center border-[3px] border-ink bg-sun ${color}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className="border-2 border-ink bg-sun px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-ink">
          Live
        </span>
      </div>
      <h3 className={`mb-1 font-display text-base uppercase tracking-[-0.02em] ${color}`}>
        {label}
      </h3>
      <p className="mb-4 text-xs leading-relaxed text-ink/70">{desc}</p>
      <Link
        href={href}
        className="group flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-ink"
      >
        Open Module
        <ArrowRight className="h-4 w-4 text-signal transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

/* ── Generate all + report ──────────────────────────────── */
type JobKey = "dna" | "coldcases" | "mood" | "foodchain" | "city";
type JobState = "idle" | "running" | "done" | "error";

const JOB_META: { key: JobKey; label: string; href: string }[] = [
  { key: "dna", label: "DNA Profiler", href: "/dna" },
  { key: "coldcases", label: "Cold Cases", href: "/coldcases" },
  { key: "mood", label: "Mood Ring", href: "/mood" },
  { key: "foodchain", label: "Food Chain", href: "/foodchain" },
  { key: "city", label: "3D City", href: "/city" },
];

const pick = (j: unknown): unknown => {
  const obj = j as { data?: unknown } | null;
  if (obj && typeof obj === "object" && obj.data !== undefined) return obj.data;
  return j;
};

function GenerateAllCard() {
  const { report, saveReport } = useReportStore();
  const [repo, setRepo] = useState("");
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [okCount, setOkCount] = useState(0);
  const [st, setSt] = useState<Record<JobKey, JobState>>({
    dna: "idle",
    coldcases: "idle",
    mood: "idle",
    foodchain: "idle",
    city: "idle",
  });

  useEffect(() => {
    if (report?.repo) setRepo((prev) => prev || report.repo);
  }, [report?.repo]);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = repo.trim();
    if (!target || running) return;

    setRunning(true);
    setFinished(false);
    setOkCount(0);
    setSt({
      dna: "running",
      coldcases: "running",
      mood: "running",
      foodchain: "running",
      city: "running",
    });

    const headers = { "Content-Type": "application/json" };
    const q = encodeURIComponent(target);
    const jobs: Record<JobKey, () => Promise<unknown>> = {
      dna: async () =>
        pick(
          await (
            await fetch("/api/dna/analyze", {
              method: "POST",
              headers,
              body: JSON.stringify({ repoUrl: target }),
            })
          ).json()
        ),
      coldcases: async () =>
        pick(
          await (
            await fetch("/api/coldcases/scan", {
              method: "POST",
              headers,
              body: JSON.stringify({ repoUrl: target }),
            })
          ).json()
        ),
      mood: async () => {
        const [team, codeHealth] = await Promise.all([
          fetch("/api/mood/team"),
          fetch(`/api/mood/code-health?repoUrl=${q}`),
        ]);
        return { team: pick(await team.json()), codeHealth: pick(await codeHealth.json()) };
      },
      foodchain: async () => {
        const [graph, fragile] = await Promise.all([
          fetch(`/api/foodchain/graph?repoUrl=${q}`),
          fetch(`/api/foodchain/fragile?repoUrl=${q}`),
        ]);
        return { graph: pick(await graph.json()), fragile: pick(await fragile.json()) };
      },
      city: async () => pick(await (await fetch(`/api/city/generate?repoUrl=${q}`)).json()),
    };

    const results: Partial<StoredReport> = {};
    let ok = 0;
    await Promise.allSettled(
      JOB_META.map(async (m) => {
        try {
          const payload = await jobs[m.key]();
          if (m.key === "mood") results.mood = payload as StoredReport["mood"];
          else if (m.key === "foodchain") results.foodchain = payload as StoredReport["foodchain"];
          else results[m.key] = payload;
          ok += 1;
          setSt((prev) => ({ ...prev, [m.key]: "done" }) as Record<JobKey, JobState>);
        } catch {
          setSt((prev) => ({ ...prev, [m.key]: "error" }) as Record<JobKey, JobState>);
        }
      })
    );

    const base = report && report.repo === target ? report : { repo: target, savedAt: "" };
    saveReport({ ...base, repo: target, savedAt: new Date().toISOString(), ...results });
    setOkCount(ok);
    setFinished(true);
    setRunning(false);
  };

  const started = JOB_META.some((m) => st[m.key] !== "idle");

  return (
    <div
      className="animate-fade-in-up relative overflow-hidden rounded-xl border-[3px] border-ink bg-white p-5 opacity-0 shadow-hard"
      style={{ animationDelay: "320ms", animationFillMode: "forwards" }}
    >
      <div className="dots-blue-16 pointer-events-none absolute -right-8 -top-8 h-32 w-40 rounded-bl-[60px] opacity-25" />
      <div className="relative mb-4 flex flex-wrap items-center gap-3">
        <h2 className="font-display text-lg uppercase tracking-[-0.02em] text-ink">
          Generate all modules
        </h2>
        <div className="h-[3px] min-w-8 flex-1 bg-ink/20" />
        <Link
          href="/report"
          className="press inline-flex items-center gap-1.5 rounded-md border-[3px] border-ink bg-sun px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-ink shadow-hard-xs"
        >
          <FileText className="h-3.5 w-3.5" /> View report
        </Link>
      </div>
      <p className="relative mb-4 max-w-2xl text-xs leading-relaxed text-ink/70">
        One repo in — DNA, cold cases, mood, food chain and the 3D city out. Each module page opens
        with its results already loaded, and single-module buttons still work on their own.
      </p>

      <form onSubmit={run} className="relative flex flex-col gap-3 sm:flex-row">
        <input
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder="https://github.com/owner/repo"
          aria-label="Repository URL"
          className="min-w-0 flex-1 rounded-md border-[3px] border-ink bg-newsprint px-4 py-2.5 text-sm font-semibold text-ink placeholder:text-ink/40 focus:outline-none focus:ring-4 focus:ring-process/30"
        />
        <button
          type="submit"
          disabled={!repo.trim() || running}
          className="press rounded-md border-[3px] border-ink bg-signal px-5 py-2.5 text-xs font-extrabold uppercase tracking-widest text-white shadow-hard-xs disabled:pointer-events-none disabled:bg-newsprint disabled:text-ink/45 disabled:shadow-none"
        >
          {running ? "Generating…" : "Generate all modules"}
        </button>
      </form>

      {started && (
        <ul className="relative mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {JOB_META.map((m) => {
            const s = st[m.key];
            return (
              <li
                key={m.key}
                className={`flex items-center gap-2 rounded-md border-[3px] border-ink px-3 py-2 text-[11px] font-extrabold uppercase tracking-wide text-ink ${
                  s === "error" ? "bg-sun/60" : "bg-newsprint"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center border-2 border-ink ${
                    s === "done" ? "bg-sun" : s === "error" ? "bg-signal text-white" : "bg-white"
                  }`}
                >
                  {s === "running" && <Loader2 className="h-3 w-3 animate-spin" />}
                  {s === "done" && <Check className="h-3 w-3" />}
                  {s === "error" && <X className="h-3 w-3" />}
                  {s === "idle" && <span className="h-1.5 w-1.5 rounded-full bg-ink/40" />}
                </span>
                <span className="truncate">{m.label}</span>
                {s === "done" && (
                  <Link
                    href={m.href}
                    className="ml-auto shrink-0 text-signal underline decoration-2 underline-offset-2"
                  >
                    Open
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {finished && (
        <div className="relative mt-4 flex flex-wrap items-center gap-3">
          <Link
            href="/report"
            className="press inline-flex items-center gap-2 rounded-md border-[3px] border-ink bg-sun px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-ink shadow-hard-xs"
          >
            <FileText className="h-3.5 w-3.5" /> Download report (PDF)
          </Link>
          <span className="text-xs font-bold text-ink/60">
            {okCount}/5 modules generated — saved to the report.
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────── */
export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((json) => {
        setStats(json.data as Stats);
        setTimeout(() => setStarted(true), 100);
      })
      .catch(() => {
        setStats({
          repos: 7,
          bugsFound: 34,
          modulesMapped: 58,
          activeAlerts: 4,
          healthScore: 78,
          tagline: "Analyze. Fix. Ship.",
        });
        setTimeout(() => setStarted(true), 100);
      });
  }, []);

  const STAT_CARDS = [
    {
      label: "Repositories",
      value: stats?.repos ?? 0,
      icon: Activity,
      color: "text-process",
      glow: "#7c3aed",
    },
    {
      label: "Bugs Found",
      value: stats?.bugsFound ?? 0,
      icon: Bug,
      color: "text-signal",
      glow: "#ef4444",
    },
    {
      label: "Modules Mapped",
      value: stats?.modulesMapped ?? 0,
      icon: GitFork,
      color: "text-ink",
      glow: "#06b6d4",
    },
    {
      label: "Active Alerts",
      value: stats?.activeAlerts ?? 0,
      icon: Shield,
      color: "text-signal",
      glow: "#f97316",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* ── Hero Header ───────────────────────────── */}
      <div
        className="animate-fade-in-up relative overflow-hidden opacity-0"
        style={{ animationFillMode: "forwards" }}
      >
        <div className="dots-red-16 pointer-events-none absolute -right-10 -top-10 h-40 w-64 rounded-bl-[80px] opacity-40" />
        <div className="relative space-y-2">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-[3px] flex-1 bg-ink" />
            <span className="inline-flex -rotate-2 items-center gap-1.5 border-[3px] border-ink bg-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.24em] shadow-hard-xs">
              <Zap className="h-3 w-3" /> IBM BOB AI POWERED
            </span>
            <div className="h-[3px] flex-1 bg-ink" />
          </div>
          <h1 className="font-display text-[clamp(36px,5vw,56px)] uppercase leading-[0.95] tracking-[-0.03em] text-ink">
            CODE STAR
          </h1>
          <p className="text-sm text-ink/70">
            {stats?.tagline ?? "Developer productivity platform — powered by IBM Bob AI"}
          </p>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STAT_CARDS.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 80} started={started} />
        ))}
      </div>

      {/* ── Health bar ────────────────────────────── */}
      {stats && (
        <div
          className="press animate-fade-in-up rounded-xl border-[3px] border-ink bg-white p-5 opacity-0 shadow-hard"
          style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-semibold text-ink">Overall Health Score</span>
            <div className="flex items-center gap-2">
              <span className="border-2 border-ink bg-sun px-2 py-0.5 text-xs font-extrabold text-ink">
                {stats.healthScore}%
              </span>
              <Link
                href="/report"
                className="press inline-flex items-center gap-1.5 rounded-md border-[3px] border-ink bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-ink shadow-hard-xs"
              >
                <FileText className="h-3.5 w-3.5" /> Download report (PDF)
              </Link>
            </div>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full border-[3px] border-ink bg-newsprint">
            <div
              className="progress-bar-animated h-full rounded-full bg-signal"
              style={{ width: started ? `${stats.healthScore}%` : "0%" }}
            />
          </div>
        </div>
      )}

      {/* ── Generate all modules ──────────────────── */}
      <GenerateAllCard />

      {/* ── Modules ───────────────────────────────── */}
      <div>
        <div className="mb-5 flex items-center gap-3">
          <h2 className="font-display text-lg uppercase tracking-[-0.02em] text-ink">Modules</h2>
          <div className="h-[3px] flex-1 bg-ink/20" />
          <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-ink/50">
            5 active
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {MODULE_META.map((m, i) => (
            <ModCard key={m.id} {...m} delay={500 + i * 80} />
          ))}
        </div>
      </div>
    </div>
  );
}
