'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { 
  User, Mail, Star, Briefcase, Code, ExternalLink, MapPin, 
  Phone, Clock, DollarSign, Award, BookOpen, Target, 
  Calendar, Building, Globe, Github, Linkedin, 
  TrendingUp, CheckCircle, Circle, Heart, Plus, X, Save,
  Edit3, Trash2
} from 'lucide-react';

interface EditablePortfolioData {
  userId: string;
  name: string;
  title?: string;
  bio: string;
  location?: string;
  availability?: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  
  skills: Array<{
    name: string;
    proficiency: 'Beginner' | 'Intermediate' | 'Expert' | 'Advanced';
    category?: 'Technical' | 'Soft' | 'Language' | 'Tool';
  }>;
  
  experience: Array<{
    role: string;
    company: string;
    duration: string;
    details: string;
    location?: string;
    achievements?: string[];
    responsibilities?: string[];
  }>;
  
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
    honors?: string;
  }>;
  
  projects: Array<{
    title: string;
    description: string;
    link?: string;
    technologies?: string[];
    status?: 'completed' | 'in-progress' | 'planned';
    outcome?: string;
    metrics?: string;
  }>;
  
  certifications: Array<{
    name: string;
    issuer: string;
    year: string;
    link?: string;
  }>;
  
  portfolioSamples?: {
    github?: string;
    behance?: string;
    dribbble?: string;
    linkedin?: string;
    website?: string;
    uploadedFiles?: string[];
  };
  
  endorsements?: Array<{
    rating: number;
    review: string;
    reviewer: string;
    role?: string;
    company?: string;
    date: string;
  }>;
  
  workPreferences?: {
    expectedSalary?: string;
    workType?: 'Remote' | 'Hybrid' | 'Onsite';
    availability?: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
    noticePeriod?: string;
    preferredIndustries?: string[];
    willingToRelocate?: boolean;
  };
  
  achievements: string[];
  goals: string[];
  hobbies: string[];
  onlineCourses?: string[];
  testimonials?: string[];
  
  contactInfo?: {
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  
  completionPercentage: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
};

