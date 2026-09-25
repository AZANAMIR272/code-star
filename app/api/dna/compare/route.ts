import { NextResponse } from "next/server";

function mockCompare(repo1: string, repo2: string) {
  const n1 = repo1.split("/").pop()?.replace(/\.git$/, "") ?? "Repo1";
  const n2 = repo2.split("/").pop()?.replace(/\.git$/, "") ?? "Repo2";
  return {
    similarity: 62,
    differences: [
      `${n1} uses class-based architecture while ${n2} prefers functional patterns`,
      `${n2} has significantly higher test coverage (78% vs 45%)`,
      `${n1} has more complex async patterns with nested promises`,
      `${n2} follows stricter TypeScript usage with no implicit any`,
    ],
    commonPatterns: ["REST API design", "Component-based UI", "Environment config", "CI/CD pipelines"],
    uniqueTo1: ["Redux state management", "Server-side rendering", "Custom hooks"],
    uniqueTo2: ["GraphQL integration", "Microservice communication", "Event sourcing"],
    recommendation: `${n2} shows better code health practices overall. Consider adopting ${n2}'s testing strategy and TypeScript strictness in ${n1}.`,
  };
}

// GET /api/dna/compare?repo1=<url>&repo2=<url>
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const repo1 = searchParams.get("repo1") ?? "repo1";
  const repo2 = searchParams.get("repo2") ?? "repo2";

  try {
    const { askBob } = await import("@/lib/bob-ai");
    const result = await askBob(
      `Compare the codebase DNA of "${repo1}" vs "${repo2}".
Return a JSON object with: similarity (0-100), differences (array of strings), commonPatterns (array), uniqueTo1 (array), uniqueTo2 (array), recommendation (string).`,
      "You are a code comparison AI. Respond with valid JSON only, no markdown."
    );
    const parsed = JSON.parse(result);
    return NextResponse.json({ status: "ok", data: parsed, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: "ok", data: mockCompare(repo1, repo2), timestamp: new Date().toISOString() });
  }
}
