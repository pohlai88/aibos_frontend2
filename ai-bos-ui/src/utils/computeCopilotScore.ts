import { CopilotFlag } from '@/context/CopilotFlagContext';
import { JournalEntry } from '@/hooks/useMockJournalEntries';

export function computeCopilotScore(flags: CopilotFlag[], entries: JournalEntry[]): number {
  let score = 0;
  let max = flags.length * 1; // each flag worth 1 point

  for (const flag of flags) {
    if (flag.status === 'resolved') score += 1;
    else if (flag.status === 'dismissed') score += 0.5;
  }

  // Penalize dual-flagged entries
  const dualFlags = entries.filter((e) =>
    flags.some((f) => f.entryId === e.id && f.status === 'open') &&
    (e.feedback?.length || 0) > 0
  );
  score -= dualFlags.length;

  return Math.max(0, Math.min(100, Math.round((score / max) * 100)));
}
