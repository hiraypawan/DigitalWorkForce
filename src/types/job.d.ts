export interface Job {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  budget: number;
  deadline: Date;
  skills: string[];
  complexity: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  postedBy: string; // Company user ID
  applicants: string[]; // Worker user IDs
  selectedWorkers: string[]; // Assigned worker IDs
  tasks: string[]; // Task IDs created from this job
  createdAt: Date;
  updatedAt: Date;
}

export interface JobApplication {
  _id: string;
  jobId: string;
  workerId: string;
  coverLetter: string;
  proposedRate: number;
  estimatedTime: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface JobPosting {
  title: string;
  description: string;
  requirements: string[];
  budget: number;
  deadline: string;
  skills: string[];
  complexity: 'low' | 'medium' | 'high';
}

export interface JobFilter {
  skills?: string[];
  budget?: {
    min?: number;
    max?: number;
  };
  complexity?: 'low' | 'medium' | 'high';
  status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
  deadline?: {
    before?: Date;
    after?: Date;
  };
}

export interface JobStats {
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  totalBudget: number;
  avgBudget: number;
  avgCompletionTime: number;
}
