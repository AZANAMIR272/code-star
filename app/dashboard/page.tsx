"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Dna, Bug, HeartPulse, GitFork, Building2,
  ArrowRight, TrendingUp, Activity, Shield, Zap,
} from "lucide-react";

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
  label, value, icon: Icon, color, glow, delay, started,
}: {
  label: string; value: number; icon: React.ComponentType<{ className?: string }>;
  color: string; glow: string; delay: number; started: boolean;
}) {
  const count = useCountUp(value, 1400, started);
  return (
    <div
      className="glass-card rounded-2xl p-5 space-y-3 animate-fade-in-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/40 uppercase tracking-wider">{label}</span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 ${color}`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className={`text-3xl font-bold ${color}`} style={{ textShadow: `0 0 20px ${glow}` }}>
        {count}
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="flex items-center gap-1 text-xs text-white/30">
        <TrendingUp className="h-3 w-3 text-emerald-400" />
        <span>Updated just now</span>
      </div>
    </div>
  );
}

/* ── Module Card ────────────────────────────────────────── */
const MODULE_META = [
  { id: "dna",       label: "DNA Profiler",     desc: "Extract codebase DNA fingerprint",               href: "/dna",       Icon: Dna,        color: "text-violet-400", border: "hover:neon-border-violet", glow: "rgba(139,92,246,0.3)" },
  { id: "coldcases", label: "Cold Case Files",  desc: "Investigate unsolved bugs like a detective",     href: "/coldcases", Icon: Bug,         color: "text-red-400",    border: "hover:neon-border-red",    glow: "rgba(239,68,68,0.3)"   },
  { id: "mood",      label: "Mood Ring",        desc: "Track dev wellbeing & code health",              href: "/mood",      Icon: HeartPulse,  color: "text-pink-400",   border: "hover:neon-border-pink",   glow: "rgba(236,72,153,0.3)"  },
  { id: "foodchain", label: "Food Chain",       desc: "Map module dependencies as ecosystems",          href: "/foodchain", Icon: GitFork,     color: "text-emerald-400",border: "",                          glow: "rgba(16,185,129,0.3)"  },
  { id: "city",      label: "3D City Explorer", desc: "Navigate your codebase like Google Maps in 3D",  href: "/city",      Icon: Building2,   color: "text-sky-400",    border: "",                          glow: "rgba(14,165,233,0.3)"  },
];

function ModCard({ label, desc, href, Icon, color, glow, delay }: {
  label: string; desc: string; href: string;
  Icon: React.ComponentType<{ className?: string }>; color: string; glow: string; delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
  };
  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      className="glass-card rounded-2xl p-5 cursor-pointer animate-fade-in-up opacity-0 transition-transform duration-200"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ${color}`}
          style={{ boxShadow: `0 0 16px ${glow}` }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-widest rounded-full px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
          Live
        </span>
      </div>
      <h3 className={`text-base font-bold mb-1 ${color}`}>{label}</h3>
      <p className="text-xs text-white/40 leading-relaxed mb-4">{desc}</p>
      <Link
        href={href}
        className="flex items-center gap-2 text-xs font-medium text-white/50 hover:text-white transition-colors group"
      >
        Open Module
        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
      </Link>
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
        setStats({ repos: 7, bugsFound: 34, modulesMapped: 58, activeAlerts: 4, healthScore: 78, tagline: "Analyze. Fix. Ship." });
        setTimeout(() => setStarted(true), 100);
      });
  }, []);

  const STAT_CARDS = [
    { label: "Repositories",    value: stats?.repos ?? 0,          icon: Activity,  color: "text-violet-400", glow: "#7c3aed" },
    { label: "Bugs Found",      value: stats?.bugsFound ?? 0,      icon: Bug,       color: "text-red-400",    glow: "#ef4444" },
    { label: "Modules Mapped",  value: stats?.modulesMapped ?? 0,  icon: GitFork,   color: "text-cyan-400",   glow: "#06b6d4" },
    { label: "Active Alerts",   value: stats?.activeAlerts ?? 0,   icon: Shield,    color: "text-orange-400", glow: "#f97316" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">

      {/* ── Hero Header ───────────────────────────── */}
      <div className="animate-fade-in-up opacity-0 space-y-2" style={{ animationFillMode: "forwards" }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-violet-500/30" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-400/70 flex items-center gap-1.5">
            <Zap className="h-3 w-3" /> IBM BOB AI POWERED
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-violet-500/30" />
        </div>
        <h1 className="text-5xl font-black tracking-tight gradient-text">
          CODE STAR
        </h1>
        <p className="text-white/40 text-sm">
          {stats?.tagline ?? "Developer productivity platform — powered by IBM Bob AI"}
        </p>
      </div>

      {/* ── Stats ─────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STAT_CARDS.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 80} started={started} />
        ))}
      </div>

      {/* ── Health bar ────────────────────────────── */}
      {stats && (
        <div
          className="glass-card rounded-2xl p-5 animate-fade-in-up opacity-0"
          style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white/70">Overall Health Score</span>
            <span className="text-sm font-bold text-emerald-400">{stats.healthScore}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-500 progress-bar-animated"
              style={{ width: started ? `${stats.healthScore}%` : "0%" }}
            />
          </div>
        </div>
      )}

      {/* ── Modules ───────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-lg font-bold text-white/80">Modules</h2>
          <div className="h-px flex-1 bg-white/5" />
          <span className="text-xs text-white/30">5 active</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {MODULE_META.map((m, i) => (
            <ModCard key={m.id} {...m} delay={500 + i * 80} />
          ))}
        </div>
      </div>
    </div>
  );
}
