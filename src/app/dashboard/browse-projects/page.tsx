'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Clock, DollarSign, Briefcase, Star, Bot, BookmarkIcon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
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
  const { currentTheme, formatCurrency } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Fetch real projects data
    const fetchProjects = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/projects');
        // const data = await response.json();
        // setProjects(data);
        
        // Set empty array - no demo data
        setProjects([]);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ background: currentTheme.gradients.background, minHeight: '100vh' }}>
        <div className="animate-pulse">
          <div className="h-8 rounded w-1/4 mb-6" style={{ backgroundColor: currentTheme.colors.border }}></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card p-6">
                <div className="h-4 rounded w-3/4 mb-2" style={{ backgroundColor: currentTheme.colors.borderLight }}></div>
                <div className="h-3 rounded w-1/2 mb-4" style={{ backgroundColor: currentTheme.colors.borderLight }}></div>
                <div className="flex gap-2">
                  <div className="h-6 rounded w-16" style={{ backgroundColor: currentTheme.colors.borderLight }}></div>
                  <div className="h-6 rounded w-16" style={{ backgroundColor: currentTheme.colors.borderLight }}></div>
                  <div className="h-6 rounded w-16" style={{ backgroundColor: currentTheme.colors.borderLight }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ background: currentTheme.gradients.background, minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 glow-text" style={{ color: currentTheme.colors.text }}>Browse Projects 🔍</h1>
          <p className="text-xl" style={{ color: currentTheme.colors.textMuted }}>Find exciting projects that match your skills and interests</p>
        </div>
        <Link href="/ai-chat" className="btn-secondary inline-flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <span>AI Project Match</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search 
                className="w-5 h-5 absolute left-3 top-3" 
                style={{ color: currentTheme.colors.textMuted }}
              />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-chip-input w-full pl-10"
                style={{
                  backgroundColor: 'rgba(20, 30, 48, 0.4)',
                  borderColor: currentTheme.colors.border,
                  color: currentTheme.colors.text
                }}
              />
            </div>
          </div>
          
          {/* Filter Chips */}
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`filter-chip ${
                  selectedCategory === category.value ? 'active' : ''
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Project Cards or AI Recommendations */}
      {projects.length === 0 ? (
        <div className="space-y-8">
          {/* AI Recommendations Placeholder */}
          <div className="glass-card p-8">
            <div className="flex items-start gap-6">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse-glow"
                style={{ 
                  backgroundColor: `${currentTheme.colors.primary}20`,
                  color: currentTheme.colors.primary
                }}
              >
                <Bot className="w-8 h-8" />
              </div>
              
              <div className="flex-1">
                <h3 
                  className="text-2xl font-bold mb-3 flex items-center gap-2"
                  style={{ color: currentTheme.colors.text }}
                >
                  🔮 AI Project Recommendations Coming Soon!
                </h3>
                
                <p 
                  className="text-base mb-6 leading-relaxed"
                  style={{ color: currentTheme.colors.textMuted }}
                >
                  Based on your profile, we&apos;ll match you with projects from top companies. 
                  The more complete your profile, the better matches you&apos;ll receive.
                </p>
                
                {/* Mock AI Recommendations */}
                <div className="space-y-4 mb-6">
                  <div className="p-4 rounded-xl border-2 border-dashed" 
                       style={{ borderColor: `${currentTheme.colors.primary}40`, backgroundColor: `${currentTheme.colors.primary}05` }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.colors.success }}></div>
                      <span className="font-semibold" style={{ color: currentTheme.colors.text }}>React Developer - TechCorp</span>
                      <span className="text-sm px-2 py-1 rounded-full" 
                            style={{ backgroundColor: `${currentTheme.colors.success}20`, color: currentTheme.colors.success }}>95% match</span>
                    </div>
                    <p className="text-sm" style={{ color: currentTheme.colors.textMuted }}>Full-stack development with React & Node.js</p>
                  </div>
                  
                  <div className="p-4 rounded-xl border-2 border-dashed" 
                       style={{ borderColor: `${currentTheme.colors.secondary}40`, backgroundColor: `${currentTheme.colors.secondary}05` }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.colors.warning }}></div>
                      <span className="font-semibold" style={{ color: currentTheme.colors.text }}>UI/UX Designer - Creative Studio</span>
                      <span className="text-sm px-2 py-1 rounded-full" 
                            style={{ backgroundColor: `${currentTheme.colors.warning}20`, color: currentTheme.colors.warning }}>78% match</span>
                    </div>
                    <p className="text-sm" style={{ color: currentTheme.colors.textMuted }}>Modern web design with Figma & Adobe Creative Suite</p>
                  </div>
                </div>
                
                <Link 
                  href="/dashboard/profile"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Briefcase className="w-5 h-5" />
                  Complete Profile to Unlock Matches
                </Link>
              </div>
            </div>
          </div>
          
          {/* Motivational Empty State */}
          <div className="text-center py-12">
            <div 
              className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center animate-float"
              style={{ 
                backgroundColor: `${currentTheme.colors.accent}20`,
                color: currentTheme.colors.accent
              }}
            >
              <Search className="w-12 h-12" />
            </div>
            
            <h3 
              className="text-3xl font-bold mb-4 gradient-text"
            >
              Your Perfect Projects Are Coming
            </h3>
            
            <p 
              className="text-lg mb-8 max-w-2xl mx-auto leading-relaxed"
              style={{ color: currentTheme.colors.textMuted }}
            >
              We&apos;re building an amazing marketplace of opportunities.
              Complete your profile now to be first in line for premium projects from top companies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/dashboard/profile"
                className="btn-primary inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold"
              >
                <Star className="w-5 h-5" />
                Complete Your Profile
              </Link>
              
              <Link 
                href="/ai-chat"
                className="btn-secondary inline-flex items-center gap-2 px-6 py-4"
              >
                <Bot className="w-5 h-5" />
                Chat with AI Assistant
              </Link>
            </div>
            
            {/* Progress Indicator */}
            <div className="mt-8 max-w-sm mx-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm" style={{ color: currentTheme.colors.textMuted }}>Profile Completion</span>
                <span className="text-sm font-bold" style={{ color: currentTheme.colors.primary }}>25%</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: `${currentTheme.colors.border}40` }}>
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: '25%', backgroundColor: currentTheme.colors.primary }}
                ></div>
              </div>
              <p className="text-xs mt-2" style={{ color: currentTheme.colors.textMuted }}>
                Reach 75% to unlock premium project matches
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map(project => (
          <div key={project.id} className="glass-card p-6 group hover:scale-102 transition-all duration-300 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-25 transition duration-300"></div>
            <div className="relative">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                <div className="flex-1">
                  {/* Title and Urgent Badge */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold" style={{ color: currentTheme.colors.text }}>
                        {project.title}
                      </h3>
                      {project.urgent && (
                        <span 
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{ 
                            backgroundColor: `${currentTheme.colors.error}20`,
                            color: currentTheme.colors.error,
                            border: `1px solid ${currentTheme.colors.error}40`
                          }}
                        >
                          Urgent
                        </span>
                      )}
                    </div>
                  </div>
                
                {/* Company Info */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1 text-sm" style={{ color: currentTheme.colors.textMuted }}>
                    <Briefcase className="w-4 h-4" />
                    <span>by {project.postedBy}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm" style={{ color: currentTheme.colors.textMuted }}>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{project.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{project.applicants} applicants</span>
                    </div>
                  </div>
                </div>
                
                <p className="mb-4" style={{ color: currentTheme.colors.textSecondary }}>
                  {project.description}
                </p>
                
                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
                {/* Right Side - Budget and Actions */}
                <div className="lg:text-right lg:min-w-[200px] flex flex-row lg:flex-col gap-4 lg:gap-3">
                  <div className="flex-1 lg:flex-none">
                    <div className="text-2xl font-bold mb-2 glow-text" style={{ color: currentTheme.colors.accent }}>
                      {project.budget}
                    </div>
                    <div className="flex items-center gap-1 text-sm" style={{ color: currentTheme.colors.textMuted }}>
                      <Star className="w-4 h-4" style={{ color: '#FCD34D', fill: '#FCD34D' }} />
                      <span>{project.rating}</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2 lg:w-full">
                    <button className="btn-primary flex-1 lg:w-full glow-button">
                      Apply Now
                    </button>
                    <div className="flex gap-2">
                      <button 
                        className="btn-secondary flex items-center gap-1 px-3"
                        title="Save Project"
                      >
                        <BookmarkIcon className="w-4 h-4" />
                        Save
                      </button>
                      <button className="btn-secondary px-3">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Load More - only show if there are projects */}
      {projects.length > 0 && (
        <div className="text-center mt-8">
          <button className="btn-primary px-8 py-4 glow-button">
            Load More Projects
          </button>
        </div>
      )}
    </div>
  );
}
