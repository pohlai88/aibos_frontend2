// src/app/journal/page.tsx

'use client';

import { JournalTable } from '@/components/Journal/JournalTable';
import { useJournalEntries, type JournalEntry } from '@/hooks/useJournalEntries';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Suspense, useState } from 'react';
import { useRole } from '@/context/RoleContext';
import Link from 'next/link';
import { LoadingTable, LoadingStatsCard } from '@/components/UI/LoadingSkeletons';
import { ErrorBanner } from '@/components/UI/ErrorBanner';

function JournalContent() {
  const { entries, stats, loading, error, refetch } = useJournalEntries();
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'pending' | 'posted' | 'voided'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { canAccess } = useRole();

  // Filter entries based on status and search
  const filteredEntries = entries.filter(entry => {
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    const matchesSearch = !searchTerm || 
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.account?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (entry.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    return matchesStatus && matchesSearch;
  });

  // Handle loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Journal Entries</h1>
            <p className="text-gray-600">Track and manage all accounting transactions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <LoadingStatsCard />
          <LoadingStatsCard />
          <LoadingStatsCard />
        </div>

        <LoadingTable />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Journal Entries</h1>
            <p className="text-gray-600">Track and manage all accounting transactions</p>
          </div>
        </div>
        <ErrorBanner 
          message={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  // Export to CSV function
  const exportToCSV = () => {
    const csvData = filteredEntries.map((entry: JournalEntry) => ({
      Date: entry.date,
      Description: entry.description,
      Account: entry.account,
      Reference: entry.reference,
      Debit: entry.debit,
      Credit: entry.credit,
      Status: entry.status
    }));

    const csvContent = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map((row: any) => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-entries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📒 Journal Entries</h1>
          <p className="text-gray-600">Track and manage all accounting transactions</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            📊 Export CSV
          </button>
          {canAccess('journal') && (
            <Link
              href="/journal/new"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ➕ New Entry
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Entries</h3>
          <p className="text-2xl font-bold text-gray-900">{stats?.totalEntries || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Draft Entries</h3>
          <p className="text-2xl font-bold text-orange-600">{stats?.statusCounts?.draft || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Posted Entries</h3>
          <p className="text-2xl font-bold text-green-600">{stats?.statusCounts?.posted || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">Search entries</label>
            <input
              type="text"
              id="search"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="status" className="sr-only">Filter by status</label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="posted">Posted</option>
              <option value="voided">Voided</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Entries ({filteredEntries.length})
            </h3>
            {searchTerm && (
              <span className="text-sm text-gray-500">
                Showing results for &quot;{searchTerm}&quot;
              </span>
            )}
          </div>

          <Suspense fallback={<LoadingTable />}>
            <JournalTable entries={filteredEntries} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default function JournalPage() {
  return (
    <ProtectedRoute requiredRoles={['admin', 'reviewer', 'engineer']}>
      <JournalContent />
    </ProtectedRoute>
  );
}
