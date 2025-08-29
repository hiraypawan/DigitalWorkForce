'use client';

import { ReactNode } from 'react';
import { Card } from './Card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon, 
  description, 
  trend,
  color = 'blue',
  className = '' 
}: StatsCardProps) {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    red: 'text-red-600'
  };
  
  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span className={cn(
                'text-sm font-medium',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={cn('w-12 h-12 rounded-lg bg-opacity-10 flex items-center justify-center', 
          color === 'blue' && 'bg-blue-600',
          color === 'green' && 'bg-green-600',
          color === 'purple' && 'bg-purple-600',
          color === 'orange' && 'bg-orange-600',
          color === 'red' && 'bg-red-600'
        )}>
          <div className={cn('w-6 h-6', colorClasses[color])}>
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
}
