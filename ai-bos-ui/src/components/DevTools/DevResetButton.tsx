// src/components/DevTools/DevResetButton.tsx

'use client';

import { JournalEntry } from '@/hooks/useMockJournalEntries';

export const DevResetButton: React.FC<{ setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>> }> = ({ setEntries }) => {
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => {
          localStorage.removeItem('ai-bos::journal');
          setEntries([]);
        }}
        className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1.5 text-xs rounded shadow border border-red-300"
      >
        🔄 Reset Journal (Dev)
      </button>
    </div>
  );
};
