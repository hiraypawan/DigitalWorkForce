export interface ProfileAnalysis {
  completionPercentage: number;
  missingFields: string[];
  nextSuggestions: string[];
  priority: 'high' | 'medium' | 'low';
  isComplete: boolean;
}

export interface ProfileData {
  name?: string;
  title?: string;
  bio?: string;
  location?: string;
  availability?: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  
  skills?: (string | {
    name: string;
    proficiency?: 'Beginner' | 'Intermediate' | 'Expert' | 'Advanced';
    category?: 'Technical' | 'Soft' | 'Language' | 'Tool';
  })[];
  
  experience?: {
    role?: string;
    company?: string;
    duration?: string;
    details?: string;
    location?: string;
    achievements?: string[];
    responsibilities?: string[];
  }[];
  
  education?: {
    degree?: string;
    institution?: string;
    year?: string;
    gpa?: string;
    honors?: string;
  }[];
  
  projects?: {
    title?: string;
    description?: string;
    link?: string;
    technologies?: string[];
    status?: 'completed' | 'in-progress' | 'planned';
    outcome?: string;
    metrics?: string;
  }[];
  
  certifications?: (string | {
    name: string;
    issuer?: string;
    year?: string;
    link?: string;
  })[];
  
  portfolioSamples?: {
    github?: string;
    behance?: string;
    dribbble?: string;
    linkedin?: string;
    website?: string;
    uploadedFiles?: string[];
  };
  
  endorsements?: {
    rating?: number;
    review?: string;
    reviewer?: string;
    role?: string;
    company?: string;
    date?: string;
  }[];
  
  workPreferences?: {
    expectedSalary?: string;
    workType?: 'Remote' | 'Hybrid' | 'Onsite';
    availability?: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
    noticePeriod?: string;
    preferredIndustries?: string[];
    willingToRelocate?: boolean;
  };
  
  achievements?: string[];
  goals?: string[];
  hobbies?: string[];
  onlineCourses?: string[];
  testimonials?: string[];
  
