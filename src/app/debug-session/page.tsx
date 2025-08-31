'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function DebugSessionPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log('Debug Session Page - Status:', status);
    console.log('Debug Session Page - Session:', session);
    
    // Check for cookies
    if (typeof window !== 'undefined') {
      console.log('Debug Session Page - All cookies:', document.cookie);
      console.log('Debug Session Page - Session token cookie:', 
        document.cookie.split(';').find(c => c.includes('next-auth.session-token')));
    }
  }, [session, status]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Session Debug Page</h1>
        
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Session Status</h2>
          <p className="mb-2"><strong>Status:</strong> {status}</p>
          
          {session ? (
            <div>
              <p className="mb-2"><strong>User ID:</strong> {session.user?.id}</p>
              <p className="mb-2"><strong>Email:</strong> {session.user?.email}</p>
              <p className="mb-2"><strong>Name:</strong> {session.user?.name}</p>
            </div>
          ) : (
            <p>No session found</p>
          )}
        </div>

        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Cookies</h2>
          {typeof window !== 'undefined' ? (
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
              {document.cookie || 'No cookies found'}
            </pre>
          ) : (
            <p>Loading cookies...</p>
          )}
        </div>

        <div className="space-y-2">
          <button 
            onClick={() => window.location.href = '/onboarding'}
            className="bg-blue-600 text-white px-4 py-2 rounded mr-4"
          >
            Go to Onboarding
          </button>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-green-600 text-white px-4 py-2 rounded mr-4"
          >
            Go to Dashboard
          </button>
          <button 
            onClick={() => window.location.href = '/auth/login'}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
