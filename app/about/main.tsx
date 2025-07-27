"use client";

import React, { useEffect, useRef, useState } from 'react';

// Helper function to load scripts dynamically
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Script load error for ${src}`));
    document.head.appendChild(script);
  });
};

// Metadata is now in main.metadata.ts (server-only)
export default function App() {
  const mountRef = useRef(null);
  const scrollRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  
  // Refs to manage animation state without causing re-renders
  const cameraRef = useRef();
  const cameraTargetX = useRef(0); // Target X position for the camera based on scroll
  const cameraCurrentX = useRef(0); // Current X position, will ease towards the target

  // Load external scripts for Three.js and GSAP
  useEffect(() => {
    Promise.all([
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"),
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js")
    ]).then(() => {
      setIsReady(true);
    }).catch(error => console.error(error));
  }, []);

  // Three.js setup effect
  useEffect(() => {
    if (!isReady || !mountRef.current) return;

    const { THREE, gsap } = window;

    let renderer, scene, particles;
    let ww = window.innerWidth;
    let wh = window.innerHeight;
    const centerVector = new THREE.Vector3(0, 0, 0);
    let previousTime = 0;
    const mount = mountRef.current;

    const getImageData = (image) => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0);
      return ctx.getImageData(0, 0, image.width, image.height);
    };

    const drawTheMap = (imagedata) => {
      const geometry = new THREE.BufferGeometry();
      const material = new THREE.PointsMaterial({
        size: 2,
        color: 0xF0E4D3,
        sizeAttenuation: false,
      });

      const vertices = [];
      const destinations = [];
      const speeds = [];

      for (let y = 0; y < imagedata.height; y += 2) {
        for (let x = 0; x < imagedata.width; x += 2) {
          if (imagedata.data[(x * 4 + y * 4 * imagedata.width) + 3] > 128) {
            vertices.push(Math.random() * 1000 - 500, Math.random() * 1000 - 500, -Math.random() * 500);
            destinations.push(x - imagedata.width / 2, -y + imagedata.height / 2, 0);
            speeds.push(Math.random() / 200 + 0.015);
          }
        }
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.userData = { destinations, speeds };
      particles = new THREE.Points(geometry, material);
      scene.add(particles);
    };

    const init = () => {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(ww, wh);
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(50, ww / wh, 0.1, 10000);
      camera.position.set(0, 0, 200);
      camera.lookAt(centerVector);
      cameraRef.current = camera;
      scene.add(camera);

      const loader = new THREE.TextureLoader();
      loader.crossOrigin = '';
      loader.load(
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/127738/transparentMap.png",
        (texture) => {
          const imagedata = getImageData(texture.image);
          drawTheMap(imagedata);
          requestAnimationFrame(render);
        },
        undefined,
        (err) => console.error('An error happened while loading the texture.', err)
      );
    };

    const onResize = () => {
      ww = window.innerWidth;
      wh = window.innerHeight;
      if (renderer && cameraRef.current) {
        renderer.setSize(ww, wh);
        cameraRef.current.aspect = ww / wh;
        cameraRef.current.updateProjectionMatrix();
      }
    };

    const render = (a) => {
      requestAnimationFrame(render);

      if (particles) {
        const positions = particles.geometry.attributes.position.array;
        const { destinations, speeds } = particles.geometry.userData;

        for (let i = 0; i < positions.length / 3; i++) {
          const i3 = i * 3;
          positions[i3] += (destinations[i3] - positions[i3]) * speeds[i];
          positions[i3 + 1] += (destinations[i3 + 1] - positions[i3 + 1]) * speeds[i];
          positions[i3 + 2] += (destinations[i3 + 2] - positions[i3 + 2]) * speeds[i];
        }

        if (a - previousTime > 100) {
          const index1 = Math.floor(Math.random() * (positions.length / 3));
          const index2 = Math.floor(Math.random() * (positions.length / 3));
          const i3_1 = index1 * 3;
          const i3_2 = index2 * 3;
          const p1 = { x: positions[i3_1], y: positions[i3_1 + 1] };
          const p2 = { x: positions[i3_2], y: positions[i3_2 + 1] };
          gsap.to(p1, { x: p2.x, y: p2.y, duration: Math.random() * 2 + 1, ease: "power2.inOut", onUpdate: () => { positions[i3_1] = p1.x; positions[i3_1 + 1] = p1.y; } });
          gsap.to(p2, { x: p1.x, y: p1.y, duration: Math.random() * 2 + 1, ease: "power2.inOut", onUpdate: () => { positions[i3_2] = p2.x; positions[i3_2 + 1] = p2.y; } });
          previousTime = a;
        }
        particles.geometry.attributes.position.needsUpdate = true;
      }
      
      if (cameraRef.current) {
        cameraCurrentX.current += (cameraTargetX.current - cameraCurrentX.current) * 0.05;
        cameraRef.current.position.x = cameraCurrentX.current;
        
        cameraRef.current.lookAt(centerVector);
        renderer.render(scene, cameraRef.current);
      }
    };
    
    init();
    window.addEventListener('resize', onResize, false);

    return () => {
      window.removeEventListener('resize', onResize);
      if (mount && renderer && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      if (scene) {
        scene.traverse(object => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) object.material.forEach(m => m.dispose());
            else object.material.dispose();
          }
        });
      }
      if(renderer) renderer.dispose();
    };
  }, [isReady]);

  // Scroll handler effect
  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const updateScrollTarget = () => {
        const scrollLeft = scrollEl.scrollLeft;
        const scrollWidth = scrollEl.scrollWidth - scrollEl.clientWidth;
        const scrollPercentage = scrollWidth > 0 ? scrollLeft / scrollWidth : 0;
        cameraTargetX.current = scrollPercentage * 400;
    };
    
    scrollEl.addEventListener('scroll', updateScrollTarget);

    return () => {
        scrollEl.removeEventListener('scroll', updateScrollTarget);
    };
  }, []);


  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* SEO: Main headline for the page */}
      <h1>ABOUT MAIN PAGE TITLE HERE</h1> {/* TODO: Match this to the title above */}
      {/* SEO: Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage', // TODO: Use a more specific type if possible
            'name': 'ABOUT MAIN PAGE TITLE HERE', // TODO: Match this to the title above
            // ...add more fields as needed
          }),
        }}
      />
      {/* Fixed background for Three.js canvas. z-0 ensures it's in the background. */}
      <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0" />
      
      {/* Scrollable container for horizontal scrolling. z-10 ensures it's on top of the canvas. */}
      <div 
        ref={scrollRef} 
        className="absolute top-0 left-0 w-full h-full flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory z-10"
      >
        {/* Section 1: Initial Text */}
        <section className="w-screen h-screen flex-shrink-0 relative snap-start">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none p-4 md:p-8 flex flex-col justify-between">
                <div>
                    <h1 className="text-[6vw] md:text-5xl font-bold text-white mix-blend-difference">about/</h1>
                    <h1 className="text-[6vw] md:text-5xl font-bold text-white mix-blend-difference">maddevs</h1>
                </div>
                <div className="self-center text-right w-full">
                    <h1 className="text-[6vw] md:text-5xl font-bold text-white mix-blend-difference">BASED OFF INDIA</h1>
                </div>
                <div>
                    <h1 className="text-[6vw] md:text-5xl font-bold text-white mix-blend-difference">WORKING GLOBALLY</h1>
                </div>
            </div>
        </section>

        {/* Section 2 */}
        <section className="w-screen h-screen flex-shrink-0 flex items-center justify-end snap-start p-4 md:p-8 lg:p-16">
            <div className="w-full text-right text-white mix-blend-difference">
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

        {/* Section 3 */}
        <section className="w-screen h-screen flex-shrink-0 snap-start">
             <div className="relative w-full h-full">
                {/* Blurred Background Panel */}
                <div className="absolute top-0 left-0 h-full w-[85%] md:w-3/4 max-w-5xl bg-black/50 backdrop-blur-md"></div>
                
                {/* Content Container */}
                <div className="relative w-full h-full flex items-center text-white p-4 md:p-8">
                    <div className="flex w-full items-start">
                        {/* Repositioned '//' symbol */}
                        <div className="absolute top-8 left-4 sm:left-8 text-white/20 text-8xl sm:text-9xl md:text-[10rem] font-bold leading-none select-none z-0 -translate-y-1/4">
                            //
                        </div>
                        <div className="relative">
                            <div className="pt-2 md:pt-4 lg:pt-6 w-full md:w-4/5 lg:w-3/5 flex flex-col pl-4 sm:pl-8 md:pl-12 lg:pl-24">
                            <div>
                                <p className="italic text-justify text-xs md:text-base lg:text-lg text-gray-300/90 leading-relaxed mb-6 md:mb-8">
                                    While there are technologies that do wonder, we were facing hard time with their design—and that is not just how they look, but including functionality. Most products were seeming either like alarm clocks with good sound ability, but the snooze button is somewhere entirely else, if not under the battery; or the visual expression wasn't really to the mark, hence not channelized with intent. We expect a story, a value, an art—no less than a dream, a meaning in the products and its all expressions, functional and visual. So we decided to do it ourselves, create products with the best of technologies, tools and techniques; design their expression, feel, and make experience as intuitive and empathetic as possible. The aim is to make the system disappear in the experience.
                                </p>
                                <p className="italic text-justify text-sm md:text-base lg:text-lg text-gray-300/90 leading-relaxed mb-6 md:mb-8">
                                    Design for us is visualizing the system's creative expression, the intuitive functional abilities and their cohesion within and across; involves care to the finest grain of details and excellence in mind, while prioritizing individualistic expression and the impact it has over and throughout. We design systems—"that feel good", that in a profound way says it all.
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
            </div>
        </section>

        {/* Section 4 */}
        <section className="w-screen h-screen flex-shrink-0 flex items-center justify-center snap-start relative text-white mix-blend-difference p-4">
            <div className="absolute bottom-8 left-0 md:bottom-16 pl-4 md:pl-8 z-0">
                <h2 className="text-8xl md:text-9xl font-extrabold text-red-900 tracking-tighter select-none">CONTACT</h2>
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
  );
}
