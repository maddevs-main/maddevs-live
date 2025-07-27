'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import gsap from 'gsap';

export default function SupportOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    const text = textRef.current;
    if (!el || !text) return;

    if (isOpen) {
      el.style.display = 'block';
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        {
          height: 'auto',
          opacity: 1,
          duration: 0.7,
          ease: 'back.out(1.7)',
        }
      );

      gsap.fromTo(
        text,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          delay: 0.2,
          duration: 0.6,
          ease: 'power2.out',
        }
      );
    } else {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          el.style.display = 'none';
        },
      });
    }
  }, [isOpen]);

  return (
    <div className="relative w-full flex justify-end">
      <div className="bg-black/90 backdrop-blur-md rounded-md shadow-xl w-[90vw] max-w-xs sm:max-w-sm transition-all duration-300 ease-in-out">
        {/* Toggle Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-3 text-white"
        >
          <div className="flex items-center">
            <img
              src="/assets/support.svg"
              alt="Support Icon"
              className="w-7 h-7 sm:w-8 sm:h-8 opacity-70 mr-3"
            />
            <span className="text-base sm:text-lg font-semibold">Need Help?</span>
          </div>
          <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-5 h-5" />
          </div>
        </button>

        {/* Expanding Content with Animation */}
        <div
          ref={contentRef}
          className="overflow-hidden px-4 pb-4 text-white text-sm sm:text-base leading-relaxed"
          style={{ display: 'none', height: 0 }}
        >
          <p ref={textRef}>
            We handle support via individual private channels created during onboarding. If you need help,
            just drop us a mail at <span className="font-bold">mail@maddevs.in</span> and we’ll respond ASAP.
          </p>
        </div>
      </div>
    </div>
  );
}