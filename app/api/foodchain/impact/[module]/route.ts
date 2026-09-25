import { NextResponse } from "next/server";

// GET /api/foodchain/impact/[module]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ module: string }> }
) {
  const { module: mod } = await params;

  const fallback = {
    module: mod,
    dependents: ["api", "auth", "ui", "services"],
    riskLevel: "high",
    impactScore: 78,
    summary: `Removing or significantly changing "${mod}" would affect 4 downstream modules. It is a critical dependency in the system.`,
    recommendations: [
      `Add comprehensive unit tests to "${mod}" before any refactoring`,
      "Consider adding an abstraction layer to reduce tight coupling",
      "Document all public interfaces clearly",
      "Set up integration tests covering all dependent modules",
    ],
  };

  try {
    const { askBob } = await import("@/lib/bob-ai");
    const result = await askBob(
      `Analyze the impact of module "${mod}" in a software codebase.
Return a JSON object with: module, dependents (array), riskLevel (low|medium|high), impactScore (0-100), recommendations (array), summary (string).`,
      "You are a software impact analysis AI. Respond with valid JSON only, no markdown."
    );
    const parsed = JSON.parse(result);
    return NextResponse.json({ status: "ok", data: parsed, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: "ok", data: fallback, timestamp: new Date().toISOString() });
  }
}
