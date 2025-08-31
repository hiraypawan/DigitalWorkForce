'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { 
  User, Mail, Star, Briefcase, Code, ExternalLink, MapPin, 
  Phone, Clock, DollarSign, Award, BookOpen, Target, 
  Calendar, Building, Globe, Github, Linkedin, 
  TrendingUp, CheckCircle, Circle, Heart
} from 'lucide-react';

interface EnhancedProfileData {
  userId: string;
  name: string;
  title?: string;
  bio: string;
  location?: string;
  availability?: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  
  skills: Array<{
    name: string;
    proficiency: 'Beginner' | 'Intermediate' | 'Expert' | number;
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
  const res = await fetch(url, {
    credentials: 'include',
  });
  
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
};

const SkillBadge = ({ skill }: { skill: any }) => {
  const getProficiencyColor = (proficiency: string | number) => {
    if (typeof proficiency === 'number') {
      if (proficiency >= 4) return 'bg-green-500';
      if (proficiency >= 3) return 'bg-blue-500';
      return 'bg-orange-500';
    }
    
    switch (proficiency) {
      case 'Expert': return 'bg-green-500';
      case 'Intermediate': return 'bg-blue-500';
      case 'Beginner': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getProficiencyText = (proficiency: string | number) => {
    if (typeof proficiency === 'number') {
      return `${proficiency}/5`;
    }
    return proficiency;
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
      <span className="text-gray-300 text-sm">{skill.name}</span>
      <div className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${getProficiencyColor(skill.proficiency)}`}></div>
        <span className="text-xs text-gray-400">{getProficiencyText(skill.proficiency)}</span>
      </div>
    </div>
  );
};

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
        />
      ))}
    </div>
  );
};

export default function EnhancedProfilePreview() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const { data: profileData, error, mutate } = useSWR<EnhancedProfileData>(
    isClient && session?.user ? '/api/portfolio' : null,
    fetcher,
    {
      refreshInterval: 2000,
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
            <div className="w-20 h-20 bg-gray-700 rounded-full"></div>
            <div>
              <div className="h-6 bg-gray-700 rounded w-40 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-32"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const {
    name, title, bio, location, availability, skills, experience, education,
    projects, certifications, portfolioSamples, endorsements, workPreferences,
    achievements, goals, hobbies, onlineCourses, testimonials, contactInfo,
    completionPercentage
  } = profileData;

  return (
    <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-8 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Candidate Portfolio</h2>
          <div className="ml-auto flex items-center gap-2">
            <div className="text-sm text-gray-400">{completionPercentage}% Complete</div>
            <div className="w-20 bg-gray-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="mb-8 p-6 bg-gray-800/30 border border-gray-700 rounded-xl">
        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            {completionPercentage === 100 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">
              {name || session?.user?.name || 'Complete Your Profile'}
            </h1>
            {title && (
              <h2 className="text-xl text-blue-400 font-semibold mb-3">{title}</h2>
            )}
            
            <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-300">
              {contactInfo?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{contactInfo.email}</span>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{location}</span>
                </div>
              )}
              {availability && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{availability}</span>
                </div>
              )}
            </div>
            
            {bio && (
              <p className="text-gray-300 leading-relaxed mb-4">{bio}</p>
            )}
            
            {/* Contact Links */}
            <div className="flex flex-wrap gap-3">
              {portfolioSamples?.github && (
                <a href={portfolioSamples.github} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-gray-300 hover:text-white transition-colors">
                  <Github className="w-4 h-4" />
                  <span className="text-sm">GitHub</span>
                </a>
              )}
              {contactInfo?.linkedin && (
                <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-3 py-2 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-700 rounded-lg text-blue-300 hover:text-blue-200 transition-colors">
                  <Linkedin className="w-4 h-4" />
                  <span className="text-sm">LinkedIn</span>
                </a>
              )}
              {portfolioSamples?.website && (
                <a href={portfolioSamples.website} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-3 py-2 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-700 rounded-lg text-purple-300 hover:text-purple-200 transition-colors">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">Website</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Skills Matrix */}
      {skills && skills.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-400" />
            Skills Matrix
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {skills.map((skill, index) => (
              <SkillBadge key={index} skill={skill} />
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-400" />
            Professional Experience
          </h3>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index} className="p-6 bg-gray-800/30 border border-gray-700 rounded-xl">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{exp.role}</h4>
                    <div className="flex items-center gap-2 text-blue-400 mb-1">
                      <Building className="w-4 h-4" />
                      <span>{exp.company}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{exp.duration}</span>
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4 leading-relaxed">{exp.details}</p>
                
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-300 mb-2">Key Responsibilities:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
                      {exp.responsibilities.map((responsibility, idx) => (
                        <li key={idx}>{responsibility}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {exp.achievements && exp.achievements.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Key Achievements:
                    </h5>
                    <ul className="space-y-1">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-sm text-green-300 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            Education
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {education.map((edu, index) => (
              <div key={index} className="p-4 bg-gray-800/30 border border-gray-700 rounded-xl">
                <h4 className="text-lg font-semibold text-white mb-1">{edu.degree}</h4>
                <p className="text-blue-400 mb-2">{edu.institution}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                  <span>Class of {edu.year}</span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
                {edu.honors && (
                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    <Award className="w-4 h-4" />
                    <span>{edu.honors}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects & Contributions */}
      {projects && projects.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-400" />
            Projects & Contributions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project, index) => (
              <div key={index} className="p-4 bg-gray-800/30 border border-gray-700 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold text-white">{project.title}</h4>
                  {project.status && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      project.status === 'completed' ? 'bg-green-900/50 text-green-400' :
                      project.status === 'in-progress' ? 'bg-blue-900/50 text-blue-400' :
                      'bg-gray-900/50 text-gray-400'
                    }`}>
                      {project.status}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-300 text-sm mb-3 leading-relaxed">{project.description}</p>
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="text-xs px-2 py-1 bg-purple-900/30 text-purple-300 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {project.outcome && (
                  <p className="text-green-400 text-sm mb-2">
                    <strong>Outcome:</strong> {project.outcome}
                  </p>
                )}
                
                {project.metrics && (
                  <p className="text-yellow-400 text-sm mb-2">
                    <strong>Metrics:</strong> {project.metrics}
                  </p>
                )}
                
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" 
                     className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm">
                    <ExternalLink className="w-3 h-3" />
                    View Project
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Training */}
      {certifications && certifications.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-400" />
            Certifications & Training
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert, index) => (
              <div key={index} className="p-4 bg-gray-800/30 border border-gray-700 rounded-xl">
                <h4 className="text-white font-semibold">{cert.name}</h4>
                <p className="text-blue-400 text-sm">{cert.issuer}</p>
                <p className="text-gray-400 text-sm">Earned: {cert.year}</p>
                {cert.link && (
                  <a href={cert.link} target="_blank" rel="noopener noreferrer"
                     className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm mt-2">
                    <ExternalLink className="w-3 h-3" />
                    View Certificate
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Endorsements & Reviews */}
      {endorsements && endorsements.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-blue-400" />
            Endorsements & Reviews
          </h3>
          <div className="space-y-4">
            {endorsements.map((endorsement, index) => (
              <div key={index} className="p-4 bg-gray-800/30 border border-gray-700 rounded-xl">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <RatingStars rating={endorsement.rating} />
                      <span className="text-sm text-gray-400">({endorsement.rating}/5)</span>
                    </div>
                    <p className="text-white font-semibold">{endorsement.reviewer}</p>
                    {endorsement.role && endorsement.company && (
                      <p className="text-sm text-gray-400">{endorsement.role} at {endorsement.company}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{endorsement.date}</span>
                </div>
                <p className="text-gray-300 italic">&ldquo;{endorsement.review}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Work Preferences */}
      {workPreferences && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            Work Preferences
          </h3>
          <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workPreferences.expectedSalary && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Expected Salary: {workPreferences.expectedSalary}</span>
                </div>
              )}
              {workPreferences.workType && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">Work Type: {workPreferences.workType}</span>
                </div>
              )}
              {workPreferences.noticePeriod && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span className="text-gray-300">Notice Period: {workPreferences.noticePeriod}</span>
                </div>
              )}
              {workPreferences.preferredIndustries && workPreferences.preferredIndustries.length > 0 && (
                <div className="md:col-span-2">
                  <p className="text-gray-300 mb-2">Preferred Industries:</p>
                  <div className="flex flex-wrap gap-2">
                    {workPreferences.preferredIndustries.map((industry, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-900/30 text-blue-300 text-sm rounded">
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Additional Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Career Goals */}
        {goals && goals.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              Career Goals
            </h3>
            <div className="space-y-2">
              {goals.map((goal, index) => (
                <div key={index} className="p-3 bg-gray-800/30 border border-gray-700 rounded-lg text-sm text-gray-300">
                  {goal}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hobbies & Interests */}
        {hobbies && hobbies.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-blue-400" />
              Hobbies & Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {hobbies.map((hobby, index) => (
                <span key={index} className="px-3 py-2 bg-gray-800/50 text-gray-300 text-sm rounded-full border border-gray-700">
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Completion Prompt */}
      {completionPercentage < 100 && (
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl text-center">
          <p className="text-blue-300 mb-2">
            💼 Your portfolio is {completionPercentage}% complete!
          </p>
          <p className="text-sm text-gray-400">
            Keep chatting with the AI or edit your profile to add more details.
          </p>
        </div>
      )}
    </div>
  );
}
