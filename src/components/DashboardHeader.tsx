'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import CurrencySwitcher from './ThemeSwitcher';
import {
  Home,
  User,
  Briefcase,
  Search,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Building,
  Users,
  DollarSign,
  BarChart3,
  FileText,
  MessageSquare,
  Shield,
  Plus
} from 'lucide-react';

interface UserData {
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
}

export default function DashboardHeader() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { currentTheme } = useTheme();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setUserData({
        name: session.user.name || 'User',
        email: session.user.email || '',
        role: (session.user as any)?.role || 'user',
        avatar: session.user.image || ''
      });
    }
  }, [session]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  // Navigation items for different user types
  const userNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/profile', label: 'Edit Profile', icon: User },
    { href: '/dashboard/browse-projects', label: 'Browse Projects', icon: Search },
    { href: '/dashboard/my-applications', label: 'My Applications', icon: FileText },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
    { href: '/dashboard/earnings', label: 'Earnings', icon: DollarSign },
  ];

  const companyNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/company-profile', label: 'Company Profile', icon: Building },
    { href: '/dashboard/post-project', label: 'Post Project', icon: Plus },
    { href: '/dashboard/my-projects', label: 'My Projects', icon: Briefcase },
    { href: '/dashboard/applications', label: 'Applications', icon: Users },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  ];

  const adminNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/users', label: 'Manage Users', icon: Users },
    { href: '/admin/projects', label: 'Manage Projects', icon: Briefcase },
    { href: '/admin/analytics', label: 'System Analytics', icon: BarChart3 },
    { href: '/admin/security', label: 'Security', icon: Shield },
    { href: '/admin/settings', label: 'System Settings', icon: Settings },
  ];

  const getNavItems = () => {
    if (!userData?.role) return userNavItems;
    
    switch (userData.role.toLowerCase()) {
      case 'company':
        return companyNavItems;
      case 'admin':
        return adminNavItems;
      default:
        return userNavItems;
    }
  };

  const navItems = getNavItems();

  if (status === 'loading') {
    return (
      <header 
        className="backdrop-blur-lg border-b sticky top-0 z-50"
        style={{
          backgroundColor: `${currentTheme.colors.surface}90`,
          borderColor: currentTheme.colors.border
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link 
                href="/dashboard" 
                className="text-2xl font-bold transition-colors"
                style={{ color: currentTheme.colors.primary }}
              >
                Digital Workforce
              </Link>
              <div className="hidden md:flex space-x-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="h-4 rounded animate-pulse w-20"
                    style={{ backgroundColor: currentTheme.colors.border }}
                  ></div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div 
                className="w-8 h-8 rounded-full animate-pulse"
                style={{ backgroundColor: currentTheme.colors.border }}
              ></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header 
      className="backdrop-blur-lg border-b sticky top-0 z-50"
      style={{
        background: currentTheme.gradients.background,
        borderColor: currentTheme.colors.border
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-8">
            <Link 
              href="/dashboard" 
              className="text-2xl font-bold transition-colors hover:opacity-80 glow-text"
              style={{ color: currentTheme.colors.text }}
            >
              DigitalWorkForce
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: isActive(item.href) ? `${currentTheme.colors.primary}30` : 'transparent',
                      color: isActive(item.href) ? currentTheme.colors.text : currentTheme.colors.textSecondary,
                      border: isActive(item.href) ? `1px solid ${currentTheme.colors.primary}50` : '1px solid transparent',
                      boxShadow: isActive(item.href) ? `0 0 15px ${currentTheme.colors.primary}40` : 'none'
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side - Currency switcher, notifications, and user menu */}
          <div className="flex items-center gap-2">
            {/* Currency Switcher */}
            <div className="hidden md:block">
              <CurrencySwitcher />
            </div>

            {/* Notifications */}
            <button 
              className="relative p-2 rounded-lg transition-all duration-300 hover:scale-105 neon-border"
              style={{
                backgroundColor: `${currentTheme.colors.surface}60`,
                border: `1px solid ${currentTheme.colors.border}`,
                color: currentTheme.colors.text,
                backdropFilter: 'blur(10px)'
              }}
            >
              <Bell className="w-5 h-5" />
              <span 
                className="absolute top-1 right-1 w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: currentTheme.colors.accent }}
              ></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: `${currentTheme.colors.surface}60`,
                  border: `1px solid ${currentTheme.colors.border}`,
                  color: currentTheme.colors.text,
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: currentTheme.gradients.card }}
                >
                  {userData?.avatar ? (
                    <Image src={userData.avatar} alt="Avatar" width={32} height={32} className="w-8 h-8 rounded-full" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="hidden lg:block text-sm font-medium">
                  {userData?.name || 'User'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-xl backdrop-blur-md shadow-2xl border py-2 z-50 glass-card"
                  style={{
                    background: currentTheme.gradients.card,
                    borderColor: currentTheme.colors.border
                  }}
                >
                  <div 
                    className="px-4 py-3 border-b"
                    style={{ borderColor: currentTheme.colors.border }}
                  >
                    <p className="text-sm font-medium" style={{ color: currentTheme.colors.text }}>
                      {userData?.name}
                    </p>
                    <p className="text-xs" style={{ color: currentTheme.colors.textMuted }}>
                      {userData?.email}
                    </p>
                  </div>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm transition-all duration-150 hover:scale-[1.02]"
                    style={{
                      color: currentTheme.colors.text
                    }}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4" />
                    Edit Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm transition-all duration-150 hover:scale-[1.02]"
                    style={{ color: currentTheme.colors.text }}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <hr style={{ margin: '8px 0', borderColor: currentTheme.colors.border }} />
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-2 text-sm w-full text-left transition-all duration-150 hover:scale-[1.02]"
                    style={{ color: currentTheme.colors.accent }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: `${currentTheme.colors.surface}60`,
                border: `1px solid ${currentTheme.colors.border}`,
                color: currentTheme.colors.text
              }}
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div 
            className="lg:hidden border-t"
            style={{
              borderColor: currentTheme.colors.border,
              backgroundColor: `${currentTheme.colors.surface}95`
            }}
          >
            {/* Currency switcher for mobile */}
            <div className="md:hidden px-4 py-2 border-b" style={{ borderColor: currentTheme.colors.border }}>
              <CurrencySwitcher />
            </div>
            <nav className="px-4 py-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      backgroundColor: isActive(item.href) ? `${currentTheme.colors.primary}20` : 'transparent',
                      color: isActive(item.href) ? currentTheme.colors.primary : currentTheme.colors.text,
                      border: isActive(item.href) ? `1px solid ${currentTheme.colors.primary}40` : '1px solid transparent'
                    }}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Click outside to close menus */}
      {(showUserMenu || showMobileMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowMobileMenu(false);
          }}
        />
      )}
    </header>
  );
}
