// src/context/MockAuthContext.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'viewer' | 'editor' | 'admin' | 'super-admin';
  tenantId: string;
  avatar?: string;
}

interface MockAuthContextType {
  user: MockUser;
  isAuthenticated: boolean;
  tenant: {
    id: string;
    name: string;
    plan: 'basic' | 'pro' | 'enterprise';
  };
}

const mockUser: MockUser = {
  id: 'usr_demo_001',
  name: 'Wee Auditor',
  email: 'wee.auditor@ledgeros.demo',
  role: 'admin',
  tenantId: 'demo-123',
  avatar: '👩‍💼'
};

const mockTenant = {
  id: 'demo-123',
  name: 'Demo Accounting Firm',
  plan: 'pro' as const
};

const MockAuthContext = createContext<MockAuthContextType>({
  user: mockUser,
  isAuthenticated: true,
  tenant: mockTenant
});

export function MockAuthProvider({ children }: { children: ReactNode }) {
  return (
    <MockAuthContext.Provider value={{
      user: mockUser,
      isAuthenticated: true,
      tenant: mockTenant
    }}>
      {children}
    </MockAuthContext.Provider>
  );
}

export function useMockAuth() {
  const context = useContext(MockAuthContext);
  if (!context) {
    throw new Error('useMockAuth must be used within a MockAuthProvider');
  }
  return context;
}

export type { MockUser, MockAuthContextType };
