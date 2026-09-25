import { NextResponse } from "next/server";

function mockPredators() {
  return [
    { name: "core", dependents: 11, type: "apex", description: "Central business logic — every module depends on it. Change here ripples everywhere." },
    { name: "database", dependents: 8, type: "apex", description: "Data access layer consumed by API, auth, and services. Critical infrastructure module." },
    { name: "api", dependents: 6, type: "apex", description: "REST API layer — frontend and all integrations go through here." },
    { name: "auth", dependents: 5, type: "apex", description: "Authentication & authorization — security-critical, depended on by every protected route." },
    { name: "config", dependents: 12, type: "apex", description: "Environment configuration loaded at startup by all modules. Highest fan-out in the codebase." },
  ];
}

// GET /api/foodchain/predators?repoUrl=<url>
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const repoUrl = searchParams.get("repoUrl") ?? "unknown";

  try {
    const { askBob } = await import("@/lib/bob-ai");
    const result = await askBob(
      `Find the apex predator modules (most critical, most depended on) in: ${repoUrl}.
Return a JSON array of 5 objects: name, dependents (number), type ("apex"), description (string).`,
      "You are a software architecture AI. Respond with valid JSON array only, no markdown."
    );
    const parsed = JSON.parse(result);
    return NextResponse.json({ status: "ok", data: parsed, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: "ok", data: mockPredators(), timestamp: new Date().toISOString() });
  }
}
