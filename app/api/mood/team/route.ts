import { NextResponse } from "next/server";

function mockTeam() {
  return {
    overallMood: "neutral",
    score: 68,
    members: [
      { name: "Alice Chen", mood: "happy", commits: 42, codeQuality: 85 },
      { name: "Bob Sharma", mood: "stressed", commits: 28, codeQuality: 70 },
      { name: "Carlos Diaz", mood: "happy", commits: 55, codeQuality: 90 },
      { name: "Diana Park", mood: "neutral", commits: 19, codeQuality: 75 },
      { name: "Ethan Wong", mood: "burnout", commits: 8, codeQuality: 60 },
    ],
    recommendations: [
      "Schedule a team retrospective — Ethan shows burnout signals (low commits, declining quality)",
      "Recognize Carlos's consistent high output this sprint",
      "Consider reducing Bob's sprint load — stress indicators are rising",
      "Implement code review rotation to spread knowledge and reduce single-point pressure",
    ],
    weeklyTrend: [72, 68, 65, 70, 63, 67, 68],
  };
}

// GET /api/mood/team
export async function GET() {
  try {
    const { askBob } = await import("@/lib/bob-ai");
    const result = await askBob(
      `Generate a realistic team mood report for a software development team.
Return a JSON object with: overallMood (happy|neutral|stressed|burnout), score (0-100), members (array of {name, mood, commits, codeQuality}), recommendations (array of strings), weeklyTrend (array of 7 daily mood scores).`,
      "You are a developer wellbeing AI. Respond with valid JSON only, no markdown."
    );
    const parsed = JSON.parse(result);
    return NextResponse.json({ status: "ok", data: parsed, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: "ok", data: mockTeam(), timestamp: new Date().toISOString() });
  }
}
