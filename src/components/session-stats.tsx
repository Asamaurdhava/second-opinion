"use client";

interface SessionStatsProps {
  stats: {
    totalSessions: number;
    avgCatchRate: number;
    totalIssuesCaught: number;
    totalUniqueFinds: number;
  };
}

export function SessionStats({ stats }: SessionStatsProps) {
  if (stats.totalSessions === 0) return null;

  return (
    <div className="border-t border-border py-3 px-6 bg-black text-white">
      <div className="max-w-2xl mx-auto flex items-center justify-center gap-6 text-xs">
        <span>
          Sessions: <strong>{stats.totalSessions}</strong>
        </span>
        <span className="w-px h-3 bg-white/20" />
        <span>
          Avg catch rate:{" "}
          <strong>{Math.round(stats.avgCatchRate * 100)}%</strong>
        </span>
        <span className="w-px h-3 bg-white/20" />
        <span>
          Unique finds: <strong>{stats.totalUniqueFinds}</strong>
        </span>
      </div>
    </div>
  );
}
