'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import {
  MessageSquare,
  Send,
  Users,
  Mail,
  MailOpen,
  Archive,
  Star,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Building,
  User
} from 'lucide-react';

export default function MessagesPage() {
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
          <p style={{ color: currentTheme.colors.textMuted }}>Loading messages...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ background: currentTheme.gradients.background, minHeight: '100vh' }}>
      {/* Header */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ 
              backgroundColor: `${currentTheme.colors.primary}15`,
              color: currentTheme.colors.primary
            }}
          >
            <MessageSquare className="w-5 h-5" />
          </div>
          <h1 
            className="text-3xl font-bold"
            style={{ color: currentTheme.colors.text }}
          >
            Messages
          </h1>
        </div>
        <p 
          className="text-lg"
          style={{ color: currentTheme.colors.textMuted }}
        >
          Communicate with employers and collaborate on projects.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ 
                backgroundColor: `${currentTheme.colors.primary}15`,
                color: currentTheme.colors.primary
              }}
            >
              <MessageSquare className="w-4 h-4" />
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
                Total Conversations
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ 
                backgroundColor: `${currentTheme.colors.primary}15`,
                color: currentTheme.colors.primary
              }}
            >
              <Mail className="w-4 h-4" />
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
                Unread Messages
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ 
                backgroundColor: `${currentTheme.colors.primary}15`,
                color: currentTheme.colors.primary
              }}
            >
              <Users className="w-4 h-4" />
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
                Active Contacts
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ 
                backgroundColor: '#FCD34D20',
                color: '#FCD34D'
              }}
            >
              <Star className="w-4 h-4" />
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
                Starred Messages
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="glass-card text-center py-16">
        <div 
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ 
            backgroundColor: `${currentTheme.colors.primary}15`,
            color: currentTheme.colors.primary
          }}
        >
          <MessageSquare className="w-10 h-10" />
        </div>
        
        <h3 
          className="text-2xl font-semibold mb-4"
          style={{ color: currentTheme.colors.text }}
        >
          No Messages Yet
        </h3>
        
        <p 
          className="text-lg mb-8 max-w-md mx-auto"
          style={{ color: currentTheme.colors.textMuted }}
        >
          Start conversations with employers by applying to projects. Once you submit applications, you&apos;ll be able to communicate directly with potential employers.
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
            href="/dashboard/my-applications"
            className="btn-secondary inline-flex items-center gap-2 px-8 py-3"
          >
            <MessageSquare className="w-5 h-5" />
            View Applications
          </Link>
        </div>

        {/* Tips Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="glass-card p-4 text-left">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{ 
                backgroundColor: `${currentTheme.colors.primary}15`,
                color: currentTheme.colors.primary
              }}
            >
              <Send className="w-4 h-4" />
            </div>
            <h4 
              className="font-semibold mb-2"
              style={{ color: currentTheme.colors.text }}
            >
              Start Conversations
            </h4>
            <p 
              className="text-sm"
              style={{ color: currentTheme.colors.textMuted }}
            >
              Apply to projects to initiate direct communication with employers and project managers.
            </p>
          </div>

          <div className="glass-card p-4 text-left">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{ 
                backgroundColor: `${currentTheme.colors.primary}15`,
                color: currentTheme.colors.primary
              }}
            >
              <Building className="w-4 h-4" />
            </div>
            <h4 
              className="font-semibold mb-2"
              style={{ color: currentTheme.colors.text }}
            >
              Professional Communication
            </h4>
            <p 
              className="text-sm"
              style={{ color: currentTheme.colors.textMuted }}
            >
              Maintain professional dialogue with employers about project requirements and expectations.
            </p>
          </div>

          <div className="glass-card p-4 text-left">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{ 
                backgroundColor: `${currentTheme.colors.accent}20`,
                color: currentTheme.colors.accent
              }}
            >
              <Archive className="w-4 h-4" />
            </div>
            <h4 
              className="font-semibold mb-2"
              style={{ color: currentTheme.colors.text }}
            >
              Organized Inbox
            </h4>
            <p 
              className="text-sm"
              style={{ color: currentTheme.colors.textMuted }}
            >
              Keep track of all project-related communications in one organized place with search and filtering.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-8 border-t" style={{ borderColor: currentTheme.colors.border }}>
          <p 
            className="text-sm mb-4"
            style={{ color: currentTheme.colors.textMuted }}
          >
            Get started with these quick actions:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link 
              href="/dashboard/profile"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Complete Profile
            </Link>
            <Link 
              href="/dashboard/browse-projects"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Find Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
