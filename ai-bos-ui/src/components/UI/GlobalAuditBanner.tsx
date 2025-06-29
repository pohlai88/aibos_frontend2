"use client";

import React, { useState, useEffect } from 'react';
import { useSessionOrigin } from '@/context/SessionOriginContext';

export function GlobalAuditBanner() {
  const [auditMessages, setAuditMessages] = useState<string[]>([]);
  const { origin } = useSessionOrigin();

  useEffect(() => {
    // Simulate real-time audit notifications
    const interval = setInterval(() => {
      const newMessage = `Audit event at ${new Date().toLocaleTimeString()} via ${origin.toUpperCase()}`;
      setAuditMessages((prev) => [...prev, newMessage]);
    }, 5000);

    return () => clearInterval(interval);
  }, [origin]);

  return (
    <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-2 shadow-md">
      <div className="text-sm font-medium">Audit Notifications:</div>
      <ul className="mt-1 space-y-1">
        {auditMessages.map((message, index) => (
          <li key={index} className="text-xs">
            {message}
          </li>
        ))}
      </ul>
    </div>
  );
}
