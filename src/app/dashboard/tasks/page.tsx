'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  DollarSign,
  Calendar,
  Filter,
  Search
} from 'lucide-react';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'reviewed';
  estimatedHours: number;
  budget: number;
  deadline: string;
  skills: string[];
  jobId: {
    title: string;
    description: string;
    budget: number;
  };
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'assigned' | 'available'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const status = filter === 'all' ? '' : filter;
      const response = await fetch(`/api/jobs/list?status=${status}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
      case 'assigned':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'in_progress':
        return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-300 border border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'assigned':
      case 'in_progress':
        return <AlertTriangle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getDaysRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-white glow-text">My Tasks</h1>
            </div>
            <div className="text-sm text-gray-300">
              {filteredTasks.length} tasks
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="group relative mb-6">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all" className="bg-gray-900 text-white">All Tasks</option>
                  <option value="assigned" className="bg-gray-900 text-white">My Tasks</option>
                  <option value="available" className="bg-gray-900 text-white">Available</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-300">Loading...</p>
            </div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl blur opacity-25 transition duration-300"></div>
            <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-12 text-center">
              <Clock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No tasks found</h3>
              <p className="text-gray-400">
                {filter === 'assigned' 
                  ? "You don&apos;t have any assigned tasks yet."
                  : "No tasks match your current filters."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div key={task._id} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {getStatusIcon(task.status)}
                      {task.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-400">
                      {getDaysRemaining(task.deadline)} days left
                    </span>
                  </div>
                  
                  {/* Task Details */}
                  <h3 className="text-lg font-semibold text-white mb-2">{task.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">{task.description}</p>
                  
                  {/* Job Reference */}
                  <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-400 mb-1">Part of project:</p>
                    <p className="font-medium text-white">{task.jobId.title}</p>
                  </div>
                  
                  {/* Skills Required */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">Skills required:</p>
                    <div className="flex flex-wrap gap-1">
                      {task.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Bottom Info */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {task.estimatedHours}h
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ₹{task.budget}
                      </div>
                    </div>
                    
                    {task.status === 'pending' && (
                      <button className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 text-xs font-medium transition-all duration-300 glow-button">
                        Apply
                      </button>
                    )}
                    
                    {task.status === 'assigned' && (
                      <button className="px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/25 text-xs font-medium transition-all duration-300 glow-button">
                        Start Work
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
