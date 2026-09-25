import { NextResponse } from "next/server";

// GET /api/coldcases/[bugId]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ bugId: string }> }
) {
  const { bugId } = await params;
  return NextResponse.json({
    status: "ok",
    data: { bugId, status: "cold", notes: "No recent activity on this case." },
    timestamp: new Date().toISOString(),
  });
}
