// src/app/rules/page.tsx

'use client';

import { useMockRules } from '@/hooks/mocks/useMockRules';
import { useRole } from '@/context/useRole';
import { useState } from 'react';
import { LoadingStatsCard, LoadingRulesList } from '@/components/UI/LoadingSkeletons';
import { ErrorBanner } from '@/components/UI/ErrorBanner';

export default function RulesPage() {
  const { rules, stats, loading, error, refetch, toggleRuleStatus } = useMockRules();
  const { role } = useRole();
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredRules = filterStatus === 'all' 
    ? rules 
    : rules.filter(rule => rule.status === filterStatus);

  // Handle loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rules Manager</h1>
            <p className="text-gray-600">Manage automated validation and flagging rules</p>
          </div>
        </div>
        
        {/* Loading Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingStatsCard key={i} />
          ))}
        </div>

        {/* Loading Filters */}
        <div className="bg-white p-4 rounded-lg shadow animate-pulse">
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded-full w-16"></div>
            ))}
          </div>
        </div>

        {/* Loading Rules */}
        <LoadingRulesList />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <main role="main" className="space-y-6">
        <header>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Rules Manager</h1>
              <p className="text-gray-600">Manage automated validation and flagging rules</p>
            </div>
          </div>
        </header>
        
        <ErrorBanner 
          message={error}
          onRetry={refetch}
        />
      </main>
    );
  }

  const getRulePriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConditionTypeIcon = (type: string) => {
    switch (type) {
      case 'amount': return '💰';
      case 'account': return '📁';
      case 'pattern': return '🔍';
      case 'frequency': return '📊';
      default: return '⚙️';
    }
  };

  return (
    <main role="main" className="space-y-6">
      {/* Header */}
      <header>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rules Manager</h1>
            <p className="text-gray-600">Manage automated validation and flagging rules</p>
          </div>
          {(role === 'admin' || role === 'super-admin') && (
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
              aria-label="Create a new rule"
            >
              New Rule
            </button>
          )}
        </div>
      </header>

      {/* Stats Cards */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Rules Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6" role="region" aria-label="Rules statistics overview">
          <div className="bg-white p-6 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500" tabIndex={0} role="article" aria-labelledby="total-rules">
            <div className="text-2xl font-bold text-gray-900" aria-label={`${stats.totalRules} total rules`}>{stats.totalRules}</div>
            <div id="total-rules" className="text-sm text-gray-600">Total Rules</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500" tabIndex={0} role="article" aria-labelledby="active-rules">
            <div className="text-2xl font-bold text-green-600" aria-label={`${stats.activeRules} active rules`}>{stats.activeRules}</div>
            <div id="active-rules" className="text-sm text-gray-600">Active Rules</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500" tabIndex={0} role="article" aria-labelledby="inactive-rules">
            <div className="text-2xl font-bold text-gray-500" aria-label={`${stats.totalRules - stats.activeRules} inactive rules`}>{stats.totalRules - stats.activeRules}</div>
            <div id="inactive-rules" className="text-sm text-gray-600">Inactive Rules</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500" tabIndex={0} role="article" aria-labelledby="high-priority">
            <div className="text-2xl font-bold text-red-600" aria-label={`${stats.priorityCounts.high || 0} high priority rules`}>{stats.priorityCounts.high || 0}</div>
            <div id="high-priority" className="text-sm text-gray-600">High Priority</div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section aria-labelledby="filters-heading">
        <div className="bg-white p-4 rounded-lg shadow">
          <fieldset>
            <legend id="filters-heading" className="sr-only">Filter rules by status</legend>
            <div className="flex gap-2" role="radiogroup" aria-labelledby="filters-heading">
              {['all', 'active', 'inactive'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as any)}
                  role="radio"
                  aria-checked={filterStatus === status}
                  aria-label={`Filter by ${status} rules`}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      {/* Rules Grid */}
      <section aria-labelledby="rules-list-heading">
        <h2 id="rules-list-heading" className="sr-only">Rules List</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" role="region" aria-label="List of rules">
        {filteredRules.map((rule) => (
          <div key={rule.id} className={`bg-white rounded-lg shadow border-l-4 ${
            rule.status === 'active' ? 'border-l-green-500' : 'border-l-gray-400'
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{getConditionTypeIcon(rule.conditions[0]?.field || 'default')}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                      getRulePriorityColor(rule.priority)
                    }`}>
                      {rule.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{rule.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    rule.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-xs text-gray-500">
                    {rule.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Conditions */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="text-sm font-medium text-gray-700 mb-1">Conditions:</div>
                {rule.conditions.map((condition, index) => (
                  <div key={index} className="font-mono text-sm text-gray-900">
                    {condition.field} {condition.operator} {condition.value}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-1">Actions:</div>
                {rule.actions.map((action, index) => (
                  <div key={index} className="text-sm text-gray-900 mb-1">
                    <span className="font-medium">{action.type}:</span> {action.message}
                  </div>
                ))}
              </div>

              {/* Metadata */}
              <div className="text-xs text-gray-500 mb-4">
                <div>Created: {new Date(rule.createdAt).toLocaleDateString()}</div>
                <div>Applied: {rule.appliedCount} times</div>
                <div>Success rate: {rule.successRate.toFixed(1)}%</div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {(role === 'admin' || role === 'super-admin') && (
                    <>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Edit
                      </button>
                      <button 
                        onClick={() => toggleRuleStatus(rule.id)}
                        className={`text-sm font-medium ${
                          rule.status === 'active'
                            ? 'text-orange-600 hover:text-orange-800' 
                            : 'text-green-600 hover:text-green-800'
                        }`}
                      >
                        {rule.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </>
                  )}
                  <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                    View History
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>

        {/* Enhanced Empty State */}
        {filteredRules.length === 0 && (
          <div className="text-center py-16" role="status" aria-live="polite">
            <div className="text-gray-300 text-8xl mb-6" aria-hidden="true">⚖️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filterStatus === 'all' ? 'No rules created yet' : `No ${filterStatus} rules found`}
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {filterStatus === 'all' 
                ? 'Create your first rule to start automating validation and flagging processes.' 
                : `Try adjusting your filter or create a new ${filterStatus} rule.`}
            </p>
            {(role === 'admin' || role === 'super-admin') && (
              <div className="space-y-3">
                <button 
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
                  aria-label="Create your first rule"
                >
                  Create Your First Rule
                </button>
                {filterStatus !== 'all' && (
                  <div>
                    <button 
                      onClick={() => setFilterStatus('all')}
                      className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                      aria-label="View all rules"
                    >
                      View all rules
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
