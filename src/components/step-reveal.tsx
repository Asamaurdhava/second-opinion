"use client";

import { useState } from "react";
import { AnalysisResponse } from "@/lib/types";
import { HighlightedText } from "@/components/highlighted-text";
import { IssueCard } from "@/components/issue-card";
import { Button } from "@/components/ui/button";

const RISK_MESSAGES: Record<string, { label: string; message: string }> = {
  high: {
    label: "High Risk",
    message:
      "This content has significant issues that could lead to incorrect decisions, security vulnerabilities, or misleading outcomes if used as-is. Careful review is strongly recommended before acting on it.",
  },
  medium: {
    label: "Medium Risk",
    message:
      "This content has notable gaps and assumptions that could cause problems in certain contexts. Review the flagged issues below before relying on it.",
  },
  low: {
    label: "Low Risk",
    message:
      "This content is mostly sound, but has minor issues worth being aware of. Good practice to review before using.",
  },
};

interface StepRevealProps {
  content: string;
  analysis: AnalysisResponse;
  onContinue: () => void;
  onBack: () => void;
}

export function StepReveal({
  content,
  analysis,
  onContinue,
  onBack,
}: StepRevealProps) {
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);
  const risk = RISK_MESSAGES[analysis.overallRisk] || RISK_MESSAGES.medium;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">The Reveal</h1>
        <p className="text-muted-foreground">
          {analysis.summary}
        </p>
      </div>

      {/* Risk banner */}
      <div className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
        <span className="shrink-0 mt-0.5 text-sm font-semibold bg-black text-white px-2.5 py-0.5 rounded-full">
          {risk.label}
        </span>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {risk.message}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5 max-h-[500px] overflow-y-auto">
          <HighlightedText
            content={content}
            issues={analysis.issues}
            activeIssueId={activeIssueId}
            onIssueClick={setActiveIssueId}
          />
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {analysis.issues.map((issue, i) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              index={i}
              isActive={activeIssueId === issue.id}
              onClick={() =>
                setActiveIssueId(
                  activeIssueId === issue.id ? null : issue.id
                )
              }
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="h-12 px-6 text-sm font-medium rounded-xl"
        >
          Back
        </Button>
        <Button
          onClick={onContinue}
          className="flex-1 h-12 text-base font-semibold bg-black hover:bg-neutral-800 text-white rounded-xl transition-all"
        >
          See My Score
        </Button>
      </div>
    </div>
  );
}
