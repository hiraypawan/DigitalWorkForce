import { z } from 'zod';

// User validation schemas
export const RegisterSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[\w\-\.\s\u00C0-\u024F\u0370-\u03FF\u0400-\u04FF\u0590-\u05FF\u0600-\u06FF\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]+$/, 'Name contains invalid characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters'),
  role: z.enum(['worker', 'company', 'admin']).default('worker'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const ProfileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  skills: z.array(z.string()).optional(),
  hobbies: z.array(z.string()).optional(),
  aboutMe: z.string().optional(),
  portfolioLinks: z.array(z.string().url()).optional(),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    duration: z.string(),
    description: z.string(),
  })).optional(),
});

// Job validation schemas
export const JobPostSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters')
    .transform(val => val.trim()),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must be less than 5000 characters')
    .transform(val => val.trim()),
  requirements: z.array(z.string().max(500)),
  budget: z.number().positive('Budget must be positive'),
  deadline: z.string().datetime(),
  skills: z.array(z.string().max(100)),
  complexity: z.enum(['low', 'medium', 'high']).default('medium'),
});

// Task validation schemas
export const TaskSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  jobId: z.string(),
  assignedTo: z.string().optional(),
  status: z.enum(['pending', 'assigned', 'in_progress', 'completed', 'reviewed']).default('pending'),
  estimatedHours: z.number().positive(),
  budget: z.number().positive(),
});

// Payment validation schemas
export const PaymentCreateSchema = z.object({
  amount: z.number().positive(),
  taskId: z.string(),
  workerId: z.string(),
  method: z.enum(['stripe', 'razorpay']),
});

// Chat validation schemas
export const MessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty'),
  recipientId: z.string(),
  type: z.enum(['text', 'file', 'system']).default('text'),
});

// Chatbot validation schemas
export const ChatbotResponseSchema = z.object({
  skills: z.array(z.string()),
  hobbies: z.array(z.string()),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    duration: z.string(),
    description: z.string(),
  })),
  aboutMe: z.string(),
});

export type RegisterData = z.infer<typeof RegisterSchema>;
export type LoginData = z.infer<typeof LoginSchema>;
export type ProfileUpdateData = z.infer<typeof ProfileUpdateSchema>;
export type JobPostData = z.infer<typeof JobPostSchema>;
export type TaskData = z.infer<typeof TaskSchema>;
export type PaymentCreateData = z.infer<typeof PaymentCreateSchema>;
export type MessageData = z.infer<typeof MessageSchema>;
export type ChatbotResponseData = z.infer<typeof ChatbotResponseSchema>;
