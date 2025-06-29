'use client';

import { useState, useEffect } from 'react';
import { JournalEntry } from '@/hooks/useMockJournalEntries';

type Props = {
  entry: JournalEntry;
  onClose: () => void;
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
};

export const RevisionDrawer = ({ entry, onClose, setEntries }: Props) => {
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    if (!entry) return;

    setEntries((prev: JournalEntry[]) =>
      prev.map((e: JournalEntry) =>
        e.id === entry.id
          ? {
              ...e,
              auditTrail: [
                ...e.auditTrail,
                {
                  type: 'view-revision',
                  actor: 'auditor@bos.local',
                  timestamp: new Date().toISOString(),
                  note: 'Viewed revision history drawer',
                },
              ],
            }
          : e
      )
    );
  }, [entry]);

  if (!entry.revisions || entry.revisions.length === 0) return null;
  const rev = entry.revisions[selectedIdx];

  return (
    <div className="fixed right-0 top-0 h-full w-[600px] bg-white shadow-xl border-l border-zinc-200 p-4 z-50 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2">
        Revision History: <span className="text-zinc-500">{entry.description}</span>
      </h2>

      <div className="flex gap-2 text-xs pb-2">
        {entry.revisions.map((r, i) => (
          <button
            key={i}
            onClick={() => setSelectedIdx(i)}
            className={`px-2 py-1 rounded border ${
              i === selectedIdx
                ? 'bg-zinc-800 text-white'
                : 'bg-white border-zinc-300 text-zinc-600'
            }`}
          >
            {new Date(r.timestamp).toLocaleTimeString()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div>
          <p className="text-zinc-500 font-semibold mb-1">Before</p>
          <pre className="bg-zinc-50 border rounded p-2 overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(rev.before, null, 2)}
          </pre>
        </div>
        <div>
          <p className="text-zinc-500 font-semibold mb-1">After</p>
          <pre className="bg-blue-50 border rounded p-2 overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(rev.after, null, 2)}
          </pre>
        </div>
      </div>

      <div className="pt-4 text-right">
        <button onClick={onClose} className="text-sm text-blue-600 hover:underline">
          Close
        </button>
      </div>
    </div>
  );
};
