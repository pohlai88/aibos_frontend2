// src/utils/exportCSV.ts

import { JournalEntry } from '@/hooks/useMockJournalEntries';

export function generateCSV(entries: JournalEntry[]): string {
  const headers = [
    'ID',
    'Description',
    'Amount',
    'Updated By',
    'Source',
    'Revision Count',
    'Status',
  ];

  const rows = entries.map((entry) => [
    entry.id,
    entry.description,
    entry.amount,
    entry.updatedBy,
    entry.source,
    entry.revisionCount,
    entry.status,
  ]);

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
  return csv;
}
