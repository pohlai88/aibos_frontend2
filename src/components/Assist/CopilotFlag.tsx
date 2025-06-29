'use client';

import { useState } from 'react';
import { useFlagContext, CopilotFlag as CopilotFlagType } from '@/context/CopilotFlagContext';

export const CopilotFlag = ({
  flag,
}: {
  flag: CopilotFlagType;
}) => {
  const [visible, setVisible] = useState(true);
  const { updateFlagStatus } = useFlagContext();

  if (!visible) return null;

  return (
    <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs px-3 py-2 rounded relative mt-2">
      <span>📌</span>
      <div className="flex-1 space-y-1">
        <p>{flag.message}</p>
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => updateFlagStatus(flag.id, 'resolved')}
            className="text-green-700 underline"
          >
            ✅ Mark Resolved
          </button>
          <button
            onClick={() => updateFlagStatus(flag.id, 'dismissed')}
            className="text-zinc-500 underline"
          >
            ✖ Ignore
          </button>
        </div>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute top-1 right-1 text-yellow-700 hover:text-yellow-900 text-sm"
      >
        ✖
      </button>
    </div>
  );
};
