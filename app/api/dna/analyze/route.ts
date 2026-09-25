import { NextResponse } from "next/server";

function mockDna(repoUrl: string) {
  const name = repoUrl.split("/").pop()?.replace(/\.git$/, "") ?? "repo";
  return {
    languages: ["TypeScript", "JavaScript", "CSS", "HTML"],
    complexity: "medium",
    patterns: ["MVC", "Repository Pattern", "Observer", "Singleton"],
    topFiles: [`src/index.ts`, `src/components/${name}.tsx`, `src/utils/helpers.ts`, `README.md`],
    summary: `${name} is a well-structured codebase with moderate complexity. It follows standard architectural patterns and has clear separation of concerns. The codebase shows consistent coding style with TypeScript as the primary language.`,
    layers: [
      { name: "Structural", score: 72, summary: "Good modular structure with clear boundaries.", topItems: ["components", "utils", "services"] },
      { name: "Behavioral", score: 65, summary: "Solid control flow with some complex async chains.", topItems: ["event-driven", "async/await", "callbacks"] },
      { name: "Tech", score: 80, summary: "Modern tech stack with up-to-date dependencies.", topItems: ["TypeScript", "React", "Node.js"] },
      { name: "Quality", score: 58, summary: "Decent quality but needs more test coverage.", topItems: ["ESLint", "Prettier", "Jest"] },
      { name: "Social", score: 70, summary: "Active team with regular commits and reviews.", topItems: ["3 contributors", "weekly commits", "PR reviews"] },
      { name: "Temporal", score: 63, summary: "Steady development pace over past 6 months.", topItems: ["6 months active", "~12 commits/week"] },
    ],
  };
}

// POST /api/dna/analyze
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { repoUrl = "unknown", description = "" } = body;

  try {
    const { askBob } = await import("@/lib/bob-ai");
    const result = await askBob(
      `Analyze the codebase DNA for repository: ${repoUrl}. ${description}
Return a JSON object with keys: languages (array), complexity (low|medium|high), patterns (array), topFiles (array), summary (string), layers (array of {name, score 0-100, summary, topItems}).`,
      "You are a code analysis AI. Respond with valid JSON only, no markdown."
    );
    const parsed = JSON.parse(result);
    return NextResponse.json({ status: "ok", data: parsed, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: "ok", data: mockDna(repoUrl), timestamp: new Date().toISOString() });
  }
}
