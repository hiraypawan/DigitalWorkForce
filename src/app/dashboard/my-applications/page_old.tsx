'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import {
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Filter,
  Search,
  Calendar,
  DollarSign,
  MapPin,
  Building,
  ExternalLink,
  MessageSquare,
  Download,
  ArrowUpRight
} from 'lucide-react';

interface Application {
  id: string;
  projectTitle: string;
  company: string;
  companyLogo?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'completed';
  appliedDate: string;
  budget: string;
  location: string;
  projectType: string;
  description: string;
  skills: string[];
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
  messages: number;
  lastUpdate: string;
}

const mockApplications: Application[] = [
  {
    id: '1',
    projectTitle: 'Full-Stack E-commerce Platform',
    company: 'TechCorp Solutions',
    status: 'pending',
    appliedDate: '2024-01-15',
    budget: '$5,000 - $8,000',
    location: 'Remote',
    projectType: 'Web Development',
    description: 'Build a modern e-commerce platform with React, Node.js, and PostgreSQL.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    priority: 'high',
    deadline: '2024-02-15',
    messages: 3,
    lastUpdate: '2024-01-18'
  },
  {
    id: '2',
    projectTitle: 'Mobile App for Healthcare',
    company: 'HealthTech Inc',
    status: 'reviewed',
    appliedDate: '2024-01-12',
    budget: '$3,000 - $5,000',
    location: 'New York, NY',
    projectType: 'Mobile Development',
    description: 'Develop a mobile app for patient management and appointment scheduling.',
    skills: ['React Native', 'Firebase', 'Healthcare APIs'],
    priority: 'medium',
    deadline: '2024-01-30',
    messages: 7,
    lastUpdate: '2024-01-17'
  },
  {
    id: '3',
    projectTitle: 'AI Chatbot Integration',
    company: 'StartupXYZ',
    status: 'accepted',
    appliedDate: '2024-01-10',
    budget: '$2,000 - $3,500',
    location: 'Remote',
    projectType: 'AI/ML',
    description: 'Integrate an AI chatbot into existing website using OpenAI API.',
    skills: ['Python', 'OpenAI API', 'JavaScript', 'Flask'],
    priority: 'high',
    deadline: '2024-01-25',
    messages: 12,
    lastUpdate: '2024-01-19'
  },
  {
    id: '4',
    projectTitle: 'WordPress Plugin Development',
    company: 'Digital Agency Pro',
    status: 'rejected',
    appliedDate: '2024-01-08',
    budget: '$800 - $1,200',
    location: 'Remote',
    projectType: 'WordPress',
    description: 'Create a custom WordPress plugin for SEO optimization.',
    skills: ['PHP', 'WordPress', 'MySQL', 'JavaScript'],
    priority: 'low',
    messages: 2,
    lastUpdate: '2024-01-14'
  },
  {
    id: '5',
    projectTitle: 'Data Analytics Dashboard',
    company: 'Analytics Pro',
    status: 'completed',
    appliedDate: '2023-12-15',
    budget: '$4,500 - $6,000',
    location: 'San Francisco, CA',
    projectType: 'Data Science',
    description: 'Build an interactive dashboard for business intelligence and data visualization.',
    skills: ['Python', 'Tableau', 'SQL', 'D3.js'],
    priority: 'medium',
    messages: 18,
    lastUpdate: '2024-01-05'
  }
];

const statusConfig = {
  pending: { color: 'text-yellow-400', bg: 'bg-yellow-900/20', icon: Clock, label: 'Pending Review' },
  reviewed: { color: 'text-blue-400', bg: 'bg-blue-900/20', icon: Eye, label: 'Under Review' },
  accepted: { color: 'text-green-400', bg: 'bg-green-900/20', icon: CheckCircle, label: 'Accepted' },
  rejected: { color: 'text-red-400', bg: 'bg-red-900/20', icon: XCircle, label: 'Rejected' },
  completed: { color: 'text-purple-400', bg: 'bg-purple-900/20', icon: CheckCircle, label: 'Completed' }
};

const priorityConfig = {
  low: { color: 'text-gray-400', bg: 'bg-gray-900/20' },
  medium: { color: 'text-blue-400', bg: 'bg-blue-900/20' },
  high: { color: 'text-red-400', bg: 'bg-red-900/20' }
};

export default function MyApplicationsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>(mockApplications);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'priority'>('date');

  useEffect(() => {
    let filtered = applications;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(app =>
        app.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.projectType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort applications
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

    setFilteredApplications(filtered);
  }, [applications, statusFilter, searchQuery, sortBy]);

  const getStatusStats = () => {
    const stats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      reviewed: applications.filter(app => app.status === 'reviewed').length,
      accepted: applications.filter(app => app.status === 'accepted').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      completed: applications.filter(app => app.status === 'completed').length
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                My Applications
              </h1>
              <p className="text-gray-400">Track your project applications and their status</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-gray-400">Total Applications</div>
            </div>
            <div className="bg-yellow-900/20 backdrop-blur border border-yellow-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
              <div className="text-sm text-yellow-300">Pending</div>
            </div>
            <div className="bg-blue-900/20 backdrop-blur border border-blue-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-400">{stats.reviewed}</div>
              <div className="text-sm text-blue-300">Under Review</div>
            </div>
            <div className="bg-green-900/20 backdrop-blur border border-green-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-400">{stats.accepted}</div>
              <div className="text-sm text-green-300">Accepted</div>
            </div>
            <div className="bg-red-900/20 backdrop-blur border border-red-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
              <div className="text-sm text-red-300">Rejected</div>
            </div>
            <div className="bg-purple-900/20 backdrop-blur border border-purple-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-400">{stats.completed}</div>
              <div className="text-sm text-purple-300">Completed</div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Under Review</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'status' | 'priority')}
              className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="status">Sort by Status</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="grid gap-6">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No applications found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            filteredApplications.map((application) => {
              const StatusIcon = statusConfig[application.status].icon;
              return (
                <div
                  key={application.id}
                  className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Main Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2 hover:text-blue-400 cursor-pointer">
                            {application.projectTitle}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-300 mb-2">
                            <Building className="w-4 h-4" />
                            <span>{application.company}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {application.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {application.budget}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Applied {new Date(application.appliedDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {/* Priority Badge */}
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[application.priority].bg} ${priorityConfig[application.priority].color}`}>
                            {application.priority.toUpperCase()}
                          </div>
                          {/* Status Badge */}
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[application.status].bg} ${statusConfig[application.status].color}`}>
                            <StatusIcon className="w-4 h-4" />
                            {statusConfig[application.status].label}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4 line-clamp-2">{application.description}</p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {application.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full border border-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Additional Info */}
                      <div className="flex items-center gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {application.messages} messages
                        </div>
                        {application.deadline && (
                          <div className="flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            Due {new Date(application.deadline).toLocaleDateString()}
                          </div>
                        )}
                        <div>
                          Last update: {new Date(application.lastUpdate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 lg:w-48">
                      <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        Messages ({application.messages})
                      </button>
                      {application.status === 'accepted' && (
                        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                          <ExternalLink className="w-4 h-4" />
                          Start Project
                        </button>
                      )}
                      {application.status === 'completed' && (
                        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                          Invoice
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
