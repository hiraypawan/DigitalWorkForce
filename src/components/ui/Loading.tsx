'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'ring';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

export function Loading({ 
  size = 'md', 
  variant = 'spinner',
  text, 
  className = '', 
  fullScreen = false 
}: LoadingProps) {
  const { currentTheme } = useTheme();
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const LoadingSpinner = () => (
    <div 
      className={cn('animate-spin rounded-full border-2', sizeClasses[size])}
      style={{
        borderColor: `${currentTheme.colors.primary}30`,
        borderTopColor: currentTheme.colors.primary
      }}
    />
  );

  const LoadingDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full animate-bounce',
            size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'
          )}
          style={{
            backgroundColor: currentTheme.colors.primary,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );

  const LoadingRing = () => (
    <div className={cn('relative', sizeClasses[size])}>
      <div 
        className="absolute inset-0 rounded-full border-2 animate-spin"
        style={{
          borderColor: 'transparent',
          borderTopColor: currentTheme.colors.primary,
          borderRightColor: currentTheme.colors.secondary
        }}
      />
      <div 
        className="absolute inset-1 rounded-full border-2 animate-spin"
        style={{
          borderColor: 'transparent',
          borderBottomColor: currentTheme.colors.accent,
          animationDirection: 'reverse',
          animationDuration: '0.75s'
        }}
      />
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots': return <LoadingDots />;
      case 'ring': return <LoadingRing />;
      default: return <LoadingSpinner />;
    }
  };

  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      {renderLoader()}
      {text && (
        <p 
          className="text-sm font-medium animate-pulse"
          style={{ color: currentTheme.colors.textMuted }}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
        style={{ backgroundColor: `${currentTheme.colors.background}90` }}
      >
        <div className="glass-card p-8 rounded-2xl min-w-[200px]">
          {content}
        </div>
      </div>
    );
  }

  return content;
}

export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={cn('animate-pulse', className)}>
      <div className="shimmer rounded-md h-4 bg-gray-200 mb-3"></div>
      <div className="shimmer rounded-md h-4 bg-gray-200 mb-3 w-3/4"></div>
      <div className="shimmer rounded-md h-4 bg-gray-200 w-1/2"></div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg border p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="shimmer h-6 bg-gray-200 rounded w-24"></div>
        <div className="shimmer h-6 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="space-y-3">
        <div className="shimmer h-5 bg-gray-200 rounded w-full"></div>
        <div className="shimmer h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="shimmer h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}
