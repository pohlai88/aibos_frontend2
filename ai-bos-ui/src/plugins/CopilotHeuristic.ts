import { JournalEntry } from '@/hooks/useMockJournalEntries';

export type SuggestedRule = {
  id: string;
  condition: string; // e.g., "amount > 10000 && !memo"
  rationale: string;
  entryIds: string[];
  recommendedMessage: string;
};

export function detectEmergentPatterns(entries: JournalEntry[]): SuggestedRule[] {
  const highUnmemoed = entries.filter(e => e.amount > 10000 && !e.memo);
  if (highUnmemoed.length >= 3) {
    return [
      {
        id: 'amount-without-memo',
        condition: 'amount > 10000 && !memo',
        rationale: 'Multiple high-value entries lack memos',
        entryIds: highUnmemoed.map(e => e.id),
        recommendedMessage: 'High debit without memo — flag for clarification',
      },
    ];
  }

  return [];
}

export function suggestRulesFromUncovered(entries: JournalEntry[], coverageMap: Record<string, string[]>): SuggestedRule[] {
  const uncovered = entries.filter(e => !coverageMap[e.id]);

  const suggestions: SuggestedRule[] = [];

  const large = uncovered.filter(e => e.amount > 10000);
  if (large.length >= 2) {
    suggestions.push({
      id: 'uncovered-large-amount',
      condition: 'amount > 10000',
      rationale: 'Multiple uncovered drafts with large amounts',
      entryIds: large.map(e => e.id),
      recommendedMessage: 'Flag high-value entries in draft/pending',
    });
  }

  const voided = uncovered.filter(e => e.status === 'voided' && !e.memo);
  if (voided.length >= 1) {
    suggestions.push({
      id: 'uncovered-voided-no-memo',
      condition: 'status == voided && !memo',
      rationale: 'Voided entries without memos are not being evaluated',
      entryIds: voided.map(e => e.id),
      recommendedMessage: 'Voids without memo should be reviewed',
    });
  }

  return suggestions;
}
