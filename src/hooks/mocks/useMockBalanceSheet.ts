// src/hooks/mocks/useMockBalanceSheet.ts
import { useState, useMemo, useEffect } from 'react';
import { mockBalanceSheet, type MockBalanceSheet, type BalanceSheetItem } from '@/mocks/balanceSheet';

export function useMockBalanceSheet() {
  const [data, setData] = useState<MockBalanceSheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate initial data loading
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Uncomment the line below to test error state
        // throw new Error('Failed to load balance sheet from server');
        
        setData(mockBalanceSheet);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load balance sheet');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const refetch = () => {
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      try {
        // Uncomment to test error state
        // throw new Error('Failed to refresh balance sheet');
        
        setData(mockBalanceSheet);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to refresh balance sheet');
        setLoading(false);
      }
    }, 400);
  };

  const analysis = useMemo(() => {
    if (!data) return null;
    
    const assets = data.items.filter(item => item.category === 'asset');
    const liabilities = data.items.filter(item => item.category === 'liability');
    const equity = data.items.filter(item => item.category === 'equity');

    const currentAssets = assets.filter(item => item.subcategory === 'Current Assets');
    const fixedAssets = assets.filter(item => item.subcategory === 'Fixed Assets');
    const currentLiabilities = liabilities.filter(item => item.subcategory === 'Current Liabilities');
    const longTermLiabilities = liabilities.filter(item => item.subcategory === 'Long-term Liabilities');

    const currentRatio = currentAssets.reduce((sum, item) => sum + item.amount, 0) / 
                        currentLiabilities.reduce((sum, item) => sum + item.amount, 0);

    const debtToEquityRatio = data.totalLiabilities / data.totalEquity;

    const workingCapital = currentAssets.reduce((sum, item) => sum + item.amount, 0) - 
                          currentLiabilities.reduce((sum, item) => sum + item.amount, 0);

    return {
      assets: {
        current: currentAssets.reduce((sum, item) => sum + item.amount, 0),
        fixed: fixedAssets.reduce((sum, item) => sum + item.amount, 0),
        total: data.totalAssets
      },
      liabilities: {
        current: currentLiabilities.reduce((sum, item) => sum + item.amount, 0),
        longTerm: longTermLiabilities.reduce((sum, item) => sum + item.amount, 0),
        total: data.totalLiabilities
      },
      equity: {
        total: data.totalEquity
      },
      ratios: {
        currentRatio: Number(currentRatio.toFixed(2)),
        debtToEquityRatio: Number(debtToEquityRatio.toFixed(2)),
        workingCapital
      }
    };
  }, [data]);

  const getItemsByCategory = (category: 'asset' | 'liability' | 'equity') => {
    return data?.items.filter(item => item.category === category) || [];
  };

  const getItemsBySubcategory = (subcategory: string) => {
    return data?.items.filter(item => item.subcategory === subcategory) || [];
  };

  const getTotalByCategory = (category: 'asset' | 'liability' | 'equity') => {
    return data?.items
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + item.amount, 0) || 0;
  };

  const getBalanceCheck = () => {
    if (!data) return { isBalanced: false, difference: 0 };
    
    const balanceIsCorrect = Math.abs(data.totalAssets - (data.totalLiabilities + data.totalEquity)) < 0.01;
    return {
      isBalanced: balanceIsCorrect,
      difference: data.totalAssets - (data.totalLiabilities + data.totalEquity)
    };
  };

  return {
    data,
    analysis,
    loading,
    error,
    refetch,
    getItemsByCategory,
    getItemsBySubcategory,
    getTotalByCategory,
    getBalanceCheck
  };
}

export type { MockBalanceSheet, BalanceSheetItem };
