'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
  MessageSquare,
  Send,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Phone,
  Video,
  Info,
  Archive,
  Trash2,
  Star,
  Circle,
  CheckCircle2,
  User,
  Clock,
  Filter,
  Plus,
  X,
  Building,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image' | 'system';
  status: 'sent' | 'delivered' | 'read';
  fileUrl?: string;
  fileName?: string;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  participantRole: 'client' | 'freelancer';
  participantCompany?: string;
  projectTitle?: string;
  lastMessage: {
    content: string;
    timestamp: string;
    senderId: string;
  };
  unreadCount: number;
  status: 'active' | 'archived' | 'closed';
  priority: 'low' | 'medium' | 'high';
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    participantId: '101',
    participantName: 'Sarah Johnson',
    participantRole: 'client',
    participantCompany: 'TechCorp Solutions',
    projectTitle: 'Full-Stack E-commerce Platform',
    lastMessage: {
      content: 'Great! When can we schedule a call to discuss the requirements?',
      timestamp: '2024-01-20T10:30:00Z',
      senderId: '101'
    },
    unreadCount: 2,
    status: 'active',
    priority: 'high',
    messages: [
      {
        id: '1',
        senderId: 'user',
        senderName: 'You',
        content: 'Hi Sarah, thank you for considering my proposal. I&apos;m excited to work on your e-commerce platform.',
        timestamp: '2024-01-20T09:00:00Z',
        type: 'text',
        status: 'read'
      },
      {
        id: '2',
        senderId: '101',
        senderName: 'Sarah Johnson',
        content: 'Hi! I&apos;ve reviewed your proposal and I&apos;m impressed with your portfolio. The timeline looks good.',
        timestamp: '2024-01-20T09:15:00Z',
        type: 'text',
        status: 'read'
      },
      {
        id: '3',
        senderId: '101',
        senderName: 'Sarah Johnson',
        content: 'Great! When can we schedule a call to discuss the requirements?',
        timestamp: '2024-01-20T10:30:00Z',
        type: 'text',
        status: 'delivered'
      }
    ]
  },
  {
    id: '2',
    participantId: '102',
    participantName: 'Michael Chen',
    participantRole: 'client',
    participantCompany: 'HealthTech Inc',
    projectTitle: 'Mobile App for Healthcare',
    lastMessage: {
      content: 'Please find the design mockups attached.',
      timestamp: '2024-01-19T16:45:00Z',
      senderId: '102'
    },
    unreadCount: 1,
    status: 'active',
    priority: 'medium',
    messages: [
      {
        id: '1',
        senderId: '102',
        senderName: 'Michael Chen',
        content: 'Hello! I saw your application for the healthcare mobile app project.',
        timestamp: '2024-01-19T14:00:00Z',
        type: 'text',
        status: 'read'
      },
      {
        id: '2',
        senderId: 'user',
        senderName: 'You',
        content: 'Hi Michael! Yes, I&apos;m very interested in this project. I have experience with healthcare APIs and HIPAA compliance.',
        timestamp: '2024-01-19T14:30:00Z',
        type: 'text',
        status: 'read'
      },
      {
        id: '3',
        senderId: '102',
        senderName: 'Michael Chen',
        content: 'Please find the design mockups attached.',
        timestamp: '2024-01-19T16:45:00Z',
        type: 'file',
        status: 'delivered',
        fileName: 'healthcare-app-mockups.pdf'
      }
    ]
  },
  {
    id: '3',
    participantId: '103',
    participantName: 'Emily Rodriguez',
    participantRole: 'client',
    participantCompany: 'StartupXYZ',
    projectTitle: 'AI Chatbot Integration',
    lastMessage: {
      content: 'Perfect! The chatbot is working great. Final payment sent.',
      timestamp: '2024-01-18T12:00:00Z',
      senderId: '103'
    },
    unreadCount: 0,
    status: 'active',
    priority: 'low',
    messages: [
      {
        id: '1',
        senderId: '103',
        senderName: 'Emily Rodriguez',
        content: 'The project has been completed successfully!',
        timestamp: '2024-01-18T11:30:00Z',
        type: 'text',
        status: 'read'
      },
      {
        id: '2',
        senderId: '103',
        senderName: 'Emily Rodriguez',
        content: 'Perfect! The chatbot is working great. Final payment sent.',
        timestamp: '2024-01-18T12:00:00Z',
        type: 'text',
        status: 'read'
      }
    ]
  },
  {
    id: '4',
    participantId: '104',
    participantName: 'David Kim',
    participantRole: 'client',
    participantCompany: 'Analytics Pro',
    projectTitle: 'Data Analytics Dashboard',
    lastMessage: {
      content: 'Thanks for the excellent work! Would love to collaborate again.',
      timestamp: '2024-01-15T10:00:00Z',
      senderId: '104'
    },
    unreadCount: 0,
    status: 'archived',
    priority: 'low',
    messages: []
  }
];

