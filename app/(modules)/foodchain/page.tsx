"use client";

import { useState, useCallback } from "react";
import ReactFlow, {
  Background, Controls, MiniMap,
  type Node, type Edge, type NodeMouseHandler,
} from "reactflow";
import "reactflow/dist/style.css";
import { GitFork, Loader2, AlertTriangle, X } from "lucide-react";

/* ── Types ── */
interface FCNode { id: string; label: string; type: string; size?: number; }
interface FCEdge { source: string; target: string; strength?: number; }
interface Graph { nodes?: FCNode[]; edges?: FCEdge[]; apex?: string; fragile?: string; summary?: string; }
interface Fragile { name: string; riskScore?: number; reason?: string; }
interface Impact { module?: string; dependents?: string[]; riskLevel?: string; recommendations?: string[]; summary?: string; }

const TYPE_COLOR: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  apex:        { bg: "#1a0a0a", border: "#ef4444", text: "#f87171", glow: "#ef444440" },
  predator:    { bg: "#1a0a0a", border: "#ef4444", text: "#f87171", glow: "#ef444440" },
  herbivore:   { bg: "#0a1a0e", border: "#10b981", text: "#34d399", glow: "#10b98140" },
  parasite:    { bg: "#1a140a", border: "#eab308", text: "#fbbf24", glow: "#eab30840" },
  decomposer:  { bg: "#0f0f10", border: "#6b7280", text: "#9ca3af", glow: "#6b728040" },
};

function getTypeColor(type: string) {
  const key = type?.toLowerCase() ?? "decomposer";
  return TYPE_COLOR[key] ?? TYPE_COLOR.decomposer;
}

function CustomNode({ data }: { data: { label: string; nodeType: string } }) {
  const c = getTypeColor(data.nodeType);
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, boxShadow: `0 0 12px ${c.glow}`, color: c.text }}
      className="rounded-xl px-3 py-2 text-xs font-semibold min-w-[80px] text-center cursor-pointer transition-all hover:scale-105">
      {data.label}
      <div style={{ color: c.border }} className="text-[9px] mt-0.5 opacity-70">{data.nodeType}</div>
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

function GlassInput({ value, onChange, placeholder, color = "violet" }: {
  value: string; onChange: (v: string) => void; placeholder: string; color?: string;
}) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className={`flex-1 h-10 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-${color}-500/50 transition-all`}
    />
  );
}

