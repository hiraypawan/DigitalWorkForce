import mongoose, { Schema, Document, Types } from 'mongoose';
import type { Payment as IPayment } from '@/types/payment';

export interface PaymentDocument extends Document {
  amount: number;
  currency: 'USD' | 'INR' | 'EUR' | 'GBP';
  taskId: Types.ObjectId;
  workerId: Types.ObjectId;
  companyId: Types.ObjectId;
  method: 'stripe' | 'razorpay';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  fees: number;
  netAmount: number;
  description?: string;
  metadata?: any;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<PaymentDocument>({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative'],
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    enum: ['USD', 'INR', 'EUR', 'GBP'],
    default: 'USD',
  },
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'Task ID is required'],
  },
  workerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Worker ID is required'],
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Company ID is required'],
  },
  method: {
    type: String,
    enum: ['stripe', 'razorpay'],
    required: [true, 'Payment method is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  transactionId: {
    type: String,
    required: [true, 'Transaction ID is required'],
    unique: true,
  },
  fees: {
    type: Number,
    default: 0,
    min: [0, 'Fees cannot be negative'],
  },
  netAmount: {
    type: Number,
    required: [true, 'Net amount is required'],
    min: [0, 'Net amount cannot be negative'],
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: '',
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
  completedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for fee percentage
PaymentSchema.virtual('feePercentage').get(function() {
  if (this.amount === 0) return 0;
  return (this.fees / this.amount) * 100;
});

// Virtual for processing time
PaymentSchema.virtual('processingTime').get(function() {
  if (!this.completedAt) return null;
  const timeDiff = this.completedAt.getTime() - this.createdAt.getTime();
  return Math.round(timeDiff / (1000 * 60 * 60)); // Hours
});

// Indexes for efficient querying
PaymentSchema.index({ workerId: 1 });
PaymentSchema.index({ companyId: 1 });
PaymentSchema.index({ taskId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ method: 1 });
PaymentSchema.index({ transactionId: 1 });
PaymentSchema.index({ createdAt: -1 });

// Compound indexes
PaymentSchema.index({ workerId: 1, status: 1 });
PaymentSchema.index({ companyId: 1, status: 1 });
PaymentSchema.index({ status: 1, createdAt: -1 });

// Pre-save middleware to calculate fees and net amount
PaymentSchema.pre('save', function(next) {
  if (this.isModified('amount') || this.isModified('method')) {
    // Calculate fees based on payment method
    const feeRate = this.method === 'stripe' ? 0.029 : 0.02; // 2.9% for Stripe, 2% for Razorpay
    this.fees = this.amount * feeRate;
    this.netAmount = this.amount - this.fees;
  }
  
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  next();
});

export default mongoose.models.Payment || mongoose.model<PaymentDocument>('Payment', PaymentSchema);
