'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CreativeSection from '@/components/segments/HomeSectionFourth';
import SectionTHREE from '@/components/segments/HomeSectionThree';

// Make sure you have GSAP installed in your project:
// npm install gsap

// --- CSS for this component ---
// It's recommended to add this to your global stylesheet (e.g., index.css)
/*
body {
    background-color: #111827; // A dark gray matching the component
    color: #fff;
    font-family: sans-serif;
    margin: 0;
}
.panels-container::-webkit-scrollbar {
    display: none;
}
.panels-container {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
*/

// This is the main component for the application.
// It includes the split layout and the GSAP-powered horizontal scroll section.
export default function HorizontalHome() {
  // A ref for the main component to scope the GSAP context for safe cleanup.
  const mainRef = useRef<HTMLDivElement>(null);
  // A ref for the container that will be pinned.
  const triggerRef = useRef<HTMLElement>(null);
  // A ref for the container that holds the scrolling panels.
  const containerRef = useRef<HTMLDivElement>(null);
  // A ref for the AI banner div to animate
  const aiBannerRef = useRef<HTMLDivElement>(null);
  // A ref for the final section to use as a ScrollTrigger trigger
  const finalSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // --- FIX FOR SCROLL RESTORATION ---
    // This tells the browser to let our code handle scroll position on refresh.
    history.scrollRestoration = 'manual';
    // This ensures the window is at the top every time the component mounts.
    window.scrollTo(0, 0);

    // Register the GSAP ScrollTrigger plugin.
    gsap.registerPlugin(ScrollTrigger);

    // Create a GSAP context for safe cleanup. This is the recommended
    // way to use GSAP in React to prevent memory leaks.
    const ctx = gsap.context(() => {
      // Get an array of the panel elements.
      const panels = gsap.utils.toArray('.panel');

      // Create the horizontal scrolling animation.
      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: 'none', // Linear animation tied directly to scroll.
        scrollTrigger: {
          id: 'home-scroll',
          markers: false,
          trigger: triggerRef.current, // The element that triggers the animation.
          pin: true, // Pin the trigger element while scrolling.
          scrub: 1, // Smoothly link animation progress to scroll position (1-second lag).
          //snap: 1 / (panels.length - 1), // Snap to the start of each panel.
          // Set the end of the scroll trigger based on the container's width.
          end: () => '+=' + (containerRef.current?.offsetWidth || 0),
        },
      });
    }, mainRef); // Scope the context to the main component element.

    // Animate the AI banner div when the final section comes into view
    if (aiBannerRef.current && finalSectionRef.current) {
      gsap.fromTo(
        aiBannerRef.current,
        { x: '100vw', opacity: 0 },
        {
          x: '0vw',
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: finalSectionRef.current,
            start: 'top 80%', // when the section enters the viewport
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    }

    // Cleanup function to revert all GSAP animations when the component unmounts.
    return () => ctx.revert();
  }, []); // Empty dependency array ensures this effect runs only once on mount.

  return (
    <main ref={mainRef} className="bg-black">
      {/* --- Original Top Section --- */}

      <div className="subsection min-h-screen w-full flex flex-col justify-between bg-[#E9E3DF] text-[#222222] overflow-hidden font-mono">
        {/* I've added 'break-words' to prevent the long heading from overflowing the screen. */}
        <h1 className="text-[9vw] pt-10 sm:text-[11vw] md:text-[13vw] font-bold leading-none lowercase break-words px-6 sm:px-8">
          design & development
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mt-4 px-6 sm:px-8">
          designing and developing using the finest, both tools and the ways. We design interfaces
          that harnesses imagination, making the expression come alive within a flow, on which the
          experience flows.
        </h2>
        {/* The list items are also enlarged and styled with stark borders for a brutalist look. */}
        <div className="flex flex-col mt-6 w-full">
          <h2 className="w-full border-t-2 border-[#222222] py-4 px-6 sm:px-8">
            <span
              className="block text-4xl sm:text-6xl md:text-7xl font-normal font-mono tracking-wider text-right"
              style={{
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              }}
            >
              web pages
            </span>
          </h2>
          <h2 className="w-full border-t-2 border-[#222222] py-4 px-6 sm:px-8">
            <span
              className="block text-4xl sm:text-6xl md:text-7xl font-normal font-mono tracking-wider text-right"
              style={{
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              }}
            >
              mobile apps
            </span>
          </h2>
          <h2 className="w-full border-t-2 border-b-2 border-[#222222] py-4 px-6 sm:px-8">
            <span
              className="block text-4xl sm:text-6xl md:text-7xl font-normal font-mono tracking-wider text-right"
              style={{
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              }}
            >
              pc softwares
            </span>
          </h2>
        </div>
      </div>

      {/* --- New Horizontal Scrolling Section --- */}
      <section ref={triggerRef} className="relative h-screen w-full overflow-hidden bg-[#E9E3DF]">
        <div ref={containerRef} className="panels-container h-full w-[300vw] flex relative">
          {/* Panel 1 */}
          <div className="panel w-screen h-full flex flex-col items-center justify-center bg-[#E9E3DF]">
            <div className="subsection min-h-screen w-full flex flex-col justify-between bg-[#E9E3DF] text-[#222222] overflow-hidden font-sans">
              <div className="subsection min-h-screen w-full flex flex-col justify-between bg-[#E9E3DF] text-[#222222] overflow-hidden font-mono">
                {/* I've added 'break-words' to prevent the long heading from overflowing the screen. */}

                {/* The list items are also enlarged and styled with stark borders for a brutalist look. */}
                <div className="flex flex-col mt-0 bg-[#E9E3DF] w-full">
                  <h2 className="text-4xl sm:text-6xl md:text-7xl font-normal border-t-1 border-[#222222] py-4 px-4">
                    imagination
                  </h2>
                  <h2 className="text-4xl sm:text-6xl md:text-7xl font-normal border-t-2 border-[#222222] py-4 px-4">
                    empathy
                  </h2>
                  <h2 className="text-4xl sm:text-6xl md:text-7xl font-normal border-t-2 border-b-2 border-[#222222] py-4 px-4">
                    curiosity
                  </h2>
                </div>

                <h1 className="text-[9vw] pb-10 sm:text-[11vw] md:text-[13vw] font-bold leading-none lowercase break-words px-4">
                  creative expression design
                </h1>
              </div>
            </div>
          </div>
          {/* Panel 2 */}
          <div className="panel w-screen h-full flex flex-col items-center justify-center bg-[#948979]">
            <CreativeSection />
          </div>
          {/* Panel 3 */}
          <div className="panel w-screen h-full flex flex-col items-center justify-center bg-[#E9E3DF]">
            <SectionTHREE />
          </div>
        </div>
      </section>

      {/* --- Final Section After Scrolling --- */}
      <div
        ref={finalSectionRef}
        className="snap-start h-screen w-full bg-cover border-t-2 border-[#222222]  bg-center relative"
        style={{ backgroundImage: 'url(/assets/media/artificial_intelligence_ai_bg.jpg)' }}
      >
        <div
          ref={aiBannerRef}
          className="absolute bottom-20 right-0 left-20 py-10 -translate-x-0 backdrop-blur-sm backdrop-brightness-80 text-right text-red-500 text-3xl md:text-9xl font-regular"
        >
          leveraging{' '}
          <span className="font-black text-slate-400">
            <br></br>ARTIFICIAL GENERATIVE INTELLIGENCE
          </span>{' '}
          <span className="font-bold text-yellow-500">
            <br></br>IN DESIGN & TECH
          </span>
        </div>
      </div>
    </main>
  );
}
