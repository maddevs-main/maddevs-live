// components/FooterWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

export default function FooterWrapper() {
  const pathname = usePathname();

  const hideFooterRoutes = ['/works', '/products', '/about', '/estimateace', '/services'];
   // add more if needed

  if (hideFooterRoutes.includes(pathname)) {
    return null;
  }

  return <Footer />;
}