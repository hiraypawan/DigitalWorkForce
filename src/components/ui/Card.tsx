'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'gradient';
}

export function Card({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'md',
  variant = 'default' 
}: CardProps) {
  const baseClasses = 'rounded-lg border';
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const variantClasses = {
    default: 'bg-white border-gray-200 shadow-sm',
    outlined: 'bg-white border-gray-300',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
  };
  
  const hoverClasses = hover ? 'hover:shadow-md transition-shadow duration-200' : '';
  
  return (
    <div className={cn(
      baseClasses,
      paddingClasses[padding],
      variantClasses[variant],
      hoverClasses,
      className
    )}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-xl font-semibold text-gray-900', className)}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn(className)}>
      {children}
    </div>
  );
}
