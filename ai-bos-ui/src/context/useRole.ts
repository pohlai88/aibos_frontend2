// src/context/useRole.ts

export type RoleType = 'admin' | 'finance' | 'auditor' | 'api-user';

export function useRole(): RoleType {
  // 🔒 In production, get this from auth context or session
  return 'auditor'; // Change this to test behavior
}
