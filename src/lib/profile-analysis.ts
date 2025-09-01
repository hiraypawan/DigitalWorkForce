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
  let total = 16; // Total points possible
  
  // Core fields (weight 2x) - most important for basic profile
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
  
  // Ensure we never show more than 100% or negative percentages
  const completionPercentage = Math.max(0, Math.min(100, Math.round((completed / total) * 100)));
  
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
  // Identify what's actually missing vs what exists
  const existingFields = [];
  const missingFields = [];
  
  if (profile.name) existingFields.push('name');
  else missingFields.push('name');
  
  if (profile.title) existingFields.push('title/role');
  else missingFields.push('title/role');
  
  if (profile.bio) existingFields.push('bio');
  else missingFields.push('bio');
  
  if (profile.skills?.length) existingFields.push(`${profile.skills.length} skills`);
  else missingFields.push('skills');
  
  if (profile.experience?.length) existingFields.push(`${profile.experience.length} work roles`);
  else missingFields.push('work experience');
  
  if (profile.education?.length) existingFields.push(`${profile.education.length} education`);
  else missingFields.push('education');
  
  if (profile.projects?.length) existingFields.push(`${profile.projects.length} projects`);
  else missingFields.push('projects');
  
  if (profile.goals?.length) existingFields.push(`${profile.goals.length} goals`);
  else missingFields.push('career goals');
  
  if (profile.hobbies?.length) existingFields.push(`${profile.hobbies.length} hobbies`);
  else missingFields.push('hobbies');
  
  // Get next most important missing field
  const nextFocus = missingFields[0] || 'additional details';
  
  // Get industry-specific questions if we have a title
  let industryContext = '';
  if (profile.title) {
    const skillQuestions = getIndustryQuestions(profile.title, 'skills');
    const projectQuestions = getIndustryQuestions(profile.title, 'projects');
    const experienceQuestions = getIndustryQuestions(profile.title, 'experience');
    
    industryContext = `

📋 INDUSTRY-SPECIFIC QUESTIONS FOR ${profile.title.toUpperCase()}:
Skills: ${skillQuestions.join(', ')}
Projects: ${projectQuestions.join(', ')}
Experience: ${experienceQuestions.join(', ')}`;
  }
  
  const profileContext = `

🎯 ANTI-LOOP PROFILE ANALYSIS (${analysis.completionPercentage}% complete):
✅ ALREADY HAS: ${existingFields.join(', ') || 'Nothing yet'}
❌ STILL MISSING: ${missingFields.join(', ') || 'All fields complete!'}

🎯 NEXT FOCUS: Ask about "${nextFocus}" ONLY
${industryContext}

🚫 CRITICAL LOOP PREVENTION:
- User already provided: ${existingFields.join(', ')}
- DO NOT ask about these existing fields again
- ONLY ask about: ${missingFields.slice(0,2).join(' OR ')}
- If nothing missing, ask for more details about existing items

⚡ RESPONSE STRATEGY:
- Max 15 words in your question
- Ask ONE specific missing thing
- Don't repeat any previous questions
- Build on what they already shared`;

  return basePrompt + profileContext;
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

// Industry-specific question templates
export const INDUSTRY_TEMPLATES = {
  'Software Engineer': {
    skills: ['Programming languages?', 'Frameworks used?', 'Database experience?'],
    projects: ['Recent coding projects?', 'Open source contributions?', 'Technical challenges solved?'],
    experience: ['Development methodology?', 'Team size managed?', 'Technologies implemented?']
  },
  'Designer': {
    skills: ['Design tools expertise?', 'Design specialization?', 'UX/UI experience?'],
    projects: ['Portfolio pieces?', 'Design systems created?', 'Client work examples?'],
    experience: ['Design process approach?', 'Brand projects?', 'User research experience?']
  },
  'Marketing': {
    skills: ['Marketing channels?', 'Analytics tools?', 'Campaign types?'],
    projects: ['Successful campaigns?', 'Growth metrics achieved?', 'Brand initiatives?'],
    experience: ['Budget managed?', 'Team collaboration?', 'ROI improvements?']
  },
  'Sales': {
    skills: ['Sales methodologies?', 'CRM platforms?', 'Industry expertise?'],
    projects: ['Sales achievements?', 'Revenue generated?', 'Client relationships?'],
    experience: ['Quota performance?', 'Territory managed?', 'Deal sizes?']
  },
  'Product Manager': {
    skills: ['Product strategy?', 'Analytics tools?', 'User research?'],
    projects: ['Product launches?', 'Feature development?', 'User experience improvements?'],
    experience: ['Product metrics?', 'Cross-functional leadership?', 'Market research?']
  },
  'Data Scientist': {
    skills: ['Programming languages?', 'ML frameworks?', 'Statistical methods?'],
    projects: ['Data analysis projects?', 'ML models built?', 'Business insights?'],
    experience: ['Data pipeline work?', 'Model deployment?', 'Business impact?']
  },
  'default': {
    skills: ['Core competencies?', 'Technical skills?', 'Soft skills?'],
    projects: ['Notable projects?', 'Recent work?', 'Achievements?'],
    experience: ['Key responsibilities?', 'Impact made?', 'Team collaboration?']
  }
};

export function getIndustryQuestions(title: string, section: 'skills' | 'projects' | 'experience'): string[] {
  // Try to match industry from title
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('software') || titleLower.includes('developer') || titleLower.includes('engineer')) {
    return INDUSTRY_TEMPLATES['Software Engineer'][section];
  }
  if (titleLower.includes('design') || titleLower.includes('ui') || titleLower.includes('ux')) {
    return INDUSTRY_TEMPLATES['Designer'][section];
  }
  if (titleLower.includes('marketing') || titleLower.includes('growth')) {
    return INDUSTRY_TEMPLATES['Marketing'][section];
  }
  if (titleLower.includes('sales') || titleLower.includes('business development')) {
    return INDUSTRY_TEMPLATES['Sales'][section];
  }
  if (titleLower.includes('product') && titleLower.includes('manager')) {
    return INDUSTRY_TEMPLATES['Product Manager'][section];
  }
  if (titleLower.includes('data') || titleLower.includes('scientist') || titleLower.includes('analyst')) {
    return INDUSTRY_TEMPLATES['Data Scientist'][section];
  }
  
  return INDUSTRY_TEMPLATES['default'][section];
}
