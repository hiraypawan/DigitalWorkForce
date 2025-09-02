'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { ProfileProgress } from '@/components/ui/ProfileProgress';
import Link from 'next/link';
import { 
  User, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Search,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Target
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
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen"
      style={{ background: currentTheme.gradients.background }}
    >
      {/* Top Greeting Section with Progress */}
      <div className="mb-8 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 
              className="text-4xl font-bold glow-text"
              style={{ color: currentTheme.colors.text }}
            >
              Welcome back, {session?.user?.name?.split(' ')[0] || 'Employee'} 👋
            </h1>
            <p 
              className="text-lg"
              style={{ color: currentTheme.colors.textMuted }}
            >
              Let&apos;s build your career together
            </p>
          </div>
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center animate-float"
            style={{ 
              backgroundColor: `${currentTheme.colors.primary}20`,
              color: currentTheme.colors.primary
            }}
          >
            <Sparkles className="w-8 h-8" />
          </div>
        </div>
        
        {/* Profile Progress Bar */}
        <div className="max-w-md">
          <ProfileProgress />
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Left Column: Profile */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 
              className="text-lg font-semibold flex items-center gap-2"
              style={{ color: currentTheme.colors.text }}
            >
              <User className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
              Your Profile
            </h2>
            <p 
              className="text-sm"
              style={{ color: currentTheme.colors.textMuted }}
            >
              Build your professional presence
            </p>
          </div>
          
          {/* Compact Profile Card */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ background: currentTheme.gradients.card }}
              >
                {session?.user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 
                  className="text-lg font-bold truncate"
                  style={{ color: currentTheme.colors.text }}
                >
                  {session?.user?.name || 'Your Name'}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full status-online"></div>
                  <span className="text-xs font-medium" style={{ color: currentTheme.colors.success }}>Active</span>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <ProfileProgress showDetails />
            </div>
            
            <Link 
              href="/dashboard/profile"
              className="btn-primary inline-flex items-center justify-center gap-2 w-full text-sm py-2"
            >
              <User className="w-4 h-4" />
              Complete Profile
            </Link>
          </div>
        </div>
        
        {/* Center Column: Projects & Applications */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 
              className="text-lg font-semibold flex items-center gap-2"
              style={{ color: currentTheme.colors.text }}
            >
              <Target className="w-5 h-5" style={{ color: currentTheme.colors.secondary }} />
              Opportunities
            </h2>
            <p 
              className="text-sm"
              style={{ color: currentTheme.colors.textMuted }}
            >
              Find and track your projects
            </p>
          </div>
          
          {/* Quick Project Actions */}
          <div className="space-y-4">
            <Link 
              href="/dashboard/browse-projects"
              className="glass-card p-6 hover-lift group transition-all duration-300 block"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ 
                      backgroundColor: `${currentTheme.colors.primary}20`,
                      color: currentTheme.colors.primary
                    }}
                  >
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 
                      className="font-semibold group-hover:gradient-text transition-all duration-300"
                      style={{ color: currentTheme.colors.text }}
                    >
                      Browse Projects
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: currentTheme.colors.textMuted }}
                    >
                      Find new opportunities
                    </p>
                  </div>
                </div>
                <ArrowRight 
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                  style={{ color: currentTheme.colors.accent }}
                />
              </div>
            </Link>
            
            <Link 
              href="/dashboard/my-applications"
              className="glass-card p-6 hover-lift group transition-all duration-300 block"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ 
                      backgroundColor: `${currentTheme.colors.secondary}20`,
                      color: currentTheme.colors.secondary
                    }}
                  >
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 
                      className="font-semibold group-hover:gradient-text transition-all duration-300"
                      style={{ color: currentTheme.colors.text }}
                    >
                      My Applications
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: currentTheme.colors.textMuted }}
                    >
                      Track your submissions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span 
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{ 
                      backgroundColor: `${currentTheme.colors.warning}20`,
                      color: currentTheme.colors.warning
                    }}
                  >
                    2 pending
                  </span>
                  <ArrowRight 
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                    style={{ color: currentTheme.colors.accent }}
                  />
                </div>
              </div>
            </Link>
            
            <Link 
              href="/dashboard/messages"
              className="glass-card p-6 hover-lift group transition-all duration-300 block"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ 
                      backgroundColor: `${currentTheme.colors.accent}20`,
                      color: currentTheme.colors.accent
                    }}
                  >
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 
                      className="font-semibold group-hover:gradient-text transition-all duration-300"
                      style={{ color: currentTheme.colors.text }}
                    >
                      Messages
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: currentTheme.colors.textMuted }}
                    >
                      Connect with employers
                    </p>
                  </div>
                </div>
                <ArrowRight 
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                  style={{ color: currentTheme.colors.accent }}
                />
              </div>
            </Link>
          </div>
        </div>
        
        {/* Right Column: Earnings */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 
              className="text-lg font-semibold flex items-center gap-2"
              style={{ color: currentTheme.colors.text }}
            >
              <DollarSign className="w-5 h-5" style={{ color: currentTheme.colors.success }} />
              Earnings
            </h2>
            <p 
              className="text-sm"
              style={{ color: currentTheme.colors.textMuted }}
            >
              Track your financial growth
            </p>
          </div>
          
          {/* Earnings Overview */}
          <div className="glass-card p-6 space-y-4">
            <div className="text-center space-y-2">
              <span 
                className="text-3xl font-bold gradient-text"
              >
                {formatCurrency(0)}
              </span>
              <p 
                className="text-sm"
                style={{ color: currentTheme.colors.textMuted }}
              >
                Total Earned
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span 
                  className="text-sm"
                  style={{ color: currentTheme.colors.textMuted }}
                >
                  This Month
                </span>
                <span 
                  className="font-semibold"
                  style={{ color: currentTheme.colors.text }}
                >
                  {formatCurrency(0)}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span 
                  className="text-sm"
                  style={{ color: currentTheme.colors.textMuted }}
                >
                  Pending
                </span>
                <span 
                  className="font-semibold"
                  style={{ color: currentTheme.colors.warning }}
                >
                  {formatCurrency(0)}
                </span>
              </div>
            </div>
            
            <div className="pt-2">
              <p 
                className="text-xs text-center mb-4"
                style={{ color: currentTheme.colors.textMuted }}
              >
                You&apos;re building financial independence — stay consistent.
              </p>
              
              <Link 
                href="/dashboard/earnings"
                className="btn-secondary inline-flex items-center justify-center gap-2 w-full text-sm py-2"
              >
                <TrendingUp className="w-4 h-4" />
                View Analytics
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Motivational Call-to-Action */}
      <div className="text-center py-8">
        <h3 
          className="text-2xl font-bold mb-2 gradient-text"
        >
          Ready to unlock more opportunities?
        </h3>
        <p 
          className="text-lg mb-6"
          style={{ color: currentTheme.colors.textMuted }}
        >
          Complete your profile and start building your professional future.
        </p>
        
        <Link 
          href="/dashboard/profile"
          className="btn-primary inline-flex items-center gap-3 px-6 py-3 text-base font-semibold"
        >
          <Sparkles className="w-5 h-5" />
          Get Started Now
        </Link>
      </div>
    </div>
  );
}
