"use client";

import { useState, useEffect, useCallback } from "react";
import { Session } from "@/lib/types";
import { getSessions, saveSession, getCumulativeStats } from "@/lib/storage";

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    avgCatchRate: 0,
    totalIssuesCaught: 0,
    totalIssuesMissed: 0,
    totalUniqueFinds: 0,
  });

  useEffect(() => {
    setSessions(getSessions());
    setStats(getCumulativeStats());
  }, []);

  const addSession = useCallback((session: Session) => {
    saveSession(session);
    setSessions(getSessions());
    setStats(getCumulativeStats());
  }, []);

  return { sessions, stats, addSession };
}
