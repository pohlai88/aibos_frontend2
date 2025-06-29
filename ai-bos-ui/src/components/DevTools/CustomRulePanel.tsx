import React, { useState } from 'react';
import { evaluateDeclarativeRules } from '@/plugins/evaluateDeclarativeRules';
import { useLocalJournalEntries } from '@/hooks/useMockJournalEntries';
import { useCopilotFlags } from '@/context/CopilotFlagContext';

export const CustomRulePanel: React.FC = () => {
  const [json, setJson] = useState('');
  const [entries] = useLocalJournalEntries();
  const { flags, setFlags } = useCopilotFlags();

  const handleRunRules = () => {
    try {
      const rules = JSON.parse(json);
      const flags = evaluateDeclarativeRules(rules, entries);
      setFlags(flags);
    } catch (e) {
      console.error('Invalid JSON format', e);
    }
  };

  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="text-lg font-semibold">Custom Rule Panel</h3>
      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        className="w-full h-40 font-mono text-xs border p-2"
        placeholder="Paste JSON rules here..."
      />
      <button
        onClick={handleRunRules}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        ⚙️ Run Custom Rules
      </button>
    </div>
  );
};
