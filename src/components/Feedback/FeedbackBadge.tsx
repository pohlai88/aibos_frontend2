'use client';

import { useFeedback } from '@/hooks/useFeedback';

interface FeedbackBadgeProps {
  entryId: string;
  className?: string;
  onClick?: () => void;
}

export function FeedbackBadge({ entryId, className = '', onClick }: FeedbackBadgeProps) {
  const { feedback, loading } = useFeedback(entryId);
  
  if (loading || feedback.length === 0) {
    return null;
  }

  const unresolvedCount = feedback.filter(f => !f.resolved).length;
  const totalCount = feedback.length;

  const badgeColor = unresolvedCount > 0 
    ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' 
    : 'bg-gray-100 text-gray-600 hover:bg-gray-200';

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors ${badgeColor} ${className}`}
      title={`${totalCount} feedback item${totalCount !== 1 ? 's' : ''}${unresolvedCount > 0 ? `, ${unresolvedCount} unresolved` : ''}`}
    >
      <span className="mr-1">💭</span>
      {unresolvedCount > 0 ? unresolvedCount : totalCount}
    </button>
  );
}
