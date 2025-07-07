"use client"
import React, { useLayoutEffect, useRef } from 'react';

// Main App Component: Sets up the full-page horizontal snap-scrolling experience with pinning.
export default function App() {
  const mainContainerRef = useRef(null);
  const sectionsContainerRef = useRef(null); // A ref for the content div
  const backgroundsContainerRef = useRef(null); // A ref for the background div

  useLayoutEffect(() => {
    // URLs for the GSAP libraries.
    const gsapUrl = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    const scrollTriggerUrl = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
    
    let gsapScript, scrollTriggerScript;
    let masterTimeline; // To hold the master GSAP timeline for cleanup

    // Function to initialize the scrolling animation.
    const initGsapAnimation = () => {
      // Ensure GSAP and ScrollTrigger are loaded.
      if (window.gsap && window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger);

        const sections = window.gsap.utils.toArray('.snap-section');
        const numSections = sections.length;
        
        // Create a master timeline that is controlled by the scrollbar.
        masterTimeline = window.gsap.timeline({
          scrollTrigger: {
            trigger: mainContainerRef.current,
            start: 'top top',
            end: () => '+=' + (sectionsContainerRef.current.offsetWidth - window.innerWidth),
            pin: true, // Pin the main container for the duration of the animation.
            scrub: 0.8, // Fine-tuned for a smoother, more responsive feel.
            snap: {
                snapTo: 1 / (numSections - 1), // Snap to the start of each section.
                duration: {min: 0.2, max: 0.6}, // Control the snap animation timing.
                ease: 'power2.inOut'
            },
          }
        });

        // Build the timeline with staggered tweens for a sophisticated parallax effect.
        for (let i = 1; i < numSections; i++) {
          const contentTargetX = `-${i * 100}vw`;
          const label = `section-${i}`;

          // Add a tween for the content to move to the next section.
          masterTimeline.to(sectionsContainerRef.current, {
            x: contentTargetX,
            duration: 1, 
            ease: 'none'
          }, label);

          // Add a tween for the background.
          masterTimeline.to(backgroundsContainerRef.current, {
            x: contentTargetX,
            duration: 0.5,
            ease: 'none'
          }, `${label}+=0.5`);
        }
      }
    };

    // Function to load a script dynamically.
    const loadScript = (src, onLoad) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = onLoad;
      script.async = false; // Load scripts in order.
      document.body.appendChild(script);
      return script;
    };
    
    // Load GSAP, then load ScrollTrigger, then initialize the animation.
    gsapScript = loadScript(gsapUrl, () => {
      scrollTriggerScript = loadScript(scrollTriggerUrl, initGsapAnimation);
    });

    // Cleanup function: runs when the component unmounts.
    return () => {
      if (masterTimeline) {
          masterTimeline.kill();
      }
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach(st => st.kill());
      }
      // Remove the scripts from the body.
      if (gsapScript && gsapScript.parentNode) document.body.removeChild(gsapScript);
      if (scrollTriggerScript && scrollTriggerScript.parentNode) document.body.removeChild(scrollTriggerScript);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount.

  // Component's rendered output.
  return (
    <StyleProvider>
      {/* Main container to be pinned. It needs a fixed height, overflow hidden, and relative positioning. */}
      <div ref={mainContainerRef} className="h-screen overflow-hidden relative">
        
        {/* Backgrounds Container: Positioned behind the content. Contains distinct color blocks. */}
        <div 
          ref={backgroundsContainerRef}
          className="absolute top-0 left-0 w-[400vw] h-full flex flex-nowrap z-0"
        >
          {/* Backgrounds for each section. Order is updated to match new section order. */}
          <div className="w-screen h-full" style={{backgroundColor: '#111827'}}></div>
          <div className="w-screen h-full" style={{backgroundColor: '#0A0A1D'}}></div>
          <div className="w-screen h-full" style={{backgroundColor: '#0B112D'}}></div>
          <div className="w-screen h-full" style={{backgroundColor: '#080724'}}></div>
        </div>

        {/* This container holds the content sections and will be animated horizontally. */}
        <div ref={sectionsContainerRef} className="w-[400vw] h-full flex flex-nowrap relative z-10">
          {/* Section 1 */}
          <section className="snap-section relative w-screen h-screen bg-transparent text-white">
            <div className="absolute top-4 left-4 md:top-8 md:left-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white/50 tracking-wide -ml-2">/about</h1>
              <h2 className="text-8xl md:text-9xl lg:text-[10rem] font-mono text-gray-400 mt-4">
                maddevs
              </h2>
            </div>
            <div className="absolute bottom-4 left-0 md:bottom-8 pl-4 md:pl-8">
              <h2 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-white tracking-tighter">WORKING</h2>
              <h2 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-white tracking-tighter">GLOBALLY</h2>
            </div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 text-right pr-4 md:pr-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-300 tracking-tighter">BASED OFF</h2>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-300 tracking-tighter">INDIA</h2>
            </div>
          </section>

          {/* Section 2 - "We Design" Section */}
          <section className="snap-section relative w-screen h-screen flex justify-start items-center bg-transparent text-red-600 font-mono pl-4 md:pl-8">
            <div className="w-full text-left">
                <h2 className="text-[6vw] md:text-[5vw] lg:text-[4vw] uppercase tracking-[0.3em] font-semibold mb-2">
                    we design
                </h2>
                <h1 className="text-[14vw] md:text-[13vw] lg:text-[12vw] font-bold uppercase leading-none tracking-tighter">
                    creative
                    <span className="text-[8vw] md:text-[7vw] lg:text-[6vw] lowercase ml-4 align-baseline text-red-800">
                        _systems
                    </span>
                </h1>
                <h2 className="text-[9vw] md:text-[8vw] lg:text-[7vw] text-red-800 lowercase leading-none tracking-tighter my-2 md:my-4 pl-2">
                    {'{'}space
                    <span className="relative inline-block text-red-600 text-[13vw] md:text-[12vw] lg:text-[11vw] top-[0.08em] mx-2">*</span>
                    time{'}'}
                </h2>
                <h1 className="text-[14vw] md:text-[13vw] lg:text-[12vw] font-bold uppercase leading-none tracking-tighter">
                    digital experiences
                </h1>
            </div>
          </section>

          {/* Section 3 - Paragraph Section */}
          <section className="snap-section w-screen h-screen flex items-center bg-transparent text-white p-4 md:p-6 lg:p-8 overflow-hidden">
            <div className="relative w-full h-full flex items-center">
              <div className="flex w-full items-start">
                <div className="absolute top-8 left-[-5vw] sm:top-16 text-white/50 text-[10rem] font-bold leading-none select-none z-0 -translate-y-1/4">
                    //
                </div>
                <div className="relative pl-4 sm:pl-8 md:pl-12 lg:pl-24">
                    <div className="pt-2 md:pt-4 lg:pt-6 w-full md:w-4/5 lg:w-3/5 flex flex-col">
                      <div>
                        <p className="italic text-justify text-sm md:text-base lg:text-lg text-gray-300/90 leading-relaxed mb-6 md:mb-8">
                            While there are technologies that do wonder, we were facing hard time with their design—and that is not just how they look, but including functionality. Most products were seeming either like alarm clocks with good sound ability, but the snooze button is somewhere entirely else, if not under the battery; or the visual expression wasn’t really to the mark, hence not channelized with intent. We expect a story, a value, an art—no less than a dream, a meaning in the products and its all expressions, functional and visual. So we decided to do it ourselves, create products with the best of technologies, tools and techniques; design their expression, feel, and make experience as intuitive and empathetic as possible. The aim is to make the system disappear in the experience.
                        </p>
                        <p className="italic text-justify text-sm md:text-base lg:text-lg text-gray-300/90 leading-relaxed mb-6 md:mb-8">
                            Design for us is visualizing the system’s creative expression, the intuitive functional abilities and their cohesion within and across; involves care to the finest grain of details and excellence in mind, while prioritizing individualistic expression and the impact it has over and throughout. We design systems—“that feel good”, that in a profound way says it all.
                        </p>
                        <p className="italic text-justify text-sm md:text-base lg:text-lg text-gray-300/90 leading-relaxed">
                            Just Express
                        </p>
                      </div>
                      <div className="mt-12 text-right">
                        <p className="text-base md:text-lg font-medium text-white">Anant Prakash Singh</p>
                        <p className="text-sm md:text-base text-gray-400">Founder</p>
                        <p className="text-sm md:text-base text-gray-400">anant@maddevs.in</p>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 - Contact Section */}
          <section className="snap-section relative w-screen h-screen bg-transparent text-white">
            <div className="absolute bottom-8 left-0 md:bottom-16 pl-4 md:pl-8 z-0">
                <h2 className="text-8xl md:text-9xl font-extrabold text-white/10 tracking-tighter select-none">CONTACT</h2>
            </div>
            <div className="absolute top-8 left-0 md:top-16 pl-4 md:pl-8 z-10 flex flex-col space-y-6 md:space-y-8">
                <a href="mailto:mail@maddevs.in" className="group flex items-center space-x-3 md:space-x-4 text-3xl md:text-5xl font-extrabold tracking-tighter text-gray-200 hover:text-white transition-colors">
                    <svg className="w-8 h-8 md:w-12 md:h-12 text-gray-400 group-hover:text-indigo-300 transition-colors" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 4H22V20H2V4ZM4 6V8L12 13L20 8V6H4Z"/>
                    </svg>
                    <span>mail@maddevs.in</span>
                </a>
                <a href="tel:+919211918520" className="group flex items-center space-x-3 md:space-x-4 text-3xl md:text-5xl font-extrabold tracking-tighter text-gray-200 hover:text-white transition-colors">
                    <svg className="w-8 h-8 md:w-12 md:h-12 text-gray-400 group-hover:text-indigo-300 transition-colors" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    <span>+91 9211918520</span>
                </a>
            </div>
            <div className="absolute top-1/2 right-8 md:right-16 -translate-y-1/2 z-10 flex flex-col space-y-4 md:space-y-6">
                <a href="#" className="text-gray-400 hover:text-white transition-transform hover:scale-110" aria-label="X/Twitter">
                   <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 16 16">
                       <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.6.75Z"/>
                   </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-transform hover:scale-110" aria-label="LinkedIn">
                   <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M21 3H3V21H21V3ZM8 18H5V10H8V18ZM6.5 8.25C5.54 8.25 4.75 7.46 4.75 6.5C4.75 5.54 5.54 4.75 6.5 4.75C7.46 4.75 8.25 5.54 8.25 6.5C8.25 7.46 7.46 8.25 6.5 8.25ZM18 18H15V13.37C15 12.03 14.45 11.25 13.25 11.25C12.18 11.25 11.5 12.03 11.5 13.37V18H8.5V10H11.5V11.5C12.03 10.5 13.06 9.75 14.38 9.75C16.94 9.75 18 11.41 18 13.37V18Z"/>
                   </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-transform hover:scale-110" aria-label="Instagram">
                   <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M21 3H3V21H21V3ZM12 18C9.24 18 7 15.76 7 13C7 10.24 9.24 8 12 8C14.76 8 17 10.24 17 13C17 15.76 14.76 18 12 18ZM17.5 7.5C16.67 7.5 16 6.83 16 6C16 5.17 16.67 4.5 17.5 4.5C18.33 4.5 19 5.17 19 6C19 6.83 18.33 7.5 17.5 7.5Z"/>
                   </svg>
                </a>
                <a href="https://wa.me/919211918520" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-transform hover:scale-110" aria-label="WhatsApp">
                    <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 32 32">
                        <g>
                            <path d="M25.873,6.069c-2.619-2.623-6.103-4.067-9.814-4.069C8.411,2,2.186,8.224,2.184,15.874c-.001,2.446,.638,4.833,1.852,6.936l-1.969,7.19,7.355-1.929c2.026,1.106,4.308,1.688,6.63,1.689h.006c7.647,0,13.872-6.224,13.874-13.874,.001-3.708-1.44-7.193-4.06-9.815h0Zm-9.814,21.347h-.005c-2.069,0-4.099-.557-5.87-1.607l-.421-.25-4.365,1.145,1.165-4.256-.274-.436c-1.154-1.836-1.764-3.958-1.763-6.137,.003-6.358,5.176-11.531,11.537-11.531,3.08,.001,5.975,1.202,8.153,3.382,2.177,2.179,3.376,5.077,3.374,8.158-.003,6.359-5.176,11.532-11.532,11.532h0Zm6.325-8.636c-.347-.174-2.051-1.012-2.369-1.128-.318-.116-.549-.174-.78,.174-.231,.347-.895,1.128-1.098,1.359-.202,.232-.405,.26-.751,.086-.347-.174-1.464-.54-2.788-1.72-1.03-.919-1.726-2.054-1.929-2.402-.202-.347-.021-.535,.152-.707,.156-.156,.347-.405,.52-.607,.174-.202,.231-.347,.347-.578,.116-.232,.058-.434-.029-.607-.087-.174-.78-1.88-1.069-2.574-.281-.676-.567-.584-.78-.595-.202-.01-.433-.012-.665-.012s-.607,.086-.925,.434c-.318,.347-1.213,1.186-1.213,2.892s1.242,3.355,1.416,3.587c.174,.232,2.445,3.733,5.922,5.235,.827,.357,1.473,.571,1.977,.73,.83,.264,1.586,.227,2.183,.138,.666-.1,2.051-.839,2.34-1.649,.289-.81,.289-1.504,.202-1.649s-.318-.232-.665-.405h0Z" fillRule="evenodd"></path>
                        </g>
                    </svg>
                </a>
            </div>
          </section>
        </div>
      </div>
    </StyleProvider>
  );
}

// A helper component to inject global styles needed for this effect.
const StyleProvider = ({ children }) => (
  <>
    <style>{`
      /* Essential styles for the scroll effect to work correctly */
      body, html {
        margin: 0;
        padding: 0;
        /* We allow y-scrolling to control the animation, but hide the horizontal scrollbar */
        overflow-y: auto;
        overflow-x: hidden;
        background-color: #111827; /* Fallback background, matches the first color */
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
      }
    `}</style>
    {children}
  </>
);
