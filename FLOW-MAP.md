# Second Opinion — How It Works

## The One-Liner
**"Every AI tool gives you an answer. Second Opinion gives you the skill to know when the answer is wrong."**

---

## The Flow (4 Steps)

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌─────────────┐
│  1. INPUT   │────▶│ 2. CHALLENGE │────▶│  3. REVEAL  │────▶│  4. SCORE   │
│             │     │              │     │             │     │             │
│ Paste AI    │     │ "What do YOU │     │ See what AI │     │ Your report │
│ output      │     │  think is    │     │ found wrong │     │ card        │
│             │     │  wrong?"     │     │             │     │             │
└─────────────┘     └──────────────┘     └─────────────┘     └─────────────┘
                     ▲                                        │
                     │          TRY ANOTHER                   │
                     └────────────────────────────────────────┘
```

---

## Step-by-Step with Example

### EXAMPLE INPUT: Professional Email
> An AI-generated email from "Sarah" about Q3 performance, recommending
> accelerating Series B fundraising and 30% hiring increase based on one quarter's data.

---

### Step 1: INPUT
**What the user does:** Pastes AI-generated content, selects content type, clicks "Get a Second Opinion"

**What happens behind the scenes:**
- Content is sent to `/api/analyze` (Claude Opus) immediately
- Analysis runs in background (~15s) while user does Step 2

```
User pastes email ──▶ Selects "Email" ──▶ Clicks Submit
                                              │
                                    ┌─────────┴─────────┐
                                    │  API call starts   │
                                    │  (runs in parallel │
                                    │   with Step 2)     │
                                    └────────────────────┘
```

---

### Step 2: CHALLENGE (The Core Differentiator)
**What the user does:** Writes their own assessment BEFORE seeing any analysis.

**Why this matters:**
This is the step that makes Second Opinion different from every other AI tool.
It forces the user to THINK before being told what to think.

**Example user assessment:**
> "The 100% roadmap completion seems unrealistic — that almost never happens.
> The recommendation to accelerate Series B and hire 30% more seems too
> aggressive based on one quarter. Also 'competitors are struggling' isn't
> backed by any evidence."

**Timer running:** Shows how long the user took to think (e.g., 1:45)

```
User reads content ──▶ Thinks critically ──▶ Writes concerns ──▶ Submits
        │                                                          │
        │◀──── This gap is where judgment gets trained ──────────▶│
```

---

### Step 3: REVEAL
**What the user sees:** The original content with highlighted problem areas + issue cards

**Example issues found by Opus:**

| # | Severity | Category | Flagged Text | Why It's a Problem |
|---|----------|----------|--------------|-------------------|
| 1 | CRITICAL | Logic Gap | "revenue grew by 15%...well ahead of 40% YoY" | Conflates quarter-over-quarter with year-over-year growth. Misleading. |
| 2 | CRITICAL | Blind Spot | "accelerate Series B...increase hiring by 30%" | Major strategic call based on single quarter, possibly without authority |
| 3 | MODERATE | Unsupported | "world-class category" | NPS benchmark not cited, varies by industry |
| 4 | MODERATE | Unsupported | "competitors are struggling" | Zero evidence provided |
| 5 | MODERATE | Missing Context | "CAC dropped to $45" | No LTV ratio, no churn data — CAC alone is meaningless |
| 6 | MODERATE | Bias | "completing 100% of our roadmap" | Were features cut mid-quarter? No quality metrics shown. |

**Risk Level: HIGH**
> "This email uses selectively framed metrics to justify significant strategic
> decisions that could expose the company to substantial financial risk."

```
┌─────────────────────────────┬──────────────────────────────┐
│   ORIGINAL TEXT             │   ISSUE CARDS                │
│                             │                              │
│   "revenue grew by 15%     │   ┌──────────────────────┐   │
│    compared to last         │   │ ■ CRITICAL           │   │
│    quarter, putting us      │   │ Logic Gap            │   │
│    ████████████████████"    │   │ Conflates QoQ vs YoY │   │
│    ▲ highlighted            │   └──────────────────────┘   │
│                             │                              │
│   "competitors are          │   ┌──────────────────────┐   │
│    ██████████████"          │   │ ■ MODERATE            │   │
│    ▲ highlighted            │   │ Unsupported Claim    │   │
│                             │   │ Zero evidence        │   │
│                             │   └──────────────────────┘   │
└─────────────────────────────┴──────────────────────────────┘
```

---

### Step 4: SCORE (The Payoff)
**What happens:** User's Step 2 assessment is compared against the issues via `/api/score` (Claude Sonnet)

**Example result:**

```
              ┌──────────────┐
              │              │
              │     50%      │
              │  catch rate  │
              │              │
              └──────────────┘

       "Good instincts."
   You spotted the important ones.
   Here's what slipped through.

