// src/context/SessionOriginContext.tsx

'use client';

import { createContext, useContext, useState } from 'react';

export type SessionOrigin = 'web' | 'api' | 'automated' | 'mobile';

const SessionOriginContext = createContext<{
  origin: SessionOrigin;
  setOrigin: React.Dispatch<React.SetStateAction<SessionOrigin>>;
}>({
  origin: 'web',
  setOrigin: () => {},
});

export const SessionOriginProvider = ({
  children,
  value = 'web',
}: {
  children: React.ReactNode;
  value?: SessionOrigin;
}) => {
  const [origin, setOrigin] = useState<SessionOrigin>(value);

  return (
    <SessionOriginContext.Provider value={{ origin, setOrigin }}>
      {children}
    </SessionOriginContext.Provider>
  );
};

export const useSessionOrigin = () => useContext(SessionOriginContext);
