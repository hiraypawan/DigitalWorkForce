import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

// Mock database
const mockConversations = [
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
        content: 'Hi Sarah, thank you for considering my proposal. I\'m excited to work on your e-commerce platform.',
        timestamp: '2024-01-20T09:00:00Z',
        type: 'text',
        status: 'read'
      },
      {
        id: '2',
        senderId: '101',
        senderName: 'Sarah Johnson',
        content: 'Hi! I\'ve reviewed your proposal and I\'m impressed with your portfolio. The timeline looks good.',
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
        content: 'Hi Michael! Yes, I\'m very interested in this project. I have experience with healthcare APIs and HIPAA compliance.',
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
    messages: [
      {
        id: '1',
        senderId: '104',
        senderName: 'David Kim',
        content: 'The project has been delivered successfully. Great work!',
        timestamp: '2024-01-15T09:30:00Z',
        type: 'text',
        status: 'read'
      },
      {
        id: '2',
        senderId: '104',
        senderName: 'David Kim',
        content: 'Thanks for the excellent work! Would love to collaborate again.',
        timestamp: '2024-01-15T10:00:00Z',
        type: 'text',
        status: 'read'
      }
    ]
  }
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const conversationId = searchParams.get('conversationId');

    // If requesting a specific conversation
    if (conversationId) {
      const conversation = mockConversations.find(conv => conv.id === conversationId);
      if (!conversation) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
      }
      return NextResponse.json({ conversation, success: true });
    }

    let conversations = mockConversations;

    // Filter by status
    if (status && status !== 'all') {
      conversations = conversations.filter(conv => conv.status === status);
    }

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      conversations = conversations.filter(conv =>
        conv.participantName.toLowerCase().includes(searchLower) ||
        conv.projectTitle?.toLowerCase().includes(searchLower) ||
        conv.lastMessage.content.toLowerCase().includes(searchLower)
      );
    }

    // Sort by last message timestamp
    conversations = [...conversations].sort((a, b) =>
      new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
    );

    // Calculate statistics
    const stats = {
      total: mockConversations.length,
      unread: mockConversations.reduce((total, conv) => total + conv.unreadCount, 0),
      active: mockConversations.filter(conv => conv.status === 'active').length,
      archived: mockConversations.filter(conv => conv.status === 'archived').length
    };

    return NextResponse.json({
      conversations,
      stats,
      success: true
    });
  } catch (error) {
    console.error('Messages API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, content, type = 'text', fileName, fileUrl } = body;

    if (!conversationId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create new message
    const newMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: session.user.name || 'You',
      content,
      timestamp: new Date().toISOString(),
      type,
      status: 'sent',
      fileName,
      fileUrl
    };

    // In a real app, save to database and update conversation
    console.log('Creating new message:', newMessage);

    // Simulate message delivery
    setTimeout(() => {
      console.log('Message delivered:', newMessage.id);
    }, 1000);

    return NextResponse.json({
      message: newMessage,
      success: true
    });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, action, messageId } = body;

    if (!conversationId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    switch (action) {
      case 'mark_read':
        console.log('Marking conversation as read:', conversationId);
        break;
      case 'archive':
        console.log('Archiving conversation:', conversationId);
        break;
      case 'delete':
        console.log('Deleting conversation:', conversationId);
        break;
      case 'mark_message_read':
        console.log('Marking message as read:', messageId);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Action completed successfully'
    });
  } catch (error) {
    console.error('Update message error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
