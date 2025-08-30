import { dbConnect } from '@/lib/mongodb';

export default async function TestDbPage() {
  let dbStatus = 'Not tested';
  let error = null;

  try {
    await dbConnect();
    dbStatus = 'Connected successfully';
  } catch (err) {
    dbStatus = 'Failed to connect';
    error = err instanceof Error ? err.message : 'Unknown error';
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'black', 
      color: 'white', 
      padding: '20px'
    }}>
      <h1>Database Connection Test</h1>
      <div style={{ backgroundColor: '#333', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <p><strong>DB Status:</strong> {dbStatus}</p>
        {error && <p><strong>Error:</strong> {error}</p>}
        <p><strong>MongoDB URI Present:</strong> {process.env.MONGODB_URI ? 'Yes' : 'No'}</p>
        <p><strong>NextAuth Secret Present:</strong> {process.env.NEXTAUTH_SECRET ? 'Yes' : 'No'}</p>
        <p><strong>NextAuth URL:</strong> {process.env.NEXTAUTH_URL || 'Not set'}</p>
        <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
      </div>
    </div>
  );
}
