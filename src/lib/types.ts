export type ContentType = "code" | "email" | "analysis" | "writing" | "other";

export type IssueCategory =
  | "factual_risk"
  | "logic_gap"
  | "missing_context"
  | "blind_spot"
  | "security_risk"
  | "tone_mismatch"
  | "unsupported_claim"
  | "bias";

export type Severity = "critical" | "moderate" | "minor";

export type OverallRisk = "high" | "medium" | "low";

export interface Issue {
  id: string;
  category: IssueCategory;
  severity: Severity;
  flaggedText: string;
  explanation: string;
  reframe: string;
}

export interface AnalysisRequest {
  content: string;
  contentType: ContentType;
  source?: string;
}

export interface AnalysisResponse {
  issues: Issue[];
  overallRisk: OverallRisk;
  summary: string;
}

export interface ScoreRequest {
  userAssessment: string;
  issues: Issue[];
}

export interface ScoreResponse {
  caught: string[];
  missed: string[];
  uniqueFinds: string[];
  catchRate: number;
  feedback: string;
}

export interface Session {
  id: string;
  timestamp: string;
  contentType: ContentType;
  totalIssues: number;
  caught: number;
  missed: number;
  uniqueFinds: number;
  catchRate: number;
}

export type Step = "input" | "challenge" | "reveal" | "score";
