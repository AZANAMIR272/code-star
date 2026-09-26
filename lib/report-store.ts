/* Shared report store — persisted module results for the last generated repo.
   Stored in localStorage so it survives navigation between module pages. */

const KEY = "codestar:report";

export interface StoredReport {
  repo: string;
  savedAt: string;
  dna?: unknown;
  coldcases?: unknown;
  foodchain?: { graph?: unknown; fragile?: unknown };
  city?: unknown;
  mood?: { team?: unknown; codeHealth?: unknown };
}

export function readReport(): StoredReport | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredReport;
    if (!parsed || typeof parsed !== "object" || typeof parsed.savedAt !== "string") return null;
    return { ...parsed, repo: typeof parsed.repo === "string" ? parsed.repo : "" };
  } catch {
    return null;
  }
}

export function writeReport(data: StoredReport): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* quota / private mode — ignore */
  }
}

export function clearStoredReport(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
