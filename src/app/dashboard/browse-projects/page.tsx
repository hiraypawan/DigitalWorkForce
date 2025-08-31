'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Clock, DollarSign, Briefcase, Star, Bot } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description: string;
  budget: string;
  duration: string;
  location: string;
  skills: string[];
  postedBy: string;
  rating: number;
  applicants: number;
  urgent?: boolean;
}

export default function BrowseProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Simulate loading projects
    setTimeout(() => {
      setProjects([
        {
          id: '1',
          title: 'React Dashboard Development',
          description: 'Looking for an experienced React developer to build a modern admin dashboard with data visualization.',
          budget: '$500-1000',
          duration: '2-3 weeks',
          location: 'Remote',
          skills: ['React', 'TypeScript', 'Chart.js', 'Tailwind CSS'],
          postedBy: 'TechCorp Solutions',
          rating: 4.8,
          applicants: 12,
          urgent: true
        },
        {
          id: '2',
          title: 'Mobile App UI/UX Design',
          description: 'Need a creative designer to create modern UI/UX for our fitness tracking mobile application.',
          budget: '$300-600',
          duration: '1-2 weeks',
          location: 'Remote',
          skills: ['Figma', 'Mobile Design', 'Prototyping', 'User Research'],
          postedBy: 'FitLife Startup',
          rating: 4.5,
          applicants: 8
        },
        {
          id: '3',
          title: 'WordPress Site Development',
          description: 'Build a professional business website using WordPress with custom theme and plugins.',
          budget: '$200-400',
          duration: '1 week',
          location: 'Remote',
          skills: ['WordPress', 'PHP', 'CSS', 'SEO'],
          postedBy: 'Local Business Group',
          rating: 4.2,
          applicants: 15
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = [
    { value: 'all', label: 'All Projects' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-development', label: 'Mobile Development' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'writing', label: 'Writing' },
    { value: 'data', label: 'Data & Analytics' }
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-black min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-6">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-700 rounded w-16"></div>
                  <div className="h-6 bg-gray-700 rounded w-16"></div>
                  <div className="h-6 bg-gray-700 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-black min-h-screen">
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 glow-text">Browse Projects</h1>
          <p className="text-gray-300">Find exciting projects that match your skills and interests</p>
        </div>
        <Link href="/ai-chat" className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
          <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-lg px-4 py-3 hover:border-cyan-500/50 transition-all duration-300 flex items-center gap-2 text-cyan-400 hover:text-white">
            <Bot className="w-5 h-5" />
            <span className="text-sm font-medium">AI Project Match</span>
          </div>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="group relative mb-6">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
        <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value} className="bg-gray-900 text-white">
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-blue-500/50 transition-colors">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Project Cards */}
      <div className="space-y-6">
        {projects.map(project => (
          <div key={project.id} className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                    {project.urgent && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-medium rounded-full">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  
                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400 mb-1">{project.budget}</div>
                  <div className="flex items-center gap-1 text-sm text-gray-400 mb-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{project.rating}</span>
                  </div>
                </div>
              </div>
              
              {/* Project Details */}
              <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{project.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  <span>by {project.postedBy}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{project.applicants} applicants</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-3">
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-blue-500/25 font-medium transition-all duration-300 transform hover:scale-105 glow-button">
                  Apply Now
                </button>
                <button className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 hover:border-gray-600 transition-colors">
                  Save
                </button>
                <button className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 hover:border-gray-600 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 glow-button">
          Load More Projects
        </button>
      </div>
    </div>
  );
}
