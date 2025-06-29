import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SidebarNav } from '@/components/UI/SidebarNav';
import { GlobalAuditBanner } from '@/components/UI/GlobalAuditBanner';
import { SessionOriginProvider } from '@/context/SessionOriginContext';
import { DevPolicyBanner } from '@/components/DevTools/DevPolicyBanner';
import { AssistProvider } from '@/context/AssistModeContext';
import { FlagProvider } from '@/context/CopilotFlagContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI-BOS™',
  description: 'Audit-Aware Financial Ops Control Panel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-50 text-zinc-900`}>
        <AssistProvider>
          <FlagProvider>
            <div className="min-h-screen flex flex-col">
              <SidebarNav />
              <SessionOriginProvider value="api">
                <GlobalAuditBanner />
                <main className="flex-1 p-6">{children}</main>
              </SessionOriginProvider>
              <DevPolicyBanner />
            </div>
          </FlagProvider>
        </AssistProvider>
      </body>
    </html>
  );
}
