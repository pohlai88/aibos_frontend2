import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppShell } from '@/components/layout/AppShell';
import { GlobalAuditBanner } from '@/components/UI/GlobalAuditBanner';
import { SessionOriginProvider } from '@/context/SessionOriginContext';
import { DevPolicyBanner } from '@/components/DevTools/DevPolicyBanner';
import { AssistProvider } from '@/context/AssistModeContext';
import { FlagProvider } from '@/context/CopilotFlagContext';
import { RoleProvider } from '@/context/RoleContext';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LedgerOS™ - Demo',
  description: 'Audit-Aware Financial Operations Control Panel - Demo Version',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-50 text-zinc-900`}>
        <AuthProvider>
          <AssistProvider>
            <FlagProvider>
              <SessionOriginProvider value="api">
                <AppShell>
                  <GlobalAuditBanner />
                  {children}
                  <DevPolicyBanner />
                </AppShell>
              </SessionOriginProvider>
            </FlagProvider>
          </AssistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