export default function FoodChainPage() {
  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [fragile, setFragile] = useState<Fragile[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [impact, setImpact] = useState<Impact | null>(null);
  const [impactLoading, setImpactLoading] = useState(false);
  const [summary, setSummary] = useState("");

  const loadGraph = async () => {
    if (!repo.trim()) return;
    setLoading(true); setNodes([]); setEdges([]);
    try {
      const [gRes, fRes] = await Promise.all([
        fetch(`/api/foodchain/graph?repoUrl=${encodeURIComponent(repo)}`),
        fetch(`/api/foodchain/fragile?repoUrl=${encodeURIComponent(repo)}`),
      ]);
      const gJson = await gRes.json();
      const fJson = await fRes.json();
      const g: Graph = gJson.data ?? gJson;
      setSummary(g.summary ?? "");
      // Build ReactFlow nodes
      const rfNodes: Node[] = (g.nodes ?? []).map((n, i) => ({
        id: n.id,
        type: "custom",
        position: { x: (i % 5) * 200, y: Math.floor(i / 5) * 150 },
        data: { label: n.label ?? n.id, nodeType: n.type ?? "decomposer" },
      }));
      const rfEdges: Edge[] = (g.edges ?? []).map((e, i) => ({
        id: `e-${i}`,
        source: e.source,
        target: e.target,
        animated: true,
        style: { stroke: "#6366f1", strokeWidth: e.strength ?? 1 },
      }));
      setNodes(rfNodes);
      setEdges(rfEdges);
      const fd = fJson.data ?? fJson;
      setFragile(Array.isArray(fd) ? fd : []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const onNodeClick: NodeMouseHandler = useCallback(async (_, node) => {
    setSelectedNode(node.id); setImpactLoading(true); setImpact(null);
    try {
      const r = await fetch(`/api/foodchain/impact/${encodeURIComponent(node.id)}`);
      const json = await r.json();
      setImpact(json.data ?? json);
    } catch { setImpact({ module: node.id, summary: "No impact data." }); }
    finally { setImpactLoading(false); }
  }, []);

  const ROLES = [
    { label: "Apex Predators", color: "#ef4444" },
    { label: "Herbivores",     color: "#10b981" },
    { label: "Parasites",      color: "#eab308" },
    { label: "Decomposers",    color: "#6b7280" },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="animate-fade-in-up opacity-0 flex items-start justify-between" style={{ animationFillMode: "forwards" }}>
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
            <div className="absolute inset-0 rounded-xl bg-emerald-500/10 animate-pulse-glow" />
            <GitFork className="relative h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black" style={{ background: "linear-gradient(135deg,#34d399,#06b6d4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Food Chain</h1>
            <p className="text-xs text-white/40">Map module dependencies as natural ecosystem relationships</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-widest rounded-full px-3 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">Live</span>
      </div>

      {/* Ecosystem legend */}
      <div className="grid gap-3 sm:grid-cols-4 animate-fade-in opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
        {ROLES.map(({ label, color }) => (
          <div key={label} className="glass-card rounded-xl p-3 flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full shrink-0 shadow-sm" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
            <span className="text-xs font-medium text-white/60">{label}</span>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="glass-card rounded-2xl p-5 space-y-4 animate-scale-in opacity-0" style={{ animationFillMode: "forwards" }}>
        <div className="flex gap-3">
          <GlassInput value={repo} onChange={setRepo} placeholder="https://github.com/owner/repo" color="emerald" />
          <button onClick={loadGraph} disabled={loading || !repo.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-sm font-semibold text-white transition-all shadow-lg shadow-emerald-500/25">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitFork className="h-4 w-4" />}
            {loading ? "Mapping…" : "Load Graph"}
          </button>
        </div>
        {summary && <p className="text-xs text-white/30 italic">{summary}</p>}
      </div>

      {/* Graph + Impact panel */}
      {nodes.length > 0 && (
        <div className="flex gap-4">
          <div className="glass-card rounded-2xl overflow-hidden flex-1 animate-scale-in opacity-0" style={{ height: "480px", animationFillMode: "forwards" }}>
            <ReactFlow
              nodes={nodes} edges={edges} onNodeClick={onNodeClick}
              nodeTypes={nodeTypes} fitView
              style={{ background: "transparent" }}
            >
              <Background color="#ffffff10" gap={32} />
              <Controls style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
              <MiniMap style={{ background: "rgba(0,0,0,0.5)" }} nodeColor={(n) => getTypeColor((n.data as { nodeType: string }).nodeType).border} />
            </ReactFlow>
          </div>

          {/* Impact side panel */}
          {selectedNode && (
            <div className="glass-card rounded-2xl p-5 w-64 shrink-0 space-y-3 animate-slide-right opacity-0" style={{ animationFillMode: "forwards" }}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white/80">Impact Analysis</h3>
                <button onClick={() => setSelectedNode(null)} className="text-white/30 hover:text-white/60"><X className="h-3.5 w-3.5" /></button>
              </div>
              {impactLoading ? (
                <div className="flex items-center gap-2 text-xs text-white/40"><Loader2 className="h-3 w-3 animate-spin" />Analyzing…</div>
              ) : impact ? (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-emerald-400">{impact.module ?? selectedNode}</p>
                  {impact.riskLevel && <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${impact.riskLevel === "high" ? "text-red-400 border-red-500/40 bg-red-500/10" : impact.riskLevel === "medium" ? "text-yellow-400 border-yellow-500/40 bg-yellow-500/10" : "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"}`}>{impact.riskLevel} risk</span>}
                  {impact.summary && <p className="text-xs text-white/40 leading-relaxed">{impact.summary}</p>}
                  {(impact.recommendations?.length ?? 0) > 0 && (
                    <ul className="space-y-1">
                      {impact.recommendations!.slice(0, 3).map((r, i) => (
                        <li key={i} className="text-[10px] text-white/40 flex gap-1.5"><span className="text-emerald-400">✦</span>{r}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* Fragile modules */}
      {fragile.length > 0 && (
        <div className="space-y-3 animate-fade-in-up opacity-0" style={{ animationFillMode: "forwards" }}>
          <h2 className="font-semibold text-white/70 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-400" /> Fragile Modules
          </h2>
          <div className="space-y-2">
            {fragile.map((f, i) => (
              <div key={i} className="glass-card rounded-xl px-4 py-3 flex items-center gap-4 animate-fade-in-up opacity-0" style={{ animationDelay: `${i * 50}ms`, animationFillMode: "forwards" }}>
                <span className="text-sm text-white/70 flex-1">{f.name}</span>
                <span className="text-xs text-white/30 flex-1 text-right truncate">{f.reason}</span>
                <div className="flex items-center gap-2 w-28">
                  <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 progress-bar-animated" style={{ width: `${f.riskScore ?? 50}%` }} />
                  </div>
                  <span className="text-[10px] text-orange-400 font-bold w-6">{f.riskScore ?? "—"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
