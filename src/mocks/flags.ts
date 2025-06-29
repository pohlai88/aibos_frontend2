// src/mocks/flags.ts
export interface MockFlag {
  id: string;
  entryId: string;
  ruleId: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  status: 'open' | 'dismissed' | 'resolved';
  field?: string;
  value?: string | number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  reviewedBy?: string;
  reviewedAt?: string;
  resolution?: string;
  metadata?: Record<string, any>;
}

export const mockFlags: MockFlag[] = [
  {
    id: 'flag001',
    entryId: 'j001',
    ruleId: 'r001',
    message: 'High value transaction requires manager approval',
    severity: 'warning',
    status: 'open',
    field: 'amount',
    value: 500,
    createdAt: '2024-12-10T09:35:00Z',
    updatedAt: '2024-12-10T09:35:00Z',
    createdBy: 'system',
    metadata: {
      threshold: 1000,
      actualValue: 500,
      triggerRule: 'High Value Transaction Review'
    }
  },
  {
    id: 'flag002',
    entryId: 'j003',
    ruleId: 'r003',
    message: 'Reference number is missing',
    severity: 'info',
    status: 'dismissed',
    field: 'reference',
    value: '',
    createdAt: '2024-12-12T08:05:00Z',
    updatedAt: '2024-12-12T16:50:00Z',
    createdBy: 'system',
    reviewedBy: 'admin@company.com',
    reviewedAt: '2024-12-12T16:50:00Z',
    resolution: 'Reference added manually',
    metadata: {
      triggerRule: 'Missing Reference Check'
    }
  },
  {
    id: 'flag003',
    entryId: 'j004',
    ruleId: 'r002',
    message: 'Potential duplicate entry detected',
    severity: 'warning',
    status: 'resolved',
    field: 'description',
    value: 'Travel expenses - Client meeting',
    createdAt: '2024-12-13T11:35:00Z',
    updatedAt: '2024-12-13T17:25:00Z',
    createdBy: 'system',
    reviewedBy: 'manager@company.com',
    reviewedAt: '2024-12-13T17:25:00Z',
    resolution: 'Entry voided as duplicate',
    metadata: {
      duplicateEntryId: 'j003',
      similarity: 0.95,
      triggerRule: 'Duplicate Description Detection'
    }
  },
  {
    id: 'flag004',
    entryId: 'j002',
    ruleId: 'r001',
    message: 'High value transaction requires manager approval',
    severity: 'warning',
    status: 'resolved',
    field: 'amount',
    value: 1200,
    createdAt: '2024-12-11T14:25:00Z',
    updatedAt: '2024-12-11T15:10:00Z',
    createdBy: 'system',
    reviewedBy: 'manager@company.com',
    reviewedAt: '2024-12-11T15:10:00Z',
    resolution: 'Approved by manager',
    metadata: {
      threshold: 1000,
      actualValue: 1200,
      triggerRule: 'High Value Transaction Review'
    }
  },
  {
    id: 'flag005',
    entryId: 'j005',
    ruleId: 'r001',
    message: 'High value transaction requires manager approval',
    severity: 'warning',
    status: 'open',
    field: 'amount',
    value: 850,
    createdAt: '2024-12-14T10:20:00Z',
    updatedAt: '2024-12-14T10:20:00Z',
    createdBy: 'system',
    metadata: {
      threshold: 1000,
      actualValue: 850,
      triggerRule: 'High Value Transaction Review'
    }
  }
];

export default mockFlags;
