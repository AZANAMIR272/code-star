import { NextResponse } from "next/server";

// GET /api/city/search/[query]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ query: string }> }
) {
  const { query } = await params;
  return NextResponse.json({
    status: "ok",
    data: { query, results: [] },
    timestamp: new Date().toISOString(),
  });
}
