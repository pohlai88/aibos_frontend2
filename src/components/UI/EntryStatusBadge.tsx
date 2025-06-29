// src/components/UI/EntryStatusBadge.tsx

type EntryStatus = 'draft' | 'pending' | 'posted' | 'voided';

const statusStyles: Record<EntryStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  posted: 'bg-green-100 text-green-800',
  voided: 'bg-red-100 text-red-800 line-through',
};

export const EntryStatusBadge: React.FC<{ status: EntryStatus }> = ({ status }) => {
  return (
    <span className={`text-xs px-2 py-0.5 rounded ${statusStyles[status]}`}>
      {status.toUpperCase()}
    </span>
  );
};
