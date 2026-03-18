import Link from "next/link";

const STEPS = [
  {
    number: "01",
    title: "Paste",
    headline: "Drop in AI-generated content",
    description:
      "Code, emails, analysis, writing — anything an AI produced. Pick a content type and hit submit.",
    detail: "We support ChatGPT, Copilot, Claude, Gemini, or any other AI tool.",
  },
  {
    number: "02",
    title: "Question",
    headline: "Write what YOU think is wrong",
    description:
      "Before we show you anything, you tell us your concerns. This is the step that builds judgment — you think first, not the machine.",
    detail:
      "This is the core differentiator. No other tool asks you to think before giving you the answer.",
  },
  {
    number: "03",
    title: "Reveal",
    headline: "See what deep analysis found",
    description:
      "Our AI reviewer (Claude Opus) identifies 3-6 specific issues — exact text spans, explanations, and suggested fixes. Highlighted inline on the original content.",
    detail:
      "Issues are categorized: Logic Gap, Factual Risk, Missing Context, Blind Spot, Unsupported Claim, Bias, Security Risk, Tone Mismatch.",
  },
  {
    number: "04",
    title: "Score",
    headline: "See how your judgment stacks up",
    description:
      "Your Step 2 assessment is compared against the analysis. You get a catch rate, see what you caught, what you missed, and — the best part — what you found that the AI didn't.",
    detail:
      "Your catch rate improves over sessions. That's measurable judgment growth.",
  },
];

const EXAMPLE_WALKTHROUGH = {
  input: `Subject: Q3 Performance Review

Hi Team,

Our revenue grew by 15% compared to last quarter, putting us well ahead of our annual target of 40% YoY growth.

Key highlights:
- Customer acquisition cost dropped to $45
- Net Promoter Score increased to 72, "world-class" category
- We shipped 23 features, completing 100% of our roadmap

I recommend we accelerate our Series B timeline and increase hiring targets by 30% across all departments. Competitors are struggling.

Best regards, Sarah`,
  userAssessment: `"The 100% roadmap completion seems unrealistic. The Series B recommendation feels too aggressive for one quarter of data. 'Competitors are struggling' has no evidence."`,
  issues: [
    {
      severity: "CRITICAL",
      category: "Logic Gap",
      text: "15% QoQ ≠ 40% YoY",
      caught: false,
    },
    {
      severity: "CRITICAL",
      category: "Blind Spot",
      text: "Series B + 30% hiring — major call, one quarter of data",
      caught: true,
    },
    {
      severity: "MODERATE",
      category: "Unsupported",
      text: '"World-class" NPS — no benchmark cited',
      caught: false,
    },
    {
      severity: "MODERATE",
      category: "Unsupported",
      text: '"Competitors are struggling" — zero evidence',
      caught: true,
    },
    {
      severity: "MODERATE",
      category: "Missing Context",
      text: "CAC of $45 — no LTV ratio given",
      caught: false,
    },
    {
      severity: "MODERATE",
      category: "Bias",
      text: "100% roadmap — were features cut? No quality metrics",
      caught: true,
    },
  ],
  uniqueFind:
    "One quarter isn't enough data to make major strategic decisions",
  catchRate: 50,
};

