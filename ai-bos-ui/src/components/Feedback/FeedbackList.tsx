'use client';

import { useState } from 'react';
import { Feedback, useFeedback } from '@/hooks/useFeedback';
import { useRole } from '@/context/RoleContext';

interface FeedbackListProps {
  entryId: string;
  className?: string;
}

interface FeedbackItemProps {
  feedback: Feedback;
  onResolve?: (id: string) => void;
  onDelete?: (id: string) => void;
  canModify?: boolean;
}

function getCategoryIcon(category: Feedback['category']) {
  const icons = {
    documentation: '📄',
    accuracy: '🎯',
    compliance: '✅',
    process: '⚙️',
    other: '💭',
  };
  return icons[category] || '💭';
}

function getCategoryColor(category: Feedback['category']) {
  const colors = {
    documentation: 'bg-blue-100 text-blue-800',
    accuracy: 'bg-green-100 text-green-800',
    compliance: 'bg-red-100 text-red-800',
    process: 'bg-purple-100 text-purple-800',
    other: 'bg-gray-100 text-gray-800',
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}

function FeedbackItem({ feedback, onResolve, onDelete, canModify }: FeedbackItemProps) {
  const [isResolving, setIsResolving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleResolve = async () => {
    if (!onResolve || feedback.resolved) return;
    
    try {
      setIsResolving(true);
      await onResolve(feedback.id);
    } catch (error) {
      console.error('Failed to resolve feedback:', error);
    } finally {
      setIsResolving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (!confirm('Are you sure you want to delete this feedback?')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      await onDelete(feedback.id);
    } catch (error) {
      console.error('Failed to delete feedback:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`bg-white border rounded-lg p-4 ${feedback.resolved ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(feedback.category)}`}>
              <span className="mr-1">{getCategoryIcon(feedback.category)}</span>
              {feedback.category}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-gray-900">
                {feedback.actorName || feedback.actor}
              </span>
              {feedback.actorRole && (
                <span className="text-xs text-gray-500">
                  ({feedback.actorRole})
                </span>
              )}
              <span className="text-xs text-gray-500">
                {formatRelativeTime(feedback.createdAt)}
              </span>
              {feedback.resolved && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Resolved
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-700 mb-2">
              {feedback.comment}
            </p>
            
            {feedback.resolved && feedback.resolvedAt && (
              <p className="text-xs text-gray-500">
                Resolved {formatRelativeTime(feedback.resolvedAt)}
                {feedback.resolvedBy && feedback.resolvedBy !== feedback.actor && (
                  <span> by {feedback.resolvedBy}</span>
                )}
              </p>
            )}
          </div>
        </div>
        
        {canModify && (
          <div className="flex items-center space-x-2 ml-4">
            {!feedback.resolved && onResolve && (
              <button
                onClick={handleResolve}
                disabled={isResolving}
                className="text-xs text-green-600 hover:text-green-800 font-medium disabled:opacity-50"
                title="Mark as resolved"
              >
                {isResolving ? '...' : 'Resolve'}
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                title="Delete feedback"
              >
                {isDeleting ? '...' : 'Delete'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function FeedbackList({ entryId, className = '' }: FeedbackListProps) {
  const { feedback, loading, error, updateFeedback, deleteFeedback } = useFeedback(entryId);
  const { role } = useRole();
  
  // Check if user can modify feedback (admin/reviewer roles)
  const canModify = role === 'admin' || role === 'reviewer';

  const handleResolve = async (feedbackId: string) => {
    try {
      await updateFeedback(feedbackId, { resolved: true });
    } catch (error) {
      console.error('Failed to resolve feedback:', error);
      // You might want to show a toast notification here
    }
  };

  const handleDelete = async (feedbackId: string) => {
    try {
      await deleteFeedback(feedbackId);
    } catch (error) {
      console.error('Failed to delete feedback:', error);
      // You might want to show a toast notification here
    }
  };

  if (loading) {
    return (
      <div className={`space-y-3 ${className}`}>
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  <div className="w-16 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-red-600 mb-2">Failed to load feedback</div>
        <div className="text-sm text-gray-500">{error}</div>
      </div>
    );
  }

  if (feedback.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <div className="text-4xl mb-2">💭</div>
        <div className="text-sm">No feedback yet</div>
        <div className="text-xs text-gray-400 mt-1">
          Be the first to add feedback for this entry
        </div>
      </div>
    );
  }

  // Separate resolved and unresolved feedback
  const unresolvedFeedback = feedback.filter(f => !f.resolved);
  const resolvedFeedback = feedback.filter(f => f.resolved);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          {feedback.length} feedback item{feedback.length !== 1 ? 's' : ''}
        </span>
        {unresolvedFeedback.length > 0 && (
          <span className="text-orange-600 font-medium">
            {unresolvedFeedback.length} unresolved
          </span>
        )}
      </div>

      {/* Unresolved feedback first */}
      {unresolvedFeedback.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Open Feedback</h4>
          {unresolvedFeedback.map((item) => (
            <FeedbackItem
              key={item.id}
              feedback={item}
              onResolve={handleResolve}
              onDelete={canModify ? handleDelete : undefined}
              canModify={canModify}
            />
          ))}
        </div>
      )}

      {/* Resolved feedback */}
      {resolvedFeedback.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-500">Resolved Feedback</h4>
          {resolvedFeedback.map((item) => (
            <FeedbackItem
              key={item.id}
              feedback={item}
              onDelete={canModify ? handleDelete : undefined}
              canModify={canModify}
            />
          ))}
        </div>
      )}
    </div>
  );
}
