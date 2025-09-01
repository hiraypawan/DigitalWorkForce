'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    primaryHover: string;
    accent: string;
    background: string;
    surface: string;
    surfaceHover: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    borderLight: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

// Professional TalentSync Theme - Clean, trustworthy, modern
export const professionalTheme: Theme = {
  id: 'professional',
  name: 'TalentSync Professional',
  colors: {
    // Primary: Deep Navy Blue - Trust, stability, professionalism
    primary: '#0F2557',
    primaryHover: '#0A1A3E',
    
    // Accent: Vibrant Coral - Energy, warmth, call-to-action
    accent: '#FF6B6B',
    
    // Backgrounds: Light, clean, professional
    background: '#F8FAFC',  // Very light gray background
    surface: '#FFFFFF',      // White cards and surfaces
    surfaceHover: '#F1F5F9', // Light hover state
    
    // Text: Proper contrast and hierarchy
    text: '#1E293B',         // Almost black for headings
    textSecondary: '#334155', // Dark gray for body text
    textMuted: '#64748B',     // Medium gray for less important text
    
    // Borders: Subtle separation
    border: '#E2E8F0',       // Light border for cards
    borderLight: '#F1F5F9',   // Very light border
    
    // Status colors
    success: '#10B981',
    warning: '#F59E0B', 
    error: '#EF4444',
    info: '#0F2557'  // Same as primary
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
    
    Object.entries(professionalTheme.colors).forEach(([key, value]) => {
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
      currentTheme: professionalTheme,
      currency,
      setCurrency,
      formatCurrency
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
