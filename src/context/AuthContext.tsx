'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'reviewer' | 'engineer' | 'viewer';
  tenantId: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  role: User['role'] | null;
  tenantId: string | null;
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('auth_user');
        
        if (token && userStr) {
          const user = JSON.parse(userStr) as User;
          
          // Validate token hasn't expired (basic check)
          if (isTokenValid(token)) {
            setState({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }
        }
        
        // Clear invalid/expired auth
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setState(prev => ({ ...prev, isLoading: false }));
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Call backend auth API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data: LoginResponse = await response.json();

      // Store auth data
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));

      setState({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error; // Re-throw to let the login form handle it
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    role: state.user?.role || null,
    tenantId: state.user?.tenantId || null,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Utility function to validate JWT token (basic expiration check)
function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    return payload.exp > now;
  } catch {
    return false;
  }
}

// HTTP client with auth headers
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('auth_user');
  
  if (!token) {
    throw new Error('No authentication token available');
  }

  const user = userStr ? JSON.parse(userStr) as User : null;
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(user?.tenantId && { 'X-Tenant-Id': user.tenantId }),
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
