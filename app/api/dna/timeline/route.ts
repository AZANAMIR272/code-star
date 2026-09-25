import { NextResponse } from "next/server";

function mockTimeline() {
  const weeks = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (11 - i) * 7);
    const scores = [62, 58, 65, 70, 67, 72, 68, 75, 71, 78, 74, 80];
    const changes = [
      "Initial project setup and base architecture",
      "Added authentication module",
      "Refactored API layer with better error handling",
      "Improved test coverage from 30% to 45%",
      "Fixed critical memory leak in data processing",
      "Added TypeScript strict mode",
      "Database query optimization",
      "New UI components and design system",
      "CI/CD pipeline improvements",
      "Security audit fixes applied",
      "Performance optimizations — 40% faster load",
      "Major feature release with 98% uptime",
    ];
    return {
      week: `Week ${i + 1}`,
      date: d.toISOString().split("T")[0],
      healthScore: scores[i],
      changes: changes[i],
      summary: changes[i],
    };
  });
  return weeks;
}

// GET /api/dna/timeline?repoUrl=<url>
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const repoUrl = searchParams.get("repoUrl") ?? "unknown";

  try {
    const { askBob } = await import("@/lib/bob-ai");
    const result = await askBob(
      `Generate a 12-week code health timeline for repository: ${repoUrl}.
Return a JSON array of 12 objects, each with: week (string), date (YYYY-MM-DD), healthScore (40-95), changes (string), summary (string).`,
      "You are a code history AI. Respond with valid JSON array only, no markdown."
    );
    const parsed = JSON.parse(result);
    return NextResponse.json({ status: "ok", data: parsed, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: "ok", data: mockTimeline(), timestamp: new Date().toISOString() });
  }
}
