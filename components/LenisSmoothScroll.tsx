'use client';

import { useEffect } from 'react';

interface LenisSmoothScrollProps {
  duration?: number;
  showIndicator?: boolean;
}

const LenisSmoothScroll = ({ duration = 1.2, showIndicator = false }: LenisSmoothScrollProps) => {
  useEffect(() => {
    const initLenis = async () => {
      try {
        const Lenis = (await import('@studio-freight/lenis')).default;

        const lenis = new Lenis({
          duration: duration, // Adjust this value: 0.5 = fast, 2.0 = slow
          easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          touchMultiplier: 1,
          infinite: false,
          // Prevent overscroll behavior
          wheelMultiplier: 1,
        });

        function raf(time: number) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Add visual indicator if requested
        if (showIndicator) {
          const indicator = document.createElement('div');
          indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #00ff00;
            color: black;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 9999;
            pointer-events: none;
          `;
          indicator.textContent = 'Lenis Smooth Scroll: ACTIVE';
          document.body.appendChild(indicator);

          // Remove indicator after 5 seconds
          setTimeout(() => {
            if (indicator.parentNode) {
              indicator.parentNode.removeChild(indicator);
            }
          }, 5000);
        }

        return () => {
          lenis.destroy();
        };
      } catch (error) {


        // Show error indicator
        const errorIndicator = document.createElement('div');
        errorIndicator.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #ff0000;
          color: white;
          padding: 10px;
          border-radius: 5px;
          font-family: monospace;
          font-size: 12px;
          z-index: 9999;
          max-width: 300px;
          word-wrap: break-word;
        `;
        errorIndicator.textContent = `Lenis Smooth Scroll: FAILED\n${error instanceof Error ? error.message : String(error)}`;
        document.body.appendChild(errorIndicator);
      }
    };

    initLenis();
  }, [duration, showIndicator]);

  return null; // This component doesn't render anything
};

export default LenisSmoothScroll;
