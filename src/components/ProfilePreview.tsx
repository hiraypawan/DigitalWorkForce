'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import Image from 'next/image';
import { User, Mail, Star, Briefcase, Code, ExternalLink, MapPin } from 'lucide-react';

interface ProfileData {
  userId: string;
  name: string;
  bio: string;
  education: {
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
    honors?: string;
  }[];
  experience: {
    role: string;
    company: string;
    duration: string;
    details: string;
    location?: string;
    achievements?: string[];
  }[];
  skills: (string | { name: string; proficiency?: string; category?: string; })[];
  projects: {
    title: string;
    description: string;
    link?: string;
    technologies?: string[];
    status?: string;
  }[];
  certifications: (string | { name: string; issuer?: string; year?: string; })[];
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
  preferences?: any;
  lastUpdated: string;
  completionPercentage: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: 'include',
  });
  
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
};

export default function ProfilePreview() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const { data: profileData, error, mutate } = useSWR<ProfileData>(
    isClient && session?.user ? '/api/portfolio' : null,
    fetcher,
    {
      refreshInterval: 2000, // Refresh every 2 seconds for real-time updates
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  if (!isClient || !session?.user) {
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

  const { 
    name, 
    bio, 
    skills, 
    experience, 
    projects, 
    education, 
    certifications, 
    achievements, 
    goals, 
    hobbies, 
    contactInfo, 
    completionPercentage 
  } = profileData;

  // Use the completion percentage from the database
  const displayCompletionPercentage = completionPercentage || 0;

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
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          {completionPercentage === 100 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <Star className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">
            {name || session?.user?.name || 'Complete your profile'}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Mail className="w-4 h-4" />
            {contactInfo?.email || session?.user?.email}
          </div>
        </div>
      </div>

      {/* About Section */}
      {bio ? (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            About
          </h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            {bio}
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
        {skills?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-blue-300 text-xs rounded-full"
              >
                {typeof skill === 'string' ? skill : skill?.name || 'Unknown Skill'}
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
        {experience?.length > 0 ? (
          <div className="space-y-2">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg"
              >
                <div className="mb-2">
                  <h5 className="text-white font-medium text-sm">{exp.role} at {exp.company}</h5>
                  <p className="text-gray-400 text-xs">{exp.duration} {exp.location && ` • ${exp.location}`}</p>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{exp.details}</p>
                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="mt-2">
                    {exp.achievements.map((achievement, achIndex) => (
                      <p key={achIndex} className="text-green-400 text-xs">• {achievement}</p>
                    ))}
                  </div>
                )}
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

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Education
          </h4>
          <div className="space-y-2">
            {education.map((edu, index) => (
              <div
                key={index}
                className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg"
              >
                <div>
                  <h5 className="text-white font-medium text-sm">{edu.degree}</h5>
                  <p className="text-gray-400 text-xs">{edu.institution} • {edu.year}</p>
                  {edu.gpa && <p className="text-blue-400 text-xs">GPA: {edu.gpa}</p>}
                  {edu.honors && <p className="text-yellow-400 text-xs">{edu.honors}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <Star className="w-4 h-4" />
          Projects
        </h4>
        {projects?.length > 0 ? (
          <div className="space-y-2">
            {projects.map((project, index) => (
              <div
                key={index}
                className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg"
              >
                <div className="mb-2">
                  <h5 className="text-white font-medium text-sm">{project.title}</h5>
                  {project.status && (
                    <span className={`text-xs px-2 py-1 rounded ${
                      project.status === 'completed' ? 'bg-green-900/50 text-green-400' :
                      project.status === 'in-progress' ? 'bg-blue-900/50 text-blue-400' :
                      'bg-gray-900/50 text-gray-400'
                    }`}>
                      {project.status}
                    </span>
                  )}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="text-xs px-2 py-1 bg-purple-900/30 text-purple-300 rounded">{tech}</span>
                    ))}
                  </div>
                )}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-xs mt-2 inline-flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> View Project
                  </a>
                )}
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

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Certifications
          </h4>
          <div className="space-y-1">
            {certifications.map((cert, index) => (
              <div key={index} className="p-2 bg-gray-800/30 border border-gray-700 rounded text-sm text-gray-300">
                {typeof cert === 'string' ? cert : cert?.name || 'Certification'}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Achievements
          </h4>
          <div className="space-y-1">
            {achievements.map((achievement, index) => (
              <div key={index} className="p-2 bg-gray-800/30 border border-gray-700 rounded text-sm text-gray-300">
                {achievement}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Goals */}
      {goals && goals.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Career Goals
          </h4>
          <div className="space-y-1">
            {goals.map((goal, index) => (
              <div key={index} className="p-2 bg-gray-800/30 border border-gray-700 rounded text-sm text-gray-300">
                {goal}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hobbies */}
      {hobbies && hobbies.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Hobbies & Interests
          </h4>
          <div className="flex flex-wrap gap-2">
            {hobbies.map((hobby, index) => (
              <span key={index} className="px-3 py-1 bg-gray-800/50 text-gray-300 text-xs rounded-full border border-gray-700">
                {hobby}
              </span>
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
