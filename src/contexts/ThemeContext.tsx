'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    surfaceHover: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    borderHover: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    card: string;
  };
}

export const themes: Record<string, Theme> = {
  midnight: {
    id: 'midnight',
    name: 'Midnight Professional',
    colors: {
      primary: '#3B82F6',
      primaryHover: '#2563EB',
      secondary: '#8B5CF6',
      accent: '#06B6D4',
      background: '#0F0F23',
      surface: '#1A1B3A',
      surfaceHover: '#252653',
      text: '#FFFFFF',
      textSecondary: '#E2E8F0',
      textMuted: '#94A3B8',
      border: '#334155',
      borderHover: '#475569',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6'
    },
    gradients: {
      primary: 'from-blue-600 via-blue-700 to-indigo-800',
      secondary: 'from-purple-600 via-violet-700 to-indigo-800',
      accent: 'from-cyan-500 via-blue-600 to-indigo-700',
      background: 'linear-gradient(135deg, #0F0F23, #1A1B3A)',
      card: 'linear-gradient(135deg, #1A1B3A, #252653)'
    }
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Breeze',
    colors: {
      primary: '#0EA5E9',
      primaryHover: '#0284C7',
      secondary: '#06B6D4',
      accent: '#14B8A6',
      background: '#0F1419',
      surface: '#1E293B',
      surfaceHover: '#334155',
      text: '#F8FAFC',
      textSecondary: '#E2E8F0',
      textMuted: '#94A3B8',
      border: '#475569',
      borderHover: '#64748B',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#0EA5E9'
    },
    gradients: {
      primary: 'from-sky-500 via-blue-600 to-cyan-600',
      secondary: 'from-cyan-500 via-teal-600 to-blue-700',
      accent: 'from-teal-400 via-cyan-500 to-blue-600',
      background: 'linear-gradient(135deg, #0F1419, #1E293B)',
      card: 'linear-gradient(135deg, #1E293B, #334155)'
    }
  },
  forest: {
    id: 'forest',
    name: 'Forest Elite',
    colors: {
      primary: '#059669',
      primaryHover: '#047857',
      secondary: '#0D9488',
      accent: '#10B981',
      background: '#0F1B0F',
      surface: '#1F2937',
      surfaceHover: '#374151',
      text: '#F9FAFB',
      textSecondary: '#E5E7EB',
      textMuted: '#9CA3AF',
      border: '#4B5563',
      borderHover: '#6B7280',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#F87171',
      info: '#3B82F6'
    },
    gradients: {
      primary: 'from-emerald-600 via-teal-700 to-green-800',
      secondary: 'from-teal-600 via-emerald-700 to-green-800',
      accent: 'from-green-500 via-emerald-600 to-teal-700',
      background: 'linear-gradient(135deg, #0F1B0F, #1F2937)',
      card: 'linear-gradient(135deg, #1F2937, #374151)'
    }
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Executive',
    colors: {
      primary: '#DC2626',
      primaryHover: '#B91C1C',
      secondary: '#EA580C',
      accent: '#F59E0B',
      background: '#1F1611',
      surface: '#292524',
      surfaceHover: '#44403C',
      text: '#FAFAF9',
      textSecondary: '#F5F5F4',
      textMuted: '#A8A29E',
      border: '#57534E',
      borderHover: '#78716C',
      success: '#16A34A',
      warning: '#EAB308',
      error: '#DC2626',
      info: '#2563EB'
    },
    gradients: {
      primary: 'from-red-600 via-orange-600 to-yellow-600',
      secondary: 'from-orange-600 via-red-600 to-pink-700',
      accent: 'from-yellow-500 via-orange-600 to-red-700',
      background: 'linear-gradient(135deg, #1F1611, #292524)',
      card: 'linear-gradient(135deg, #292524, #44403C)'
    }
  },
  royal: {
    id: 'royal',
    name: 'Royal Purple',
    colors: {
      primary: '#7C3AED',
      primaryHover: '#6D28D9',
      secondary: '#A855F7',
      accent: '#C084FC',
      background: '#1A0F2E',
      surface: '#2D1B69',
      surfaceHover: '#3730A3',
      text: '#FAF5FF',
      textSecondary: '#F3E8FF',
      textMuted: '#C4B5FD',
      border: '#5B21B6',
      borderHover: '#7C3AED',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#3B82F6'
    },
    gradients: {
      primary: 'from-violet-600 via-purple-700 to-indigo-800',
      secondary: 'from-purple-600 via-violet-700 to-purple-800',
      accent: 'from-indigo-500 via-purple-600 to-violet-700',
      background: 'linear-gradient(135deg, #1A0F2E, #2D1B69)',
      card: 'linear-gradient(135deg, #2D1B69, #3730A3)'
    }
  },
  platinum: {
    id: 'platinum',
    name: 'Platinum Pro',
    colors: {
      primary: '#475569',
      primaryHover: '#334155',
      secondary: '#64748B',
      accent: '#94A3B8',
      background: '#0F172A',
      surface: '#1E293B',
      surfaceHover: '#334155',
      text: '#F8FAFC',
      textSecondary: '#E2E8F0',
      textMuted: '#94A3B8',
      border: '#475569',
      borderHover: '#64748B',
      success: '#22C55E',
      warning: '#EAB308',
      error: '#EF4444',
      info: '#3B82F6'
    },
    gradients: {
      primary: 'from-slate-600 via-gray-700 to-slate-800',
      secondary: 'from-gray-600 via-slate-700 to-gray-800',
      accent: 'from-slate-500 via-gray-600 to-slate-700',
      background: 'linear-gradient(135deg, #0F172A, #1E293B)',
      card: 'linear-gradient(135deg, #1E293B, #334155)'
    }
  }
};

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  currency: 'USD' | 'INR';
  setCurrency: (currency: 'USD' | 'INR') => void;
  formatCurrency: (amount: number) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentThemeId, setCurrentThemeId] = useState<string>('midnight');
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');

  useEffect(() => {
    // Load saved theme and currency from localStorage
    const savedTheme = localStorage.getItem('theme');
    const savedCurrency = localStorage.getItem('currency');
    
    if (savedTheme && themes[savedTheme]) {
      setCurrentThemeId(savedTheme);
    }
    
    if (savedCurrency === 'USD' || savedCurrency === 'INR') {
      setCurrency(savedCurrency);
    }
  }, []);

  useEffect(() => {
    // Apply theme CSS variables to document root
    const theme = themes[currentThemeId];
    const root = document.documentElement;
    
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Save theme to localStorage
    localStorage.setItem('theme', currentThemeId);
  }, [currentThemeId]);

  useEffect(() => {
    // Save currency to localStorage
    localStorage.setItem('currency', currency);
  }, [currency]);

  const setTheme = (themeId: string) => {
    if (themes[themeId]) {
      setCurrentThemeId(themeId);
    }
  };

  const formatCurrency = (amount: number): string => {
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(amount);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    }
  };

  const currentTheme = themes[currentThemeId];

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      setTheme,
      currency,
      setCurrency,
      formatCurrency
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
