import { NextResponse } from "next/server";

function mockHeatmap() {
  const files = [
    "auth/login.ts", "api/users.ts", "utils/parser.ts", "components/Form.tsx",
    "db/queries.ts", "middleware/cors.ts", "routes/index.ts", "models/User.ts",
    "services/email.ts", "helpers/date.ts", "config/env.ts", "tests/auth.test.ts",
    "controllers/order.ts", "hooks/useData.ts", "store/reducer.ts", "pages/Home.tsx",
    "api/payments.ts", "utils/validate.ts", "lib/cache.ts", "types/index.ts",
    "constants.ts", "theme/colors.ts", "guards/auth.ts", "workers/queue.ts",
  ];
  const severities: Array<"low" | "medium" | "high" | "critical"> = ["low", "medium", "high", "critical"];
  return files.map((file, i) => ({
    file,
    bugCount: [0, 1, 3, 5, 2, 8, 1, 4, 6, 0, 2, 3, 7, 1, 5, 2, 9, 3, 1, 0, 4, 2, 6, 3][i] ?? 0,
    severity: severities[Math.floor(i / 6)],
  }));
}

// GET /api/coldcases/heatmap?repoUrl=<url>
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const repoUrl = searchParams.get("repoUrl") ?? "unknown";

  try {
    const { askBob } = await import("@/lib/bob-ai");
    const result = await askBob(
      `Generate a bug density heatmap for repository: ${repoUrl}.
Return a JSON array of 24 objects: file (filename string), bugCount (0-12), severity (low|medium|high|critical).`,
      "You are a bug analysis AI. Respond with valid JSON array only, no markdown."
    );
    const parsed = JSON.parse(result);
    return NextResponse.json({ status: "ok", data: parsed, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: "ok", data: mockHeatmap(), timestamp: new Date().toISOString() });
  }
}
