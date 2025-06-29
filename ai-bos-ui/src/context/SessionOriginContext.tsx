// src/context/SessionOriginContext.tsx

'use client';

import { createContext, useContext } from 'react';

export type SessionOrigin = 'web' | 'api' | 'automated' | 'mobile';

const SessionOriginContext = createContext<SessionOrigin>('web');

export const SessionOriginProvider = ({
  children,
  value = 'web',
}: {
  children: React.ReactNode;
  value?: SessionOrigin;
}) => (
  <SessionOriginContext.Provider value={value}>
    {children}
  </SessionOriginContext.Provider>
);

export const useSessionOrigin = () => useContext(SessionOriginContext);
