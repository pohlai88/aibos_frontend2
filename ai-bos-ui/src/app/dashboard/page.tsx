// src/app/dashboard/page.tsx
'use client';

import { useMockJournalEntries, useMockBalanceSheet, useMockIncomeStatement, useMockTimelineEvents } from '@/hooks/mocks';
import { LoadingWidgets, LoadingChart } from '@/components/UI/LoadingSkeletons';
import { ErrorBanner } from '@/components/UI/ErrorBanner';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useRole } from '@/context/RoleContext';

function DashboardContent() {
  const { canAccess } = useRole();
  const { stats: journalStats, loading: journalLoading, error: journalError, refetch: refetchJournal } = useMockJournalEntries();
  const { analysis: balanceAnalysis, loading: balanceLoading, error: balanceError, refetch: refetchBalance } = useMockBalanceSheet();
  const { analysis: incomeAnalysis, loading: incomeLoading, error: incomeError, refetch: refetchIncome } = useMockIncomeStatement();
  const { stats: timelineStats, loading: timelineLoading, error: timelineError, refetch: refetchTimeline } = useMockTimelineEvents();

  const isLoading = journalLoading || balanceLoading || incomeLoading || timelineLoading;
  const hasError = journalError || balanceError || incomeError || timelineError;
  const firstError = journalError || balanceError || incomeError || timelineError;

  // Handle loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
        <LoadingWidgets />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LoadingChart />
          <LoadingChart />
        </div>
      </div>
    );
  }

  // Handle error state
  if (hasError) {
    const handleRetryAll = () => {
      if (journalError) refetchJournal();
      if (balanceError) refetchBalance();
      if (incomeError) refetchIncome();
      if (timelineError) refetchTimeline();
    };

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-zinc-800">🏠 Dashboard</h1>
        <ErrorBanner 
          message={firstError!}
          onRetry={handleRetryAll}
        />
      </div>
    );
  }

  return (
    <main role="main" className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-zinc-800">🏠 Dashboard</h1>
      </header>
      
      {/* Key Metrics */}
      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="sr-only">Key Business Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" role="region" aria-label="Business metrics overview">
          <div className="bg-white p-4 rounded border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" tabIndex={0} role="article" aria-labelledby="entries-metric">
            <h3 id="entries-metric" className="font-semibold text-zinc-700 mb-2">📊 Total Entries</h3>
            <p className="text-2xl font-bold text-blue-600" aria-label={`${journalStats?.totalEntries || 0} journal entries`}>{journalStats?.totalEntries || 0}</p>
            <p className="text-sm text-zinc-600">Journal entries</p>
          </div>
          
          <div className="bg-white p-4 rounded border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" tabIndex={0} role="article" aria-labelledby="assets-metric">
            <h3 id="assets-metric" className="font-semibold text-zinc-700 mb-2">💰 Total Assets</h3>
            <p className="text-2xl font-bold text-green-600" aria-label={`$${balanceAnalysis?.assets.total.toLocaleString() || '0'} in total assets`}>${balanceAnalysis?.assets.total.toLocaleString() || '0'}</p>
            <p className="text-sm text-zinc-600">Balance sheet</p>
          </div>
          
          <div className="bg-white p-4 rounded border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" tabIndex={0} role="article" aria-labelledby="income-metric">
            <h3 id="income-metric" className="font-semibold text-zinc-700 mb-2">📈 Net Income</h3>
            <p className="text-2xl font-bold text-purple-600" aria-label={`$${incomeAnalysis?.profitability.netIncome.toLocaleString() || '0'} net income this period`}>${incomeAnalysis?.profitability.netIncome.toLocaleString() || '0'}</p>
            <p className="text-sm text-zinc-600">This period</p>
          </div>
          
          <div className="bg-white p-4 rounded border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" tabIndex={0} role="article" aria-labelledby="events-metric">
            <h3 id="events-metric" className="font-semibold text-zinc-700 mb-2">⚡ Recent Events</h3>
            <p className="text-2xl font-bold text-orange-600" aria-label={`${timelineStats?.totalEvents || 0} recent timeline activities`}>{timelineStats?.totalEvents || 0}</p>
            <p className="text-sm text-zinc-600">Timeline activities</p>
          </div>
        </div>
      </section>

      {/* Status Overview */}
      <section aria-labelledby="status-heading">
        <h2 id="status-heading" className="sr-only">Status Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="region" aria-label="Business status overview">
          <div className="bg-white p-6 rounded border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" tabIndex={0} role="article" aria-labelledby="journal-status">
            <h3 id="journal-status" className="font-semibold text-zinc-700 mb-4">📝 Journal Status</h3>
            <ul className="space-y-2" role="list">
              {Object.entries(journalStats?.statusCounts || {}).map(([status, count]) => (
                <li key={status} className="flex justify-between items-center">
                  <span className="capitalize text-zinc-600">{status}</span>
                  <span className="font-medium text-zinc-900" aria-label={`${count} entries with ${status} status`}>{count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" tabIndex={0} role="article" aria-labelledby="financial-health">
            <h3 id="financial-health" className="font-semibold text-zinc-700 mb-4">💼 Financial Health</h3>
            <dl className="space-y-2">
              <div className="flex justify-between items-center">
                <dt className="text-zinc-600">Current Ratio</dt>
                <dd className="font-medium text-zinc-900" aria-label={`Current ratio is ${balanceAnalysis?.ratios.currentRatio.toFixed(2) || '0.00'}`}>{balanceAnalysis?.ratios.currentRatio.toFixed(2) || '0.00'}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-zinc-600">Debt to Equity</dt>
                <dd className="font-medium text-zinc-900" aria-label={`Debt to equity ratio is ${balanceAnalysis?.ratios.debtToEquityRatio.toFixed(2) || '0.00'}`}>{balanceAnalysis?.ratios.debtToEquityRatio.toFixed(2) || '0.00'}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-zinc-600">Profit Margin</dt>
                <dd className="font-medium text-zinc-900" aria-label={`Profit margin is ${incomeAnalysis?.profitability.profitMargin.toFixed(1) || '0.0'} percent`}>{incomeAnalysis?.profitability.profitMargin.toFixed(1) || '0.0'}%</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section aria-labelledby="activity-heading">
        <div className="bg-white p-6 rounded border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" tabIndex={0} role="article">
          <h3 id="activity-heading" className="font-semibold text-zinc-700 mb-4">🔔 Recent Activity</h3>
          {journalStats?.recentEntries?.length > 0 ? (
            <ul className="space-y-3" role="list">
              {journalStats.recentEntries.slice(0, 5).map((entry) => (
                <li key={entry.id} className="flex items-center justify-between py-2 border-b last:border-b-0" role="listitem">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" aria-hidden="true"></div>
                    <div>
                      <p className="font-medium text-zinc-900">{entry.description}</p>
                      <p className="text-sm text-zinc-600">{entry.account}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-zinc-900" aria-label={`Amount: $${entry.amount.toLocaleString()}`}>${entry.amount.toLocaleString()}</p>
                    <p className="text-sm text-zinc-600">
                      <time dateTime={entry.date} aria-label={`Date: ${new Date(entry.date).toLocaleDateString()}`}>
                        {new Date(entry.date).toLocaleDateString()}
                      </time>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-zinc-500" role="status" aria-live="polite">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
