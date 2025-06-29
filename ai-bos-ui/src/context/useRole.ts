// src/context/useRole.ts
"use client";

import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type RoleType = 'admin' | 'reviewer' | 'engineer' | 'viewer';

export interface RoleContextType {
  role: RoleType | null;
  isAdmin: boolean;
  isReviewer: boolean;
  isEngineer: boolean;
  isViewer: boolean;
  hasRole: (requiredRole: RoleType | RoleType[]) => boolean;
  canAccess: (feature: string) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Feature access matrix
const FEATURE_ACCESS: Record<string, RoleType[]> = {
  journal: ['admin', 'reviewer', 'engineer'],
  rules: ['admin', 'engineer'],
  reports: ['admin', 'reviewer'],
  timeline: ['admin', 'reviewer', 'engineer'],
  dashboard: ['admin', 'reviewer', 'engineer', 'viewer'],
  settings: ['admin'],
};

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const role = user?.role || null;

  const hasRole = (requiredRole: RoleType | RoleType[]): boolean => {
    if (!role) return false;
    
    const required = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return required.includes(role);
  };

  const canAccess = (feature: string): boolean => {
    if (!role) return false;
    
    const allowedRoles = FEATURE_ACCESS[feature];
    if (!allowedRoles) return false;
    
    return allowedRoles.includes(role);
  };

  const contextValue: RoleContextType = {
    role,
    isAdmin: role === 'admin',
    isReviewer: role === 'reviewer',
    isEngineer: role === 'engineer',
    isViewer: role === 'viewer',
    hasRole,
    canAccess,
  };

  return (
    <RoleContext.Provider value={contextValue}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
