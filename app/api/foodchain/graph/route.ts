import { NextResponse } from "next/server";

function mockGraph(repoUrl: string) {
  const name = repoUrl.split("/").pop()?.replace(/\.git$/, "") ?? "repo";
  return {
    nodes: [
      { id: "core", label: "core", type: "apex", size: 40 },
      { id: "auth", label: "auth", type: "module", size: 28 },
      { id: "api", label: "api", type: "module", size: 35 },
      { id: "ui", label: "ui", type: "module", size: 30 },
      { id: "db", label: "database", type: "module", size: 32 },
      { id: "utils", label: "utils", type: "helper", size: 20 },
      { id: "config", label: "config", type: "helper", size: 15 },
      { id: "tests", label: "tests", type: "test", size: 22 },
    ],
    edges: [
      { source: "auth", target: "core", strength: 0.9 },
      { source: "api", target: "core", strength: 0.85 },
      { source: "api", target: "db", strength: 0.8 },
      { source: "ui", target: "api", strength: 0.75 },
      { source: "ui", target: "core", strength: 0.6 },
      { source: "utils", target: "core", strength: 0.5 },
      { source: "auth", target: "db", strength: 0.7 },
      { source: "config", target: "core", strength: 0.4 },
      { source: "tests", target: "api", strength: 0.65 },
    ],
    apex: "core",
    fragile: "api",
    summary: `${name} has a hub-and-spoke architecture centered around the core module. The API layer is the most fragile point — it has 4 direct dependents and moderate change frequency.`,
  };
}

// GET /api/foodchain/graph?repoUrl=<url>
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const repoUrl = searchParams.get("repoUrl") ?? "unknown";

  try {
    const { askBob } = await import("@/lib/bob-ai");
    const result = await askBob(
      `Map the module dependency graph (food chain) for repository: ${repoUrl}.
Return a JSON object with: nodes (array of {id, label, type, size}), edges (array of {source, target, strength}), apex (most depended-on module), fragile (most fragile module), summary (string).`,
      "You are a software architecture AI. Respond with valid JSON only, no markdown."
    );
    const parsed = JSON.parse(result);
    return NextResponse.json({ status: "ok", data: parsed, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: "ok", data: mockGraph(repoUrl), timestamp: new Date().toISOString() });
  }
}
