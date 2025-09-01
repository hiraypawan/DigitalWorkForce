/**
 * Text Processing Utilities for Professional Profile Building
 * Handles cleaning up, professionalizing, and formatting user input
 */

// Common technology/skill mappings for proper capitalization
const TECH_MAPPINGS: Record<string, string> = {
  'javascript': 'JavaScript',
  'js': 'JavaScript',
  'typescript': 'TypeScript',
  'ts': 'TypeScript',
  'react': 'React',
  'reactjs': 'React',
  'react.js': 'React.js',
  'vue': 'Vue.js',
  'vuejs': 'Vue.js',
  'vue.js': 'Vue.js',
  'angular': 'Angular',
  'angularjs': 'AngularJS',
  'node': 'Node.js',
  'nodejs': 'Node.js',
  'node.js': 'Node.js',
  'express': 'Express.js',
  'expressjs': 'Express.js',
  'php': 'PHP',
  'python': 'Python',
  'java': 'Java',
  'c++': 'C++',
  'c#': 'C#',
  'csharp': 'C#',
  'css': 'CSS',
  'html': 'HTML',
  'html5': 'HTML5',
  'css3': 'CSS3',
  'sass': 'SASS',
  'scss': 'SCSS',
  'less': 'LESS',
  'bootstrap': 'Bootstrap',
  'tailwind': 'Tailwind CSS',
  'tailwindcss': 'Tailwind CSS',
  'mongodb': 'MongoDB',
  'mysql': 'MySQL',
  'postgresql': 'PostgreSQL',
  'postgres': 'PostgreSQL',
  'sqlite': 'SQLite',
  'redis': 'Redis',
  'aws': 'AWS',
  'azure': 'Microsoft Azure',
  'gcp': 'Google Cloud Platform',
  'docker': 'Docker',
  'kubernetes': 'Kubernetes',
  'git': 'Git',
  'github': 'GitHub',
  'gitlab': 'GitLab',
  'bitbucket': 'Bitbucket',
  'jira': 'Jira',
  'figma': 'Figma',
  'photoshop': 'Adobe Photoshop',
  'illustrator': 'Adobe Illustrator',
  'xd': 'Adobe XD',
  'sketch': 'Sketch',
  'sql': 'SQL',
  'nosql': 'NoSQL',
  'graphql': 'GraphQL',
  'rest': 'REST API',
  'restful': 'RESTful API',
  'api': 'API',
  'json': 'JSON',
  'xml': 'XML',
  'yaml': 'YAML',
  'nextjs': 'Next.js',
  'next.js': 'Next.js',
  'nuxtjs': 'Nuxt.js',
  'nuxt.js': 'Nuxt.js',
  'laravel': 'Laravel',
  'symfony': 'Symfony',
  'django': 'Django',
  'flask': 'Flask',
  'spring': 'Spring Framework',
  'hibernate': 'Hibernate',
  'junit': 'JUnit',
  'jest': 'Jest',
  'mocha': 'Mocha',
  'cypress': 'Cypress',
  'selenium': 'Selenium',
  'webpack': 'Webpack',
  'vite': 'Vite',
  'babel': 'Babel',
  'eslint': 'ESLint',
  'prettier': 'Prettier'
};

// Role/title mappings for proper formatting
const ROLE_MAPPINGS: Record<string, string> = {
  'frontend developer': 'Frontend Developer',
  'front-end developer': 'Frontend Developer',
  'front end developer': 'Frontend Developer',
  'backend developer': 'Backend Developer',
  'back-end developer': 'Backend Developer',
  'back end developer': 'Backend Developer',
  'fullstack developer': 'Full Stack Developer',
  'full-stack developer': 'Full Stack Developer',
  'full stack developer': 'Full Stack Developer',
  'web developer': 'Web Developer',
  'software engineer': 'Software Engineer',
  'software developer': 'Software Developer',
  'mobile developer': 'Mobile Developer',
  'ios developer': 'iOS Developer',
  'android developer': 'Android Developer',
  'react developer': 'React Developer',
  'node developer': 'Node.js Developer',
  'python developer': 'Python Developer',
  'java developer': 'Java Developer',
  'php developer': 'PHP Developer',
  'devops engineer': 'DevOps Engineer',
  'data scientist': 'Data Scientist',
  'data analyst': 'Data Analyst',
  'business analyst': 'Business Analyst',
  'product manager': 'Product Manager',
  'project manager': 'Project Manager',
  'ui designer': 'UI Designer',
  'ux designer': 'UX Designer',
  'ui/ux designer': 'UI/UX Designer',
  'graphic designer': 'Graphic Designer',
  'web designer': 'Web Designer',
  'digital marketer': 'Digital Marketer',
  'marketing manager': 'Marketing Manager',
  'content writer': 'Content Writer',
  'technical writer': 'Technical Writer',
  'qa engineer': 'QA Engineer',
  'quality assurance': 'Quality Assurance Engineer',
  'test engineer': 'Test Engineer',
  'security engineer': 'Security Engineer',
  'network engineer': 'Network Engineer',
  'system administrator': 'System Administrator',
  'database administrator': 'Database Administrator',
  'dba': 'Database Administrator'
};

