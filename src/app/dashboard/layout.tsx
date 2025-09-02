'use client';

import DashboardHeader from '@/components/DashboardHeader';
import { useTheme } from '@/contexts/ThemeContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentTheme } = useTheme();
  
  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{ 
        backgroundColor: currentTheme.colors.background,
        color: currentTheme.colors.text
      }}
    >
      <DashboardHeader />
      <main className="pt-20 relative">  {/* Add top padding for fixed header */}
        {children}
      </main>
    </div>
  );
}
