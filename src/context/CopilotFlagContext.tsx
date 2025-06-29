"use client";

import { createContext, useContext, useEffect, useState } from 'react';

export type CopilotFlag = {
  id: string; // entryId + field
  message: string;
  status: 'open' | 'dismissed' | 'resolved';
  entryId: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
};

const FlagContext = createContext<{
  flags: CopilotFlag[];
  dismissFlag: (id: string) => void;
  updateFlagStatus: (id: string, newStatus: 'open' | 'dismissed' | 'resolved') => void;
  setFlags: React.Dispatch<React.SetStateAction<CopilotFlag[]>>;
  setCopilotFlags: (flags: CopilotFlag[]) => void;
}>({ flags: [], dismissFlag: () => {}, updateFlagStatus: () => {}, setFlags: () => {}, setCopilotFlags: () => {} });

export const FlagProvider = ({ children }: { children: React.ReactNode }) => {
  const [flags, setFlags] = useState<CopilotFlag[]>([]);

  // Load flags from LocalStorage on initialization
  useEffect(() => {
    const stored = localStorage.getItem('copilot::flags');
    if (stored) {
      try {
        setFlags(JSON.parse(stored));
      } catch {
        console.warn('Invalid flag data');
      }
    }
  }, []);

  // Save flags to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('copilot::flags', JSON.stringify(flags));
  }, [flags]);

  const dismissFlag = (id: string) => {
    setFlags((prev) => prev.map((flag) => (flag.id === id ? { ...flag, status: 'dismissed' } : flag)));
  };

  const reviewer = 'admin@bos.local'; // Replace with dynamic user context
  const now = new Date().toISOString();

  const updateFlagStatus = (id: string, newStatus: 'open' | 'dismissed' | 'resolved') => {
    setFlags((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              status: newStatus,
              reviewedBy: newStatus !== 'open' ? reviewer : undefined,
              reviewedAt: newStatus !== 'open' ? now : undefined,
            }
          : f
      )
    );
  };

  const setCopilotFlags = (newFlags: CopilotFlag[]) => {
    setFlags(newFlags);
  };

  return (
    <FlagContext.Provider value={{ flags, dismissFlag, updateFlagStatus, setFlags, setCopilotFlags }}>
      {children}
    </FlagContext.Provider>
  );
};

export const useFlagContext = () => useContext(FlagContext);
export const useCopilotFlags = () => useContext(FlagContext);
