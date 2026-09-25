// MODULE 2: Bug Cold Case Files types

export type CaseSeverity = "critical" | "high" | "medium" | "low";
export type CaseStatus = "open" | "cold" | "resolved" | "recurring";

export interface BugEvidence {
  commitHash: string;
  date: string;
  author: string;
  message: string;
  type: "discovery" | "fix_attempt" | "recurrence" | "root_cause";
}

export interface ColdCase {
  id: string;
  title: string;
  severity: CaseSeverity;
  status: CaseStatus;
  firstSeen: string;
  lastSeen: string;
  affectedFiles: string[];
  evidenceChain: BugEvidence[];
  repeatCount: number;
  rootCause?: string;
  suggestedFix?: string;
  fixConfidence?: number; // 0–100
}

export interface RepeatOffender {
  filePath: string;
  bugCount: number;
  severity: CaseSeverity;
  lastBugDate: string;
}

export interface HeatmapCell {
  filePath: string;
  bugDensity: number; // 0–100
  severity: CaseSeverity;
}

export interface ColdCaseScanResult {
  repoUrl: string;
  scannedAt: string;
  totalCases: number;
  openCases: number;
  coldCases: number;
  cases: ColdCase[];
  repeatOffenders: RepeatOffender[];
}

// POST /api/coldcases/scan
export interface ScanColdCasesRequest {
  repoUrl: string;
}

// POST /api/coldcases/fix/:bugId
export interface FixSuggestionResponse {
  bugId: string;
  suggestedFix: string;
  confidence: number;
  explanation: string;
}
