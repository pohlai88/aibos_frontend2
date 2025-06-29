// src/mocks/balanceSheet.ts
export interface BalanceSheetItem {
  id: string;
  name: string;
  category: 'asset' | 'liability' | 'equity';
  subcategory: string;
  amount: number;
  previousAmount: number;
  change: number;
  changePercent: number;
  details?: {
    account: string;
    description: string;
    lastUpdated: string;
  }[];
}

export interface MockBalanceSheet {
  asOfDate: string;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  items: BalanceSheetItem[];
}

export const mockBalanceSheet: MockBalanceSheet = {
  asOfDate: '2024-12-15',
  totalAssets: 125750,
  totalLiabilities: 38200,
  totalEquity: 87550,
  items: [
    // ASSETS
    {
      id: 'bs001',
      name: 'Cash and Cash Equivalents',
      category: 'asset',
      subcategory: 'Current Assets',
      amount: 45000,
      previousAmount: 42000,
      change: 3000,
      changePercent: 7.14,
      details: [
        {
          account: 'Checking Account',
          description: 'Primary business checking',
          lastUpdated: '2024-12-15T09:00:00Z'
        },
        {
          account: 'Savings Account',
          description: 'Emergency fund',
          lastUpdated: '2024-12-15T09:00:00Z'
        }
      ]
    },
    {
      id: 'bs002',
      name: 'Accounts Receivable',
      category: 'asset',
      subcategory: 'Current Assets',
      amount: 28500,
      previousAmount: 31200,
      change: -2700,
      changePercent: -8.65,
      details: [
        {
          account: 'Trade Receivables',
          description: 'Outstanding invoices',
          lastUpdated: '2024-12-14T17:30:00Z'
        }
      ]
    },
    {
      id: 'bs003',
      name: 'Inventory',
      category: 'asset',
      subcategory: 'Current Assets',
      amount: 15750,
      previousAmount: 14800,
      change: 950,
      changePercent: 6.42,
      details: [
        {
          account: 'Raw Materials',
          description: 'Production materials',
          lastUpdated: '2024-12-14T10:15:00Z'
        }
      ]
    },
    {
      id: 'bs004',
      name: 'Property, Plant & Equipment',
      category: 'asset',
      subcategory: 'Fixed Assets',
      amount: 36500,
      previousAmount: 37000,
      change: -500,
      changePercent: -1.35,
      details: [
        {
          account: 'Office Equipment',
          description: 'Computers, furniture, etc.',
          lastUpdated: '2024-12-10T09:30:00Z'
        }
      ]
    },
    // LIABILITIES
    {
      id: 'bs005',
      name: 'Accounts Payable',
      category: 'liability',
      subcategory: 'Current Liabilities',
      amount: 18200,
      previousAmount: 16800,
      change: 1400,
      changePercent: 8.33,
      details: [
        {
          account: 'Trade Payables',
          description: 'Vendor invoices',
          lastUpdated: '2024-12-13T14:20:00Z'
        }
      ]
    },
    {
      id: 'bs006',
      name: 'Accrued Expenses',
      category: 'liability',
      subcategory: 'Current Liabilities',
      amount: 12000,
      previousAmount: 11500,
      change: 500,
      changePercent: 4.35,
      details: [
        {
          account: 'Payroll Accruals',
          description: 'Unpaid salaries and benefits',
          lastUpdated: '2024-12-15T08:00:00Z'
        }
      ]
    },
    {
      id: 'bs007',
      name: 'Long-term Debt',
      category: 'liability',
      subcategory: 'Long-term Liabilities',
      amount: 8000,
      previousAmount: 8500,
      change: -500,
      changePercent: -5.88,
      details: [
        {
          account: 'Equipment Loan',
          description: 'Equipment financing',
          lastUpdated: '2024-12-01T10:00:00Z'
        }
      ]
    },
    // EQUITY
    {
      id: 'bs008',
      name: 'Owner\'s Capital',
      category: 'equity',
      subcategory: 'Equity',
      amount: 75000,
      previousAmount: 75000,
      change: 0,
      changePercent: 0,
      details: [
        {
          account: 'Initial Investment',
          description: 'Owner\'s initial contribution',
          lastUpdated: '2024-01-01T00:00:00Z'
        }
      ]
    },
    {
      id: 'bs009',
      name: 'Retained Earnings',
      category: 'equity',
      subcategory: 'Equity',
      amount: 12550,
      previousAmount: 10200,
      change: 2350,
      changePercent: 23.04,
      details: [
        {
          account: 'Accumulated Earnings',
          description: 'Profit retained in business',
          lastUpdated: '2024-12-15T18:00:00Z'
        }
      ]
    }
  ]
};

export default mockBalanceSheet;
