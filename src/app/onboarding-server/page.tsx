import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { redirect } from 'next/navigation';

export default async function ServerOnboardingPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/login?from=/onboarding-server');
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'black', 
      color: 'white', 
      padding: '20px'
    }}>
      <h1>Server-Side Onboarding Test</h1>
      <div style={{ backgroundColor: '#333', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h2>Session Information</h2>
        <p><strong>Name:</strong> {session.user?.name || 'Unknown'}</p>
        <p><strong>Email:</strong> {session.user?.email || 'Unknown'}</p>
        <p><strong>ID:</strong> {session.user?.id || 'Unknown'}</p>
        <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <a 
          href="/onboarding" 
          style={{ 
            display: 'inline-block',
            padding: '10px 20px', 
            backgroundColor: '#0066cc', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px',
            marginRight: '10px'
          }}
        >
          Go to Client Onboarding
        </a>
        <a 
          href="/onboarding-simple" 
          style={{ 
            display: 'inline-block',
            padding: '10px 20px', 
            backgroundColor: '#cc6600', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px'
          }}
        >
          Go to Simple Onboarding
        </a>
      </div>
    </div>
  );
}
