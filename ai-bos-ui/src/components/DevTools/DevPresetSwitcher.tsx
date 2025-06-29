'use client';

import { useRole } from '@/context/useRole';
import { useSessionOrigin } from '@/context/SessionOriginContext';

export const DevPresetSwitcher = () => {
  if (process.env.NODE_ENV !== 'development') return null;

  const { role, setRole } = useRole();
  const { origin, setOrigin } = useSessionOrigin();

  return (
    <div className="fixed top-4 right-4 z-50 bg-zinc-50 border border-zinc-200 p-3 rounded shadow text-xs flex gap-4 items-center">
      <div>
        <label className="block font-medium mb-1">Role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border px-2 py-1 text-xs rounded"
        >
          <option value="finance">finance</option>
          <option value="auditor">auditor</option>
          <option value="admin">admin</option>
          <option value="super-admin">super-admin</option>
          <option value="api-user">api-user</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Origin:</label>
        <select
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="border px-2 py-1 text-xs rounded"
        >
          <option value="web">web</option>
          <option value="api">api</option>
          <option value="automated">automated</option>
          <option value="mobile">mobile</option>
        </select>
      </div>
    </div>
  );
};
