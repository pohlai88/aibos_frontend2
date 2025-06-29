'use client';

import { useState } from 'react';
import { useFeedback, type CreateFeedbackRequest } from '@/hooks/useFeedback';

interface FeedbackFormProps {
  entryId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

const FEEDBACK_CATEGORIES = [
  { value: 'documentation', label: 'Documentation', description: 'Missing or unclear documentation' },
  { value: 'compliance', label: 'Compliance', description: 'Regulatory or policy concerns' },
  { value: 'accuracy', label: 'Accuracy', description: 'Potential errors or discrepancies' },
  { value: 'process', label: 'Process', description: 'Process improvement suggestions' },
  { value: 'other', label: 'Other', description: 'General feedback or questions' },
] as const;

export function FeedbackForm({ entryId, onSuccess, onCancel, className = '' }: FeedbackFormProps) {
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState<CreateFeedbackRequest['category']>('other');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { createFeedback } = useFeedback();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      setError('Comment is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      await createFeedback({
        entryId,
        comment: comment.trim(),
        category,
      });
      
      // Reset form
      setComment('');
      setCategory('other');
      
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <div>
        <label htmlFor="feedback-category" className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          id="feedback-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as CreateFeedbackRequest['category'])}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={isSubmitting}
        >
          {FEEDBACK_CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label} - {cat.description}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="feedback-comment" className="block text-sm font-medium text-gray-700 mb-2">
          Comment
        </label>
        <textarea
          id="feedback-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add your feedback or suggestions..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-vertical"
          disabled={isSubmitting}
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Provide constructive feedback to help improve this journal entry.
        </p>
      </div>
      
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !comment.trim()}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Posting...' : 'Post Feedback'}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