┌─────────────────────┐  ┌─────────────────────┐
│ ✓ CAUGHT (3)        │  │ ! MISSED (3)        │
│                     │  │                     │
│ • Series B too      │  │ • QoQ vs YoY        │
│   aggressive        │  │   confusion         │
│ • Competitors claim │  │ • NPS benchmark     │
│   unsupported       │  │   not cited         │
│ • 100% roadmap      │  │ • CAC without       │
│   suspicious        │  │   LTV context       │
└─────────────────────┘  └─────────────────────┘

┌─────────────────────────────────────────────┐
│ ★ YOU FOUND WHAT THE AI DIDN'T              │
│                                             │
│ "One quarter isn't enough data to make      │
│  major strategic decisions"                 │
│                                             │
│ This is human judgment at work.             │
└─────────────────────────────────────────────┘
```

---

## Technical Architecture

```
┌──────────────┐        ┌──────────────────────┐
│   Browser    │        │   Next.js Server     │
│              │        │                      │
│  React SPA   │───────▶│  /api/analyze        │──────▶ Claude Opus
│  (4 steps)   │        │  (deep analysis)     │        (accuracy)
│              │        │                      │
│  LocalStorage│───────▶│  /api/score          │──────▶ Claude Sonnet
│  (sessions)  │        │  (fast scoring)      │        (speed)
│              │        │                      │
└──────────────┘        └──────────────────────┘

No database. No auth. Session-based. LocalStorage only.
```

---

## What Makes It Different

| Other AI Tools | Second Opinion |
|----------------|---------------|
| Give you answers | Trains you to question answers |
| Make you faster | Makes you sharper |
| Replace judgment | Build judgment |
| Output-focused | Skill-focused |
| No feedback loop | Measurable improvement (catch rate %) |

---

## The Metric That Proves It Works

```
Session 1:  catch rate 33%  ████░░░░░░░░
Session 2:  catch rate 40%  █████░░░░░░░
Session 3:  catch rate 55%  ███████░░░░░
Session 4:  catch rate 60%  ████████░░░░
Session 5:  catch rate 75%  ██████████░░
                            ▲
                            Your judgment is improving.
```

The catch rate percentage across sessions is a **direct, quantifiable measure
of judgment improvement** — exactly what the track asks for.

---

## Content Types Supported

| Type | Example | What It Catches |
|------|---------|-----------------|
| **Code** | Python function, SQL query | Bugs, security holes, edge cases, missing error handling |
| **Email** | Business communication | Unsupported claims, tone issues, hidden commitments |
| **Analysis** | Market research, strategy doc | Cherry-picked data, survivorship bias, missing risks |
| **Writing** | Blog post, essay, report | Factual errors, logical fallacies, missing counterarguments |
| **Other** | Anything AI-generated | General critical thinking review |

---

## 60-Second Pitch Script

> **Problem (10s):**
> "7 out of 10 people copy-paste AI output without changing a word.
> We're building a generation that trusts machines more than their own judgment."
>
> **Solution (10s):**
> "Second Opinion is a workout for your brain.
> Paste AI content, tell us what YOU think is wrong, then see how you did."
>
> **Demo (30s):**
> [Live demo — paste email, write assessment, show reveal, show score]
>
> **Why it matters (10s):**
> "Every other AI tool makes you faster. Ours makes you sharper.
> And we can prove it — your catch rate goes up with every session."
