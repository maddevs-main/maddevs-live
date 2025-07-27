import type { Metadata } from "next";
import "./globals.css";
import StyledComponentsRegistry from '../lib/registry';
import dynamic from 'next/dynamic';
import GsapSmoothScroll from '../components/GsapSmoothScroll';

// Lazy load components
const NavBar = dynamic(() => import('../components/NavBar'), {
  loading: () => <div className="h-16 bg-gray-100 animate-pulse" />,
  ssr: true
});

const FooterWrapper = dynamic(() => import("@/components/FooterWrapper"), {
  loading: () => <div className="h-32 bg-gray-100 animate-pulse" />,
  ssr: true
});

const NavigationProgressWrapper = dynamic(() => import('../components/NavigationProgressWrapper'), {
  ssr: true
});

export const metadata = {
  title: {
    template: '%s | SITE NAME HERE',
    default: 'SITE NAME HERE',
  },
  description: 'SITE DESCRIPTION HERE',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <StyledComponentsRegistry>
          <GsapSmoothScroll />
         
          <NavBar />
          <NavigationProgressWrapper />
          {children}
          <FooterWrapper />
        </StyledComponentsRegistry>
        <style>{`.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }`}</style>
      </body>
    </html>
  );
}