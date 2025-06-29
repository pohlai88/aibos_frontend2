// Simple test page to verify API connectivity
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const { token, isAuthenticated } = useAuth();

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testJournalAPI = async () => {
    if (!token) {
      addResult('❌ No auth token available');
      return;
    }

    try {
      addResult('🔄 Testing GET /api/journal...');
      const response = await fetch('/api/journal', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        addResult(`✅ GET /api/journal success - ${data.entries?.length || 0} entries found`);
        
        // Test creating an entry
        addResult('🔄 Testing POST /api/journal...');
        const createResponse = await fetch('/api/journal', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: '2024-12-30',
            description: 'Test API Entry',
            lines: [
              {
                account: 'Test Asset',
                debit: 100,
                credit: 0,
                description: 'Test debit line'
              },
              {
                account: 'Test Liability',
                debit: 0,
                credit: 100,
                description: 'Test credit line'
              }
            ],
            reference: 'API-TEST-001',
            status: 'draft'
          }),
        });

        if (createResponse.ok) {
          const newEntry = await createResponse.json();
          addResult(`✅ POST /api/journal success - Created entry ${newEntry.id}`);
          
          // Test updating the entry
          addResult('🔄 Testing PUT /api/journal/[id]...');
          const updateResponse = await fetch(`/api/journal/${newEntry.id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              description: 'Updated Test API Entry',
              status: 'pending'
            }),
          });

          if (updateResponse.ok) {
            addResult(`✅ PUT /api/journal/${newEntry.id} success`);
          } else {
            const updateError = await updateResponse.json();
            addResult(`❌ PUT failed: ${updateError.error || updateError.message}`);
          }

          // Test deleting the entry
          addResult('🔄 Testing DELETE /api/journal/[id]...');
          const deleteResponse = await fetch(`/api/journal/${newEntry.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (deleteResponse.ok) {
            addResult(`✅ DELETE /api/journal/${newEntry.id} success`);
          } else {
            const deleteError = await deleteResponse.json();
            addResult(`❌ DELETE failed: ${deleteError.error || deleteError.message}`);
          }

        } else {
          const createError = await createResponse.json();
          addResult(`❌ POST failed: ${createError.error || createError.message}`);
        }

      } else {
        const error = await response.json();
        addResult(`❌ GET failed: ${error.error || error.message}`);
      }
    } catch (error) {
      addResult(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>
      
      <div className="mb-6">
        <p className="mb-2">Authentication Status: {isAuthenticated ? '✅ Authenticated' : '❌ Not authenticated'}</p>
        <p className="mb-4">Token: {token ? '✅ Available' : '❌ Missing'}</p>
        
        <button
          onClick={testJournalAPI}
          disabled={!isAuthenticated}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
        >
          Test Journal API Endpoints
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-4">Test Results:</h2>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500">No tests run yet</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="font-mono text-sm">
                {result}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
