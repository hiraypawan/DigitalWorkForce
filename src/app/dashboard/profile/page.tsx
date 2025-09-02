'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  X, 
  User,
  Mail,
  Briefcase,
  Star,
  Award,
  Heart,
  MessageSquare,
  Bot
} from 'lucide-react';
import { ProfileProgress } from '@/components/ui/ProfileProgress';
import { ResumeUpload } from '@/components/ui/ResumeUpload';

interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  skills: string[];
  hobbies: string[];
  experience: Experience[];
  aboutMe: string;
  portfolioLinks: string[];
  resumeUrl?: string;
  rating: number;
  completedTasks: number;
  profileCompleteness: number;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newHobby, setNewHobby] = useState('');
  const [newPortfolioLink, setNewPortfolioLink] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          skills: profile.skills,
          hobbies: profile.hobbies,
          aboutMe: profile.aboutMe,
          portfolioLinks: profile.portfolioLinks,
          experience: profile.experience,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setEditMode(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && profile) {
      setProfile({
        ...profile,
        skills: [...(profile.skills || []), newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    if (profile && profile.skills) {
      setProfile({
        ...profile,
        skills: profile.skills.filter((_, i) => i !== index)
      });
    }
  };

  const addHobby = () => {
    if (newHobby.trim() && profile) {
      setProfile({
        ...profile,
        hobbies: [...(profile.hobbies || []), newHobby.trim()]
      });
      setNewHobby('');
    }
  };

  const removeHobby = (index: number) => {
    if (profile && profile.hobbies) {
      setProfile({
        ...profile,
        hobbies: profile.hobbies.filter((_, i) => i !== index)
      });
    }
  };

  const addPortfolioLink = () => {
    if (newPortfolioLink.trim() && profile) {
      setProfile({
        ...profile,
        portfolioLinks: [...(profile.portfolioLinks || []), newPortfolioLink.trim()]
      });
      setNewPortfolioLink('');
    }
  };

  const removePortfolioLink = (index: number) => {
    if (profile && profile.portfolioLinks) {
      setProfile({
        ...profile,
        portfolioLinks: profile.portfolioLinks.filter((_, i) => i !== index)
      });
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/resume', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        alert('Resume uploaded successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to upload resume');
      }
    } catch (error) {
      console.error('Resume upload error:', error);
      alert('Failed to upload resume. Please try again.');
    }
  };

  const removeResume = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/resume', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        alert('Resume removed successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to remove resume');
      }
    } catch (error) {
      console.error('Resume removal error:', error);
      alert('Failed to remove resume. Please try again.');
    }
  };

  if (loading) {
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Profile not found</h2>
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-gray-950">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
            <p className="text-gray-400">Manage your professional information and portfolio</p>
          </div>
          <div className="flex items-center gap-3">
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 text-gray-300 border border-gray-700 rounded-lg hover:bg-gray-800 hover:border-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2 font-medium transition-all"
                >
                  {saving ? 'Saving...' : 'Save'}
                  <Save className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/onboarding"
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 font-medium mr-2 transition-all"
                >
                  <Bot className="w-4 h-4" />
                  Edit Profile with AI
                </Link>
                <button
                  onClick={() => setEditMode(true)}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Profile Stats */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
            <p className="text-gray-300 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {profile.email}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-semibold text-white">{profile.rating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-gray-400">{profile.completedTasks} tasks completed</p>
          </div>
        </div>
        
        {/* Enhanced Profile Progress */}
        <div className="mt-4">
          <ProfileProgress 
            userData={{
              name: profile.name,
              aboutMe: profile.aboutMe,
              skills: profile.skills,
              hobbies: profile.hobbies,
              experience: profile.experience,
              resumeUrl: profile.resumeUrl,
              portfolioLinks: profile.portfolioLinks,
              email: profile.email
            }}
            showDetails={true}
          />
        </div>
      </div>

      {/* About Me */}
      <div className="glass-card p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">About Me</h3>
        {editMode ? (
          <textarea
            value={profile.aboutMe}
            onChange={(e) => setProfile({ ...profile, aboutMe: e.target.value })}
            placeholder="Tell us about yourself..."
            rows={4}
            className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-300">
            {profile.aboutMe || 'No description added yet.'}
          </p>
        )}
      </div>

      {/* Skills */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-slate-400" />
          <h3 className="text-lg font-semibold text-white">Skills</h3>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {(profile.skills || []).map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-slate-700 text-slate-200 rounded-full text-sm"
            >
              {skill}
              {editMode && (
                <button
                  onClick={() => removeSkill(index)}
                  className="hover:bg-slate-600 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
          {(!profile.skills || profile.skills.length === 0) && (
            <p className="text-gray-400 text-sm">No skills added yet.</p>
          )}
        </div>
        
        {editMode && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <button
              onClick={addSkill}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

        {/* Hobbies */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-white">Hobbies & Interests</h3>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {(profile.hobbies || []).map((hobby, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-700 text-slate-200 rounded-full text-sm"
              >
                {hobby}
                {editMode && (
                  <button
                    onClick={() => removeHobby(index)}
                    className="hover:bg-slate-600 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
            {(!profile.hobbies || profile.hobbies.length === 0) && (
              <p className="text-gray-400 text-sm">No hobbies added yet.</p>
            )}
          </div>
          
          {editMode && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newHobby}
                onChange={(e) => setNewHobby(e.target.value)}
                placeholder="Add a hobby..."
                className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addHobby()}
              />
              <button
                onClick={addHobby}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Experience */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-white">Experience</h3>
          </div>
          
          {(profile.experience || []).length > 0 ? (
            <div className="space-y-4">
              {(profile.experience || []).map((exp, index) => (
                <div key={index} className="border-l-4 border-slate-500 pl-4 py-2 bg-gray-900/30 rounded-r-lg">
                  <h4 className="font-semibold text-white">{exp.title}</h4>
                  <p className="text-slate-300 font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-400">{exp.duration}</p>
                  <p className="text-gray-300 mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No experience added yet.</p>
          )}
        </div>

        {/* Resume Upload */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Resume</h3>
          
          {editMode ? (
            <ResumeUpload
              currentResumeUrl={profile.resumeUrl}
              onUploadSuccess={(resumeUrl) => {
                setProfile({ ...profile, resumeUrl });
              }}
              onRemove={() => {
                setProfile({ ...profile, resumeUrl: undefined });
              }}
            />
          ) : (
            // Read-only resume display when not in edit mode
            profile.resumeUrl ? (
              <ResumeUpload
                currentResumeUrl={profile.resumeUrl}
                variant="compact"
              />
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-gray-700 rounded-lg">
                <div className="w-16 h-16 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-400 mb-2">No resume uploaded yet</p>
                <p className="text-xs text-gray-500">Click &quot;Edit Profile&quot; to upload your resume</p>
              </div>
            )
          )}
        </div>

        {/* Portfolio Links */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Portfolio Links</h3>
          
          <div className="space-y-2 mb-4">
            {(profile.portfolioLinks || []).map((link, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-900/30 rounded-lg border border-gray-700">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-slate-300 hover:text-white transition-colors"
                >
                  {link}
                </a>
                {editMode && (
                  <button
                    onClick={() => removePortfolioLink(index)}
                    className="text-red-400 hover:bg-red-500/20 rounded-full p-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {(!profile.portfolioLinks || profile.portfolioLinks.length === 0) && (
              <p className="text-gray-400 text-sm">No portfolio links added yet.</p>
            )}
          </div>
          
          {editMode && (
            <div className="flex gap-2">
              <input
                type="url"
                value={newPortfolioLink}
                onChange={(e) => setNewPortfolioLink(e.target.value)}
                placeholder="https://yourportfolio.com"
                className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addPortfolioLink()}
              />
              <button
                onClick={addPortfolioLink}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
    </div>
  );
}
