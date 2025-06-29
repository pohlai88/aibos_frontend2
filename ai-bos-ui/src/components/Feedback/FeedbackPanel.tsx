'use client';

import { useState } from 'react';
import { FeedbackForm } from './FeedbackForm';
import { FeedbackList } from './FeedbackList';
import { useFeedback } from '@/hooks/useFeedback';
import { useRole } from '@/context/RoleContext';

interface FeedbackPanelProps {
  entryId: string;
  className?: string;
  showForm?: boolean;
  collapsible?: boolean;
  title?: string;
}

export function FeedbackPanel({ 
  entryId, 
  className = '',
  showForm = true,
  collapsible = false,
  title = 'Feedback & Comments'
}: FeedbackPanelProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { feedback, loading } = useFeedback(entryId);
  const { canAccess } = useRole();
  
  // Check if user can add feedback
  const canAddFeedback = canAccess('create') && showForm;
  
  // Count unresolved feedback
  const unresolvedCount = feedback.filter(f => !f.resolved).length;

  const handleFormSuccess = () => {
    setShowAddForm(false);
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium text-gray-900">
              {title}
            </h3>
            
            {/* Feedback count badge */}
            {feedback.length > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {feedback.length}
              </span>
            )}
            
            {/* Unresolved badge */}
            {unresolvedCount > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                {unresolvedCount} unresolved
              </span>
            )}
            
            {loading && (
              <div className="flex items-center text-xs text-gray-500">
                <svg className="animate-spin -ml-1 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Add feedback button */}
            {canAddFeedback && !showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="mr-1">💬</span>
                Add Feedback
              </button>
            )}
            
            {/* Collapse button */}
            {collapsible && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
                aria-label={isCollapsed ? 'Expand feedback panel' : 'Collapse feedback panel'}
              >
                <svg 
                  className={`h-4 w-4 transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-4 space-y-4">
          {/* Add feedback form */}
          {showAddForm && canAddFeedback && (
            <FeedbackForm
              entryId={entryId}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          )}
          
          {/* Feedback list */}
          <FeedbackList entryId={entryId} />
        </div>
      )}
      
      {/* Collapsed state indicator */}
      {isCollapsed && feedback.length > 0 && (
        <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-200">
          {feedback.length} feedback item{feedback.length !== 1 ? 's' : ''}
          {unresolvedCount > 0 && (
            <span className="text-orange-600 ml-1">
              ({unresolvedCount} unresolved)
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default FeedbackPanel;
