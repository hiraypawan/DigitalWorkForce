export interface ProfileAnalysis {
  completionPercentage: number;
  missingFields: string[];
  nextSuggestions: string[];
  priority: 'high' | 'medium' | 'low';
  isComplete: boolean;
}

export interface ProfileData {
  name?: string;
  bio?: string;
  education?: any[];
  experience?: any[];
  skills?: string[];
  projects?: any[];
  certifications?: string[];
  achievements?: string[];
  goals?: string[];
  hobbies?: string[];
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
  
  // Essential fields analysis
  if (!profile.name?.trim()) {
    missingFields.push('name');
    nextSuggestions.push('Tell me your full name');
  }
  
  if (!profile.bio?.trim()) {
    missingFields.push('bio');
    nextSuggestions.push('Share a brief professional summary about yourself');
  }
  
  if (!profile.skills || profile.skills.length === 0) {
    missingFields.push('skills');
    nextSuggestions.push('What are your main technical and professional skills?');
  }
  
  if (!profile.experience || profile.experience.length === 0) {
    missingFields.push('experience');
    nextSuggestions.push('Tell me about your work experience and previous roles');
  }
  
  if (!profile.education || profile.education.length === 0) {
    missingFields.push('education');
    nextSuggestions.push('Share your educational background');
  }
  
  if (!profile.projects || profile.projects.length === 0) {
    missingFields.push('projects');
    nextSuggestions.push('Describe some projects you\'ve worked on');
  }
  
  if (!profile.goals || profile.goals.length === 0) {
    missingFields.push('goals');
    nextSuggestions.push('What are your career goals and aspirations?');
  }
  
  // Optional but valuable fields
  if (!profile.certifications || profile.certifications.length === 0) {
    if (!profile.achievements || profile.achievements.length === 0) {
      missingFields.push('certifications_achievements');
      nextSuggestions.push('Do you have any certifications or notable achievements?');
    }
  }
  
  if (!profile.hobbies || profile.hobbies.length === 0) {
    missingFields.push('hobbies');
    nextSuggestions.push('What are your hobbies and interests outside of work?');
  }
  
  // Contact info analysis
  const contactFields = ['linkedin', 'github', 'website', 'phone'];
  const missingContactFields = contactFields.filter(field => 
    !profile.contactInfo?.[field as keyof typeof profile.contactInfo]
  );
  
  if (missingContactFields.length > 2) {
    missingFields.push('contact_info');
    nextSuggestions.push('Share your professional contact information (LinkedIn, GitHub, etc.)');
  }
  
  // Calculate completion percentage (using same logic as Portfolio model)
  let completed = 0;
  const total = 8;
  
  if (profile.name?.trim()) completed++;
  if (profile.bio?.trim()) completed++;
  if (profile.education && profile.education.length > 0) completed++;
  if (profile.experience && profile.experience.length > 0) completed++;
  if (profile.skills && profile.skills.length > 0) completed++;
  if (profile.projects && profile.projects.length > 0) completed++;
  if ((profile.certifications && profile.certifications.length > 0) || (profile.achievements && profile.achievements.length > 0)) completed++;
  if (profile.goals && profile.goals.length > 0) completed++;
  
  const completionPercentage = Math.round((completed / total) * 100);
  
  // Determine priority based on completion
  let priority: 'high' | 'medium' | 'low' = 'high';
  if (completionPercentage >= 75) priority = 'low';
  else if (completionPercentage >= 50) priority = 'medium';
  
  return {
    completionPercentage,
    missingFields,
    nextSuggestions: nextSuggestions.slice(0, 3), // Limit to top 3 suggestions
    priority,
    isComplete: completionPercentage >= 100
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