export default function HowItWorks() {
  const caught = EXAMPLE_WALKTHROUGH.issues.filter((i) => i.caught).length;
  const total = EXAMPLE_WALKTHROUGH.issues.length;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
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
        <div className="max-w-3xl mx-auto space-y-20">
          {/* Hero */}
          <div className="text-center space-y-4">
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60">
              How It Works
            </p>
            <h1 className="text-4xl font-bold tracking-tight">
              Four steps to sharper judgment
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Every other AI tool gives you an answer. Second Opinion gives you
              the skill to know when the answer is wrong.
            </p>
          </div>

          {/* 4 Steps */}
          <div className="space-y-12">
            {STEPS.map((step, i) => (
              <div key={step.number} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <span className="w-12 h-12 rounded-full bg-black text-white text-lg font-bold flex items-center justify-center shrink-0">
                    {step.number}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div className="w-px flex-1 bg-neutral-200 mt-3" />
                  )}
                </div>
                <div className="pb-12 space-y-2">
                  <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground/50">
                    {step.title}
                  </p>
                  <h2 className="text-2xl font-bold">{step.headline}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  <p className="text-sm text-muted-foreground/60 italic">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Example Walkthrough */}
          <div className="space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">
                See it in action
              </h2>
              <p className="text-muted-foreground">
                Here&apos;s a real example using an AI-generated email
              </p>
            </div>

            {/* The input */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-sm font-semibold uppercase tracking-wide">
                  The AI-generated email
                </h3>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <pre className="font-mono text-sm whitespace-pre-wrap text-muted-foreground leading-relaxed">
                  {EXAMPLE_WALKTHROUGH.input}
                </pre>
              </div>
            </div>

            {/* The user's assessment */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="text-sm font-semibold uppercase tracking-wide">
                  What the user wrote
                </h3>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <p className="text-sm italic text-muted-foreground leading-relaxed">
                  {EXAMPLE_WALKTHROUGH.userAssessment}
                </p>
              </div>
            </div>

            {/* The reveal */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="text-sm font-semibold uppercase tracking-wide">
                  What the analysis found
                </h3>
              </div>
              <div className="space-y-2">
                {EXAMPLE_WALKTHROUGH.issues.map((issue, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-xl p-4 flex items-start gap-3"
                  >
                    <span
                      className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${
                        issue.severity === "CRITICAL"
                          ? "bg-black text-white"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {issue.severity}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground/50 uppercase tracking-wide">
                        {issue.category}
                      </span>
                      <p className="text-sm mt-0.5">{issue.text}</p>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                        issue.caught
                          ? "bg-black/5 text-black"
                          : "bg-neutral-50 text-neutral-400"
                      }`}
                    >
                      {issue.caught ? "Caught" : "Missed"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* The score */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <h3 className="text-sm font-semibold uppercase tracking-wide">
                  The scorecard
                </h3>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{EXAMPLE_WALKTHROUGH.catchRate}%</p>
                    <p className="text-sm text-muted-foreground">catch rate</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      {caught} of {total} issues
                    </p>
                    <p className="text-sm text-muted-foreground">identified</p>
                  </div>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2">
                  <div
                    className="bg-black h-2 rounded-full"
                    style={{ width: `${EXAMPLE_WALKTHROUGH.catchRate}%` }}
                  />
                </div>
              </div>

              {/* Unique find */}
              <div className="bg-black text-white rounded-xl p-5 space-y-2">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <span>&#9733;</span> The user found what the AI didn&apos;t
                </p>
                <p className="text-sm text-white/70 pl-5 border-l-2 border-white/20">
                  &ldquo;{EXAMPLE_WALKTHROUGH.uniqueFind}&rdquo;
                </p>
                <p className="text-xs text-white/40">
                  This is human judgment at work. No machine flagged this.
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Why It Matters */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight text-center">
              Why it matters
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-5 space-y-2">
                <p className="text-sm font-semibold">Other AI tools</p>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li>Give you answers</li>
                  <li>Make you faster</li>
                  <li>Replace your judgment</li>
                  <li>No feedback loop</li>
                </ul>
              </div>
              <div className="bg-black text-white rounded-xl p-5 space-y-2">
                <p className="text-sm font-semibold">Second Opinion</p>
                <ul className="text-sm text-white/70 space-y-1.5">
                  <li>Trains you to question answers</li>
                  <li>Makes you sharper</li>
                  <li>Builds your judgment</li>
                  <li>Measurable improvement (catch rate %)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Architecture */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-center">
              Under the hood
            </h2>
            <div className="bg-card border border-border rounded-xl p-6 font-mono text-sm text-muted-foreground">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="w-24 text-right text-xs text-muted-foreground/50">Frontend</span>
                  <span className="flex-1 border-b border-dashed border-border" />
                  <span>Next.js + React + Tailwind</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-24 text-right text-xs text-muted-foreground/50">Analysis</span>
                  <span className="flex-1 border-b border-dashed border-border" />
                  <span>Claude Opus (deep, accurate)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-24 text-right text-xs text-muted-foreground/50">Scoring</span>
                  <span className="flex-1 border-b border-dashed border-border" />
                  <span>Claude Sonnet (fast)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-24 text-right text-xs text-muted-foreground/50">Storage</span>
                  <span className="flex-1 border-b border-dashed border-border" />
                  <span>LocalStorage (no database)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-24 text-right text-xs text-muted-foreground/50">Deploy</span>
                  <span className="flex-1 border-b border-dashed border-border" />
                  <span>Vercel</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-4 pb-8">
            <h2 className="text-2xl font-bold">Ready to test your judgment?</h2>
            <Link
              href="/"
              className="inline-block px-8 py-3 rounded-xl bg-black text-white font-semibold hover:bg-neutral-800 transition-colors"
            >
              Try It Now
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
