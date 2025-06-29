import { JournalEntry, EntryStatus } from '@/hooks/useMockJournalEntries';
import { CopilotFlag } from '@/context/CopilotFlagContext';

export type RuleHistory = {
  version: number;
  timestamp: string;
  actor: string;
  comment?: string;
  snapshot: DeclarativeRule;
};

export type DeclarativeRule = {
  id: string;
  field: keyof JournalEntry;
  condition: 'equals' | 'greater_than' | 'less_than' | 'includes' | 'not_equals';
  value: any;
  message: string;
  domain: 'audit' | 'ops' | 'risk' | 'fraud';
  tags?: string[];
  owner: string;
  createdAt: string;
  status: 'active' | 'inactive';
  version: number;
  history: RuleHistory[];
};

export function evaluateDeclarativeRules(
  rules: DeclarativeRule[],
  entries: JournalEntry[]
): CopilotFlag[] {
  return rules.flatMap((rule) =>
    entries
      .filter((e) =>
        (!rule.appliesToStatus || rule.appliesToStatus.includes(e.status)) &&
        applyCondition(e[rule.field], rule.condition, rule.value)
      )
      .map((e) => ({
        id: `json::${rule.id}::${e.id}`,
        entryId: e.id,
        message: rule.message,
        status: 'open',
        createdAt: new Date().toISOString(),
      }))
  );
}

function applyCondition(a: any, op: string, b: any): boolean {
  switch (op) {
    case 'equals': return a === b;
    case 'not_equals': return a !== b;
    case 'greater_than': return parseFloat(a) > parseFloat(b);
    case 'less_than': return parseFloat(a) < parseFloat(b);
    case 'includes': return typeof a === 'string' && a.includes(b);
    default: return false;
  }
}

export function extractField(condition: string): keyof JournalEntry {
  return condition.split(' ')[0] as keyof JournalEntry;
}

export function extractCondition(condition: string): 'equals' | 'greater_than' | 'less_than' | 'includes' | 'not_equals' {
  const validConditions = ['equals', 'greater_than', 'less_than', 'includes', 'not_equals'];
  const extracted = condition.split(' ')[1];
  return validConditions.includes(extracted) ? (extracted as 'equals' | 'greater_than' | 'less_than' | 'includes' | 'not_equals') : 'equals';
}

export function extractValue(condition: string): any {
  return condition.split(' ')[2];
}
