"use client";

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

export function StepScore({ analysis, score, progressMessage, onRestart, onBack }: StepScoreProps) {
  const caughtIssues = analysis.issues.filter((i) =>
    score.caught.includes(i.id)
  );
  const missedIssues = analysis.issues.filter((i) =>
    score.missed.includes(i.id)
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Judgment Scorecard
        </h1>
        <p className="text-muted-foreground text-lg">{score.feedback}</p>
      </div>

      <div className="flex justify-center">
        <ScoreRing percentage={Math.round(score.catchRate * 100)} />
      </div>

      <p className="text-center text-lg">
        You caught{" "}
        <span className="text-black font-bold">{score.caught.length}</span>{" "}
        of{" "}
        <span className="font-bold">{analysis.issues.length}</span> issues
      </p>

      {/* Progress feedback */}
      <div className="bg-card border border-border rounded-xl p-4 text-center">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {progressMessage}
        </p>
      </div>

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

        {score.uniqueFinds.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-black flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-xs">
                &#9733;
              </span>
              What you found that AI didn&apos;t
            </h3>
            {score.uniqueFinds.map((find, i) => (
              <div key={i} className="pl-7 text-sm text-muted-foreground">
                <span className="text-foreground">{find}</span>
              </div>
            ))}
          </div>
        )}
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
          onClick={onRestart}
          className="flex-1 h-12 text-base font-semibold bg-black hover:bg-neutral-800 text-white rounded-xl transition-all"
        >
          Try Another
        </Button>
      </div>
    </div>
  );
}
