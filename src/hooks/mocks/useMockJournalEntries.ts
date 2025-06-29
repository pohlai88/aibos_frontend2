// src/hooks/mocks/useMockJournalEntries.ts
import { useState, useMemo, useEffect } from 'react';
import { mockJournalEntries, type MockJournalEntry } from '@/mocks/journalEntries';

export function useMockJournalEntries() {
  const [entries, setEntries] = useState<MockJournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate initial data loading
  useEffect(() => {
    const loadEntries = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Uncomment the line below to test error state
        // throw new Error('Failed to load journal entries from server');
        
        setEntries(mockJournalEntries);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load journal entries');
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, []);

  const refetch = () => {
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      try {
        // Uncomment to test error state
        // throw new Error('Failed to refresh journal entries');
        
        setEntries(mockJournalEntries);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to refresh journal entries');
        setLoading(false);
      }
    }, 400);
  };

  const stats = useMemo(() => {
    const totalEntries = entries.length;
    const totalAmount = entries.reduce((sum, entry) => sum + entry.amount, 0);
    const statusCounts = entries.reduce((counts, entry) => {
      counts[entry.status] = (counts[entry.status] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const recentEntries = entries
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      totalEntries,
      totalAmount,
      statusCounts,
      recentEntries,
      averageAmount: totalAmount / totalEntries || 0
    };
  }, [entries]);

  const addEntry = (entry: Omit<MockJournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: MockJournalEntry = {
      ...entry,
      id: `j${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEntries(prev => [newEntry, ...prev]);
    return newEntry;
  };

  const updateEntry = (id: string, updates: Partial<MockJournalEntry>) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id 
        ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
        : entry
    ));
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const getEntry = (id: string) => {
    return entries.find(entry => entry.id === id);
  };

  const filterEntries = (filters: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    amountMin?: number;
    amountMax?: number;
    search?: string;
  }) => {
    return entries.filter(entry => {
      if (filters.status && entry.status !== filters.status) return false;
      if (filters.dateFrom && entry.date < filters.dateFrom) return false;
      if (filters.dateTo && entry.date > filters.dateTo) return false;
      if (filters.amountMin && entry.amount < filters.amountMin) return false;
      if (filters.amountMax && entry.amount > filters.amountMax) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        return entry.description.toLowerCase().includes(search) ||
               entry.account.toLowerCase().includes(search) ||
               (entry.reference && entry.reference.toLowerCase().includes(search));
      }
      return true;
    });
  };

  return {
    entries,
    stats,
    loading,
    error,
    refetch,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntry,
    filterEntries,
    setEntries
  };
}

export type { MockJournalEntry };
