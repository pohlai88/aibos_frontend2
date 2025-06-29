"use client";

"use client";

import React, { useState, useEffect } from 'react';
import { detectEmergentPatterns, SuggestedRule } from '@/plugins/CopilotHeuristic';
import { useLocalJournalEntries } from '@/hooks/useMockJournalEntries';
import { DeclarativeRule, evaluateDeclarativeRules } from '@/plugins/evaluateDeclarativeRules';
import { useCopilotFlags } from '@/context/CopilotFlagContext';
import { extractField, extractCondition, extractValue } from '@/plugins/evaluateDeclarativeRules';

export const SuggestedRulesPanel: React.FC = () => {
  const [entries] = useLocalJournalEntries();
  const [suggestions, setSuggestions] = useState<SuggestedRule[]>([]);
  const [userRules, setUserRules] = useState<DeclarativeRule[]>([]);
  const { setCopilotFlags } = useCopilotFlags();

  useEffect(() => {
    const detectedRules = detectEmergentPatterns(entries);
    setSuggestions(detectedRules);
  }, [entries]);

  const handleApprove = (suggestion: SuggestedRule) => {
    const newRule: DeclarativeRule = {
      id: suggestion.id,
      field: extractField(suggestion.condition),
      condition: extractCondition(suggestion.condition),
      value: extractValue(suggestion.condition),
      message: suggestion.recommendedMessage,
      domain: 'audit',
      tags: [],
      owner: 'current-user',
      createdAt: new Date().toISOString(),
      status: 'active',
      version: 1,
      history: [],
    };

    setUserRules((prev) => [...prev, newRule]);
    setSuggestions((prev) => prev.filter((r) => r.id !== suggestion.id));

    const newFlags = evaluateDeclarativeRules(userRules, entries);
    setCopilotFlags(newFlags);
  };

  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="text-lg font-semibold">Suggested Rules</h3>
      {suggestions.length === 0 ? (
        <p className="text-sm text-zinc-500">No patterns detected.</p>
      ) : (
        suggestions.map((rule) => (
          <div
            key={rule.id}
            className="border p-2 rounded space-y-1 text-xs bg-yellow-50 border-yellow-200"
          >
            <div className="font-semibold text-yellow-700">📌 {rule.recommendedMessage}</div>
            <div className="text-zinc-600 italic">{rule.rationale}</div>
            <div className="text-zinc-500">Affects {rule.entryIds.length} entries</div>
            <button
              className="text-blue-600 underline text-xs mt-1"
              onClick={() => handleApprove(rule)}
            >
              ➕ Convert to Rule
            </button>
          </div>
        ))
      )}
    </div>
  );
};
