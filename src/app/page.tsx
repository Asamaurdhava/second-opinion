"use client";

import { useState, useCallback, useEffect } from "react";
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

  // Keyboard shortcuts: Escape to go back
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't capture if user is typing in an input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "TEXTAREA" || tag === "INPUT") return;

      if (e.key === "Escape") {
        e.preventDefault();
        if (step === "challenge") goToStep(0);
        else if (step === "reveal") goToStep(1);
        else if (step === "score") goToStep(2);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

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
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse" />
                <div className="h-4 w-96 bg-neutral-100 rounded animate-pulse" />
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-full bg-neutral-100 rounded animate-pulse" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-3 bg-neutral-100 rounded animate-pulse" style={{ width: `${85 - i * 8}%`, animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-2 animate-pulse" style={{ animationDelay: `${i * 200}ms` }}>
                      <div className="flex gap-2">
                        <div className="h-5 w-16 bg-neutral-200 rounded-full" />
                        <div className="h-5 w-20 bg-neutral-100 rounded-full" />
                      </div>
                      <div className="h-3 w-full bg-neutral-100 rounded" />
                      <div className="h-3 w-3/4 bg-neutral-100 rounded" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 pt-4">
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Deep analysis in progress...</p>
              </div>
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
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="space-y-2 text-center">
                <div className="h-8 w-56 bg-neutral-200 rounded animate-pulse mx-auto" />
                <div className="h-4 w-80 bg-neutral-100 rounded animate-pulse mx-auto" />
              </div>
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-neutral-200 animate-pulse" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-neutral-100 rounded animate-pulse mx-auto" style={{ width: `${70 - i * 10}%`, animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Comparing your assessment...</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <SessionStats stats={stats} />
    </div>
  );
}
