'use client';

import { useState } from 'react';
import { CopilotFlag } from '@/context/CopilotFlagContext';
import { JournalEntry } from '@/hooks/useMockJournalEntries';
import { DeclarativeRule } from '@/plugins/evaluateDeclarativeRules';

export const InsightLogPanel = ({ flags, entries }: { flags: CopilotFlag[]; entries: JournalEntry[] }) => {
  const [open, setOpen] = useState(false);
  const [showPriorityOnly, setShowPriorityOnly] = useState(false);

  function needsReview(entry: JournalEntry): boolean {
    const hasAI = flags.some((f) => f.entryId === entry.id && f.status === 'open');
    const hasFeedback = (entry.feedback || []).length > 0;
    return hasAI && hasFeedback;
  }

  const visibleFlags = showPriorityOnly
    ? flags.filter((f) => needsReview(entries.find((e: JournalEntry) => e.id === f.entryId)!))
    : flags;

  const resolvedCount = flags.filter((f) => f.status === 'resolved').length;
  const ignoredCount = flags.filter((f) => f.status === 'dismissed').length;
  const avgTime = Math.round(
    flags
      .filter((f) => f.status === 'resolved' && f.reviewedAt)
      .reduce((acc, f) => acc + (new Date(f.reviewedAt!).getTime() - new Date(f.createdAt).getTime()), 0) /
      resolvedCount || 0
  );

  return (
    <div className="fixed bottom-20 right-4 z-40 text-xs">
      <button
        onClick={() => setOpen((o) => !o)}
        className="bg-purple-600 text-white px-3 py-1 rounded shadow"
      >
        🧠 Copilot Insights ({visibleFlags.length})
      </button>

      {open && (
        <div className="mt-2 w-[320px] bg-white border shadow-lg rounded p-3 space-y-2 max-h-96 overflow-y-auto">
          <h2 className="text-sm font-semibold mb-2">Insights</h2>
          <button
            onClick={() => setShowPriorityOnly((v) => !v)}
            className="text-xs underline"
          >
            {showPriorityOnly ? '🔎 Show All' : '🚩 Needs Review Only'}
          </button>
          {visibleFlags.map((flag) => (
            <div
              key={flag.id}
              className={`border-b pb-2 ${
                flag.status === 'resolved'
                  ? 'bg-green-50'
                  : flag.status === 'dismissed'
                  ? 'bg-red-50'
                  : ''
              }`}
            >
              <div className="font-medium">{flag.message}</div>
              <div className="text-zinc-500">
                Entry: {flag.entryId.slice(-4)} · Status: {flag.status.toUpperCase()}
              </div>
              {flag.reviewedBy && (
                <div className="text-zinc-500 text-xs">
                  Reviewed by {flag.reviewedBy} · {new Date(flag.reviewedAt!).toLocaleString()}
                </div>
              )}
              <div className="pt-1">
                <button className="text-blue-600 underline">Jump to Entry</button>
              </div>
            </div>
          ))}
          <div className="text-xs text-zinc-600 space-y-1 pt-2 border-t mt-2">
            <div>✅ Resolved: {resolvedCount}</div>
            <div>✖ Ignored: {ignoredCount}</div>
            <div>⏱️ Avg. Resolution Time: {avgTime} ms</div>
          </div>
        </div>
      )}
    </div>
  );
};

export const RuleCoveragePanel = ({ rules, entries }: { rules: DeclarativeRule[]; entries: JournalEntry[] }) => {
  const coverageMap = mapEntryToRules(rules, entries);

  const totalEntries = entries.length;
  const coveredEntries = Object.keys(coverageMap).length;
  const coveragePercent = Math.round((coveredEntries / totalEntries) * 100);

  const ruleHitCounts = Object.values(coverageMap).flat().reduce((acc, ruleId) => {
    acc[ruleId] = (acc[ruleId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-zinc-100 border rounded p-4 text-xs space-y-2 mt-4">
      <h2 className="text-sm font-semibold">🔍 Rule Coverage</h2>
      <div>✅ Coverage: <b>{coveragePercent}%</b> ({coveredEntries} of {totalEntries} entries)</div>

      <div>
        <h3 className="text-xs font-medium mt-2 mb-1">📈 Top Hit Rules</h3>
        {Object.entries(ruleHitCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([id, count]) => (
            <div key={id}>{id}: {count} hits</div>
          ))}
      </div>

      <div>
        <h3 className="text-xs font-medium mt-2 mb-1">🫥 Uncovered Entries</h3>
        {entries
          .filter(e => !coverageMap[e.id])
          .slice(0, 3)
          .map(e => (
            <div key={e.id}>• {e.description} (status: {e.status})</div>
          ))}
      </div>
    </div>
  );
};

function mapEntryToRules(rules: DeclarativeRule[], entries: JournalEntry[]): Record<string, string[]> {
  const coverageMap: Record<string, string[]> = {};

  for (const rule of rules.filter(r => r.status === 'active')) {
    for (const entry of entries) {
      const match = applyCondition(entry[rule.field], rule.condition, rule.value);
      if (match) {
        if (!coverageMap[entry.id]) coverageMap[entry.id] = [];
        coverageMap[entry.id].push(rule.id);
      }
    }
  }

  return coverageMap;
}

function applyCondition(a: any, op: string, b: any): boolean {
  switch (op) {
    case 'equals': return a === b;
    case 'not_equals': return a !== b;
    case 'greater_than': return parseFloat(a) > parseFloat(b);
    case 'less_than': return parseFloat(a) < parseFloat(b);
    case 'includes': return typeof a === 'string' && a.includes(b);
    default: return false;
  }
}
