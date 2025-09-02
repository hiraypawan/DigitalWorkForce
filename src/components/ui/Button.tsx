'use client';

import { cn } from '@/lib/utils';
import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'gradient' | 'vibrant' | 'neon' | 'colorful';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: ReactNode;
  glow?: boolean;
  animate?: boolean;
}

export function Button({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  disabled,
  glow = false,
  animate = true,
  ...props 
}: ButtonProps) {
  const { currentTheme } = useTheme();
  
  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-semibold rounded-xl
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
    relative overflow-hidden backdrop-blur-sm
    ${animate ? 'hover:scale-105 active:scale-95' : ''}
    ${glow ? 'hover-glow' : ''}
  `;
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-2.5 text-sm min-h-[40px]',
    lg: 'px-6 py-3 text-base min-h-[44px]',
    xl: 'px-8 py-4 text-lg min-h-[48px]'
  };
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.primaryHover})`,
          color: 'white',
          boxShadow: `0 4px 15px ${currentTheme.colors.primary}40`,
          border: 'none'
        };
      case 'secondary':
        return {
          background: `${currentTheme.colors.surface}CC`,
          color: currentTheme.colors.primary,
          border: `1px solid ${currentTheme.colors.primary}60`,
          boxShadow: `0 2px 8px ${currentTheme.colors.primary}20`
        };
      case 'outline':
        return {
          background: 'transparent',
          color: currentTheme.colors.text,
          border: `1px solid ${currentTheme.colors.border}`,
          boxShadow: 'none'
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: currentTheme.colors.textSecondary,
          border: 'none',
          boxShadow: 'none'
        };
      case 'danger':
        return {
          background: `linear-gradient(135deg, ${currentTheme.colors.error}, #DC2626)`,
          color: 'white',
          border: 'none',
          boxShadow: `0 4px 15px ${currentTheme.colors.error}40`
        };
      case 'success':
        return {
          background: `linear-gradient(135deg, ${currentTheme.colors.success}, #059669)`,
          color: 'white',
          border: 'none',
          boxShadow: `0 4px 15px ${currentTheme.colors.success}40`
        };
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary}, ${currentTheme.colors.accent})`,
          color: 'white',
          border: 'none',
          boxShadow: `0 4px 20px ${currentTheme.colors.primary}30`
        };
      case 'vibrant':
        return {
          background: 'linear-gradient(135deg, #3B82F6, #8B5CF6, #EC4899)',
          color: 'white',
          border: 'none',
          boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)'
        };
      case 'neon':
        return {
          background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
          color: 'white',
          border: '2px solid #22D3EE',
          boxShadow: '0 0 20px rgba(34, 211, 238, 0.5), 0 4px 15px rgba(6, 182, 212, 0.3)'
        };
      case 'colorful':
        return {
          background: 'linear-gradient(135deg, #F59E0B, #EF4444, #EC4899)',
          color: 'white',
          border: 'none',
          boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)'
        };
      default:
        return {};
    }
  };
  
  return (
    <button 
      className={cn(baseClasses, sizeClasses[size], className)}
      style={getVariantStyles()}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="loading-spinner w-4 h-4" />
      )}
      {!loading && icon && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      <span className="relative z-10">{children}</span>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full transition-transform duration-500 group-hover:translate-x-full" />
    </button>
  );
}
