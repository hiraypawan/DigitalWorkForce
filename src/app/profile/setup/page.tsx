'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import ChatbotOnboarding from '@/components/ChatbotOnboarding';
import ProfilePreview from '@/components/ProfilePreview';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function ProfileSetupPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-black/90 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                DigitalWorkForce
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {session.user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <span className="text-gray-300">{session.user?.name}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-green-900/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                Build Your Profile
              </span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Chat with our AI career guide to build your professional profile. 
            Watch your profile update in real-time as you share your experience!
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Chat Interface */}
          <div className="order-2 lg:order-1">
            <ChatbotOnboarding 
              onComplete={(data) => {
                console.log('Profile data extracted:', data);
              }}
            />
          </div>

          {/* Profile Preview */}
          <div className="order-1 lg:order-2">
            <ProfilePreview />
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-gray-900/30 backdrop-blur border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Tips for a Great Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-400 font-bold">1</span>
                </div>
                <p className="text-sm text-gray-300">Share specific skills and technologies you work with</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-400 font-bold">2</span>
                </div>
                <p className="text-sm text-gray-300">Describe your work experience and achievements</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-400 font-bold">3</span>
                </div>
                <p className="text-sm text-gray-300">Mention projects and portfolio links</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
