'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { 
  User, Mail, Star, Briefcase, Code, ExternalLink, MapPin, 
  GraduationCap, Award, Target, Heart, Trash2, Edit3, 
  Download, Share2, Copy, Eye, EyeOff
} from 'lucide-react';

interface Education {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
  honors?: string;
}

interface Experience {
  role: string;
  company: string;
  duration: string;
  details: string;
  location?: string;
  achievements?: string[];
}

interface Project {
  title: string;
  description: string;
  link?: string;
  technologies?: string[];
  status?: 'completed' | 'in-progress' | 'planned';
}

interface Skill {
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category?: 'Technical' | 'Soft' | 'Language' | 'Tool';
}

interface Certification {
  name: string;
  issuer: string;
  year: string;
  link?: string;
}

interface WorkPreferences {
  expectedSalary?: string;
  workType?: 'Remote' | 'Hybrid' | 'Onsite';
  availability?: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  noticePeriod?: string;
  preferredIndustries?: string[];
  willingToRelocate?: boolean;
}

interface Endorsement {
  rating: number;
  review: string;
  reviewer: string;
  role?: string;
  company?: string;
  date: string;
}

interface PortfolioData {
  _id: string;
  userId: string;
  name: string;
  title?: string; // Professional title
  bio: string;
  location?: string;
  availability?: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  
  education: Education[];
  experience: Experience[];
  skills: (string | Skill)[]; // Support both formats for backward compatibility
  projects: Project[];
  certifications: (string | Certification)[];
  achievements: string[];
  goals: string[];
  hobbies: string[];
  
  contactInfo?: {
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  
  portfolioSamples?: {
    github?: string;
    behance?: string;
    dribbble?: string;
    linkedin?: string;
    website?: string;
    uploadedFiles?: string[];
  };
  
  workPreferences?: WorkPreferences;
  endorsements?: Endorsement[];
  testimonials?: string[];
  onlineCourses?: string[];
  
  // Legacy fields for backward compatibility
  preferences?: {
    workType?: string[];
    salaryRange?: string;
    availability?: string;
  };
  
  lastUpdated: string;
  completionPercentage: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: 'include', // Include session cookies
  });
  
  if (!res.ok) throw new Error('Failed to fetch portfolio');
  return res.json();
};

