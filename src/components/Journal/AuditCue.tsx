// src/components/Journal/AuditCue.tsx

type AuditCueProps = {
  updatedBy: string;
  source: 'web' | 'api';
  revisionCount: number;
};

export const AuditCue: React.FC<AuditCueProps> = ({ updatedBy, source, revisionCount }) => {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-zinc-500">
      <span>{updatedBy}</span>
      <span className="px-2 py-0.5 rounded bg-zinc-100">{source}</span>
      <span className="text-[10px] text-zinc-400">rev {revisionCount}</span>
    </span>
  );
};
