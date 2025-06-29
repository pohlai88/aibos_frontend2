// src/utils/sessionSnapshot.ts

import { JournalEntry } from '@/hooks/useMockJournalEntries';
import { UXPolicy } from '@/policy/types';

export type SnapshotPayload = {
  timestamp: string;
  role: string;
  origin: string;
  filters: Record<string, string>;
  policy: UXPolicy;
  entries: JournalEntry[];
};

export function createSnapshot({
  role,
  origin,
  filters,
  policy,
  entries,
}: Omit<SnapshotPayload, 'timestamp'>): string {
  const snapshot: SnapshotPayload = {
    timestamp: new Date().toISOString(),
    role,
    origin,
    filters,
    policy,
    entries,
  };

  return JSON.stringify(snapshot, null, 2);
}

export async function importSnapshot(file: File): Promise<SnapshotPayload> {
  const text = await file.text();
  const data = JSON.parse(text);
  return data;
}