export default function AdvancedProfilePreview() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showExportOptions, setShowExportOptions] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const { data: portfolioData, error, mutate } = useSWR<PortfolioData>(
    isClient && session?.user ? '/api/portfolio' : null,
    fetcher,
    {
      refreshInterval: 5000, // Refresh every 5 seconds instead of 1 second
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const deleteItem = async (field: string, index: number) => {
    try {
      const response = await fetch('/api/portfolio', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field, index }),
        credentials: 'include',
      });

      if (response.ok) {
        mutate(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const exportPortfolio = async (format: 'pdf' | 'json' | 'link') => {
    try {
      const response = await fetch(`/api/portfolio/export?format=${format}`, {
        credentials: 'include',
      });

      if (response.ok) {
        if (format === 'json') {
          const data = await response.json();
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'portfolio.json';
          a.click();
        } else if (format === 'link') {
          const data = await response.json();
          navigator.clipboard.writeText(data.link);
          alert('Portfolio link copied to clipboard!');
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (!isClient) {
    return (
      <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6">
        <div className="text-center text-gray-400">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6">
        <div className="text-center text-gray-400">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm mb-4">Create your professional profile</p>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.href = '/auth/login'}
              className="block w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold text-sm"
            >
              Sign In
            </button>
            <p className="text-xs text-gray-500">Sign in to save your profile permanently</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900/50 backdrop-blur border border-red-800/50 rounded-2xl p-6">
        <div className="text-center text-red-400">
          <p className="text-sm">The shadows hide your profile...</p>
          <button 
            onClick={() => mutate()}
            className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
          >
            Summon it back
          </button>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-700 rounded-full"></div>
            <div>
              <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-24"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-3 bg-gray-700 rounded w-full"></div>
            <div className="h-3 bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const { 
    name, bio, education, experience, skills, projects, 
    certifications, achievements, goals, hobbies, 
    contactInfo, completionPercentage 
  } = portfolioData;

  // Calculate real-time completion percentage for more accuracy
  const calculateRealTimeCompletion = () => {
    let completed = 0;
    const total = 12; // Total essential sections

    // Essential fields (weighted scoring)
    if (name?.trim()) completed += 1.5; // Name is critical
    if (bio?.trim()) completed += 1.5; // Bio is critical
    if (portfolioData.title?.trim()) completed += 1; // Professional title
    if (portfolioData.location?.trim()) completed += 0.5; // Location
    if (skills && skills.length > 0) completed += 1.5; // Skills are critical
    if (experience && experience.length > 0) completed += 1.5; // Experience is critical
    if (education && education.length > 0) completed += 1; // Education
    if (projects && projects.length > 0) completed += 1; // Projects
    if (certifications && certifications.length > 0) completed += 0.5; // Certifications
    if (achievements && achievements.length > 0) completed += 0.5; // Achievements
    if (goals && goals.length > 0) completed += 0.5; // Goals
    if (hobbies && hobbies.length > 0) completed += 0.5; // Hobbies
    if (contactInfo && Object.values(contactInfo).some(v => v)) completed += 0.5; // Contact info
    
    return Math.min(Math.round((completed / total) * 100), 100);
  };

  const realTimeCompletion = calculateRealTimeCompletion();
  const displayCompletion = Math.max(completionPercentage, realTimeCompletion);

  return (
    <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6 h-fit sticky top-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            Portfolio Preview
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Export Options"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-2 text-sm">
          <div className="flex-1 bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${displayCompletion}%` }}
            />
          </div>
          <span className="text-gray-400">{displayCompletion}%</span>
        </div>

        {/* Export Options */}
        {showExportOptions && (
          <div className="mt-4 p-4 bg-black/50 border border-gray-700 rounded-lg">
            <p className="text-sm text-gray-300 mb-3">Export your portfolio</p>
            <div className="flex gap-2">
              <button
                onClick={() => exportPortfolio('json')}
                className="px-3 py-1 bg-blue-600/20 text-blue-300 text-xs rounded hover:bg-blue-600/30"
              >
                JSON
              </button>
              <button
                onClick={() => exportPortfolio('link')}
                className="px-3 py-1 bg-purple-600/20 text-purple-300 text-xs rounded hover:bg-purple-600/30"
              >
                Share Link
              </button>
              <button
                onClick={() => exportPortfolio('pdf')}
                className="px-3 py-1 bg-green-600/20 text-green-300 text-xs rounded hover:bg-green-600/30"
              >
                PDF
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">
            {name || 'Your identity awaits...'}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Mail className="w-4 h-4" />
            {contactInfo?.email || session.user.email}
          </div>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
        {/* Professional Overview */}
        <div className="space-y-3">
          {/* Title & Availability */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-gray-800/30 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Title</p>
              <p className="text-white text-sm font-medium">
                {portfolioData.title || 'Not specified'}
              </p>
            </div>
            <div className="p-2 bg-gray-800/30 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Availability</p>
              <p className="text-white text-sm font-medium">
                {portfolioData.availability || 'Not specified'}
              </p>
            </div>
          </div>
          
          {/* Location & Contact */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-gray-800/30 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Location</p>
              <p className="text-white text-sm">
                {portfolioData.location || 'Not specified'}
              </p>
            </div>
            <div className="p-2 bg-gray-800/30 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Contact</p>
              <div className="flex gap-1">
                {contactInfo?.linkedin && (
                  <a href={contactInfo.linkedin} target="_blank" className="text-blue-400 hover:text-blue-300">
                    <span className="text-xs">LI</span>
                  </a>
                )}
                {contactInfo?.github && (
                  <a href={contactInfo.github} target="_blank" className="text-purple-400 hover:text-purple-300">
                    <span className="text-xs">GH</span>
                  </a>
                )}
                {contactInfo?.website && (
                  <a href={contactInfo.website} target="_blank" className="text-green-400 hover:text-green-300">
                    <span className="text-xs">WEB</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="group">
          <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            Professional Summary
          </h4>
          {bio ? (
            <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
              <p className="text-gray-300 text-sm leading-relaxed">{bio}</p>
            </div>
          ) : (
            <div className="p-3 border border-gray-700 border-dashed rounded-lg">
              <p className="text-gray-500 text-xs text-center">
                Your story remains untold...
              </p>
            </div>
          )}
        </div>

        {/* Education */}
        <div className="group">
          <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Education ({education.length})
          </h4>
          {education.length > 0 ? (
            <div className="space-y-2">
              {education.map((edu, index) => (
                <div key={index} className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg group/item">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{edu.degree}</p>
                      <p className="text-blue-300 text-xs">{edu.institution}</p>
                      <p className="text-gray-400 text-xs">{edu.year}</p>
                      {edu.honors && <p className="text-yellow-300 text-xs">🏆 {edu.honors}</p>}
                    </div>
                    <button
                      onClick={() => deleteItem('education', index)}
                      className="opacity-0 group-hover/item:opacity-100 p-1 text-red-400 hover:text-red-300 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 border border-gray-700 border-dashed rounded-lg">
              <p className="text-gray-500 text-xs text-center">
                Your academic journey waits to be revealed...
              </p>
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="group">
          <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
            <Code className="w-4 h-4" />
            Skills ({skills.length})
          </h4>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="group/item px-3 py-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-blue-300 text-xs rounded-full flex items-center gap-1 hover:from-blue-600/30 hover:to-purple-600/30 transition-all"
                >
                  {typeof skill === 'string' ? skill : skill.name}
                  <button
                    onClick={() => deleteItem('skills', index)}
                    className="opacity-0 group-hover/item:opacity-100 text-red-400 hover:text-red-300 transition-all"
                  >
                    <Trash2 className="w-2 h-2" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="p-3 border border-gray-700 border-dashed rounded-lg">
              <p className="text-gray-500 text-xs text-center">
                Your abilities remain hidden in the shadows...
              </p>
            </div>
          )}
        </div>

        {/* Experience */}
        <div className="group">
          <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Experience ({experience.length})
          </h4>
          {experience.length > 0 ? (
            <div className="space-y-2">
              {experience.map((exp, index) => (
                <div key={index} className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg group/item">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{exp.role}</p>
                      <p className="text-blue-300 text-xs">{exp.company}</p>
                      <p className="text-gray-400 text-xs">{exp.duration}</p>
                      <p className="text-gray-300 text-xs mt-1">{exp.details}</p>
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="mt-1">
                          {exp.achievements.map((achievement, achieveIndex) => (
                            <p key={achieveIndex} className="text-yellow-300 text-xs">✨ {achievement}</p>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => deleteItem('experience', index)}
                      className="opacity-0 group-hover/item:opacity-100 p-1 text-red-400 hover:text-red-300 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 border border-gray-700 border-dashed rounded-lg">
              <p className="text-gray-500 text-xs text-center">
                Your professional legacy lies dormant...
              </p>
            </div>
          )}
        </div>

        {/* Projects */}
        <div className="group">
          <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Projects ({projects.length})
          </h4>
          {projects.length > 0 ? (
            <div className="space-y-2">
              {projects.map((project, index) => (
                <div key={index} className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg group/item">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium text-sm">{project.title}</p>
                        {project.status && (
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            project.status === 'completed' ? 'bg-green-600/20 text-green-300' :
                            project.status === 'in-progress' ? 'bg-yellow-600/20 text-yellow-300' :
                            'bg-blue-600/20 text-blue-300'
                          }`}>
                            {project.status}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-xs mt-1">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="px-2 py-0.5 bg-purple-600/20 text-purple-300 text-xs rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.link && (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs mt-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Project
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => deleteItem('projects', index)}
                      className="opacity-0 group-hover/item:opacity-100 p-1 text-red-400 hover:text-red-300 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 border border-gray-700 border-dashed rounded-lg">
              <p className="text-gray-500 text-xs text-center">
                Your creations remain in the void...
              </p>
            </div>
          )}
        </div>

        {/* Certifications */}
        <div className="group">
          <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Certifications ({certifications.length})
          </h4>
          {certifications.length > 0 ? (
            <div className="space-y-1">
              {certifications.map((cert, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-800/30 rounded group/item">
                  <p className="text-gray-300 text-xs">{typeof cert === 'string' ? cert : cert.name}</p>
                  <button
                    onClick={() => deleteItem('certifications', index)}
                    className="opacity-0 group-hover/item:opacity-100 text-red-400 hover:text-red-300 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 border border-gray-700 border-dashed rounded-lg">
              <p className="text-gray-500 text-xs text-center">
                Your credentials await recognition...
              </p>
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="group">
          <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Achievements ({achievements.length})
          </h4>
          {achievements.length > 0 ? (
            <div className="space-y-1">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-800/30 rounded group/item">
                  <p className="text-gray-300 text-xs">🏆 {achievement}</p>
                  <button
                    onClick={() => deleteItem('achievements', index)}
                    className="opacity-0 group-hover/item:opacity-100 text-red-400 hover:text-red-300 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 border border-gray-700 border-dashed rounded-lg">
              <p className="text-gray-500 text-xs text-center">
                Your achievements await their moment...
              </p>
            </div>
          )}
        </div>

        {/* Goals */}
        <div className="group">
          <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Goals ({goals.length})
          </h4>
          {goals.length > 0 ? (
            <div className="space-y-1">
              {goals.map((goal, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-800/30 rounded group/item">
                  <p className="text-gray-300 text-xs">🎯 {goal}</p>
                  <button
                    onClick={() => deleteItem('goals', index)}
                    className="opacity-0 group-hover/item:opacity-100 text-red-400 hover:text-red-300 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 border border-gray-700 border-dashed rounded-lg">
              <p className="text-gray-500 text-xs text-center">
                Your aspirations await definition...
              </p>
            </div>
          )}
        </div>

        {/* Hobbies */}
        <div className="group">
          <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Hobbies ({hobbies.length})
          </h4>
          {hobbies.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {hobbies.map((hobby, index) => (
                <span
                  key={index}
                  className="group/item px-2 py-1 bg-red-600/20 border border-red-500/30 text-red-300 text-xs rounded flex items-center gap-1"
                >
                  {hobby}
                  <button
                    onClick={() => deleteItem('hobbies', index)}
                    className="opacity-0 group-hover/item:opacity-100 text-red-400 hover:text-red-300 transition-all"
                  >
                    <Trash2 className="w-2 h-2" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="p-3 border border-gray-700 border-dashed rounded-lg">
              <p className="text-gray-500 text-xs text-center">
                Your passions remain hidden...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Completion Prompt */}
      {displayCompletion < 100 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-300 text-sm text-center">
            🌑 Your portfolio hungers for more... Feed it your secrets.
          </p>
          <div className="mt-2 text-center">
            <span className="text-xs text-gray-400">
              {Math.max(1, 8 - Math.ceil((displayCompletion / 100) * 8))} more sections to complete
            </span>
          </div>
        </div>
      )}

      {displayCompletion === 100 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-600/10 to-blue-600/10 border border-green-500/20 rounded-lg">
          <p className="text-green-300 text-sm text-center">
            ⚡ Your portfolio is complete. Your story is ready to conquer the world.
          </p>
        </div>
      )}
    </div>
  );
}
