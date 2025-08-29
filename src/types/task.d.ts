export interface Task {
  _id: string;
  title: string;
  description: string;
  jobId: string;
  assignedTo: string | null; // Worker user ID
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'reviewed';
  estimatedHours: number;
  actualHours?: number;
  budget: number;
  skills: string[];
  priority: 'low' | 'medium' | 'high';
  deadline: Date;
  startDate?: Date;
  completedDate?: Date;
  feedback?: string;
  rating?: number;
  deliverables: string[];
  dependencies: string[]; // Other task IDs this task depends on
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskProgress {
  taskId: string;
  percentage: number;
  milestone: string;
  comments: string;
  updatedAt: Date;
}

export interface TaskSubmission {
  taskId: string;
  workerId: string;
  deliverables: string[];
  comments: string;
  timeSpent: number;
  submittedAt: Date;
}

export interface TaskReview {
  taskId: string;
  reviewerId: string;
  rating: number; // 1-5 stars
  feedback: string;
  approved: boolean;
  reviewedAt: Date;
}

export interface TaskAssignment {
  taskId: string;
  workerId: string;
  assignedBy: string;
  assignedAt: Date;
  estimatedCompletion: Date;
}

export interface MicroTask {
  title: string;
  description: string;
  estimatedHours: number;
  budget: number;
  skills: string[];
  priority: 'low' | 'medium' | 'high';
}

export interface TaskFilter {
  status?: Task['status'];
  assignedTo?: string;
  jobId?: string;
  skills?: string[];
  priority?: Task['priority'];
  deadline?: {
    before?: Date;
    after?: Date;
  };
  budget?: {
    min?: number;
    max?: number;
  };
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  averageRating: number;
  totalEarnings: number;
  averageCompletionTime: number;
}
