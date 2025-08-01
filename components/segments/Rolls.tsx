'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SnapScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const sections = gsap.utils.toArray('.snap-section');

    sections.forEach((section, index) => {
      gsap.fromTo(
        textsRef.current[index],
        { autoAlpha: 0, y: 50 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: section as Element,
            start: 'top center',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-auto snap-y snap-mandatory scroll-smooth"
    >
      {/* Section 1 */}
      <div
        className="snap-start h-screen w-full bg-cover bg-center relative"
        style={{ backgroundImage: 'url(/assets/media/website_design_development.jpg)' }}
      >
        <div
          ref={(el: HTMLDivElement | null) => {
            textsRef.current[0] = el;
          }}
          className="absolute top-1/4 left-8 max-w-5xl text-left text-white text-6xl md:text-9xl font-bold leading-tight"
        >
          DESIGN THE LIGHTS,
          <br />
          PIXEL BY PIXEL
        </div>
      </div>

      {/* Section 2 */}
      <div
        className="snap-start h-screen w-full bg-cover bg-center relative"
        style={{ backgroundImage: 'url(/assets/media/web_design_host_create_website.jpg)' }}
      >
        <div
          ref={(el: HTMLDivElement | null) => {
            textsRef.current[1] = el;
          }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center text-white text-3xl md:text-6xl font-regular"
        >
          LIKE DUSK,<span className="font-black">LIKE DAWN</span>
        </div>
      </div>

      {/* Section 3 */}
      <div
        className="snap-start h-screen w-full bg-cover bg-center relative"
        style={{ backgroundImage: 'url(/assets/media/web_code_develop.jpg)' }}
      >
        <div
          ref={(el: HTMLDivElement | null) => {
            textsRef.current[2] = el;
          }}
          className="absolute top-3/4 left-8 max-w-5xl text-left text-white text-6xl md:text-7xl font-bold leading-tight"
        >
          OR THE MIDNIGHT BLUES.
        </div>
        <div className="absolute backdrop-blur-sm backdrop-brightness-50 p-10 top-2/4 left-2/3 -translate-x-1/2 text-left text-white text-2xl md:text-3xl font-regular">
          <p className="font-light">
            Where the flow decides the focus, and all that decides the flow, design it,
            intentionally!
          </p>
          <p className="italic font-light">Because life, imitates art.</p>
        </div>
      </div>
    </div>
  );
};

export default SnapScroll;
