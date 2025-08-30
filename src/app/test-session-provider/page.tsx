'use client';

import { SessionProvider } from 'next-auth/react';
import { useState, useEffect } from 'react';

function TestComponent() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    console.log('TestComponent mounted');
  }, []);

  if (!mounted) {
    return <div>Loading test component...</div>;
  }

  return (
    <div>
      <h2>Test Component Inside SessionProvider</h2>
      <p>Mounted: {mounted.toString()}</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  );
}

export default function TestSessionProviderPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    console.log('Main component mounted');
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'black', 
      color: 'white', 
      padding: '20px'
    }}>
      <h1>SessionProvider Test</h1>
      <p>Main mounted: {mounted.toString()}</p>
      
      <div style={{ backgroundColor: '#333', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h3>Without SessionProvider:</h3>
        <TestComponent />
      </div>

      <div style={{ backgroundColor: '#333', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h3>With SessionProvider:</h3>
        <SessionProvider>
          <TestComponent />
        </SessionProvider>
      </div>
    </div>
  );
}
