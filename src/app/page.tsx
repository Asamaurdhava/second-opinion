"use client";

import { useState, useCallback } from "react";
import { ContentType, Step, Session } from "@/lib/types";
import { getProgressFeedback } from "@/lib/storage";
import { useAnalysis } from "@/hooks/use-analysis";
import { useSessions } from "@/hooks/use-sessions";
import { StepInput } from "@/components/step-input";
import { StepChallenge } from "@/components/step-challenge";
import { StepReveal } from "@/components/step-reveal";
import { StepScore } from "@/components/step-score";
import { SessionStats } from "@/components/session-stats";

export default function Home() {
  const [step, setStep] = useState<Step>("input");
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState<ContentType>("code");
  const [source, setSource] = useState("");
  const [userAssessment, setUserAssessment] = useState("");
  const [furthestStep, setFurthestStep] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const {
    analysis,
    score,
    isAnalyzing,
    isScoring,
    error,
    analyze,
    scoreAssessment,
    reset,
  } = useAnalysis();
  const { stats, addSession } = useSessions();

  const steps: { key: Step; label: string }[] = [
    { key: "input", label: "Input" },
    { key: "challenge", label: "Challenge" },
    { key: "reveal", label: "Reveal" },
    { key: "score", label: "Score" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  function goToStep(index: number) {
    // Can only go to steps we've already visited
    if (index > furthestStep) return;
    // Don't go to reveal if analysis isn't ready
    if (index === 2 && !analysis) return;
    // Don't go to score if score isn't ready
    if (index === 3 && !score) return;
    setStep(steps[index].key);
  }

  const handleInput = useCallback(
    (newContent: string, type: ContentType, newSource: string) => {
      setContent(newContent);
      setContentType(type);
      setSource(newSource);
      analyze(newContent, type, newSource);
      setStep("challenge");
      setFurthestStep((prev) => Math.max(prev, 1));
    },
    [analyze]
  );

  const handleChallenge = useCallback(
    (assessment: string) => {
      setUserAssessment(assessment);
      setStep("reveal");
      setFurthestStep((prev) => Math.max(prev, 2));
    },
    []
  );

  const handleRevealContinue = useCallback(async () => {
    if (!analysis) return;
    const result = await scoreAssessment({
      userAssessment,
      issues: analysis.issues,
    });

    if (result) {
      // Compute progress feedback BEFORE saving session (so it compares against history)
      const msg = getProgressFeedback(result.catchRate, result.uniqueFinds.length);
      setProgressMessage(msg);

      const session: Session = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        contentType,
        totalIssues: analysis.issues.length,
        caught: result.caught.length,
        missed: result.missed.length,
        uniqueFinds: result.uniqueFinds.length,
        catchRate: result.catchRate,
      };
      addSession(session);
      setStep("score");
      setFurthestStep((prev) => Math.max(prev, 3));
    }
  }, [analysis, userAssessment, contentType, scoreAssessment, addSession]);

  const handleRestart = useCallback(() => {
    setStep("input");
    setContent("");
    setContentType("code");
    setSource("");
    setUserAssessment("");
    setFurthestStep(0);
    setProgressMessage("");
    reset();
  }, [reset]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">
            Second Opinion
          </span>
          <div className="flex items-center gap-1">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center">
                <button
                  type="button"
                  onClick={() => goToStep(i)}
                  disabled={i > furthestStep || (i === 2 && !analysis) || (i === 3 && !score)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i <= currentStepIndex
                      ? "bg-black"
                      : "bg-neutral-300"
                  } ${i <= furthestStep ? "cursor-pointer hover:scale-150" : "cursor-default"}`}
                  title={s.label}
                />
                {i < steps.length - 1 && (
                  <div
                    className={`w-6 h-px mx-1 transition-all duration-300 ${
                      i < currentStepIndex
                        ? "bg-black"
                        : "bg-neutral-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 px-6">
        <div className={`mx-auto ${step === "reveal" ? "max-w-5xl" : "max-w-2xl"} transition-all duration-300`}>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {step === "input" && (
            <StepInput
              initialContent={content}
              initialContentType={contentType}
              initialSource={source}
              onSubmit={handleInput}
            />
          )}

          {step === "challenge" && (
            <StepChallenge
              content={content}
              initialAssessment={userAssessment}
              onSubmit={handleChallenge}
              onBack={() => goToStep(0)}
              isLoading={isAnalyzing}
            />
          )}

          {step === "reveal" && analysis && (
            <StepReveal
              content={content}
              analysis={analysis}
              onContinue={handleRevealContinue}
              onBack={() => goToStep(1)}
            />
          )}

          {step === "reveal" && !analysis && isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 animate-in fade-in duration-300">
              <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              <p className="text-muted-foreground">Analyzing content...</p>
            </div>
          )}

          {step === "score" && analysis && score && (
            <StepScore
              analysis={analysis}
              score={score}
              progressMessage={progressMessage}
              onRestart={handleRestart}
              onBack={() => goToStep(2)}
            />
          )}

          {step === "score" && isScoring && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 animate-in fade-in duration-300">
              <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              <p className="text-muted-foreground">Scoring your assessment...</p>
            </div>
          )}
        </div>
      </main>

      <SessionStats stats={stats} />
    </div>
  );
}
