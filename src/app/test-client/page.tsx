'use client';

import { useState, useEffect } from 'react';

export default function TestClientPage() {
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'black', 
        color: 'white', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>Mounting...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'black', 
      color: 'white', 
      padding: '20px'
    }}>
      <h1>Client-Side Test Page</h1>
      <div style={{ backgroundColor: '#333', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <p><strong>Mounted:</strong> {mounted.toString()}</p>
        <p><strong>Count:</strong> {count}</p>
        <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
        
        <button 
          onClick={() => setCount(count + 1)}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#0066cc', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Increment Count
        </button>
      </div>
    </div>
  );
}
