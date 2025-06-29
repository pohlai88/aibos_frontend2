// src/app/journal/new/page.tsx

'use client';

import { useMockJournalEntries } from '@/hooks/mocks/useMockJournalEntries';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function NewJournalEntryPage() {
  const router = useRouter();
  const { addEntry } = useMockJournalEntries();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    account: '',
    reference: '',
    debit: 0,
    credit: 0,
    status: 'draft' as const,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.account.trim()) {
      newErrors.account = 'Account is required';
    }
    if (formData.debit === 0 && formData.credit === 0) {
      newErrors.amount = 'Either debit or credit must be greater than 0';
    }
    if (formData.debit > 0 && formData.credit > 0) {
      newErrors.amount = 'Only one of debit or credit should be entered';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const amount = formData.debit > 0 ? formData.debit : -formData.credit;
    
    addEntry({
      ...formData,
      amount,
      revisionCount: 1,
      createdBy: 'current-user@company.com',
      tags: [],
      attachments: [],
    });

    router.push('/journal');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <Link href="/journal" className="text-blue-600 hover:text-blue-800 text-sm">
          ← Back to Journal
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">New Journal Entry</h1>
        <p className="text-gray-600">Create a new journal entry for your accounting records.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="posted">Posted</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter a detailed description of the transaction..."
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div>
              <label htmlFor="account" className="block text-sm font-medium text-gray-700 mb-2">
                Account *
              </label>
              <input
                type="text"
                id="account"
                value={formData.account}
                onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.account ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Office Equipment, Cash, Accounts Payable..."
                required
              />
              {errors.account && (
                <p className="mt-1 text-sm text-red-600">{errors.account}</p>
              )}
            </div>

            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-2">
                Reference
              </label>
              <input
                type="text"
                id="reference"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Invoice number, receipt ID, etc..."
              />
            </div>

            <div>
              <label htmlFor="debit" className="block text-sm font-medium text-gray-700 mb-2">
                Debit Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  id="debit"
                  step="0.01"
                  value={formData.debit || ''}
                  onChange={(e) => setFormData({ ...formData, debit: parseFloat(e.target.value) || 0, credit: 0 })}
                  className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="credit" className="block text-sm font-medium text-gray-700 mb-2">
                Credit Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  id="credit"
                  step="0.01"
                  value={formData.credit || ''}
                  onChange={(e) => setFormData({ ...formData, credit: parseFloat(e.target.value) || 0, debit: 0 })}
                  className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
            </div>

            {errors.amount && (
              <div className="md:col-span-2">
                <p className="text-sm text-red-600">{errors.amount}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/journal"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Create Entry
          </button>
        </div>
      </form>

      {/* Help */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Tips for Journal Entries</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Enter either a debit OR credit amount, not both</li>
          <li>• Use clear, descriptive text for the description</li>
          <li>• Include reference numbers for easy tracking</li>
          <li>• Start with "draft" status and change to "pending" when ready for review</li>
        </ul>
      </div>
    </div>
  );
}
