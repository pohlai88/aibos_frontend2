// src/policy/useAccessPolicy.tsx

import { useRole } from '@/context/useRole';
import { useSessionOrigin } from '@/context/SessionOriginContext';
import { computeAccessPolicy } from './accessKernel';

export function useAccessPolicy() {
  const role = useRole();
  const origin = useSessionOrigin();
  const policy = computeAccessPolicy(role, origin);

  return policy;
}
