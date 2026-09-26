"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from "reactflow";
import "reactflow/dist/style.css";
import { GitFork, Loader2, AlertTriangle, X } from "lucide-react";
import { useReportStore } from "@/components/modules/ReportStore";

/* ── Types ── */
interface FCNode {
  id: string;
  label: string;
  type: string;
  size?: number;
}
interface FCEdge {
  source: string;
  target: string;
  strength?: number;
}
interface Graph {
  nodes?: FCNode[];
  edges?: FCEdge[];
  apex?: string;
  fragile?: string;
  summary?: string;
}
interface Fragile {
  name: string;
  riskScore?: number;
  reason?: string;
}
interface Impact {
  module?: string;
  dependents?: string[];
  riskLevel?: string;
  recommendations?: string[];
  summary?: string;
}

const TYPE_COLOR: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  apex: { bg: "#dc341e", border: "#dc341e", text: "#ffffff", glow: "#0f0d0a" },
  predator: { bg: "#dc341e", border: "#dc341e", text: "#ffffff", glow: "#0f0d0a" },
  herbivore: { bg: "#1e40c9", border: "#1e40c9", text: "#ffffff", glow: "#0f0d0a" },
  parasite: { bg: "#ffc900", border: "#ffc900", text: "#0f0d0a", glow: "#0f0d0a" },
  decomposer: { bg: "#f6f1e6", border: "#0f0d0a", text: "#0f0d0a", glow: "#0f0d0a" },
};

function getTypeColor(type: string) {
  const key = type?.toLowerCase() ?? "decomposer";
  return TYPE_COLOR[key] ?? TYPE_COLOR.decomposer;
}

