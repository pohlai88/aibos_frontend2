// src/components/Journal/JournalTableRow.tsx

'use client';

import { JournalEntry, EntryStatus } from '@/hooks/useMockJournalEntries';
import { AuditCue } from '@/components/UI/AuditCue';
import { RLSBadge } from '@/components/UI/RLSBadge';
import { JournalRowActions } from './JournalRowActions';
import { EntryStatusBadge } from '@/components/UI/EntryStatusBadge';

type Props = {
  entry: JournalEntry;
  onViewRevisions: (id: string) => void;
  onStatusChange: (id: string, status: EntryStatus) => void;
};

export const JournalTableRow: React.FC<Props> = ({ entry, onViewRevisions, onStatusChange }) => {
  return (
    <tr key={entry.id} className="border-t">
      <td className="px-4 py-2">
        <EntryStatusBadge status={entry.status} />
        {entry.description}
      </td>
      <td className="px-4 py-2">{entry.amount.toFixed(2)}</td>
      <td className="px-4 py-2">
        <AuditCue
          updatedBy={entry.updatedBy}
          source={entry.source}
          revisionCount={entry.revisionCount}
        />
      </td>
      <td className="px-4 py-2 text-right space-x-2">
        <RLSBadge role="admin" />
        <JournalRowActions
          entryId={entry.id}
          onViewRevisions={onViewRevisions}
          onStatusChange={onStatusChange}
        />
      </td>
    </tr>
  );
};
