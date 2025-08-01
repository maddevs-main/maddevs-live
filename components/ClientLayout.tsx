'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { useNavigationProgress } from '../hooks/useNavigationProgress';

// Lazy load components
const NavBar = dynamic(() => import('./NavBar'), {
  loading: () => <div className="h-16 bg-gray-100 animate-pulse" />,
  ssr: true,
});

const FooterWrapper = dynamic(() => import('./FooterWrapper'), {
  loading: () => <div className="h-32 bg-gray-100 animate-pulse" />,
  ssr: true,
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useNavigationProgress();

  return (
    <>
      <NavBar />
      {children}
      <FooterWrapper />
    </>
  );
}
