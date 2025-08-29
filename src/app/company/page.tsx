'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Briefcase, 
  Users, 
  Clock,
  CheckCircle,
  DollarSign,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface CompanyStats {
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  totalWorkersHired: number;
  totalSpent: number;
}

interface Job {
  _id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  budget: number;
  deadline: string;
  tasks: any[];
  selectedWorkers: any[];
  createdAt: string;
}

export default function CompanyPage() {
  const [stats, setStats] = useState<CompanyStats>({
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    totalWorkersHired: 0,
    totalSpent: 0,
  });
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch company's jobs
      const jobsResponse = await fetch('/api/jobs/list', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        const jobs = jobsData.jobs || [];
        setRecentJobs(jobs.slice(0, 5)); // Show latest 5 jobs
        
        // Calculate stats
        const activeJobs = jobs.filter((job: Job) => job.status === 'in_progress').length;
        const completedJobs = jobs.filter((job: Job) => job.status === 'completed').length;
        const totalSpent = jobs.reduce((sum: number, job: Job) => sum + job.budget, 0);
        const totalWorkersHired = new Set(
          jobs.flatMap((job: Job) => job.selectedWorkers?.map((w: any) => w._id) || [])
        ).size;
        
        setStats({
          totalJobs: jobs.length,
          activeJobs,
          completedJobs,
          totalWorkersHired,
          totalSpent,
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">DigitalWorkforce</h1>
            <div className="flex items-center gap-4">
              <Link
                href="/company/projects"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Post New Job
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Dashboard</h1>
          <p className="text-gray-600">Manage your projects and track worker performance.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Jobs Posted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Workers Hired</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalWorkersHired}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalSpent.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/company/projects" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <Plus className="w-12 h-12 text-blue-600 bg-blue-100 rounded-lg p-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Post New Project</h3>
                <p className="text-sm text-gray-600">Create and publish a new job for workers</p>
              </div>
            </div>
          </Link>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-4">
              <BarChart3 className="w-12 h-12 text-green-600 bg-green-100 rounded-lg p-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">View detailed performance metrics</p>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full mt-1 inline-block">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
            <Link href="/company/projects" className="text-blue-600 hover:text-blue-700 text-sm">
              View All Projects
            </Link>
          </div>
          
          {recentJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-4">Create your first project to get started with DigitalWorkforce</p>
              <Link 
                href="/company/projects"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{job.description.substring(0, 150)}...</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ₹{job.budget.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {job.selectedWorkers?.length || 0} workers
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {getDaysRemaining(job.deadline)} days left
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {job.status === 'open' && (
                        <button 
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                          onClick={() => assignJob(job._id)}
                        >
                          Assign Workers
                        </button>
                      )}
                      <Link 
                        href={`/company/projects/${job._id}`}
                        className="px-3 py-1 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  async function assignJob(jobId: string) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/jobs/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId }),
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`Successfully assigned ${data.assignmentsCount} tasks to workers!`);
        fetchDashboardData(); // Refresh the data
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to assign job');
      }
    } catch (error) {
      console.error('Assignment error:', error);
      alert('Failed to assign job. Please try again.');
    }
  }
}
