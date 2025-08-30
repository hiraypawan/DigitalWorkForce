import mongoose, { Schema, Document } from 'mongoose';

export interface Skill {
  name: string;
  experience: string;
  projects: string[];
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash?: string; // Optional for OAuth users
  profile: {
    about: string;
    skills: string[];
    experience: string[];
    projects: string[];
  };
  // Legacy fields - keeping for backwards compatibility
  aboutMe?: string;
  skills?: Skill[];
  hobbies?: string[];
  portfolioLinks: string[];
  resumeUrl: string;
  role?: 'worker' | 'company' | 'admin';
  profilePicture?: string;
  available?: boolean;
  rating?: number;
  completedTasks?: number;
  totalEarnings?: number;
  sipInvestments?: number;
  insurancePlan?: string;
  // For NextAuth
  image?: string;
  emailVerified?: Date;
  comparePassword?(candidatePassword: string): Promise<boolean>;
  getPublicProfile(): any;
}

const SkillSchema = new Schema<Skill>({
  name: { type: String, required: true },
  experience: { type: String, required: true },
  projects: [{ type: String }],
}, { _id: false });

const UserSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  passwordHash: {
    type: String,
    required: false, // Optional for OAuth users
    minlength: [6, 'Password must be at least 6 characters'],
  },
  // New profile structure for chatbot data
  profile: {
    about: {
      type: String,
      default: '',
      maxlength: [2000, 'About section cannot exceed 2000 characters'],
    },
    skills: [{
      type: String,
      trim: true,
    }],
    experience: [{
      type: String,
      trim: true,
    }],
    projects: [{
      type: String,
      trim: true,
    }],
  },
  // For NextAuth compatibility
  image: {
    type: String,
    default: '',
  },
  emailVerified: {
    type: Date,
    default: null,
  },
  aboutMe: {
    type: String,
    maxlength: [1000, 'About me cannot exceed 1000 characters'],
    default: '',
  },
  skills: [SkillSchema],
  hobbies: [{
    type: String,
    trim: true,
  }],
  portfolioLinks: [{
    type: String,
    validate: {
      validator: function(url: string) {
        if (!url) return true;
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Invalid URL format',
    },
  }],
  resumeUrl: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['worker', 'company', 'admin'],
    default: 'worker',
  },
  profilePicture: {
    type: String,
    default: '',
  },
  available: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5'],
  },
  completedTasks: {
    type: Number,
    default: 0,
    min: [0, 'Completed tasks cannot be negative'],
  },
  totalEarnings: {
    type: Number,
    default: 0,
    min: [0, 'Total earnings cannot be negative'],
  },
  sipInvestments: {
    type: Number,
    default: 0,
    min: [0, 'SIP investments cannot be negative'],
  },
  insurancePlan: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for full profile completeness
UserSchema.virtual('profileCompleteness').get(function() {
  let score = 0;
  if (this.name) score += 10;
  if (this.email) score += 10;
  if (this.aboutMe && this.aboutMe.length > 50) score += 15;
  if (this.skills && this.skills.length > 0) score += 20;
  if (this.hobbies && this.hobbies.length > 0) score += 10;
  if (this.portfolioLinks && this.portfolioLinks.length > 0) score += 10;
  if (this.resumeUrl) score += 15;
  if (this.profilePicture) score += 10;
  return score;
});

// Index for efficient querying (email is already indexed via unique: true)
UserSchema.index({ role: 1 });
UserSchema.index({ 'skills.name': 1 });
UserSchema.index({ available: 1 });
UserSchema.index({ rating: -1 });

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  
  const bcrypt = require('bcryptjs');
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

// Method to check password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Method to get public profile (excluding sensitive data)
UserSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.passwordHash;
  delete userObject.__v;
  return userObject;
};

export default mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);
