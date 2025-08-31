import mongoose, { Schema, Document } from 'mongoose';

export interface IEducation {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
  honors?: string;
}

export interface IExperience {
  role: string;
  company: string;
  duration: string;
  details: string;
  location?: string;
  achievements?: string[];
  responsibilities?: string[];
}

export interface IProject {
  title: string;
  description: string;
  link?: string;
  technologies?: string[];
  status?: 'completed' | 'in-progress' | 'planned';
  outcome?: string;
  metrics?: string;
}

export interface ISkill {
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Expert' | number; // 1-5 rating or text
  category?: 'Technical' | 'Soft' | 'Language' | 'Tool';
}

export interface ICertification {
  name: string;
  issuer: string;
  year: string;
  link?: string;
}

export interface IEndorsement {
  rating: number; // 1-5
  review: string;
  reviewer: string;
  role?: string;
  company?: string;
  date: string;
}

export interface IWorkPreferences {
  expectedSalary?: string;
  workType?: 'Remote' | 'Hybrid' | 'Onsite';
  availability?: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  noticePeriod?: string;
  preferredIndustries?: string[];
  willingToRelocate?: boolean;
}

export interface IRetirementContribution {
  totalContributed: number; // Total amount contributed
  currentBalance: number; // Current locked balance
  contributionPercentage: number; // Always 5%
  monthsContributed: number; // Number of months contributing
  lastContribution?: Date;
  isActive: boolean; // Whether currently contributing
  projectedRetirement?: number; // Projected value at retirement
}

export interface IPortfolio extends Document {
  userId: mongoose.Types.ObjectId;
  
  // 1. Profile Overview
  name: string;
  title?: string; // Professional title (e.g., Software Engineer, UI/UX Designer)
  bio: string; // Professional summary (2-3 lines max)
  location?: string;
  availability?: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  
  // 2. Skills Matrix
  skills: ISkill[]; // Enhanced with proficiency levels and categories
  
  // 3. Experience
  experience: IExperience[]; // Role, Company, Duration, Responsibilities, Achievements
  
  // 4. Education
  education: IEducation[]; // Degree, Institution, Year, GPA, Honors
  
  // 5. Projects & Contributions
  projects: IProject[]; // Title, Description, Tools/Tech, Outcome with metrics
  
  // 6. Portfolio Samples / Attachments
  portfolioSamples?: {
    github?: string;
    behance?: string;
    dribbble?: string;
    linkedin?: string;
    website?: string;
    uploadedFiles?: string[]; // Case studies, documents
  };
  
  // 7. Certifications / Training
  certifications: ICertification[]; // Professional certificates
  onlineCourses?: string[]; // Coursera, Udemy, Google courses
  achievements: string[]; // General achievements
  
  // 8. Endorsements & Reviews
  endorsements?: IEndorsement[]; // Ratings from employers/clients
  testimonials?: string[]; // Written testimonials
  
  // 9. Work Preferences
  workPreferences?: IWorkPreferences; // Salary, work type, notice period
  
  // 10. Retirement Contribution (Unique Feature)
  retirementContribution?: IRetirementContribution;
  
  // Legacy fields (for backward compatibility)
  goals: string[];
  hobbies: string[];
  contactInfo?: {
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  preferences?: {
    workType?: string[];
    salaryRange?: string;
    availability?: string;
  };
  
  // Metadata
  lastUpdated: Date;
  completionPercentage: number;
}

const SkillSchema = new Schema<ISkill>({
  name: { type: String, required: true },
  proficiency: { type: Schema.Types.Mixed, required: true }, // String or Number
  category: { type: String, enum: ['Technical', 'Soft', 'Language', 'Tool'] }
});

const EducationSchema = new Schema<IEducation>({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: String, required: true },
  gpa: { type: String },
  honors: { type: String }
});

const ExperienceSchema = new Schema<IExperience>({
  role: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String, required: true },
  details: { type: String, required: true },
  location: { type: String },
  achievements: [{ type: String }],
  responsibilities: [{ type: String }]
});

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String },
  technologies: [{ type: String }],
  status: { type: String, enum: ['completed', 'in-progress', 'planned'], default: 'completed' },
  outcome: { type: String },
  metrics: { type: String }
});

const CertificationSchema = new Schema<ICertification>({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  year: { type: String, required: true },
  link: { type: String }
});

const EndorsementSchema = new Schema<IEndorsement>({
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  reviewer: { type: String, required: true },
  role: { type: String },
  company: { type: String },
  date: { type: String, required: true }
});

const WorkPreferencesSchema = new Schema<IWorkPreferences>({
  expectedSalary: { type: String },
  workType: { type: String, enum: ['Remote', 'Hybrid', 'Onsite'] },
  availability: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Freelance'] },
  noticePeriod: { type: String },
  preferredIndustries: [{ type: String }],
  willingToRelocate: { type: Boolean }
});

const RetirementContributionSchema = new Schema<IRetirementContribution>({
  totalContributed: { type: Number, default: 0 },
  currentBalance: { type: Number, default: 0 },
  contributionPercentage: { type: Number, default: 5 }, // Always 5%
  monthsContributed: { type: Number, default: 0 },
  lastContribution: { type: Date },
  isActive: { type: Boolean, default: false },
  projectedRetirement: { type: Number }
});

const PortfolioSchema = new Schema<IPortfolio>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  // Profile Overview
  name: { type: String, default: '' },
  title: { type: String }, // Professional title
  bio: { type: String, default: '' },
  location: { type: String },
  availability: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Freelance'] },
  
  // Skills Matrix (Enhanced)
  skills: [SkillSchema],
  
  // Experience & Education
  education: [EducationSchema],
  experience: [ExperienceSchema],
  
  // Projects & Portfolio
  projects: [ProjectSchema],
  portfolioSamples: {
    github: { type: String },
    behance: { type: String },
    dribbble: { type: String },
    linkedin: { type: String },
    website: { type: String },
    uploadedFiles: [{ type: String }]
  },
  
  // Certifications & Achievements
  certifications: [CertificationSchema],
  achievements: [{ type: String }],
  onlineCourses: [{ type: String }],
  
  // Endorsements & Reviews
  endorsements: [EndorsementSchema],
  testimonials: [{ type: String }],
  
  // Work Preferences
  workPreferences: WorkPreferencesSchema,
  
  // Retirement Contribution (Unique Feature)
  retirementContribution: RetirementContributionSchema,
  
  // Legacy fields (for backward compatibility)
  goals: [{ type: String }],
  hobbies: [{ type: String }],
  contactInfo: {
    email: { type: String },
    phone: { type: String },
    linkedin: { type: String },
    github: { type: String },
    website: { type: String }
  },
  preferences: {
    workType: [{ type: String }],
    salaryRange: { type: String },
    availability: { type: String }
  },
  
  // Metadata
  lastUpdated: { type: Date, default: Date.now },
  completionPercentage: { type: Number, default: 0 }
});

// Calculate completion percentage before saving
PortfolioSchema.pre('save', function(next) {
  let completed = 0;
  const total = 8; // Total essential fields

  if (this.name?.trim()) completed++;
  if (this.bio?.trim()) completed++;
  if (this.education?.length > 0) completed++;
  if (this.experience?.length > 0) completed++;
  if (this.skills?.length > 0) completed++;
  if (this.projects?.length > 0) completed++;
  if (this.certifications?.length > 0 || this.achievements?.length > 0) completed++;
  if (this.goals?.length > 0) completed++;

  this.completionPercentage = Math.round((completed / total) * 100);
  this.lastUpdated = new Date();
  next();
});

const Portfolio = mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);

export default Portfolio;
