'use client';

import React, { useEffect, useRef } from 'react';
import Script from 'next/script';

// For this to work, you would need to install these packages in your project:
// npm install three
// npm install @types/three --save-dev
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// SEO Structured Data
const worksData = {
  '@context': 'https://schema.org',
  '@type': 'Organisation',
  name: 'works/maddevs – creative web design & development',
  description:
    'Portfolio of expressive websites and intelligent systems. We design and develop immersive digital experiences—spanning e-commerce platforms, dashboards, branded sites, and integrated tools—with architectural clarity and creative expression.',
  url: 'https://maddevs.in/works',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'CreativeWork',
        name: 'Web Design Projects',
        description:
          'Expressive and immersive web design projects—crafted for clarity, identity, and emotional resonance.',
        creator: { '@type': 'Organization', name: 'maddevs' },
        category: 'Web Design'
      }
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'CreativeWork',
        name: 'Web Development Projects',
        description:
          'Scalable and performant development—building intelligent systems with modern, robust technologies.',
        creator: { '@type': 'Organization', name: 'maddevs' },
        category: 'Web Development'
      }
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'CreativeWork',
        name: 'E-commerce Platforms',
        description:
          'Modular, secure e-commerce platforms integrating custom UI/UX, payments, inventory, and conversion systems.',
        creator: { '@type': 'Organization', name: 'maddevs' },
        category: 'E-commerce'
      }
    },
    {
      '@type': 'ListItem',
      position: 4,
      item: {
        '@type': 'CreativeWork',
        name: 'RBAC Dashboards and Admin Panels',
        description:
          'Role-based access control systems and secure dashboards for internal tools, analytics, and operations.',
        creator: { '@type': 'Organization', name: 'maddevs' },
        category: 'RBAC / Internal Tools'
      }
    },
    {
      '@type': 'ListItem',
      position: 5,
      item: {
        '@type': 'CreativeWork',
        name: 'Custom Web Applications',
        description:
          'Bespoke platforms tailored to business logic, workflows, and integrations—built from scratch for precision.',
        creator: { '@type': 'Organization', name: 'maddevs' },
        category: 'Custom Applications'
      }
    },
    {
      '@type': 'ListItem',
      position: 6,
      item: {
        '@type': 'CreativeWork',
        name: 'Digital Tools and Integrations',
        description:
          'System integrations, automation tools, and productivity platforms designed to optimize digital operations.',
        creator: { '@type': 'Organization', name: 'maddevs' },
        category: 'Systems & Tools'
      }
    }
  ]
};
// Metadata is now in page.metadata.ts (server-only)

