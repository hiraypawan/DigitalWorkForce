'use client';

import { useSession } from 'next-auth/react';

export default function MinimalOnboardingPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'black', 
        color: 'white', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'black', 
        color: 'white', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div>Not authenticated</div>
        <a 
          href="/auth/login?from=/onboarding-minimal"
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#0066cc', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px'
          }}
        >
          Login
        </a>
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
      <h1>Minimal Onboarding Test</h1>
      <div style={{ backgroundColor: '#333', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h2>Client-Side Session Information</h2>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Name:</strong> {session?.user?.name || 'Unknown'}</p>
        <p><strong>Email:</strong> {session?.user?.email || 'Unknown'}</p>
        <p><strong>ID:</strong> {session?.user?.id || 'Unknown'}</p>
        <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => window.location.href = '/onboarding'}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#0066cc', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            marginRight: '10px',
            cursor: 'pointer'
          }}
        >
          Go to Full Onboarding
        </button>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#009900', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
