'use client';

import { JournalEntry } from '@/hooks/useMockJournalEntries';

export const AuditTrailModal = ({
  entry,
  onClose,
}: {
  entry: JournalEntry | null;
  onClose: () => void;
}) => {
  if (!entry) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-xl w-[500px] space-y-3">
        <h2 className="text-lg font-semibold">Audit Trail · {entry.description}</h2>
        <ul className="text-sm space-y-2 max-h-64 overflow-y-auto">
          {entry.auditTrail.map((event, idx) => (
            <li key={idx} className="border-l-2 pl-3 border-zinc-300">
              <span className="font-mono text-xs text-zinc-500">
                {new Date(event.timestamp).toLocaleString()}
              </span>
              <br />
              <span className="text-zinc-800">
                {event.actor} {event.type === 'create' ? 'created' : event.type === 'edit' ? 'edited' : event.type === 'status-change' ? 'changed status' : 'voided'} this entry.
              </span>
              {event.note && <div className="text-xs text-zinc-500 mt-1">{event.note}</div>}
              {event.delta && (
                <ul className="mt-1 text-xs text-blue-800 bg-blue-50 rounded p-2 border border-blue-200 space-y-1">
                  {Object.entries(event.delta).map(([key, change]) => (
                    <li key={key}>
                      <b>{key}</b>: {String(change.from)} → {String(change.to)}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className="pt-4 text-right">
          <button
            onClick={onClose}
            className="text-sm text-blue-600 hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
