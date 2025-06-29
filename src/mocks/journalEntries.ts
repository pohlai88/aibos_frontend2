// src/mocks/journalEntries.ts
export interface MockJournalEntry {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  amount: number;
  status: 'draft' | 'pending' | 'posted' | 'voided';
  account: string;
  reference?: string;
  revisionCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  attachments?: string[];
  feedback?: Array<{
    id: string;
    user: string;
    comment: string;
    timestamp: string;
    type: 'comment' | 'approval' | 'rejection';
  }>;
}

export const mockJournalEntries: MockJournalEntry[] = [
  {
    id: 'j001',
    date: '2024-12-10',
    description: 'Purchase of office chairs for workspace',
    debit: 500,
    credit: 0,
    amount: 500,
    status: 'draft',
    account: 'Office Equipment',
    reference: 'INV-2024-001',
    revisionCount: 1,
    createdBy: 'john.doe@company.com',
    createdAt: '2024-12-10T09:30:00Z',
    updatedAt: '2024-12-10T09:30:00Z',
    tags: ['furniture', 'office'],
    attachments: ['receipt-001.pdf'],
    feedback: [
      {
        id: 'f001',
        user: 'manager@company.com',
        comment: 'Please verify the vendor details',
        timestamp: '2024-12-10T10:15:00Z',
        type: 'comment'
      }
    ]
  },
  {
    id: 'j002',
    date: '2024-12-11',
    description: 'Client invoice payment - Project Alpha',
    debit: 0,
    credit: 1200,
    amount: 1200,
    status: 'posted',
    account: 'Accounts Receivable',
    reference: 'PAY-2024-045',
    revisionCount: 0,
    createdBy: 'jane.smith@company.com',
    createdAt: '2024-12-11T14:20:00Z',
    updatedAt: '2024-12-11T14:20:00Z',
    tags: ['revenue', 'client-alpha'],
    attachments: ['payment-confirmation.pdf']
  },
  {
    id: 'j003',
    date: '2024-12-12',
    description: 'Monthly software subscription - Accounting Tools',
    debit: 89,
    credit: 0,
    amount: 89,
    status: 'pending',
    account: 'Software Expenses',
    reference: 'SUB-2024-012',
    revisionCount: 2,
    createdBy: 'admin@company.com',
    createdAt: '2024-12-12T08:00:00Z',
    updatedAt: '2024-12-12T16:45:00Z',
    tags: ['software', 'recurring'],
    attachments: ['invoice-software.pdf'],
    feedback: [
      {
        id: 'f002',
        user: 'finance@company.com',
        comment: 'Approved for monthly recurring',
        timestamp: '2024-12-12T16:30:00Z',
        type: 'approval'
      }
    ]
  },
  {
    id: 'j004',
    date: '2024-12-13',
    description: 'Travel expenses - Client meeting',
    debit: 245,
    credit: 0,
    amount: 245,
    status: 'voided',
    account: 'Travel & Entertainment',
    reference: 'TRAVEL-2024-089',
    revisionCount: 1,
    createdBy: 'sales@company.com',
    createdAt: '2024-12-13T11:30:00Z',
    updatedAt: '2024-12-13T17:20:00Z',
    tags: ['travel', 'client'],
    attachments: ['receipts-travel.pdf'],
    feedback: [
      {
        id: 'f003',
        user: 'manager@company.com',
        comment: 'Voided - duplicate entry found',
        timestamp: '2024-12-13T17:15:00Z',
        type: 'rejection'
      }
    ]
  },
  {
    id: 'j005',
    date: '2024-12-14',
    description: 'Inventory purchase - Raw materials',
    debit: 850,
    credit: 0,
    amount: 850,
    status: 'posted',
    account: 'Inventory',
    reference: 'PO-2024-156',
    revisionCount: 0,
    createdBy: 'procurement@company.com',
    createdAt: '2024-12-14T10:15:00Z',
    updatedAt: '2024-12-14T10:15:00Z',
    tags: ['inventory', 'materials'],
    attachments: ['purchase-order.pdf', 'delivery-note.pdf']
  }
];

export default mockJournalEntries;
