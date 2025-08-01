'use client';
import React, { useEffect, useRef } from 'react';

// For this to work, you would need to install these packages in your project:
// npm install three
// npm install @types/three --save-dev
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// Metadata is now in page.metadata.ts (server-only)

// Main App component that encapsulates the entire 3D gallery
export default function ThreeJSGallery() {
  // Refs for all the DOM elements we need to manipulate
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const preloaderRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<HTMLDivElement | null>(null);
  const titlesRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);

    // Add your Three.js logic here
    // This is a placeholder - you'll need to implement the actual 3D gallery logic

    // Cleanup
    return () => {
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div
        ref={preloaderRef}
        className="absolute inset-0 bg-black flex items-center justify-center"
      >
        <div className="text-white text-2xl">Loading...</div>
      </div>
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />
      <div ref={titlesRef} className="absolute inset-0 pointer-events-none" />
      <div ref={footerRef} className="absolute bottom-0 left-0 right-0 p-4 text-white" />
    </div>
  );
}
