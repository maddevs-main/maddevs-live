"use client"
import React, { useEffect, useRef, useState } from 'react';
import TextScroll from './HomeScrollTextSecond';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import \* as THREE from 'three';

interface ThreeJsStuff {
camera?: any;
scene?: any;
renderer?: any;
imagePlane?: any;
cleanup?: () => void;
}
import { OrbitControls } from '/OrbitControls.js';
import {three} from "three/build/three.min.js"
// Main App Component
export default function HomeFirst() {
// --- Refs for DOM elements and Three.js scene ---
const mainContainerRef = useRef<HTMLDivElement>(null);
const browserRef = useRef<HTMLDivElement>(null);
const topBarRef = useRef<HTMLDivElement>(null); // Ref for the browser's top bar
const webglCanvasRef = useRef<HTMLCanvasElement>(null);
const justTextRef = useRef<HTMLDivElement>(null); // Ref for the "JUST" text
const expressTextRef = useRef<HTMLDivElement>(null); // Ref for the "EXPRESS" text
const namasteTextRef = useRef<HTMLDivElement>(null); // Ref for the 2D "Namaste" text
const threeJsStuff = useRef<ThreeJsStuff>({}).current; // Ref to hold three.js variables

// --- State for the browser's address bar ---
const [url, setUrl] = useState('maddevs.in');
const [displayUrl, setDisplayUrl] = useState('maddevs.in');

// --- Handlers for the address bar ---
const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
setUrl(event.target.value);
};

const handleSearch = (event: React.FormEvent) => {
event.preventDefault();
console.log(`Navigating to: ${url}`);
// In a real browser, you would load the URL into an iframe here.
};

// useEffect hook runs once after the component mounts.
useEffect(() => {
let three: any;
// --- Dynamic Script Loading for Three.js only ---
const loadScript = (src: string, onLoad: () => void) => {
const script = document.createElement('script');
script.src = src;
script.async = true;
script.onload = onLoad;
script.onerror = () => console.error(`Failed to load script: ${src}`);
document.head.appendChild(script);
return script;
};
loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', () => {
three = (window as any).THREE;
init();
});

    // --- Main Initialization Function ---
    const init = () => {
      if (!browserRef.current || !webglCanvasRef.current || !mainContainerRef.current || !three) {
        console.error("A required element or library is not available for initialization.");
        return;
      }

      // --- 1. Three.js Scene Setup ---
      const browserBounds = browserRef.current.getBoundingClientRect();
      const canvasHeight = browserBounds.height - 56; // Adjust for address bar (h-14)

      threeJsStuff.camera = new three.PerspectiveCamera(75, browserBounds.width / canvasHeight, 0.1, 1000);
      threeJsStuff.camera.position.z = 5;
      threeJsStuff.scene = new three.Scene();
      threeJsStuff.renderer = new three.WebGLRenderer({
        canvas: webglCanvasRef.current,
        antialias: true,
        alpha: true
      });
      threeJsStuff.renderer.setSize(browserBounds.width, canvasHeight);
      threeJsStuff.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // --- Helper function to scale the image plane to fill the view ---
      const updateImageScale = () => {
        if (!threeJsStuff.imagePlane || !threeJsStuff.camera) return;
        const distance = threeJsStuff.camera.position.z - threeJsStuff.imagePlane.position.z;
        const vFov = (threeJsStuff.camera.fov * Math.PI) / 180;
        const height = 2 * Math.tan(vFov / 2) * distance;
        const width = height * threeJsStuff.camera.aspect;
        // Scale the image up more (e.g., 25% larger) to prevent any black edges on hover/parallax
        threeJsStuff.imagePlane.scale.set(width * 1.25, height * 1.25, 1);
      };

      // --- 2. Create 3D Image Plane ---
      const textureLoader = new three.TextureLoader();
      textureLoader.load('/assets/media/experience_web_design_main.jpg',
        (texture: any) => { // Success
            const planeGeometry = new three.PlaneGeometry(1, 1, 32, 32);
            const planeMaterial = new three.MeshBasicMaterial({ map: texture });
            threeJsStuff.imagePlane = new three.Mesh(planeGeometry, planeMaterial);
            threeJsStuff.scene.add(threeJsStuff.imagePlane);
            updateImageScale(); // Scale the image correctly once loaded
        },
        undefined,
        () => { // Error
            console.error("Failed to load texture. Displaying fallback color.");
            if (webglCanvasRef.current) {
              webglCanvasRef.current.style.backgroundColor = '#1a202c';
            }
        }
      );

      // --- 3. GSAP ScrollTrigger Animation ---
      const getScaleValue = () => {
          if (!browserRef.current) return 1;
          const scaleX = window.innerWidth / browserRef.current.clientWidth;
          const scaleY = window.innerHeight / browserRef.current.clientHeight;
          // Use a larger buffer to guarantee full coverage
          return Math.max(scaleX, scaleY) * 1.1;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          id:"home-first",
          trigger: mainContainerRef.current,
          start: 'top top',
          end: '+=50',
          markers: false,
          scrub: 2.2,
          pin: true,
          anticipatePin: 1,
        }
      });

      const ease = "power2.inOut";

      // Animate browser scale, radius, and camera zoom
      tl.to(browserRef.current, {
          scale: getScaleValue,
          borderRadius: 0,
          ease: ease
      }, 0);
      tl.to(threeJsStuff.camera.position, {
          z: 2.5,
          ease: ease
      }, 0);

      // Animate top bar out of view by shrinking and fading
      tl.to(topBarRef.current, {
          height: 0,
          opacity: 0,
          paddingTop: 0,
          paddingBottom: 0,
          borderWidth: 0,
          ease: ease
      }, 0);

      // Animate background text to fade out
      tl.to([justTextRef.current, expressTextRef.current], {
          opacity: 0,
          ease: ease
      }, 0);

      // Animate the 2D "Namaste" text to slide in from the right
      tl.fromTo(namasteTextRef.current, {
        x: '110%', // Start completely off-screen to the right
      }, {
        x: '0%',   // End at its original position
        ease: ease
      }, 0.1); // Start this animation slightly after the main zoom begins

      // --- 4. Animation Loop & Mouse Interaction ---
      let mouseX = 0;
      const onMouseMove = (event: MouseEvent) => { mouseX = (event.clientX / window.innerWidth) * 2 - 1; };
      window.addEventListener('mousemove', onMouseMove, { passive: true });

      const animate = () => {
        requestAnimationFrame(animate);

        if (threeJsStuff.camera) {
            threeJsStuff.camera.position.x += (mouseX * 0.2 - threeJsStuff.camera.position.x) * 0.05;
        }
        if (threeJsStuff.renderer && threeJsStuff.scene && threeJsStuff.camera) {
            threeJsStuff.renderer.render(threeJsStuff.scene, threeJsStuff.camera);
        }
      };
      animate();

      // --- 5. Handle Window Resize ---
      const onResize = () => {
        if (!browserRef.current || !threeJsStuff.renderer || !threeJsStuff.camera) return;

        const newWidth = browserRef.current.clientWidth;
        const newHeight = browserRef.current.clientHeight - 56;

        threeJsStuff.renderer.setSize(newWidth, newHeight);
        if (threeJsStuff.camera && typeof threeJsStuff.camera.aspect !== 'undefined') {
          threeJsStuff.camera.aspect = newWidth / newHeight;
          threeJsStuff.camera.updateProjectionMatrix();
        }

        updateImageScale();
        ScrollTrigger.refresh();
      };
      window.addEventListener('resize', onResize);

      // --- 6. Cleanup function ---
      threeJsStuff.cleanup = () => {
          console.log("Cleaning up animation resources.");
          window.removeEventListener('resize', onResize);
          window.removeEventListener('mousemove', onMouseMove);
          if (threeJsStuff.imagePlane) {
            if (threeJsStuff.imagePlane.geometry) threeJsStuff.imagePlane.geometry.dispose();
            if (threeJsStuff.imagePlane.material) threeJsStuff.imagePlane.material.dispose();
          }
          if (threeJsStuff.renderer) threeJsStuff.renderer.dispose();
          if (tl) tl.kill();
          ScrollTrigger.getAll().forEach(st => st.kill());
      };
    };

    // --- Component Unmount Cleanup --- dynamic - cleanup clientside rendiering issue
    return () => {

      if (threeJsStuff.cleanup) threeJsStuff.cleanup();
      document.querySelectorAll('script[src*="three.min.js"]').forEach(s => s.remove());
    };

}, []);