export default function MessagesPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'archived'>('all');
  const [showConversationInfo, setShowConversationInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation?.messages]);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || conv.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: 'You',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
      status: 'sent'
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: {
            content: newMessage,
            timestamp: message.timestamp,
            senderId: 'user'
          }
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, message],
      lastMessage: {
        content: newMessage,
        timestamp: message.timestamp,
        senderId: 'user'
      }
    } : null);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getTotalUnreadCount = () => {
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex h-screen">
        {/* Sidebar - Conversations List */}
        <div className="w-96 bg-gray-900/50 backdrop-blur border-r border-gray-800 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Messages</h1>
                  {getTotalUnreadCount() > 0 && (
                    <p className="text-sm text-blue-400">{getTotalUnreadCount()} unread</p>
                  )}
                </div>
              </div>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              {(['all', 'active', 'archived'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800/50 transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-gray-800/70' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      {conversation.priority === 'high' && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-white truncate">{conversation.participantName}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white">{conversation.unreadCount}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400 truncate">{conversation.participantCompany}</span>
                      </div>
                      
                      {conversation.projectTitle && (
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-blue-400 truncate">{conversation.projectTitle}</span>
                        </div>
                      )}
                      
                      <p className="text-sm text-gray-300 truncate">{conversation.lastMessage.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-gray-900/50 backdrop-blur border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">{selectedConversation.participantName}</h2>
                    <p className="text-sm text-gray-400">{selectedConversation.participantCompany}</p>
                  </div>
                  {selectedConversation.projectTitle && (
                    <div className="ml-4 px-3 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full border border-blue-800">
                      {selectedConversation.projectTitle}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowConversationInfo(!showConversationInfo)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex items-start gap-3 max-w-md ${
                        message.senderId === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      {message.senderId !== 'user' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      <div
                        className={`p-4 rounded-2xl ${
                          message.senderId === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-100'
                        }`}
                      >
                        {message.type === 'file' && (
                          <div className="flex items-center gap-2 mb-2">
                            <Paperclip className="w-4 h-4" />
                            <span className="text-sm">{message.fileName}</span>
                          </div>
                        )}
                        <p className="leading-relaxed">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-70">
                            {formatTime(message.timestamp)}
                          </span>
                          {message.senderId === 'user' && (
                            <div className="flex items-center gap-1">
                              {message.status === 'sent' && <Circle className="w-3 h-3" />}
                              {message.status === 'delivered' && <CheckCircle2 className="w-3 h-3" />}
                              {message.status === 'read' && <CheckCircle2 className="w-3 h-3 text-blue-400" />}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-gray-900/50 backdrop-blur border-t border-gray-800">
                <div className="flex items-end gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="w-full px-4 py-3 pr-20 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={1}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                        <Paperclip className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                        <Smile className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Empty State
            <div className="flex-1 flex items-center justify-center text-center">
              <div className="max-w-md">
                <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-400 mb-2">Select a conversation</h2>
                <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>

        {/* Conversation Info Sidebar */}
        {showConversationInfo && selectedConversation && (
          <div className="w-80 bg-gray-900/50 backdrop-blur border-l border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Conversation Info</h3>
              <button
                onClick={() => setShowConversationInfo(false)}
                className="p-1 hover:bg-gray-800 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Participant Info */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">{selectedConversation.participantName}</h4>
                  <p className="text-sm text-gray-400">{selectedConversation.participantRole}</p>
                </div>
              </div>
              
              {selectedConversation.participantCompany && (
                <div className="flex items-center gap-2 mb-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{selectedConversation.participantCompany}</span>
                </div>
              )}
              
              {selectedConversation.projectTitle && (
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{selectedConversation.projectTitle}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <Star className="w-5 h-5" />
                <span>Add to Favorites</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <Archive className="w-5 h-5" />
                <span>Archive Conversation</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5" />
                <span>Delete Conversation</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
