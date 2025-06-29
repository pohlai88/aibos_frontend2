// src/mocks/timelineEvents.ts
export interface MockTimelineEvent {
  id: string;
  type: 'journal_created' | 'journal_updated' | 'journal_approved' | 'journal_rejected' | 'flag_created' | 'flag_resolved' | 'rule_applied' | 'user_action';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  entityId?: string;
  entityType?: 'journal' | 'rule' | 'flag' | 'user';
  metadata?: Record<string, any>;
  severity: 'low' | 'medium' | 'high';
  category: 'financial' | 'compliance' | 'system' | 'user';
}

export const mockTimelineEvents: MockTimelineEvent[] = [
  {
    id: 'evt001',
    type: 'journal_created',
    title: 'New Journal Entry Created',
    description: 'Inventory purchase - Raw materials (j005)',
    timestamp: '2024-12-14T10:15:00Z',
    user: 'procurement@company.com',
    entityId: 'j005',
    entityType: 'journal',
    severity: 'low',
    category: 'financial',
    metadata: {
      amount: 850,
      account: 'Inventory'
    }
  },
  {
    id: 'evt002',
    type: 'flag_created',
    title: 'High Value Transaction Flag',
    description: 'Entry j005 flagged for manager review',
    timestamp: '2024-12-14T10:20:00Z',
    user: 'system',
    entityId: 'flag005',
    entityType: 'flag',
    severity: 'medium',
    category: 'compliance',
    metadata: {
      ruleId: 'r001',
      entryId: 'j005',
      amount: 850
    }
  },
  {
    id: 'evt003',
    type: 'journal_rejected',
    title: 'Journal Entry Voided',
    description: 'Travel expenses entry (j004) voided as duplicate',
    timestamp: '2024-12-13T17:20:00Z',
    user: 'manager@company.com',
    entityId: 'j004',
    entityType: 'journal',
    severity: 'medium',
    category: 'financial',
    metadata: {
      reason: 'Duplicate entry found',
      originalAmount: 245
    }
  },
  {
    id: 'evt004',
    type: 'flag_resolved',
    title: 'Duplicate Flag Resolved',
    description: 'Duplicate detection flag resolved by voiding entry',
    timestamp: '2024-12-13T17:25:00Z',
    user: 'manager@company.com',
    entityId: 'flag003',
    entityType: 'flag',
    severity: 'low',
    category: 'compliance',
    metadata: {
      resolution: 'Entry voided as duplicate',
      entryId: 'j004'
    }
  },
  {
    id: 'evt005',
    type: 'journal_updated',
    title: 'Journal Entry Updated',
    description: 'Software subscription entry (j003) revised',
    timestamp: '2024-12-12T16:45:00Z',
    user: 'admin@company.com',
    entityId: 'j003',
    entityType: 'journal',
    severity: 'low',
    category: 'financial',
    metadata: {
      revisionCount: 2,
      changes: ['description', 'tags']
    }
  },
  {
    id: 'evt006',
    type: 'flag_resolved',
    title: 'Missing Reference Flag Dismissed',
    description: 'Reference number added to entry j003',
    timestamp: '2024-12-12T16:50:00Z',
    user: 'admin@company.com',
    entityId: 'flag002',
    entityType: 'flag',
    severity: 'low',
    category: 'compliance',
    metadata: {
      resolution: 'Reference added manually',
      entryId: 'j003'
    }
  },
  {
    id: 'evt007',
    type: 'journal_approved',
    title: 'High Value Transaction Approved',
    description: 'Client payment entry (j002) approved by manager',
    timestamp: '2024-12-11T15:10:00Z',
    user: 'manager@company.com',
    entityId: 'j002',
    entityType: 'journal',
    severity: 'medium',
    category: 'financial',
    metadata: {
      amount: 1200,
      approvalReason: 'Verified with client'
    }
  },
  {
    id: 'evt008',
    type: 'flag_resolved',
    title: 'High Value Flag Resolved',
    description: 'Manager approved high value transaction j002',
    timestamp: '2024-12-11T15:10:00Z',
    user: 'manager@company.com',
    entityId: 'flag004',
    entityType: 'flag',
    severity: 'low',
    category: 'compliance',
    metadata: {
      resolution: 'Approved by manager',
      entryId: 'j002'
    }
  },
  {
    id: 'evt009',
    type: 'journal_created',
    title: 'New Journal Entry Created',
    description: 'Client invoice payment - Project Alpha (j002)',
    timestamp: '2024-12-11T14:20:00Z',
    user: 'jane.smith@company.com',
    entityId: 'j002',
    entityType: 'journal',
    severity: 'low',
    category: 'financial',
    metadata: {
      amount: 1200,
      account: 'Accounts Receivable'
    }
  },
  {
    id: 'evt010',
    type: 'flag_created',
    title: 'High Value Transaction Flag',
    description: 'Entry j002 flagged for manager review',
    timestamp: '2024-12-11T14:25:00Z',
    user: 'system',
    entityId: 'flag004',
    entityType: 'flag',
    severity: 'medium',
    category: 'compliance',
    metadata: {
      ruleId: 'r001',
      entryId: 'j002',
      amount: 1200
    }
  },
  {
    id: 'evt011',
    type: 'user_action',
    title: 'Feedback Added',
    description: 'Manager added comment to office chairs entry',
    timestamp: '2024-12-10T10:15:00Z',
    user: 'manager@company.com',
    entityId: 'j001',
    entityType: 'journal',
    severity: 'low',
    category: 'user',
    metadata: {
      feedbackType: 'comment',
      comment: 'Please verify the vendor details'
    }
  },
  {
    id: 'evt012',
    type: 'flag_created',
    title: 'High Value Transaction Flag',
    description: 'Entry j001 flagged for manager review',
    timestamp: '2024-12-10T09:35:00Z',
    user: 'system',
    entityId: 'flag001',
    entityType: 'flag',
    severity: 'medium',
    category: 'compliance',
    metadata: {
      ruleId: 'r001',
      entryId: 'j001',
      amount: 500
    }
  }
];

export default mockTimelineEvents;
