"use client";

import { useEffect, useState } from "react";

interface ScoreRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export function ScoreRing({
  percentage,
  size = 160,
  strokeWidth = 10,
}: ScoreRingProps) {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedPercent / 100) * circumference;

  useEffect(() => {
    // Animate the number counting up
    const duration = 1000;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedPercent(Math.round(eased * percentage));
      if (progress < 1) requestAnimationFrame(tick);
    }
    const delay = setTimeout(() => requestAnimationFrame(tick), 100);
    return () => clearTimeout(delay);
  }, [percentage]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#0a0a0a"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-black">
          {Math.round(animatedPercent)}%
        </span>
        <span className="text-xs text-muted-foreground">catch rate</span>
      </div>
    </div>
  );
}
