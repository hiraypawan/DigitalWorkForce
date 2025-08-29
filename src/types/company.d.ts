export interface Company {
  _id: string;
  name: string;
  email: string;
  company: string;
  projects: string[];
  description?: string;
  website?: string;
  industry?: string;
  size?: '1-10' | '11-50' | '51-200' | '201-500' | '500+';
  location?: string;
  logo?: string;
  totalProjects?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyStats {
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  totalWorkersHired: number;
  totalSpent: number;
  averageProjectDuration: number;
  workerSatisfactionRate: number;
}
