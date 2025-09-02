'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'glass' | 'highlight' | 'outlined' | 'gradient' | 'solid' | 'vibrant' | 'neon' | 'colorful';
  animate?: boolean;
  glow?: boolean;
}

export function Card({ 
  children, 
  className = '', 
  hover = true, 
  padding = 'md',
  variant = 'glass',
  animate = true,
  glow = false
}: CardProps) {
  const { currentTheme } = useTheme();
  
  const baseClasses = `
    rounded-2xl transition-all duration-400 cubic-bezier(0.4, 0, 0.2, 1)
    ${animate ? 'hover-lift' : ''}
    ${glow ? 'hover-glow' : ''}
    ${hover ? 'cursor-pointer' : ''}
  `;
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'glass-card';
      case 'highlight':
        return 'glass-card-highlight';
      case 'outlined':
        return `border-2 bg-transparent border-blue-400 hover:border-blue-300 hover:bg-blue-500/5`;
      case 'gradient':
        return 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-emerald-600/20 border border-blue-400/40 backdrop-blur-md';
      case 'solid':
        return 'bg-slate-800/90 border border-slate-600 shadow-2xl backdrop-blur-sm';
      case 'vibrant':
        return 'bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 border-2 border-blue-400/60 backdrop-blur-lg shadow-2xl shadow-blue-500/25';
      case 'neon':
        return 'bg-slate-900/80 border-2 border-cyan-400 shadow-lg shadow-cyan-400/25 backdrop-blur-md';
      case 'colorful':
        return 'bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20 border-2 border-orange-400/50 backdrop-blur-lg shadow-xl shadow-orange-500/20';
      default:
        return 'glass-card';
    }
  };
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'outlined':
        return {
          borderColor: `${currentTheme.colors.primary}60`,
          backgroundColor: 'transparent'
        };
      case 'solid':
        return {
          backgroundColor: currentTheme.colors.surface,
          borderColor: currentTheme.colors.border,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        };
      default:
        return {};
    }
  };
  
  return (
    <div 
      className={cn(
        baseClasses,
        getVariantClasses(),
        paddingClasses[padding],
        className
      )}
      style={getVariantStyles()}
    >
      {children}
    </div>
  );
}

export function CardHeader({ 
  children, 
  className = '', 
  centered = false 
}: { 
  children: ReactNode; 
  className?: string;
  centered?: boolean;
}) {
  const { currentTheme } = useTheme();
  
  return (
    <div className={cn(
      'mb-6 pb-4 border-b',
      centered ? 'text-center' : '',
      className
    )} style={{ borderColor: `${currentTheme.colors.border}40` }}>
      {children}
    </div>
  );
}

export function CardTitle({ 
  children, 
  className = '',
  gradient = false,
  size = 'xl'
}: { 
  children: ReactNode; 
  className?: string;
  gradient?: boolean;
  size?: 'lg' | 'xl' | '2xl' | '3xl';
}) {
  const { currentTheme } = useTheme();
  
  const sizeClasses = {
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  };
  
  return (
    <h3 
      className={cn(
        sizeClasses[size],
        'font-bold leading-tight',
        gradient ? 'gradient-text' : '',
        className
      )}
      style={!gradient ? { color: currentTheme.colors.text } : {}}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string; 
}) {
  const { currentTheme } = useTheme();
  
  return (
    <p 
      className={cn('text-sm mt-2 leading-relaxed', className)}
      style={{ color: currentTheme.colors.textMuted }}
    >
      {children}
    </p>
  );
}

export function CardContent({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ 
  children, 
  className = '',
  justify = 'end'
}: { 
  children: ReactNode; 
  className?: string;
  justify?: 'start' | 'center' | 'end' | 'between';
}) {
  const { currentTheme } = useTheme();
  
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  };
  
  return (
    <div 
      className={cn(
        'mt-6 pt-4 border-t flex items-center gap-3',
        justifyClasses[justify],
        className
      )}
      style={{ borderColor: `${currentTheme.colors.border}40` }}
    >
      {children}
    </div>
  );
}
