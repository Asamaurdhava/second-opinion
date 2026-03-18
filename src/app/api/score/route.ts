import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getScoringPrompt } from "@/lib/prompts";
import { ScoreRequest, ScoreResponse } from "@/lib/types";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  try {
    const body: ScoreRequest = await request.json();

    if (!body.userAssessment || !body.issues) {
      return NextResponse.json(
        { error: "User assessment and issues are required" },
        { status: 400 }
      );
    }

    const prompt = getScoringPrompt(body.userAssessment, body.issues);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse scoring response" },
        { status: 500 }
      );
    }

    const data: ScoreResponse = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Scoring error:", error);
    return NextResponse.json(
      { error: "Failed to score assessment" },
      { status: 500 }
    );
  }
}
