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
    <div 
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen"
      style={{ background: currentTheme.gradients.background }}
    >
      {/* Welcome Section */}
      <div className="glass-card-highlight p-8 mb-8 animate-fade-in-up">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 
              className="text-4xl font-bold mb-3 glow-text animate-slide-in-left"
              style={{ color: currentTheme.colors.text }}
            >
              Welcome back, {session?.user?.name?.split(' ')[0] || 'Employee'} 👋
            </h1>
            <p 
              className="text-lg leading-relaxed animate-fade-in-up animation-delay-200"
              style={{ color: currentTheme.colors.textMuted }}
            >
              Ready to explore new opportunities and advance your career?
            </p>
          </div>
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center animate-float"
            style={{ background: currentTheme.gradients.card }}
          >
            <span className="text-3xl">🚀</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Browse Projects */}
        <Link href="/dashboard/browse-projects" className="group block animate-scale-in animation-delay-200">
          <div className="glass-card p-6 hover-lift hover-glow group-hover:border-opacity-60 transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse-glow"
                style={{ 
                  backgroundColor: `${currentTheme.colors.primary}25`,
                  color: currentTheme.colors.primary
                }}
              >
                <Search className="w-7 h-7" />
              </div>
              <h3 
                className="text-xl font-bold group-hover:gradient-text transition-all duration-300"
                style={{ color: currentTheme.colors.text }}
              >
                Browse Projects
              </h3>
            </div>
            <p 
              className="text-sm mb-6 leading-relaxed"
              style={{ color: currentTheme.colors.textMuted }}
            >
              Discover new opportunities from top companies and apply to projects that match your skills.
            </p>
            <div 
              className="inline-flex items-center text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300"
              style={{ color: currentTheme.colors.accent }}
            >
              Explore opportunities →
            </div>
          </div>
        </Link>

        {/* My Applications */}
        <Link href="/dashboard/my-applications" className="group block animate-scale-in animation-delay-400">
          <div className="glass-card p-6 hover-lift hover-glow group-hover:border-opacity-60 transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse-glow"
                style={{ 
                  backgroundColor: `${currentTheme.colors.secondary}25`,
                  color: currentTheme.colors.secondary
                }}
              >
                <FileText className="w-7 h-7" />
              </div>
              <h3 
                className="text-xl font-bold group-hover:gradient-text transition-all duration-300"
                style={{ color: currentTheme.colors.text }}
              >
                My Applications
              </h3>
            </div>
            <p 
              className="text-sm mb-6 leading-relaxed"
              style={{ color: currentTheme.colors.textMuted }}
            >
              Track the status of your project applications and manage your active submissions.
            </p>
            <div 
              className="inline-flex items-center text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300"
              style={{ color: currentTheme.colors.accent }}
            >
              View applications →
            </div>
          </div>
        </Link>

        {/* Messages */}
        <Link href="/dashboard/messages" className="group block animate-scale-in animation-delay-600">
          <div className="glass-card p-6 hover-lift hover-glow group-hover:border-opacity-60 transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse-glow"
                style={{ 
                  backgroundColor: `${currentTheme.colors.accent}25`,
                  color: currentTheme.colors.accent
                }}
              >
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 
                className="text-xl font-bold group-hover:gradient-text transition-all duration-300"
                style={{ color: currentTheme.colors.text }}
              >
                Messages
              </h3>
            </div>
            <p 
              className="text-sm mb-6 leading-relaxed"
              style={{ color: currentTheme.colors.textMuted }}
            >
              Communicate with potential employers and collaborate on active projects.
            </p>
            <div 
              className="inline-flex items-center text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300"
              style={{ color: currentTheme.colors.accent }}
            >
              Open messages →
            </div>
          </div>
        </Link>
      </div>

      {/* Profile & Earnings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Profile Card */}
        <div className="glass-card-highlight p-8 animate-slide-in-left">
          <div className="flex items-center gap-6 mb-8">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl animate-pulse-glow shadow-lg"
              style={{ background: currentTheme.gradients.card }}
            >
              {session?.user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <h3 
                className="text-2xl font-bold mb-2"
                style={{ color: currentTheme.colors.text }}
              >
                {session?.user?.name || 'User Profile'}
              </h3>
              <p 
                className="text-base font-medium"
                style={{ color: currentTheme.colors.textMuted }}
              >
                Professional Employee
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-3 h-3 rounded-full status-online"></div>
                <span className="text-sm font-medium" style={{ color: currentTheme.colors.success }}>Active</span>
              </div>
            </div>
          </div>
          <Link 
            href="/dashboard/profile"
            className="btn-primary inline-flex items-center gap-2 w-full justify-center"
          >
            <User className="w-5 h-5" />
            Edit Profile
          </Link>
        </div>

        {/* Earnings Overview */}
        <div className="glass-card-highlight p-8 animate-slide-in-right">
          <div className="flex items-center gap-6 mb-8">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse-glow"
              style={{ 
                backgroundColor: `${currentTheme.colors.secondary}30`,
                color: currentTheme.colors.secondary
              }}
            >
              <DollarSign className="w-8 h-8" />
            </div>
            <div>
              <h3 
                className="text-2xl font-bold mb-2"
                style={{ color: currentTheme.colors.text }}
              >
                Earnings Overview
              </h3>
              <p 
                className="text-base"
                style={{ color: currentTheme.colors.textMuted }}
              >
                Track your income & growth
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="glass-card p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="font-medium" style={{ color: currentTheme.colors.textMuted }}>Total Earned</span>
                <span 
                  className="font-bold text-3xl gradient-text"
                >
                  {formatCurrency(0)}
                </span>
              </div>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="font-medium" style={{ color: currentTheme.colors.textMuted }}>This Month</span>
                <span 
                  className="font-bold text-xl"
                  style={{ color: currentTheme.colors.text }}
                >
                  {formatCurrency(0)}
                </span>
              </div>
            </div>
            <Link 
              href="/dashboard/earnings"
              className="btn-secondary inline-flex items-center gap-2 w-full justify-center mt-6"
            >
              <TrendingUp className="w-5 h-5" />
              View Detailed Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="glass-card-highlight p-10 text-center animate-bounce-in">
        <div 
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center animate-float"
          style={{ 
            backgroundColor: `${currentTheme.colors.primary}30`,
            color: currentTheme.colors.primary
          }}
        >
          <Star className="w-10 h-10" />
        </div>
        <h3 
          className="text-3xl font-bold mb-4 gradient-text"
        >
          Ready to Start Your Journey?
        </h3>
        <p 
          className="text-lg mb-8 max-w-3xl mx-auto leading-relaxed"
          style={{ color: currentTheme.colors.textMuted }}
        >
          Complete your profile and start applying to projects from top companies. 
          Build your professional network and grow your career with <span className="gradient-text font-semibold">DigitalWorkForce</span>.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
          <Link 
            href="/dashboard/browse-projects"
            className="btn-primary inline-flex items-center gap-3 px-8 py-4 text-base font-semibold flex-1 justify-center"
          >
            <Search className="w-5 h-5" />
            Browse Projects
          </Link>
          <Link 
            href="/dashboard/profile"
            className="btn-secondary inline-flex items-center gap-3 px-8 py-4 text-base font-semibold flex-1 justify-center"
          >
            <User className="w-5 h-5" />
            Complete Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
