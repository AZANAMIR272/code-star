import { NextResponse } from "next/server";

// POST /api/coldcases/fix/[bugId]
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ bugId: string }> }
) {
  const { bugId } = await params;

  const fallback = {
    steps: [
      "Reproduce the bug in a local environment with minimal test case",
      "Add failing unit test to prevent regression",
      "Identify the root cause by tracing the call stack",
      "Apply the targeted fix with minimal code changes",
      "Run full test suite to verify no regressions",
      "Submit PR with the fix and link to this bug report",
    ],
    rootCause: "Insufficient input validation allowing unexpected state transitions in the affected code path.",
    estimatedEffort: "medium",
    codeSnippet: `// Before fix\nfunction process(input) {\n  return input.value * 2; // crashes if input is null\n}\n\n// After fix\nfunction process(input) {\n  if (!input?.value) return 0;\n  return input.value * 2;\n}`,
    confidence: 82,
  };

  try {
    const { askBob } = await import("@/lib/bob-ai");
    const result = await askBob(
      `Provide an AI fix suggestion for bug ID: ${bugId}.
Return a JSON object with: steps (array of actionable fix steps), rootCause (string), estimatedEffort (low|medium|high), codeSnippet (short code example), confidence (0-100).`,
      "You are a bug-fixing AI. Respond with valid JSON only, no markdown."
    );
    const parsed = JSON.parse(result);
    return NextResponse.json({ status: "ok", data: parsed, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: "ok", data: fallback, timestamp: new Date().toISOString() });
  }
}
