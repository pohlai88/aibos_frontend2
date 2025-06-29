import React, { useState } from 'react';
import { DeclarativeRule, evaluateDeclarativeRules } from '@/plugins/evaluateDeclarativeRules';
import { useLocalJournalEntries } from '@/hooks/useMockJournalEntries';
import { useCopilotFlags } from '@/context/CopilotFlagContext';
import { groupBy } from 'lodash';

export const RulesManagementPanel: React.FC<{ userRules: DeclarativeRule[]; setUserRules: React.Dispatch<React.SetStateAction<DeclarativeRule[]>> }> = ({ userRules, setUserRules }) => {
  const [entries] = useLocalJournalEntries();
  const { setCopilotFlags } = useCopilotFlags();
  const [editingRule, setEditingRule] = useState<DeclarativeRule | null>(null);

  const toggleRuleStatus = (id: string) => {
    setUserRules((prev) =>
      prev.map((rule) =>
        rule.id === id ? { ...rule, status: rule.status === 'active' ? 'inactive' : 'active' } : rule
      )
    );
    const activeRules = userRules.filter((r) => r.status === 'active');
    const newFlags = evaluateDeclarativeRules(activeRules, entries);
    setCopilotFlags(newFlags);
  };

  const updateRule = (id: string, updatedRule: Partial<DeclarativeRule>) => {
    setUserRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, ...updatedRule } : rule))
    );
    const activeRules = userRules.filter((r) => r.status === 'active');
    const newFlags = evaluateDeclarativeRules(activeRules, entries);
    setCopilotFlags(newFlags);
  };

  const groupedRules = groupBy(userRules, (r: DeclarativeRule) => r.domain);

  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="text-lg font-semibold">Rules Management</h3>
      {Object.entries(groupedRules).map(([domain, rules]) => (
        <div key={domain} className="mt-4">
          <h3 className="text-sm font-bold mb-2 capitalize">{domain} Rules</h3>
          {rules.map((rule: DeclarativeRule) => (
            <div key={rule.id} className="border rounded p-3 text-xs space-y-1 bg-white shadow-sm">
              <div className="font-semibold">{rule.message}</div>
              <div className="text-zinc-500">
                IF <b>{rule.field}</b> <i>{rule.condition}</i> <b>{String(rule.value)}</b>{' '}
                {rule.appliesToStatus?.length && ` (statuses: ${rule.appliesToStatus.join(', ')})`}
              </div>
              <div className="text-[10px] text-zinc-500 italic">
                Owner: {rule.owner} · Created: {new Date(rule.createdAt).toLocaleDateString()}
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {rule.tags?.map((tag: string) => (
                  <span key={tag} className="bg-zinc-200 px-2 py-0.5 rounded text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setEditingRule(rule)}
                  className="underline text-blue-600"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => toggleRuleStatus(rule.id)}
                  className="underline text-zinc-600"
                >
                  {rule.status === 'active' ? '💤 Deactivate' : '✅ Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
      {editingRule && (
        <div className="p-4 border rounded bg-gray-50">
          <h4 className="text-md font-semibold">Edit Rule</h4>
          {/* Add form fields for editing rule properties */}
          <button
            onClick={() => setEditingRule(null)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};
