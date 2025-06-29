'use client';

import { createContext, useContext, useState } from 'react';

const AssistContext = createContext({
  enabled: false,
  toggle: () => {},
});

export const AssistProvider = ({ children }: { children: React.ReactNode }) => {
  const [enabled, setEnabled] = useState(false);
  const toggle = () => setEnabled((prev) => !prev);

  return (
    <AssistContext.Provider value={{ enabled, toggle }}>
      {children}
    </AssistContext.Provider>
  );
};

export const useAssistMode = () => useContext(AssistContext);
