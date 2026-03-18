import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAnalysisPrompt } from "@/lib/prompts";
import { AnalysisRequest, AnalysisResponse } from "@/lib/types";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  try {
    const body: AnalysisRequest = await request.json();

    if (!body.content || !body.contentType) {
      return NextResponse.json(
        { error: "Content and content type are required" },
        { status: 400 }
      );
    }

    const prompt = getAnalysisPrompt(
      body.content,
      body.contentType,
      body.source
    );

    const message = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Extract JSON from the response (handle potential markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse analysis response" },
        { status: 500 }
      );
    }

    const data: AnalysisResponse = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze content" },
      { status: 500 }
    );
  }
}
