// src/hooks/useMockJournalEntries.ts
import { useEffect, useState } from 'react';
import { DeclarativeRule } from '@/plugins/evaluateDeclarativeRules';
import { SuggestedRule } from '@/plugins/CopilotHeuristic';
import { evaluateDeclarativeRules } from '@/plugins/evaluateDeclarativeRules';

export type EntryStatus = 'draft' | 'pending' | 'posted' | 'voided';

export type AuditEvent = {
  type: 'create' | 'edit' | 'status-change' | 'void' | 'view-revision';
  timestamp: string;
  actor: string;
  note?: string;
  delta?: Record<string, { from: any; to: any }>;
};

export type Revision = {
  before: Partial<JournalEntry>;
  after: Partial<JournalEntry>;
  timestamp: string;
  actor: string;
  note?: string;
};

export type JournalEntry = {
  id: string;
  description: string;
  amount: number;
  updatedBy: string;
  source: 'web' | 'api';
  revisionCount: number;
  status: EntryStatus;
  auditTrail: AuditEvent[];
  revisions?: Revision[];
  feedback?: string[]; // Added feedback property
  memo?: string; // Added memo property
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
    auditTrail: [],
  },
  {
    id: 'ent-002',
    description: 'Vendor payment',
    amount: -420.5,
    updatedBy: 'api@automation',
    source: 'api',
    revisionCount: 1,
    status: 'posted',
    auditTrail: [],
  },
];

export function useLocalJournalEntries(): [
  JournalEntry[],
  React.Dispatch<React.SetStateAction<JournalEntry[]>>
] {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  // Load journal entries from LocalStorage on initialization
  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      try {
        setEntries(JSON.parse(raw));
      } catch (e) {
        console.warn('Invalid journal entry data');
      }
    } else {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(defaultEntries));
      setEntries(defaultEntries);
    }
  }, []);

  // Persist journal entries to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(entries));
  }, [entries]);

  return [entries, setEntries];
}

export function useSaveJournalEntry(
  userRules: DeclarativeRule[],
  setSuggestedRules: React.Dispatch<React.SetStateAction<SuggestedRule[]>>
): [(entry: JournalEntry) => void] {
  const [entries, setEntries] = useLocalJournalEntries();

  const saveEntry = (entry: JournalEntry) => {
    setEntries((prev) => [...prev, entry]);

    const matched = evaluateDeclarativeRules(
      userRules.filter((r) => r.status === 'active'),
      [entry]
    );

    if (matched.length === 0) {
      const suggestion = generateRuleFromEntry(entry);
      setSuggestedRules((prev) => [...prev, suggestion]);
    }
  };

  return [saveEntry];
}

function generateRuleFromEntry(entry: JournalEntry): SuggestedRule {
  let condition = '';
  let rationale = '';
  let message = '';

  if (entry.amount > 10000) {
    condition = 'amount > 10000';
    rationale = 'High-value entry not covered by any rule';
    message = 'Consider flagging large draft entries';
  } else if (entry.status === 'voided' && !entry.memo) {
    condition = 'status == voided && !memo';
    rationale = 'Voided entry lacks memo and is unevaluated';
    message = 'Require memo for voids';
  }

  return {
    id: `auto::${entry.id}`,
    condition,
    rationale,
    recommendedMessage: message,
    entryIds: [entry.id],
  };
}
