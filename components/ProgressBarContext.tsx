"use client"
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface ProgressBarContextType {
  start: () => void;
  finish: () => void;
  progress: number;
  isLoading: boolean;
}

const ProgressBarContext = createContext<ProgressBarContextType>({
  start: () => {},
  finish: () => {},
  progress: 0,
  isLoading: false,
});

export function useProgressBar() {
  return useContext(ProgressBarContext);
}

export function ProgressBarProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const start = useCallback(() => {
    setIsLoading(true);
    setProgress(0);
    let value = 0;
    const interval = setInterval(() => {
      value += Math.random() * 10;
      setProgress(Math.min(value, 90));
      if (value >= 90) clearInterval(interval);
    }, 100);
  }, []);

  const finish = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 400);
  }, []);

  // Global click listener for navigation
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && !link.href.includes('#') && !link.target) {
        const url = new URL(link.href);
        if (url.origin === window.location.origin) {
          start();
          // Finish after navigation completes
          setTimeout(finish, 800);
        }
      }
    };

    // Listen for programmatic navigation
    let currentPath = window.location.pathname;
    const checkRouteChange = () => {
      if (window.location.pathname !== currentPath) {
        start();
        currentPath = window.location.pathname;
        setTimeout(finish, 800);
      }
    };

    const interval = setInterval(checkRouteChange, 100);
    document.addEventListener('click', handleClick);

    return () => {
      clearInterval(interval);
      document.removeEventListener('click', handleClick);
    };
  }, [start, finish]);

  return (
    <ProgressBarContext.Provider value={{ start, finish, progress, isLoading }}>
      {children}
    </ProgressBarContext.Provider>
  );
} 