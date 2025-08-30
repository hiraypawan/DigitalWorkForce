'use client';

import { useSession } from 'next-auth/react';

export default function TestPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div>Not authenticated</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1>Test Page</h1>
      <div className="mt-4">
        <p>Status: {status}</p>
        <p>User: {session?.user?.name || 'Unknown'}</p>
        <p>Email: {session?.user?.email || 'Unknown'}</p>
        <p>ID: {session?.user?.id || 'Unknown'}</p>
      </div>
    </div>
  );
}
