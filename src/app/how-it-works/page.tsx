"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function HowItWorks() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const [fillPx, setFillPx] = useState(0);
  const [maxPx, setMaxPx] = useState(0);

  useEffect(() => {
    function handleScroll() {
      if (!timelineRef.current || !step4Ref.current) return;
      const timelineRect = timelineRef.current.getBoundingClientRect();
      const step4Rect = step4Ref.current.getBoundingClientRect();
      // Max height = distance from timeline top to center of step 4 circle
      const maxHeight = step4Rect.top - timelineRect.top + step4Rect.height / 2;
      setMaxPx(maxHeight);
      // Fill point is 40% down the viewport
      const triggerY = window.innerHeight * 0.4;
      const scrolled = triggerY - timelineRect.top;
      setFillPx(Math.max(0, Math.min(scrolled, maxHeight)));
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-70 transition-opacity">
            Second Opinion
          </Link>
          <Link
            href="/"
            className="text-sm px-4 py-2 rounded-full bg-black text-white hover:bg-neutral-800 transition-colors"
          >
            Try It Now
          </Link>
        </div>
      </header>

      <main className="flex-1 py-16 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Hero */}
          <div className="text-center space-y-3 mb-16">
            <h1 className="text-4xl font-bold tracking-tight">
              How It Works
            </h1>
            <p className="text-muted-foreground text-lg">
              Four steps. One example. See the whole flow.
            </p>
          </div>

          {/* Timeline container */}
          <div ref={timelineRef} className="relative pl-[52px]">
            {/* Background line — stops at step 4 circle center */}
            <div className="absolute left-[19px] top-0 w-[2px] bg-neutral-200" style={{ height: `${maxPx}px` }} />
            {/* Glowing fill line — capped at step 4 circle center */}
            <div
              className="absolute left-[19px] top-0 w-[2px] transition-none"
              style={{
                height: `${fillPx}px`,
                background: "linear-gradient(to bottom, #000 60%, rgba(0,0,0,0.6))",
                boxShadow: "0 0 8px rgba(0,0,0,0.3), 0 0 20px rgba(0,0,0,0.15)",
              }}
            />

            {/* Step 1 */}
            <div className="relative pb-16">
              <div className="absolute -left-[52px] w-10 h-10 rounded-full bg-black text-white text-sm font-bold flex items-center justify-center z-10 ring-4 ring-white">
                1
              </div>
              <div className="space-y-3">
                <div>
                  <h2 className="text-xl font-bold">Paste AI-generated content</h2>
                  <p className="text-sm text-muted-foreground">Pick a content type and submit. Optionally tell us which AI made it — the analysis adapts to known weaknesses of each model.</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground/50 mb-2 uppercase tracking-wide">Example: Email by Claude</p>
                  <pre className="font-mono text-xs whitespace-pre-wrap text-muted-foreground leading-relaxed">
{`Subject: Q3 Performance Review

Hi Team,

Our revenue grew by 15% compared to last quarter,
putting us well ahead of our annual target of 40% YoY growth.

Key highlights:
- Customer acquisition cost dropped to $45
- NPS increased to 72, "world-class" category
- We shipped 23 features, completing 100% of our roadmap

I recommend we accelerate our Series B timeline and
increase hiring targets by 30% across all departments.
Competitors are struggling.

Best regards, Sarah`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative pb-16">
              <div className="absolute -left-[52px] w-10 h-10 rounded-full bg-black text-white text-sm font-bold flex items-center justify-center z-10 ring-4 ring-white">
                2
              </div>
              <div className="space-y-3">
                <div>
                  <h2 className="text-xl font-bold">Write what YOU think is wrong</h2>
                  <p className="text-sm text-muted-foreground">Before seeing any analysis. This is the step that builds judgment.</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground/50 mb-2 uppercase tracking-wide">Example: User wrote</p>
                  <p className="text-sm italic text-muted-foreground leading-relaxed">
                    &ldquo;The 100% roadmap completion seems unrealistic. The Series B recommendation
                    feels too aggressive for one quarter of data. &lsquo;Competitors are struggling&rsquo;
                    has no evidence.&rdquo;
                  </p>
                  <p className="text-xs text-muted-foreground/40 mt-3">Time taken: 1:45</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative pb-16">
              <div className="absolute -left-[52px] w-10 h-10 rounded-full bg-black text-white text-sm font-bold flex items-center justify-center z-10 ring-4 ring-white">
                3
              </div>
              <div className="space-y-3">
                <div>
                  <h2 className="text-xl font-bold">See what the analysis found</h2>
                  <p className="text-sm text-muted-foreground">Issues highlighted inline on the original text.</p>
                </div>
                <div className="space-y-2">
                  {[
                    { severity: "CRITICAL", category: "Logic Gap", text: "15% QoQ growth \u2260 being \"well ahead\" of 40% YoY target" },
                    { severity: "CRITICAL", category: "Blind Spot", text: "Accelerate Series B + 30% hiring \u2014 major strategic call from one quarter" },
                    { severity: "MODERATE", category: "Unsupported", text: "\"World-class\" NPS \u2014 no industry benchmark cited" },
                    { severity: "MODERATE", category: "Unsupported", text: "\"Competitors are struggling\" \u2014 zero evidence" },
                    { severity: "MODERATE", category: "Missing Context", text: "CAC of $45 with no LTV ratio \u2014 meaningless alone" },
                    { severity: "MODERATE", category: "Bias", text: "100% roadmap complete \u2014 were features cut? No quality metrics" },
                  ].map((issue, i) => (
                    <div
                      key={i}
                      className="bg-card border border-border rounded-lg p-3 flex items-start gap-3"
                    >
                      <span
                        className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          issue.severity === "CRITICAL"
                            ? "bg-black text-white"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {issue.severity}
                      </span>
                      <div className="min-w-0">
                        <span className="text-[10px] text-muted-foreground/40 uppercase tracking-wide">
                          {issue.category}
                        </span>
                        <p className="text-sm">{issue.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative pb-8">
              <div ref={step4Ref} className="absolute -left-[52px] w-10 h-10 rounded-full bg-black text-white text-sm font-bold flex items-center justify-center z-10 ring-4 ring-white">
                4
              </div>
              <div className="space-y-3">
                <div>
                  <h2 className="text-xl font-bold">See how your judgment stacks up</h2>
                  <p className="text-sm text-muted-foreground">What you caught, what you missed, and what even the AI didn&apos;t find.</p>
                </div>

                {/* Score */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-3xl font-bold">50%</p>
                      <p className="text-sm text-muted-foreground">catch rate</p>
                    </div>
                    <p className="text-lg font-semibold">3 of 6 issues</p>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2">
                    <div className="bg-black h-2 rounded-full" style={{ width: "50%" }} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <p className="font-semibold text-black mb-1">Caught</p>
                      <ul className="text-muted-foreground space-y-1 text-xs">
                        <li>Series B too aggressive</li>
                        <li>Competitors claim unsupported</li>
                        <li>100% roadmap suspicious</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-400 mb-1">Missed</p>
                      <ul className="text-muted-foreground/60 space-y-1 text-xs">
                        <li>QoQ vs YoY confusion</li>
                        <li>NPS benchmark not cited</li>
                        <li>CAC without LTV context</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Unique find */}
                <div className="bg-black text-white rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    <span>&#9733;</span> You found what the AI didn&apos;t
                  </p>
                  <p className="text-sm text-white/70 pl-5 border-l-2 border-white/20">
                    &ldquo;One quarter isn&apos;t enough data to make major strategic decisions&rdquo;
                  </p>
                  <p className="text-xs text-white/40">
                    This is human judgment at work.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-12 pb-8">
            <Link
              href="/"
              className="inline-block px-8 py-3 rounded-xl bg-black text-white font-semibold hover:bg-neutral-800 transition-colors"
            >
              Try It Yourself
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
