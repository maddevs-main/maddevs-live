"use client"
import { useEffect } from 'react';
import NProgress from 'nprogress';


export default function NavigationProgressWrapper() {
  useEffect(() => {
    // Configure NProgress
    NProgress.configure({
      showSpinner: false,
      minimum: 0.1,
      easing: 'ease',
      speed: 500,
      trickle: true,
      trickleSpeed: 200,
    });

    let currentPath = window.location.pathname;
    let timeoutId: NodeJS.Timeout;

    const checkRouteChange = () => {
      if (window.location.pathname !== currentPath) {
        NProgress.start();
        currentPath = window.location.pathname;
        
        // Complete after navigation
        timeoutId = setTimeout(() => {
          NProgress.done();
        }, 800);
      }
    };

    // Check for route changes every 100ms
    const interval = setInterval(checkRouteChange, 100);

    // Listen for clicks on any link
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && !link.href.includes('#') && !link.target) {
        const url = new URL(link.href);
        if (url.origin === window.location.origin) {
          NProgress.start();
          // Complete after navigation
          setTimeout(() => {
            NProgress.done();
          }, 800);
        }
      }
    };

    // Listen for programmatic navigation (router.push)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      NProgress.start();
      timeoutId = setTimeout(() => {
        NProgress.done();
      }, 800);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      NProgress.start();
      timeoutId = setTimeout(() => {
        NProgress.done();
      }, 800);
    };

    document.addEventListener('click', handleClick);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClick);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  return null;
} 