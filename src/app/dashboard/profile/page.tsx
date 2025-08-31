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
  Heart
} from 'lucide-react';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile not found</h2>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <div className="flex items-center gap-3">
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? 'Saving...' : 'Save'}
                  <Save className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
        {/* Profile Stats */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-gray-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {profile.email}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-semibold">{profile.rating.toFixed(1)}</span>
              </div>
              <p className="text-sm text-gray-600">{profile.completedTasks} tasks completed</p>
            </div>
          </div>
          
          {/* Profile Completeness Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Profile Completeness</span>
              <span className="text-sm font-medium text-gray-900">{profile.profileCompleteness}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${profile.profileCompleteness}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* About Me */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
          {editMode ? (
            <textarea
              value={profile.aboutMe}
              onChange={(e) => setProfile({ ...profile, aboutMe: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-700">
              {profile.aboutMe || 'No description added yet.'}
            </p>
          )}
        </div>

        {/* Skills */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {(profile.skills || []).map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {skill}
                {editMode && (
                  <button
                    onClick={() => removeSkill(index)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
            {(!profile.skills || profile.skills.length === 0) && (
              <p className="text-gray-500 text-sm">No skills added yet.</p>
            )}
          </div>
          
          {editMode && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              <button
                onClick={addSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Hobbies */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Hobbies & Interests</h3>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {(profile.hobbies || []).map((hobby, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
              >
                {hobby}
                {editMode && (
                  <button
                    onClick={() => removeHobby(index)}
                    className="hover:bg-red-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
            {(!profile.hobbies || profile.hobbies.length === 0) && (
              <p className="text-gray-500 text-sm">No hobbies added yet.</p>
            )}
          </div>
          
          {editMode && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newHobby}
                onChange={(e) => setNewHobby(e.target.value)}
                placeholder="Add a hobby..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && addHobby()}
              />
              <button
                onClick={addHobby}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Experience */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
          </div>
          
          {(profile.experience || []).length > 0 ? (
            <div className="space-y-4">
              {(profile.experience || []).map((exp, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                  <p className="text-green-600 font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-600">{exp.duration}</p>
                  <p className="text-gray-700 mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No experience added yet.</p>
          )}
        </div>

        {/* Resume Upload */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume</h3>
          
          {profile.resumeUrl ? (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Resume uploaded</p>
                  <p className="text-sm text-gray-600">Click to view or download</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  View
                </a>
                {editMode && (
                  <button
                    onClick={removeResume}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-500 mb-4">No resume uploaded yet</p>
              {editMode && (
                <div>
                  <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer inline-block"
                  >
                    Upload Resume
                  </label>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Portfolio Links */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Links</h3>
          
          <div className="space-y-2 mb-4">
            {(profile.portfolioLinks || []).map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-blue-600 hover:underline"
                >
                  {link}
                </a>
                {editMode && (
                  <button
                    onClick={() => removePortfolioLink(index)}
                    className="text-red-600 hover:bg-red-100 rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {(!profile.portfolioLinks || profile.portfolioLinks.length === 0) && (
              <p className="text-gray-500 text-sm">No portfolio links added yet.</p>
            )}
          </div>
          
          {editMode && (
            <div className="flex gap-2">
              <input
                type="url"
                value={newPortfolioLink}
                onChange={(e) => setNewPortfolioLink(e.target.value)}
                placeholder="https://yourportfolio.com"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && addPortfolioLink()}
              />
              <button
                onClick={addPortfolioLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
    </div>
  );
}
