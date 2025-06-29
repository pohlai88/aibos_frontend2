// src/app/journal/[id]/page.tsx

'use client';

import { useMockJournalEntries, type MockJournalEntry } from '@/hooks/mocks/useMockJournalEntries';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function JournalEntryPage() {
  const params = useParams();
  const router = useRouter();
  const { getEntry, updateEntry, deleteEntry } = useMockJournalEntries();
  const [entry, setEntry] = useState<MockJournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<MockJournalEntry>>({});

  useEffect(() => {
    if (params.id) {
      const foundEntry = getEntry(params.id as string);
      if (foundEntry) {
        setEntry(foundEntry);
        setFormData(foundEntry);
      }
    }
  }, [params.id, getEntry]);

  const handleSave = () => {
    if (entry && formData) {
      updateEntry(entry.id, formData);
      setEntry({ ...entry, ...formData });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (entry && confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(entry.id);
      router.push('/journal');
    }
  };

  if (!entry) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Entry Not Found</h1>
          <p className="text-gray-600 mb-6">The journal entry you're looking for doesn't exist.</p>
          <Link href="/journal" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Back to Journal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Link href="/journal" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Journal
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            {isEditing ? 'Edit Entry' : 'Journal Entry'}
          </h1>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Save
              </button>
            </>
          )}
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Entry Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            {isEditing ? (
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="text-gray-900">{new Date(entry.date).toLocaleDateString()}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            {isEditing ? (
              <select
                value={formData.status || ''}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="posted">Posted</option>
                <option value="voided">Voided</option>
              </select>
            ) : (
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                entry.status === 'posted' ? 'bg-green-100 text-green-800' :
                entry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                entry.status === 'voided' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {entry.status}
              </span>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            {isEditing ? (
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="text-gray-900">{entry.description}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.account || ''}
                onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="text-gray-900">{entry.account}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reference</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.reference || ''}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="text-gray-900">{entry.reference || '—'}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Debit</label>
            {isEditing ? (
              <input
                type="number"
                step="0.01"
                value={formData.debit || 0}
                onChange={(e) => setFormData({ ...formData, debit: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="text-gray-900">${entry.debit.toLocaleString()}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Credit</label>
            {isEditing ? (
              <input
                type="number"
                step="0.01"
                value={formData.credit || 0}
                onChange={(e) => setFormData({ ...formData, credit: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="text-gray-900">${entry.credit.toLocaleString()}</div>
            )}
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Created by:</span>
            <span className="ml-2 text-gray-900">{entry.createdBy}</span>
          </div>
          <div>
            <span className="text-gray-600">Created at:</span>
            <span className="ml-2 text-gray-900">{new Date(entry.createdAt).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Last updated:</span>
            <span className="ml-2 text-gray-900">{new Date(entry.updatedAt).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Revisions:</span>
            <span className="ml-2 text-gray-900">{entry.revisionCount}</span>
          </div>
        </div>
      </div>

      {/* Feedback */}
      {entry.feedback && entry.feedback.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Feedback</h3>
          <div className="space-y-4">
            {entry.feedback.map((feedback) => (
              <div key={feedback.id} className="border-l-4 border-blue-500 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900">{feedback.user}</div>
                    <div className="text-gray-600">{feedback.comment}</div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    feedback.type === 'approval' ? 'bg-green-100 text-green-800' :
                    feedback.type === 'rejection' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {feedback.type}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {new Date(feedback.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
