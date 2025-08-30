'use client';

import { useSession } from 'next-auth/react';

export default function DebugMinimalPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold text-white mb-4">Debug Minimal</h1>
      
      <div className="space-y-4">
        <div>
          <strong>Status:</strong> {status}
        </div>
        
        {session && (
          <div>
            <strong>User:</strong> {session.user?.name} ({session.user?.email})
          </div>
        )}
        
        <button 
          onClick={async () => {
            console.log('Testing portfolio API...');
            try {
              const res = await fetch('/api/portfolio');
              const data = await res.json();
              console.log('Portfolio API response:', data);
              alert('Check console for API response');
            } catch (error) {
              console.error('Portfolio API error:', error);
              alert('API Error: ' + error);
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-4"
        >
          Test Portfolio API
        </button>
        
        <button 
          onClick={async () => {
            console.log('Testing auth debug API...');
            try {
              const res = await fetch('/api/debug/auth-detailed');
              const data = await res.text();
              console.log('Auth debug response:', data);
              alert('Auth Debug Response (status: ' + res.status + '): ' + data.substring(0, 500));
            } catch (error) {
              console.error('Auth debug error:', error);
              alert('Auth Debug Error: ' + error);
            }
          }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Test Auth Debug
        </button>
      </div>
    </div>
  );
}
