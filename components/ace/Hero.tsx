'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextureLoader, MeshPhongMaterial, MeshStandardMaterial } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Let TypeScript know that 'gsap' will be available on the window object
declare global {
    interface Window {
        gsap: any;
    }
}

// Helper to calculate the visible height at a given z-depth from a perspective camera
const getVisibleHeightAtZDepth = (depth: number, camera: THREE.PerspectiveCamera) => {
  const cameraOffset = camera.position.z;
  if (depth < cameraOffset) depth -= cameraOffset;
  else depth += cameraOffset;
  const vFOV = (camera.fov * Math.PI) / 180;
  return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
};

// Helper to calculate the visible width
const getVisibleWidthAtZDepth = (depth: number, camera: THREE.PerspectiveCamera) => {
  const height = getVisibleHeightAtZDepth(depth, camera);
  return height * camera.aspect;
};

// === HERO COMPONENT ===
const Hero = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const textMesh = useRef<THREE.Mesh | null>(null);
  const initialYRef = useRef<number>(0);
  
  const backgroundImageUrl = './bg-image.jpg';

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    let renderer: THREE.WebGLRenderer;

    // --- Control Parameters ---
    const params = {
        textDepth: 3,
        textSize: 30,
        cameraZ: 125,
    };

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = params.cameraZ;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(40, 60, 100);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.radius = 8;
    scene.add(dirLight);

    // --- Positioning and Recreation Logic ---
    const updateTextPosition = () => {
        if (!textMesh.current) return;
        
        const textMetrics = textMesh.current.geometry.boundingBox!;
        const textWidth = textMetrics.max.x - textMetrics.min.x;
        const textHeight = textMetrics.max.y - textMetrics.min.y;

        const visibleWidth = getVisibleWidthAtZDepth(0, camera);
        const visibleHeight = getVisibleHeightAtZDepth(0, camera);

        const padding = 4;
        
        // Ensure text doesn't overflow horizontally
        const maxTextWidth = visibleWidth - padding * 2;
        if (textWidth > maxTextWidth) {
            const scale = maxTextWidth / textWidth;
            textMesh.current.scale.set(scale, scale, scale);
        } else {
            textMesh.current.scale.set(1, 1, 1);
        }
        
        // Recalculate scaled dimensions
        const scaledTextWidth = textWidth * textMesh.current.scale.x;
        const scaledTextHeight = textHeight * textMesh.current.scale.y;
        
        // Position text aligned to the right with padding
        textMesh.current.position.x = visibleWidth / 6 - padding;
        
        const initialY = -visibleHeight / 2 + scaledTextHeight * 1.2 + padding;
        textMesh.current.position.y = initialY;
        initialYRef.current = initialY;

        textMesh.current.position.z = 5;
    };

    // --- Texture Loading ---
    // (Removed wood texture)

    const recreateTextGeometry = (font: any) => {
        if (textMesh.current) {
            scene.remove(textMesh.current);
            textMesh.current.geometry.dispose();
            (textMesh.current.material as THREE.Material).dispose();
        }

        const geometry = new TextGeometry('JUST\nEXPRESS.', {
            font: font,
            size: params.textSize,
            depth: 2.2, // strong depth
            curveSegments: 12,
            bevelEnabled: false, // sharp edges
            bevelThickness: 0,
            bevelSize: 0,
            bevelOffset: 0,
            bevelSegments: 0,
        });

        geometry.computeBoundingBox();
        const textWidth = geometry.boundingBox!.max.x - geometry.boundingBox!.min.x;
        geometry.translate(-textWidth / 2, 0, 0);

        const material = new MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.5,
            metalness: 0.1
        });

        textMesh.current = new THREE.Mesh(geometry, material);
        textMesh.current.castShadow = true;
        textMesh.current.receiveShadow = true;
        scene.add(textMesh.current);
        updateTextPosition();
    };

    // --- Font Loading and Initial Setup ---
    const fontLoader = new FontLoader();
    fontLoader.load(
      'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_regular.typeface.json',
      (font) => {
        recreateTextGeometry(font); // Initial creation
      }
    );
    
    // --- Animation & Interaction ---
    let hoverAnimation: any = null;
    let isHovering = false;

    const onMouseMove = (e: MouseEvent) => {
        if (!textMesh.current || !window.gsap || !isHovering) return;
        const rect = currentMount.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width; // 0 (left) to 1 (right)
        const y = (e.clientY - rect.top) / rect.height; // 0 (top) to 1 (bottom)
        // Centered values: -0.5 to 0.5
        const cx = x - 0.5;
        const cy = y - 0.5;
        // Animate rotation and position for immersive effect
        window.gsap.to(textMesh.current.rotation, {
            x: cy * 0.6,
            y: -cx * 0.8,
            duration: 0.4,
            ease: 'power2.out',
        });
        window.gsap.to(textMesh.current.position, {
            z: 5 + Math.abs(cx) * 2 + Math.abs(cy) * 2,
            duration: 0.4,
            ease: 'power2.out',
        });
    };

    const onMouseEnter = () => {
        isHovering = true;
    };
    const onMouseLeave = () => {
        isHovering = false;
        if (!textMesh.current || !window.gsap) return;
        // Animate back to neutral
        window.gsap.to(textMesh.current.rotation, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
        });
        window.gsap.to(textMesh.current.position, {
            z: 5,
            duration: 0.7,
            ease: 'power2.out',
        });
    };

    // --- GSAP Script Loading ---
    const gsapScript = document.createElement('script');
    gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    gsapScript.async = true;
    document.body.appendChild(gsapScript);
    
    gsapScript.onload = () => {
        currentMount.addEventListener('mouseenter', onMouseEnter);
        currentMount.addEventListener('mouseleave', onMouseLeave);
        currentMount.addEventListener('mousemove', onMouseMove);
    };

    // --- Render Loop & Resize ---
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      if (textMesh.current) updateTextPosition();
    };
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      currentMount.removeEventListener('mouseenter', onMouseEnter);
      currentMount.removeEventListener('mouseleave', onMouseLeave);
      currentMount.removeEventListener('mousemove', onMouseMove);
      if (renderer) currentMount.removeChild(renderer.domElement);
      
      const scripts = document.querySelectorAll('script[src*="gsap"]');
      scripts.forEach(s => document.body.removeChild(s));
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
    </div>
  );
};

export default Hero; 