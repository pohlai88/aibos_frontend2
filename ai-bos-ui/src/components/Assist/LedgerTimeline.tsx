import React from 'react';

export type TimelineEvent = {
  id: string;
  type: 'rule-created' | 'rule-edited' | 'flag-resolved' | 'feedback' | 'suggestion';
  actor: string;
  timestamp: string;
  targetId?: string; // ruleId or entryId
  summary: string;
  meta?: any;
};

export const LedgerTimeline: React.FC<{ events: TimelineEvent[] }> = ({ events }) => {
  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="text-lg font-semibold">Ledger Timeline</h3>
      <div className="space-y-2 mt-4">
        {events
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .map((e) => (
            <div key={e.id} className="border-l-2 pl-3 relative text-xs">
              <div className="absolute -left-[6px] top-1 bg-blue-600 w-2 h-2 rounded-full" />
              <div className="text-zinc-700 font-medium">{e.summary}</div>
              <div className="text-zinc-500 text-[10px]">
                {new Date(e.timestamp).toLocaleString()} by {e.actor}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