  contactInfo?: {
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  
  completionPercentage?: number;
}

/**
 * Analyzes a user's profile and determines what information is missing
 * and what should be asked next by the AI assistant
 */
export function analyzeProfileCompletion(profile: ProfileData): ProfileAnalysis {
  const missingFields: string[] = [];
  const nextSuggestions: string[] = [];
  
  // Core essential fields (highest priority)
  if (!profile.name?.trim()) {
    missingFields.push('name');
    nextSuggestions.push('Tell me your full name');
  }
  
  if (!profile.bio?.trim()) {
    missingFields.push('bio');
    nextSuggestions.push('Share a brief professional summary about yourself');
  }
  
  if (!profile.title?.trim()) {
    missingFields.push('title');
    nextSuggestions.push('What is your current job title or professional role?');
  }
  
  // Skills analysis - check for both count and depth
  if (!profile.skills || profile.skills.length === 0) {
    missingFields.push('skills');
    nextSuggestions.push('What are your main technical and professional skills?');
  } else if (profile.skills.length < 3) {
    nextSuggestions.push('Can you share more of your key skills and expertise?');
  } else {
    // Check if skills have proficiency levels
    const skillsWithProficiency = profile.skills.filter(skill => 
      typeof skill === 'object' && skill.proficiency
    ).length;
    if (skillsWithProficiency < profile.skills.length / 2) {
      nextSuggestions.push('Would you like to specify your proficiency level for your skills?');
    }
  }
  
  // Experience analysis
  if (!profile.experience || profile.experience.length === 0) {
    missingFields.push('experience');
    nextSuggestions.push('Tell me about your work experience and previous roles');
  } else {
    // Check for experience details
    const experienceWithDetails = profile.experience.filter(exp => 
      exp.role && exp.company && exp.details
    ).length;
    if (experienceWithDetails === 0) {
      nextSuggestions.push('Can you provide more details about your work experience?');
    }
  }
  
  // Education analysis
  if (!profile.education || profile.education.length === 0) {
    missingFields.push('education');
    nextSuggestions.push('Share your educational background');
  }
  
  // Projects analysis
  if (!profile.projects || profile.projects.length === 0) {
    missingFields.push('projects');
    nextSuggestions.push('Describe some projects you\'ve worked on');
  }
  
  // Career development fields
  if (!profile.goals || profile.goals.length === 0) {
    missingFields.push('goals');
    nextSuggestions.push('What are your career goals and aspirations?');
  }
  
  // Professional credentials
  if (!profile.certifications || profile.certifications.length === 0) {
    if (!profile.achievements || profile.achievements.length === 0) {
      missingFields.push('certifications_achievements');
      nextSuggestions.push('Do you have any certifications or notable achievements?');
    }
  }
  
  // Location and availability (important for job matching)
  if (!profile.location?.trim()) {
    missingFields.push('location');
    nextSuggestions.push('What is your current location?');
  }
  
  if (!profile.availability) {
    missingFields.push('availability');
    nextSuggestions.push('Are you looking for full-time, part-time, contract, or freelance work?');
  }
  
  // Work preferences for better job matching
  if (!profile.workPreferences || Object.keys(profile.workPreferences).length === 0) {
    missingFields.push('work_preferences');
    nextSuggestions.push('What are your work preferences (remote vs onsite, salary expectations, etc.)?');
  }
  
  // Contact and portfolio information
  const portfolioLinks = profile.portfolioSamples;
  const hasPortfolioLinks = portfolioLinks && (portfolioLinks.github || portfolioLinks.linkedin || portfolioLinks.website);
  
  const contactFields = ['linkedin', 'github', 'website', 'phone'];
  const missingContactFields = contactFields.filter(field => 
    !profile.contactInfo?.[field as keyof typeof profile.contactInfo]
  );
  
  if (missingContactFields.length > 2 && !hasPortfolioLinks) {
    missingFields.push('contact_info');
    nextSuggestions.push('Share your professional contact information (LinkedIn, GitHub, etc.)');
  }
  
  // Personal touch (helps with culture fit)
  if (!profile.hobbies || profile.hobbies.length === 0) {
    missingFields.push('hobbies');
    nextSuggestions.push('What are your hobbies and interests outside of work?');
  }
  
  // Enhanced completion percentage calculation with weighted scoring
  let completed = 0;
  let total = 12; // Updated total for comprehensive profile
  
  // Core fields (weight 2x)
  if (profile.name?.trim()) completed += 2;
  if (profile.bio?.trim()) completed += 2;
  if (profile.title?.trim()) completed += 1;
  if (profile.skills && profile.skills.length > 0) completed += 2;
  if (profile.experience && profile.experience.length > 0) completed += 2;
  if (profile.education && profile.education.length > 0) completed += 1;
  
  // Professional development
  if (profile.projects && profile.projects.length > 0) completed += 1;
  if ((profile.certifications && profile.certifications.length > 0) || 
      (profile.achievements && profile.achievements.length > 0)) completed += 1;
  if (profile.goals && profile.goals.length > 0) completed += 1;
  
  // Practical information
  if (profile.location?.trim()) completed += 1;
  if (profile.availability) completed += 1;
  if (profile.workPreferences && Object.keys(profile.workPreferences).length > 0) completed += 1;
  
  // Portfolio and contact
  if (hasPortfolioLinks || (profile.contactInfo && Object.keys(profile.contactInfo).length > 2)) completed += 1;
  
  // Personal touch
  if (profile.hobbies && profile.hobbies.length > 0) completed += 1;
  
  // Adjust total based on actual maximum possible score
  total = 16;
  const completionPercentage = Math.round((completed / total) * 100);
  
  // Determine priority based on completion and missing critical fields
  let priority: 'high' | 'medium' | 'low' = 'high';
  const hasCriticalFields = Boolean(
    profile.name && 
    profile.bio && 
    profile.skills && profile.skills.length > 0 && 
    profile.experience && profile.experience.length > 0
  );
  
  if (completionPercentage >= 85 && hasCriticalFields) {
    priority = 'low';
  } else if (completionPercentage >= 60 && hasCriticalFields) {
    priority = 'medium';
  }
  
  return {
    completionPercentage,
    missingFields,
    nextSuggestions: nextSuggestions.slice(0, 3), // Limit to top 3 suggestions
    priority,
    isComplete: completionPercentage >= 95 && hasCriticalFields
  };
}

/**
 * Generates context-aware prompts for the AI assistant based on profile analysis
 */
export function generateProfileAwarePrompt(
  profile: ProfileData, 
  analysis: ProfileAnalysis, 
  basePrompt: string
): string {
  const profileContext = `
CURRENT USER PROFILE STATUS:
- Completion: ${analysis.completionPercentage}%
- Profile Priority: ${analysis.priority}
- Is Complete: ${analysis.isComplete}

EXISTING PROFILE DATA:
- Name: ${profile.name || 'Not provided'}
- Bio: ${profile.bio ? 'Provided' : 'Missing'}
- Skills: ${profile.skills?.length || 0} skills
- Experience: ${profile.experience?.length || 0} roles
- Education: ${profile.education?.length || 0} entries
- Projects: ${profile.projects?.length || 0} projects
- Certifications: ${profile.certifications?.length || 0} certifications
- Achievements: ${profile.achievements?.length || 0} achievements
- Goals: ${profile.goals?.length || 0} goals
- Hobbies: ${profile.hobbies?.length || 0} hobbies

MISSING FIELDS: ${analysis.missingFields.join(', ') || 'None'}

INTELLIGENT NEXT STEPS:
Based on the current profile completion (${analysis.completionPercentage}%), you should focus on:
${analysis.nextSuggestions.map((suggestion, index) => `${index + 1}. ${suggestion}`).join('\n')}

CONVERSATION STRATEGY:
- If profile is less than 30% complete: Focus on basic info (name, bio, main skills)
- If profile is 30-60% complete: Gather detailed experience and education
- If profile is 60-90% complete: Add projects, certifications, and goals
- If profile is 90%+ complete: Polish details and ask about preferences

IMPORTANT: Always be aware of what information the user has already provided. Don't ask for information that's already in their profile unless you're trying to expand or clarify it. Use the existing data to ask more targeted, relevant questions.

When the user provides new information, acknowledge what they already have and build upon it. For example: "I see you already have ${profile.skills?.length || 0} skills listed. That's great! Are there any other skills you'd like to add?"
`;

  return basePrompt + '\n\n' + profileContext;
}

/**
 * Determines if the assistant should proactively suggest profile completion
 */
export function shouldSuggestProfileCompletion(analysis: ProfileAnalysis): boolean {
  return analysis.completionPercentage < 100 && analysis.priority !== 'low';
}

/**
 * Gets a personalized greeting based on profile completion
 */
export function getPersonalizedGreeting(profile: ProfileData, analysis: ProfileAnalysis): string {
  const name = profile.name || '';
  const completion = analysis.completionPercentage;
  
  if (completion === 0) {
    return `Hi${name ? ' ' + name : ''}! I'm here to help you create an amazing professional profile. Let's start by getting to know you better - what's your full name and what type of work do you do?`;
  } else if (completion < 30) {
    return `Welcome back${name ? ', ' + name : ''}! I see we've started building your profile (${completion}% complete). Let's continue - what else would you like to share about your professional background?`;
  } else if (completion < 60) {
    return `Great to see you again${name ? ', ' + name : ''}! Your profile is ${completion}% complete. Let's add more details to make it even better. What other aspects of your career would you like to highlight?`;
  } else if (completion < 90) {
    return `Hello${name ? ' ' + name : ''}! Your profile looks good at ${completion}% completion. Let's polish it up by adding some final touches. What else should we include?`;
  } else if (completion < 100) {
    return `Hi${name ? ' ' + name : ''}! Your profile is almost complete at ${completion}%! Just a few more details and it'll be perfect. What would you like to add?`;
  } else {
    return `Hello${name ? ' ' + name : ''}! Your profile is complete! Feel free to update any information or let me know if you'd like to add something new.`;
  }
}
