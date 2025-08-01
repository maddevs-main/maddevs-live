import type { Metadata } from 'next';
import './globals.css';
import StyledComponentsRegistry from '../lib/registry';
import dynamic from 'next/dynamic';
import CustomCursor from '@/components/Cursor';
import { ScrollProgressBar } from '@/components/Scrollbar';

// Lazy load components
const NavBar = dynamic(() => import('../components/NavBar'), {
  loading: () => <div className="h-16 bg-gray-100 animate-pulse" />,
  ssr: true,
});

const FooterWrapper = dynamic(() => import('@/components/FooterWrapper'), {
  loading: () => <div className="h-32 bg-gray-100 animate-pulse" />,
  ssr: true,
});

const NavigationProgressWrapper = dynamic(() => import('../components/NavigationProgressWrapper'), {
  ssr: true,
});

export const metadata = {
  title: {
    template: '%s | maddevs - home',
    default: 'maddevs - creative web experience design & development',
  },
  description: 'creative web experience design & development | user experience & interface design',

  icons: {
    // Use your logo instead of favicon.ico
    icon: [{ url: '/logo.svg', type: 'image/svg+xml' }],
    apple: '/logo.svg',
    shortcut: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
      </head>
      <body className="antialiased">
        <StyledComponentsRegistry>
          <NavBar />
          <NavigationProgressWrapper />
          <CustomCursor />
          <ScrollProgressBar />
          {children}
          <FooterWrapper />
        </StyledComponentsRegistry>
        <style>{`.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }`}</style>
      </body>
    </html>
  );
}

//
