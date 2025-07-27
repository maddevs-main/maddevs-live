"use client"; // Add this directive for Next.js App Router

import * as THREE from 'three';
import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree, GroupProps } from '@react-three/fiber';
import { useIntersect, Image, ScrollControls, Scroll } from '@react-three/drei';
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";

// Lazy load components
const PageLayout = dynamic(() => import('@/components/Scrollbar').then(mod => ({ default: mod.PageLayout })), {
  loading: () => <div className="h-screen bg-gray-100 animate-pulse" />,
  ssr: false
});

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-32 bg-gray-100 animate-pulse" />,
  ssr: true
});

const VideoAutoPlay = dynamic(() => import('@/components/VideoAutoPlay'), {
  loading: () => <div className="h-screen bg-gray-100 animate-pulse" />,
  ssr: false
});

// Define types for the component props
interface ItemProps extends GroupProps {
  url: string;
  scale: [number, number, number];
  type: 'image' | 'video';
  position?: [number, number, number];
}

// This is the component for each individual image, with corrected animation logic
function Item({ url, scale, type = 'image', position, ...props }: ItemProps) {
  const visible = useRef(false);
  const [hovered, hover] = useState(false);
  const ref = useIntersect<THREE.Mesh>((isVisible) => (visible.current = isVisible));
  const { height } = useThree((state) => state.viewport);
  // For video
  const [video] = useState(() => {
    if (type === 'video') {
      const vid = document.createElement('video');
      vid.src = url;
      vid.crossOrigin = 'Anonymous';
      vid.loop = true;
      vid.muted = true;
      vid.playsInline = true;
      vid.preload = 'auto';
      vid.autoplay = true;
      return vid;
    }
    return null;
  });
  useEffect(() => {
    if (type === 'video' && video) {
      video.play().catch(() => {});
    }
  }, [type, video]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, visible.current ? 0 : -height / 2 + 1, 4, delta);
      const material = ref.current.material as any;
      if (material) {
        material.zoom = THREE.MathUtils.damp(material.zoom, visible.current ? 1 : 1.5, 4, delta);
        material.grayscale = THREE.MathUtils.damp(material.grayscale, hovered ? 1 : 0, 4, delta);
      }
    }
  });

  return (
    <group {...props} position={position}>
      {type === 'image' ? (
        <Image ref={ref} onPointerOver={() => hover(true)} onPointerOut={() => hover(false)} scale={[scale[0], scale[1]]} url={url} toneMapped={false} alt={`Web development and design visual: ${url}`} />
      ) : (
        // Video: Web development and design visual (no alt attribute, but consider adding captions for accessibility)
        <mesh ref={ref} scale={scale} onPointerOver={() => hover(true)} onPointerOut={() => hover(false)}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial toneMapped={false}>
            {video && <videoTexture attach="map" args={[video]} />}
          </meshBasicMaterial>
        </mesh>
      )}
    </group>
  );
}

