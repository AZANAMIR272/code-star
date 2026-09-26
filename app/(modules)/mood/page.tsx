"use client";

import { useEffect, useRef, useState } from "react";
import { HeartPulse, Loader2, User, Activity, Code } from "lucide-react";
import { useReportStore } from "@/components/modules/ReportStore";

/* ── Types ── */
interface Member {
  name: string;
  mood: string;
  commits?: number;
  codeQuality?: number;
  role?: string;
}
interface TeamMood {
  overallMood?: string;
  score?: number;
  moralIndex?: number;
  burnoutRisk?: number;
  members?: Member[];
  weeklyTrend?: number[];
  recommendations?: string[];
  overallCodeHealth?: number;
}
interface DevMood {
  username?: string;
  mood?: string;
  history?: { date: string; score: number }[];
  summary?: string;
}
interface CodeHealth {
  score?: number;
  testCoverage?: number;
  techDebt?: number;
  metrics?: { name: string; value: number }[];
}

const MOOD_EMOJI: Record<string, string> = {
  happy: "😊",
  great: "🤩",
  good: "🙂",
  neutral: "😐",
  stressed: "😰",
  burnout: "😵",
  "burned out": "😵",
};
const MOOD_COLOR: Record<string, string> = {
  happy: "text-process",
  great: "text-process",
  good: "text-process",
  neutral: "text-ink/70",
  stressed: "text-signal",
  burnout: "text-signal",
  "burned out": "text-signal",
};
const MOOD_BORDER: Record<string, string> = {
  happy: "#1e40c9",
  great: "#1e40c9",
  good: "#1e40c9",
  neutral: "#0f0d0a",
  stressed: "#dc341e",
  burnout: "#dc341e",
  "burned out": "#dc341e",
};

