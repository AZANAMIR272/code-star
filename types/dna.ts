// MODULE 1: Codebase DNA Profiler types

export type DnaGrade = "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F";

export interface DnaLayer {
  name: string;
  grade: DnaGrade;
  score: number; // 0–100
  summary: string;
  details: Record<string, unknown>;
}

export interface DnaProfile {
  repoUrl: string;
  repoName: string;
  analyzedAt: string;
  overallGrade: DnaGrade;
  overallScore: number;
  layers: {
    structural: DnaLayer;
    behavioral: DnaLayer;
    tech: DnaLayer;
    quality: DnaLayer;
    social: DnaLayer;
    temporal: DnaLayer;
  };
}

export interface DnaComparison {
  repoA: DnaProfile;
  repoB: DnaProfile;
  similarities: string[];
  differences: string[];
}

export interface DnaTimelineEntry {
  date: string;
  event: string;
  overallScore: number;
  layers: Partial<Record<keyof DnaProfile["layers"], number>>;
}

export interface DnaTimeline {
  repoUrl: string;
  entries: DnaTimelineEntry[];
}

// POST /api/dna/analyze
export interface AnalyzeDnaRequest {
  repoUrl: string;
}
