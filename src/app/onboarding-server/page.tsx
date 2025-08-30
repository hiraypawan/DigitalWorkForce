export default async function ServerOnboardingPage() {
  let sessionData = 'Testing NextAuth...';
  let error = null;
  
  try {
    // Try importing NextAuth dynamically to see if there's an issue
    const { getServerSession } = await import('next-auth/next');
    const { authOptions } = await import('@/lib/auth-config');
    
    const session = await getServerSession(authOptions);
    sessionData = session ? JSON.stringify(session, null, 2) : 'No session found';
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error';
    sessionData = 'Error loading NextAuth';
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
        <h2>NextAuth Test</h2>
        <p><strong>Status:</strong> {error ? 'Error' : 'Success'}</p>
        {error && <p><strong>Error:</strong> {error}</p>}
        <div><strong>Session Data:</strong></div>
        <pre style={{ backgroundColor: '#222', padding: '10px', borderRadius: '4px', marginTop: '10px', fontSize: '12px', whiteSpace: 'pre-wrap' }}>
          {sessionData}
        </pre>
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
