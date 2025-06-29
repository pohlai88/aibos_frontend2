// Test script to verify API endpoints
import { NextRequest } from 'next/server';

// Test auth login
const testAuth = async () => {
  console.log('Testing auth login...');
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@company.com',
        password: 'admin123',
      }),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Auth successful:', result);
      return result.token;
    } else {
      console.error('Auth failed:', await response.text());
    }
  } catch (error) {
    console.error('Auth error:', error);
  }
};

// Test journal entries
const testJournal = async (token: string) => {
  console.log('Testing journal entries...');
  try {
    const response = await fetch('/api/journal', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Journal entries:', result);
    } else {
      console.error('Journal failed:', await response.text());
    }
  } catch (error) {
    console.error('Journal error:', error);
  }
};

// Run tests
export const runTests = async () => {
  const token = await testAuth();
  if (token) {
    await testJournal(token);
  }
};
