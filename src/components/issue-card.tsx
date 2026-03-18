"use client";

import { Issue } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const SEVERITY_STYLES: Record<string, string> = {
  critical: "bg-black/10 text-black border-black/20",
  moderate: "bg-black/5 text-neutral-600 border-black/10",
  minor: "bg-black/5 text-neutral-500 border-black/10",
};

const CATEGORY_LABELS: Record<string, string> = {
  factual_risk: "Factual Risk",
  logic_gap: "Logic Gap",
  missing_context: "Missing Context",
  blind_spot: "Blind Spot",
  security_risk: "Security Risk",
  tone_mismatch: "Tone Mismatch",
  unsupported_claim: "Unsupported Claim",
  bias: "Bias",
};

interface IssueCardProps {
  issue: Issue;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

export function IssueCard({ issue, index, isActive, onClick }: IssueCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 animate-in fade-in slide-in-from-right-4 ${
        isActive
          ? "border-black/30 bg-black/5"
          : "border-border bg-card hover:border-black/15"
      }`}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Badge
          variant="outline"
          className={`text-xs ${SEVERITY_STYLES[issue.severity]}`}
        >
          {issue.severity}
        </Badge>
        <Badge variant="outline" className="text-xs text-muted-foreground">
          {CATEGORY_LABELS[issue.category] || issue.category}
        </Badge>
      </div>

      <p className="font-mono text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1.5 mb-3 line-clamp-2">
        &ldquo;{issue.flaggedText}&rdquo;
      </p>

      <p className="text-sm mb-2">{issue.explanation}</p>

      <div className="text-sm text-neutral-500 border-t border-border pt-2 mt-2">
        <span className="font-medium text-neutral-700">Better:</span> {issue.reframe}
      </div>
    </div>
  );
}
