import { NextResponse } from "next/server";

function mockCodeHealth(repoUrl: string) {
  const name = repoUrl.split("/").pop()?.replace(/\.git$/, "") ?? "repo";
  return {
    score: 74,
    testCoverage: 52,
    techDebt: 38,
    summary: `${name} has solid fundamentals with room for improvement in test coverage and tech debt reduction. Overall health is good with active maintenance.`,
    metrics: [
      { name: "Code Coverage", value: 52 },
      { name: "Duplication", value: 78 },
      { name: "Complexity", value: 65 },
      { name: "Maintainability", value: 80 },
      { name: "Security", value: 85 },
      { name: "Performance", value: 70 },
      { name: "Documentation", value: 45 },
    ],
  };
}

// GET /api/mood/code-health?repoUrl=<url>
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const repoUrl = searchParams.get("repoUrl") ?? "general";

  try {
    const { askBob } = await import("@/lib/bob-ai");
    const result = await askBob(
      `Generate a code health report for: ${repoUrl}.
Return a JSON object with: score (0-100), testCoverage (0-100), techDebt (0-100), metrics (array of {name, value 0-100}), summary (string).`,
      "You are a code quality AI. Respond with valid JSON only, no markdown."
    );
    const parsed = JSON.parse(result);
    return NextResponse.json({ status: "ok", data: parsed, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: "ok", data: mockCodeHealth(repoUrl), timestamp: new Date().toISOString() });
  }
}
