import mongoose, { Schema, Document, Types } from 'mongoose';

export interface MatchDocument extends Document {
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
  matchScore: number;
  status: 'suggested' | 'accepted' | 'declined';
  aiReasons?: string[];
  skillMatches?: string[];
  experienceMatch?: number;
  availabilityMatch?: number;
}

const MatchSchema = new Schema<MatchDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Project ID is required'],
  },
  matchScore: {
    type: Number,
    required: [true, 'Match score is required'],
    min: [0, 'Match score cannot be negative'],
    max: [100, 'Match score cannot exceed 100'],
  },
  status: {
    type: String,
    enum: ['suggested', 'accepted', 'declined'],
    default: 'suggested',
  },
  aiReasons: [{
    type: String,
    trim: true,
  }],
  skillMatches: [{
    type: String,
    trim: true,
  }],
  experienceMatch: {
    type: Number,
    min: [0, 'Experience match cannot be negative'],
    max: [100, 'Experience match cannot exceed 100'],
  },
  availabilityMatch: {
    type: Number,
    min: [0, 'Availability match cannot be negative'],
    max: [100, 'Availability match cannot exceed 100'],
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for match quality level
MatchSchema.virtual('matchQuality').get(function() {
  if (this.matchScore >= 80) return 'excellent';
  if (this.matchScore >= 60) return 'good';
  if (this.matchScore >= 40) return 'fair';
  return 'poor';
});

// Indexes for efficient querying
MatchSchema.index({ userId: 1 });
MatchSchema.index({ projectId: 1 });
MatchSchema.index({ status: 1 });
MatchSchema.index({ matchScore: -1 });
MatchSchema.index({ createdAt: -1 });

// Compound indexes
MatchSchema.index({ userId: 1, status: 1 });
MatchSchema.index({ projectId: 1, status: 1 });
MatchSchema.index({ userId: 1, matchScore: -1 });

// Ensure each user can only have one match per project
MatchSchema.index({ userId: 1, projectId: 1 }, { unique: true });

export default mongoose.models.Match || mongoose.model<MatchDocument>('Match', MatchSchema);
