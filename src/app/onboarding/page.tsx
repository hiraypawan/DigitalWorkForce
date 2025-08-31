'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, Sparkles, User, LogOut } from 'lucide-react';

// Simple placeholder components to prevent reloading issues
const SimpleChatPlaceholder = () => (
  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <Sparkles className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">AI Chat Assistant</h3>
      <p className="text-gray-300 mb-4">Chat with our AI to build your professional profile</p>
      <div className="bg-black/50 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-400">💬 &quot;Tell me about your skills and experience!&quot;</p>
      </div>
      <button 
        onClick={() => window.open('/onboarding-simple-fix', '_blank')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
      >
        Start Chat (Opens Stable Version)
      </button>
    </div>
  </div>
);

const SimpleProfilePreview = ({ profileCompleteness }: { profileCompleteness: number }) => (
  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <User className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Your Profile</h3>
      <p className="text-gray-300 mb-4">Preview of your professional profile</p>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Completion</span>
          <span className="text-blue-400">{profileCompleteness}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${profileCompleteness}%` }}
          />
        </div>
      </div>
      
      {profileCompleteness > 0 ? (
        <p className="text-green-400 text-sm">✓ Profile data detected!</p>
      ) : (
        <p className="text-gray-400 text-sm">Start chatting to see your profile</p>
      )}
    </div>
  </div>
);

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
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
                  title="Go to Dashboard"
                >
                  <User className="w-4 h-4 text-gray-300" />
                </button>
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
        {/* Temporary Notice */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-xl p-4 text-center">
            <p className="text-yellow-300 text-sm">
              ⚠️ <strong>Temporary Fix:</strong> To prevent page reloading issues, click &quot;Start Chat&quot; to use the stable version.
            </p>
          </div>
        </div>

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
            <SimpleChatPlaceholder />
          </div>

          {/* Profile Preview */}
          <div className="order-1 lg:order-2">
            <SimpleProfilePreview profileCompleteness={profileCompleteness} />
          </div>
        </div>

        {/* Profile Completion Section */}
        {profileCompleteness >= 70 && (
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border border-green-500/50 rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-green-400 mr-4" />
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Profile Ready! 🎉</h2>
                  <p className="text-green-300">Your profile is {profileCompleteness}% complete and ready to attract projects!</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <button
                  onClick={goToDashboard}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  Go to Dashboard
                </button>
                
                <button
                  onClick={() => router.push('/dashboard/profile')}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <User className="w-5 h-5" />
                  Edit Profile
                </button>
                
                <button
                  onClick={() => router.push('/company/projects')}
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Browse Projects
                </button>
              </div>
              
              <p className="text-gray-300 text-sm mt-6">
                Ready to start your digital workforce journey? Your dashboard awaits!
              </p>
            </div>
          </div>
        )}

        {/* Steps Indicator - Show when profile is not complete */}
        {profileCompleteness < 70 && (
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
                    <div className={`w-16 h-16 ${profileCompleteness >= 30 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      {profileCompleteness >= 30 ? <CheckCircle className="w-8 h-8 text-white" /> : <span className="text-2xl font-bold text-white">1</span>}
                    </div>
                    <h4 className="font-semibold text-white mb-2">Complete Profile</h4>
                    <p className="text-gray-300 text-sm">Chat with our AI to set up your profile</p>
                    {profileCompleteness >= 30 && <p className="text-green-400 text-xs mt-1">✓ Done</p>}
                  </div>
                  
                  <div className="text-center">
                    <div className={`w-16 h-16 ${profileCompleteness >= 70 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-purple-500 to-green-500'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      {profileCompleteness >= 70 ? <CheckCircle className="w-8 h-8 text-white" /> : <span className="text-2xl font-bold text-white">2</span>}
                    </div>
                    <h4 className="font-semibold text-white mb-2">Get Matched</h4>
                    <p className="text-gray-300 text-sm">Our algorithm matches you with relevant projects</p>
                    {profileCompleteness >= 70 && <p className="text-green-400 text-xs mt-1">✓ Ready</p>}
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">3</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Start Earning</h4>
                    <p className="text-gray-300 text-sm">Complete projects and build your income</p>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-gray-400 text-sm mb-4">
                    Keep chatting with our AI to reach 70% completion and unlock your dashboard!
                  </p>
                  <div className="bg-black/30 rounded-lg p-3 max-w-md mx-auto">
                    <p className="text-xs text-gray-500">Tips: Share your skills, experience, projects, and career goals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
