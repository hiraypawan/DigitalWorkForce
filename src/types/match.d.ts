export interface Match {
  _id: string;
  userId: string;
  projectId: string;
  matchScore: number;
  status: 'suggested' | 'accepted' | 'declined';
  aiReasons?: string[];
  skillMatches?: string[];
  experienceMatch?: number;
  availabilityMatch?: number;
  matchQuality?: 'excellent' | 'good' | 'fair' | 'poor';
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchingCriteria {
  skills: string[];
  experience: number;
  availability: boolean;
  rating: number;
  budget: number;
  deadline: Date;
}
