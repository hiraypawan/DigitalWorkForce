'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import {
  FileText,
  Search,
  Plus,
  Filter,
  Calendar,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export default function MyApplicationsPage() {
  const { data: session, status } = useSession();
  const { currentTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: currentTheme.colors.background }}
      >
        <div className="text-center">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: currentTheme.colors.primary }}
          >
            <div 
              className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: 'white' }}
            ></div>
          </div>
          <p style={{ color: currentTheme.colors.textMuted }}>Loading applications...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ backgroundColor: currentTheme.colors.background }}>
      {/* Header */}
      <div className="professional-card p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ 
              backgroundColor: `${currentTheme.colors.primary}15`,
              color: currentTheme.colors.primary
            }}
          >
            <FileText className="w-5 h-5" />
          </div>
          <h1 
            className="text-3xl font-bold"
            style={{ color: currentTheme.colors.text }}
          >
            My Applications
          </h1>
        </div>
        <p 
          className="text-lg"
          style={{ color: currentTheme.colors.textMuted }}
        >
          Track your project applications and manage your submissions.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="professional-card p-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ 
                backgroundColor: `${currentTheme.colors.primary}15`,
                color: currentTheme.colors.primary
              }}
            >
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ color: currentTheme.colors.text }}
              >
                0
              </p>
              <p 
                className="text-sm"
                style={{ color: currentTheme.colors.textMuted }}
              >
                Total Applications
              </p>
            </div>
          </div>
        </div>

        <div className="professional-card p-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ 
                backgroundColor: `${currentTheme.colors.primary}15`,
                color: currentTheme.colors.primary
              }}
            >
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ color: currentTheme.colors.text }}
              >
                0
              </p>
              <p 
                className="text-sm"
                style={{ color: currentTheme.colors.textMuted }}
              >
                Pending Review
              </p>
            </div>
          </div>
        </div>

        <div className="professional-card p-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ 
                backgroundColor: `${currentTheme.colors.accent}20`,
                color: currentTheme.colors.accent
              }}
            >
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ color: currentTheme.colors.text }}
              >
                0
              </p>
              <p 
                className="text-sm"
                style={{ color: currentTheme.colors.textMuted }}
              >
                Accepted
              </p>
            </div>
          </div>
        </div>

        <div className="professional-card p-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ 
                backgroundColor: '#10B98120',
                color: '#10B981'
              }}
            >
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ color: currentTheme.colors.text }}
              >
                0
              </p>
              <p 
                className="text-sm"
                style={{ color: currentTheme.colors.textMuted }}
              >
                Completed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="professional-card text-center py-16">
        <div 
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ 
            backgroundColor: `${currentTheme.colors.primary}15`,
            color: currentTheme.colors.primary
          }}
        >
          <FileText className="w-10 h-10" />
        </div>
        
        <h3 
          className="text-2xl font-semibold mb-4"
          style={{ color: currentTheme.colors.text }}
        >
          No Applications Yet
        </h3>
        
        <p 
          className="text-lg mb-8 max-w-md mx-auto"
          style={{ color: currentTheme.colors.textMuted }}
        >
          You haven&apos;t applied to any projects yet. Start browsing available opportunities and submit your first application.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/dashboard/browse-projects"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3"
          >
            <Search className="w-5 h-5" />
            Browse Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <Link 
            href="/dashboard/profile"
            className="btn-secondary inline-flex items-center gap-2 px-8 py-3"
          >
            <Building className="w-5 h-5" />
            Complete Profile
          </Link>
        </div>

        {/* Tips Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="professional-card p-4 text-left">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{ 
                backgroundColor: `${currentTheme.colors.primary}15`,
                color: currentTheme.colors.primary
              }}
            >
              <Search className="w-4 h-4" />
            </div>
            <h4 
              className="font-semibold mb-2"
              style={{ color: currentTheme.colors.text }}
            >
              Find Projects
            </h4>
            <p 
              className="text-sm"
              style={{ color: currentTheme.colors.textMuted }}
            >
              Browse through available projects and find ones that match your skills and interests.
            </p>
          </div>

          <div className="professional-card p-4 text-left">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{ 
                backgroundColor: `${currentTheme.colors.primary}15`,
                color: currentTheme.colors.primary
              }}
            >
              <Plus className="w-4 h-4" />
            </div>
            <h4 
              className="font-semibold mb-2"
              style={{ color: currentTheme.colors.text }}
            >
              Submit Applications
            </h4>
            <p 
              className="text-sm"
              style={{ color: currentTheme.colors.textMuted }}
            >
              Apply to projects with a compelling proposal highlighting your relevant experience.
            </p>
          </div>

          <div className="professional-card p-4 text-left">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{ 
                backgroundColor: `${currentTheme.colors.accent}20`,
                color: currentTheme.colors.accent
              }}
            >
              <CheckCircle className="w-4 h-4" />
            </div>
            <h4 
              className="font-semibold mb-2"
              style={{ color: currentTheme.colors.text }}
            >
              Track Progress
            </h4>
            <p 
              className="text-sm"
              style={{ color: currentTheme.colors.textMuted }}
            >
              Monitor your application status and communicate with employers through our platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
