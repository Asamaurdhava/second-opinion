"use client";

import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface StepChallengeProps {
  content: string;
  initialAssessment?: string;
  onSubmit: (assessment: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function StepChallenge({
  content,
  initialAssessment = "",
  onSubmit,
  onBack,
  isLoading,
}: StepChallengeProps) {
  const [assessment, setAssessment] = useState(initialAssessment);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Before we analyze this...
          </h1>
          <span className="text-sm font-mono text-muted-foreground tabular-nums">
            {formatTime(elapsed)}
          </span>
        </div>
        <p className="text-muted-foreground text-lg">
          What concerns do <span className="text-black font-semibold">you</span> have?
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 max-h-[300px] overflow-y-auto">
        <pre className="font-mono text-sm whitespace-pre-wrap text-muted-foreground leading-relaxed">
          {content}
        </pre>
      </div>

      <div className="space-y-3">
        <Textarea
          placeholder="What might be wrong? What assumptions is this making? What's missing?"
          value={assessment}
          onChange={(e) => setAssessment(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && assessment.trim() && !isLoading) {
              e.preventDefault();
              onSubmit(assessment);
            }
          }}
          className="min-h-[140px] bg-card border-border text-sm resize-y"
        />
        <p className="text-xs text-muted-foreground/60">
          Think critically. What would you flag if you were reviewing this for
          accuracy?
        </p>
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
          onClick={() => onSubmit(assessment)}
          disabled={!assessment.trim() || isLoading}
          className="flex-1 h-12 text-base font-semibold bg-black hover:bg-neutral-800 text-white rounded-xl transition-all disabled:opacity-30"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </span>
          ) : (
            "Show Me What I Missed"
          )}
        </Button>
      </div>
    </div>
  );
}
