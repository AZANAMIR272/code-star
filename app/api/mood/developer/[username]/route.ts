import { NextResponse } from "next/server";

// GET /api/mood/developer/[username]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const fallback = {
    username,
    mood: "neutral",
    summary: `${username} is maintaining a steady pace with consistent code quality. No immediate concerns but watch for signs of overload in upcoming sprints.`,
    commits: 34,
    codeQuality: 76,
    burnoutRisk: 32,
    strengths: ["Consistent commit frequency", "Good code review participation", "Clean PR descriptions"],
    concerns: ["PR review time increasing", "Fewer comments on others' code this week"],
    history: Array.from({ length: 14 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (13 - i));
      return { date: d.toISOString().split("T")[0], score: 55 + Math.round(Math.sin(i * 0.8) * 20) };
    }),
  };

  try {
    const { askBob } = await import("@/lib/bob-ai");
    const result = await askBob(
      `Generate a developer mood profile for: ${username}.
Return a JSON object with: username, mood (happy|good|neutral|stressed|burnout), summary, commits (number), codeQuality (0-100), history (array of 14 {date, score}), burnoutRisk (0-100), strengths (array), concerns (array).`,
      "You are a developer wellbeing AI. Respond with valid JSON only, no markdown."
    );
    const parsed = JSON.parse(result);
    return NextResponse.json({ status: "ok", data: parsed, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: "ok", data: fallback, timestamp: new Date().toISOString() });
  }
}
