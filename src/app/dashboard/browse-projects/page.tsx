'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Clock, DollarSign, Briefcase, Star } from 'lucide-react';

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Projects</h1>
        <p className="text-gray-600">Find exciting projects that match your skills and interests</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Project Cards */}
      <div className="space-y-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                  {project.urgent && (
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 mb-1">{project.budget}</div>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{project.rating}</span>
                </div>
              </div>
            </div>
            
            {/* Project Details */}
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
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
              <button className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium">
                Apply Now
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50">
                Save
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <button className="px-6 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50">
          Load More Projects
        </button>
      </div>
    </div>
  );
}
