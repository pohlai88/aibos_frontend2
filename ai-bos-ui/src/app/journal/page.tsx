// src/app/journal/page.tsx

'use client';

import { JournalTable } from '@/components/Journal/JournalTable';
import { useLocalJournalEntries, EntryStatus, JournalEntry } from '@/hooks/useMockJournalEntries';
import { Suspense, useEffect, useState } from 'react';
import { DevResetButton } from '@/components/DevTools/DevResetButton';
import { CreateEntryDialog } from '@/components/Journal/CreateEntryDialog';
import { generateCSV } from '@/utils/exportCSV';
import { DevSnapshotLoader } from '@/components/DevTools/DevSnapshotLoader';
import { SnapshotPayload } from '@/utils/sessionSnapshot';
import { RevisionDrawer } from '@/components/Audit/RevisionDrawer';
import { viewPresets } from '@/utils/viewPresets';
import { useRole } from '@/context/useRole';
import { computeCopilotScore } from '@/utils/computeCopilotScore';
import { ReviewActivitySummary } from '@/components/Assist/ReviewActivitySummary';
import { evaluateCopilotRules } from '@/plugins/copilotRules';

function handleExportCSV(filteredEntries: JournalEntry[]) {
  const csv = generateCSV(filteredEntries);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'journal-entries.csv';
  link.click();
}

const defaultJournalEntry: JournalEntry = {
  id: '0',
  title: 'Default Entry',
  content: 'This is a default journal entry.',
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function JournalPage() {
  const [entries, setEntries] = useLocalJournalEntries();
  const [statusFilter, setStatusFilter] = useState<'all' | EntryStatus>('all');
  const [revisionEntry, setRevisionEntry] = useState<JournalEntry | null>(null);

  const filteredEntries = entries.filter((entry) =>
    statusFilter === 'all' ? true : entry.status === statusFilter
  );

  function handleSnapshotLoad(snapshot: SnapshotPayload) {
    setEntries(snapshot.entries);
    if (snapshot.filters) {
      setStatusFilter(snapshot.filters.status as EntryStatus | 'all' || 'all');
    }
  }

  useEffect(() => {
    const { role } = useRole();
    const preset = viewPresets[role];
    if (preset) {
      setStatusFilter(preset.statusFilter);
      // setSortField(preset.sortField);
      // setSortDirection(preset.sortDirection);
    }
  }, []);

  const score = computeCopilotScore('flags' as any, entries); // Replace 'flags' with the actual flags variable if available

  // Evaluate Copilot rules on entries and set flags
  useEffect(() => {
    const flags = evaluateCopilotRules(entries);
    setCopilotFlags(flags); // Assuming setCopilotFlags is available in context or state
  }, [entries]);

  return (
    <>
      <div className="flex gap-2 pb-2">
        {['all', 'draft', 'pending', 'posted', 'voided'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s as EntryStatus | 'all')}
            className={`text-xs px-2 py-1 rounded border ${
              statusFilter === s
                ? 'bg-blue-100 border-blue-400 text-blue-800'
                : 'bg-white border-zinc-200 text-zinc-500'
            }`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <button
          onClick={() => handleExportCSV(filteredEntries)}
          className="text-xs px-2 py-1 rounded border bg-green-100 border-green-400 text-green-800"
        >
          Export CSV
        </button>
        <DevResetButton setEntries={setEntries} />
      </div>
      <div className="text-sm text-zinc-700 flex items-center gap-2">
        🧠 Copilot Review Score:
        <span
          className={`font-mono px-2 py-1 rounded ${
            score > 85
              ? 'bg-green-100 text-green-800'
              : score > 60
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {score}%
        </span>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <JournalTable entries={filteredEntries} />
      </Suspense>
      <CreateEntryDialog setEntries={setEntries} />
      <DevSnapshotLoader onLoad={handleSnapshotLoad} />
      <RevisionDrawer isOpen={!!revisionEntry} entryId={revisionEntry?.id || ''} onClose={() => setRevisionEntry(null)} />
      <ReviewActivitySummary entries={entries} />
    </>
  );
}
