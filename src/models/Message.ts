import mongoose, { Schema, Document, Types } from 'mongoose';
import type { Message as IMessage, Chat as IChat, ChatbotConversation as IChatbotConversation } from '@/types/message';

export interface MessageDocument extends Document {
  content: string;
  senderId: Types.ObjectId;
  recipientId: Types.ObjectId;
  chatId: Types.ObjectId;
  type: 'text' | 'file' | 'system';
  status: 'sent' | 'delivered' | 'read';
  fileUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  metadata?: any;
}

export interface ChatDocument extends Document {
  participants: Types.ObjectId[];
  type: 'direct' | 'group' | 'support';
  title?: string | null;
  lastMessage?: Types.ObjectId | null;
  unreadCount: Map<string, number>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatbotConversationDocument extends Document {
  userId: Types.ObjectId;
  messages: {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    metadata?: any;
  }[];
  context: 'onboarding' | 'support' | 'skill_assessment';
  status: 'active' | 'completed' | 'abandoned';
  extractedData: {
    skills: string[];
    hobbies: string[];
    experience: any[];
    aboutMe: string;
    preferences: any;
  };
  completedAt?: Date | null;
}

const MessageSchema = new Schema<MessageDocument>({
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [2000, 'Message content cannot exceed 2000 characters'],
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender ID is required'],
  },
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient ID is required'],
  },
  chatId: {
    type: Schema.Types.ObjectId,
    ref: 'Chat',
    required: [true, 'Chat ID is required'],
  },
  type: {
    type: String,
    enum: ['text', 'file', 'system'],
    default: 'text',
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
  },
  fileUrl: {
    type: String,
    default: null,
  },
  fileName: {
    type: String,
    default: null,
  },
  fileSize: {
    type: Number,
    min: [0, 'File size cannot be negative'],
    default: null,
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

const ChatSchema = new Schema<ChatDocument>({
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  type: {
    type: String,
    enum: ['direct', 'group', 'support'],
    default: 'direct',
  },
  title: {
    type: String,
    maxlength: [100, 'Chat title cannot exceed 100 characters'],
    default: null,
  },
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    default: null,
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map(),
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const ChatbotMessageSchema = new Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: [2000, 'Message content cannot exceed 2000 characters'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, { _id: false });

const ChatbotConversationSchema = new Schema<ChatbotConversationDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  messages: [ChatbotMessageSchema],
  context: {
    type: String,
    enum: ['onboarding', 'support', 'skill_assessment'],
    required: [true, 'Context is required'],
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active',
  },
  extractedData: {
    skills: [{ type: String }],
    hobbies: [{ type: String }],
    experience: [{ type: Schema.Types.Mixed }],
    aboutMe: { type: String, default: '' },
    preferences: { type: Schema.Types.Mixed, default: {} },
  },
  completedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Indexes for efficient querying
MessageSchema.index({ chatId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1 });
MessageSchema.index({ recipientId: 1 });
MessageSchema.index({ status: 1 });

ChatSchema.index({ participants: 1 });
ChatSchema.index({ type: 1 });
ChatSchema.index({ isActive: 1 });
ChatSchema.index({ updatedAt: -1 });

ChatbotConversationSchema.index({ userId: 1 });
ChatbotConversationSchema.index({ context: 1 });
ChatbotConversationSchema.index({ status: 1 });
ChatbotConversationSchema.index({ createdAt: -1 });

// Pre-save middleware for Chat to update lastMessage
ChatSchema.pre('save', async function(next) {
  if (this.isModified('lastMessage')) {
    this.updatedAt = new Date();
  }
  next();
});

// Pre-save middleware for ChatbotConversation
ChatbotConversationSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

export const Message = mongoose.models.Message || mongoose.model<MessageDocument>('Message', MessageSchema);
export const Chat = mongoose.models.Chat || mongoose.model<ChatDocument>('Chat', ChatSchema);
export const ChatbotConversation = mongoose.models.ChatbotConversation || mongoose.model<ChatbotConversationDocument>('ChatbotConversation', ChatbotConversationSchema);

export default Message;
