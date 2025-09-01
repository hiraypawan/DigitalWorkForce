import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { dbConnect } from '@/lib/mongodb';
import Portfolio from '@/models/Portfolio';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    // Find user's portfolio
    const portfolio = await Portfolio.findOne({ userId });
    
    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }
    
    // Return raw portfolio data for debugging
    return NextResponse.json({
      raw_portfolio: portfolio.toObject(),
      experience_data: portfolio.experience,
      experience_count: portfolio.experience?.length || 0,
      experience_types: portfolio.experience?.map((exp: any, index: number) => ({
        index,
        type: typeof exp,
        hasRole: !!exp?.role,
        hasCompany: !!exp?.company,
        roleValue: exp?.role,
        companyValue: exp?.company,
        raw: exp
      }))
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ 
      error: 'Debug failed', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