export default function EditProfile() {
  const { data: session } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: profileData, error, mutate } = useSWR<EditablePortfolioData>(
    isClient && session?.user ? '/api/portfolio' : null,
    fetcher
  );

  const [formData, setFormData] = useState<EditablePortfolioData | null>(null);

  useEffect(() => {
    if (profileData) {
      setFormData({ ...profileData });
    }
  }, [profileData]);

  const handleSave = async () => {
    if (!formData) return;
    
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      const response = await fetch('/api/portfolio', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save');
      
      setSaveStatus('saved');
      mutate(); // Refresh the data
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  const updateNestedField = (section: string, field: string, value: any) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [section]: {
        ...(formData[section as keyof EditablePortfolioData] as any),
        [field]: value
      }
    });
  };

  const addArrayItem = (field: string, newItem: any) => {
    if (!formData) return;
    const currentArray = (formData[field as keyof EditablePortfolioData] as any[]) || [];
    setFormData({
      ...formData,
      [field]: [...currentArray, newItem]
    });
  };

  const removeArrayItem = (field: string, index: number) => {
    if (!formData) return;
    const currentArray = (formData[field as keyof EditablePortfolioData] as any[]) || [];
    setFormData({
      ...formData,
      [field]: currentArray.filter((_, i) => i !== index)
    });
  };

  const updateArrayItem = (field: string, index: number, newItem: any) => {
    if (!formData) return;
    const currentArray = (formData[field as keyof EditablePortfolioData] as any[]) || [];
    const updatedArray = [...currentArray];
    updatedArray[index] = newItem;
    setFormData({
      ...formData,
      [field]: updatedArray
    });
  };

  if (!isClient || !session?.user) {
    return (
      <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6">
        <div className="text-center text-gray-400">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Sign in to edit your profile</p>
        </div>
      </div>
    );
  }

  if (error || !profileData || !formData) {
    return (
      <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6">
        <div className="text-center text-red-400">
          <p>Failed to load profile data</p>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: BookOpen },
    { id: 'projects', label: 'Projects', icon: Star },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'preferences', label: 'Work Preferences', icon: Target },
    { id: 'other', label: 'Other', icon: Heart }
  ];

  return (
    <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Edit3 className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            saveStatus === 'saved' ? 'bg-green-600 text-white' :
            saveStatus === 'error' ? 'bg-red-600 text-white' :
            'bg-blue-600 hover:bg-blue-700 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Save className="w-4 h-4" />
          {saveStatus === 'saving' ? 'Saving...' :
           saveStatus === 'saved' ? 'Saved!' :
           saveStatus === 'error' ? 'Error' : 'Save Changes'}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Section Navigation */}
        <div className="w-64 space-y-2">
          {sections.map((section) => {
            const IconComponent = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {/* Basic Info Section */}
          {activeSection === 'basic' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Professional Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => updateField('location', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City, Country"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Availability</label>
                  <select
                    value={formData.availability || ''}
                    onChange={(e) => updateField('availability', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select availability</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Professional Bio</label>
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => updateField('bio', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about yourself, your background, and what makes you unique..."
                />
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.contactInfo?.email || ''}
                      onChange={(e) => updateNestedField('contactInfo', 'email', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.contactInfo?.phone || ''}
                      onChange={(e) => updateNestedField('contactInfo', 'phone', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      value={formData.contactInfo?.linkedin || ''}
                      onChange={(e) => updateNestedField('contactInfo', 'linkedin', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">GitHub</label>
                    <input
                      type="url"
                      value={formData.contactInfo?.github || ''}
                      onChange={(e) => updateNestedField('contactInfo', 'github', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Skills Section */}
          {activeSection === 'skills' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Skills</h2>
                <button
                  onClick={() => addArrayItem('skills', { name: '', proficiency: 'Intermediate', category: 'Technical' })}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Skill
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.skills?.map((skill, index) => (
                  <div key={index} className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Skill Name</label>
                        <input
                          type="text"
                          value={typeof skill === 'string' ? skill : skill.name}
                          onChange={(e) => {
                            const updatedSkill = typeof skill === 'string' 
                              ? { name: e.target.value, proficiency: 'Intermediate', category: 'Technical' }
                              : { ...skill, name: e.target.value };
                            updateArrayItem('skills', index, updatedSkill);
                          }}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                          placeholder="e.g., JavaScript"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Proficiency</label>
                        <select
                          value={typeof skill === 'string' ? 'Intermediate' : skill.proficiency}
                          onChange={(e) => {
                            const updatedSkill = typeof skill === 'string'
                              ? { name: skill, proficiency: e.target.value as any, category: 'Technical' }
                              : { ...skill, proficiency: e.target.value as any };
                            updateArrayItem('skills', index, updatedSkill);
                          }}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                        <select
                          value={typeof skill === 'string' ? 'Technical' : skill.category}
                          onChange={(e) => {
                            const updatedSkill = typeof skill === 'string'
                              ? { name: skill, proficiency: 'Intermediate', category: e.target.value as any }
                              : { ...skill, category: e.target.value as any };
                            updateArrayItem('skills', index, updatedSkill);
                          }}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                        >
                          <option value="Technical">Technical</option>
                          <option value="Soft">Soft Skill</option>
                          <option value="Language">Language</option>
                          <option value="Tool">Tool</option>
                        </select>
                      </div>
                      
                      <button
                        onClick={() => removeArrayItem('skills', index)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {(!formData.skills || formData.skills.length === 0) && (
                  <div className="text-center py-8 text-gray-400">
                    <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No skills added yet. Click &quot;Add Skill&quot; to get started.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Experience Section */}
          {activeSection === 'experience' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Work Experience</h2>
                <button
                  onClick={() => addArrayItem('experience', {
                    role: '', company: '', duration: '', details: '', location: '', achievements: [], responsibilities: []
                  })}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Experience
                </button>
              </div>
              
              <div className="space-y-6">
                {formData.experience?.map((exp, index) => (
                  <div key={index} className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-white">Experience {index + 1}</h3>
                      <button
                        onClick={() => removeArrayItem('experience', index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
                        <input
                          type="text"
                          value={exp.role || ''}
                          onChange={(e) => updateArrayItem('experience', index, { ...exp, role: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                          placeholder="e.g., Senior Software Engineer"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                        <input
                          type="text"
                          value={exp.company || ''}
                          onChange={(e) => updateArrayItem('experience', index, { ...exp, company: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                          placeholder="Company name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                        <input
                          type="text"
                          value={exp.duration || ''}
                          onChange={(e) => updateArrayItem('experience', index, { ...exp, duration: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                          placeholder="e.g., Jan 2020 - Present"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                        <input
                          type="text"
                          value={exp.location || ''}
                          onChange={(e) => updateArrayItem('experience', index, { ...exp, location: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                          placeholder="City, Country or Remote"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Job Description</label>
                      <textarea
                        value={exp.details || ''}
                        onChange={(e) => updateArrayItem('experience', index, { ...exp, details: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                        placeholder="Describe your role, responsibilities, and impact..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Key Achievements (one per line)</label>
                      <textarea
                        value={exp.achievements?.join('\n') || ''}
                        onChange={(e) => updateArrayItem('experience', index, { 
                          ...exp, 
                          achievements: e.target.value.split('\n').filter(a => a.trim()) 
                        })}
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                        placeholder="• Increased team productivity by 40%&#10;• Led migration to microservices architecture&#10;• Mentored 5 junior developers"
                      />
                    </div>
                  </div>
                ))}
                
                {(!formData.experience || formData.experience.length === 0) && (
                  <div className="text-center py-8 text-gray-400">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No work experience added yet. Click &quot;Add Experience&quot; to get started.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Education Section */}
          {activeSection === 'education' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Education</h2>
                <button
                  onClick={() => addArrayItem('education', { degree: '', institution: '', year: '', gpa: '', honors: '' })}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Education
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.education?.map((edu, index) => (
                  <div key={index} className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-white">Education {index + 1}</h3>
                      <button
                        onClick={() => removeArrayItem('education', index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Degree/Program</label>
                        <input
                          type="text"
                          value={edu.degree || ''}
                          onChange={(e) => updateArrayItem('education', index, { ...edu, degree: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                          placeholder="e.g., Bachelor of Computer Science"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Institution</label>
                        <input
                          type="text"
                          value={edu.institution || ''}
                          onChange={(e) => updateArrayItem('education', index, { ...edu, institution: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                          placeholder="University/School name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Graduation Year</label>
                        <input
                          type="text"
                          value={edu.year || ''}
                          onChange={(e) => updateArrayItem('education', index, { ...edu, year: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                          placeholder="e.g., 2023"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">GPA (optional)</label>
                        <input
                          type="text"
                          value={edu.gpa || ''}
                          onChange={(e) => updateArrayItem('education', index, { ...edu, gpa: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                          placeholder="e.g., 3.8/4.0"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Honors/Awards (optional)</label>
                      <input
                        type="text"
                        value={edu.honors || ''}
                        onChange={(e) => updateArrayItem('education', index, { ...edu, honors: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                        placeholder="e.g., Magna Cum Laude"
                      />
                    </div>
                  </div>
                ))}
                
                {(!formData.education || formData.education.length === 0) && (
                  <div className="text-center py-8 text-gray-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No education added yet. Click &quot;Add Education&quot; to get started.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {activeSection === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Projects</h2>
                <button
                  onClick={() => addArrayItem('projects', {
                    title: '', description: '', link: '', technologies: [], status: 'completed'
                  })}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </button>
              </div>
              
              <div className="space-y-6">
                {formData.projects?.map((project, index) => (
                  <div key={index} className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-white">Project {index + 1}</h3>
                      <button
                        onClick={() => removeArrayItem('projects', index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Project Title</label>
                        <input
                          type="text"
                          value={project.title || ''}
                          onChange={(e) => updateArrayItem('projects', index, { ...project, title: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                          placeholder="Project name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                        <select
                          value={project.status || 'completed'}
                          onChange={(e) => updateArrayItem('projects', index, { ...project, status: e.target.value as any })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                        >
                          <option value="completed">Completed</option>
                          <option value="in-progress">In Progress</option>
                          <option value="planned">Planned</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                      <textarea
                        value={project.description || ''}
                        onChange={(e) => updateArrayItem('projects', index, { ...project, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                        placeholder="Describe what the project does and your contribution..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Project Link (optional)</label>
                        <input
                          type="url"
                          value={project.link || ''}
                          onChange={(e) => updateArrayItem('projects', index, { ...project, link: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                          placeholder="https://..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Technologies (comma-separated)</label>
                        <input
                          type="text"
                          value={project.technologies?.join(', ') || ''}
                          onChange={(e) => updateArrayItem('projects', index, { 
                            ...project, 
                            technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                          })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                          placeholder="React, Node.js, MongoDB"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!formData.projects || formData.projects.length === 0) && (
                  <div className="text-center py-8 text-gray-400">
                    <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No projects added yet. Click &quot;Add Project&quot; to get started.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Work Preferences Section */}
          {activeSection === 'preferences' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">Work Preferences</h2>
              
              <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Expected Salary</label>
                    <input
                      type="text"
                      value={formData.workPreferences?.expectedSalary || ''}
                      onChange={(e) => updateNestedField('workPreferences', 'expectedSalary', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                      placeholder="e.g., $80,000 - $100,000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Work Type</label>
                    <select
                      value={formData.workPreferences?.workType || ''}
                      onChange={(e) => updateNestedField('workPreferences', 'workType', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                    >
                      <option value="">Select work type</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Onsite">Onsite</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Notice Period</label>
                    <input
                      type="text"
                      value={formData.workPreferences?.noticePeriod || ''}
                      onChange={(e) => updateNestedField('workPreferences', 'noticePeriod', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                      placeholder="e.g., 2 weeks, 1 month"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Willing to Relocate</label>
                    <select
                      value={formData.workPreferences?.willingToRelocate ? 'yes' : 'no'}
                      onChange={(e) => updateNestedField('workPreferences', 'willingToRelocate', e.target.value === 'yes')}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Industries (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.workPreferences?.preferredIndustries?.join(', ') || ''}
                    onChange={(e) => updateNestedField('workPreferences', 'preferredIndustries', 
                      e.target.value.split(',').map(i => i.trim()).filter(i => i)
                    )}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                    placeholder="Technology, Healthcare, Finance"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Other Section - Goals, Hobbies, etc. */}
          {activeSection === 'other' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">Additional Information</h2>
              
              <div className="space-y-6">
                {/* Career Goals */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Career Goals (one per line)</label>
                  <textarea
                    value={formData.goals?.join('\n') || ''}
                    onChange={(e) => updateField('goals', e.target.value.split('\n').filter(g => g.trim()))}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                    placeholder="• Become a technical lead&#10;• Master cloud architecture&#10;• Start my own tech company"
                  />
                </div>
                
                {/* Achievements */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Personal Achievements (one per line)</label>
                  <textarea
                    value={formData.achievements?.join('\n') || ''}
                    onChange={(e) => updateField('achievements', e.target.value.split('\n').filter(a => a.trim()))}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                    placeholder="• Won hackathon at XYZ event&#10;• Published article on Medium&#10;• Contributed to open source project"
                  />
                </div>
                
                {/* Hobbies */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Hobbies & Interests (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.hobbies?.join(', ') || ''}
                    onChange={(e) => updateField('hobbies', e.target.value.split(',').map(h => h.trim()).filter(h => h))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                    placeholder="Photography, Hiking, Reading, Gaming"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
