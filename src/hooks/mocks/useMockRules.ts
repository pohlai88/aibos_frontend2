// src/hooks/mocks/useMockRules.ts
import { useState, useMemo, useEffect } from 'react';
import { mockRules, type MockRule } from '@/mocks/rules';

export function useMockRules() {
  const [rules, setRules] = useState<MockRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate initial data loading
  useEffect(() => {
    const loadRules = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Uncomment the line below to test error state
        // throw new Error('Failed to load rules from server');
        
        setRules(mockRules);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load rules');
      } finally {
        setLoading(false);
      }
    };

    loadRules();
  }, []);

  const refetch = () => {
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      try {
        // Uncomment to test error state
        // throw new Error('Failed to refresh rules');
        
        setRules(mockRules);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to refresh rules');
        setLoading(false);
      }
    }, 500);
  };

  const stats = useMemo(() => {
    const totalRules = rules.length;
    const activeRules = rules.filter(rule => rule.status === 'active').length;
    const totalApplications = rules.reduce((sum, rule) => sum + rule.appliedCount, 0);
    const averageSuccessRate = rules.reduce((sum, rule) => sum + rule.successRate, 0) / totalRules || 0;

    const priorityCounts = rules.reduce((counts, rule) => {
      counts[rule.priority] = (counts[rule.priority] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    return {
      totalRules,
      activeRules,
      totalApplications,
      averageSuccessRate,
      priorityCounts
    };
  }, [rules]);

  const addRule = (rule: Omit<MockRule, 'id' | 'createdAt' | 'updatedAt' | 'appliedCount' | 'successRate'>) => {
    const newRule: MockRule = {
      ...rule,
      id: `r${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      appliedCount: 0,
      successRate: 0,
    };
    setRules(prev => [newRule, ...prev]);
    return newRule;
  };

  const updateRule = (id: string, updates: Partial<MockRule>) => {
    setRules(prev => prev.map(rule => 
      rule.id === id 
        ? { ...rule, ...updates, updatedAt: new Date().toISOString() }
        : rule
    ));
  };

  const deleteRule = (id: string) => {
    setRules(prev => prev.filter(rule => rule.id !== id));
  };

  const getRule = (id: string) => {
    return rules.find(rule => rule.id === id);
  };

  const getActiveRules = () => {
    return rules.filter(rule => rule.status === 'active');
  };

  const toggleRuleStatus = (id: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === id 
        ? { 
            ...rule, 
            status: rule.status === 'active' ? 'inactive' : 'active',
            updatedAt: new Date().toISOString()
          }
        : rule
    ));
  };

  return {
    rules,
    stats,
    loading,
    error,
    refetch,
    addRule,
    updateRule,
    deleteRule,
    getRule,
    getActiveRules,
    toggleRuleStatus,
    setRules
  };
}

export type { MockRule };
