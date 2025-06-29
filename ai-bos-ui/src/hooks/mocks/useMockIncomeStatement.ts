// src/hooks/mocks/useMockIncomeStatement.ts
import { useState, useMemo, useEffect } from 'react';
import { mockIncomeStatement, type MockIncomeStatement, type IncomeStatementItem } from '@/mocks/incomeStatement';

export function useMockIncomeStatement() {
  const [data, setData] = useState<MockIncomeStatement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate initial data loading
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 650));
        
        // Uncomment the line below to test error state
        // throw new Error('Failed to load income statement from server');
        
        setData(mockIncomeStatement);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load income statement');
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
        // throw new Error('Failed to refresh income statement');
        
        setData(mockIncomeStatement);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to refresh income statement');
        setLoading(false);
      }
    }, 400);
  };

  const analysis = useMemo(() => {
    if (!data) return null;
    const revenue = data.items.filter(item => item.category === 'revenue');
    const expenses = data.items.filter(item => item.category === 'expense');

    const totalBudgetRevenue = revenue.reduce((sum, item) => sum + (item.budget || 0), 0);
    const totalBudgetExpenses = expenses.reduce((sum, item) => sum + (item.budget || 0), 0);
    const budgetNetIncome = totalBudgetRevenue - totalBudgetExpenses;
    const budgetVariance = data.netIncome - budgetNetIncome;

    const profitMargin = data.totalRevenue > 0 ? (data.netIncome / data.totalRevenue) * 100 : 0;
    const expenseRatio = data.totalRevenue > 0 ? (data.totalExpenses / data.totalRevenue) * 100 : 0;

    const growthMetrics = {
      revenueGrowth: revenue.reduce((sum, item) => sum + item.change, 0),
      expenseGrowth: expenses.reduce((sum, item) => sum + item.change, 0),
      revenueGrowthPercent: revenue.length > 0 ? 
        revenue.reduce((sum, item) => sum + item.changePercent, 0) / revenue.length : 0,
      expenseGrowthPercent: expenses.length > 0 ? 
        expenses.reduce((sum, item) => sum + item.changePercent, 0) / expenses.length : 0
    };

    return {
      revenue: {
        total: data.totalRevenue,
        budget: totalBudgetRevenue,
        variance: data.totalRevenue - totalBudgetRevenue,
        growth: growthMetrics.revenueGrowth,
        growthPercent: growthMetrics.revenueGrowthPercent
      },
      expenses: {
        total: data.totalExpenses,
        budget: totalBudgetExpenses,
        variance: data.totalExpenses - totalBudgetExpenses,
        growth: growthMetrics.expenseGrowth,
        growthPercent: growthMetrics.expenseGrowthPercent
      },
      profitability: {
        grossProfit: data.grossProfit,
        netIncome: data.netIncome,
        profitMargin: Number(profitMargin.toFixed(2)),
        expenseRatio: Number(expenseRatio.toFixed(2))
      },
      budget: {
        budgetNetIncome,
        budgetVariance,
        budgetAccuracy: budgetNetIncome > 0 ? (data.netIncome / budgetNetIncome) * 100 : 0
      }
    };
  }, [data]);

  const getItemsByCategory = (category: 'revenue' | 'expense') => {
    return data?.items.filter(item => item.category === category) || [];
  };

  const getItemsBySubcategory = (subcategory: string) => {
    return data?.items.filter(item => item.subcategory === subcategory) || [];
  };

  const getTotalByCategory = (category: 'revenue' | 'expense') => {
    return data?.items
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + item.amount, 0) || 0;
  };

  const getTopPerformers = (category: 'revenue' | 'expense', limit: number = 5) => {
    return data?.items
      .filter(item => item.category === category)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit) || [];
  };

  const getBudgetVarianceAnalysis = () => {
    if (!data) return { totalVariance: 0, positiveVariances: 0, negativeVariances: 0, largestPositiveVariance: 0, largestNegativeVariance: 0 };
    
    const itemsWithBudget = data.items.filter(item => item.budget !== undefined);
    const totalVariance = itemsWithBudget.reduce((sum, item) => sum + (item.variance || 0), 0);
    const positiveVariances = itemsWithBudget.filter(item => (item.variance || 0) > 0);
    const negativeVariances = itemsWithBudget.filter(item => (item.variance || 0) < 0);

    return {
      totalVariance,
      positiveVariances: positiveVariances.length,
      negativeVariances: negativeVariances.length,
      largestPositiveVariance: Math.max(...positiveVariances.map(item => item.variance || 0), 0),
      largestNegativeVariance: Math.min(...negativeVariances.map(item => item.variance || 0), 0)
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
    getTopPerformers,
    getBudgetVarianceAnalysis
  };
}

export type { MockIncomeStatement, IncomeStatementItem };
