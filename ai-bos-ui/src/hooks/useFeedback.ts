'use client';

import { useState, useEffect, useCallback } from 'react';
// TODO: Uncomment when API is ready
// import { authenticatedFetch, useAuth } from '@/context/AuthContext';

export interface Feedback {
  id: string;
  entryId: string;
  tenantId: string;
  comment: string;
  category: 'documentation' | 'compliance' | 'accuracy' | 'process' | 'other';
  actor: string;
  actorName?: string;
  actorRole?: string;
  createdAt: string;
  updatedAt: string;
  resolved?: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface CreateFeedbackRequest {
  entryId: string;
  comment: string;
  category: 'documentation' | 'compliance' | 'accuracy' | 'process' | 'other';
}

export interface UpdateFeedbackRequest {
  comment?: string;
  category?: 'documentation' | 'compliance' | 'accuracy' | 'process' | 'other';
  resolved?: boolean;
}

export interface FeedbackResponse {
  feedback: Feedback[];
  count: number;
}

// Mock data for demonstration - TODO: Replace with API integration
const mockFeedbackData: Feedback[] = [
  {
    id: 'fb_001',
    entryId: 'je_demo_001',
    tenantId: 'tenant-demo-123',
    comment: 'Missing invoice reference number. Please attach INV-2024-001 documentation.',
    category: 'documentation',
    actor: 'auditor@company.com',
    actorName: 'Sarah Chen',
    actorRole: 'Senior Auditor',
    createdAt: '2024-12-15T10:30:00Z',
    updatedAt: '2024-12-15T10:30:00Z',
  },
  {
    id: 'fb_002',
    entryId: 'je_demo_001',
    tenantId: 'tenant-demo-123',
    comment: 'Amount verification completed. Matches bank statement.',
    category: 'accuracy',
    actor: 'reviewer@company.com',
    actorName: 'Mike Johnson',
    actorRole: 'Finance Manager',
    createdAt: '2024-12-15T14:15:00Z',
    updatedAt: '2024-12-15T14:15:00Z',
    resolved: true,
    resolvedBy: 'reviewer@company.com',
    resolvedAt: '2024-12-15T14:15:00Z',
  },
  {
    id: 'fb_003',
    entryId: 'je_demo_002',
    tenantId: 'tenant-demo-123',
    comment: 'Please verify the account classification. Should this be under Operating Expenses?',
    category: 'compliance',
    actor: 'controller@company.com',
    actorName: 'Lisa Rodriguez',
    actorRole: 'Controller',
    createdAt: '2024-12-16T09:45:00Z',
    updatedAt: '2024-12-16T09:45:00Z',
  },
];

export function useFeedback(entryId?: string, options?: { resolved?: boolean }) {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // TODO: Uncomment when API is ready
  // const { isAuthenticated } = useAuth();

  const fetchFeedback = useCallback(async () => {
    // TODO: Uncomment when API is ready
    // if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for now (replace with API call later)
      const mockFeedback: Feedback[] = entryId ? [
        {
          id: 'fb_001',
          entryId: entryId,
          tenantId: 'tenant-demo-123',
          comment: 'This entry needs an invoice reference number for compliance audit.',
          category: 'documentation' as const,
          actor: 'auditor@company.com',
          actorName: 'Sarah Johnson',
          createdAt: '2024-12-15T14:30:00Z',
          updatedAt: '2024-12-15T14:30:00Z',
          resolved: false,
        },
        {
          id: 'fb_002',
          entryId: entryId,
          tenantId: 'tenant-demo-123',
          comment: 'Amount looks correct, but can we verify the vendor details?',
          category: 'accuracy' as const,
          actor: 'reviewer@company.com',
          actorName: 'Mike Chen',
          createdAt: '2024-12-15T15:45:00Z',
          updatedAt: '2024-12-15T15:45:00Z',
          resolved: false,
        },
        {
          id: 'fb_003',
          entryId: entryId,
          tenantId: 'tenant-demo-123',
          comment: 'Updated with proper documentation. Ready for approval.',
          category: 'process' as const,
          actor: 'bookkeeper@company.com',
          actorName: 'Emma Davis',
          createdAt: '2024-12-16T09:15:00Z',
          updatedAt: '2024-12-16T09:15:00Z',
          resolved: true,
          resolvedBy: 'supervisor@company.com',
          resolvedAt: '2024-12-16T10:00:00Z',
        }
      ].filter(f => options?.resolved === undefined || f.resolved === options.resolved) : [];
      
      setFeedback(mockFeedback);
      
      /* Real API implementation:
      const params = new URLSearchParams();
      if (entryId) params.append('entryId', entryId);
      if (options?.resolved !== undefined) params.append('resolved', options.resolved.toString());
      
      const url = `/api/feedback${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await authenticatedFetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to fetch feedback');
      }
      
      const result: FeedbackResponse = await response.json();
      setFeedback(result.feedback);
      */
      
    } catch (err) {
      console.error('Failed to fetch feedback:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch feedback');
    } finally {
      setLoading(false);
    }
  }, [entryId, options?.resolved]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const createFeedback = async (feedbackData: CreateFeedbackRequest) => {
    try {
      // TODO: Replace with actual API call when ready
      /*
      const response = await authenticatedFetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create feedback');
      }
      
      const newFeedback: Feedback = await response.json();
      */
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newFeedback: Feedback = {
        id: `fb_${Date.now()}`,
        entryId: feedbackData.entryId,
        tenantId: 'tenant-demo-123',
        comment: feedbackData.comment,
        category: feedbackData.category,
        actor: 'current-user@company.com',
        actorName: 'Current User',
        actorRole: 'User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setFeedback(prev => [newFeedback, ...prev]);
      return newFeedback;
      
    } catch (err) {
      console.error('Failed to create feedback:', err);
      throw err instanceof Error ? err : new Error('Failed to create feedback');
    }
  };

  const updateFeedback = async (id: string, updates: UpdateFeedbackRequest) => {
    try {
      // TODO: Replace with actual API call when ready
      /*
      const response = await authenticatedFetch(`/api/feedback/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to update feedback');
      }
      
      const updatedFeedback: Feedback = await response.json();
      */
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const existingFeedback = feedback.find(f => f.id === id);
      if (!existingFeedback) {
        throw new Error('Feedback not found');
      }
      
      const updatedFeedback: Feedback = {
        ...existingFeedback,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      // Update local state
      setFeedback(prev => prev.map(f => f.id === id ? updatedFeedback : f));
      
      return updatedFeedback;
    } catch (err) {
      console.error('Failed to update feedback:', err);
      throw err instanceof Error ? err : new Error('Failed to update feedback');
    }
  };

  const deleteFeedback = async (id: string) => {
    try {
      // TODO: Replace with actual API call when ready
      /*
      const response = await authenticatedFetch(`/api/feedback/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to delete feedback');
      }
      */
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Update local state
      setFeedback(prev => prev.filter(f => f.id !== id));
      
      return true;
    } catch (err) {
      console.error('Failed to delete feedback:', err);
      throw err instanceof Error ? err : new Error('Failed to delete feedback');
    }
  };

  const resolveFeedback = async (id: string) => {
    return updateFeedback(id, { resolved: true });
  };

  const unresoleFeedback = async (id: string) => {
    return updateFeedback(id, { resolved: false });
  };

  return {
    feedback,
    loading,
    error,
    refetch: fetchFeedback,
    createFeedback,
    updateFeedback,
    deleteFeedback,
    resolveFeedback,
    unresoleFeedback,
  };
}
