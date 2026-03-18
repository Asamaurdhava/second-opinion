"use client";

import { Issue } from "@/lib/types";

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-black/10 border-b-2 border-black",
  moderate: "bg-black/5 border-b-2 border-black/50",
  minor: "bg-black/5 border-b-2 border-black/25",
};

interface HighlightedTextProps {
  content: string;
  issues: Issue[];
  activeIssueId?: string | null;
  onIssueClick?: (id: string) => void;
}

export function HighlightedText({
  content,
  issues,
  activeIssueId,
  onIssueClick,
}: HighlightedTextProps) {
  const segments: { text: string; issue?: Issue }[] = [];

  const sortedIssues = [...issues]
    .map((issue) => ({
      ...issue,
      index: content.indexOf(issue.flaggedText),
    }))
    .filter((i) => i.index !== -1)
    .sort((a, b) => a.index - b.index);

  let offset = 0;
  for (const issue of sortedIssues) {
    const relativeIndex = content.indexOf(issue.flaggedText, offset);
    if (relativeIndex === -1) continue;

    if (relativeIndex > offset) {
      segments.push({ text: content.slice(offset, relativeIndex) });
    }

    segments.push({
      text: issue.flaggedText,
      issue,
    });

    offset = relativeIndex + issue.flaggedText.length;
  }

  if (offset < content.length) {
    segments.push({ text: content.slice(offset) });
  }

  if (segments.length === 0) {
    segments.push({ text: content });
  }

  return (
    <pre className="font-mono text-sm whitespace-pre-wrap leading-relaxed">
      {segments.map((seg, i) => {
        if (!seg.issue) {
          return (
            <span key={i} className="text-muted-foreground">
              {seg.text}
            </span>
          );
        }

        const isActive = activeIssueId === seg.issue.id;
        return (
          <span
            key={i}
            onClick={() => onIssueClick?.(seg.issue!.id)}
            className={`cursor-pointer transition-all rounded-sm px-0.5 ${
              SEVERITY_COLORS[seg.issue.severity]
            } ${isActive ? "ring-2 ring-black ring-offset-1 ring-offset-background" : ""}`}
          >
            {seg.text}
          </span>
        );
      })}
    </pre>
  );
}
