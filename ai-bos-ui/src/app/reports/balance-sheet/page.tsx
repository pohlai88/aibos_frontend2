// src/app/reports/balance-sheet/page.tsx

'use client';

import { useMockBalanceSheet } from '@/hooks/mocks/useMockBalanceSheet';

export default function BalanceSheetPage() {
  const { data: balanceSheet, analysis, getItemsByCategory, getBalanceCheck } = useMockBalanceSheet();

  const assets = getItemsByCategory('asset');
  const liabilities = getItemsByCategory('liability');
  const equity = getItemsByCategory('equity');
  const balanceCheck = getBalanceCheck();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Balance Sheet</h1>
        <p className="text-gray-600">As of {balanceSheet ? new Date(balanceSheet.asOfDate).toLocaleDateString() : 'N/A'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Assets</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {assets.map((asset) => (
                  <div key={asset.name} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">{asset.name}</div>
                      <div className="text-sm text-gray-500">{asset.subcategory}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        ${asset.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Total Assets</span>
                    <span>${analysis?.assets.total.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liabilities & Equity */}
        <div className="space-y-6">
          {/* Liabilities */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Liabilities</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {liabilities.map((liability) => (
                  <div key={liability.name} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">{liability.name}</div>
                      <div className="text-sm text-gray-500">{liability.subcategory}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        ${liability.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total Liabilities</span>
                    <span>${analysis?.liabilities.total.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Equity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Equity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {equity.map((equityItem) => (
                  <div key={equityItem.name} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">{equityItem.name}</div>
                      <div className="text-sm text-gray-500">{equityItem.subcategory}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        ${equityItem.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total Equity</span>
                    <span>${analysis?.equity.total.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Ratios */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Financial Ratios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{analysis?.ratios.currentRatio || '0.00'}</div>
            <div className="text-sm text-gray-600">Current Ratio</div>
            <div className="text-xs text-gray-500 mt-1">Current Assets / Current Liabilities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{analysis?.ratios.debtToEquityRatio || '0.00'}</div>
            <div className="text-sm text-gray-600">Debt-to-Equity</div>
            <div className="text-xs text-gray-500 mt-1">Total Debt / Total Equity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">${analysis?.ratios.workingCapital?.toLocaleString() || '0'}</div>
            <div className="text-sm text-gray-600">Working Capital</div>
            <div className="text-xs text-gray-500 mt-1">Current Assets - Current Liabilities</div>
          </div>
        </div>
      </div>

      {/* Balance Sheet Equation */}
      <div className={`border rounded-lg p-6 ${balanceCheck.isBalanced ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Balance Sheet Equation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">${analysis?.assets.total.toLocaleString() || '0'}</div>
            <div className="text-gray-700">Assets</div>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-gray-700 font-medium">=</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              ${((analysis?.liabilities.total || 0) + (analysis?.equity.total || 0)).toLocaleString()}
            </div>
            <div className="text-gray-700">Liabilities + Equity</div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className={`text-sm font-medium ${balanceCheck.isBalanced ? 'text-green-700' : 'text-red-700'}`}>
            {balanceCheck.isBalanced 
              ? '✓ Balance sheet is balanced' 
              : `⚠ Balance sheet is not balanced (difference: $${Math.abs(balanceCheck.difference).toLocaleString()})`}
          </div>
        </div>
      </div>
    </div>
  );
}
