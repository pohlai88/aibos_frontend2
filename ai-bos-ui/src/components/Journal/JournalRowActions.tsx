// src/components/Journal/JournalRowActions.tsx

'use client';

import React from 'react';
import { useAccessPolicy } from '@/policy/useAccessPolicy';

type EntryStatus = 'pending' | 'posted' | 'voided'; // Define the EntryStatus type

type Props = {
  entryId: string;
  onViewRevisions: (id: string) => void;
  onStatusChange: (id: string, status: EntryStatus) => void;
};

export const JournalRowActions: React.FC<Props> = ({ entryId, onViewRevisions, onStatusChange }) => {
  const policy = useAccessPolicy();

  return (
    <div className="flex items-center gap-2 justify-end">
      {policy['view:revisions'] && (
        <button
          onClick={() => onViewRevisions(entryId)}
          className="text-xs text-blue-600 underline hover:text-blue-800"
        >
          View Revisions
        </button>
      )}
      {policy['edit:journal'] && (
        <button className="text-xs text-zinc-600 hover:text-zinc-800">Edit</button>
      )}
      {policy['edit:journal'] && (
        <button
          onClick={() => onStatusChange(entryId, 'pending')}
          className="text-xs text-yellow-600 hover:underline"
        >
          Submit for Approval
        </button>
      )}
      {policy['access:admin-panel'] && (
        <button
          onClick={() => onStatusChange(entryId, 'posted')}
          className="text-xs text-green-600 hover:underline"
        >
          Approve
        </button>
      )}
      {policy['override:auditLock'] && (
        <button
          onClick={() => onStatusChange(entryId, 'voided')}
          className="text-xs text-red-600 hover:underline"
        >
          Void
        </button>
      )}
      {!policy['edit:journal'] && !policy['view:revisions'] && (
        <span className="text-xs text-zinc-400">No actions available</span>
      )}
    </div>
  );
};
