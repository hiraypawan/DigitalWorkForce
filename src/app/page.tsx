'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowRight, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Shield,
  CheckCircle,
  Star,
  User,
  Building,
  Zap,
  Target,
  Globe
} from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect authenticated users to onboarding or dashboard
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Check if user needs onboarding first by trying to fetch their portfolio
      fetch('/api/portfolio', {
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => {
          const completeness = data.completionPercentage || 0;
          if (completeness >= 60) {
            router.push('/dashboard');
          } else {
            router.push('/onboarding');
          }
        })
        .catch(() => {
          // If error fetching portfolio, redirect to onboarding
          router.push('/onboarding');
        });
    }
  }, [session, status, router]);

  // Don't render the landing page if user is authenticated (they'll be redirected)
  if (status === 'loading') {
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

  if (status === 'authenticated') {
    return null; // Will redirect in useEffect
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="bg-black/90 backdrop-blur-sm border-b border-gray-800 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              DigitalWorkForce
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="text-gray-300 hover:text-white font-medium transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/auth/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 font-medium transition-all duration-300 transform hover:scale-105 glow-button"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 lg:py-40 flex items-center justify-center overflow-hidden bg-black">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-green-900/10"></div>
          
          {/* Subtle Glowing Orbs */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.01)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          {/* Main Headline */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-slate-200 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                BUILDING THE
              </span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                FUTURE
              </span>
              <span className="block bg-gradient-to-r from-purple-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
                WORKFORCE
              </span>
            </h1>
          </div>
          
          <div className="mb-10">
            <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light">
              Get matched with <span className="text-blue-400 font-semibold">real projects</span>. Work, earn, grow.
            </p>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
              Unlike traditional hiring platforms, we connect skilled professionals with MNCs and service-based companies for instant workforce activation.
            </p>
          </div>
          
          {/* Split CTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {/* For Workers */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-300">
                <User className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
                <h3 className="text-2xl font-bold mb-4 text-white">Are you an <span className="text-blue-400">employee</span>?</h3>
                <p className="text-gray-400 mb-6">Get real projects + earnings.</p>
                <Link
                  href="/auth/register"
                  className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  Start Working Now
                  <ArrowRight className="inline w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
            
            {/* For Companies */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-3xl p-8 hover:border-green-500/50 transition-all duration-300">
                <Building className="w-12 h-12 text-green-400 mb-4 mx-auto" />
                <h3 className="text-2xl font-bold mb-4 text-white">Are you a <span className="text-green-400">company</span>?</h3>
                <p className="text-gray-400 mb-6">Hire instantly with AI.</p>
                <Link
                  href="/auth/register"
                  className="block w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  Hire Talent Now
                  <ArrowRight className="inline w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Social Proof */}
          <div className="text-center">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-gray-900/50 backdrop-blur border border-gray-800 rounded-full">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-gray-900"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-green-500 rounded-full border-2 border-gray-900"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <span className="text-gray-300 text-sm">
                <span className="text-white font-semibold">2,000+ employees</span> already matched with projects
              </span>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Introducing <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI Matching</span>
            </h2>
            <p className="text-lg text-gray-300">See only the projects you want to join</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* AI-Powered Matching */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-2xl p-8 text-center hover:border-blue-500/50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Smart Project Matching</h3>
                <p className="text-gray-300">
                  AI analyzes your skills and matches you with high-value projects from top MNCs and service companies.
                </p>
              </div>
            </div>
            
            {/* Enterprise Projects */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-2xl p-8 text-center hover:border-green-500/50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Enterprise-Grade Projects</h3>
                <p className="text-gray-300">
                  Work on real projects from Fortune 500 companies, startups, and established service providers.
                </p>
              </div>
            </div>
            
            {/* Wealth Building */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-green-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Instant Workforce Activation</h3>
                <p className="text-gray-300">
                  Skip the lengthy hiring process. Get matched and start working on meaningful projects immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Builders */}
      <section className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-12">
              <p className="text-gray-400 mb-6">Top companies hiring right now → don&apos;t miss out</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2">2,000+</div>
                <div className="text-gray-400 text-sm">Employees matched</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">150+</div>
                <div className="text-gray-400 text-sm">MNC & Service Companies</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">₹2Cr+</div>
                <div className="text-gray-400 text-sm">Paid to Employees</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">4.9★</div>
                <div className="text-gray-400 text-sm">Platform Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chat Preview */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Meet Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI Career Guide</span>
            </h2>
            <p className="text-lg text-gray-300">Talk to your AI career guide → get matched instantly</p>
          </div>
          
          <div className="relative max-w-2xl mx-auto">
            <div className="bg-black/50 backdrop-blur border border-gray-800 rounded-2xl p-6">
              {/* Chat Preview */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">AI</span>
                  </div>
                  <div className="bg-gray-800 rounded-lg px-4 py-2 flex-1">
                    <p className="text-gray-200">Hi! I&apos;m your AI career guide. What are your main skills?</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-blue-600 rounded-lg px-4 py-2 max-w-xs">
                    <p className="text-white">I&apos;m a full-stack developer with React and Node.js experience</p>
                  </div>
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">AI</span>
                  </div>
                  <div className="bg-gray-800 rounded-lg px-4 py-2 flex-1">
                    <p className="text-gray-200">Perfect! I found 3 high-value projects from MNCs that match your skills...</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Link
                  href="/profile/setup"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300"
                >
                  Start Chat with AI Guide
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-black relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-blue-500/3 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-purple-500/3 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Don&apos;t wait — the <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">future of work</span> is already here.
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join the AI-powered workforce revolution. Start earning, growing, and building your future today.
          </p>
          
          <Link
            href="/auth/register"
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
          >
            <span className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></span>
            <span className="relative">Sign Up Free</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              DigitalWorkForce
            </div>
            <p className="text-gray-400 mb-6">Building the future workforce with AI-powered project matching</p>
            <div className="flex justify-center gap-8 text-sm">
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
