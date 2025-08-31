'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Send, Bot, User, AlertCircle, Sparkles, RotateCcw } from 'lucide-react';
import { getPersonalizedGreeting, analyzeProfileCompletion, ProfileData } from '@/lib/profile-analysis';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotOnboardingProps {
  onComplete?: (extractedData: any) => void;
}

export default function ChatbotOnboarding({ onComplete }: ChatbotOnboardingProps) {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forceShow, setForceShow] = useState(true); // Show immediately
  const [conversationLoaded, setConversationLoaded] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Storage keys
  const getStorageKey = () => {
    const userId = session?.user?.id || session?.user?.email || 'anonymous';
    return `chatbot_conversation_${userId}`;
  };
  
  // Save messages to localStorage
  const saveConversation = (messages: Message[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(getStorageKey(), JSON.stringify(messages));
      } catch (error) {
        console.warn('Failed to save conversation:', error);
      }
    }
  };
  
  // Load messages from localStorage
  const loadConversation = (): Message[] => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(getStorageKey());
        if (saved) {
          const parsed = JSON.parse(saved);
          // Convert timestamp strings back to Date objects
          return parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        }
      } catch (error) {
        console.warn('Failed to load conversation:', error);
      }
    }
    return [];
  };
  
  // Clear conversation from storage
  const clearConversation = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(getStorageKey());
      } catch (error) {
        console.warn('Failed to clear conversation:', error);
      }
    }
  };
  
  // Mark as client-side for hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load saved conversation when client is ready
  useEffect(() => {
    if (isClient && !conversationLoaded) {
      const savedMessages = loadConversation();
      if (savedMessages.length > 0) {
        setMessages(savedMessages);
      } else if ((session?.user) || forceShow) {
        // Only show initial greeting if no saved conversation
        // Fetch user profile for personalized greeting
        const getInitialGreeting = async () => {
          if (session?.user?.id) {
            try {
              const response = await fetch('/api/portfolio', {
                credentials: 'include'
              });
              
              if (response.ok) {
                const portfolioData = await response.json();
                const profileData: ProfileData = {
                  name: portfolioData.name,
                  bio: portfolioData.bio,
                  education: portfolioData.education,
                  experience: portfolioData.experience,
                  skills: portfolioData.skills,
                  projects: portfolioData.projects,
                  certifications: portfolioData.certifications,
                  achievements: portfolioData.achievements,
                  goals: portfolioData.goals,
                  hobbies: portfolioData.hobbies,
                  contactInfo: portfolioData.contactInfo,
                  completionPercentage: portfolioData.completionPercentage
                };
                
                const analysis = analyzeProfileCompletion(profileData);
                return getPersonalizedGreeting(profileData, analysis);
              }
            } catch (error) {
              console.warn('Failed to fetch profile for greeting:', error);
            }
          }
          
          // Fallback greeting
          return `Hi ${session?.user?.name ? session.user.name : 'there'}! I'm here to help you create an amazing professional profile. Let's start by getting to know you better - what's your full name and what type of work do you do?`;
        };
        
        getInitialGreeting().then(greeting => {
          const initialMessages = [{
            role: 'assistant' as const,
            content: greeting,
            timestamp: new Date(),
          }];
          
          setMessages(initialMessages);
          saveConversation(initialMessages);
        });
      }
      setConversationLoaded(true);
    }
  }, [session, isClient, forceShow, conversationLoaded]);

  // Save messages whenever they change
  useEffect(() => {
    if (conversationLoaded && messages.length > 0) {
      saveConversation(messages);
    }
  }, [messages, conversationLoaded]);

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user' as const,
      content: currentMessage,
      timestamp: new Date(),
    };

    const messageToSend = currentMessage;
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: messageToSend,
          conversationHistory: messages.slice(-10) // Send last 10 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      const botMessage = {
        role: 'assistant' as const,
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      onComplete?.(data.extractedData);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
      const errorMessage = {
        role: 'assistant' as const,
        content: "Looks like I&apos;m having trouble responding right now. Try again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClearConversation = () => {
    if (confirm('Are you sure you want to clear the conversation? This will start fresh.')) {
      clearConversation();
      setMessages([]);
      setConversationLoaded(false);
      // This will trigger the useEffect to show the initial greeting again
    }
  };

  if (!isClient) {
    return (
      <div className="group relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25"></div>
        <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-3xl p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-300">Loading your AI career guide...</p>
        </div>
      </div>
    );
  }

  if (!session?.user && !forceShow) {
    return (
      <div className="group relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25"></div>
        <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-3xl p-8 text-center">
          <Bot className="w-12 h-12 mx-auto mb-4 text-blue-400" />
          <p className="text-gray-300 mb-4">Please sign in to start chatting with your AI career guide</p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/auth/login'}
              className="block w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              Sign In
            </button>
            <button 
              onClick={() => setForceShow(true)}
              className="block w-full px-6 py-3 bg-gray-600 text-white rounded-2xl hover:bg-gray-500 transition-all duration-300 font-semibold text-sm"
            >
              Try Demo (No Account)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
      
      {/* Main Container */}
      <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-700">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Career Guide
            </h2>
            <p className="text-gray-300 text-sm">Let&apos;s build your professional profile together</p>
          </div>
          {messages.length > 1 && (
            <button
              onClick={handleClearConversation}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center gap-2"
              title="Clear conversation and start fresh"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Clear</span>
            </button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300">{error}</span>
          </div>
        )}

        {/* Messages Container */}
        <div className="h-80 overflow-y-auto mb-6 space-y-4 p-6 bg-black/50 rounded-2xl border border-gray-700/50">
          {/* Welcome Message */}
          {messages.length === 0 && (session?.user || forceShow) && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-300 text-lg mb-2">Welcome to your AI Career Guide!</p>
              <p className="text-gray-400 text-sm">Start chatting to build your professional profile</p>
              {forceShow && !session?.user && (
                <p className="text-yellow-400 text-xs mt-2">Demo mode - Sign in for full features</p>
              )}
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex items-start gap-3 max-w-md ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-black/40 border border-gray-600 text-gray-100 shadow-lg'
                  }`}
                >
                  <p className="leading-relaxed">{message.content}</p>
                  <span className={`text-xs mt-2 block ${
                    message.role === 'user' ? 'text-blue-100/80' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-black/40 border border-gray-600 p-4 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-4">
          <input
            ref={inputRef}
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-6 py-4 bg-black/30 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!currentMessage.trim() || isLoading}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 transition-all duration-300 transform hover:scale-105 font-semibold"
          >
            <Send className="w-5 h-5" />
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
