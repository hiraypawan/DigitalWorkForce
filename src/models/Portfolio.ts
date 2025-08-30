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
}

export interface IProject {
  title: string;
  description: string;
  link?: string;
  technologies?: string[];
  status?: 'completed' | 'in-progress' | 'planned';
}

export interface IPortfolio extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  bio: string;
  education: IEducation[];
  experience: IExperience[];
  skills: string[];
  projects: IProject[];
  certifications: string[];
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
  preferences?: {
    workType?: string[];
    salaryRange?: string;
    availability?: string;
  };
  lastUpdated: Date;
  completionPercentage: number;
}

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
  achievements: [{ type: String }]
});

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String },
  technologies: [{ type: String }],
  status: { type: String, enum: ['completed', 'in-progress', 'planned'], default: 'completed' }
});

const PortfolioSchema = new Schema<IPortfolio>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, default: '' },
  bio: { type: String, default: '' },
  education: [EducationSchema],
  experience: [ExperienceSchema],
  skills: [{ type: String }],
  projects: [ProjectSchema],
  certifications: [{ type: String }],
  achievements: [{ type: String }],
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
