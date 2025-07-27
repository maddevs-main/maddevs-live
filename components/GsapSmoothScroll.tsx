"use client";
import { useEffect } from 'react';

export default function GsapSmoothScroll() {
  useEffect(() => {
    (async () => {
      if (typeof window !== 'undefined') {
        const gsap = (await import('gsap')).default;
        const { ScrollSmoother } = await import('../public/gsap-public/esm/ScrollSmoother.js');
        gsap.registerPlugin(ScrollSmoother);
        if (!ScrollSmoother.get()) {
          ScrollSmoother.create({
            smooth: 1.2,
            effects: true,
            normalizeScroll: true,
            ignoreMobileResize: true,
            preventDefault: true,
            smoothTouch: 0.1,
          });
        }
      }
    })();
  }, []);
  return null;
} 