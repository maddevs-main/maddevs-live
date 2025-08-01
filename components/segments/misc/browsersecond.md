"use client"
import React, { useEffect, useRef, useState } from 'react';
import TextScroll from './HomeScrollTextSecond';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import \* as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface ThreeJsStuff {
camera?: THREE.PerspectiveCamera;
scene?: THREE.Scene;
renderer?: THREE.WebGLRenderer;
imagePlane?: THREE.Mesh;
cleanup?: () => void;
}

export default function HomeFirst() {
const mainContainerRef = useRef<HTMLDivElement>(null);
const browserRef = useRef<HTMLDivElement>(null);
const topBarRef = useRef<HTMLDivElement>(null);
const webglCanvasRef = useRef<HTMLCanvasElement>(null);
const justTextRef = useRef<HTMLDivElement>(null);
const expressTextRef = useRef<HTMLDivElement>(null);
const namasteTextRef = useRef<HTMLDivElement>(null);
const threeJsStuff = useRef<ThreeJsStuff>({}).current;

const [url, setUrl] = useState('maddevs.in');

const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
setUrl(event.target.value);
};

const handleSearch = (event: React.FormEvent) => {
event.preventDefault();
console.log(`Navigating to: ${url}`);
};

useEffect(() => {
if (!browserRef.current || !webglCanvasRef.current || !mainContainerRef.current) return;

    const browserBounds = browserRef.current.getBoundingClientRect();
    const canvasHeight = browserBounds.height - 56;

    threeJsStuff.camera = new THREE.PerspectiveCamera(75, browserBounds.width / canvasHeight, 0.1, 1000);
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
      const height = 2 * Math.tan(vFov / 2) * distance;
      const width = height * threeJsStuff.camera.aspect;
      threeJsStuff.imagePlane.scale.set(width * 1.25, height * 1.25, 1);
    };

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/assets/media/experience_web_design_main.jpg',
      (texture) => {
        const planeGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
        const planeMaterial = new THREE.MeshBasicMaterial({ map: texture });
        threeJsStuff.imagePlane = new THREE.Mesh(planeGeometry, planeMaterial);
        threeJsStuff.scene.add(threeJsStuff.imagePlane);
        updateImageScale();
      },
      undefined,
      () => {
        if (webglCanvasRef.current) {
          webglCanvasRef.current.style.backgroundColor = '#1a202c';
        }
      }
    );

    const getScaleValue = () => {
      if (!browserRef.current) return 1;
      const scaleX = window.innerWidth / browserRef.current.clientWidth;
      const scaleY = window.innerHeight / browserRef.current.clientHeight;
      return Math.max(scaleX, scaleY) * 1.1;
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'home-first',
        trigger: mainContainerRef.current,
        start: 'top top',
        end: '+=50',
        markers: false,
        scrub: 2.2,
        pin: true,
        anticipatePin: 1,
      },
    });

    const ease = 'power2.inOut';

    tl.to(
      browserRef.current,
      {
        scale: getScaleValue,
        borderRadius: 0,
        ease,
      },
      0
    );
    tl.to(
      threeJsStuff.camera.position,
      {
        z: 2.5,
        ease,
      },
      0
    );
    tl.to(
      topBarRef.current,
      {
        height: 0,
        opacity: 0,
        paddingTop: 0,
        paddingBottom: 0,
        borderWidth: 0,
        ease,
      },
      0
    );
    tl.to(
      [justTextRef.current, expressTextRef.current],
      {
        opacity: 0,
        ease,
      },
      0
    );
    tl.fromTo(
      namasteTextRef.current,
      { x: '110%' },
      { x: '0%', ease },
      0.1
    );

    let mouseX = 0;
    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    };
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

    const onResize = () => {
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

    threeJsStuff.cleanup = () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      if (threeJsStuff.imagePlane) {
        if (threeJsStuff.imagePlane.geometry) threeJsStuff.imagePlane.geometry.dispose();
        if (threeJsStuff.imagePlane.material) threeJsStuff.imagePlane.material.dispose();
      }
      if (threeJsStuff.renderer) threeJsStuff.renderer.dispose();
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };

    return () => {
      if (threeJsStuff.cleanup) threeJsStuff.cleanup();
    };

}, []);

return (
<div ref={mainContainerRef} className="relative h-screen w-full font-sans overflow-hidden bg-[#18230F] flex items-center justify-center" style={{ perspective: '1000px' }}>
<div className="h-40px"></div>
<h1 ref={justTextRef} className="bg-text absolute top-[0.3em] right-[0.5em] text-[#DCD7C9] text-[22vw] md:text-[20vw] lg:text-[15vw] z-0 select-none font-black">
JUST
</h1>
<h1 className="bg-text absolute top-[0.0em] right-[0.1em] text-[#DCD7C9] text-[22vw] md:text-[20vw] lg:text-[15vw] z-0 select-none font-thin"> \*
</h1>
<h1 ref={expressTextRef} className="bg-text absolute bottom-[0.4em] left-[0.1em] text-[#DCD7C9] text-[22vw] md:text-[20vw] lg:text-[15vw] z-0 select-none font-black">
EXPRESS
</h1>
<h1 ref={namasteTextRef} className="absolute bottom-4 right-4 text-white text-[18vw] md:text-[24vw] lg:text-[12vw] font-bold z-20 pointer-events-none" style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0)' }}>
namaste/ नमस्ते
</h1>
<div ref={browserRef} className="w-[80vw] h-[60vh] max-w-4xl max-h-[600px] bg-[#222222] rounded-lg shadow-2xl overflow-hidden z-10 flex flex-col">
<div ref={topBarRef} className="bg-[#222222] h-14 px-4 flex items-center gap-2 flex-shrink-0 border-b border-gray-700 overflow-hidden">
<div className="flex items-center gap-2">
<div className="w-3.5 h-3.5 rounded-full bg-red-500"></div>
<div className="w-3.5 h-3.5 rounded-full bg-yellow-500"></div>
<div className="w-3.5 h-3.5 rounded-full bg-green-500"></div>
</div>
<div className="flex-grow ml-4">
<form onSubmit={handleSearch} className="w-full">
<div className="relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
</svg>
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
<div className="flex-grow w-full h-full relative bg-black">
<canvas ref={webglCanvasRef} className="absolute top-0 left-0 w-full h-full"></canvas>
</div>
</div>
</div>
);
}
