'use client';

import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { CheckCircle, User, Briefcase, Award, FileText, Mail, Heart, Star } from 'lucide-react';

interface ProfileSection {
  id: string;
  name: string;
  completed: boolean;
  icon: React.ReactNode;
}

interface UserProfileData {
  name?: string;
  aboutMe?: string;
  skills?: string[];
  hobbies?: string[];
  experience?: any[];
  resumeUrl?: string;
  portfolioLinks?: string[];
  email?: string;
}

interface ProfileProgressProps {
  className?: string;
  showDetails?: boolean;
  userData?: UserProfileData;
  variant?: 'default' | 'compact';
}

export function ProfileProgress({ 
  className = '', 
  showDetails = false, 
  userData,
  variant = 'default'
}: ProfileProgressProps) {
  const { currentTheme } = useTheme();
  
  // Calculate profile sections based on real user data
  const profileSections: ProfileSection[] = [
    { 
      id: 'basic', 
      name: 'Basic Info', 
      completed: !!(userData?.name?.trim()), 
      icon: <User className="w-4 h-4" /> 
    },
    { 
      id: 'bio', 
      name: 'About Me', 
      completed: !!(userData?.aboutMe?.trim()), 
      icon: <Mail className="w-4 h-4" /> 
    },
    { 
      id: 'skills', 
      name: 'Skills', 
      completed: !!(userData?.skills && userData.skills.length > 0), 
      icon: <Award className="w-4 h-4" /> 
    },
    { 
      id: 'experience', 
      name: 'Experience', 
      completed: !!(userData?.experience && userData.experience.length > 0), 
      icon: <Briefcase className="w-4 h-4" /> 
    },
    { 
      id: 'resume', 
      name: 'Resume', 
      completed: !!(userData?.resumeUrl), 
      icon: <FileText className="w-4 h-4" /> 
    },
    { 
      id: 'portfolio', 
      name: 'Portfolio', 
      completed: !!(userData?.portfolioLinks && userData.portfolioLinks.length > 0), 
      icon: <Star className="w-4 h-4" /> 
    },
    { 
      id: 'hobbies', 
      name: 'Interests', 
      completed: !!(userData?.hobbies && userData.hobbies.length > 0), 
      icon: <Heart className="w-4 h-4" /> 
    },
  ];
  
  const completedSections = profileSections.filter(section => section.completed).length;
  const totalSections = profileSections.length;
  const completionPercentage = Math.round((completedSections / totalSections) * 100);
  
  const getMotivationalMessage = () => {
    if (completionPercentage < 25) {
      return "Let&apos;s get started! Complete your profile to unlock better project matches.";
    } else if (completionPercentage < 50) {
      return "Great start! Add more details to attract top employers.";
    } else if (completionPercentage < 75) {
      return "You&apos;re making progress! Almost ready for premium projects.";
    } else if (completionPercentage < 100) {
      return "Almost there! Complete your profile to unlock all features.";
    } else {
      return "🎉 Profile complete! You&apos;re ready for the best opportunities.";
    }
  };
  
  return (
    <div className={cn('space-y-4', className)}>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span 
            className="text-sm font-medium"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            Profile Completion
          </span>
          <span 
            className="text-sm font-bold"
            style={{ color: currentTheme.colors.primary }}
          >
            {completionPercentage}%
          </span>
        </div>
        
        <div 
          className="w-full h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: `${currentTheme.colors.border}40` }}
        >
          <div 
            className="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
            style={{ 
              width: `${completionPercentage}%`,
              background: `linear-gradient(90deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
            }}
          >
            {/* Shimmer effect */}
            <div 
              className="absolute inset-0 -skew-x-12 animate-shimmer"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                backgroundSize: '200% 100%'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Motivational Message */}
      <p 
        className="text-sm leading-relaxed"
        style={{ color: currentTheme.colors.textMuted }}
      >
        {getMotivationalMessage()}
      </p>
      
      {/* Detailed Progress (Optional) */}
      {showDetails && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {profileSections.map((section) => (
            <div 
              key={section.id}
              className="flex items-center gap-2 p-2 rounded-lg transition-colors duration-200"
              style={{ 
                backgroundColor: section.completed 
                  ? `${currentTheme.colors.success}15` 
                  : `${currentTheme.colors.border}20`
              }}
            >
              <div style={{ color: section.completed ? currentTheme.colors.success : currentTheme.colors.textMuted }}>
                {section.completed ? <CheckCircle className="w-4 h-4" /> : section.icon}
              </div>
              <span 
                className="text-xs font-medium"
                style={{ 
                  color: section.completed 
                    ? currentTheme.colors.success 
                    : currentTheme.colors.textMuted 
                }}
              >
                {section.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Add shimmer animation to global CSS
const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.animate-shimmer {
  animation: shimmer 1.5s ease-in-out infinite;
}
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmerKeyframes;
  document.head.appendChild(style);
}
