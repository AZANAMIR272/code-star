import { NextResponse } from "next/server";

// GET /api/city/directions?from=<buildingId>&to=<buildingId>
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  return NextResponse.json({
    status: "ok",
    data: { from, to, path: [from, to], distance: 1 },
    timestamp: new Date().toISOString(),
  });
}