// Main App component that encapsulates the entire 3D gallery
export default function App() {
  // Refs for all the DOM elements we need to manipulate
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const preloaderRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<HTMLDivElement | null>(null);
  const titlesRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null); // Ref for the text fill element
  const productsHeadingRef = useRef<HTMLHeadingElement | null>(null);

  // useEffect hook runs once after the component mounts
  useEffect(() => {
    // Page load tracking
    const startTime = performance.now();
    console.log(
      "Welcome to maddevs, this page was designed and created by maddevs, visit 'https://www.maddevs.in' for further information"
    );

    let animationFrameId: number;
    let cleanupFunctions: (() => void)[] = [];

    // --- Preloader Logic with Text Fill Effect ---
    const progressFill = progressFillRef.current;
    if (progressFill) {
      let progress = 0;
      const duration = 2500; // Total loading time in ms
      const intervalTime = 50; // Update interval

      const intervalId = setInterval(() => {
        progress += (intervalTime / duration) * 100;
        progressFill.style.width = `${Math.min(progress, 100)}%`;

        if (progress >= 100) {
          clearInterval(intervalId);
          // Fade out preloader and show main content
          const mainElements = [
            canvasRef.current,
            particlesRef.current,
            titlesRef.current,
            footerRef.current,
            productsHeadingRef.current,
          ];
          mainElements.forEach(el => {
            if (el) el.style.opacity = '1';
          });
          if (preloaderRef.current) {
            preloaderRef.current.style.opacity = '0';
            setTimeout(() => {
              if (preloaderRef.current) preloaderRef.current.style.display = 'none';
            }, 800);
          }
        }
      }, intervalTime);
      cleanupFunctions.push(() => clearInterval(intervalId));
    }

    const particlesContainer = particlesRef.current;
    if (particlesContainer) {
      for (let i = 0; i < 80; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 5 + 2;
        Object.assign(particle.style, {
          width: `${size}px`,
          height: `${size}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: (Math.random() * 0.5 + 0.1).toString(),
        });
        particlesContainer.appendChild(particle);
      }
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 5;

    // --- Post-processing for RGB Glitch Effect ---
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const RGBShiftShader = {
      uniforms: {
        tDiffuse: { value: null as THREE.Texture | null },
        amount: { value: 0.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float amount;
        varying vec2 vUv;
        void main() {
          vec2 offset = amount * 0.02 * vec2(1.0, 0.0);
          vec4 cr = texture2D(tDiffuse, vUv + offset);
          vec4 cg = texture2D(tDiffuse, vUv);
          vec4 cb = texture2D(tDiffuse, vUv - offset);
          gl_FragColor = vec4(cr.r, cg.g, cb.b, cg.a);
        }
      `,
    };
    const rgbShiftPass = new ShaderPass(RGBShiftShader);
    composer.addPass(rgbShiftPass);

    const slideWidth = 3.2,
      slideHeight = 1.8,
      gap = 0.25,
      slideCount = 10;
    const totalWidth = slideCount * (slideWidth + gap);
    const slideUnit = slideWidth + gap;

    const settings = {
      wheelSensitivity: 0.01,
      touchSensitivity: 0.01,
      momentumMultiplier: 2.5,
      smoothing: 0.1,
      slideLerp: 0.075,
      distortionDecay: 0.93,
      maxDistortion: 4.0,
      distortionSensitivity: 0.25,
      distortionSmoothing: 0.075,
      textFadeStart: slideWidth / 2,
      textFadeEnd: slideWidth / 2 + 0.5,
      textMaxBlur: 5,
    };

    const slides: THREE.Mesh[] = [];
    let currentPosition = 0,
      targetPosition = 0,
      isScrolling = false,
      autoScrollSpeed = 0,
      lastTime = 0,
      globalTime = 0;
    let currentDistortionFactor = 0,
      targetDistortionFactor = 0;

    // Updated titles and image URLs to "coming soon"
    const comingSoonTitle = { title: 'coming soon' };
    const comingSoonImageUrl = 'https://placehold.co/640x360/000000/FFFFFF?text=coming+soon';

    const titlesContainer = titlesRef.current;
    const titleElements: { element: HTMLDivElement; index: number }[] = [];
    if (titlesContainer) {
      for (let i = 0; i < slideCount; i++) {
        const titleEl = document.createElement('div');
        titleEl.className = 'slide-title';
        titleEl.innerHTML = `<h2 class="title-text">${comingSoonTitle.title}</h2><p class="title-number">0</p>`;
        titleEl.style.opacity = '0';
        titlesContainer.appendChild(titleEl);
        titleElements.push({ element: titleEl, index: i });
      }
    }

    const textureLoader = new THREE.TextureLoader();
    for (let i = 0; i < slideCount; i++) {
      const geometry = new THREE.PlaneGeometry(slideWidth, slideHeight, 1, 1);
      // Switched to MeshBasicMaterial for full brightness, not affected by light
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = i * slideUnit - totalWidth / 2;
      mesh.userData = { index: i };
      textureLoader.load(comingSoonImageUrl, (texture: THREE.Texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        material.map = texture;
        material.needsUpdate = true;
      });
      scene.add(mesh);
      slides.push(mesh);
    }

    const updateTitlePositions = () => {
      let activeSlideIndex = -1;
      let minDistance = Infinity;

      // Find the slide closest to the center
      slides.forEach((slide, index) => {
        const distance = Math.abs(slide.position.x);
        if (distance < minDistance) {
          minDistance = distance;
          activeSlideIndex = index;
        }
      });

      // Update visibility of all titles
      titleElements.forEach(({ element, index }) => {
        // Show title only if its slide is the active one and it's close enough to the center
        if (index === activeSlideIndex && minDistance < slideWidth * 0.75) {
          element.style.opacity = '1';
          element.style.filter = 'blur(0px)';
        } else {
          element.style.opacity = '0';
          element.style.filter = `blur(${settings.textMaxBlur}px)`;
        }
      });
    };

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const deltaTime = lastTime ? (time - lastTime) / 1000 : 0.016;
      lastTime = time;
      globalTime += deltaTime;

      if (isScrolling) {
        targetPosition += autoScrollSpeed;
        autoScrollSpeed *= 0.95;
        if (Math.abs(autoScrollSpeed) < 0.001) {
          isScrolling = false;
          autoScrollSpeed = 0;
        }
      }

      currentPosition += (targetPosition - currentPosition) * settings.smoothing;
      targetDistortionFactor *= settings.distortionDecay;
      currentDistortionFactor +=
        (targetDistortionFactor - currentDistortionFactor) * settings.distortionSmoothing;

      rgbShiftPass.uniforms['amount'].value = currentDistortionFactor * 0.5;

      slides.forEach(slide => {
        let baseX = slide.userData.index * slideUnit - currentPosition;
        baseX =
          (((baseX % totalWidth) + totalWidth + totalWidth / 2) % totalWidth) - totalWidth / 2;
        slide.position.x = baseX;
      });

      updateTitlePositions();
      composer.render(deltaTime);
    };

    animate(0);

    // --- Event Listeners with Throttling ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isTouching = false;
    let touchStartX = 0;
    let touchLastX = 0;
    let scrollTimeout: NodeJS.Timeout | null = null;

    const snapToCenter = () => {
      const closest = Math.round(targetPosition / slideUnit);
      targetPosition = closest * slideUnit;
    };

    const throttle = (func: (...args: any[]) => void, delay: number) => {
      let lastCall = 0;
      return (...args: any[]) => {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
          return;
        }
        lastCall = now;
        return func(...args);
      };
    };

    const handleWheel = (e: WheelEvent) => {
      targetPosition -= e.deltaY * settings.wheelSensitivity;
      targetDistortionFactor = Math.min(
        settings.maxDistortion,
        targetDistortionFactor + Math.abs(e.deltaY) * 0.05
      );
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(snapToCenter, 250);
    };

    const handleTouchStart = (e: TouchEvent) => {
      isTouching = true;
      touchStartX = e.touches[0].clientX;
      touchLastX = touchStartX;
      isScrolling = false;
      autoScrollSpeed = 0;
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouching) return;
      const touchX = e.touches[0].clientX;
      const deltaX = touchX - touchLastX;
      targetPosition -= deltaX * settings.touchSensitivity;
      targetDistortionFactor = Math.min(
        settings.maxDistortion,
        targetDistortionFactor + Math.abs(deltaX) * 0.08
      );
      touchLastX = touchX;
    };

    const handleTouchEnd = () => {
      isTouching = false;
      snapToCenter();
    };

    const throttledWheel = throttle(handleWheel, 16);
    const throttledTouchMove = throttle(handleTouchMove, 16);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      throttledWheel(e);
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      throttledTouchMove(e);
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
      updateTitlePositions();
    };
    const onClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(slides);
      if (intersects.length > 0) {
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', onResize);
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    cleanupFunctions.push(
      () => window.removeEventListener('wheel', onWheel),
      () => window.removeEventListener('resize', onResize),
      () => canvas.removeEventListener('click', onClick),
      () => canvas.removeEventListener('touchstart', handleTouchStart),
      () => canvas.removeEventListener('touchmove', onTouchMove),
      () => canvas.removeEventListener('touchend', handleTouchEnd),
      () => renderer.dispose()
    );

    return () => {
      const endTime = performance.now();
      const loadTime = ((endTime - startTime) / 1000).toFixed(2);
      console.log(`The page loaded in ${loadTime} seconds`);

      cancelAnimationFrame(animationFrameId);
      cleanupFunctions.forEach(fn => fn());
    };
  }, []);

  return (
    <>
      {/* SEO: Main headline for the page */}
      <h1>WORKS PAGE TITLE HERE</h1> {/* TODO: Match this to the title above */}
      {/* SEO: Structured Data (JSON-LD) */}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(worksData),
        }}
      />
      <div className="sr-only">
        Portfolio: web development projects, UX/UI design, SaaS, AI, digital transformation
      </div>
      <style>{`
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: #000; }
        body { font-family: cursor:'none', Inter', sans-serif; color: #f0f0f0; }
        body::after { content: ""; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-image: url("/assets/media/works_bg.png"); opacity: 0.25; mix-blend-mode: screen; pointer-events: none; z-index: 1; }
        body::before { content: ""; position: fixed; top: -50%; left: -50%; width: 200%; height: 200%; background: transparent url("http://assets.iceable.com/img/noise-transparent.png") repeat 0 0; animation: noise-animation 0.3s steps(5) infinite; opacity: 0.9; z-index: 100; pointer-events: none; }
        @keyframes noise-animation { 0% { transform: translate(0, 0); } 10% { transform: translate(-2%, -3%); } 20% { transform: translate(-4%, 2%); } 30% { transform: translate(2%, -4%); } 40% { transform: translate(-2%, 5%); } 50% { transform: translate(-4%, 2%); } 60% { transform: translate(3%, 0); } 70% { transform: translate(0, 3%); } 80% { transform: translate(-3%, 0); } 90% { transform: translate(2%, 2%); } 100% { transform: translate(1%, 0); } }
        
        footer { position: fixed; width: 100vw; padding: 2em; display: flex; justify-content: flex-end; align-items: center; z-index: 2; mix-blend-mode: difference; bottom: 0; right: 0; opacity: 0; transition: opacity 0.5s ease; }
        #canvas { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; overflow: hidden; cursor: grab; opacity: 0; transition: opacity 0.5s ease; }
        #canvas:active { cursor: grabbing; }
        .particles { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; opacity: 0; transition: opacity 0.5s ease; }
        .particle { position: absolute; background: rgba(255, 255, 255, 0.1); border-radius: 50%; }
        
        #titles-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; opacity: 0; transition: opacity 0.5s ease; }
        .slide-title { position: fixed; bottom: 40px; left: 40px; color: white; pointer-events: none; transition: opacity 0.4s ease, filter 0.4s ease; text-align: left; max-width: 40vw; transform: none !important; }
        .title-text { font-family: 'PP Neue Montreal', 'Inter', sans-serif; text-transform: lowercase; font-size: 6vw; line-height: 0.9; font-weight: 400; letter-spacing: -0.03em; margin: 0; }
        .title-number { font-family: 'TheGoodMonolith', 'Inter', sans-serif; font-size: 3vw; margin: 0; position: relative; padding-top: 10px; display: inline-flex; align-items: center; }
        .title-number::before { content: ""; display: block; width: 40px; height: 3px; background-color:rgb(255, 0, 0); margin-right: 10px; }
        
        .preloader { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #222222; z-index: 9999; display: flex; flex-direction: column; justify-content: center; align-items: center; transition: opacity 0.8s cubic-bezier(0.65, 0, 0.35, 1); }
        
        .progress-text-container {
            position: relative;
            font-family: 'PP Neue Montreal', 'Inter', sans-serif;
            font-size: 8rem; /* Large font size */
            font-weight: 600;
            font-style: italic;
            line-height: 1;
            color: rgb(30, 30, 30); /* Color of the unfilled text */
        }

        .progress-text-fill {
            position: absolute;
            top: 0;
            left: 0;
            width: 0%; /* This width will be animated from 0% to 100% */
            height: 100%;
            color: rgb(197, 197, 197); /* Color of the filled text */
            overflow: hidden;
            transition: width 0.1s linear;
            white-space: nowrap;
        }

.loading-text { 
position: fixed;
top: 40px;
right: 20px;
letter-spacing: 0.005em;
 text-transform: lowercase;
color: white;
 z-index: 10;
font-size: 4rem;
font-family: 'PP Neue Montreal', 'Inter', sans-serif;
letter-spacing: 0.2em;
text-transform: lowercase;
margin: 0; }
        
        .products-heading {
            position: fixed;
            top: 60px;
            right: 40px;
            color: white;
            font-family: 'PP Neue Montreal', 'Inter', sans-serif;
            font-size: 10vh;
            text-transform: lowercase;
            z-index: 10;
            opacity: 0;
            transition: opacity 0.5s ease;
        }

      `}</style>
      <div ref={preloaderRef} className="preloader">
        <div className="loading-text"></div>
        <div className="progress-text-container">
          md.
          <div ref={progressFillRef} className="progress-text-fill">
            md.
          </div>
        </div>
      </div>
      <h1 ref={productsHeadingRef} className="products-heading">
        /works
        <br />
        <span
          style={{
            fontSize: '1.2vh',
            opacity: 1,
            animation: 'fadeAndHide 0.6s ease-in-out 6s forwards',
          }}
        >
          *swipe/scroll to navigate
        </span>
        {/* Inline @keyframes via <style> tag */}
        <style>
          {' '}
          {`
      @keyframes fadeAndHide {
        to {
          opacity: 0;
          visibility: hidden;}} `}
        </style>
      </h1>
      <div ref={particlesRef} className="particles"></div>
      <div ref={titlesRef} id="titles-container"></div>
      <canvas ref={canvasRef} id="canvas"></canvas>
    </>
  );
}
