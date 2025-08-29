export interface JobBreakdown {
  title: string;
  description: string;
  estimatedHours: number;
  budget: number;
  skills: string[];
  priority: 'low' | 'medium' | 'high';
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  budget: number;
  skills: string[];
  complexity: 'low' | 'medium' | 'high';
}

export class TaskSplitter {
  /**
   * Splits a job into smaller micro-tasks based on complexity and requirements
   */
  static splitJob(job: Job): JobBreakdown[] {
    const tasks: JobBreakdown[] = [];
    const budgetPerTask = job.budget / this.estimateTaskCount(job);
    
    // Always create planning and research tasks
    tasks.push({
      title: `${job.title} - Planning & Research`,
      description: `Initial research and planning for: ${job.description}`,
      estimatedHours: job.complexity === 'high' ? 4 : job.complexity === 'medium' ? 2 : 1,
      budget: budgetPerTask * 0.2, // 20% for planning
      skills: ['research', 'planning'],
      priority: 'high',
    });

    // Split based on job requirements
    job.requirements.forEach((requirement, index) => {
      tasks.push({
        title: `${job.title} - ${requirement}`,
        description: `Implementation of: ${requirement}`,
        estimatedHours: this.estimateHours(requirement, job.complexity),
        budget: budgetPerTask,
        skills: this.extractSkillsFromRequirement(requirement, job.skills),
        priority: this.determinePriority(requirement),
      });
    });

    // Add testing and review tasks
    tasks.push({
      title: `${job.title} - Testing & QA`,
      description: `Quality assurance and testing for: ${job.description}`,
      estimatedHours: job.complexity === 'high' ? 3 : job.complexity === 'medium' ? 2 : 1,
      budget: budgetPerTask * 0.15, // 15% for testing
      skills: ['testing', 'quality-assurance'],
      priority: 'medium',
    });

    tasks.push({
      title: `${job.title} - Final Review`,
      description: `Final review and delivery for: ${job.description}`,
      estimatedHours: 1,
      budget: budgetPerTask * 0.1, // 10% for review
      skills: ['review', 'documentation'],
      priority: 'medium',
    });

    return tasks;
  }

  /**
   * Estimates the number of tasks based on job complexity
   */
  private static estimateTaskCount(job: Job): number {
    const baseCount = job.requirements.length + 3; // +3 for planning, testing, review
    
    switch (job.complexity) {
      case 'low':
        return Math.max(baseCount, 3);
      case 'medium':
        return Math.max(baseCount, 5);
      case 'high':
        return Math.max(baseCount, 8);
      default:
        return baseCount;
    }
  }

  /**
   * Estimates hours for a specific requirement
   */
  private static estimateHours(requirement: string, complexity: 'low' | 'medium' | 'high'): number {
    const baseHours = complexity === 'high' ? 8 : complexity === 'medium' ? 4 : 2;
    
    // Adjust based on requirement keywords
    const complexKeywords = ['api', 'database', 'integration', 'algorithm', 'ai', 'ml'];
    const simpleKeywords = ['ui', 'styling', 'layout', 'text', 'image'];
    
    const reqLower = requirement.toLowerCase();
    
    if (complexKeywords.some(keyword => reqLower.includes(keyword))) {
      return baseHours * 1.5;
    } else if (simpleKeywords.some(keyword => reqLower.includes(keyword))) {
      return baseHours * 0.7;
    }
    
    return baseHours;
  }

  /**
   * Extracts relevant skills from requirement text
   */
  private static extractSkillsFromRequirement(requirement: string, jobSkills: string[]): string[] {
    const reqLower = requirement.toLowerCase();
    const skills: string[] = [];
    
    // Map requirement keywords to skills
    const skillMapping: { [key: string]: string[] } = {
      'frontend': ['react', 'html', 'css', 'javascript'],
      'backend': ['node.js', 'api', 'database'],
      'ui': ['design', 'css', 'figma'],
      'database': ['mongodb', 'sql', 'database'],
      'api': ['rest', 'api', 'backend'],
      'testing': ['testing', 'jest', 'quality-assurance'],
      'mobile': ['react-native', 'mobile', 'ios', 'android'],
    };

    Object.entries(skillMapping).forEach(([keyword, relatedSkills]) => {
      if (reqLower.includes(keyword)) {
        skills.push(...relatedSkills);
      }
    });

    // Add job skills that might be relevant
    const relevantJobSkills = jobSkills.filter(skill => 
      reqLower.includes(skill.toLowerCase()) || skills.includes(skill)
    );

    return [...new Set([...skills, ...relevantJobSkills])];
  }

  /**
   * Determines task priority based on requirement content
   */
  private static determinePriority(requirement: string): 'low' | 'medium' | 'high' {
    const reqLower = requirement.toLowerCase();
    
    const highPriorityKeywords = ['core', 'critical', 'essential', 'main', 'primary'];
    const lowPriorityKeywords = ['optional', 'nice-to-have', 'extra', 'bonus'];
    
    if (highPriorityKeywords.some(keyword => reqLower.includes(keyword))) {
      return 'high';
    } else if (lowPriorityKeywords.some(keyword => reqLower.includes(keyword))) {
      return 'low';
    }
    
    return 'medium';
  }

  /**
   * Auto-assigns tasks to workers based on their skills and availability
   */
  static autoAssignTasks(tasks: JobBreakdown[], workers: any[]): any[] {
    return tasks.map(task => {
      // Find workers with matching skills
      const eligibleWorkers = workers.filter(worker => {
        const workerSkills = worker.skills || [];
        return task.skills.some(skill => 
          workerSkills.some((workerSkill: string) => 
            workerSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
      });

      // Score workers based on skill match and availability
      const scoredWorkers = eligibleWorkers.map(worker => {
        const skillMatchScore = this.calculateSkillMatch(task.skills, worker.skills || []);
        const availabilityScore = worker.available ? 1 : 0.5;
        const experienceScore = (worker.experience?.length || 0) * 0.1;
        
        return {
          worker,
          score: skillMatchScore + availabilityScore + experienceScore,
        };
      });

      // Sort by score and assign to best match
      scoredWorkers.sort((a, b) => b.score - a.score);
      const assignedWorker = scoredWorkers.length > 0 ? scoredWorkers[0].worker : null;

      return {
        ...task,
        assignedTo: assignedWorker?._id || null,
        assignedWorker,
      };
    });
  }

  /**
   * Calculate skill match percentage between task requirements and worker skills
   */
  private static calculateSkillMatch(taskSkills: string[], workerSkills: string[]): number {
    if (taskSkills.length === 0) return 0;
    
    const matches = taskSkills.filter(taskSkill =>
      workerSkills.some(workerSkill =>
        workerSkill.toLowerCase().includes(taskSkill.toLowerCase()) ||
        taskSkill.toLowerCase().includes(workerSkill.toLowerCase())
      )
    );

    return matches.length / taskSkills.length;
  }
}