function CustomNode({ data }: { data: { label: string; nodeType: string } }) {
  const c = getTypeColor(data.nodeType);
  return (
    <div
      style={{ background: c.bg, color: c.text, boxShadow: "3px 3px 0 #0f0d0a" }}
      className="min-w-[80px] cursor-pointer rounded-xl border-[3px] border-ink px-3 py-2 text-center text-xs font-semibold transition-all hover:scale-105"
    >
      {data.label}
      <div
        style={{ color: c.text }}
        className="mt-0.5 text-[9px] font-extrabold uppercase tracking-[0.16em] opacity-70"
      >
        {data.nodeType}
      </div>
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

function GlassInput({
  value,
  onChange,
  placeholder,
  color = "violet",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  color?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ caretColor: color === "emerald" ? "#1e40c9" : "#0f0d0a" }}
      className="h-10 flex-1 rounded-xl border-[3px] border-ink bg-white px-4 text-sm text-ink transition-all placeholder:text-ink/50 focus:outline-none focus:ring-2 focus:ring-process focus:ring-offset-2 focus:ring-offset-sun"
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

  /* ── shared report store ── */
  const { report, loaded, patchReport } = useReportStore();
  const hydrated = useRef(false);

  const applyGraph = useCallback((g: Graph, fd: unknown) => {
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
      style: { stroke: "#1e40c9", strokeWidth: e.strength ?? 1 },
    }));
    setNodes(rfNodes);
    setEdges(rfEdges);
    setFragile(Array.isArray(fd) ? fd : []);
  }, []);

  useEffect(() => {
    if (!loaded || hydrated.current) return;
    hydrated.current = true;
    const stored = report?.foodchain;
    if (stored?.graph && typeof stored.graph === "object") {
      applyGraph(stored.graph as Graph, stored.fragile);
    }
  }, [loaded, report, applyGraph]);

  const loadGraph = async () => {
    if (!repo.trim()) return;
    setLoading(true);
    setNodes([]);
    setEdges([]);
    try {
      const [gRes, fRes] = await Promise.all([
        fetch(`/api/foodchain/graph?repoUrl=${encodeURIComponent(repo)}`),
        fetch(`/api/foodchain/fragile?repoUrl=${encodeURIComponent(repo)}`),
      ]);
      const gJson = await gRes.json();
      const fJson = await fRes.json();
      const g: Graph = gJson.data ?? gJson;
      const fd = fJson.data ?? fJson;
      applyGraph(g, fd);
      patchReport({ foodchain: { graph: g, fragile: fd } });
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  const onNodeClick: NodeMouseHandler = useCallback(async (_, node) => {
    setSelectedNode(node.id);
    setImpactLoading(true);
    setImpact(null);
    try {
      const r = await fetch(`/api/foodchain/impact/${encodeURIComponent(node.id)}`);
      const json = await r.json();
      setImpact(json.data ?? json);
    } catch {
      setImpact({ module: node.id, summary: "No impact data." });
    } finally {
      setImpactLoading(false);
    }
  }, []);

  const ROLES = [
    { label: "Apex Predators", color: "#dc341e" },
    { label: "Herbivores", color: "#1e40c9" },
    { label: "Parasites", color: "#ffc900" },
    { label: "Decomposers", color: "#f6f1e6" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div
        className="animate-fade-in-up relative flex items-start justify-between overflow-hidden rounded-xl border-[3px] border-ink bg-white p-5 opacity-0 shadow-hard"
        style={{ animationFillMode: "forwards" }}
      >
        <div className="dots-blue-16 absolute -right-10 -top-10 h-44 w-72 rounded-bl-[80px] opacity-40" />
        <div className="relative flex items-center gap-4">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-[3px] border-ink bg-sun shadow-hard-xs">
            <div className="dots-ink-8 absolute inset-0 rounded-[9px] opacity-40" />
            <GitFork className="relative h-5 w-5 text-ink" />
          </div>
          <div>
            <h1 className="font-display text-2xl uppercase tracking-[-0.02em] text-ink">
              Food Chain
            </h1>
            <p className="text-xs text-ink/70">
              Map module dependencies as natural ecosystem relationships
            </p>
          </div>
        </div>
        <span className="press relative rounded-full border-[3px] border-ink bg-signal px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.24em] text-white shadow-hard-xs">
          Live
        </span>
      </div>

      {/* Ecosystem legend */}
      <div
        className="animate-fade-in grid gap-4 opacity-0 sm:grid-cols-4"
        style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
      >
        {ROLES.map(({ label, color }) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-xl border-[3px] border-ink bg-white p-3 shadow-hard"
          >
            <div
              className="h-4 w-4 shrink-0 rounded-full border-[3px] border-ink"
              style={{ background: color }}
            />
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-ink">{label}</span>
          </div>
        ))}
      </div>

      {/* Form */}
      <div
        className="animate-scale-in space-y-4 rounded-xl border-[3px] border-ink bg-white p-5 opacity-0 shadow-hard"
        style={{ animationFillMode: "forwards" }}
      >
        <div className="flex gap-3">
          <GlassInput
            value={repo}
            onChange={setRepo}
            placeholder="https://github.com/owner/repo"
            color="emerald"
          />
          <button
            onClick={loadGraph}
            disabled={loading || !repo.trim()}
            className="press flex items-center gap-2 rounded-xl border-[3px] border-ink bg-signal px-5 py-2 text-sm font-bold text-white shadow-hard-sm transition-all hover:bg-ink disabled:opacity-40"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GitFork className="h-4 w-4" />
            )}
            {loading ? "Mapping…" : "Load Graph"}
          </button>
        </div>
        {summary && <p className="text-xs italic text-ink/50">{summary}</p>}
      </div>

      {/* Graph + Impact panel */}
      {nodes.length > 0 && (
        <div className="flex gap-4">
          <div
            className="animate-scale-in flex-1 overflow-hidden rounded-xl border-[3px] border-ink bg-white opacity-0 shadow-hard"
            style={{ height: "480px", animationFillMode: "forwards" }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              style={{ background: "#f6f1e6" }}
            >
              <Background color="rgba(15,13,10,0.18)" gap={32} />
              <Controls
                style={{ background: "#ffffff", border: "3px solid #0f0d0a", borderRadius: "12px" }}
              />
              <MiniMap
                style={{ background: "#f6f1e6", border: "3px solid #0f0d0a", borderRadius: "12px" }}
                nodeColor={(n) => getTypeColor((n.data as { nodeType: string }).nodeType).border}
              />
            </ReactFlow>
          </div>

          {/* Impact side panel */}
          {selectedNode && (
            <div
              className="animate-slide-right w-64 shrink-0 space-y-3 rounded-xl border-[3px] border-ink bg-white p-5 opacity-0 shadow-hard"
              style={{ animationFillMode: "forwards" }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm uppercase tracking-[-0.02em] text-ink">
                  Impact Analysis
                </h3>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-ink/50 hover:text-signal"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              {impactLoading ? (
                <div className="flex items-center gap-2 text-xs text-ink/60">
                  <Loader2 className="h-3 w-3 animate-spin text-signal" />
                  Analyzing…
                </div>
              ) : impact ? (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-process">{impact.module ?? selectedNode}</p>
                  {impact.riskLevel && (
                    <span
                      className={`rounded-full border-[3px] border-ink px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.16em] ${impact.riskLevel === "high" ? "bg-signal text-white" : impact.riskLevel === "medium" ? "bg-sun text-ink" : "bg-process text-white"}`}
                    >
                      {impact.riskLevel} risk
                    </span>
                  )}
                  {impact.summary && (
                    <p className="text-xs leading-relaxed text-ink/70">{impact.summary}</p>
                  )}
                  {(impact.recommendations?.length ?? 0) > 0 && (
                    <ul className="space-y-1">
                      {impact.recommendations!.slice(0, 3).map((r, i) => (
                        <li key={i} className="flex gap-1.5 text-[10px] text-ink/60">
                          <span className="text-signal">✦</span>
                          {r}
                        </li>
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
        <div
          className="animate-fade-in-up space-y-3 opacity-0"
          style={{ animationFillMode: "forwards" }}
        >
          <h2 className="flex items-center gap-2 font-display text-lg uppercase tracking-[-0.02em] text-ink">
            <AlertTriangle className="h-4 w-4 text-signal" /> Fragile Modules
          </h2>
          <div className="space-y-3">
            {fragile.map((f, i) => (
              <div
                key={i}
                className="animate-fade-in-up flex items-center gap-4 rounded-xl border-[3px] border-ink bg-white px-4 py-3 opacity-0 shadow-hard"
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: "forwards" }}
              >
                <span className="flex-1 text-sm font-semibold text-ink">{f.name}</span>
                <span className="flex-1 truncate text-right text-xs text-ink/50">{f.reason}</span>
                <div className="flex w-28 items-center gap-2">
                  <div className="h-3 flex-1 overflow-hidden rounded-full border-[3px] border-ink bg-newsprint">
                    <div
                      className="progress-bar-animated h-full bg-signal"
                      style={{ width: `${f.riskScore ?? 50}%` }}
                    />
                  </div>
                  <span className="w-6 text-[10px] font-extrabold text-signal">
                    {f.riskScore ?? "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
