'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginDebugPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchParamsState, setSearchParamsState] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Get search params safely
  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    setSearchParamsState(params.get('from'));
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div>Mounting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Login Debug Page</h1>
      
      <div className="space-y-4">
        <div>
          <strong>Session Status:</strong> {status}
        </div>
        
        <div>
          <strong>Session Data:</strong> {session ? JSON.stringify(session, null, 2) : 'None'}
        </div>
        
        <div>
          <strong>From Parameter:</strong> {searchParamsState || 'None'}
        </div>
        
        <div>
          <strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}
        </div>
        
        <div>
          <strong>Mounted:</strong> {mounted ? 'Yes' : 'No'}
        </div>
        
        {status === 'authenticated' && (
          <div className="p-4 bg-green-900 rounded">
            <strong>Already Authenticated!</strong>
            <p>User: {session?.user?.name} ({session?.user?.email})</p>
            <button 
              onClick={() => router.push(searchParamsState || '/onboarding')}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Go to {searchParamsState || '/onboarding'}
            </button>
          </div>
        )}
        
        {status === 'unauthenticated' && (
          <div className="p-4 bg-red-900 rounded">
            <strong>Not Authenticated</strong>
            <p>Please sign in to continue.</p>
            <Link href="/auth/login" className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded">
              Go to Regular Login Page
            </Link>
          </div>
        )}
        
        {status === 'loading' && (
          <div className="p-4 bg-yellow-900 rounded">
            <strong>Loading Session...</strong>
            <p>Session status is still loading. This might indicate a problem with NextAuth configuration.</p>
          </div>
        )}
      </div>
    </div>
  );
}
