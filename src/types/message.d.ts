export interface Message {
  _id: string;
  content: string;
  senderId: string;
  recipientId: string;
  chatId: string;
  type: 'text' | 'file' | 'system';
  status: 'sent' | 'delivered' | 'read';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chat {
  _id: string;
  participants: string[]; // User IDs
  type: 'direct' | 'group' | 'support';
  title?: string;
  lastMessage?: Message;
  unreadCount: { [userId: string]: number };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatbotConversation {
  _id: string;
  userId: string;
  messages: ChatbotMessage[];
  context: 'onboarding' | 'support' | 'skill_assessment';
  status: 'active' | 'completed' | 'abandoned';
  extractedData: {
    skills: string[];
    hobbies: string[];
    experience: any[];
    aboutMe: string;
    preferences: any;
  };
  createdAt: Date;
  completedAt?: Date;
}

export interface ChatbotMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: any;
}

export interface NotificationMessage {
  _id: string;
  userId: string;
  title: string;
  content: string;
  type: 'task_assigned' | 'payment_received' | 'job_update' | 'system' | 'reminder';
  isRead: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  expiresAt?: Date;
  createdAt: Date;
}

export interface MessageRequest {
  content: string;
  recipientId: string;
  type?: 'text' | 'file';
  fileUrl?: string;
  fileName?: string;
}

export interface ChatSession {
  chatId: string;
  participants: string[];
  lastActivity: Date;
  isTyping: { [userId: string]: boolean };
}
