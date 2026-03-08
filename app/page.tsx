'use client';

import dynamic from 'next/dynamic';
import ChatInterface from '@/components/ChatInterface';

const ParticleBrain = dynamic(() => import('@/components/ParticleBrain'), {
  ssr: false,
  loading: () => <div style={{ width: '100vw', height: '100vh', background: '#000' }} />
});

export default function Home() {
  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <ParticleBrain />
      <ChatInterface />
    </main>
  );
}