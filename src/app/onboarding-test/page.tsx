'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function OnboardingTestPage() {
  const { data: session, status } = useSession();
  const [logs, setLogs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const addLog = (message: string) => {
    console.log('OnboardingTest:', message);
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  useEffect(() => {
    setMounted(true);
    addLog('Component mounted');
  }, []);

  useEffect(() => {
    addLog(`Status changed to: ${status}`);
    if (session) {
      addLog(`Session found: ${session.user?.email}`);
    }
  }, [status, session]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Mounting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-green-400">Onboarding Test Page</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status Info */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Current Status</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Auth Status:</strong> <span className="text-yellow-400">{status}</span></p>
              <p><strong>Mounted:</strong> <span className="text-yellow-400">{mounted ? 'Yes' : 'No'}</span></p>
              <p><strong>Session Present:</strong> <span className="text-yellow-400">{session ? 'Yes' : 'No'}</span></p>
              {session && (
                <>
                  <p><strong>User Email:</strong> <span className="text-blue-400">{session.user?.email}</span></p>
                  <p><strong>User Name:</strong> <span className="text-blue-400">{session.user?.name}</span></p>
                  <p><strong>User ID:</strong> <span className="text-blue-400">{session.user?.id}</span></p>
                </>
              )}
            </div>
          </div>

          {/* Logs */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Component Logs</h2>
            <div className="space-y-1 text-xs text-gray-300 max-h-64 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="font-mono bg-gray-800 p-1 rounded">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Simple Content */}
        <div className="mt-8 bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-400">Welcome Message</h2>
          {status === 'loading' && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading authentication...</span>
            </div>
          )}
          {status === 'unauthenticated' && (
            <p className="text-red-400">❌ Not authenticated - please login first</p>
          )}
          {status === 'authenticated' && session && (
            <div className="space-y-2">
              <p className="text-green-400">✅ Successfully authenticated!</p>
              <p className="text-white">Welcome, <strong>{session.user?.name}</strong>!</p>
              <p className="text-gray-400">Email: {session.user?.email}</p>
              <p className="text-gray-400">This is a simplified test version of the onboarding page.</p>
            </div>
          )}
        </div>

        {/* Test Actions */}
        <div className="mt-8 bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-red-400">Test Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => addLog('Manual log test')}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Add Test Log
            </button>
            
            <button
              onClick={() => {
                addLog('Testing portfolio API...');
                fetch('/api/portfolio', { credentials: 'include' })
                  .then(res => res.json())
                  .then(data => addLog(`Portfolio API success: ${JSON.stringify(data)}`))
                  .catch(err => addLog(`Portfolio API error: ${err.message}`));
              }}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            >
              Test Portfolio API
            </button>

            <button
              onClick={() => window.location.href = '/onboarding'}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
            >
              Go to Real Onboarding
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
