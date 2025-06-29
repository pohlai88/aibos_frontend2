'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: Array<'admin' | 'reviewer' | 'engineer' | 'viewer'>;
  fallbackUrl?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  fallbackUrl = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait for auth to initialize

    if (!isAuthenticated) {
      router.push(fallbackUrl);
      return;
    }

    // Check role-based access if roles are specified
    if (requiredRoles.length > 0 && user) {
      if (!requiredRoles.includes(user.role)) {
        router.push('/403');
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, router, requiredRoles, fallbackUrl]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Check role access
  if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Access denied. Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Convenience components for specific role requirements
export function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={['admin']}>
      {children}
    </ProtectedRoute>
  );
}

export function ReviewerRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={['admin', 'reviewer']}>
      {children}
    </ProtectedRoute>
  );
}

export function EngineerRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={['admin', 'engineer']}>
      {children}
    </ProtectedRoute>
  );
}
