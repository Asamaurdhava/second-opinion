"use client";

import { useState } from "react";
import {
  AnalysisResponse,
  ContentType,
  ScoreRequest,
  ScoreResponse,
} from "@/lib/types";

export function useAnalysis() {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [score, setScore] = useState<ScoreResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze(
    content: string,
    contentType: ContentType,
    source?: string
  ) {
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, contentType, source }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Analysis failed");
      }
      const data: AnalysisResponse = await res.json();
      setAnalysis(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Analysis failed";
      setError(message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function scoreAssessment(req: ScoreRequest) {
    setIsScoring(true);
    setError(null);
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Scoring failed");
      }
      const data: ScoreResponse = await res.json();
      setScore(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Scoring failed";
      setError(message);
      return null;
    } finally {
      setIsScoring(false);
    }
  }

  function reset() {
    setAnalysis(null);
    setScore(null);
    setError(null);
  }

  return {
    analysis,
    score,
    isAnalyzing,
    isScoring,
    error,
    analyze,
    scoreAssessment,
    reset,
  };
}
