'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

export function Loading({ 
  size = 'md', 
  text, 
  className = '', 
  fullScreen = false 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const content = (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <Loader2 className={cn('animate-spin text-blue-600', sizeClasses[size])} />
      {text && (
        <p className="mt-3 text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {content}
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
