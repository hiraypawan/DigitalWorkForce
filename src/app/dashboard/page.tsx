'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import { 
  User, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Star,
  Search,
  MessageSquare
} from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { currentTheme, formatCurrency } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center transition-colors duration-300"
        style={{ background: currentTheme.gradients.background }}
      >
        <div className="text-center">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: currentTheme.gradients.card }}
          >
            <div 
              className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: currentTheme.colors.primary }}
            ></div>
          </div>
          <p style={{ color: currentTheme.colors.textMuted }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ background: currentTheme.gradients.background, minHeight: '100vh' }}>
      {/* Welcome Section */}
      <div className="glass-card p-8 mb-8 group relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
        <div className="relative">
          <h1 
            className="text-4xl font-bold mb-4 glow-text"
            style={{ color: currentTheme.colors.text }}
          >
            Welcome back, {session?.user?.name?.split(' ')[0] || 'Employee'} 👋
          </h1>
          <p 
            className="text-xl"
            style={{ color: currentTheme.colors.textMuted }}
          >
            Ready to explore new opportunities and advance your career?
          </p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Browse Projects */}
        <Link href="/dashboard/browse-projects" className="group block">
          <div className="glass-card p-6 group-hover:scale-105 transition-all duration-300 group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${currentTheme.colors.primary}20`,
                    color: currentTheme.colors.primary
                  }}
                >
                  <Search className="w-6 h-6" />
                </div>
                <h3 
                  className="text-xl font-semibold"
                  style={{ color: currentTheme.colors.text }}
                >
                  Browse Projects
                </h3>
              </div>
              <p 
                className="text-sm mb-4 leading-relaxed"
                style={{ color: currentTheme.colors.textMuted }}
              >
                Discover new opportunities from top companies and apply to projects that match your skills.
              </p>
              <div 
                className="inline-flex items-center text-sm font-medium"
                style={{ color: currentTheme.colors.accent }}
              >
                Explore opportunities →
              </div>
            </div>
          </div>
        </Link>

        {/* My Applications */}
        <Link href="/dashboard/my-applications" className="group block">
          <div className="glass-card p-6 group-hover:scale-105 transition-all duration-300 group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${currentTheme.colors.secondary}20`,
                    color: currentTheme.colors.secondary
                  }}
                >
                  <FileText className="w-6 h-6" />
                </div>
                <h3 
                  className="text-xl font-semibold"
                  style={{ color: currentTheme.colors.text }}
                >
                  My Applications
                </h3>
              </div>
              <p 
                className="text-sm mb-4 leading-relaxed"
                style={{ color: currentTheme.colors.textMuted }}
              >
                Track the status of your project applications and manage your active submissions.
              </p>
              <div 
                className="inline-flex items-center text-sm font-medium"
                style={{ color: currentTheme.colors.accent }}
              >
                View applications →
              </div>
            </div>
          </div>
        </Link>

        {/* Messages */}
        <Link href="/dashboard/messages" className="group block">
          <div className="glass-card p-6 group-hover:scale-105 transition-all duration-300 group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${currentTheme.colors.accent}20`,
                    color: currentTheme.colors.accent
                  }}
                >
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 
                  className="text-xl font-semibold"
                  style={{ color: currentTheme.colors.text }}
                >
                  Messages
                </h3>
              </div>
              <p 
                className="text-sm mb-4 leading-relaxed"
                style={{ color: currentTheme.colors.textMuted }}
              >
                Communicate with potential employers and collaborate on active projects.
              </p>
              <div 
                className="inline-flex items-center text-sm font-medium"
                style={{ color: currentTheme.colors.accent }}
              >
                Open messages →
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Profile & Earnings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Profile Card */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
              style={{ background: currentTheme.gradients.card }}
            >
              {session?.user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 
                className="text-xl font-semibold"
                style={{ color: currentTheme.colors.text }}
              >
                {session?.user?.name || 'User Profile'}
              </h3>
              <p 
                className="text-sm"
                style={{ color: currentTheme.colors.textMuted }}
              >
                Professional Employee
              </p>
            </div>
          </div>
          <Link 
            href="/dashboard/profile"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            Edit Profile
          </Link>
        </div>

        {/* Earnings Overview */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ 
                backgroundColor: `${currentTheme.colors.secondary}20`,
                color: currentTheme.colors.secondary
              }}
            >
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 
                className="text-xl font-semibold"
                style={{ color: currentTheme.colors.text }}
              >
                Earnings Overview
              </h3>
              <p 
                className="text-sm"
                style={{ color: currentTheme.colors.textMuted }}
              >
                Track your income
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span style={{ color: currentTheme.colors.textMuted }}>Total Earned</span>
              <span 
                className="font-semibold text-2xl"
                style={{ color: currentTheme.colors.accent }}
              >
                {formatCurrency(0)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span style={{ color: currentTheme.colors.textMuted }}>This Month</span>
              <span 
                className="font-semibold text-lg"
                style={{ color: currentTheme.colors.text }}
              >
                {formatCurrency(0)}
              </span>
            </div>
            <Link 
              href="/dashboard/earnings"
              className="btn-secondary inline-flex items-center gap-2 mt-4"
            >
              <TrendingUp className="w-4 h-4" />
              View Details
            </Link>
          </div>
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="glass-card p-8 text-center group relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
        <div className="relative">
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ 
              backgroundColor: `${currentTheme.colors.primary}20`,
              color: currentTheme.colors.primary
            }}
          >
            <Star className="w-10 h-10" />
          </div>
          <h3 
            className="text-3xl font-semibold mb-6 glow-text"
            style={{ color: currentTheme.colors.text }}
          >
            Ready to Start Your Journey?
          </h3>
          <p 
            className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed"
            style={{ color: currentTheme.colors.textMuted }}
          >
            Complete your profile and start applying to projects from top companies. 
            Build your professional network and grow your career with DigitalWorkForce.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard/browse-projects"
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 glow-button"
            >
              <Search className="w-5 h-5" />
              Browse Projects
            </Link>
            <Link 
              href="/dashboard/profile"
              className="btn-secondary inline-flex items-center gap-2 px-8 py-4"
            >
              <User className="w-5 h-5" />
              Complete Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
