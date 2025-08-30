'use client';

import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import Image from 'next/image';
import { User, Mail, Star, Briefcase, Code, ExternalLink, MapPin } from 'lucide-react';

interface ProfileData {
  profile: {
    about: string;
    skills: string[];
    experience: string[];
    projects: string[];
  };
  name: string;
  email: string;
  portfolioLinks: string[];
  profilePicture: string;
  role: string;
  rating: number;
  completedTasks: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
};

export default function ProfilePreview() {
  const { data: session } = useSession();
  const { data: profileData, error, mutate } = useSWR<ProfileData>(
    session?.user ? '/api/users/profile' : null,
    fetcher,
    {
      refreshInterval: 2000, // Refresh every 2 seconds for real-time updates
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  if (!session?.user) {
    return (
      <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6">
        <div className="text-center text-gray-400">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Sign in to see your profile preview</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6">
        <div className="text-center text-red-400">
          <p>Failed to load profile</p>
          <button 
            onClick={() => mutate()}
            className="mt-2 text-sm text-blue-400 hover:text-blue-300"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!profileData) {
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

  const { profile, name, email, portfolioLinks, profilePicture, role, rating, completedTasks } = profileData;

  const getCompletionPercentage = () => {
    let completed = 0;
    const total = 5;
    
    if (name?.trim()) completed++;
    if (profile?.about?.trim()) completed++;
    if (profile?.skills?.length > 0) completed++;
    if (profile?.experience?.length > 0) completed++;
    if (profile?.projects?.length > 0) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6 h-fit">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-400" />
          Profile Preview
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex-1 bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className="text-gray-400">{completionPercentage}%</span>
        </div>
      </div>

      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          {profilePicture ? (
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={profilePicture} 
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>';
                }}
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          )}
          {completionPercentage === 100 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <Star className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">
            {name || 'Complete your profile'}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Mail className="w-4 h-4" />
            {email}
          </div>
          {rating > 0 && (
            <div className="flex items-center gap-1 text-sm text-yellow-400 mt-1">
              <Star className="w-4 h-4 fill-current" />
              {rating.toFixed(1)} • {completedTasks || 0} tasks
            </div>
          )}
        </div>
      </div>

      {/* About Section */}
      {profile?.about ? (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            About
          </h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            {profile.about}
          </p>
        </div>
      ) : (
        <div className="mb-6 p-4 border border-gray-700 border-dashed rounded-lg">
          <p className="text-gray-500 text-sm text-center">
            Tell the AI about yourself to see your description here
          </p>
        </div>
      )}

      {/* Skills */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <Code className="w-4 h-4" />
          Skills
        </h4>
        {profile?.skills?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-blue-300 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <div className="p-3 border border-gray-700 border-dashed rounded-lg">
            <p className="text-gray-500 text-xs text-center">
              Share your skills with the AI to see them here
            </p>
          </div>
        )}
      </div>

      {/* Experience */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          Experience
        </h4>
        {profile?.experience?.length > 0 ? (
          <div className="space-y-2">
            {profile.experience.map((exp, index) => (
              <div
                key={index}
                className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg"
              >
                <p className="text-gray-300 text-sm">{exp}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 border border-gray-700 border-dashed rounded-lg">
            <p className="text-gray-500 text-xs text-center">
              Tell the AI about your work experience
            </p>
          </div>
        )}
      </div>

      {/* Projects */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <Star className="w-4 h-4" />
          Projects
        </h4>
        {profile?.projects?.length > 0 ? (
          <div className="space-y-2">
            {profile.projects.map((project, index) => (
              <div
                key={index}
                className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg"
              >
                <p className="text-gray-300 text-sm">{project}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 border border-gray-700 border-dashed rounded-lg">
            <p className="text-gray-500 text-xs text-center">
              Share your projects with the AI
            </p>
          </div>
        )}
      </div>

      {/* Portfolio Links */}
      {portfolioLinks?.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Portfolio Links
          </h4>
          <div className="space-y-2">
            {portfolioLinks.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" />
                  {new URL(link).hostname}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Completion Prompt */}
      {completionPercentage < 100 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-300 text-sm text-center">
            💬 Keep chatting with the AI to complete your profile!
          </p>
        </div>
      )}
    </div>
  );
}
