import { NextResponse } from "next/server";

// GET /api/mood/correlation
export async function GET() {
  return NextResponse.json({
    status: "ok",
    data: {
      correlation: 0.74,
      insight: "Higher team mood scores correlate strongly with better code quality metrics. Teams with mood > 70 produce 40% fewer bugs.",
      dataPoints: Array.from({ length: 12 }, (_, i) => ({
        week: `W${i + 1}`,
        moodScore: 55 + Math.round(Math.sin(i * 0.9) * 20),
        codeQuality: 60 + Math.round(Math.cos(i * 0.7) * 15),
      })),
    },
    timestamp: new Date().toISOString(),
  });
}
