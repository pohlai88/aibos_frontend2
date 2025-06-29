// src/policy/types.ts

export type RoleType = 'super-admin' | 'admin' | 'finance' | 'auditor' | 'api-user';
export type SessionOrigin = 'web' | 'api' | 'automated' | 'mobile';

export type Action =
  | 'edit:journal'
  | 'view:revisions'
  | 'trigger:webhook'
  | 'access:admin-panel'
  | 'create:entry'
  | 'override:auditLock';

export type UXPolicy = Record<Action, boolean>;
