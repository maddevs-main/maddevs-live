'use client';
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// --- Type Definitions ---
interface ThreeJsStuff {
  camera?: THREE.PerspectiveCamera;
  scene?: THREE.Scene;
  renderer?: THREE.WebGLRenderer;
  imagePlane?: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
}

export default function HomeFirst() {
  // --- Refs ---
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const browserRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const webglCanvasRef = useRef<HTMLCanvasElement>(null);
  const justTextRef = useRef<HTMLDivElement>(null);
  const expressTextRef = useRef<HTMLDivElement>(null);
  const namasteTextRef = useRef<HTMLDivElement>(null);
  const threeJsStuff = useRef<ThreeJsStuff>({}).current;

  // --- State & Handlers ---
  const [url, setUrl] = useState('maddevs.in');
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog visibility

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setDialogOpen(true); // Show dialog on form submission
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    let onMouseMove: (event: MouseEvent) => void;
    let onResize: () => void;
    let animationFrameId: number;

    const ctx = gsap.context(() => {
      // Guard clause
      if (
        !browserRef.current ||
        !webglCanvasRef.current ||
        !mainContainerRef.current ||
        !pinTargetRef.current
      ) {
        return;
      }

      const getScaleValue = () => {
        if (!browserRef.current) return 1;
        const scaleX = window.innerWidth / browserRef.current.clientWidth;
        const scaleY = window.innerHeight / browserRef.current.clientHeight;
        return Math.max(scaleX, scaleY) * 1.1;
      };

      // --- Three.js Setup ---
      const browserBounds = browserRef.current.getBoundingClientRect();
      const canvasHeight = browserBounds.height - 56;

      threeJsStuff.camera = new THREE.PerspectiveCamera(
        75,
        browserBounds.width / canvasHeight,
        0.1,
        1000
      );
      threeJsStuff.camera.position.z = 5;
      threeJsStuff.scene = new THREE.Scene();
      threeJsStuff.renderer = new THREE.WebGLRenderer({
        canvas: webglCanvasRef.current,
        antialias: true,
        alpha: true,
      });
      threeJsStuff.renderer.setSize(browserBounds.width, canvasHeight);
      threeJsStuff.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const updateImageScale = () => {
        if (!threeJsStuff.imagePlane || !threeJsStuff.camera) return;
        const distance = threeJsStuff.camera.position.z - threeJsStuff.imagePlane.position.z;
        const vFov = (threeJsStuff.camera.fov * Math.PI) / 180;
        const planeHeight = 2 * Math.tan(vFov / 2) * distance;
        const planeWidth = planeHeight * threeJsStuff.camera.aspect;
        threeJsStuff.imagePlane.scale.set(planeWidth * 1.25, planeHeight * 1.25, 1);
      };

      const textureLoader = new THREE.TextureLoader();
      // IMPORTANT: For true transparency, you must use a .png file.
      // This code uses a .jpg and makes it opaque to prevent a "white film".
      textureLoader.load(
        '/assets/media/experience_web_design_main.jpg',
        texture => {
          const planeGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
          // Opaque material to correctly display the JPG without a film
          const planeMaterial = new THREE.MeshBasicMaterial({ map: texture });
          threeJsStuff.imagePlane = new THREE.Mesh(planeGeometry, planeMaterial);
          threeJsStuff.scene?.add(threeJsStuff.imagePlane);
          updateImageScale();
        },
        undefined,
        () => {

          if (webglCanvasRef.current) {
            webglCanvasRef.current.style.backgroundColor = '#1a202c';
          }
        }
      );

      // --- GSAP Animation ---
      gsap
        .timeline({
          scrollTrigger: {
            id: 'home-first',
            trigger: mainContainerRef.current,
            start: 'top top',
            end: '+=50',
            scrub: 2.2,
            pin: pinTargetRef.current,
            anticipatePin: 1,
          },
        })
        .to(browserRef.current, { scale: getScaleValue, borderRadius: 0, ease: 'power2.inOut' }, 0)
        .to(threeJsStuff.camera.position, { z: 2.5, ease: 'power2.inOut' }, 0)
        .to(
          topBarRef.current,
          {
            height: 0,
            opacity: 0,
            paddingTop: 0,
            paddingBottom: 0,
            borderWidth: 0,
            ease: 'power2.inOut',
          },
          0
        )
        .to([justTextRef.current, expressTextRef.current], { opacity: 0, ease: 'power2.inOut' }, 0)
        .fromTo(namasteTextRef.current, { x: '110%' }, { x: '0%', ease: 'power2.inOut' }, 0.1);

      // --- Listeners & Animation Loop ---
      let mouseX = 0;
      onMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      };
      window.addEventListener('mousemove', onMouseMove, { passive: true });

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        if (threeJsStuff.camera) {
          threeJsStuff.camera.position.x += (mouseX * 0.2 - threeJsStuff.camera.position.x) * 0.05;
        }
        if (threeJsStuff.renderer && threeJsStuff.scene && threeJsStuff.camera) {
          threeJsStuff.renderer.render(threeJsStuff.scene, threeJsStuff.camera);
        }
      };
      animate();

      onResize = () => {
        if (!browserRef.current || !threeJsStuff.renderer || !threeJsStuff.camera) return;
        const newWidth = browserRef.current.clientWidth;
        const newHeight = browserRef.current.clientHeight - 56;
        threeJsStuff.renderer.setSize(newWidth, newHeight);
        threeJsStuff.camera.aspect = newWidth / newHeight;
        threeJsStuff.camera.updateProjectionMatrix();
        updateImageScale();
        ScrollTrigger.refresh();
      };
      window.addEventListener('resize', onResize);
    }, mainContainerRef);

    // --- Cleanup Function ---
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
      if (threeJsStuff.scene && threeJsStuff.imagePlane) {
        threeJsStuff.scene.remove(threeJsStuff.imagePlane);
      }
      threeJsStuff.imagePlane?.geometry.dispose();
      threeJsStuff.imagePlane?.material.map?.dispose();
      threeJsStuff.imagePlane?.material.dispose();
      threeJsStuff.renderer?.dispose();
      ctx.revert();
    };
  }, []);

  // --- JSX ---
  return (
    <>
      <div
        ref={mainContainerRef}
        className="relative h-screen w-full font-sans overflow-hidden bg-[#18230F]"
        style={{ perspective: '1000px' }}
      >
        <div ref={pinTargetRef} className="w-full h-full flex items-center justify-center relative">
          <h1
            ref={justTextRef}
            className="bg-text absolute top-[0.3em] right-[0.5em] text-[#DCD7C9] text-[22vw] md:text-[20vw] lg:text-[15vw] z-0 select-none font-black"
          >
            JUST
          </h1>
          <h1 className="bg-text absolute top-[-0.3em] right-[-0.1em] text-[#DCD7C9]/70 text-[45vw] md:text-[60vw] lg:text-[45vw] z-0 select-none font-thin">
            *
          </h1>
          <h1
            ref={expressTextRef}
            className="bg-text absolute bottom-[0.4em] left-[0.1em] text-[#DCD7C9] text-[22vw] md:text-[20vw] lg:text-[15vw] z-0 select-none font-black"
          >
            EXPRESS
          </h1>
          <h1
            ref={namasteTextRef}
            className="absolute bottom-4 right-4 text-[#8A0000]/80 text-[18vw] md:text-[24vw] lg:text-[12vw] font-bold z-20 pointer-events-none"
            style={{
              textShadow: `
      2px 2px 0 #3B060A,
      3px 3.5px 0 #3B060A,
      4.5px 5px 0 #3B060A
    `,
            }}
          >
            namaste/ नमस्ते
          </h1>
          <div
            ref={browserRef}
            className="w-[80vw] h-[60vh] max-w-4xl max-h-[600px] bg-[#222222] rounded-lg shadow-2xl overflow-hidden z-10 flex flex-col"
          >
            <div
              ref={topBarRef}
              className="bg-[#222222] h-14 px-4 flex items-center gap-2 flex-shrink-0 border-b border-gray-700 overflow-hidden"
            >
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-500"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-grow ml-4">
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={url}
                      onChange={handleUrlChange}
                      placeholder="Search or type a URL"
                      className="w-full bg-[#A27B5C]/10 text-white rounded-md py-1.5 pl-10 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <button
                      type="submit"
                      className="absolute rounded-md inset-y-0 h-full right-0 top-1/2 -translate-y-1/2 bg-[#A27B5C]/30 hover:bg-[#A27B5C]/50 text-white text-xs font-bold py-1 px-3 transition"
                    >
                      Let's Go
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* Main Content Area */}
            <div className="flex-grow w-full h-full relative bg-black">
              <canvas ref={webglCanvasRef} className="absolute top-0 left-0 w-full h-full"></canvas>

              {/* The Dialog Box is now here,canvas container */}

              {dialogOpen && (
                <div className="absolute inset-0  bg-[#8A784E] bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-[black] border-2 border-slate-300 text-white p-6 shadow-xl text-center animate-fade-in">
                    {url.toLowerCase() === 'maddevs.in' ? (
                      <>
                        <p className="text-lg text-center font-thin mb-2">hello, curious one!</p>
                        <p className="text-lg text-center font-semibold mb-4">
                          just channelise it.<br></br> go on, with the flow.
                        </p>
                        <button
                          onClick={closeDialog}
                          className="bg-green-600 hover:bg-green-700 border-2 border-green-500 text-white font-bold py-2 px-6 focus:outline-none transition"
                        >
                          alright
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-lg text-center font-thin mb-2">knew you would do that</p>
                        <p className="text-lg text-center font-semibold mb-4">
                          wrong address bar tho
                        </p>
                        <button
                          onClick={closeDialog}
                          className="bg-gray-500 hover:bg-gray-600 border-2 border-red text-white font-bold py-2 px-6 focus:outline-none transition"
                        >
                          back
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// You can add this to your globals.css for a simple fade-in effect on the dialog
/*
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out forwards;
}
*/
