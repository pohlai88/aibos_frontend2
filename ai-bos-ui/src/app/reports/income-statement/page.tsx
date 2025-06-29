// src/app/reports/income-statement/page.tsx

'use client';

import { useMockIncomeStatement } from '@/hooks/mocks/useMockIncomeStatement';

export default function IncomeStatementPage() {
  const { data: incomeStatement, analysis, getItemsByCategory } = useMockIncomeStatement();

  const revenue = getItemsByCategory('revenue');
  const expenses = getItemsByCategory('expense');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Income Statement</h1>
        <p className="text-gray-600">
          For the period ending {incomeStatement ? new Date(incomeStatement.periodEnd).toLocaleDateString() : 'N/A'}
        </p>
      </div>

      {/* Revenue Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Revenue</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {revenue.map((item) => (
              <div key={item.name} className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.subcategory}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    ${item.amount.toLocaleString()}
                  </div>
                  {item.changePercent !== 0 && (
                    <div className={`text-sm ${
                      item.changePercent > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.changePercent > 0 ? '+' : ''}{item.changePercent}%
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total Revenue</span>
                <span className="text-green-600">${analysis?.revenue.total.toLocaleString() || '0'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Expenses</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {expenses.map((item) => (
              <div key={item.name} className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.subcategory}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    ${item.amount.toLocaleString()}
                  </div>
                  {item.changePercent !== 0 && (
                    <div className={`text-sm ${
                      item.changePercent > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {item.changePercent > 0 ? '+' : ''}{item.changePercent}%
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total Expenses</span>
                <span className="text-red-600">${analysis?.expenses.total.toLocaleString() || '0'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Net Income */}
      <div className={`rounded-lg shadow p-6 ${
        (analysis?.profitability.netIncome || 0) >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
      }`}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Net Income</h3>
          <div className={`text-3xl font-bold ${
            (analysis?.profitability.netIncome || 0) >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ${analysis?.profitability.netIncome.toLocaleString() || '0'}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            {(analysis?.profitability.netIncome || 0) >= 0 ? 'Profit' : 'Loss'} for the period
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {analysis?.profitability.profitMargin?.toFixed(1) || '0.0'}%
            </div>
            <div className="text-sm text-gray-600">Profit Margin</div>
            <div className="text-xs text-gray-500 mt-1">Net Income / Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {analysis?.profitability.expenseRatio?.toFixed(1) || '0.0'}%
            </div>
            <div className="text-sm text-gray-600">Expense Ratio</div>
            <div className="text-xs text-gray-500 mt-1">Total Expenses / Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {(analysis?.revenue.growthPercent || 0) > 0 ? '+' : ''}{analysis?.revenue.growthPercent?.toFixed(1) || '0.0'}%
            </div>
            <div className="text-sm text-gray-600">Revenue Growth</div>
            <div className="text-xs text-gray-500 mt-1">vs Previous Period</div>
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses Trend</h3>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <div>Chart visualization coming soon</div>
            <div className="text-sm mt-1">Interactive revenue and expense trends</div>
          </div>
        </div>
      </div>
    </div>
  );
}
