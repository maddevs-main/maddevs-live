'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Props {
  children: React.ReactNode;
}

export default function HorizontalScrollTease({ children }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const teaseDistance = window.innerWidth * 0.12;

    const tl = gsap.timeline({
      delay: 0.6,
      defaults: { ease: 'power2.inOut' },
    });

    tl.to(el, {
      scrollLeft: teaseDistance,
      duration: 1,
    }).to(el, {
      scrollLeft: 0,
      duration: 1.2,
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex overflow-x-auto snap-x snap-mandatory w-screen h-screen scroll-smooth no-overscroll horizontal-scroll"
    >
      {children}
    </div>
  );
}
