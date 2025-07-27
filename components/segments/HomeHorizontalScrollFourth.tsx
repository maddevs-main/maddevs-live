"use client"
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CreativeSection from '@/components/segments/HomeSectionFourth';
import SectionTHREE from '@/components/segments/HomeSectionThree';
import HomeEnd from './HomeSectionEnd';

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
    const mainRef = useRef(null);
    // A ref for the container that will be pinned.
    const triggerRef = useRef(null);
    // A ref for the container that holds the scrolling panels.
    const containerRef = useRef(null);

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
            const panels = gsap.utils.toArray(".panel");
            
            // Create the horizontal scrolling animation.
            gsap.to(panels, {
                xPercent: -100 * (panels.length - 1),
                ease: "none", // Linear animation tied directly to scroll.
                scrollTrigger: {
                    trigger: triggerRef.current, // The element that triggers the animation.
                    pin: true, // Pin the trigger element while scrolling.
                    scrub: 1, // Smoothly link animation progress to scroll position (1-second lag).
                    //snap: 1 / (panels.length - 1), // Snap to the start of each panel.
                    // Set the end of the scroll trigger based on the container's width.
                    end: () => "+=" + (containerRef.current?.offsetWidth || 0),
                },
            });
        }, mainRef); // Scope the context to the main component element.

        // Cleanup function to revert all GSAP animations when the component unmounts.
        return () => ctx.revert();
    }, []); // Empty dependency array ensures this effect runs only once on mount.

    return (
        <main ref={mainRef} className="bg-black">
            {/* --- Original Top Section --- */}
           
        <div className="subsection min-h-screen w-full flex flex-col justify-between bg-[#948979] text-[#222222] overflow-hidden font-mono">
            {/* I've added 'break-words' to prevent the long heading from overflowing the screen. */}
            <h1 className="text-[9vw] sm:text-[11vw] md:text-[13vw] font-bold leading-none lowercase break-words px-6 sm:px-8">
                design & development
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mt-4 px-6 sm:px-8">Designing and developing using the finest, both tools and the ways. We design interfaces that harnesses imagination, making the expression come alive within a flow, on which the experience flows”</h2>
            {/* The list items are also enlarged and styled with stark borders for a brutalist look. */}
            <div className="flex flex-col mt-6 w-full">
                 <h2 className="w-full border-t-2 border-[#222222] py-4 px-6 sm:px-8">
                   <span className="block text-4xl sm:text-6xl md:text-7xl font-normal font-mono tracking-wider text-right" style={{ fontFamily: 'Inter, sans-serif' }}>web pages</span>
                 </h2>
                 <h2 className="w-full border-t-2 border-[#222222] py-4 px-6 sm:px-8">
                   <span className="block text-4xl sm:text-6xl md:text-7xl font-normal font-mono tracking-wider text-right" style={{ fontFamily: 'Inter, sans-serif' }}>mobile apps</span>
                 </h2>
                 <h2 className="w-full border-t-2 border-b-2 border-[#222222] py-4 px-6 sm:px-8">
                   <span className="block text-4xl sm:text-6xl md:text-7xl font-normal font-mono tracking-wider text-right" style={{ fontFamily: 'Inter, sans-serif' }}>pc softwares</span>
                 </h2>
            </div>
        </div>



            {/* --- New Horizontal Scrolling Section --- */}
            <section ref={triggerRef} className="relative h-screen w-full overflow-hidden bg-[#948979]">
                <div ref={containerRef} className="panels-container h-full w-[300vw] flex relative">
                    {/* Panel 1 */}
                    <div className="panel w-screen h-full flex flex-col items-center justify-center bg-[#948979]">
                    <div className="subsection min-h-screen w-full flex flex-col justify-between bg-[#948979] text-[#222222] overflow-hidden font-sans">
                    <div className="subsection min-h-screen w-full flex flex-col justify-between bg-[#948979] text-[#222222] overflow-hidden font-mono">
            {/* I've added 'break-words' to prevent the long heading from overflowing the screen. */}
           
            
            {/* The list items are also enlarged and styled with stark borders for a brutalist look. */}
            <div className="flex flex-col mt-0 w-full">
                 <h2 className="text-4xl sm:text-6xl md:text-7xl font-normal border-t-1 border-[#222222] py-4 px-4">imagination</h2>
                 <h2 className="text-4xl sm:text-6xl md:text-7xl font-normal border-t-2 border-[#222222] py-4 px-4">empathy</h2>
                 <h2 className="text-4xl sm:text-6xl md:text-7xl font-normal border-t-2 border-b-2 border-[#222222] py-4 px-4">curiosity</h2>
            </div>


             <h1 className="text-[9vw] sm:text-[11vw] md:text-[13vw] font-bold leading-none lowercase break-words px-4">
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
                    <div className="panel w-screen h-full flex flex-col items-center justify-center bg-[#948979]">
                        <SectionTHREE />
                    </div>
                </div>
            </section>
            
            {/* --- Final Section After Scrolling --- */}
            <div className="h-screen w-full flex items-center justify-center ">
            
            </div>
        </main>
    );
}