/**
 * Extracts and removes URLs from text, returning cleaned text and extracted URLs
 */
export function extractUrls(text: string): { cleanText: string; urls: string[] } {
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const urls = text.match(urlRegex) || [];
  const cleanText = text.replace(urlRegex, '').replace(/\s+/g, ' ').trim();
  
  return { cleanText, urls };
}

/**
 * Professionalizes skill names using common mappings
 */
export function professionalizeSkills(skills: string[]): string[] {
  return skills.map(skill => {
    const normalizedSkill = skill.toLowerCase().trim();
    return TECH_MAPPINGS[normalizedSkill] || toTitleCase(skill.trim());
  });
}

/**
 * Professionalizes role/title names
 */
export function professionalizeRole(role: string): string {
  const normalizedRole = role.toLowerCase().trim();
  return ROLE_MAPPINGS[normalizedRole] || toTitleCase(role.trim());
}

/**
 * Converts text to proper title case
 */
export function toTitleCase(text: string): string {
  const articles = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'the', 'to', 'up'];
  
  return text.toLowerCase().replace(/\w\S*/g, (txt, offset) => {
    if (offset !== 0 && articles.includes(txt.toLowerCase())) {
      return txt.toLowerCase();
    }
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

/**
 * Capitalizes the first letter of each sentence
 */
export function capitalizeSentences(text: string): string {
  return text.replace(/(^\w|[.!?]\s*\w)/g, (match) => match.toUpperCase());
}

/**
 * Removes excessive whitespace and normalizes spacing
 */
export function normalizeSpacing(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Fixes common grammar and formatting issues
 */
export function fixCommonIssues(text: string): string {
  let fixed = text;
  
  // Fix common contractions
  fixed = fixed.replace(/\bi'm\b/gi, "I'm");
  fixed = fixed.replace(/\bi've\b/gi, "I've");
  fixed = fixed.replace(/\bi'll\b/gi, "I'll");
  fixed = fixed.replace(/\bi'd\b/gi, "I'd");
  fixed = fixed.replace(/\bdon't\b/gi, "don't");
  fixed = fixed.replace(/\bwon't\b/gi, "won't");
  fixed = fixed.replace(/\bcan't\b/gi, "can't");
  fixed = fixed.replace(/\bisn't\b/gi, "isn't");
  fixed = fixed.replace(/\baren't\b/gi, "aren't");
  fixed = fixed.replace(/\bwasn't\b/gi, "wasn't");
  fixed = fixed.replace(/\bweren't\b/gi, "weren't");
  
  // Always capitalize "I"
  fixed = fixed.replace(/\bi\b/g, 'I');
  
  // Fix spacing around punctuation
  fixed = fixed.replace(/\s*,\s*/g, ', ');
  fixed = fixed.replace(/\s*\.\s*/g, '. ');
  fixed = fixed.replace(/\s*;\s*/g, '; ');
  fixed = fixed.replace(/\s*:\s*/g, ': ');
  
  // Remove multiple spaces
  fixed = normalizeSpacing(fixed);
  
  // Capitalize first letter of sentences
  fixed = capitalizeSentences(fixed);
  
  return fixed;
}

/**
 * Professionalizes a complete text input
 */
export function professionalizeText(text: string): string {
  if (!text || typeof text !== 'string') return text;
  
  let processed = text;
  
  // Fix common issues first
  processed = fixCommonIssues(processed);
  
  // Normalize spacing
  processed = normalizeSpacing(processed);
  
  return processed;
}

/**
 * Processes experience description to separate URLs and clean text
 */
export function processExperienceDescription(description: string): {
  cleanDescription: string;
  websiteUrl?: string;
  projectUrls: string[];
} {
  const { cleanText, urls } = extractUrls(description);
  const professionalizedText = professionalizeText(cleanText);
  
  // Separate website URLs from project URLs
  const websiteUrls = urls.filter(url => 
    url.includes('company.com') || 
    url.includes('website') || 
    url.includes('.org') || 
    url.includes('.edu')
  );
  
  const projectUrls = urls.filter(url => 
    url.includes('github.com') || 
    url.includes('gitlab.com') || 
    url.includes('demo') || 
    url.includes('app.') ||
    !websiteUrls.includes(url)
  );
  
  return {
    cleanDescription: professionalizedText,
    websiteUrl: websiteUrls[0],
    projectUrls
  };
}

/**
 * Processes project description to extract technologies and URLs
 */
export function processProjectDescription(description: string, title: string): {
  cleanDescription: string;
  technologies: string[];
  projectUrl?: string;
  demoUrl?: string;
} {
  const { cleanText, urls } = extractUrls(description);
  const professionalizedText = professionalizeText(cleanText);
  
  // Extract mentioned technologies from description
  const technologies: string[] = [];
  const lowerDesc = cleanText.toLowerCase();
  
  Object.keys(TECH_MAPPINGS).forEach(tech => {
    if (lowerDesc.includes(tech)) {
      technologies.push(TECH_MAPPINGS[tech]);
    }
  });
  
  // Remove duplicates
  const uniqueTechs = [...new Set(technologies)];
  
  // Categorize URLs
  const projectUrl = urls.find(url => 
    url.includes('github.com') || 
    url.includes('gitlab.com') || 
    url.includes('bitbucket.com')
  );
  
  const demoUrl = urls.find(url => 
    url.includes('demo') || 
    url.includes('app.') || 
    url.includes('herokuapp.com') ||
    url.includes('netlify.app') ||
    url.includes('vercel.app') ||
    (!projectUrl && url)
  );
  
  return {
    cleanDescription: professionalizedText,
    technologies: uniqueTechs,
    projectUrl,
    demoUrl
  };
}

/**
 * Processes skills input to extract and professionalize skill names
 */
export function processSkillsInput(skillsText: string): {
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Technical' | 'Soft' | 'Language' | 'Tool';
}[] {
  if (!skillsText) return [];
  
  // Split by common separators
  const skillParts = skillsText
    .split(/[,;|&+]/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  return skillParts.map(skillText => {
    // Extract proficiency indicators
    let proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' = 'Intermediate';
    let cleanSkill = skillText.toLowerCase();
    
    if (cleanSkill.includes('expert') || cleanSkill.includes('advanced') || cleanSkill.includes('senior')) {
      proficiency = 'Expert';
      cleanSkill = cleanSkill.replace(/(expert|advanced|senior)/gi, '').trim();
    } else if (cleanSkill.includes('intermediate') || cleanSkill.includes('good')) {
      proficiency = 'Intermediate';
      cleanSkill = cleanSkill.replace(/(intermediate|good)/gi, '').trim();
    } else if (cleanSkill.includes('beginner') || cleanSkill.includes('basic') || cleanSkill.includes('learning')) {
      proficiency = 'Beginner';
      cleanSkill = cleanSkill.replace(/(beginner|basic|learning)/gi, '').trim();
    }
    
    // Determine category
    let category: 'Technical' | 'Soft' | 'Language' | 'Tool' = 'Technical';
    
    const softSkills = ['communication', 'leadership', 'teamwork', 'problem solving', 'time management', 'creative', 'analytical'];
    const languages = ['english', 'spanish', 'french', 'german', 'chinese', 'japanese', 'hindi', 'portuguese'];
    const tools = ['photoshop', 'illustrator', 'figma', 'sketch', 'jira', 'confluence', 'slack', 'trello'];
    
    if (softSkills.some(soft => cleanSkill.includes(soft))) {
      category = 'Soft';
    } else if (languages.some(lang => cleanSkill.includes(lang))) {
      category = 'Language';
    } else if (tools.some(tool => cleanSkill.includes(tool))) {
      category = 'Tool';
    }
    
    // Professionalize the skill name
    const professionalName = TECH_MAPPINGS[cleanSkill] || toTitleCase(cleanSkill);
    
    return {
      name: professionalName,
      proficiency,
      category
    };
  });
}
