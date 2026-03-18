"use client";

import { useState } from "react";
import { ContentType } from "@/lib/types";
import { EXAMPLES } from "@/lib/examples";
import { Textarea } from "@/components/ui/textarea";

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: "code", label: "Code" },
  { value: "email", label: "Email" },
  { value: "analysis", label: "Analysis" },
  { value: "writing", label: "Writing" },
  { value: "other", label: "Other" },
];

interface StepInputProps {
  initialContent?: string;
  initialContentType?: ContentType;
  initialSource?: string;
  onSubmit: (content: string, contentType: ContentType, source: string) => void;
}

export function StepInput({
  initialContent = "",
  initialContentType = "code",
  initialSource = "",
  onSubmit,
}: StepInputProps) {
  const [content, setContent] = useState(initialContent);
  const [contentType, setContentType] = useState<ContentType>(initialContentType);
  const [source, setSource] = useState(initialSource);

  function loadExample(index: number) {
    const ex = EXAMPLES[index];
    setContent(ex.content);
    setContentType(ex.contentType);
    setSource(ex.source);
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-3 text-center">
        <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60">
          Train your AI judgment
        </p>
        <h1 className="text-4xl font-bold tracking-tight">
          You don&apos;t need a better AI.
          <br />
          <span className="text-black">You need a second opinion.</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          Paste AI-generated content. Spot the issues yourself. Then see what you caught, what you missed, and what even the AI didn&apos;t find.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground self-center">
          Try an example:
        </span>
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            onClick={() => loadExample(i)}
            className="text-sm px-3 py-1.5 rounded-full border border-border hover:border-black/40 hover:text-black transition-colors"
          >
            {ex.label}
          </button>
        ))}
      </div>

      <Textarea
        placeholder="Paste AI-generated content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && content.trim()) {
            e.preventDefault();
            onSubmit(content, contentType, source);
          }
        }}
        className="min-h-[200px] font-mono text-sm bg-card border-border resize-y"
      />

      <div className="space-y-3">
        <label className="text-sm text-muted-foreground">Content type</label>
        <div className="flex flex-wrap gap-2">
          {CONTENT_TYPES.map((ct) => (
            <button
              key={ct.value}
              onClick={() => setContentType(ct.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                contentType === ct.value
                  ? "bg-black text-white"
                  : "border border-border hover:border-black/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              {ct.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">
          What AI generated this?{" "}
          <span className="text-muted-foreground/50">(optional)</span>
        </label>
        <input
          type="text"
          placeholder="ChatGPT, Copilot, Claude, etc."
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
        />
      </div>

      <button
        type="button"
        onClick={() => onSubmit(content, contentType, source)}
        disabled={!content.trim()}
        className="w-full h-12 text-base font-semibold rounded-xl transition-all cursor-pointer hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed relative z-10"
        style={{ backgroundColor: "#0a0a0a", color: "#ffffff" }}
      >
        Get a Second Opinion
      </button>
      <p className="text-xs text-center text-muted-foreground/50">
        Press <kbd className="px-1.5 py-0.5 bg-neutral-100 border border-border rounded text-[10px] font-mono">Cmd+Enter</kbd> to submit
      </p>
    </div>
  );
}
