'use client';
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';

// Helper function to load scripts dynamically
const loadScript = (src: string) => {
  return new Promise<void>((resolve, reject) => {
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

// Main About Content component
export default function AboutContent() {
  const mountRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  // Refs to manage animation state without causing re-renders
  const cameraRef = useRef<THREE.Camera | null>(null);
  const cameraTargetX = useRef(0); // Target X position for the camera based on scroll
  const cameraCurrentX = useRef(0); // Current X position, will ease towards the target

  // --- Animation for first section texts ---
  const leftSegmentRef = useRef<HTMLDivElement>(null);
  const leftBottomRef = useRef<HTMLHeadingElement>(null);
  const rightRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    if (!leftSegmentRef.current || !leftBottomRef.current || !rightRef.current) return;
    gsap.set(leftSegmentRef.current, { x: -80, opacity: 0 });
    gsap.set(leftBottomRef.current, { x: -80, opacity: 0 });
    gsap.set(rightRef.current, { x: 80, opacity: 0 });
    gsap.to(leftSegmentRef.current, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
    gsap.to(leftBottomRef.current, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0);
    gsap.to(rightRef.current, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0);
  }, []);

  // Mark ready immediately (Three.js is imported locally)
  useEffect(() => {
    setIsReady(true);
  }, []);

  // Three.js setup effect
  useEffect(() => {
    if (!isReady || !mountRef.current) return;

    let renderer: THREE.WebGLRenderer, scene: THREE.Scene, particles: THREE.Points;
    let ww = window.innerWidth;
    let wh = window.innerHeight;
    const centerVector = new THREE.Vector3(0, 0, 0);
    let previousTime = 0;
    const mount = mountRef.current;

    const getImageData = (image: HTMLImageElement): ImageData | null => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.drawImage(image, 0, 0);
      return ctx.getImageData(0, 0, image.width, image.height);
    };

    const drawTheMap = (imagedata: ImageData) => {
      const geometry = new THREE.BufferGeometry();
      const material = new THREE.PointsMaterial({
        size: 2,
        color: 0x6b728e,
        sizeAttenuation: false,
      });

      const vertices: number[] = [];
      const destinations: number[] = [];
      const speeds: number[] = [];

      for (let y = 0; y < imagedata.height; y += 2) {
        for (let x = 0; x < imagedata.width; x += 2) {
          if (imagedata.data[x * 4 + y * 4 * imagedata.width + 3] > 128) {
            vertices.push(
              Math.random() * 1000 - 500,
              Math.random() * 1000 - 500,
              -Math.random() * 500
            );
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

    // Initialize Three.js scene
    scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, ww / wh, 0.1, 1000);
    camera.position.z = 500;
    cameraRef.current = camera;

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(ww, wh);
    mount.appendChild(renderer.domElement);

    // Load and process image
    const img = new Image();
    img.onload = () => {
      const imageData = getImageData(img);
      if (imageData) {
        drawTheMap(imageData);
      }
    };
    img.src = '/assets/media/logo-main.png'; // Adjust path as needed

    const onResize = () => {
      ww = window.innerWidth;
      wh = window.innerHeight;
      camera.aspect = ww / wh;
      camera.updateProjectionMatrix();
      renderer.setSize(ww, wh);
    };

    const render = (time: number) => {
      if (particles) {
        const positions = particles.geometry.attributes.position.array as Float32Array;
        const destinations = particles.geometry.userData.destinations;
        const speeds = particles.geometry.userData.speeds;

        for (let i = 0; i < positions.length; i += 3) {
          const idx = i / 3;
          const targetX = destinations[idx * 3];
          const targetY = destinations[idx * 3 + 1];
          const targetZ = destinations[idx * 3 + 2];
          const speed = speeds[idx];

          positions[i] += (targetX - positions[i]) * speed;
          positions[i + 1] += (targetY - positions[i + 1]) * speed;
          positions[i + 2] += (targetZ - positions[i + 2]) * speed;
        }

        particles.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };

    render(0);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (mount && renderer) {
        mount.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [isReady]);

  return (
    <div className="relative w-full h-screen">
      <div ref={mountRef} className="absolute inset-0" />
      <div ref={scrollRef} className="relative z-10">
        <div ref={leftSegmentRef} className="text-left">
          <h1>About Us</h1>
        </div>
        <div ref={leftBottomRef} className="text-left">
          <h2>We create digital experiences</h2>
        </div>
        <div ref={rightRef} className="text-right">
          <p>Innovative web development and design solutions</p>
        </div>
      </div>
    </div>
  );
}
