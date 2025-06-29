// src/components/Journal/JournalTable.tsx

'use client';

import React, { useState } from 'react';
import { useRole } from '@/context/RoleContext';
import { type JournalEntry } from '@/hooks/useJournalEntries';
import Link from 'next/link';

export const JournalTable: React.FC<{ 
  entries: JournalEntry[];
}> = ({ entries }) => {
  const { role } = useRole();
  const [sortField, setSortField] = useState<'date' | 'debit' | 'credit' | 'status'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedEntries = [...entries].sort((a, b) => {
    const factor = sortDirection === 'asc' ? 1 : -1;
    if (sortField === 'debit') return (a.debit - b.debit) * factor;
    if (sortField === 'credit') return (a.credit - b.credit) * factor;
    if (sortField === 'date') return (new Date(a.date).getTime() - new Date(b.date).getTime()) * factor;
    if (sortField === 'status') return a.status.localeCompare(b.status) * factor;
    return 0;
  });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      posted: 'bg-green-100 text-green-800',
      voided: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return amount === 0 ? '-' : `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-4xl mb-4">📒</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No journal entries found</h3>
        <p className="text-gray-500 mb-4">Get started by creating your first journal entry.</p>
        <Link
          href="/journal/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Create Entry
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('date')}
            >
              Date
              {sortField === 'date' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Account
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reference
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('debit')}
            >
              Debit
              {sortField === 'debit' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('credit')}
            >
              Credit
              {sortField === 'credit' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('status')}
            >
              Status
              {sortField === 'status' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedEntries.map((entry) => (
            <tr key={entry.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(entry.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <div className="font-medium">{entry.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {entry.account}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {entry.reference || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono text-right">
                {formatCurrency(entry.debit)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono text-right">
                {formatCurrency(entry.credit)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(entry.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center space-x-2">
                  {(role === 'admin' || role === 'reviewer') && (
                    <Link
                      href={`/journal/${entry.id}`}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      View
                    </Link>
                  )}
                  {entry.status === 'draft' && (role === 'admin' || role === 'engineer') && (
                    <Link
                      href={`/journal/${entry.id}/edit`}
                      className="text-green-600 hover:text-green-900 text-sm"
                    >
                      Edit
                    </Link>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
