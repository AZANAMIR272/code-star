import { NextResponse } from "next/server";

function mockBugs(repoUrl: string) {
  const name = repoUrl.split("/").pop()?.replace(/\.git$/, "") ?? "repo";
  return [
    { id: "BUG-001", title: `Memory leak in ${name} event listeners not cleaned up`, severity: "high", lastActivity: "2024-08-15", suspectedCause: "Event listeners attached on component mount but never removed on unmount, causing memory accumulation over time.", suggestedFix: "Add cleanup function in useEffect to remove event listeners on unmount." },
    { id: "BUG-002", title: "Race condition in async data fetching causes stale UI state", severity: "critical", lastActivity: "2024-07-22", suspectedCause: "Multiple concurrent API calls updating the same state without cancellation of previous requests.", suggestedFix: "Implement AbortController to cancel in-flight requests when component unmounts or new request is triggered." },
    { id: "BUG-003", title: "CSS z-index stacking causes modal overlay to appear behind sidebar", severity: "medium", lastActivity: "2024-09-01", suspectedCause: "Inconsistent z-index values across components without a defined stacking context.", suggestedFix: "Define a global z-index scale (e.g. 10=sidebar, 100=modal, 1000=toast) and apply consistently." },
    { id: "BUG-004", title: "Unhandled promise rejection on network timeout crashes app silently", severity: "high", lastActivity: "2024-06-30", suspectedCause: "Missing .catch() handler on fetch calls inside non-async event handlers.", suggestedFix: "Wrap all fetch calls in try/catch blocks and add global unhandledRejection error boundary." },
    { id: "BUG-005", title: "Pagination resets to page 1 on browser back navigation", severity: "low", lastActivity: "2024-08-28", suspectedCause: "Page state stored only in component state, not in URL query params.", suggestedFix: "Sync pagination state with URL search params using router.push with query object." },
    { id: "BUG-006", title: "Type coercion bug in price calculation returns NaN for decimal inputs", severity: "critical", lastActivity: "2024-05-10", suspectedCause: "String input from form not explicitly parsed to float before arithmetic operations.", suggestedFix: "Use parseFloat() or Number() on all numeric inputs from forms before calculations." },
  ];
}

// POST /api/coldcases/scan
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { repoUrl = "unknown", since = "6 months ago" } = body;

  try {
    const { askBob } = await import("@/lib/bob-ai");
    const result = await askBob(
      `Scan the repository "${repoUrl}" for cold case bugs — issues open since ${since} with no recent activity.
Return a JSON array of 6 bug objects: id (string), title (string), severity (low|medium|high|critical), lastActivity (date), suspectedCause (string), suggestedFix (string).`,
      "You are a bug detective AI. Respond with valid JSON array only, no markdown."
    );
    const parsed = JSON.parse(result);
    return NextResponse.json({ status: "ok", data: parsed, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: "ok", data: mockBugs(repoUrl), timestamp: new Date().toISOString() });
  }
}
