// src/components/Journal/CreateEntryDialog.tsx

'use client';

import { useState } from 'react';
import { JournalEntry } from '@/hooks/useMockJournalEntries';

type Props = {
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
};

export const CreateEntryDialog: React.FC<Props> = ({ setEntries }) => {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);

  const handleSubmit = () => {
    const newEntry: JournalEntry = {
      id: 'ent-' + Date.now(),
      description,
      amount,
      updatedBy: 'current-user',
      source: 'web',
      revisionCount: 0,
      status: 'draft',
    };
    setEntries((prev) => [...prev, newEntry]);
    setOpen(false);
    setDescription('');
    setAmount(0);
  };

  return (
    <>
      <button
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg"
        onClick={() => setOpen(true)}
      >
        ＋ Add Entry
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 shadow-lg w-96 space-y-4">
            <h2 className="text-lg font-semibold">New Journal Entry</h2>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full px-3 py-2 border rounded text-sm"
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              placeholder="Amount"
              className="w-full px-3 py-2 border rounded text-sm"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setOpen(false)} className="text-sm text-zinc-500">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-1.5 text-sm rounded"
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
