import { RoleType } from '@/context/useRole';

export const viewPresets: Record<RoleType, { statusFilter: string; sortField: string; sortDirection: string }> = {
  finance: {
    statusFilter: 'pending',
    sortField: 'createdAt',
    sortDirection: 'asc',
  },
  auditor: {
    statusFilter: 'posted',
    sortField: 'revisionCount',
    sortDirection: 'desc',
  },
  admin: {
    statusFilter: 'all',
    sortField: 'amount',
    sortDirection: 'desc',
  },
  'api-user': {
    statusFilter: 'draft',
    sortField: 'createdAt',
    sortDirection: 'asc',
  },
  'super-admin': {
    statusFilter: 'all',
    sortField: 'revisionCount',
    sortDirection: 'desc',
  },
};
