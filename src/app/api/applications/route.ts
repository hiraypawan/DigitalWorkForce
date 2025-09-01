import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

// Mock database
const mockApplications = [
  {
    id: '1',
    userId: 'user-1',
    projectTitle: 'Full-Stack E-commerce Platform',
    company: 'TechCorp Solutions',
    status: 'pending',
    appliedDate: '2024-01-15T08:00:00Z',
    budget: '$5,000 - $8,000',
    location: 'Remote',
    projectType: 'Web Development',
    description: 'Build a modern e-commerce platform with React, Node.js, and PostgreSQL.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    priority: 'high',
    deadline: '2024-02-15T00:00:00Z',
    messages: 3,
    lastUpdate: '2024-01-18T10:30:00Z'
  },
  {
    id: '2',
    userId: 'user-1',
    projectTitle: 'Mobile App for Healthcare',
    company: 'HealthTech Inc',
    status: 'reviewed',
    appliedDate: '2024-01-12T09:00:00Z',
    budget: '$3,000 - $5,000',
    location: 'New York, NY',
    projectType: 'Mobile Development',
    description: 'Develop a mobile app for patient management and appointment scheduling.',
    skills: ['React Native', 'Firebase', 'Healthcare APIs'],
    priority: 'medium',
    deadline: '2024-01-30T00:00:00Z',
    messages: 7,
    lastUpdate: '2024-01-17T16:45:00Z'
  },
  {
    id: '3',
    userId: 'user-1',
    projectTitle: 'AI Chatbot Integration',
    company: 'StartupXYZ',
    status: 'accepted',
    appliedDate: '2024-01-10T11:00:00Z',
    budget: '$2,000 - $3,500',
    location: 'Remote',
    projectType: 'AI/ML',
    description: 'Integrate an AI chatbot into existing website using OpenAI API.',
    skills: ['Python', 'OpenAI API', 'JavaScript', 'Flask'],
    priority: 'high',
    deadline: '2024-01-25T00:00:00Z',
    messages: 12,
    lastUpdate: '2024-01-19T14:20:00Z'
  },
  {
    id: '4',
    userId: 'user-1',
    projectTitle: 'WordPress Plugin Development',
    company: 'Digital Agency Pro',
    status: 'rejected',
    appliedDate: '2024-01-08T15:00:00Z',
    budget: '$800 - $1,200',
    location: 'Remote',
    projectType: 'WordPress',
    description: 'Create a custom WordPress plugin for SEO optimization.',
    skills: ['PHP', 'WordPress', 'MySQL', 'JavaScript'],
    priority: 'low',
    messages: 2,
    lastUpdate: '2024-01-14T09:00:00Z'
  },
  {
    id: '5',
    userId: 'user-1',
    projectTitle: 'Data Analytics Dashboard',
    company: 'Analytics Pro',
    status: 'completed',
    appliedDate: '2023-12-15T10:00:00Z',
    budget: '$4,500 - $6,000',
    location: 'San Francisco, CA',
    projectType: 'Data Science',
    description: 'Build an interactive dashboard for business intelligence and data visualization.',
    skills: ['Python', 'Tableau', 'SQL', 'D3.js'],
    priority: 'medium',
    messages: 18,
    lastUpdate: '2024-01-05T12:00:00Z'
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
    const sortBy = searchParams.get('sortBy') || 'date';

    let applications = mockApplications;

    // Filter by status
    if (status && status !== 'all') {
      applications = applications.filter(app => app.status === status);
    }

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      applications = applications.filter(app =>
        app.projectTitle.toLowerCase().includes(searchLower) ||
        app.company.toLowerCase().includes(searchLower) ||
        app.projectType.toLowerCase().includes(searchLower)
      );
    }

    // Sort applications
    applications = [...applications].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
        default:
          return 0;
      }
    });

    // Calculate statistics
    const stats = {
      total: mockApplications.length,
      pending: mockApplications.filter(app => app.status === 'pending').length,
      reviewed: mockApplications.filter(app => app.status === 'reviewed').length,
      accepted: mockApplications.filter(app => app.status === 'accepted').length,
      rejected: mockApplications.filter(app => app.status === 'rejected').length,
      completed: mockApplications.filter(app => app.status === 'completed').length
    };

    return NextResponse.json({
      applications,
      stats,
      success: true
    });
  } catch (error) {
    console.error('Applications API error:', error);
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
    const { projectId, coverLetter, proposedBudget, timeline } = body;

    // Create new application
    const newApplication = {
      id: Date.now().toString(),
      userId: session.user.id || 'user-1',
      projectId,
      status: 'pending',
      appliedDate: new Date().toISOString(),
      coverLetter,
      proposedBudget,
      timeline,
      messages: 0,
      lastUpdate: new Date().toISOString()
    };

    // In a real app, save to database
    console.log('Creating new application:', newApplication);

    return NextResponse.json({
      application: newApplication,
      success: true,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Create application error:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { applicationId, status, notes } = body;

    // In a real app, update in database
    console.log('Updating application:', applicationId, { status, notes });

    return NextResponse.json({
      success: true,
      message: 'Application updated successfully'
    });
  } catch (error) {
    console.error('Update application error:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
