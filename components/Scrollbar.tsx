'use client';
import React, { useState, useEffect, useRef } from 'react';

// --- Reusable ScrollProgressBar Component ---
// This component creates a vertical bar on the left of the screen that tracks scroll progress.
// It appears when scrolling and fades out after a period of inactivity.
export const ScrollProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [animationState, setAnimationState] = useState('hidden');
  const restingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hiddenTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Make the bar visible and reset timeouts
      setAnimationState('visible');
      if (restingTimeoutRef.current) {
        clearTimeout(restingTimeoutRef.current);
      }
      if (hiddenTimeoutRef.current) {
        clearTimeout(hiddenTimeoutRef.current);
      }

      // Set timeouts to hide the bar after a period of inactivity
      restingTimeoutRef.current = setTimeout(() => setAnimationState('resting'), 1500);
      hiddenTimeoutRef.current = setTimeout(() => setAnimationState('hidden'), 3000);

      // Calculate scroll progress
      const totalHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    // Add and clean up the scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (restingTimeoutRef.current) {
        clearTimeout(restingTimeoutRef.current);
      }
      if (hiddenTimeoutRef.current) {
        clearTimeout(hiddenTimeoutRef.current);
      }
    };
  }, []);

  // Determines the CSS classes based on the current animation state
  const getAnimationClasses = () => {
    switch (animationState) {
      case 'visible':
        return 'translate-x-[6px] opacity-100'; // Slides in slightly
      case 'resting':
        return 'translate-x-0 opacity-100'; // Sits flush with the edge
      case 'hidden':
      default:
        return '-translate-x-full opacity-0'; // Hidden off-screen
    }
  };

  return (
    <div
      data-scroll-progress
      className={`fixed top-1/2 left-0 h-1/3 w-1.5 bg-white/30 backdrop-blur-sm rounded-none z-50 transition-all duration-700 ease-in-out transform -translate-y-1/2 ${getAnimationClasses()}`}
    >
      <div
        className="w-full bg-black/60 rounded-none"
        style={{ height: `${scrollProgress}%` }}
      ></div>
    </div>
  );
};

// --- Reusable PageLayout Component (for demonstration) ---
// This component wraps page content and includes the ScrollProgressBar
export const ScrollLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
          .font-sans { font-family: 'Inter', sans-serif; }
          /* Prevents overscroll bounce effect on some browsers */
          html, body { overscroll-behavior: contain; }
      `}</style>
      <ScrollProgressBar />
      <div className="font-sans">{children}</div>
    </>
  );
};
