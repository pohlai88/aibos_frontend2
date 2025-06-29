export const ReviewStatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, string> = {
    approved: 'bg-green-100 text-green-800',
    reviewed: 'bg-blue-100 text-blue-800',
    unreviewed: 'bg-yellow-100 text-yellow-800',
    attention: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`text-xs px-2 py-0.5 rounded ${variants[status]}`}>
      {status.toUpperCase()}
    </span>
  );
};
