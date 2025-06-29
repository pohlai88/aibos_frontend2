'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export const AppShell = ({ children }: { children: ReactNode }) => {
  const { user, tenantId, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <header role="banner" className="h-14 bg-zinc-800 text-white flex items-center justify-between px-4">
        <Link 
          href="/dashboard" 
          className="font-bold text-lg tracking-tight hover:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-800 rounded-sm"
          aria-label="LedgerOS - Go to Dashboard"
        >
          📘 LedgerOS
        </Link>
        
        {/* User Info */}
        <div className="flex items-center gap-3 text-sm">
          <div className="text-right">
            <div className="font-medium">{user?.name || user?.email || 'User'}</div>
            <div className="text-zinc-400 capitalize">{user?.role || 'Unknown'} • {tenantId || 'No tenant'}</div>
          </div>
          <div className="relative group">
            <button 
              className="w-8 h-8 bg-zinc-600 rounded-full flex items-center justify-center text-lg hover:bg-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-800"
              aria-label="User menu"
            >
              👤
            </button>
            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="px-4 py-2 text-sm text-gray-700 border-b">
                <div className="font-medium">{user?.name || user?.email}</div>
                <div className="text-gray-500">{user?.email}</div>
              </div>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-60 bg-zinc-100 border-r p-4 hidden md:block" role="complementary">
          <nav role="navigation" aria-label="Main navigation">
            <ul className="space-y-2" role="list">
              <li>
                <Link 
                  href="/dashboard" 
                  className="block text-sm text-zinc-700 hover:underline hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 rounded px-2 py-1"
                  aria-label="Navigate to Dashboard"
                >
                  🏠 Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/journal" 
                  className="block text-sm text-zinc-700 hover:underline hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 rounded px-2 py-1"
                  aria-label="Navigate to Journal"
                >
                  📒 Journal
                </Link>
              </li>
              <li>
                <Link 
                  href="/rules" 
                  className="block text-sm text-zinc-700 hover:underline hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 rounded px-2 py-1"
                  aria-label="Navigate to Rules"
                >
                  ⚖️ Rules
                </Link>
              </li>
              <li>
                <Link 
                  href="/reports/balance-sheet" 
                  className="block text-sm text-zinc-700 hover:underline hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 rounded px-2 py-1"
                  aria-label="Navigate to Balance Sheet Report"
                >
                  📊 Balance Sheet
                </Link>
              </li>
              <li>
                <Link 
                  href="/reports/income-statement" 
                  className="block text-sm text-zinc-700 hover:underline hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 rounded px-2 py-1"
                  aria-label="Navigate to Income Statement Report"
                >
                  💰 Income Statement
                </Link>
              </li>
              <li>
                <Link 
                  href="/timeline" 
                  className="block text-sm text-zinc-700 hover:underline hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 rounded px-2 py-1"
                  aria-label="Navigate to Timeline"
                >
                  ⏰ Timeline
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main role="main" className="flex-1 p-6">{children}</main>
      </div>
      <footer role="contentinfo" className="text-[10px] text-zinc-500 py-2 text-center border-t">
        LedgerOS Prototype · © {new Date().getFullYear()}
      </footer>
    </div>
  );
};
