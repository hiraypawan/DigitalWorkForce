import mongoose, { Schema, Document, Types } from 'mongoose';
import type { Task as ITask } from '@/types/task';

export interface TaskDocument extends Document {
  title: string;
  description: string;
  jobId: Types.ObjectId;
  assignedTo?: Types.ObjectId | null;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'reviewed';
  estimatedHours: number;
  actualHours?: number | null;
  budget: number;
  skills: string[];
  priority: 'low' | 'medium' | 'high';
  deadline: Date;
  startDate?: Date | null;
  completedDate?: Date | null;
  feedback?: string | null;
  rating?: number | null;
  deliverables: string[];
  dependencies: Types.ObjectId[];
}

const TaskSchema = new Schema<TaskDocument>({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Task title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Task description is required'],
    maxlength: [2000, 'Task description cannot exceed 2000 characters'],
  },
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job ID is required'],
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'completed', 'reviewed'],
    default: 'pending',
  },
  estimatedHours: {
    type: Number,
    required: [true, 'Estimated hours is required'],
    min: [0.5, 'Estimated hours must be at least 0.5'],
    max: [100, 'Estimated hours cannot exceed 100'],
  },
  actualHours: {
    type: Number,
    min: [0, 'Actual hours cannot be negative'],
    default: null,
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: [0, 'Budget cannot be negative'],
  },
  skills: [{
    type: String,
    trim: true,
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required'],
  },
  startDate: {
    type: Date,
    default: null,
  },
  completedDate: {
    type: Date,
    default: null,
  },
  feedback: {
    type: String,
    maxlength: [1000, 'Feedback cannot exceed 1000 characters'],
    default: null,
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    default: null,
  },
  deliverables: [{
    type: String,
    trim: true,
  }],
  dependencies: [{
    type: Schema.Types.ObjectId,
    ref: 'Task',
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for progress percentage
TaskSchema.virtual('progressPercentage').get(function() {
  switch (this.status) {
    case 'pending': return 0;
    case 'assigned': return 10;
    case 'in_progress': return 50;
    case 'completed': return 90;
    case 'reviewed': return 100;
    default: return 0;
  }
});

// Virtual for time remaining
TaskSchema.virtual('timeRemaining').get(function() {
  const now = new Date();
  const deadline = new Date(this.deadline);
  const timeDiff = deadline.getTime() - now.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24)); // Days remaining
});

// Virtual for hourly rate
TaskSchema.virtual('hourlyRate').get(function() {
  if (!this.estimatedHours || this.estimatedHours === 0) return 0;
  return this.budget / this.estimatedHours;
});

// Virtual for efficiency (actual vs estimated hours)
TaskSchema.virtual('efficiency').get(function() {
  if (!this.actualHours || !this.estimatedHours) return null;
  return this.estimatedHours / this.actualHours;
});

// Indexes for efficient querying
TaskSchema.index({ jobId: 1 });
TaskSchema.index({ assignedTo: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ deadline: 1 });
TaskSchema.index({ skills: 1 });
TaskSchema.index({ createdAt: -1 });

// Compound indexes
TaskSchema.index({ assignedTo: 1, status: 1 });
TaskSchema.index({ jobId: 1, status: 1 });
TaskSchema.index({ status: 1, deadline: 1 });

// Pre-save middleware to set startDate when task is assigned
TaskSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'assigned' && !this.startDate) {
    this.startDate = new Date();
  }
  
  if (this.isModified('status') && this.status === 'completed' && !this.completedDate) {
    this.completedDate = new Date();
  }
  
  next();
});

export default mongoose.models.Task || mongoose.model<TaskDocument>('Task', TaskSchema);
