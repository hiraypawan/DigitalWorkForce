'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  ClipboardList, 
  DollarSign, 
  TrendingUp, 
  Star,
  CheckCircle,
  Clock,
  BarChart3,
  LogOut
} from 'lucide-react';

interface DashboardStats {
  totalEarnings: number;
  completedTasks: number;
  pendingTasks: number;
  rating: number;
  profileCompleteness: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalEarnings: 0,
    completedTasks: 0,
    pendingTasks: 0,
    rating: 0,
    profileCompleteness: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user profile data - using credentials: 'include' for session cookies
      const profileResponse = await fetch('/api/users/profile', {
        credentials: 'include',
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        
        setStats({
          totalEarnings: profileData.user?.totalEarnings || 0,
          completedTasks: profileData.user?.completedTasks || 0,
          pendingTasks: 0, // Will be fetched from tasks API
          rating: profileData.user?.rating || 0,
          profileCompleteness: profileData.user?.profileCompleteness || 0,
        });
      }
      
      // Fetch pending tasks count
      const tasksResponse = await fetch('/api/jobs/list?status=assigned', {
        credentials: 'include',
      });
      
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        setStats(prev => ({
          ...prev,
          pendingTasks: tasksData.tasks?.length || 0,
        }));
      }
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">DigitalWorkforce</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {session?.user?.name || 'User'}</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your tasks, track earnings, and update your profile.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalEarnings.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingTasks}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold text-gray-900">{stats.rating.toFixed(1)}</p>
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/dashboard/tasks" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <ClipboardList className="w-10 h-10 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">My Tasks</h3>
                <p className="text-sm text-gray-600">View and manage your assigned tasks</p>
              </div>
            </div>
          </Link>
          
          <Link href="/dashboard/earnings" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <TrendingUp className="w-10 h-10 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Earnings</h3>
                <p className="text-sm text-gray-600">Track your income and investments</p>
              </div>
            </div>
          </Link>
          
          <Link href="/dashboard/profile" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <User className="w-10 h-10 text-purple-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
                <p className="text-sm text-gray-600">Update your skills and experience</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Profile Completeness */}
        {stats.profileCompleteness < 80 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-800">Complete Your Profile</h3>
                <p className="text-yellow-700 text-sm mb-3">
                  Your profile is {stats.profileCompleteness}% complete. A complete profile helps you get better task matches.
                </p>
                <div className="w-full bg-yellow-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${stats.profileCompleteness}%` }}
                  ></div>
                </div>
              </div>
              <Link 
                href="/dashboard/profile"
                className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
              >
                Complete Profile
              </Link>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {stats.completedTasks === 0 ? (
              <div className="text-center py-8">
                <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No tasks completed yet</p>
                <p className="text-sm text-gray-400">Complete your first task to start earning!</p>
              </div>
            ) : (
              <p className="text-gray-600">You have completed {stats.completedTasks} tasks so far. Great work!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
