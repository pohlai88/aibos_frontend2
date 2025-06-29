import { JournalEntry } from '@/hooks/useMockJournalEntries';
import { CopilotFlag } from '@/context/CopilotFlagContext';

export type CopilotRule = {
  id: string;
  description: string;
  evaluate: (entries: JournalEntry[]) => CopilotFlag[];
};

export const ruleNoVoidWithoutNote: CopilotRule = {
  id: 'no-void-without-note',
  description: 'Voided entries must include a reason note for traceability.',
  evaluate: (entries) =>
    entries
      .filter((e) => e.status === 'voided' && !e.auditTrail?.some(ev => ev.note))
      .map((e) => ({
        id: `rule::voidnote::${e.id}`,
        message: 'Voided entry lacks reason note',
        entryId: e.id,
        status: 'open',
        createdAt: new Date().toISOString(),
      })),
};

const copilotRules: CopilotRule[] = [
  ruleNoVoidWithoutNote,
  // Add more rules here
];

export function evaluateCopilotRules(entries: JournalEntry[]): CopilotFlag[] {
  return copilotRules.flatMap(rule => rule.evaluate(entries));
}
