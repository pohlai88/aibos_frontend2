// src/app/journal/page.tsx

'use client';

import { JournalTable } from '@/components/Journal/JournalTable';
import { useLocalJournalEntries, EntryStatus, JournalEntry } from '@/hooks/useMockJournalEntries';
import { Suspense, useState } from 'react';
import { DevResetButton } from '@/components/DevTools/DevResetButton';
import { CreateEntryDialog } from '@/components/Journal/CreateEntryDialog';
import { generateCSV } from '@/utils/exportCSV';
import { DevSnapshotLoader } from '@/components/DevTools/DevSnapshotLoader';
import { SnapshotPayload } from '@/utils/sessionSnapshot';

function handleExportCSV(filteredEntries: JournalEntry[]) {
  const csv = generateCSV(filteredEntries);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'journal-entries.csv';
  link.click();
}

export default function JournalPage() {
  const [entries, setEntries] = useLocalJournalEntries();
  const [statusFilter, setStatusFilter] = useState<'all' | EntryStatus>('all');

  const filteredEntries = entries.filter((entry) =>
    statusFilter === 'all' ? true : entry.status === statusFilter
  );

  function handleSnapshotLoad(snapshot: SnapshotPayload) {
    setEntries(snapshot.entries);
    if (snapshot.filters) {
      setStatusFilter(snapshot.filters.status as EntryStatus | 'all' || 'all');
    }
  }

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
      <Suspense fallback={<div>Loading...</div>}>
        <JournalTable entries={filteredEntries} />
      </Suspense>
      <CreateEntryDialog setEntries={setEntries} />
      <DevSnapshotLoader onLoad={handleSnapshotLoad} />
    </>
  );
}
