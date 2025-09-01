import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { dbConnect } from '@/lib/mongodb';
import Portfolio from '@/models/Portfolio';

export async function POST(request: NextRequest) {
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
    
    console.log('Original experience data:', JSON.stringify(portfolio.experience, null, 2));
    
    // Fix corrupted experience data
    let fixedCount = 0;
    
    if (portfolio.experience && Array.isArray(portfolio.experience)) {
      portfolio.experience = portfolio.experience.map((exp: any, index: number) => {
        // Check if experience is corrupted (string values instead of proper object)
        if (typeof exp === 'string' || !exp.role || !exp.company || exp.role === 'string' || exp.company === 'string') {
          console.log(`Fixing corrupted experience at index ${index}:`, exp);
          fixedCount++;
          
          // Remove this corrupted entry
          return null;
        }
        
        // Ensure all required fields exist
        return {
          role: exp.role || 'Unknown Role',
          company: exp.company || 'Unknown Company',
          duration: exp.duration || 'Unknown Duration', 
          details: exp.details || 'No details provided',
          location: exp.location || undefined,
          achievements: exp.achievements || [],
          websiteUrl: exp.websiteUrl || undefined,
          projectUrls: exp.projectUrls || []
        };
      }).filter((exp: any) => exp !== null); // Remove null entries
    }
    
    console.log('Fixed experience data:', JSON.stringify(portfolio.experience, null, 2));
    console.log(`Fixed ${fixedCount} corrupted experience records`);
    
    // Save the cleaned portfolio
    await portfolio.save();
    
    return NextResponse.json({ 
      success: true, 
      fixedCount,
      message: `Migration completed. Fixed ${fixedCount} corrupted experience records.`
    });
    
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
  }
}
