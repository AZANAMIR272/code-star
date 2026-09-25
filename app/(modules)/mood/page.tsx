"use client";

import { useEffect, useState } from "react";
import { HeartPulse, Loader2, User, Activity, Code } from "lucide-react";

/* ── Types ── */
interface Member { name: string; mood: string; commits?: number; codeQuality?: number; role?: string; }
interface TeamMood {
  overallMood?: string; score?: number; moralIndex?: number;
  burnoutRisk?: number; members?: Member[];
  weeklyTrend?: number[]; recommendations?: string[];
  overallCodeHealth?: number;
}
interface DevMood { username?: string; mood?: string; history?: { date: string; score: number }[]; summary?: string; }
interface CodeHealth { score?: number; testCoverage?: number; techDebt?: number; metrics?: { name: string; value: number }[]; }

const MOOD_EMOJI: Record<string, string> = {
  happy: "😊", great: "🤩", good: "🙂", neutral: "😐",
  stressed: "😰", burnout: "😵", "burned out": "😵",
};
const MOOD_COLOR: Record<string, string> = {
  happy: "text-emerald-400", great: "text-emerald-300", good: "text-cyan-400",
  neutral: "text-yellow-400", stressed: "text-orange-400", burnout: "text-red-400", "burned out": "text-red-400",
};
const MOOD_BORDER: Record<string, string> = {
  happy: "#10b981", great: "#34d399", good: "#06b6d4",
  neutral: "#eab308", stressed: "#f97316", burnout: "#ef4444", "burned out": "#ef4444",
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

  useEffect(() => {
    fetch("/api/mood/team")
      .then((r) => r.json())
      .then((json) => {
        setTeamMood(json.data ?? json);
        setTimeout(() => setBarVisible(true), 200);
      })
      .catch(() => setTeamMood({ overallMood: "neutral", score: 65, members: [] }))
      .finally(() => setLoading(false));
  }, []);

  const loadDevMood = async (name: string) => {
    setSelectedDev(name); setDevLoading(true); setDevMood(null);
    try {
      const r = await fetch(`/api/mood/developer/${encodeURIComponent(name)}`);
      const json = await r.json();
      setDevMood(json.data ?? json);
    } catch { setDevMood({ username: name, mood: "neutral", summary: "No data available." }); }
    finally { setDevLoading(false); }
  };

  const loadCodeHealth = async () => {
    setChLoading(true);
    try {
      const r = await fetch("/api/mood/code-health");
      const json = await r.json();
      setCodeHealth(json.data ?? json);
    } catch { /* silent */ }
    finally { setChLoading(false); }
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
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="animate-fade-in-up opacity-0 flex items-start justify-between" style={{ animationFillMode: "forwards" }}>
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/10">
            <div className="absolute inset-0 rounded-xl bg-pink-500/10 animate-pulse-glow" />
            <HeartPulse className="relative h-5 w-5 text-pink-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black gradient-text-pink-violet">Mood Ring</h1>
            <p className="text-xs text-white/40">Track developer wellbeing and code health in real-time</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-widest rounded-full px-3 py-1 bg-pink-500/15 text-pink-400 border border-pink-500/25">Live</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/5 w-fit animate-fade-in opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => { setTab(id as typeof tab); if (id === "code-health" && !codeHealth) loadCodeHealth(); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${tab === id ? "bg-pink-600 text-white shadow-lg shadow-pink-500/25" : "text-white/40 hover:text-white/70"}`}>
            <Icon className="h-3.5 w-3.5" />{label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-white/40 py-8 justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-pink-400" />
          Reading team mood…
        </div>
      )}

      {/* ── Team Tab ── */}
      {tab === "team" && !loading && teamMood && (
        <div className="space-y-5">
          {/* KPI cards */}
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Team Morale", value: score, suffix: "%", color: "text-pink-400", glow: "#ec4899" },
              { label: "Burnout Risk", value: burnout, suffix: "%", color: "text-orange-400", glow: "#f97316" },
              { label: "Overall Mood", value: teamMood.overallMood ?? "—", suffix: "", color: MOOD_COLOR[moodKey(teamMood.overallMood ?? "")] ?? "text-white", glow: "#ffffff" },
            ].map(({ label, value, suffix, color, glow }, i) => (
              <div key={label} className="glass-card rounded-2xl p-5 space-y-3 animate-fade-in-up opacity-0" style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}>
                <span className="text-xs text-white/40 uppercase tracking-wider">{label}</span>
                <div className={`text-3xl font-black ${color}`} style={{ textShadow: `0 0 20px ${glow}40` }}>
                  {MOOD_EMOJI[moodKey(String(value))] ?? ""}{value}{suffix}
                </div>
                {typeof value === "number" && (
                  <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-500 to-violet-500 progress-bar-animated" style={{ width: barVisible ? `${value}%` : "0%" }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Weekly trend */}
          {trend.length > 0 && (
            <div className="glass-card rounded-2xl p-5 animate-fade-in-up opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
              <h3 className="text-sm font-semibold text-white/60 mb-4">7-Day Mood Trend</h3>
              <div className="flex items-end gap-2 h-16">
                {trend.slice(0, 7).map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-sm bg-gradient-to-t from-pink-600 to-violet-500 progress-bar-animated transition-all duration-700" style={{ height: barVisible ? `${(val / 100) * 56}px` : "0px", minHeight: "2px" }} />
                    <span className="text-[9px] text-white/20">{["M","T","W","T","F","S","S"][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {(teamMood.recommendations?.length ?? 0) > 0 && (
            <div className="glass-card rounded-2xl p-5 animate-fade-in-up opacity-0" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
              <h3 className="text-sm font-semibold text-white/60 mb-3">AI Recommendations</h3>
              <ul className="space-y-2">
                {teamMood.recommendations!.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white/50">
                    <span className="text-pink-400 mt-0.5">✦</span>{rec}
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
          <h2 className="font-semibold text-white/70">Individual Developers</h2>
          {members.length === 0 ? (
            <div className="text-sm text-white/30 text-center py-10">No developer data. Load team mood first.</div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {members.map((m, i) => {
                const mk = moodKey(m.mood ?? "neutral");
                return (
                  <div key={i} onClick={() => loadDevMood(m.name)}
                    className="glass-card rounded-2xl p-4 cursor-pointer animate-fade-in-up opacity-0"
                    style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards", borderLeft: `2px solid ${MOOD_BORDER[mk] ?? "#6b7280"}` }}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-lg">
                        {MOOD_EMOJI[mk] ?? "👤"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white/80 truncate">{m.name}</p>
                        <p className={`text-xs ${MOOD_COLOR[mk] ?? "text-white/40"}`}>{m.mood}</p>
                      </div>
                      <div className="text-right text-[10px] text-white/30">
                        <p>{m.commits ?? 0} commits</p>
                      </div>
                    </div>
                    {m.codeQuality !== undefined && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[10px] text-white/30 mb-1">
                          <span>Code Quality</span><span>{m.codeQuality}%</span>
                        </div>
                        <div className="h-1 w-full rounded-full bg-white/5">
                          <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 progress-bar-animated" style={{ width: barVisible ? `${m.codeQuality}%` : "0%" }} />
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
            <div className="glass-card rounded-2xl p-5 animate-slide-right opacity-0" style={{ animationFillMode: "forwards" }}>
              {devLoading ? (
                <div className="flex items-center gap-2 text-sm text-white/40"><Loader2 className="h-4 w-4 animate-spin" /> Loading {selectedDev}…</div>
              ) : devMood ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white/80">{devMood.username ?? selectedDev}</h3>
                    <span className={`text-xs ${MOOD_COLOR[moodKey(devMood.mood ?? "neutral")] ?? "text-white/40"}`}>{MOOD_EMOJI[moodKey(devMood.mood ?? "neutral")]} {devMood.mood}</span>
                  </div>
                  {devMood.summary && <p className="text-xs text-white/40 leading-relaxed">{devMood.summary}</p>}
                  {(devMood.history?.length ?? 0) > 0 && (
                    <div>
                      <p className="text-[10px] text-white/30 mb-2 uppercase tracking-wider">Mood History</p>
                      <div className="flex items-end gap-1 h-10">
                        {devMood.history!.slice(-14).map((h, i) => (
                          <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-pink-600 to-violet-500" style={{ height: `${(h.score / 100) * 36}px`, minHeight: "2px" }} />
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
        <div className="space-y-5 animate-scale-in opacity-0" style={{ animationFillMode: "forwards" }}>
          {chLoading ? (
            <div className="flex items-center gap-2 text-sm text-white/40 py-8 justify-center"><Loader2 className="h-4 w-4 animate-spin" /> Loading code health…</div>
          ) : codeHealth ? (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Health Score", value: codeHealth.score ?? 0, color: "from-emerald-500 to-cyan-500", text: "text-emerald-400" },
                  { label: "Test Coverage", value: codeHealth.testCoverage ?? 0, color: "from-cyan-500 to-blue-500", text: "text-cyan-400" },
                  { label: "Tech Debt", value: codeHealth.techDebt ?? 0, color: "from-orange-500 to-red-500", text: "text-orange-400" },
                ].map(({ label, value, color, text }) => (
                  <div key={label} className="glass-card rounded-2xl p-5 space-y-3">
                    <span className="text-xs text-white/40 uppercase tracking-wider">{label}</span>
                    <div className={`text-3xl font-black ${text}`}>{value}%</div>
                    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${color} progress-bar-animated`} style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              {(codeHealth.metrics?.length ?? 0) > 0 && (
                <div className="glass-card rounded-2xl p-5 space-y-3">
                  {codeHealth.metrics!.map((m, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-white/40 w-32 shrink-0">{m.name}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 progress-bar-animated" style={{ width: `${m.value}%` }} />
                      </div>
                      <span className="text-xs font-bold text-white/60 w-8 text-right">{m.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-sm text-white/30 text-center py-10">No code health data loaded.</div>
          )}
        </div>
      )}
    </div>
  );
}
