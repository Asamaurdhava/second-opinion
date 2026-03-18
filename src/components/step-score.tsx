"use client";

import { useState } from "react";
import { AnalysisResponse, ScoreResponse } from "@/lib/types";
import { ScoreRing } from "@/components/score-ring";
import { Button } from "@/components/ui/button";

interface StepScoreProps {
  analysis: AnalysisResponse;
  score: ScoreResponse;
  progressMessage: string;
  onRestart: () => void;
  onBack: () => void;
}

function buildScorecardText(analysis: AnalysisResponse, score: ScoreResponse): string {
  const lines: string[] = [];
  lines.push("=== Second Opinion — Judgment Scorecard ===");
  lines.push("");
  lines.push(`Catch Rate: ${Math.round(score.catchRate * 100)}% (${score.caught.length} of ${analysis.issues.length} issues)`);
  lines.push("");

  const caught = analysis.issues.filter((i) => score.caught.includes(i.id));
  if (caught.length > 0) {
    lines.push("What you caught:");
    caught.forEach((i) => lines.push(`  + ${i.explanation}`));
    lines.push("");
  }

  const missed = analysis.issues.filter((i) => score.missed.includes(i.id));
  if (missed.length > 0) {
    lines.push("What you missed:");
    missed.forEach((i) => lines.push(`  - ${i.explanation}`));
    lines.push("");
  }

  if (score.uniqueFinds.length > 0) {
    lines.push("What you found that AI didn't:");
    score.uniqueFinds.forEach((f) => lines.push(`  * ${f}`));
    lines.push("");
  }

  lines.push(score.feedback);
  lines.push("");
  lines.push("Try it yourself: secondopinion.vercel.app");
  return lines.join("\n");
}

export function StepScore({ analysis, score, progressMessage, onRestart, onBack }: StepScoreProps) {
  const [copied, setCopied] = useState(false);

  const pct = Math.round(score.catchRate * 100);
  const caughtIssues = analysis.issues.filter((i) =>
    score.caught.includes(i.id)
  );
  const missedIssues = analysis.issues.filter((i) =>
    score.missed.includes(i.id)
  );

  // Verdict based on performance
  const verdict = pct >= 80
    ? { headline: "Sharp eye.", sub: "You caught most of what matters." }
    : pct >= 50
    ? { headline: "Good instincts.", sub: "You spotted the important ones. Here\u2019s what slipped through." }
    : pct >= 25
    ? { headline: "Room to grow.", sub: "You caught some, but several slipped past. That\u2019s what practice is for." }
    : { headline: "Tough round.", sub: "Most issues got past you \u2014 but now you know what to look for next time." };

  function handleCopy() {
    const text = buildScorecardText(analysis, score);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Verdict headline */}
      <div className="text-center space-y-1">
        <h1 className="text-4xl font-bold tracking-tight animate-in fade-in zoom-in-95 duration-700">
          {verdict.headline}
        </h1>
        <p className="text-muted-foreground text-lg">{verdict.sub}</p>
      </div>

      {/* Score ring + summary */}
      <div className="flex flex-col items-center gap-4">
        <ScoreRing percentage={pct} />
        <p className="text-lg">
          You caught{" "}
          <span className="text-black font-bold">{score.caught.length}</span>{" "}
          of{" "}
          <span className="font-bold">{analysis.issues.length}</span> issues
        </p>
      </div>

      {/* Unique finds — hero moment if present */}
      {score.uniqueFinds.length > 0 && (
        <div className="bg-black text-white rounded-xl p-5 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <span className="text-base">&#9733;</span>
            You found what the AI didn&apos;t
          </h3>
          <p className="text-xs text-white/50">
            These are valid concerns you raised that our analysis missed. This is human judgment at work.
          </p>
          {score.uniqueFinds.map((find, i) => (
            <div key={i} className="text-sm text-white/80 pl-5 border-l-2 border-white/20">
              {find}
            </div>
          ))}
        </div>
      )}

      {/* Caught and missed */}
      <div className="space-y-6">
        {caughtIssues.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-xs text-black">
                &#10003;
              </span>
              What you caught
            </h3>
            {caughtIssues.map((issue) => (
              <div
                key={issue.id}
                className="pl-7 text-sm text-muted-foreground"
              >
                <span className="text-foreground">{issue.explanation}</span>
              </div>
            ))}
          </div>
        )}

        {missedIssues.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-neutral-500 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-black/5 flex items-center justify-center text-xs text-neutral-500">
                !
              </span>
              What you missed
            </h3>
            {missedIssues.map((issue) => (
              <div
                key={issue.id}
                className="pl-7 text-sm text-muted-foreground"
              >
                <span className="text-foreground">{issue.explanation}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI feedback */}
      <div className="text-center text-sm text-muted-foreground italic">
        &ldquo;{score.feedback}&rdquo;
      </div>

      {/* Progress feedback */}
      <div className="bg-card border border-border rounded-xl p-4 text-center">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {progressMessage}
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="h-12 px-6 text-sm font-medium rounded-xl"
        >
          Back to Reveal
        </Button>
        <Button
          onClick={handleCopy}
          variant="outline"
          className="h-12 px-6 text-sm font-medium rounded-xl"
        >
          {copied ? "Copied!" : "Copy Scorecard"}
        </Button>
        <Button
          onClick={onRestart}
          className="flex-1 h-12 text-base font-semibold bg-black hover:bg-neutral-800 text-white rounded-xl transition-all"
        >
          Try Another
        </Button>
      </div>
    </div>
  );
}
