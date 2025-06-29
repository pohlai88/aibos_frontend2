// src/mocks/incomeStatement.ts
export interface IncomeStatementItem {
  id: string;
  name: string;
  category: 'revenue' | 'expense';
  subcategory: string;
  amount: number;
  previousAmount: number;
  change: number;
  changePercent: number;
  budget?: number;
  variance?: number;
  details?: {
    account: string;
    description: string;
    amount: number;
  }[];
}

export interface MockIncomeStatement {
  periodStart: string;
  periodEnd: string;
  totalRevenue: number;
  totalExpenses: number;
  grossProfit: number;
  netIncome: number;
  items: IncomeStatementItem[];
}

export const mockIncomeStatement: MockIncomeStatement = {
  periodStart: '2024-12-01',
  periodEnd: '2024-12-15',
  totalRevenue: 45650,
  totalExpenses: 32180,
  grossProfit: 13470,
  netIncome: 13470,
  items: [
    // REVENUE
    {
      id: 'is001',
      name: 'Service Revenue',
      category: 'revenue',
      subcategory: 'Operating Revenue',
      amount: 38500,
      previousAmount: 35200,
      change: 3300,
      changePercent: 9.38,
      budget: 40000,
      variance: -1500,
      details: [
        {
          account: 'Consulting Services',
          description: 'Client consulting work',
          amount: 25000
        },
        {
          account: 'Project Management',
          description: 'PM services',
          amount: 13500
        }
      ]
    },
    {
      id: 'is002',
      name: 'Product Sales',
      category: 'revenue',
      subcategory: 'Operating Revenue',
      amount: 7150,
      previousAmount: 6800,
      change: 350,
      changePercent: 5.15,
      budget: 8000,
      variance: -850,
      details: [
        {
          account: 'Software Licenses',
          description: 'Software product sales',
          amount: 4650
        },
        {
          account: 'Hardware Sales',
          description: 'Equipment sales',
          amount: 2500
        }
      ]
    },
    // EXPENSES
    {
      id: 'is003',
      name: 'Salaries and Wages',
      category: 'expense',
      subcategory: 'Operating Expenses',
      amount: 18000,
      previousAmount: 17500,
      change: 500,
      changePercent: 2.86,
      budget: 18500,
      variance: 500,
      details: [
        {
          account: 'Employee Salaries',
          description: 'Regular staff salaries',
          amount: 15000
        },
        {
          account: 'Contractor Fees',
          description: 'Freelancer payments',
          amount: 3000
        }
      ]
    },
    {
      id: 'is004',
      name: 'Office Expenses',
      category: 'expense',
      subcategory: 'Operating Expenses',
      amount: 3450,
      previousAmount: 3200,
      change: 250,
      changePercent: 7.81,
      budget: 3500,
      variance: 50,
      details: [
        {
          account: 'Rent',
          description: 'Office space rental',
          amount: 2500
        },
        {
          account: 'Utilities',
          description: 'Electricity, internet, etc.',
          amount: 450
        },
        {
          account: 'Office Supplies',
          description: 'Stationery, equipment',
          amount: 500
        }
      ]
    },
    {
      id: 'is005',
      name: 'Software & Technology',
      category: 'expense',
      subcategory: 'Operating Expenses',
      amount: 2890,
      previousAmount: 2750,
      change: 140,
      changePercent: 5.09,
      budget: 3000,
      variance: 110,
      details: [
        {
          account: 'Software Subscriptions',
          description: 'SaaS tools and platforms',
          amount: 1890
        },
        {
          account: 'Cloud Services',
          description: 'AWS, hosting costs',
          amount: 1000
        }
      ]
    },
    {
      id: 'is006',
      name: 'Marketing & Advertising',
      category: 'expense',
      subcategory: 'Operating Expenses',
      amount: 4200,
      previousAmount: 3800,
      change: 400,
      changePercent: 10.53,
      budget: 4500,
      variance: 300,
      details: [
        {
          account: 'Digital Marketing',
          description: 'Online ads, SEO',
          amount: 2800
        },
        {
          account: 'Print Materials',
          description: 'Brochures, business cards',
          amount: 600
        },
        {
          account: 'Events & Trade Shows',
          description: 'Conference participation',
          amount: 800
        }
      ]
    },
    {
      id: 'is007',
      name: 'Travel & Entertainment',
      category: 'expense',
      subcategory: 'Operating Expenses',
      amount: 1840,
      previousAmount: 2100,
      change: -260,
      changePercent: -12.38,
      budget: 2000,
      variance: 160,
      details: [
        {
          account: 'Business Travel',
          description: 'Client visits, conferences',
          amount: 1340
        },
        {
          account: 'Client Entertainment',
          description: 'Client dinners, events',
          amount: 500
        }
      ]
    },
    {
      id: 'is008',
      name: 'Professional Services',
      category: 'expense',
      subcategory: 'Operating Expenses',
      amount: 1800,
      previousAmount: 1650,
      change: 150,
      changePercent: 9.09,
      budget: 2000,
      variance: 200,
      details: [
        {
          account: 'Legal Fees',
          description: 'Legal consultation',
          amount: 800
        },
        {
          account: 'Accounting Services',
          description: 'Bookkeeping, tax prep',
          amount: 700
        },
        {
          account: 'Insurance',
          description: 'Business insurance',
          amount: 300
        }
      ]
    }
  ]
};

export default mockIncomeStatement;
