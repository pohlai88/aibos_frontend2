// src/hooks/mocks/useMockTimelineEvents.ts
import { useState, useMemo, useEffect } from 'react';
import { mockTimelineEvents, type MockTimelineEvent } from '@/mocks/timelineEvents';

export function useMockTimelineEvents() {
  const [events, setEvents] = useState<MockTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate initial data loading
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 550));
        
        // Uncomment the line below to test error state
        // throw new Error('Failed to load timeline events from server');
        
        setEvents(mockTimelineEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load timeline events');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const refetch = () => {
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      try {
        // Uncomment to test error state
        // throw new Error('Failed to refresh timeline events');
        
        setEvents(mockTimelineEvents);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to refresh timeline events');
        setLoading(false);
      }
    }, 300);
  };

  const stats = useMemo(() => {
    const totalEvents = events.length;
    const eventTypes = events.reduce((counts, event) => {
      counts[event.type] = (counts[event.type] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const categories = events.reduce((counts, event) => {
      counts[event.category] = (counts[event.category] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const severityLevels = events.reduce((counts, event) => {
      counts[event.severity] = (counts[event.severity] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const recentEvents = events
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    return {
      totalEvents,
      eventTypes,
      categories,
      severityLevels,
      recentEvents
    };
  }, [events]);

  const addEvent = (event: Omit<MockTimelineEvent, 'id' | 'timestamp'>) => {
    const newEvent: MockTimelineEvent = {
      ...event,
      id: `evt${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setEvents(prev => [newEvent, ...prev]);
    return newEvent;
  };

  const getEventsByType = (type: MockTimelineEvent['type']) => {
    return events.filter(event => event.type === type);
  };

  const getEventsByCategory = (category: MockTimelineEvent['category']) => {
    return events.filter(event => event.category === category);
  };

  const getEventsBySeverity = (severity: MockTimelineEvent['severity']) => {
    return events.filter(event => event.severity === severity);
  };

  const getEventsByUser = (user: string) => {
    return events.filter(event => event.user === user);
  };

  const getEventsByEntity = (entityId: string, entityType?: string) => {
    return events.filter(event => 
      event.entityId === entityId && 
      (!entityType || event.entityType === entityType)
    );
  };

  const filterEvents = (filters: {
    type?: MockTimelineEvent['type'];
    category?: MockTimelineEvent['category'];
    severity?: MockTimelineEvent['severity'];
    user?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }) => {
    return events.filter(event => {
      if (filters.type && event.type !== filters.type) return false;
      if (filters.category && event.category !== filters.category) return false;
      if (filters.severity && event.severity !== filters.severity) return false;
      if (filters.user && event.user !== filters.user) return false;
      if (filters.dateFrom && event.timestamp < filters.dateFrom) return false;
      if (filters.dateTo && event.timestamp > filters.dateTo) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        return event.title.toLowerCase().includes(search) ||
               event.description.toLowerCase().includes(search) ||
               event.user.toLowerCase().includes(search);
      }
      return true;
    });
  };

  const getRecentActivity = (limit: number = 5) => {
    return events
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  };

  return {
    events,
    stats,
    loading,
    error,
    refetch,
    addEvent,
    getEventsByType,
    getEventsByCategory,
    getEventsBySeverity,
    getEventsByUser,
    getEventsByEntity,
    filterEvents,
    getRecentActivity,
    setEvents
  };
}

export type { MockTimelineEvent };