export default function MoodRingPage() {
  const [tab, setTab] = useState<"team" | "developer" | "code-health">("team");
  const [loading, setLoading] = useState(true);
  const [teamMood, setTeamMood] = useState<TeamMood | null>(null);
  const [selectedDev, setSelectedDev] = useState<string | null>(null);
  const [devMood, setDevMood] = useState<DevMood | null>(null);
  const [devLoading, setDevLoading] = useState(false);
  const [codeHealth, setCodeHealth] = useState<CodeHealth | null>(null);
  const [chLoading, setChLoading] = useState(false);
  const [barVisible, setBarVisible] = useState(false);

  /* ── shared report store ── */
  const { report, loaded, patchReport } = useReportStore();
  const reportRef = useRef(report);
  const bootstrapped = useRef(false);

  useEffect(() => {
    reportRef.current = report;
  }, [report]);

  useEffect(() => {
    if (!loaded || bootstrapped.current) return;
    bootstrapped.current = true;
    const storedMood = report?.mood;
    if (storedMood?.team && typeof storedMood.team === "object") {
      setTeamMood(storedMood.team as TeamMood);
      setLoading(false);
      setTimeout(() => setBarVisible(true), 200);
    }
    if (storedMood?.codeHealth && typeof storedMood.codeHealth === "object") {
      setCodeHealth(storedMood.codeHealth as CodeHealth);
    }
    fetch("/api/mood/team")
      .then((r) => r.json())
      .then((json) => {
        const team = json.data ?? json;
        setTeamMood(team);
        patchReport({ mood: { ...(reportRef.current?.mood ?? {}), team } });
        setTimeout(() => setBarVisible(true), 200);
      })
      .catch(() => setTeamMood({ overallMood: "neutral", score: 65, members: [] }))
      .finally(() => setLoading(false));
  }, [loaded, report, patchReport]);

  const loadDevMood = async (name: string) => {
    setSelectedDev(name);
    setDevLoading(true);
    setDevMood(null);
    try {
      const r = await fetch(`/api/mood/developer/${encodeURIComponent(name)}`);
      const json = await r.json();
      setDevMood(json.data ?? json);
    } catch {
      setDevMood({ username: name, mood: "neutral", summary: "No data available." });
    } finally {
      setDevLoading(false);
    }
  };

  const loadCodeHealth = async () => {
    setChLoading(true);
    try {
      const r = await fetch("/api/mood/code-health");
      const json = await r.json();
      const data = json.data ?? json;
      setCodeHealth(data);
      patchReport({ mood: { ...(reportRef.current?.mood ?? {}), codeHealth: data } });
    } catch {
      /* silent */
    } finally {
      setChLoading(false);
    }
  };

  const score = teamMood?.score ?? teamMood?.moralIndex ?? 0;
  const burnout = teamMood?.burnoutRisk ?? 0;
  const members = teamMood?.members ?? [];
  const trend = teamMood?.weeklyTrend ?? [];

  const moodKey = (m: string) => (m ?? "neutral").toLowerCase();
  const TABS = [
    { id: "team", label: "Team", icon: HeartPulse },
    { id: "developer", label: "Developers", icon: User },
    { id: "code-health", label: "Code Health", icon: Code },
  ] as const;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div
        className="animate-fade-in-up relative flex items-start justify-between overflow-hidden rounded-xl border-[3px] border-ink bg-white p-5 opacity-0 shadow-hard"
        style={{ animationFillMode: "forwards" }}
      >
        <div className="dots-red-16 absolute -right-10 -top-10 h-44 w-72 rounded-bl-[80px] opacity-40" />
        <div className="relative flex items-center gap-4">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-[3px] border-ink bg-sun shadow-hard-xs">
            <div className="dots-ink-8 absolute inset-0 rounded-[9px] opacity-40" />
            <HeartPulse className="relative h-5 w-5 text-ink" />
          </div>
          <div>
            <h1 className="font-display text-2xl uppercase tracking-[-0.02em] text-ink">
              Mood Ring
            </h1>
            <p className="text-xs text-ink/70">
              Track developer wellbeing and code health in real-time
            </p>
          </div>
        </div>
        <span className="press relative rounded-full border-[3px] border-ink bg-signal px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.24em] text-white shadow-hard-xs">
          Live
        </span>
      </div>

      {/* Tabs */}
      <div
        className="animate-fade-in flex w-fit gap-1 rounded-xl border-[3px] border-ink bg-newsprint p-1 opacity-0 shadow-hard-xs"
        style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setTab(id as typeof tab);
              if (id === "code-health" && !codeHealth) loadCodeHealth();
            }}
            className={`flex items-center gap-2 rounded-lg border-[3px] px-4 py-2 text-sm font-semibold transition-all duration-200 ${tab === id ? "border-ink bg-ink text-white" : "border-transparent text-ink/60 hover:bg-white hover:text-ink"}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-ink/60">
          <Loader2 className="h-4 w-4 animate-spin text-signal" />
          Reading team mood…
        </div>
      )}

      {/* ── Team Tab ── */}
      {tab === "team" && !loading && teamMood && (
        <div className="space-y-5">
          {/* KPI cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Team Morale",
                value: score,
                suffix: "%",
                color: "text-process",
                glow: "#1e40c9",
              },
              {
                label: "Burnout Risk",
                value: burnout,
                suffix: "%",
                color: "text-signal",
                glow: "#dc341e",
              },
              {
                label: "Overall Mood",
                value: teamMood.overallMood ?? "—",
                suffix: "",
                color: MOOD_COLOR[moodKey(teamMood.overallMood ?? "")] ?? "text-ink",
                glow: "#ffc900",
              },
            ].map(({ label, value, suffix, color, glow }, i) => (
              <div
                key={label}
                className="animate-fade-in-up space-y-3 rounded-xl border-[3px] border-ink bg-white p-5 opacity-0 shadow-hard"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}
              >
                <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-ink/50">
                  {label}
                </span>
                <div className={`font-display text-3xl tracking-[-0.02em] ${color}`}>
                  {MOOD_EMOJI[moodKey(String(value))] ?? ""}
                  {value}
                  {suffix}
                </div>
                {typeof value === "number" && (
                  <div className="h-3 w-full overflow-hidden rounded-full border-[3px] border-ink bg-newsprint">
                    <div
                      className="progress-bar-animated h-full"
                      style={{ width: barVisible ? `${value}%` : "0%", backgroundColor: glow }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Weekly trend */}
          {trend.length > 0 && (
            <div
              className="animate-fade-in-up rounded-xl border-[3px] border-ink bg-white p-5 opacity-0 shadow-hard"
              style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
            >
              <h3 className="mb-4 font-display text-sm uppercase tracking-[-0.02em] text-ink">
                7-Day Mood Trend
              </h3>
              <div className="flex h-16 items-end gap-2">
                {trend.slice(0, 7).map((val, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="progress-bar-animated w-full rounded-t-sm bg-process transition-all duration-700"
                      style={{
                        height: barVisible ? `${(val / 100) * 56}px` : "0px",
                        minHeight: "2px",
                      }}
                    />
                    <span className="text-[10px] font-bold text-ink/50">
                      {["M", "T", "W", "T", "F", "S", "S"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {(teamMood.recommendations?.length ?? 0) > 0 && (
            <div
              className="animate-fade-in-up rounded-xl border-[3px] border-ink bg-white p-5 opacity-0 shadow-hard"
              style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
            >
              <h3 className="mb-3 font-display text-sm uppercase tracking-[-0.02em] text-ink">
                AI Recommendations
              </h3>
              <ul className="space-y-2">
                {teamMood.recommendations!.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-ink/70">
                    <span className="mt-0.5 text-signal">✦</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ── Developer Tab ── */}
      {tab === "developer" && !loading && (
        <div className="space-y-5">
          <h2 className="font-display text-lg uppercase tracking-[-0.02em] text-ink">
            Individual Developers
          </h2>
          {members.length === 0 ? (
            <div className="rounded-xl border-[3px] border-dashed border-ink/30 bg-newsprint py-10 text-center text-sm text-ink/50">
              No developer data. Load team mood first.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {members.map((m, i) => {
                const mk = moodKey(m.mood ?? "neutral");
                return (
                  <div
                    key={i}
                    onClick={() => loadDevMood(m.name)}
                    className="press animate-fade-in-up cursor-pointer rounded-xl border-[3px] border-ink bg-white p-4 opacity-0 shadow-hard"
                    style={{
                      animationDelay: `${i * 60}ms`,
                      animationFillMode: "forwards",
                      borderLeftColor: MOOD_BORDER[mk] ?? "#0f0d0a",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-[3px] border-ink bg-newsprint text-lg">
                        {MOOD_EMOJI[mk] ?? "👤"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-ink">{m.name}</p>
                        <p className={`text-xs font-semibold ${MOOD_COLOR[mk] ?? "text-ink/50"}`}>
                          {m.mood}
                        </p>
                      </div>
                      <div className="text-right text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink/50">
                        <p>{m.commits ?? 0} commits</p>
                      </div>
                    </div>
                    {m.codeQuality !== undefined && (
                      <div className="mt-3">
                        <div className="mb-1 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink/50">
                          <span>Code Quality</span>
                          <span>{m.codeQuality}%</span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full border-[3px] border-ink bg-newsprint">
                          <div
                            className="progress-bar-animated h-full bg-process"
                            style={{ width: barVisible ? `${m.codeQuality}%` : "0%" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Dev detail panel */}
          {selectedDev && (
            <div
              className="animate-slide-right rounded-xl border-[3px] border-ink bg-white p-5 opacity-0 shadow-hard"
              style={{ animationFillMode: "forwards" }}
            >
              {devLoading ? (
                <div className="flex items-center gap-2 text-sm text-ink/60">
                  <Loader2 className="h-4 w-4 animate-spin text-signal" /> Loading {selectedDev}…
                </div>
              ) : devMood ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-sm uppercase tracking-[-0.02em] text-ink">
                      {devMood.username ?? selectedDev}
                    </h3>
                    <span
                      className={`text-xs font-bold ${MOOD_COLOR[moodKey(devMood.mood ?? "neutral")] ?? "text-ink/50"}`}
                    >
                      {MOOD_EMOJI[moodKey(devMood.mood ?? "neutral")]} {devMood.mood}
                    </span>
                  </div>
                  {devMood.summary && (
                    <p className="text-xs leading-relaxed text-ink/70">{devMood.summary}</p>
                  )}
                  {(devMood.history?.length ?? 0) > 0 && (
                    <div>
                      <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.24em] text-ink/50">
                        Mood History
                      </p>
                      <div className="flex h-10 items-end gap-1 rounded-xl border-[3px] border-ink bg-newsprint p-1">
                        {devMood.history!.slice(-14).map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t-sm bg-signal"
                            style={{ height: `${(h.score / 100) * 36}px`, minHeight: "2px" }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* ── Code Health Tab ── */}
      {tab === "code-health" && (
        <div
          className="animate-scale-in space-y-5 opacity-0"
          style={{ animationFillMode: "forwards" }}
        >
          {chLoading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-ink/60">
              <Loader2 className="h-4 w-4 animate-spin text-signal" /> Loading code health…
            </div>
          ) : codeHealth ? (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    label: "Health Score",
                    value: codeHealth.score ?? 0,
                    color: "bg-process",
                    text: "text-process",
                  },
                  {
                    label: "Test Coverage",
                    value: codeHealth.testCoverage ?? 0,
                    color: "bg-sun",
                    text: "text-ink",
                  },
                  {
                    label: "Tech Debt",
                    value: codeHealth.techDebt ?? 0,
                    color: "bg-signal",
                    text: "text-signal",
                  },
                ].map(({ label, value, color, text }) => (
                  <div
                    key={label}
                    className="space-y-3 rounded-xl border-[3px] border-ink bg-white p-5 shadow-hard"
                  >
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-ink/50">
                      {label}
                    </span>
                    <div className={`font-display text-3xl tracking-[-0.02em] ${text}`}>
                      {value}%
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full border-[3px] border-ink bg-newsprint">
                      <div
                        className={`h-full ${color} progress-bar-animated`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {(codeHealth.metrics?.length ?? 0) > 0 && (
                <div className="space-y-3 rounded-xl border-[3px] border-ink bg-white p-5 shadow-hard">
                  {codeHealth.metrics!.map((m, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-32 shrink-0 text-xs font-semibold text-ink/70">
                        {m.name}
                      </span>
                      <div className="h-3 flex-1 overflow-hidden rounded-full border-[3px] border-ink bg-newsprint">
                        <div
                          className="progress-bar-animated h-full bg-process"
                          style={{ width: `${m.value}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-xs font-extrabold text-ink">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl border-[3px] border-dashed border-ink/30 bg-newsprint py-10 text-center text-sm text-ink/50">
              No code health data loaded.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
