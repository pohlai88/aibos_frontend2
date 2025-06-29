'use client';

import { useState } from 'react';
import { JournalEntry } from '@/hooks/useMockJournalEntries';

export const FeedbackDialog = ({
  entry,
  onSubmit,
  onClose,
}: {
  entry: JournalEntry;
  onSubmit: (entryId: string, note: string, category: string) => void;
  onClose: () => void;
}) => {
  const [note, setNote] = useState('');
  const [type, setType] = useState('unclear-data');

  const handleSubmit = () => {
    onSubmit(entry.id, note, type);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-xl w-[400px] p-6 space-y-4">
        <h2 className="text-lg font-semibold">Suggest Improvement</h2>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 border rounded text-sm"
        >
          <option value="unclear-data">Unclear or missing data</option>
          <option value="possible-duplicate">Possible duplicate</option>
          <option value="needs-audit">Needs audit review</option>
          <option value="other">Other</option>
        </select>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Describe the issue or suggestion..."
          className="w-full px-3 py-2 border rounded text-sm min-h-[100px]"
        />

        <div className="text-right space-x-2">
          <button onClick={onClose} className="text-sm text-zinc-500">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={!note.trim()}
            className="bg-blue-600 text-white px-4 py-1.5 text-sm rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
