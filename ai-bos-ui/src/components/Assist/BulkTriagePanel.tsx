'use client';

import { CopilotFlag } from '@/context/CopilotFlagContext';
import { useCopilotFlags } from '@/context/CopilotFlagContext';
import { useState } from 'react';

export const BulkTriagePanel = () => {
  const { flags, updateFlagStatus } = useCopilotFlags();
  const [filter, setFilter] = useState<'all' | 'open' | 'ignored'>('open');

  const filtered = flags.filter((f: CopilotFlag) =>
    filter === 'all' ? true : f.status === filter
  );

  return (
    <div className="fixed bottom-4 left-4 w-[380px] max-h-[80vh] overflow-y-auto bg-white border shadow-lg rounded p-4 z-50 text-xs space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-sm">🧹 Copilot Triage</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
          <option value="open">Open</option>
          <option value="ignored">Ignored</option>
          <option value="all">All</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="italic text-zinc-400">No suggestions to review.</p>
      ) : (
        filtered.map((flag: CopilotFlag) => (
          <div key={flag.id} className="border-b pb-2 space-y-1">
            <div className="text-zinc-800 font-medium">{flag.message}</div>
            <div className="text-zinc-500">Entry: {flag.entryId.slice(-4)}</div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => updateFlagStatus(flag.id, 'resolved')}
                className="underline text-green-700"
              >
                ✅ Resolved
              </button>
              <button
                onClick={() => updateFlagStatus(flag.id, 'dismissed')}
                className="underline text-zinc-500"
              >
                ✖ Ignore
              </button>
              <button className="underline text-blue-600">🔍 View</button>
            </div>
          </div>
        ))
      }
    </div>
  );
};
