import { NextResponse } from "next/server";

const FALLBACK = {
  repos: 7,
  bugsFound: 34,
  modulesMapped: 58,
  activeAlerts: 4,
  healthScore: 78,
  tagline: "Analyze. Fix. Ship.",
};

// GET /api/dashboard/stats
export async function GET() {
  try {
    const { askBob } = await import("@/lib/bob-ai");
    const result = await askBob(
      `Generate realistic dashboard statistics for a software development team using CODE STAR platform.
Return ONLY valid JSON with exactly these keys:
{
  "repos": <number 3-15>,
  "bugsFound": <number 12-80>,
  "modulesMapped": <number 20-120>,
  "activeAlerts": <number 2-10>,
  "healthScore": <number 60-95>,
  "tagline": <short motivational string about code quality>
}`,
      "You are a dev metrics AI. Respond with valid JSON only. No markdown, no explanation."
    );

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(result);
    } catch {
      parsed = FALLBACK;
    }

    return NextResponse.json({ status: "ok", data: parsed, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: "ok", data: FALLBACK, timestamp: new Date().toISOString() });
  }
}
