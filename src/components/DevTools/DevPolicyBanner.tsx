// src/components/DevTools/DevPolicyBanner.tsx

'use client';

import { useRole } from '@/context/useRole';
import { useSessionOrigin } from '@/context/SessionOriginContext';
import { useAccessPolicy } from '@/policy/useAccessPolicy';
import { createSnapshot } from '@/utils/sessionSnapshot';

export const DevPolicyBanner = () => {
  const { role } = useRole();
  const { origin } = useSessionOrigin();
  const policy = useAccessPolicy();

  if (process.env.NODE_ENV !== 'development') return null;

  function handleCreateSnapshot({ role, origin, policy }: { role: string; origin: string; policy: any }) {
    const payload = createSnapshot({
      role,
      origin,
      filters: {},
      policy,
      entries: [],
    });

    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-snapshot-${Date.now()}.json`;
    a.click();
  }

  return (
    <div className="fixed bottom-0 inset-x-0 bg-zinc-900 text-zinc-100 text-xs px-4 py-1 flex flex-wrap gap-3 items-center justify-between z-50 border-t border-zinc-700">
      <span className="font-mono">
        🧪 Dev Mode · Role: <b>{role}</b> · Origin: <b>{origin}</b>
      </span>
      <div className="flex flex-wrap gap-3 font-mono">
        <span>✏️ Edit: {policy['edit:journal'] ? '✅' : '❌'}</span>
        <span>🔍 Revisions: {policy['view:revisions'] ? '✅' : '❌'}</span>
        <span>📣 Webhook: {policy['trigger:webhook'] ? '✅' : '❌'}</span>
        <span>🔐 Admin: {policy['access:admin-panel'] ? '✅' : '❌'}</span>
      </div>
      <button
        onClick={() => handleCreateSnapshot({ role, origin, policy })}
        className="text-xs px-2 py-1 bg-zinc-200 text-zinc-800 rounded border"
      >
        🧾 Snapshot Session
      </button>
    </div>
  );
};
