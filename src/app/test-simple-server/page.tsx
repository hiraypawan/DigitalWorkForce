export default function TestSimpleServerPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'black', 
      color: 'white', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Simple Server Test</h1>
      <p>This is a basic server-side page.</p>
      <p>If you can see this, server-side rendering is working.</p>
      <p>Timestamp: {new Date().toISOString()}</p>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#333', borderRadius: '5px' }}>
        <p>Environment check:</p>
        <p>NODE_ENV: {process.env.NODE_ENV}</p>
        <p>MongoDB: {process.env.MONGODB_URI ? 'Set' : 'Not set'}</p>
        <p>NextAuth Secret: {process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set'}</p>
      </div>
    </div>
  );
}