// Metadata is now in page.metadata.ts (server-only)
// The main App component, now with the 3D content logic integrated
export default function App() {

  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
      router.push('/onboard');
    }, 150); // quick scale click feedback
  };


  const baseZ = 100;
  const currentZ = isClicked ? baseZ - 20 : isHovered ? baseZ - 5 : baseZ;
  const boxShadow = isClicked
    ? 'none'
    : isHovered
    ? '2px 2px 0px 2px rgba(45, 44, 44, 0.3)'
    : '4px 4px 0px 2px rgba(45, 44, 44, 0.5)';
  const transform = isClicked
    ? 'translateY(2px) scale(0.97)'
    : isHovered
    ? 'translateY(1px) scale(0.99)'
    : 'translateY(0px) scale(1)';

  // This component contains the 3D scene and can use R3F hooks
  function Content() {
    const { width: w, height: h } = useThree((state) => state.viewport);
    const isMobile = w < 8; // Breakpoint for mobile view

    // The content array now has responsive scaling for mobile.
    // Each section is spaced out by approximately h * 1.6 (or 160vh).
    const content: ItemProps[] = [
      // Scene 1: Creative (Starts at y=0, which corresponds to top: 100vh)
      { type: 'image', url: 'assets/media/design_1.png', scale: isMobile ? [w * 0.8, w * 0.8, 1] : [w / 3, w / 3, 1], position: [-w / 6, 0, 0] },

      // Scene 2: Design (Starts at y = -h * 1.6, corresponding to top: 260vh)
      { type: 'image', url: 'assets/media/services_hero.jpg', scale: isMobile ? [w * 0.5, w * 0.7, 1] : [2, w / 3, 1], position: [w / 30, -h * 1.6, 0] },
      { type: 'image', url: 'assets/media/design_2.png', scale: isMobile ? [w * 0.8, w * 0.48, 1] : [w / 3, w / 5, 1], position: [-w / 4, -h * 1.9, 0] },
      { type: 'image', url: 'assets/media/wood.jpg', scale: isMobile ? [w * 0.6, w * 0.6, 1] : [w / 5, w / 5, 1], position: [w / 4, -h * 2.2, 0] },

      // Scene 3: Development (Starts at y = -h * 3.2, corresponding to top: 420vh)
      { type: 'image', url: 'assets/media/dev_2.jpg', scale: isMobile ? [w * 0.6, w * 0.6, 1] : [w / 4, w / 4, 1], position: [w / 10, -h * 3.2, 0] },
      { type: 'image', url: 'assets/media/gears.png', scale: isMobile ? [w * 0.8, w * 0.8, 1] : [w / 3, w / 3, 1], position: [-w / 4, -h * 3.5, 0] },

      // Scene 4: Products (Starts at y = -h * 4.8, corresponding to top: 580vh)
      { type: 'video', url: 'assets/media/products.mp4', scale: isMobile ? [w * 0.8, w * 0.48, 1] : [w / 3, w / 5, 1], position: [-w / 4, -h * 4.8, 0] },
      { type: 'image', url: 'assets/media/products_2.png', scale: isMobile ? [w * 0.9, w * 0.9, 1] : [w / 2, w / 2, 1], position: [w / 4, -h * 5.2, 0] },
      
      // Scene 5: Retainer (Starts at y = -h * 6.4, corresponding to top: 740vh)
      { type: 'video', url: 'assets/media/retainer.mp4', scale: isMobile ? [w * 0.8, w * 0.48, 1] : [w/1.5, w/2.5, 1], position: [-w/7, -h * 6.4, 0] },

      // Scene 6: Onboard (Starts at y = -h * 8.0, corresponding to top: 900vh)
      { type: 'image', url: 'assets/media/door.jpg',  scale: isMobile ? [w * 0.9, w * 0.72, 1] : [w / 2.5, w / 2, 1], position: [w / 6, -h * 8.0, 0] },
    ];

    return (
      <Scroll>
        {content.map((item, index) => (
          <Item key={index} {...item} />
        ))}
      </Scroll>
    );
  }

  // Style for the informational paragraph boxes
  const infoBoxStyle: React.CSSProperties = {
    position: 'absolute',
    padding: '20px',
    background: 'rgba(0, 0, 0, 0.03)', // Off-tone background
    borderRadius: '5px',
    fontStyle: 'italic',
    fontWeight: 300, // Thin font
    fontSize: 'clamp(0.8rem, 1.5vw, 1.1rem)',
    color: '#333333',
    maxWidth: '350px',
    lineHeight: '1.5',
    zIndex: 100,
  };

  return (
    <div style={{ height: '100vh', width: '100%', touchAction: 'none', overscrollBehavior: 'none' }}>
      <div className="sr-only">3D visuals: web development and design scenes, creative digital experiences, SaaS, AI, and product showcases</div>
      {/* SEO: Main headline for the page */}
      <h1>SERVICES PAGE TITLE HERE</h1> {/* TODO: Match this to the title above */}
      {/* SEO: Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service', // TODO: Use a more specific type if possible
            'name': 'SERVICES PAGE TITLE HERE', // TODO: Match this to the title above
            // ...add more fields as needed
          }),
        }}
      />

      <Canvas
        orthographic
        camera={{ zoom: 80 }}
        gl={{ alpha: false, antialias: true, stencil: false, depth: false }}
        dpr={[1, 1.5]}
      >
        
        <color attach="background" args={['#DDDAD0']} />
        {/* Reduced pages to accommodate the new, smaller spacing */}
        <ScrollControls damping={1} pages={10}>
          <Suspense fallback={null}>
            <Content />
          </Suspense>
          <Scroll html style={{ width: '100%' }}>
     
            <h1 style={{ position: 'absolute', top: '80px', right: '40px', zIndex: 100, color: 'black', fontSize: 'clamp(1.5rem, 4vw, 5.5rem)', fontWeight: 'bold', fontFamily: 'Inter, sans-serif' }}>
        
            </h1>
            
            {/* Section 1: Creative - Starts at 100vh */}
            <h1 style={{ position: 'absolute', top: `80vh`, right: '10vw', fontSize: 'clamp(1.5rem, 19vw, 10em)', transform: `translate3d(0,-100%,0)`, fontFamily: 'Inter, sans-serif' }}>
              /services
            </h1>
         
          

            {/* Section 2: Design - Starts at 260vh (160vh spacing) */}
            <h1 style={{ position: 'absolute', top: '260vh', left: '10vw', fontSize: 'clamp(1.5rem, 15vw, 10em)', fontFamily: 'Inter, sans-serif' }}>DESIGN</h1>
            <div style={{ ...infoBoxStyle, top: 'calc(260vh + 12rem)', left: '10vw' }}>
                <p>
                Your web expression, to express every grain of it intentionally. The visuals, the interfaces, the functions, and its movement, flow, and rhythm. Interfaces that disappear in the craft of experience, ensuring the desired experience—that is, your expression.                  
                  
                  </p>
            </div>
            
            {/* Section 3: Development - Starts at 420vh (160vh spacing) */}
            <h1 style={{ position: 'absolute', top: '439vh', right: '6vw', fontSize: 'clamp(1.5rem, 12vw, 10em)' }}>DEVELOPMENT</h1>
            <div style={{ ...infoBoxStyle, top: 'calc(405vh + 10rem)', right: '6vw' }}>
                <p>
                We shape experiences through leveraging most precise technologies, whether pre-existing or inhouse—purposefully tuned and crafted for clarity, flow, and impact. Intelligent, empathetic and efficient systems, every detail aligned to feel intuitive and whole.                  </p>
            </div>

            {/* Section 4: Products - Starts at 580vh (160vh spacing) */}
            <h1 style={{ position: 'absolute', top: '570vh', left: '10vw', fontSize: 'clamp(1.5rem, 15vw, 10em)' }}>PRODUCTS</h1>
            <div style={{ ...infoBoxStyle, top: 'calc(570vh + 12rem)', left: '10vw' }}>
           

               
                <p>
                We design independent empathy-led applications—solutions that fulfill their purpose while uplifting every surrounding function. Whether integrated or standalone, each is built to scale its cause. To keep ideas in motion, we craft our own products—systems that sustain momentum and spark meaningful impact.                  </p>
            </div>

            {/* Section 5: Retainer - Starts at 740vh (160vh spacing) */}
            <h1 style={{ position: 'absolute', top: '739vh', right: '8vw', fontSize: 'clamp(1.5rem, 15vw, 10em)' }}>RETAINER</h1>
            <div style={{ ...infoBoxStyle, top: 'calc(710vh + 6rem)', right: '8vw' }}>
                <p>
                Once your web experience is live, it needs care to stay true to its measure—tech integrations, design evolutions, facelifts, health checks, SEO and SEA handling. At Delivery, we equip you with the insight to manage it—or stay on as collaborators, ensuring your experience evolves with intent.                  </p>
            </div>

            {/* Section 6: Onboard - Starts at 900vh (160vh spacing) */}
            <h1 style={{ position: 'absolute', top: '850vh', left: '10vw', fontSize: 'clamp(1.5rem, 15vw, 10em)' }}>
              ONBOARD
            </h1>
            <div style={{ ...infoBoxStyle, top: 'calc(850vh + 12rem)', left: '10vw' }}>
               <p>
                We handle all creative studio and tech consultancy, delivery, their finances, and every service through direct contact, through meetings, conversations and internal channels. We want to understand your idea, your need—what you truly seek. Every project is delicate, shaped through expression and tailored with precision. If you can feel it, step in. <span className=' text-black'>Let's begin.</span>
               </p>
            
            </div>
            <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        top: '860vh',
        right: '10vw',
        zIndex: currentZ,
        backgroundColor: 'black',
        color: 'white',
        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
        fontWeight: 'bold',
        boxShadow,
        transform,
        transition: 'all 0.15s ease',
        cursor: 'pointer',
      }}
    >
      /onboard
    </button>
           
          </Scroll>
        </ScrollControls>

      </Canvas>
      <div> <Footer /></div>
    </div>
    
  
  );
}
