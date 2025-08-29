import mongoose, { Schema, Document, Types } from 'mongoose';

export interface CompanyDocument extends Document {
  name: string;
  email: string;
  company: string;
  projects: Types.ObjectId[];
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
  logo?: string;
}

const CompanySchema = new Schema<CompanyDocument>({
  name: {
    type: String,
    required: [true, 'Contact name is required'],
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
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [200, 'Company name cannot exceed 200 characters'],
  },
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Job',
  }],
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    trim: true,
  },
  website: {
    type: String,
    validate: {
      validator: function(url: string) {
        if (!url) return true; // Optional field
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Invalid URL format',
    },
  },
  industry: {
    type: String,
    trim: true,
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
  },
  location: {
    type: String,
    trim: true,
  },
  logo: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for total projects
CompanySchema.virtual('totalProjects').get(function() {
  return this.projects ? this.projects.length : 0;
});

// Indexes for efficient querying
CompanySchema.index({ email: 1 });
CompanySchema.index({ company: 1 });
CompanySchema.index({ industry: 1 });
CompanySchema.index({ createdAt: -1 });

export default mongoose.models.Company || mongoose.model<CompanyDocument>('Company', CompanySchema);
