import { Session } from "./types";

const STORAGE_KEY = "secondOpinion_sessions";

export function getSessions(): Session[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveSession(session: Session): void {
  const sessions = getSessions();
  sessions.push(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function getProgressFeedback(currentCatchRate: number, currentUniqueFinds: number): string {
  const sessions = getSessions();

  // First session — no history to compare
  if (sessions.length === 0) {
    if (currentCatchRate >= 0.8) return "Impressive start — you caught most issues on your first try.";
    if (currentCatchRate >= 0.5) return "Solid first attempt. Keep going to sharpen your eye.";
    return "Everyone starts somewhere. The more you practice, the more you'll catch.";
  }

  // Recent window: last 3 sessions (or fewer if not enough history)
  const recent = sessions.slice(-3);
  const recentAvg = recent.reduce((sum, s) => sum + s.catchRate, 0) / recent.length;
  const delta = currentCatchRate - recentAvg;
  const deltaPercent = Math.abs(Math.round(delta * 100));

  // Streak: consecutive sessions (including current) with catchRate > 0.5
  let streak = currentCatchRate > 0.5 ? 1 : 0;
  if (streak > 0) {
    for (let i = sessions.length - 1; i >= 0; i--) {
      if (sessions[i].catchRate > 0.5) streak++;
      else break;
    }
  }

  // Build feedback — priority order: unique finds > strong improvement > streak > steady > decline
  if (currentUniqueFinds > 0 && currentCatchRate >= 0.7) {
    return `Outstanding — you caught ${Math.round(currentCatchRate * 100)}% of issues and found ${currentUniqueFinds} thing${currentUniqueFinds > 1 ? "s" : ""} the AI missed. Your judgment is exceeding the machine.`;
  }

  if (currentUniqueFinds > 0) {
    return `You spotted ${currentUniqueFinds} issue${currentUniqueFinds > 1 ? "s" : ""} the AI didn't catch — that's real critical thinking in action.`;
  }

  if (delta > 0.15) {
    return `Your catch rate jumped ${deltaPercent}% compared to your recent average. Your pattern recognition is sharpening.`;
  }

  if (streak >= 5) {
    return `${streak} sessions in a row above 50% — you're building a strong habit of questioning AI output.`;
  }

  if (streak >= 3) {
    return `${streak}-session streak of solid catches. Consistency is where real judgment lives.`;
  }

  if (delta >= 0 && currentCatchRate >= 0.6) {
    return "Holding steady at a strong catch rate. You're reliably spotting what matters.";
  }

  if (delta >= 0) {
    return `Catch rate is trending up — ${deltaPercent > 0 ? `+${deltaPercent}% vs. recent sessions` : "holding steady"}. Keep at it.`;
  }

  if (delta > -0.15) {
    return "Slight dip this round, but your overall trend is solid. Different content types have different traps.";
  }

  return "Tougher round — this is how you grow. Review the issues you missed and try another.";
}

export function getCumulativeStats() {
  const sessions = getSessions();
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      avgCatchRate: 0,
      totalIssuesCaught: 0,
      totalIssuesMissed: 0,
      totalUniqueFinds: 0,
    };
  }

  const totalSessions = sessions.length;
  const avgCatchRate =
    sessions.reduce((sum, s) => sum + s.catchRate, 0) / totalSessions;
  const totalIssuesCaught = sessions.reduce((sum, s) => sum + s.caught, 0);
  const totalIssuesMissed = sessions.reduce((sum, s) => sum + s.missed, 0);
  const totalUniqueFinds = sessions.reduce(
    (sum, s) => sum + s.uniqueFinds,
    0
  );

  return {
    totalSessions,
    avgCatchRate,
    totalIssuesCaught,
    totalIssuesMissed,
    totalUniqueFinds,
  };
}
