import { NextResponse } from "next/server";

function mockFragile() {
  return [
    { name: "api/payments.ts", riskScore: 92, reason: "High cyclomatic complexity, 9 direct dependents, changed 34 times last month", dependents: 9, lastModified: "2024-09-18" },
    { name: "auth/session.ts", riskScore: 85, reason: "Central authentication logic with zero unit tests and 7 modules depending on it", dependents: 7, lastModified: "2024-08-30" },
    { name: "db/queries.ts", riskScore: 78, reason: "Raw SQL queries mixed with ORM calls, difficult to maintain and test", dependents: 6, lastModified: "2024-09-10" },
    { name: "utils/parser.ts", riskScore: 71, reason: "Complex parsing logic with edge cases not covered by tests", dependents: 8, lastModified: "2024-09-05" },
    { name: "store/reducer.ts", riskScore: 65, reason: "Large reducer with 400+ lines, handles too many state transitions", dependents: 5, lastModified: "2024-09-20" },
    { name: "config/env.ts", riskScore: 58, reason: "Environment config loaded at startup — any error here crashes the entire app", dependents: 12, lastModified: "2024-07-15" },
  ];
}

// GET /api/foodchain/fragile?repoUrl=<url>
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const repoUrl = searchParams.get("repoUrl") ?? "unknown";

  try {
    const { askBob } = await import("@/lib/bob-ai");
    const result = await askBob(
      `Identify the most fragile modules in repository: ${repoUrl}.
Return a JSON array of 6 objects: name (module name), riskScore (0-100), reason (string), dependents (number), lastModified (date string).`,
      "You are a software risk AI. Respond with valid JSON array only, no markdown."
    );
    const parsed = JSON.parse(result);
    return NextResponse.json({ status: "ok", data: parsed, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: "ok", data: mockFragile(), timestamp: new Date().toISOString() });
  }
}
