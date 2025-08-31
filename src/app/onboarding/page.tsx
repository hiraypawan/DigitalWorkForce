'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ChatbotOnboarding from '@/components/ChatbotOnboarding';
import AdvancedProfilePreview from '@/components/AdvancedProfilePreview';
import { CheckCircle, ArrowRight, Sparkles, User, LogOut } from 'lucide-react';

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [loading, setLoading] = useState(true);

  const checkProfileCompleteness = useCallback(async () => {
    try {
      console.log('Checking profile completeness...');
      const response = await fetch('/api/portfolio', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Portfolio data:', data);
        const completeness = data.completionPercentage || 0;
        setProfileCompleteness(completeness);
        
        // Don't auto-redirect on onboarding page, let user complete the flow
        console.log(`Profile completeness: ${completeness}%`);
      } else {
        console.error('Portfolio fetch failed:', response.status, response.statusText);
        // Continue even if portfolio API fails
        setProfileCompleteness(0);
      }
    } catch (error) {
      console.error('Error checking profile completeness:', error);
      // Set default values if API fails
      setProfileCompleteness(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('Onboarding useEffect - Status:', status, 'Session:', session);
    
    if (status === 'loading') {
      console.log('Authentication status still loading...');
      return;
    }
    
    if (status === 'unauthenticated') {
      console.log('User unauthenticated, redirecting to login...');
      // Redirect unauthenticated users to login
      router.push('/auth/login?from=/onboarding');
      return;
    }
    
    if (status === 'authenticated') {
      console.log('User authenticated, checking profile completeness...');
      // Check if user has already completed onboarding
      checkProfileCompleteness();
    }
  }, [status, router, checkProfileCompleteness, session]);

  // Add a timeout fallback to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('Force ending loading state after timeout');
        setLoading(false);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [loading]);

  const handleComplete = (data: any) => {
    setExtractedData(data);
    setIsComplete(true);
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

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
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-green-900/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

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
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                Welcome to DigitalWorkforce!
              </span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Let&apos;s set up your profile with our AI assistant to get you started with the perfect projects.
          </p>
          {profileCompleteness > 0 && (
            <div className="mt-6 max-w-md mx-auto">
              <div className="bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-300">Profile Progress</span>
                  <span className="text-blue-400">{profileCompleteness}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${profileCompleteness}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Continue chatting to complete your profile
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Chat Interface */}
          <div className="order-2 lg:order-1">
            <ChatbotOnboarding onComplete={handleComplete} />
          </div>

          {/* Profile Preview */}
          <div className="order-1 lg:order-2">
            <AdvancedProfilePreview />
          </div>
        </div>

        {/* Steps Indicator */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25"></div>
            <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-center mb-8">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  What happens next?
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h4 className="font-semibold text-white mb-2">Complete Profile</h4>
                  <p className="text-gray-300 text-sm">Chat with our AI to set up your profile</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h4 className="font-semibold text-white mb-2">Get Matched</h4>
                  <p className="text-gray-300 text-sm">Our algorithm matches you with relevant projects</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h4 className="font-semibold text-white mb-2">Start Earning</h4>
                  <p className="text-gray-300 text-sm">Complete projects and build your income</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
