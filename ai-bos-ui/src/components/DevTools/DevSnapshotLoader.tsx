// src/components/DevTools/DevSnapshotLoader.tsx

'use client';

import { useState } from 'react';
import { importSnapshot } from '@/utils/sessionSnapshot';
import { downloadFile } from '@/utils/exportCSV';
import { DeclarativeRule } from '@/plugins/evaluateDeclarativeRules';
import { CopilotFlag } from '@/context/CopilotFlagContext';
import { JournalEntry } from '@/hooks/useMockJournalEntries';

// Fix type for SnapshotPayload
export type SnapshotPayload = any;

export const DevSnapshotLoader = ({
  onLoad,
}: {
  onLoad: (snapshot: SnapshotPayload) => void;
}) => {
  if (process.env.NODE_ENV !== 'development') return null;
  const [filename, setFilename] = useState<string | null>(null);

  return (
    <div className="fixed bottom-14 right-4 z-50">
      <label className="text-xs text-zinc-600 bg-zinc-100 px-3 py-1 rounded border cursor-pointer">
        📂 Load Snapshot
        <input
          type="file"
          accept=".json"
          hidden
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const snapshot = await importSnapshot(file);
              onLoad(snapshot);
              setFilename(file.name);
            }
          }}
        />
      </label>
      {filename && <div className="text-[10px] mt-1 text-zinc-500">{filename}</div>}
    </div>
  );
};

export const DevExportPanel = ({ rules, flags, entries }: {
  rules: DeclarativeRule[];
  flags: CopilotFlag[];
  entries: JournalEntry[];
}) => {
  return (
    <div className="fixed bottom-20 right-4 z-50">
      <button
        onClick={() => downloadFile('copilot-rules.csv', convertToCSV(rules))}
        className="text-xs text-zinc-600 bg-zinc-100 px-3 py-1 rounded border cursor-pointer"
      >
        ⬇️ Export Rules
      </button>
      <button
        onClick={() => downloadFile('copilot-flags.csv', convertToCSV(flags))}
        className="text-xs text-zinc-600 bg-zinc-100 px-3 py-1 rounded border cursor-pointer"
      >
        ⬇️ Export Flags
      </button>
      <button
        onClick={() => downloadFile('copilot-feedback.csv', convertToCSV(entries.map(e => ({
          entryId: e.id,
          feedback: e.feedback ?? [],
        }))))}
        className="text-xs text-zinc-600 bg-zinc-100 px-3 py-1 rounded border cursor-pointer"
      >
        ⬇️ Export Feedback
      </button>
    </div>
  );
};

function convertToCSV<T extends Record<string, any>>(items: T[]): string {
  if (items.length === 0) return '';
  const headers = Object.keys(items[0]);
  const rows = items.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','));
  return [headers.join(','), ...rows].join('\n');
}