return (
<>
<div
ref={mainContainerRef}
className="relative h-screen w-full font-sans overflow-hidden bg-[#18230F] flex items-center justify-center"
style={{ perspective: '1000px' }} >
<div className='h-40px'></div>
{/_ Background Text Elements _/}
<h1 ref={justTextRef} className="bg-text absolute top-[0.3em] right-[0.5em] text-[#DCD7C9] text-[22vw] md:text-[20vw] lg:text-[15vw] z-0 select-none font-black">
JUST
</h1>
<h1 ref={justTextRef} className="bg-text absolute top-[0.0em] right-[0.1em] text-[#DCD7C9] text-[22vw] md:text-[20vw] lg:text-[15vw] z-0 select-none font-thin"> \*
</h1>
<h1 ref={expressTextRef} className="bg-text absolute bottom-[0.4em] left-[0.1em] text-[#DCD7C9] text-[22vw] md:text-[20vw] lg:text-[15vw] z-0 select-none font-black">
EXPRESS
</h1>

        {/* The 2D Namaste Text Overlay */}
        <h1 ref={namasteTextRef} className="absolute bottom-4 right-4 text-white text-[18vw] md:text-[24vw] lg:text-[12vw] font-bold z-20 pointer-events-none" style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0)' }}>
       namaste/ नमस्ते
        </h1>

        {/* The Browser Window */}
        <div ref={browserRef} className="w-[80vw] h-[60vh] max-w-4xl max-h-[600px] bg-[#222222] rounded-lg shadow-2xl overflow-hidden z-10 flex flex-col">
            {/* Top Bar with Controls and Address Bar */}
            <div ref={topBarRef} className="bg-[#222222] h-14 px-4 flex items-center gap-2 flex-shrink-0 border-b border-gray-700 overflow-hidden">
                {/* Traffic Light Controls */}
                <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-500"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-yellow-500"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-green-500"></div>
                </div>

                {/* Address Bar */}
                <div className="flex-grow ml-4">
                    <form onSubmit={handleSearch} className="w-full">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input
                                type="text"
                                value={url}
                                onChange={handleUrlChange}
                                placeholder="Search or type a URL"
                                className="w-full bg-[#A27B5C]/10 text-white rounded-md py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>
                    </form>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow w-full h-full relative bg-black">
                 <canvas ref={webglCanvasRef} className="absolute top-0 left-0 w-full h-full"></canvas>
            </div>
        </div>
      </div>

      {/* Placeholder for content after the scroll animation */}

    </>

);
}
