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

// Modern Dark Theme with Gradients - Professional yet engaging
export const modernDarkTheme: Theme = {
  id: 'modern-dark',
  name: 'DigitalWorkForce Modern',
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
