'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Send, Bot, User, AlertCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotOnboardingProps {
  onComplete?: (extractedData: any) => void;
}

export default function ChatbotOnboarding({ onComplete }: ChatbotOnboardingProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (session?.user) {
      // Initial greeting
      setMessages([{
        role: 'assistant',
        content: `Hi ${session.user.name || 'there'}! I'm here to help set up your profile. Let's start - what are your main skills or areas of expertise?`,
        timestamp: new Date(),
      }]);
    }
  }, [session]);

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading || !session?.user) return;

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

  if (!session?.user) {
    return (
      <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6 text-center">
        <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-400">Please sign in to start chatting with your AI career guide</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6 h-fit">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">AI Career Guide</h2>
          <p className="text-gray-400 text-sm">Let's build your professional profile together</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-red-300 text-sm">{error}</span>
        </div>
      )}

      <div className="h-80 overflow-y-auto mb-4 space-y-4 p-4 bg-black/30 rounded-xl border border-gray-700/50 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex items-start gap-3 max-w-sm ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                    : 'bg-gradient-to-r from-gray-600 to-gray-700'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`p-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-800/50 border border-gray-700 text-gray-200'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <span className={`text-xs mt-1 block ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
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
              <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-800/50 border border-gray-700 p-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-3">
        <input
          ref={inputRef}
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={!currentMessage.trim() || isLoading}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200 hover:scale-105 glow-button"
        >
          <Send className="w-4 h-4" />
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
