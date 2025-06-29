'use client';

import { useAssistMode } from '@/context/AssistModeContext';

export const AssistModeToggle = () => {
  const { enabled, toggle } = useAssistMode();

  return (
    <button
      onClick={toggle}
      className={`text-xs border rounded px-3 py-1 ${
        enabled ? 'bg-purple-600 text-white' : 'bg-zinc-200 text-zinc-700'
      }`}
    >
      ⚙️ Copilot Assist: {enabled ? 'On' : 'Off'}
    </button>
  );
};
