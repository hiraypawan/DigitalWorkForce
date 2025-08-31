'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function OnboardingSimpleFix() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `${timestamp}: ${message}`;
    console.log('OnboardingSimpleFix:', logMessage);
    setDebugLogs(prev => [...prev.slice(-20), logMessage]); // Keep last 20 logs
  };

  useEffect(() => {
    setMounted(true);
    addLog('Component mounted');
  }, []);

  useEffect(() => {
    addLog(`Status: ${status}, Session exists: ${!!session}`);
    
    // NO REDIRECTS HERE - just log what's happening
    if (status === 'unauthenticated') {
      addLog('User is unauthenticated but NOT redirecting');
    }
    
    if (status === 'authenticated') {
      addLog(`Authenticated as: ${session?.user?.email}`);
    }
  }, [status, session]);

  // Render immediately without any loading states or redirects
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 mb-6">
          <h1 className="text-2xl font-bold text-red-400 mb-2">🔧 EMERGENCY ONBOARDING DEBUG PAGE</h1>
          <p className="text-gray-300">This page has NO redirects, NO complex components, NO API calls.</p>
          <p className="text-gray-300">If this page reloads automatically, the issue is in middleware or auth config.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-green-400 mb-4">Status</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Mounted:</strong> {mounted ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Auth Status:</strong> <span className="text-yellow-400">{status}</span></p>
              <p><strong>Has Session:</strong> {session ? '✅ Yes' : '❌ No'}</p>
              {session && (
                <>
                  <p><strong>User Email:</strong> <span className="text-blue-400">{session.user?.email}</span></p>
                  <p><strong>User Name:</strong> <span className="text-blue-400">{session.user?.name}</span></p>
                </>
              )}
            </div>
          </div>

          {/* Debug Logs */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-purple-400 mb-4">Live Debug Log</h2>
            <div className="max-h-64 overflow-y-auto text-xs font-mono space-y-1">
              {debugLogs.map((log, index) => (
                <div key={index} className="text-gray-300 bg-gray-800 p-1 rounded">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Simple Content */}
        <div className="mt-8 bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-400 mb-4">Simple Welcome</h2>
          
          {status === 'loading' && (
            <p className="text-yellow-400">⏳ Loading authentication...</p>
          )}
          
          {status === 'unauthenticated' && (
            <div className="space-y-2">
              <p className="text-red-400">❌ Not authenticated</p>
              <p className="text-gray-400">Normally this would redirect to login, but this page won&apos;t redirect.</p>
              <a 
                href="/auth/login?from=/onboarding" 
                className="text-blue-400 underline hover:text-blue-300"
              >
                Click here to login manually
              </a>
            </div>
          )}
          
          {status === 'authenticated' && session && (
            <div className="space-y-2">
              <p className="text-green-400">✅ Successfully authenticated!</p>
              <p className="text-white">Welcome back, <strong>{session.user?.name}</strong>!</p>
              <p className="text-gray-400">Email: {session.user?.email}</p>
              <p className="text-blue-300">🎉 This should be your onboarding page content!</p>
            </div>
          )}
        </div>

        {/* Manual Navigation */}
        <div className="mt-8 bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-orange-400 mb-4">Manual Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <a href="/debug-auth" className="bg-blue-600 text-white px-3 py-2 rounded text-center hover:bg-blue-700">
              Debug Auth
            </a>
            <a href="/onboarding-test" className="bg-green-600 text-white px-3 py-2 rounded text-center hover:bg-green-700">
              Test Page
            </a>
            <a href="/dashboard" className="bg-purple-600 text-white px-3 py-2 rounded text-center hover:bg-purple-700">
              Dashboard
            </a>
            <a href="/auth/login" className="bg-gray-600 text-white px-3 py-2 rounded text-center hover:bg-gray-700">
              Login
            </a>
          </div>
        </div>

        {/* Current URL Info */}
        <div className="mt-8 bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">URL Info</h2>
          <div className="text-sm space-y-1">
            <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'SSR'}</p>
            <p><strong>Page has been stable for:</strong> <span id="stability-timer">Checking...</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
