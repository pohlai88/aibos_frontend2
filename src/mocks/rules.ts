// src/mocks/rules.ts
export interface MockRule {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  priority: 'high' | 'medium' | 'low';
  conditions: {
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'not_equals';
    value: string | number;
  }[];
  actions: {
    type: 'flag' | 'approve' | 'reject' | 'require_review';
    message: string;
    severity?: 'error' | 'warning' | 'info';
  }[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  appliedCount: number;
  successRate: number;
}

export const mockRules: MockRule[] = [
  {
    id: 'r001',
    name: 'High Value Transaction Review',
    description: 'Flag transactions over $1000 for manager review',
    status: 'active',
    priority: 'high',
    conditions: [
      {
        field: 'amount',
        operator: 'greater_than',
        value: 1000
      }
    ],
    actions: [
      {
        type: 'require_review',
        message: 'High value transaction requires manager approval',
        severity: 'warning'
      }
    ],
    createdBy: 'admin@company.com',
    createdAt: '2024-11-15T10:00:00Z',
    updatedAt: '2024-12-01T14:30:00Z',
    appliedCount: 23,
    successRate: 95.7
  },
  {
    id: 'r002',
    name: 'Duplicate Description Detection',
    description: 'Detect potential duplicate entries with same description',
    status: 'active',
    priority: 'medium',
    conditions: [
      {
        field: 'description',
        operator: 'equals',
        value: 'duplicate_check'
      }
    ],
    actions: [
      {
        type: 'flag',
        message: 'Potential duplicate entry detected',
        severity: 'warning'
      }
    ],
    createdBy: 'finance@company.com',
    createdAt: '2024-10-20T09:15:00Z',
    updatedAt: '2024-11-28T16:45:00Z',
    appliedCount: 12,
    successRate: 88.3
  },
  {
    id: 'r003',
    name: 'Missing Reference Check',
    description: 'Flag entries without reference numbers',
    status: 'active',
    priority: 'low',
    conditions: [
      {
        field: 'reference',
        operator: 'equals',
        value: ''
      }
    ],
    actions: [
      {
        type: 'flag',
        message: 'Reference number is missing',
        severity: 'info'
      }
    ],
    createdBy: 'auditor@company.com',
    createdAt: '2024-12-05T11:20:00Z',
    updatedAt: '2024-12-05T11:20:00Z',
    appliedCount: 8,
    successRate: 100
  },
  {
    id: 'r004',
    name: 'Weekend Entry Validation',
    description: 'Require additional approval for weekend entries',
    status: 'draft',
    priority: 'medium',
    conditions: [
      {
        field: 'created_day',
        operator: 'equals',
        value: 'weekend'
      }
    ],
    actions: [
      {
        type: 'require_review',
        message: 'Weekend entries require additional validation',
        severity: 'warning'
      }
    ],
    createdBy: 'manager@company.com',
    createdAt: '2024-12-10T13:45:00Z',
    updatedAt: '2024-12-10T13:45:00Z',
    appliedCount: 0,
    successRate: 0
  }
];

export default mockRules;
