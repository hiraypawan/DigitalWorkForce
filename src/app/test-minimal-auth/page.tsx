import { authOptions } from '@/lib/auth-config';

export default function TestMinimalAuthPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'black', 
      color: 'white', 
      padding: '20px'
    }}>
      <h1>Minimal Auth Import Test</h1>
      <div style={{ backgroundColor: '#333', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <p><strong>Auth Options Imported:</strong> {authOptions ? 'Success' : 'Failed'}</p>
        <p><strong>Has Providers:</strong> {authOptions?.providers?.length || 0}</p>
        <p><strong>Session Strategy:</strong> {authOptions?.session?.strategy || 'Unknown'}</p>
        <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
      </div>
    </div>
  );
}
