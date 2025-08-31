'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DebugAuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [redirectInfo, setRedirectInfo] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const fromParam = params.get('from');
    const registeredParam = params.get('registered');
    
    setRedirectInfo({
      from: fromParam,
      registered: registeredParam,
      currentUrl: window.location.href,
      callbackUrl: fromParam || '/onboarding',
    });
  }, []);

  const testRedirect = () => {
    console.log('Testing redirect to onboarding...');
    window.location.href = '/onboarding';
  };

  const testPush = () => {
    console.log('Testing router.push to onboarding...');
    router.push('/onboarding');
  };

  if (!mounted) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p>Loading...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-400">Authentication Debug Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Session Info */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-400">Session Info</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Status:</strong> <span className="text-yellow-400">{status}</span></p>
              <p><strong>User ID:</strong> <span className="text-blue-400">{session?.user?.id || 'N/A'}</span></p>
              <p><strong>Email:</strong> <span className="text-blue-400">{session?.user?.email || 'N/A'}</span></p>
              <p><strong>Name:</strong> <span className="text-blue-400">{session?.user?.name || 'N/A'}</span></p>
              <div>
                <p><strong>Full Session:</strong></p>
                <pre className="text-xs text-gray-400 mt-2 bg-gray-800 p-2 rounded overflow-x-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* URL Info */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">URL & Redirect Info</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Current URL:</strong></p>
              <p className="text-blue-400 break-all">{redirectInfo?.currentUrl}</p>
              
              <p><strong>From Parameter:</strong> <span className="text-yellow-400">{redirectInfo?.from || 'N/A'}</span></p>
              <p><strong>Registered:</strong> <span className="text-yellow-400">{redirectInfo?.registered || 'N/A'}</span></p>
              <p><strong>Callback URL:</strong> <span className="text-green-400">{redirectInfo?.callbackUrl}</span></p>
            </div>
          </div>

          {/* Environment Info */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-orange-400">Environment Info</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Window Location:</strong></p>
              <p className="text-blue-400 break-all">{typeof window !== 'undefined' ? window.location.href : 'SSR'}</p>
              
              <p><strong>User Agent:</strong></p>
              <p className="text-gray-400 text-xs break-all">{typeof window !== 'undefined' ? navigator.userAgent : 'SSR'}</p>
            </div>
          </div>

          {/* Test Actions */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-red-400">Test Actions</h2>
            <div className="space-y-4">
              <button
                onClick={testRedirect}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                Test window.location.href redirect
              </button>
              
              <button
                onClick={testPush}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
              >
                Test router.push redirect
              </button>
              
              <button
                onClick={() => {
                  console.log('Current session:', session);
                  console.log('Current status:', status);
                  console.log('Redirect info:', redirectInfo);
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
              >
                Log to Console
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">Browser Console Output</h2>
          <p className="text-gray-400 text-sm">Check your browser&apos;s developer console for additional debugging information.</p>
        </div>
      </div>
    </div>
  );
}
