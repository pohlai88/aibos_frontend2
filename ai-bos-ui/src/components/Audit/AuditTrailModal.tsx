'use client';

import { JournalEntry } from '@/hooks/useJournalEntries';
import { FeedbackPanel } from '@/components/Feedback';

export const AuditTrailModal = ({
  entry,
  onClose,
}: {
  entry: JournalEntry | null;
  onClose: () => void;
}) => {
  if (!entry) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Audit Trail & Feedback
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
              aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Entry info */}
          <div className="mt-2 text-sm text-gray-600">
            <span className="font-medium">{entry.description}</span>
            <span className="mx-2">•</span>
            <span>ID: {entry.id}</span>
            <span className="mx-2">•</span>
            <span className="capitalize">{entry.status}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 h-full">
            {/* Audit Trail */}
            <div className="space-y-4">
              <h3 className="text-base font-medium text-gray-900">Audit Trail</h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                {/* TODO: Replace with actual audit trail when available */}
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">Entry Created</span>
                      <span className="text-xs text-gray-500">{new Date(entry.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Entry created by {entry.createdBy}
                    </p>
                  </div>
                  
                  {entry.updatedAt !== entry.createdAt && (
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">Entry Updated</span>
                        <span className="text-xs text-gray-500">{new Date(entry.updatedAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Entry was modified
                      </p>
                    </div>
                  )}
                  
                  {entry.status === 'posted' && entry.postingDate && (
                    <div className="border-l-4 border-green-500 pl-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">Entry Posted</span>
                        <span className="text-xs text-gray-500">{new Date(entry.postingDate).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Entry posted to ledger
                      </p>
                    </div>
                  )}
                  
                  {/* Placeholder for future audit events */}
                  <div className="text-center py-4 text-gray-500 text-sm">
                    <div className="text-2xl mb-1">📋</div>
                    Additional audit events will appear here
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback Panel */}
            <div className="space-y-4">
              <FeedbackPanel 
                entryId={entry.id}
                title="Reviewer Notes & Feedback"
                showForm={true}
                className="border-0 shadow-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
