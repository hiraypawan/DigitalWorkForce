import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { dbConnect } from '@/lib/mongodb';
import Portfolio from '@/models/Portfolio';

// GET /api/portfolio/export - Export portfolio in different formats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    
    // Get session using NextAuth
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const portfolio = await Portfolio.findOne({ userId });
    
    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    switch (format) {
      case 'json':
        // Return clean portfolio data for JSON download
        const cleanPortfolio = {
          name: portfolio.name,
          bio: portfolio.bio,
          education: portfolio.education,
          experience: portfolio.experience,
          skills: portfolio.skills,
          projects: portfolio.projects,
          certifications: portfolio.certifications,
          achievements: portfolio.achievements,
          goals: portfolio.goals,
          hobbies: portfolio.hobbies,
          contactInfo: portfolio.contactInfo,
          completionPercentage: portfolio.completionPercentage,
          lastUpdated: portfolio.lastUpdated
        };
        return NextResponse.json(cleanPortfolio);

      case 'link':
        // Generate a shareable link
        const shareableId = portfolio._id.toString();
        const shareLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/portfolio/view/${shareableId}`;
        return NextResponse.json({ link: shareLink });

      case 'pdf':
        // For now, return the data that can be used to generate PDF on frontend
        // In a production app, you'd use a PDF generation library here
        return NextResponse.json({
          message: 'PDF generation not implemented yet',
          data: portfolio
        });

      default:
        return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

  } catch (error) {
    console.error('Portfolio export error:', error);
    return NextResponse.json({ error: 'Failed to export portfolio' }, { status: 500 });
  }
}
