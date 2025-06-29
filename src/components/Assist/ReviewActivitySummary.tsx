'use client';

import { useCopilotFlags } from '@/context/CopilotFlagContext';
import { JournalEntry } from '@/hooks/useMockJournalEntries';
import { computeCopilotScore } from '@/utils/computeCopilotScore';

export const ReviewActivitySummary = ({ entries }: { entries: JournalEntry[] }) => {
  const { flags } = useCopilotFlags();

  const resolved = flags.filter(f => f.status === 'resolved');
  const dismissed = flags.filter(f => f.status === 'dismissed');
  const open = flags.filter(f => f.status === 'open');
  const score = computeCopilotScore(flags, entries);

  const lastReviewed = [...resolved, ...dismissed]
    .sort((a, b) => (b.reviewedAt || '').localeCompare(a.reviewedAt || ''))[0];

  const uncoveredEntries = entries.filter(entry => !resolved.find(flag => flag.entryId === entry.id));
  const highRiskUncovered = uncoveredEntries.filter(entry => ['draft', 'pending'].includes(entry.status));

  return (
    <div className="text-xs text-zinc-600 bg-zinc-50 border-t p-2 px-3 flex justify-between items-center">
      <div className="space-x-4">
        <span>🧠 Suggestions: {flags.length}</span>
        <span>✅ {resolved.length}</span>
        <span>✖ {dismissed.length}</span>
        <span>🟡 {open.length}</span>
        <span>💯 Score: <b>{score}%</b></span>
      </div>
      <span className="text-red-700 ml-4">
        ⚠️ Uncovered: {highRiskUncovered.length}
      </span>
      {lastReviewed && (
        <div className="italic text-[10px] text-zinc-500">
          Last reviewed by {lastReviewed.reviewedBy} at {new Date(lastReviewed.reviewedAt!).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};
