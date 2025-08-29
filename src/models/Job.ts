import mongoose, { Schema, Document, Types } from 'mongoose';
import type { Job as IJob } from '@/types/job';

export interface JobDocument extends Document {
  title: string;
  description: string;
  requirements: string[];
  budget: number;
  deadline: Date;
  skills: string[];
  complexity: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  postedBy: Types.ObjectId;
  applicants: Types.ObjectId[];
  selectedWorkers: Types.ObjectId[];
  tasks: Types.ObjectId[];
}

const JobSchema = new Schema<JobDocument>({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [200, 'Job title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [5000, 'Job description cannot exceed 5000 characters'],
  },
  requirements: [{
    type: String,
    required: true,
    trim: true,
  }],
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: [0, 'Budget cannot be negative'],
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required'],
    validate: {
      validator: function(date: Date) {
        return date > new Date();
      },
      message: 'Deadline must be in the future',
    },
  },
  skills: [{
    type: String,
    trim: true,
  }],
  complexity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'completed', 'cancelled'],
    default: 'open',
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Posted by user is required'],
  },
  applicants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  selectedWorkers: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task',
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for calculating total task progress
JobSchema.virtual('progress').get(function() {
  if (!this.tasks || this.tasks.length === 0) return 0;
  // This would need to be populated with actual task data
  return 0; // Placeholder
});

// Virtual for days remaining
JobSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const deadline = new Date(this.deadline);
  const timeDiff = deadline.getTime() - now.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

// Indexes for efficient querying
JobSchema.index({ postedBy: 1 });
JobSchema.index({ status: 1 });
JobSchema.index({ skills: 1 });
JobSchema.index({ complexity: 1 });
JobSchema.index({ budget: 1 });
JobSchema.index({ deadline: 1 });
JobSchema.index({ createdAt: -1 });

// Compound indexes
JobSchema.index({ status: 1, skills: 1 });
JobSchema.index({ postedBy: 1, status: 1 });

export default mongoose.models.Job || mongoose.model<JobDocument>('Job', JobSchema);
