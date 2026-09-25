import { NextResponse } from "next/server";

function mockCity(repoUrl: string) {
  const name = repoUrl.split("/").pop()?.replace(/\.git$/, "") ?? "repo";
  return {
    totalFiles: 124,
    summary: `${name} codebase mapped as a 3D city with 8 districts and 124 files. Core module forms the downtown skyscraper district.`,
    buildings: [
      { id: "b1",  name: "core",         height: 8,  width: 3, depth: 3, x: 0,   z: 0,   color: "#a78bfa", linesOfCode: 1240, language: "TypeScript" },
      { id: "b2",  name: "api",          height: 6,  width: 3, depth: 3, x: 6,   z: 0,   color: "#38bdf8", linesOfCode: 980,  language: "TypeScript" },
      { id: "b3",  name: "auth",         height: 5,  width: 2, depth: 2, x: -6,  z: 0,   color: "#f472b6", linesOfCode: 760,  language: "TypeScript" },
      { id: "b4",  name: "database",     height: 7,  width: 3, depth: 3, x: 0,   z: 6,   color: "#34d399", linesOfCode: 1100, language: "TypeScript" },
      { id: "b5",  name: "ui/components",height: 4,  width: 4, depth: 4, x: -6,  z: 6,   color: "#fb923c", linesOfCode: 2400, language: "TSX"        },
      { id: "b6",  name: "utils",        height: 2,  width: 2, depth: 2, x: 6,   z: 6,   color: "#facc15", linesOfCode: 320,  language: "TypeScript" },
      { id: "b7",  name: "config",       height: 1.5,width: 2, depth: 2, x: 0,   z: -6,  color: "#94a3b8", linesOfCode: 180,  language: "JSON"       },
      { id: "b8",  name: "tests",        height: 3,  width: 3, depth: 3, x: 6,   z: -6,  color: "#6ee7b7", linesOfCode: 560,  language: "TypeScript" },
      { id: "b9",  name: "middleware",   height: 3,  width: 2, depth: 2, x: -6,  z: -6,  color: "#c084fc", linesOfCode: 420,  language: "TypeScript" },
      { id: "b10", name: "models",       height: 4,  width: 2, depth: 2, x: 12,  z: 0,   color: "#67e8f9", linesOfCode: 640,  language: "TypeScript" },
      { id: "b11", name: "services",     height: 5,  width: 3, depth: 2, x: -12, z: 0,   color: "#fda4af", linesOfCode: 820,  language: "TypeScript" },
      { id: "b12", name: "hooks",        height: 2,  width: 2, depth: 2, x: 0,   z: 12,  color: "#86efac", linesOfCode: 280,  language: "TypeScript" },
    ],
    districts: [
      { name: "Downtown Core",  buildings: ["b1", "b2", "b4"] },
      { name: "Auth Quarter",   buildings: ["b3", "b9"] },
      { name: "UI District",    buildings: ["b5", "b12"] },
      { name: "Data Zone",      buildings: ["b10", "b11"] },
      { name: "Support",        buildings: ["b6", "b7", "b8"] },
    ],
  };
}

// GET /api/city/generate?repoUrl=<url>
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const repoUrl = searchParams.get("repoUrl") ?? "unknown";

  try {
    const { askBob } = await import("@/lib/bob-ai");
    const result = await askBob(
      `Generate a 3D city layout for the codebase: ${repoUrl}.
Map each module/directory as a building. Return a JSON object with: buildings (array of {id, name, height, width, depth, x, z, color, linesOfCode, language}), districts (array of {name, buildings: [ids]}), totalFiles (number), summary (string).`,
      "You are a 3D codebase visualisation AI. Respond with valid JSON only, no markdown."
    );
    const parsed = JSON.parse(result);
    return NextResponse.json({ status: "ok", data: parsed, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: "ok", data: mockCity(repoUrl), timestamp: new Date().toISOString() });
  }
}
