'use client';
import { useEffect } from 'react';
import { useProgressBar } from '../components/ProgressBarContext';

export function useNavigationProgress() {
  const { start, finish } = useProgressBar();

  useEffect(() => {
    let currentPath = window.location.pathname;
    let timeoutId: NodeJS.Timeout;

    const checkRouteChange = () => {
      if (window.location.pathname !== currentPath) {
        start();
        currentPath = window.location.pathname;

        // Finish after a short delay to simulate loading
        timeoutId = setTimeout(() => {
          finish();
        }, 800);
      }
    };

    // Check for route changes every 100ms
    const interval = setInterval(checkRouteChange, 100);

    // Also listen for clicks on any link
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href && !link.href.includes('#') && !link.target) {
        const url = new URL(link.href);
        if (url.origin === window.location.origin) {
          start();
        }
      }
    };

    // Listen for programmatic navigation (router.push)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(history, args);
      start();
      timeoutId = setTimeout(finish, 800);
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args);
      start();
      timeoutId = setTimeout(finish, 800);
    };

    document.addEventListener('click', handleClick);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClick);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [start, finish]);
}
