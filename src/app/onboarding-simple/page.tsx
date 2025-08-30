'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, LogOut } from 'lucide-react';

export default function SimpleOnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const checkProfileCompleteness = useCallback(async () => {
    try {
      const response = await fetch('/api/portfolio', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        const completeness = data.completionPercentage || 0;
        setProfileCompleteness(completeness);
        
        // If user has already completed onboarding (>= 60% profile completion), redirect to dashboard
        if (completeness >= 60) {
          router.push('/dashboard');
          return;
        }
      }
    } catch (error) {
      console.error('Error checking profile completeness:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      // Redirect unauthenticated users to login
      router.push('/auth/login?from=/onboarding-simple');
      return;
    }
    
    if (status === 'authenticated') {
      // Check if user has already completed onboarding
      checkProfileCompleteness();
    }
  }, [status, router, checkProfileCompleteness]);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  // Show loading spinner while checking authentication and profile
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if redirecting
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-black/90 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              DigitalWorkForce
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Welcome, {session?.user?.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-300" />
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              Simple Onboarding Test
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Testing if the basic session and authentication works.
          </p>
          
          <div className="bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-8 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-white mb-4">Session Info</h2>
            <div className="text-left space-y-2">
              <p className="text-gray-300">Status: <span className="text-blue-400">{status}</span></p>
              <p className="text-gray-300">Name: <span className="text-blue-400">{session?.user?.name || 'Unknown'}</span></p>
              <p className="text-gray-300">Email: <span className="text-blue-400">{session?.user?.email || 'Unknown'}</span></p>
              <p className="text-gray-300">Profile: <span className="text-blue-400">{profileCompleteness}% complete</span></p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={async () => {
                setDebugInfo('Testing API...');
                try {
                  const res = await fetch('/api/portfolio');
                  const data = await res.json();
                  console.log('API Response:', data);
                  setDebugInfo(`API Status: ${res.status}, Data: ${JSON.stringify(data, null, 2)}`);
                } catch (err) {
                  console.error('API Error:', err);
                  setDebugInfo(`API Error: ${err}`);
                }
              }}
              className="block mx-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Test Portfolio API
            </button>
            
            <button
              onClick={() => router.push('/onboarding')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
            >
              Try Full Onboarding Page
            </button>
            
            {debugInfo && (
              <div className="mt-4 p-4 bg-gray-800 rounded text-left text-sm">
                <h3 className="text-yellow-400 font-semibold mb-2">Debug Info:</h3>
                <pre className="text-green-400 whitespace-pre-wrap">{debugInfo}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
