export interface Payment {
  _id: string;
  amount: number;
  currency: string;
  taskId: string;
  workerId: string;
  companyId: string;
  method: 'stripe' | 'razorpay';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  fees: number;
  netAmount: number;
  description: string;
  metadata: any;
  createdAt: Date;
  completedAt?: Date;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'upi' | 'wallet';
  last4?: string;
  brand?: string;
  isDefault: boolean;
  userId: string;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  paymentId: string;
  amount: number;
  tax: number;
  totalAmount: number;
  currency: string;
  description: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: Date;
  paidAt?: Date;
  createdAt: Date;
}

export interface PaymentHistory {
  _id: string;
  userId: string;
  payments: Payment[];
  totalEarnings: number;
  totalWithdrawn: number;
  pendingAmount: number;
  monthlyBreakdown: {
    month: string;
    earnings: number;
    tasks: number;
  }[];
}

export interface SIPInvestment {
  _id: string;
  userId: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  fund: string;
  status: 'active' | 'paused' | 'cancelled';
  totalInvested: number;
  currentValue: number;
  returns: number;
  startDate: Date;
  nextPaymentDate: Date;
  createdAt: Date;
}

export interface InsurancePlan {
  _id: string;
  userId: string;
  planType: 'health' | 'life' | 'disability' | 'umbrella';
  provider: string;
  premium: number;
  coverage: number;
  benefits: string[];
  status: 'active' | 'pending' | 'cancelled';
  policyNumber: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

export interface PaymentRequest {
  amount: number;
  taskId: string;
  workerId: string;
  method: 'stripe' | 'razorpay';
  description: string;
}
