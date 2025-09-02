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

// Vibrant Colorful Theme - Modern, engaging and visually appealing
export const modernDarkTheme: Theme = {
  id: 'modern-colorful',
  name: 'DigitalWorkForce Vibrant',
  colors: {
    primary: '#3B82F6',      // Vibrant blue
    primaryHover: '#2563EB', // Deeper blue
    secondary: '#8B5CF6',    // Vibrant purple  
    accent: '#10B981',       // Vibrant emerald
    background: '#0A0E27',   // Deep navy background
    surface: '#1A1B3A',     // Rich dark surface
    surfaceHover: '#2D2E5F', // Lighter hover state
    text: '#FFFFFF',         // Pure white for contrast
    textSecondary: '#E2E8F0', // Light gray
    textMuted: '#94A3B8',    // Medium gray
    border: '#3B4263',       // Subtle border
    borderHover: '#4F5578',  // Hover border
    borderLight: '#6B7289',  // Light border
    success: '#10B981',      // Emerald green
    warning: '#F59E0B',      // Amber warning
    error: '#EF4444',        // Red error
    info: '#06B6D4'          // Cyan info
  },
  gradients: {
    primary: 'from-blue-600 via-blue-500 to-blue-400',
    secondary: 'from-purple-600 via-purple-500 to-purple-400', 
    accent: 'from-emerald-600 via-emerald-500 to-emerald-400',
    background: 'linear-gradient(135deg, #0A0E27 0%, #1A1B3A 25%, #2D1B69 50%, #1A1B3A 75%, #0A0E27 100%)',
    card: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(16, 185, 129, 0.1) 100%)'
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
