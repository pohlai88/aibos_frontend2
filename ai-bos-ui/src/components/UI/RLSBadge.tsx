// src/components/UI/RLSBadge.tsx

type RLSBadgeProps = {
  role: 'admin' | 'finance' | 'auditor' | 'api-user';
};

const roleColors: Record<RLSBadgeProps['role'], string> = {
  admin: 'bg-red-100 text-red-800',
  finance: 'bg-blue-100 text-blue-800',
  auditor: 'bg-green-100 text-green-800',
  'api-user': 'bg-purple-100 text-purple-800',
};

export const RLSBadge: React.FC<RLSBadgeProps> = ({ role }) => {
  return (
    <span
      className={`px-2 py-0.5 text-xs rounded font-mono ${roleColors[role]} whitespace-nowrap`}
    >
      {role}
    </span>
  );
};
