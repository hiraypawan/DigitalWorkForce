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
    borderLight: string;
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

// Comfortable Dark Theme - Easy on the eyes, professional and balanced
export const modernDarkTheme: Theme = {
  id: 'modern-dark',
  name: 'DigitalWorkForce Comfortable',
  colors: {
    primary: '#60A5FA',    // Softer blue, less harsh
    primaryHover: '#3B82F6',
    secondary: '#A78BFA',  // Softer purple
    accent: '#34D399',     // Softer green-cyan
    background: '#0F172A', // Warmer dark background
    surface: '#1E293B',    // Warmer surface
    surfaceHover: '#334155',
    text: '#F1F5F9',       // Softer white, less harsh
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',
    border: '#475569',
    borderHover: '#64748B',
    borderLight: '#64748B',
    success: '#22C55E',    // Softer green
    warning: '#FBB928',    // Softer yellow
    error: '#F87171',      // Softer red
    info: '#60A5FA'
  },
  gradients: {
    primary: 'from-slate-900 via-slate-800 to-slate-900',
    secondary: 'from-slate-800 via-slate-700 to-slate-800',
    accent: 'from-slate-900 via-blue-900/20 to-slate-900',
    background: 'linear-gradient(135deg, #0F172A, #1E293B, #0F172A)',
    card: 'linear-gradient(135deg, #1E293B, #334155)'
  }
};

interface ThemeContextType {
  currentTheme: Theme;
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
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');

  useEffect(() => {
    // Load saved currency from localStorage
    const savedCurrency = localStorage.getItem('currency');
    
    if (savedCurrency === 'USD' || savedCurrency === 'INR') {
      setCurrency(savedCurrency);
    }
  }, []);

  useEffect(() => {
    // Apply theme CSS variables to document root
    const root = document.documentElement;
    
    Object.entries(modernDarkTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, []);

  useEffect(() => {
    // Save currency to localStorage
    localStorage.setItem('currency', currency);
  }, [currency]);

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

  return (
    <ThemeContext.Provider value={{
      currentTheme: modernDarkTheme,
      currency,
      setCurrency,
      formatCurrency
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
