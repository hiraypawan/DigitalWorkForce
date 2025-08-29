export interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
  skills?: string[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'worker' | 'company' | 'admin';
  skills: string[];
  hobbies: string[];
  experience: Experience[];
  aboutMe: string;
  portfolioLinks: string[];
  profilePicture?: string;
  available: boolean;
  rating: number;
  completedTasks: number;
  totalEarnings: number;
  sipInvestments: number;
  insurancePlan?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkerProfile {
  skills: string[];
  hobbies: string[];
  experience: Experience[];
  aboutMe: string;
  portfolioLinks: string[];
  available: boolean;
  rating: number;
  completedTasks: number;
  totalEarnings: number;
}

export interface CompanyProfile {
  companyName: string;
  industry: string;
  description: string;
  website?: string;
  logo?: string;
  postedJobs: number;
  totalSpent: number;
}

export interface UserRegistration {
  name: string;
  email: string;
  password: string;
  role: 'worker' | 'company';
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'worker' | 'company' | 'admin';
  skills?: string[];
  available?: boolean;
}
