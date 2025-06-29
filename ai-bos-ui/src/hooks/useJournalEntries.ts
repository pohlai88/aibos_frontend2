'use client';

import { useState, useEffect, useCallback } from 'react';
import { authenticatedFetch, useAuth } from '@/context/AuthContext';

export interface JournalEntry {
  id: string;
  tenantId: string;
  date: string;
  description: string;
  lines: JournalLine[];
  reference?: string;
  status: 'draft' | 'pending' | 'posted' | 'voided';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  postingDate?: string;
  totalDebit: number;
  totalCredit: number;
  // Legacy fields for backward compatibility with UI components
  account?: string;
  debit?: number;
  credit?: number;
}

export interface JournalLine {
  id: string;
  account: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface CreateJournalEntryRequest {
  date: string;
  description: string;
  lines: Omit<JournalLine, 'id'>[];
  reference?: string;
  status?: 'draft' | 'pending';
}

export interface JournalStats {
  totalEntries: number;
  statusCounts: Record<string, number>;
  recentEntries: JournalEntry[];
}

export interface JournalResponse {
  entries: JournalEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: JournalStats;
}

export function useJournalEntries(filters?: { status?: string; page?: number; limit?: number }) {
  const [data, setData] = useState<JournalEntry[]>([]);
  const [stats, setStats] = useState<JournalStats | null>(null);
  const [pagination, setPagination] = useState<JournalResponse['pagination'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated } = useAuth();

  const fetchEntries = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      
      const url = `/api/journal${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await authenticatedFetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch journal entries');
      }
      
      const result: JournalResponse = await response.json();
      
      // Transform entries for UI compatibility
      const transformedEntries = result.entries.map(transformJournalEntryForUI);
      
      setData(transformedEntries);
      setStats(result.stats);
      setPagination(result.pagination);
      
    } catch (err) {
      console.error('Failed to fetch journal entries:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch journal entries');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, filters?.status, filters?.page, filters?.limit]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const createEntry = async (entryData: CreateJournalEntryRequest) => {
    try {
      const response = await authenticatedFetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to create journal entry');
      }
      
      const newEntry: JournalEntry = await response.json();
      const transformedEntry = transformJournalEntryForUI(newEntry);
      
      // Update local state
      setData(prev => [transformedEntry, ...prev]);
      
      return transformedEntry;
      
    } catch (err) {
      console.error('Failed to create journal entry:', err);
      throw err;
    }
  };

  const updateEntry = async (id: string, updates: Partial<JournalEntry>) => {
    try {
      const response = await authenticatedFetch(`/api/journal/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to update journal entry');
      }
      
      const updatedEntry: JournalEntry = await response.json();
      const transformedEntry = transformJournalEntryForUI(updatedEntry);
      
      // Update local state
      setData(prev => prev.map(entry => entry.id === id ? transformedEntry : entry));
      
      return transformedEntry;
      
    } catch (err) {
      console.error('Failed to update journal entry:', err);
      throw err;
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const response = await authenticatedFetch(`/api/journal/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to delete journal entry');
      }
      
      // Update local state
      setData(prev => prev.filter(entry => entry.id !== id));
      
      return true;
      
    } catch (err) {
      console.error('Failed to delete journal entry:', err);
      throw err;
    }
  };

  const getEntry = async (id: string): Promise<JournalEntry> => {
    try {
      const response = await authenticatedFetch(`/api/journal/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to fetch journal entry');
      }
      
      const entry = await response.json();
      return transformJournalEntryForUI(entry);
      
    } catch (err) {
      console.error('Failed to fetch journal entry:', err);
      throw err;
    }
  };

  // Helper function to transform journal entries for UI compatibility
  function transformJournalEntryForUI(entry: JournalEntry): JournalEntry & {
    account: string;
    debit: number;
    credit: number;
    reference: string;
  } {
    // For UI display, we'll show the first line as the primary account
    // In a proper double-entry system, this would need more sophisticated logic
    const primaryLine = entry.lines[0] || { account: '', debit: 0, credit: 0 };
    
    return {
      ...entry,
      account: primaryLine.account,
      debit: primaryLine.debit,
      credit: primaryLine.credit,
      reference: entry.reference || '',
    };
  }

  return {
    // Data
    entries: data,
    stats,
    pagination,
    
    // State
    loading,
    error,
    
    // Actions
    refetch: fetchEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    getEntry,
  };
}

// Convenience hook for single entry
export function useJournalEntry(id: string) {
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchEntry = async () => {
      if (!isAuthenticated || !id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await authenticatedFetch(`/api/journal/${id}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch journal entry');
        }
        
        const result = await response.json();
        setEntry(result.entry);
        
      } catch (err) {
        console.error('Failed to fetch journal entry:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch journal entry');
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id, isAuthenticated]);

  return {
    entry,
    loading,
    error,
  };
}
