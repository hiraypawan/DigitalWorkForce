export default async function TestAuthConfigPage() {
  let steps: { [key: string]: any } = {};
  
  try {
    steps.step1 = 'Importing NextAuth...';
    const { getServerSession } = await import('next-auth/next');
    steps.step1 = 'NextAuth imported successfully';
    
    steps.step2 = 'Checking environment variables...';
    steps.envVars = {
      mongoUri: process.env.MONGODB_URI ? 'Set' : 'Missing',
      nextauthSecret: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
      nextauthUrl: process.env.NEXTAUTH_URL || 'Not set',
    };
    steps.step2 = 'Environment variables checked';
    
    steps.step3 = 'Testing MongoDB client creation...';
    try {
      const { MongoClient } = await import('mongodb');
      if (process.env.MONGODB_URI) {
        const client = new MongoClient(process.env.MONGODB_URI);
        steps.mongoClient = 'Created successfully';
      } else {
        steps.mongoClient = 'MONGODB_URI missing';
      }
    } catch (err) {
      steps.mongoClient = err instanceof Error ? err.message : 'Unknown error';
    }
    steps.step3 = 'MongoDB client test completed';
    
    steps.step4 = 'Testing auth options import...';
    try {
      const { authOptions } = await import('@/lib/auth-config');
      steps.authOptions = 'Imported successfully';
      steps.step4 = 'Auth options imported';
    } catch (err) {
      steps.authOptions = err instanceof Error ? err.message : 'Unknown error';
      steps.step4 = 'Auth options failed';
    }
    
    steps.step5 = 'Testing getServerSession call...';
    try {
      if (steps.authOptions === 'Imported successfully') {
        const { authOptions } = await import('@/lib/auth-config');
        const session = await getServerSession(authOptions);
        steps.session = session ? 'Session found' : 'No session';
      } else {
        steps.session = 'Skipped - authOptions failed';
      }
    } catch (err) {
      steps.session = err instanceof Error ? err.message : 'Unknown error';
    }
    steps.step5 = 'Session test completed';
    
  } catch (err) {
    steps.globalError = err instanceof Error ? err.message : 'Unknown error';
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'black', 
      color: 'white', 
      padding: '20px'
    }}>
      <h1>NextAuth Configuration Test</h1>
      <div style={{ backgroundColor: '#333', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <pre style={{ 
          backgroundColor: '#222', 
          padding: '15px', 
          borderRadius: '4px', 
          fontSize: '12px', 
          whiteSpace: 'pre-wrap',
          maxHeight: '500px',
          overflow: 'auto'
        }}>
          {JSON.stringify(steps, null, 2)}
        </pre>
      </div>
    </div>
  );
}
