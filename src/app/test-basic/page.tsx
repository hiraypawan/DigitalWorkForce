export default function TestBasicPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'black', 
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '20px'
    }}>
      <h1>Basic Test Page</h1>
      <p>If you can see this, routing is working.</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  );
}
