import { ContentType, Issue } from "./types";

const CONTENT_TYPE_INSTRUCTIONS: Record<ContentType, string> = {
  code: `You are reviewing AI-generated CODE. Focus on:
- **security_risk**: SQL injection, XSS, command injection, hardcoded secrets, insecure defaults, missing input validation
- **logic_gap**: Off-by-one errors, unhandled edge cases (empty input, null, negative numbers, division by zero), race conditions, incorrect algorithm complexity
- **missing_context**: Missing error handling, no input validation, absent type checks, no documentation of assumptions, missing return values
- **blind_spot**: Performance pitfalls the developer might not notice, deprecated APIs, platform-specific behavior, memory leaks, silent failures
- **factual_risk**: Incorrect API usage, wrong method signatures, outdated syntax, nonexistent functions or libraries

Be technically precise. Point to the exact line or expression that is problematic. Your explanations should teach the developer WHY this is dangerous, not just that it exists.`,

  email: `You are reviewing an AI-generated EMAIL or professional communication. Focus on:
- **unsupported_claim**: Statistics without sources, vague percentages, cherry-picked data, claims presented as fact without evidence
- **tone_mismatch**: Overly confident language for uncertain situations, inappropriate casualness or formality, passive-aggressive phrasing
- **logic_gap**: Conclusions that don't follow from the evidence presented, false causation, survivorship bias, circular reasoning
- **missing_context**: Key stakeholders not addressed, risks not acknowledged, alternative viewpoints omitted, timeline assumptions unstated
- **bias**: Framing that favors one outcome without acknowledging tradeoffs, confirmation bias, anchoring to a single metric
- **blind_spot**: Commitments made without authority, promises that create liability, assumptions about the reader's context

Focus on what could go wrong if someone sends this email without editing it. What decisions might be made incorrectly based on this communication?`,

  analysis: `You are reviewing an AI-generated ANALYSIS or strategic recommendation. Focus on:
- **unsupported_claim**: Market projections without methodology, statistics without sources, comparisons without baselines, correlation presented as causation
- **logic_gap**: Survivorship bias, cherry-picked timeframes, false dichotomies, ignoring base rates, confusing absolute and relative numbers
- **missing_context**: Risks not quantified, alternative strategies not considered, assumptions not stated, stakeholder impacts ignored, second-order effects missing
- **bias**: Anchoring to favorable data, framing effects, sunk cost reasoning, optimism bias, groupthink indicators
- **factual_risk**: Outdated market data, incorrect industry benchmarks, misattributed quotes or studies, wrong competitive landscape
- **blind_spot**: Regulatory risks, market timing assumptions, execution dependencies, single points of failure

Be rigorous. Treat this like a board-level review. Every recommendation should have its assumptions stress-tested.`,

  writing: `You are reviewing AI-generated WRITING (article, essay, blog post, report). Focus on:
- **factual_risk**: Claims that could be false or misleading, statistics without context, oversimplifications of complex topics, outdated information
- **logic_gap**: Non sequiturs, straw man arguments, false equivalences, slippery slope reasoning, begging the question
- **bias**: One-sided framing, loaded language, missing counterarguments, stereotyping, cultural assumptions
- **missing_context**: Important caveats omitted, nuance flattened, expert disagreement not mentioned, scope limitations unstated
- **tone_mismatch**: Authoritative tone on speculative topics, hedging that undermines valid points, inconsistent register
- **blind_spot**: Audience assumptions, accessibility issues, cultural sensitivity, potential for misinterpretation

Focus on what a careful editor would flag. The goal is publishable accuracy and intellectual honesty.`,

  other: `You are reviewing AI-generated content. Apply broad critical thinking:
- **factual_risk**: Anything stated as fact that might be wrong, outdated, or misleading
- **logic_gap**: Reasoning errors, unjustified conclusions, missing steps in logic
- **missing_context**: Important information omitted, assumptions not stated, caveats missing
- **blind_spot**: Things the AI couldn't know or likely got wrong due to training limitations
- **unsupported_claim**: Assertions without evidence or source
- **bias**: One-sided perspectives, loaded framing, missing counterpoints

Be specific and point to exact text. Every issue should teach the reader something about critical evaluation.`,
};

export function getAnalysisPrompt(
  content: string,
  contentType: ContentType,
  source?: string
): string {
  const typeInstructions = CONTENT_TYPE_INSTRUCTIONS[contentType];

  return `You are an expert critical reviewer of AI-generated content. Your purpose is to find problems that a human would likely miss if they accepted this output without scrutiny.

${typeInstructions}

Analyze the following ${contentType} generated by ${source || "an AI tool"}.

RULES:
1. Identify 3-6 specific issues, ordered by severity (most critical first).
2. Each issue MUST reference an EXACT text span from the content — copy it verbatim as "flaggedText".
3. Do NOT fabricate issues. Only flag genuine problems. If the content is unusually good, flag fewer issues with lower severity.
4. Each explanation must be CONCISE — 1-2 sentences MAX. State the problem and the consequence. No rambling, no background paragraphs, no hedge words.
5. Each reframe must be actionable and SHORT — one corrected sentence or specific fix, not a rewritten paragraph.
6. Assign a unique short id to each issue (e.g., "issue-1", "issue-2").

BREVITY IS CRITICAL. Write like a senior reviewer leaving terse, sharp comments — not like an essay. If you can say it in 15 words, do not use 50.

Respond with ONLY valid JSON (no markdown, no code blocks):
{"issues": [{"id": "issue-1", "category": "factual_risk | logic_gap | missing_context | blind_spot | security_risk | tone_mismatch | unsupported_claim | bias", "severity": "critical | moderate | minor", "flaggedText": "exact quote", "explanation": "why this is a problem and what could go wrong", "reframe": "specific corrected version or recommendation"}], "overallRisk": "high | medium | low", "summary": "one-sentence verdict on the content's reliability"}

Content to analyze:
---
${content}
---`;
}

export function getScoringPrompt(
  userAssessment: string,
  issues: Issue[]
): string {
  return `You are an expert evaluator comparing a human's critical assessment against a structured issue analysis of AI-generated content.

CONTEXT:
A human was shown AI-generated content and asked: "What concerns do you have?" BEFORE seeing any automated analysis. They wrote their assessment below. Your job is to fairly evaluate how well they identified the issues.

HUMAN'S ASSESSMENT:
---
${userAssessment}
---

IDENTIFIED ISSUES:
---
${JSON.stringify(issues, null, 2)}
---

SCORING RULES:
1. For each issue, determine if the human's assessment COVERS it. Be generous in matching:
   - Exact match: they describe the same problem clearly → caught
   - Partial match: they mention the area of concern but lack specifics → still counts as caught
   - Thematic match: they raise a related concern that shows awareness of the problem → caught
   - No match: they don't address this area at all → missed
2. Identify UNIQUE FINDS — valid concerns the human raised that are NOT covered by any issue in the list. These must be genuinely valid criticisms, not vague worries. Be generous here too — reward critical thinking.
3. Calculate catchRate as: caught / total issues (float between 0 and 1).
4. Write feedback that is encouraging and specific. Acknowledge what they did well before noting gaps. If they caught everything, celebrate it. If they found unique issues, highlight that their judgment exceeded the automated analysis.

Respond with ONLY valid JSON (no markdown, no code blocks):
{"caught": ["issue-1", "issue-3"], "missed": ["issue-2", "issue-4"], "uniqueFinds": ["description of valid concern 1"], "catchRate": 0.5, "feedback": "one sentence of personalized, encouraging feedback"}`;
}
