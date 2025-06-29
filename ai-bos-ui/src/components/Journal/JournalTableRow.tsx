// src/components/Journal/JournalTableRow.tsx

'use client';

import { JournalEntry, EntryStatus } from '@/hooks/useMockJournalEntries';
import { AuditCue } from '@/components/UI/AuditCue';
import { RLSBadge } from '@/components/UI/RLSBadge';
import { JournalRowActions } from './JournalRowActions';
import { EntryStatusBadge } from '@/components/UI/EntryStatusBadge';
import { ReviewStatusBadge } from '@/components/UI/ReviewStatusBadge';
import { CopilotFlag } from '@/components/Assist/CopilotFlag';
import { useAssistMode } from '@/context/AssistModeContext';
import { useFlagContext } from '@/context/CopilotFlagContext';

type Props = {
  entry: JournalEntry;
  onViewRevisions: (id: string) => void;
  onStatusChange: (id: string, status: EntryStatus) => void;
  onShowRevision: (entry: JournalEntry) => void;
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
};

export const JournalTableRow: React.FC<Props> = ({
  entry,
  onViewRevisions,
  onStatusChange,
  onShowRevision,
  setEntries,
}) => {
  function getReviewStatus(
    entry: JournalEntry
  ): 'reviewed' | 'unreviewed' | 'approved' | 'attention' {
    const hasView = entry.auditTrail.some((e) => e.type === 'view-revision');
    if (entry.status === 'posted') return 'approved';
    if (entry.revisionCount > 1 && !hasView) return 'attention';
    return hasView ? 'reviewed' : 'unreviewed';
  }

  const reviewStatus = getReviewStatus(entry);
  const { enabled } = useAssistMode();

  function needsReview(entry: JournalEntry): boolean {
    const { flags: copilotFlags } = useFlagContext();
    const hasAI = copilotFlags.some((f) => f.entryId === entry.id && f.status === 'open');
    const hasFeedback = (entry.feedback || []).length > 0;
    return hasAI && hasFeedback;
  }

  return (
    <tr key={entry.id} className="border-t">
      <td className="px-4 py-2">
        <EntryStatusBadge status={entry.status} />
        <ReviewStatusBadge status={reviewStatus} />
        {needsReview(entry) && (
          <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium">
            🚩 Needs Review
          </span>
        )}
        {entry.description}
        {!coverageMap[entry.id] && ['draft', 'pending'].includes(entry.status) && (
          <span className="text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded ml-2">
            ⚠️ Not Evaluated by Any Rule
          </span>
        )}
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
          setEntries={setEntries}
        />
        {entry.revisions && entry.revisions.length > 0 && (
          <button
            onClick={() => onShowRevision(entry)}
            className="text-xs text-purple-600 hover:underline"
          >
            View History
          </button>
        )}
        {enabled && entry.status === 'voided' && !entry.auditTrail.some(e => e.note) && (
          <CopilotFlag
            message="This voided entry lacks a reason note. Recommend adding one for audit clarity."
            action={
              <button className="underline text-yellow-700 text-xs">
                ✍️ Add Reason
              </button>
            }
          />
        )}
      </td>
    </tr>
  );
};
