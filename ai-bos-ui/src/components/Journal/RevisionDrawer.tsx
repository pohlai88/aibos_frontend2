// src/components/Journal/RevisionDrawer.tsx

'use client';

import { useState } from 'react';

type RevisionDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  entryId: string;
};

export const RevisionDrawer: React.FC<RevisionDrawerProps> = ({
  isOpen,
  onClose,
  entryId,
}) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg border-l border-zinc-200 transform transition-transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-semibold">Revisions for Entry #{entryId}</h2>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800">
          ✕
        </button>
      </div>

      {/* 🚧 Copilot: render list of historical changes w/ diff highlights */}
      <div className="p-4 text-sm text-zinc-600 space-y-2">
        <p>[Mock Revision A]</p>
        <p>[Mock Revision B]</p>
      </div>
    </div>
  );
};
