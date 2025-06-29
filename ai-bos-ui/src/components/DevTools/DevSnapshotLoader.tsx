// src/components/DevTools/DevSnapshotLoader.tsx

'use client';

import { useState } from 'react';
import { importSnapshot } from '@/utils/sessionSnapshot';

export const DevSnapshotLoader = ({
  onLoad,
}: {
  onLoad: (snapshot: SnapshotPayload) => void;
}) => {
  if (process.env.NODE_ENV !== 'development') return null;
  const [filename, setFilename] = useState<string | null>(null);

  return (
    <div className="fixed bottom-14 right-4 z-50">
      <label className="text-xs text-zinc-600 bg-zinc-100 px-3 py-1 rounded border cursor-pointer">
        📂 Load Snapshot
        <input
          type="file"
          accept=".json"
          hidden
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const snapshot = await importSnapshot(file);
              onLoad(snapshot);
              setFilename(file.name);
            }
          }}
        />
      </label>
      {filename && <div className="text-[10px] mt-1 text-zinc-500">{filename}</div>}
    </div>
  );
};
