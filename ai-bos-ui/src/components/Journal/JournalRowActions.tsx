// src/components/Journal/JournalRowActions.tsx

'use client';

import React, { useState } from 'react';
import { useAccessPolicy } from '@/policy/useAccessPolicy';
import { JournalEntry, AuditEvent } from '@/hooks/useMockJournalEntries';
import { FeedbackDialog } from './FeedbackDialog';

type EntryStatus = 'pending' | 'posted' | 'voided'; // Define the EntryStatus type

type Props = {
  entryId: string;
  onViewRevisions: (id: string) => void;
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
};

export const JournalRowActions: React.FC<Props> = ({ entryId, onViewRevisions, setEntries }) => {
  const policy = useAccessPolicy();
  const [showFeedback, setShowFeedback] = useState<JournalEntry | null>(null);

  const updateEntryStatus = (id: string, newStatus: EntryStatus) => {
    setEntries((prev: JournalEntry[]) =>
      prev.map((entry: JournalEntry) => {
        if (entry.id !== id) return entry;

        const newEntry = {
          ...entry,
          status: newStatus,
          revisionCount: entry.revisionCount + 1,
          auditTrail: [
            {
              type: 'status-change',
              timestamp: new Date().toISOString(),
              actor: 'current-user',
              note: `Status changed to ${newStatus}`,
              delta: {
                status: { from: entry.status, to: newStatus },
              },
            } as AuditEvent,
          ],
          revisions: [
            ...(entry.revisions || []),
            {
              before: { status: entry.status },
              after: { status: newStatus },
              timestamp: new Date().toISOString(),
              actor: 'current-user',
              note: `Status changed from ${entry.status} to ${newStatus}`,
            },
          ],
        };

        return newEntry;
      })
    );
  };

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
          onClick={() => updateEntryStatus(entryId, 'pending')}
          className="text-xs text-yellow-600 hover:underline"
        >
          Submit for Approval
        </button>
      )}
      {policy['access:admin-panel'] && (
        <button
          onClick={() => updateEntryStatus(entryId, 'posted')}
          className="text-xs text-green-600 hover:underline"
        >
          Approve
        </button>
      )}
      {policy['override:auditLock'] && (
        <button
          onClick={() => updateEntryStatus(entryId, 'voided')}
          className="text-xs text-red-600 hover:underline"
        >
          Void
        </button>
      )}
      <button
        onClick={() =>
          setShowFeedback({
            id: entryId,
            description: '',
            amount: 0,
            updatedBy: 'current-user',
            source: 'web',
            revisionCount: 0,
            status: 'pending',
            auditTrail: [],
          })
        }
        className="text-xs text-purple-600 hover:underline"
      >
        💡 Suggest Improvement
      </button>
      {showFeedback && (
        <FeedbackDialog
          entry={showFeedback}
          onSubmit={(entryId, note, type) => {
            console.log('Feedback received:', { entryId, note, type });
          }}
          onClose={() => setShowFeedback(null)}
        />
      )}
      {!policy['edit:journal'] && !policy['view:revisions'] && (
        <span className="text-xs text-zinc-400">No actions available</span>
      )}
    </div>
  );
};
