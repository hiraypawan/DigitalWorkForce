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
  LogOut,
  Bot,
  MessageSquare
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              DigitalWorkforce
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">Welcome, {session?.user?.name || 'User'}</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-gray-800 rounded-lg"
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
          <h1 className="text-3xl font-bold text-white mb-2 glow-text">Dashboard</h1>
          <p className="text-gray-300">Manage your tasks, track earnings, and update your profile.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Earnings</p>
                  <p className="text-2xl font-bold text-white">₹{stats.totalEarnings.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Completed Tasks</p>
                  <p className="text-2xl font-bold text-white">{stats.completedTasks}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-orange-500/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending Tasks</p>
                  <p className="text-2xl font-bold text-white">{stats.pendingTasks}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-400" />
              </div>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Rating</p>
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-bold text-white">{stats.rating.toFixed(1)}</p>
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  </div>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/dashboard/tasks" className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center gap-4">
                <ClipboardList className="w-10 h-10 text-blue-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">My Tasks</h3>
                  <p className="text-sm text-gray-300">View and manage your assigned tasks</p>
                </div>
              </div>
            </div>
          </Link>
          
          <Link href="/dashboard/earnings" className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300">
              <div className="flex items-center gap-4">
                <TrendingUp className="w-10 h-10 text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Earnings</h3>
                  <p className="text-sm text-gray-300">Track your income and investments</p>
                </div>
              </div>
            </div>
          </Link>
          
          <Link href="/dashboard/profile" className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center gap-4">
                <User className="w-10 h-10 text-purple-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Profile</h3>
                  <p className="text-sm text-gray-300">Update your skills and experience</p>
                </div>
              </div>
            </div>
          </Link>
          
          <Link href="/ai-chat" className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300">
              <div className="flex items-center gap-4">
                <Bot className="w-10 h-10 text-cyan-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Guide</h3>
                  <p className="text-sm text-gray-300">Get career advice and help</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Profile Completeness */}
        {stats.profileCompleteness < 80 && (
          <div className="group relative mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-yellow-500/50 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">Complete Your Profile</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Your profile is {stats.profileCompleteness}% complete. A complete profile helps you get better task matches.
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${stats.profileCompleteness}%` }}
                    ></div>
                  </div>
                </div>
                <Link 
                  href="/dashboard/profile"
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105 glow-button"
                >
                  Complete Profile
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
            <h2 className="text-xl font-semibold text-white mb-4 glow-text">Recent Activity</h2>
            <div className="space-y-3">
              {stats.completedTasks === 0 ? (
                <div className="text-center py-8">
                  <ClipboardList className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-300">No tasks completed yet</p>
                  <p className="text-sm text-gray-400">Complete your first task to start earning!</p>
                </div>
              ) : (
                <p className="text-gray-300">You have completed {stats.completedTasks} tasks so far. Great work!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
