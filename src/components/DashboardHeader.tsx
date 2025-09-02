'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [dropdownPosition, setDropdownPosition] = useState<'right' | 'left'>('right');
  const [dropdownStyle, setDropdownStyle] = useState<{ right?: string; left?: string; position?: 'absolute' | 'fixed'; top?: string }>({ right: '0' });
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

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

  // Handle clicking outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    if (showUserMenu || showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      
      // Prevent body scroll when mobile menu is open
      if (showMobileMenu) {
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [showUserMenu, showMobileMenu]);

  // Close menus on route change
  useEffect(() => {
    setShowUserMenu(false);
    setShowMobileMenu(false);
  }, [pathname]);

  // Handle window resize to recalculate dropdown position
  useEffect(() => {
    const handleResize = () => {
      if (showUserMenu) {
        calculateDropdownPosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showUserMenu]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  // Calculate dropdown position to prevent overflow
  const calculateDropdownPosition = () => {
    if (userButtonRef.current) {
      const buttonRect = userButtonRef.current.getBoundingClientRect();
      const dropdownWidth = 224; // w-56 = 14rem = 224px
      const viewportWidth = window.innerWidth;
      const padding = 16; // Standard padding
      const rightMargin = 16; // Add right margin to match left spacing
      
      // Always use fixed positioning for better control
      const topPosition = buttonRect.bottom + 8;
      
      // Calculate the ideal position: align right edge of dropdown with right edge of button minus margin
      let leftPosition = buttonRect.right - dropdownWidth;
      
      // Check if this position would cause the dropdown to go outside the viewport
      if (leftPosition < padding) {
        // Not enough space on the left, align with left edge of button instead
        leftPosition = buttonRect.left;
        
        // If still not enough space, align with viewport edge
        if (leftPosition + dropdownWidth > viewportWidth - padding - rightMargin) {
          leftPosition = viewportWidth - dropdownWidth - padding - rightMargin;
        }
        setDropdownPosition('left');
      } else {
        // Add right margin when positioning from the right
        leftPosition = Math.min(leftPosition, viewportWidth - dropdownWidth - padding - rightMargin);
        setDropdownPosition('right');
      }
      
      // Final safety check - ensure dropdown stays within viewport bounds with right margin
      leftPosition = Math.max(padding, Math.min(leftPosition, viewportWidth - dropdownWidth - padding - rightMargin));
      
      setDropdownStyle({ 
        position: 'fixed',
        left: `${leftPosition}px`,
        top: `${topPosition}px`,
        right: 'auto'
      });
    }
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
      className="backdrop-blur-lg border-b fixed top-0 left-0 right-0 z-50"
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
      className="backdrop-blur-xl border-b fixed top-0 left-0 right-0 z-50 shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${currentTheme.colors.surface}95, ${currentTheme.colors.background}85)`,
        borderColor: `${currentTheme.colors.border}60`,
        backdropFilter: 'blur(20px) saturate(180%)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-10">
            <Link 
              href="/dashboard" 
              className="group flex items-center gap-3 transition-all duration-300 hover:scale-105"
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-110"
                style={{ background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }}
              >
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 
                  className="text-xl font-bold leading-tight transition-colors group-hover:opacity-80"
                  style={{ color: currentTheme.colors.text }}
                >
                  DigitalWorkforce
                </h1>
                <p className="text-xs font-medium" style={{ color: currentTheme.colors.textMuted }}>
                  Professional Platform
                </p>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {navItems.slice(0, 5).map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 whitespace-nowrap flex-shrink-0"
                    style={{
                      backgroundColor: active 
                        ? `${currentTheme.colors.primary}20` 
                        : 'transparent',
                      color: active 
                        ? currentTheme.colors.primary 
                        : currentTheme.colors.textSecondary,
                      border: active 
                        ? `1px solid ${currentTheme.colors.primary}40` 
                        : '1px solid transparent',
                      boxShadow: active 
                        ? `0 2px 10px ${currentTheme.colors.primary}25` 
                        : 'none'
                    }}
                  >
                    {/* Active indicator */}
                    {active && (
                      <div 
                        className="absolute inset-0 rounded-lg opacity-15 animate-pulse"
                        style={{ background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }}
                      />
                    )}
                    
                    <div className="relative z-10 flex items-center gap-2">
                      <div 
                        className={`p-1 rounded-md transition-all duration-300 ${
                          active ? 'shadow-md' : 'group-hover:shadow-sm'
                        }`}
                        style={{
                          background: active 
                            ? `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` 
                            : `${currentTheme.colors.surface}40`,
                          color: active ? 'white' : currentTheme.colors.textSecondary
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-xs xl:text-sm">{item.label}</span>
                    </div>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300" 
                         style={{ background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }} />
                  </Link>
                );
              })}
              
              {/* More menu for additional items */}
              {navItems.length > 5 && (
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 hover:-translate-y-0.5" 
                          style={{ color: currentTheme.colors.textSecondary }}>
                    <div className="p-1 rounded-md" style={{ background: `${currentTheme.colors.surface}40` }}>
                      <Menu className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-xs xl:text-sm">More</span>
                  </button>
                  
                  {/* Dropdown for additional items */}
                  <div className="absolute left-0 top-full mt-2 w-48 rounded-xl backdrop-blur-md shadow-xl border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                       style={{
                         background: currentTheme.gradients.card,
                         borderColor: currentTheme.colors.border
                       }}>
                    {navItems.slice(5).map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-2 text-sm transition-all duration-150 hover:scale-[1.02]"
                          style={{
                            backgroundColor: isActive(item.href) ? `${currentTheme.colors.primary}20` : 'transparent',
                            color: isActive(item.href) ? currentTheme.colors.primary : currentTheme.colors.text
                          }}
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </nav>
          </div>

          {/* Right side - Currency switcher, notifications, and user menu */}
          <div className="flex items-center gap-3">
            {/* Currency Switcher */}
            <div className="hidden md:block">
              <CurrencySwitcher />
            </div>

            {/* Notifications */}
            <button 
              className="group relative p-3 rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colors.surface}90, ${currentTheme.colors.background}70)`,
                border: `1px solid ${currentTheme.colors.border}60`,
                color: currentTheme.colors.text,
                backdropFilter: 'blur(15px)'
              }}
            >
              <Bell className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
              <span 
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse shadow-lg border-2 border-white/20"
                style={{ background: `linear-gradient(135deg, ${currentTheme.colors.accent}, #ff6b6b)` }}
              ></span>
              
              {/* Glow effect on hover */}
              <div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{ background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }}
              />
            </button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                ref={userButtonRef}
                onClick={() => {
                  calculateDropdownPosition();
                  setShowUserMenu(!showUserMenu);
                }}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colors.surface}90, ${currentTheme.colors.background}70)`,
                  border: `1px solid ${currentTheme.colors.border}60`,
                  color: currentTheme.colors.text,
                  backdropFilter: 'blur(15px)'
                }}
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }}
                >
                  {userData?.avatar ? (
                    <Image src={userData.avatar} alt="Avatar" width={40} height={40} className="w-10 h-10 rounded-xl object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold leading-tight">
                    {userData?.name || 'User'}
                  </p>
                  <p className="text-xs opacity-70" style={{ color: currentTheme.colors.textMuted }}>
                    {userData?.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'Member'}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                
                {/* Glow effect on hover */}
                <div 
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }}
                />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div 
                  className="fixed w-56 rounded-xl backdrop-blur-md shadow-2xl border py-2 z-[60] glass-card"
                  style={{
                    background: currentTheme.gradients.card,
                    borderColor: currentTheme.colors.border,
                    ...dropdownStyle,
                    minWidth: '14rem',
                    maxWidth: 'calc(100vw - 2.5rem)',
                    width: 'auto',
                    transform: 'none'
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
          <>
            {/* Mobile Menu Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden mobile-backdrop"
              onClick={() => setShowMobileMenu(false)}
            />
            
            {/* Mobile Menu Panel */}
            <div 
              ref={mobileMenuRef}
              className="lg:hidden border-t relative z-50 shadow-xl"
              style={{
                borderColor: currentTheme.colors.border,
                backgroundColor: currentTheme.colors.surface,
                backdropFilter: 'blur(20px)'
              }}
            >
              {/* Currency switcher for mobile */}
              <div className="md:hidden px-4 py-3 border-b" style={{ borderColor: currentTheme.colors.border }}>
                <CurrencySwitcher />
              </div>
              
              {/* Mobile Navigation Links */}
              <nav className="px-4 py-3 space-y-1 max-h-96 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 touch-manipulation active:scale-95"
                      style={{
                        backgroundColor: isActive(item.href) ? `${currentTheme.colors.primary}30` : 'transparent',
                        color: isActive(item.href) ? currentTheme.colors.primary : currentTheme.colors.text,
                        border: isActive(item.href) ? `1px solid ${currentTheme.colors.primary}50` : '1px solid transparent',
                        minHeight: '48px' // Better touch targets
                      }}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              
              {/* Mobile Menu Footer */}
              <div className="px-4 py-3 border-t" style={{ borderColor: currentTheme.colors.border }}>
                <div className="flex items-center justify-between text-sm" style={{ color: currentTheme.colors.textMuted }}>
                  <span>{userData?.name || 'User'}</span>
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      handleSignOut();
                    }}
                    className="flex items-center gap-2 px-3 py-1 rounded text-sm touch-manipulation"
                    style={{ color: currentTheme.colors.accent }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
