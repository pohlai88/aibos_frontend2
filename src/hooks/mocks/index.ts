// src/hooks/mocks/index.ts
export { useMockJournalEntries, type MockJournalEntry } from './useMockJournalEntries';
export { useMockRules, type MockRule } from './useMockRules';
export { useMockBalanceSheet, type MockBalanceSheet, type BalanceSheetItem } from './useMockBalanceSheet';
export { useMockIncomeStatement, type MockIncomeStatement, type IncomeStatementItem } from './useMockIncomeStatement';
export { useMockTimelineEvents, type MockTimelineEvent } from './useMockTimelineEvents';

// Re-export mock data for direct access if needed
export { mockJournalEntries } from '@/mocks/journalEntries';
export { mockRules } from '@/mocks/rules';
export { mockBalanceSheet } from '@/mocks/balanceSheet';
export { mockIncomeStatement } from '@/mocks/incomeStatement';
export { mockFlags } from '@/mocks/flags';
export { mockTimelineEvents } from '@/mocks/timelineEvents';
