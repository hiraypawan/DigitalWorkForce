'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
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
      <header className="bg-black/90 backdrop-blur-lg border-b border-gray-800 neon-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-2xl font-bold text-blue-400 glow-text">
                Digital Workforce
              </Link>
              <div className="hidden md:flex space-x-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-700 rounded animate-pulse w-20 shimmer"></div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse shimmer"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-black/90 backdrop-blur-lg border-b border-gray-800 neon-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-400 glow-text hover:text-blue-300 transition-colors">
              Digital Workforce
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'gradient-primary text-white glow-button'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800 neon-border'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side - User menu and notifications */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-300 hover:text-white rounded-lg hover:bg-gray-800 neon-border transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 neon-border transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
                  {userData?.avatar ? (
                    <img src={userData.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-300">
                  {userData?.name || 'User'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 glass-effect bg-gray-900/95 rounded-xl neon-border py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">{userData?.name}</p>
                    <p className="text-xs text-gray-400">{userData?.email}</p>
                  </div>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4" />
                    Edit Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <hr className="my-2 border-gray-700" />
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 w-full text-left transition-colors"
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
              className="md:hidden p-2 text-gray-300 hover:text-white rounded-lg hover:bg-gray-800 neon-border transition-all"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-800 bg-black/95">
            <nav className="px-4 py-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.href)
                        ? 'gradient-primary text-white glow-button'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
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
  );
}
