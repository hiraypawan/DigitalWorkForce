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

// Professional Dark Theme - Sleek, modern and business-focused
export const modernDarkTheme: Theme = {
  id: 'professional-dark',
  name: 'DigitalWorkForce Professional',
  colors: {
    primary: '#3B82F6',      // Professional blue
    primaryHover: '#2563EB', // Deeper blue
    secondary: '#6366F1',    // Refined indigo
    accent: '#06B6D4',       // Modern cyan
    background: '#0F172A',   // Professional slate
    surface: '#1E293B',     // Elegant surface
    surfaceHover: '#334155', // Subtle hover
    text: '#F8FAFC',         // Soft white
    textSecondary: '#E2E8F0', // Light slate
    textMuted: '#94A3B8',    // Medium slate
    border: '#475569',       // Professional border
    borderHover: '#64748B',  // Hover border
    borderLight: '#94A3B8',  // Light border
    success: '#10B981',      // Emerald green
    warning: '#F59E0B',      // Amber warning
    error: '#EF4444',        // Red error
    info: '#06B6D4'          // Cyan info
  },
  gradients: {
    primary: 'from-blue-600 to-blue-500',
    secondary: 'from-indigo-600 to-indigo-500', 
    accent: 'from-cyan-600 to-cyan-500',
    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    card: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)'
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
