// src/components/Journal/JournalTable.tsx

'use client';

import React, { useState } from 'react';
import { RevisionDrawer } from '../Audit/RevisionDrawer';
import { useRole } from '@/context/useRole';
import { JournalTableRow } from './JournalTableRow';
import { JournalEntry } from '@/hooks/useMockJournalEntries';

export const JournalTable: React.FC<{ 
  entries: JournalEntry[];
  setEntries?: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
}> = ({ entries, setEntries }) => {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const { role } = useRole();
  const [sortField, setSortField] = useState<'amount' | 'revisionCount'>('amount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedEntries = [...entries].sort((a, b) => {
    const factor = sortDirection === 'asc' ? 1 : -1;
    if (sortField === 'amount') return (a.amount - b.amount) * factor;
    if (sortField === 'revisionCount') return (a.revisionCount - b.revisionCount) * factor;
    return 0;
  });

  const totalsByStatus = entries.reduce(
    (acc, entry) => {
      acc[entry.status] += entry.amount;
      return acc;
    },
    {
      draft: 0,
      pending: 0,
      posted: 0,
      voided: 0,
    }
  );

  if (!entries.length) {
    return (
      <div className="p-6 text-sm text-zinc-500 bg-zinc-50 border border-dashed border-zinc-200 rounded">
        {role === 'auditor' && (
          <p>
            You do not have access to any journal entries. Check your assigned roles or reach out to
            a system administrator.
          </p>
        )}
        {role === 'finance' && (
          <p>
            No entries found yet. You can start by creating your first journal item once access is
            granted.
          </p>
        )}
        {role === 'admin' && <p>Journal is currently empty. System is ready for data population.</p>}
        {role === 'api-user' && (
          <p>
            No entries available. If you&apos;re integrating via API, check your payload triggers or token
            scopes.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded border border-zinc-200 bg-white shadow-sm overflow-hidden">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-zinc-100 text-zinc-600">
          <tr>
            <th
              className="px-4 py-2 cursor-pointer"
              onClick={() => {
                if (sortField === 'amount') {
                  setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                } else {
                  setSortField('amount');
                  setSortDirection('asc');
                }
              }}
            >
              Amount {sortField === 'amount' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th
              className="px-4 py-2 cursor-pointer"
              onClick={() => {
                if (sortField === 'revisionCount') {
                  setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                } else {
                  setSortField('revisionCount');
                  setSortDirection('asc');
                }
              }}
            >
              Audit Info {sortField === 'revisionCount' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedEntries.map((entry) => (
            <JournalTableRow
              key={entry.id}
              entry={entry}
              onViewRevisions={(id) => {
                const foundEntry = entries.find(e => e.id === id);
                if (foundEntry) setSelectedEntry(foundEntry);
              }}
              onShowRevision={(entry) => setSelectedEntry(entry)}
              setEntries={setEntries || (() => {})}
            />
          ))}
        </tbody>
        <tfoot className="border-t bg-zinc-50 text-sm text-zinc-600">
          <tr>
            <td colSpan={2} className="px-4 py-2 text-right font-medium">
              Totals:
            </td>
            <td className="px-4 py-2">
              Posted: {totalsByStatus.posted.toFixed(2)}
              <br />
              Pending: {totalsByStatus.pending.toFixed(2)}
              <br />
              Draft: {totalsByStatus.draft.toFixed(2)}
              <br />
              Voided: {totalsByStatus.voided.toFixed(2)}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
      {selectedEntry && (
        <RevisionDrawer
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          setEntries={setEntries || (() => {})}
        />
      )}
    </div>
  );
};
