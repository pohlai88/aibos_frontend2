// src/app/timeline/page.tsx

'use client';

import { useMockTimelineEvents } from '@/hooks/mocks/useMockTimelineEvents';
import { useState } from 'react';

export default function TimelinePage() {
  const { events, stats, filterEvents } = useMockTimelineEvents();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const filteredEvents = filterEvents({
    type: selectedType === 'all' ? undefined : selectedType as any,
    severity: selectedSeverity === 'all' ? undefined : selectedSeverity as any,
  });

  const getEventIcon = (type: string, severity?: string) => {
    switch (type) {
      case 'transaction': return '💰';
      case 'audit': return '🔍';
      case 'approval': return '✅';
      case 'rejection': return '❌';
      case 'system': return '⚙️';
      case 'user': return '👤';
      default: return '📝';
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const eventDate = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - eventDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return eventDate.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activity Timeline</h1>
        <p className="text-gray-600">Chronological view of all system events and activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{stats.totalEvents}</div>
          <div className="text-sm text-gray-600">Total Events</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.categories.financial || 0}</div>
          <div className="text-sm text-gray-600">Financial</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{stats.categories.compliance || 0}</div>
          <div className="text-sm text-gray-600">Compliance</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{stats.eventTypes.journal_created || 0}</div>
          <div className="text-sm text-gray-600">Journal Entries</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            <span className="text-sm font-medium text-gray-700">Type:</span>
            {['all', 'journal_created', 'journal_updated', 'flag_created', 'rule_applied', 'user_action'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {type === 'all' ? 'All' : type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <span className="text-sm font-medium text-gray-700">Severity:</span>
            {['all', 'high', 'medium', 'low'].map((severity) => (
              <button
                key={severity}
                onClick={() => setSelectedSeverity(severity)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedSeverity === severity
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flow-root">
            <ul className="-mb-8">
              {filteredEvents.map((event, eventIdx) => (
                <li key={event.id}>
                  <div className="relative pb-8">
                    {eventIdx !== filteredEvents.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                          <span className="text-sm">
                            {getEventIcon(event.type, event.severity)}
                          </span>
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-start gap-2">
                              <p className="text-sm font-medium text-gray-900">{event.title}</p>
                              {event.severity && (
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                                  getSeverityColor(event.severity)
                                }`}>
                                  {event.severity}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                              <span>👤 {event.user}</span>
                              <span>📝 {event.category}</span>
                              {event.entityId && (
                                <span>🔗 {event.entityType}: {event.entityId}</span>
                              )}
                            </div>
                            {event.metadata && Object.keys(event.metadata).length > 0 && (
                              <div className="mt-2 bg-gray-50 rounded p-2">
                                <div className="text-xs text-gray-600">
                                  {Object.entries(event.metadata).map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                      <span className="font-medium">{key}:</span>
                                      <span>{String(value)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              {getTimeAgo(event.timestamp)}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(event.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">⏰</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-500">
            {selectedType !== 'all' || selectedSeverity !== 'all'
              ? 'Try adjusting your filters to see more events.'
              : 'No timeline events have been recorded yet.'}
          </p>
        </div>
      )}
    </div>
  );
}
