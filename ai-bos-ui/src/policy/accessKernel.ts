// src/policy/accessKernel.ts

import { RoleType, SessionOrigin, UXPolicy } from './types';

export function computeAccessPolicy(
  role: RoleType,
  origin: SessionOrigin,
  flags: { isAuditMode?: boolean } = {}
): UXPolicy {
  const isSuper = role === 'super-admin';
  const isReadOnly = role === 'auditor' || origin === 'automated';
  const isWebAdmin = origin === 'web' && role === 'admin';

  return {
    'edit:journal': isSuper || (!isReadOnly && ['admin', 'finance'].includes(role)),
    'view:revisions': role !== 'api-user',
    'trigger:webhook': isSuper || isWebAdmin,
    'access:admin-panel': isSuper || role === 'admin',
    'create:entry': !isReadOnly,
    'override:auditLock': isSuper && flags.isAuditMode === true,
  };
}
