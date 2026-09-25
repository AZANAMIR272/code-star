// MODULE 3: Code Mood Ring types

export type MoodLevel = "great" | "good" | "neutral" | "stressed" | "burned_out";
export type CodeHealthStatus = "green" | "yellow" | "red";

export interface CommitSentiment {
  commitHash: string;
  date: string;
  author: string;
  message: string;
  sentiment: MoodLevel;
  score: number; // -100 to +100
  keywords: string[];
}

export interface DeveloperMood {
  username: string;
  currentMood: MoodLevel;
  moodScore: number;
  burnoutRisk: number; // 0–100
  trend: "improving" | "stable" | "declining";
  history: Array<{
    date: string;
    mood: MoodLevel;
    score: number;
  }>;
}

export interface TeamMood {
  teamName: string;
  moralIndex: number; // 0–100
  burnoutRisk: number;
  distribution: Record<MoodLevel, number>;
  members: DeveloperMood[];
}

export interface CodeHealthScore {
  filePath: string;
  score: number; // 0–100
  status: CodeHealthStatus;
  testCoverage: number;
  complexity: number;
  documentation: number;
}

export interface MoodCodeCorrelation {
  period: string;
  moodScore: number;
  bugRate: number;
  testWritten: number;
  insight: string;
}

// POST /api/mood/alert
export interface MoodAlertConfig {
  threshold: number;
  notifyEmail?: string;
  notifySlack?: string;
}
