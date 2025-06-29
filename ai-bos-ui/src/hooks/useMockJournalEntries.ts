// src/hooks/useMockJournalEntries.ts
import { useEffect, useState } from 'react';

export type EntryStatus = 'draft' | 'pending' | 'posted' | 'voided';

export type JournalEntry = {
  id: string;
  description: string;
  amount: number;
  updatedBy: string;
  source: 'web' | 'api';
  revisionCount: number;
  status: EntryStatus;
};

const LOCAL_KEY = 'ai-bos::journal';

const defaultEntries: JournalEntry[] = [
  {
    id: 'ent-001',
    description: 'Cash deposit',
    amount: 1000,
    updatedBy: 'admin@bos.local',
    source: 'web',
    revisionCount: 3,
    status: 'draft',
  },
  {
    id: 'ent-002',
    description: 'Vendor payment',
    amount: -420.5,
    updatedBy: 'api@automation',
    source: 'api',
    revisionCount: 1,
    status: 'posted',
  },
];

export function useLocalJournalEntries(): [
  JournalEntry[],
  React.Dispatch<React.SetStateAction<JournalEntry[]>>
] {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      setEntries(JSON.parse(raw));
    } else {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(defaultEntries));
      setEntries(defaultEntries);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(entries));
  }, [entries]);

  return [entries, setEntries];
}
