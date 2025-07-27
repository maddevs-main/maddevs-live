"use client"; // Add this directive for Next.js App Router

import * as THREE from 'three';
import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, GroupProps } from '@react-three/fiber';
import { useIntersect, Image, ScrollControls, Scroll, Text } from '@react-three/drei';

// Define types for the component props
interface ItemProps extends GroupProps {
  url: string;
  scale: [number, number, number];
}

interface TextItemProps extends GroupProps {
  children: React.ReactNode;
}

// This is the component for each individual image, with corrected animation logic
function Item({ url, scale, ...props }: ItemProps) {
  const visible = useRef(false);
  const [hovered, hover] = useState(false);
  const ref = useIntersect<THREE.Mesh>((isVisible) => (visible.current = isVisible));
  const { height } = useThree((state) => state.viewport);

  useFrame((state, delta) => {
    if (ref.current) {
      // This animates the image's Y position relative to its parent group
      ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, visible.current ? 0 : -height / 2 + 1, 4, delta);
      const material = ref.current.material as any;
      // Added safety check: only animate material if it exists
      if (material) {
        material.zoom = THREE.MathUtils.damp(material.zoom, visible.current ? 1 : 1.5, 4, delta);
        material.grayscale = THREE.MathUtils.damp(material.grayscale, hovered ? 1 : 0, 4, delta);
      }
    }
  });

  return (
    <group {...props}>
      {/* TODO: For SEO, provide descriptive alt text for this image if/when @react-three/drei <Image> supports alt attributes. Example: alt={`3D scene image: ${url}`} */}
      <Image ref={ref} onPointerOver={() => hover(true)} onPointerOut={() => hover(false)} scale={scale} url={url} toneMapped={false} />
    </group>
  );
}

// Corrected component for the satellite text elements
function TextItem({ children, ...props }: TextItemProps) {
    const visible = useRef(false);
    const textRef = useRef<any>();
    const { height } = useThree((state) => state.viewport);
    const intersectRef = useIntersect<THREE.Group>((isVisible) => (visible.current = isVisible));
  
    useFrame((state, delta) => {
        if (textRef.current) {
            // Animate the text's Y position relative to its parent group
            textRef.current.position.y = THREE.MathUtils.damp(textRef.current.position.y, visible.current ? 0 : -height / 2 + 1, 4, delta);
            const material = textRef.current.material as any;
            // Added safety check: only animate material if it exists
            if (material) {
                material.fillOpacity = THREE.MathUtils.damp(material.fillOpacity, visible.current ? 1 : 0, 4, delta);
            }
        }
    });

    // The structure now mirrors the Item component: a group for position and a child for animation
    return (
        <group ref={intersectRef} {...props}>
            <Text ref={textRef} fontSize={0.5} letterSpacing={-0.05} color="black" renderOrder={1}>
                {children}
            </Text>
        </group>
    )
}


// The main App component, now with the 3D content logic integrated
export default function App() {
    // This component contains the 3D scene and can use R3F hooks
    function Content() {
        const { width: w, height: h } = useThree((state) => state.viewport);
        
        // A single array for all content ensures correct positioning within the scroll
        const content = [
            // Scene 1: Creative (Centered around HTML h1 at top: 100vh, right: 10vw)
            { type: 'image', url: "assets/media/services_hero.jpg", scale: [w / 3, w / 3, 1], position: [-w / 6, 0, 0] },
            { type: 'text', text: " ", position: [w / 6, -h * 0.1, 1] },
            { type: 'text', text: " ", position: [-w / 5, -h * 0.2, 1] },
            { type: 'text', text: " ", position: [w / 8, -h * 0.1, 1] },

            // Scene 2: Design (Centered around HTML h1 at top: 180vh, left: 10vw)
            { type: 'image', url: "assets/media/design_2.png", scale: [2, w / 3, 1], position: [w / 30, -h * 1.5, 0] },
            { type: 'image', url: "assets/media/design_1.png", scale: [w / 3, w / 5, 1], position: [-w / 4, -h * 1.8, 0] },
            { type: 'image', url: "https://placehold.co/600x600/e0e0e0/333?text=4", scale: [w / 5, w / 5, 1], position: [w / 4, -h * 2.1, 0] },
            { type: 'text', text: "experience", position: [-w / 2.8, -h * 0.85, 1] },
            { type: 'text', text: "expression", position: [-w / 3, -h * 1.0, 1] },
            { type: 'text', text: "empathy", position: [-w / 3.5, -h * 1.05, 1] },

            // Scene 3: Development (Centered around HTML h1 at top: 260vh, right: 6vw)
            { type: 'image', url: "https://placehold.co/600x800/e0e0e0/333?text=5", scale: [w / 4, w / 4, 1], position: [w / 10, -h * 2.75, 0] },
            { type: 'image', url: "https://placehold.co/800x800/e0e0e0/333?text=6", scale: [w / 3, w / 3, 1], position: [-w / 4, -h * 3.0, 0] },
            { type: 'text', text: "strategy", position: [w / 3, -h * 2.6, 1] },
            { type: 'text', text: "execution", position: [w / 3.5, -h * 2.75, 1] },
            { type: 'text', text: "iteration", position: [w / 3.2, -h * 2.9, 1] },

            // Scene 4: Products (Centered around HTML h1 at top: 350vh, left: 10vw)
            { type: 'image', url: "https://placehold.co/800x600/e0e0e0/333?text=7", scale: [w / 3, w / 5, 1], position: [-w / 4, -h * 3.6, 0] },
            { type: 'image', url: "https://placehold.co/1000x1000/e0e0e0/333?text=8", scale: [w / 2, w / 2, 1], position: [w / 4, -h * 4.0, 0] },
            { type: 'text', text: "innovation", position: [-w / 3.5, -h * 3.5, 1] },
            { type: 'text', text: "utility", position: [-w / 2.8, -h * 3.65, 1] },
            { type: 'text', text: "beauty", position: [-w / 3, -h * 3.8, 1] },
            
            // Scene 5: Retainer (Centered around HTML h1 at top: 420vh, right: 8vw)
            { type: 'image', url: "https://placehold.co/800x800/e0e0e0/333?text=9", scale: [w/3, w/3, 1], position: [-w/4, -h * 4.8, 0] },
            { type: 'text', text: "partnership", position: [w / 3, -h * 4.2, 1] },
            { type: 'text', text: "growth", position: [w / 4, -h * 4.3, 1] },
            { type: 'text', text: "support", position: [w / 3.2, -h * 4.4, 1] },

            // Scene 6: Onboard (Centered around HTML h1 at top: 500vh, left: 10vw)
            { type: 'image', url: "https://placehold.co/1000x800/e0e0e0/333?text=12", scale: [w / 2.5, w / 2, 1], position: [w / 6, -h * 5.5, 0] },
            { type: 'text', text: "integration", position: [-w / 3.5, -h * 5.0, 1] },
            { type: 'text', text: "welcome", position: [-w / 2.8, -h * 5.15, 1] },
            { type: 'text', text: "success", position: [-w / 3, -h * 5.3, 1] },
        ];

        return (
            <Scroll>
            {content.map((item, index) => {
                if (item.type === 'image') {
                    return <Item key={index} {...item as ItemProps} />;
                } else if (item.type === 'text') {
                    return <TextItem key={index} position={item.position as [number, number, number]}>{item.text}</TextItem>;
                }
                return null;
            })}
            </Scroll>
        );
    }

  return (
    
    <div style={{ height: '100vh', width: '100%', touchAction: 'none', overscrollBehavior: 'none' }}>
       
    
      <Canvas 
        orthographic 
        camera={{ zoom: 80 }} 
        gl={{ alpha: false, antialias: true, stencil: false, depth: false }} 
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#FAF7F3']} />
        {/* Increased pages to accommodate new scene */}
        <ScrollControls damping={1} pages={10}>
          <Suspense fallback={null}>
            <Content />
          </Suspense>
          <Scroll html style={{ width: '100%' }}>
          <h1 style={{ position: 'absolute', top: '40px', right: '40px', zIndex: 100, color: 'black', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 'bold' }}>
        /services
      </h1>
            {/* Reverted to original inline styles for HTML text */}
            <h1 style={{ position: 'absolute', top: `100vh`, right: '10vw', fontSize: 'clamp(1.5rem, 19vw, 10em)', transform: `translate3d(0,-100%,0)` }}>
              CREATIVE
            </h1>
            <h1 style={{ position: 'absolute', top: '180vh', left: '10vw', fontSize: 'clamp(1.5rem, 15vw, 10em)' }}>DESIGN</h1>
            
            <h1 style={{ position: 'absolute', top: '260vh', right: '6vw', fontSize: 'clamp(1.5rem, 12vw, 10em)' }}>DEVELOPMENT</h1>
            <h1 style={{ position: 'absolute', top: '350vh', left: '10vw', fontSize: 'clamp(1.5rem, 15vw, 10em)' }}>PRODUCTS</h1>
            <h1 style={{ position: 'absolute', top: '420vh', right: '8vw', fontSize: 'clamp(1.5rem, 15vw, 10em)' }}>RETAINER</h1>
            <h1 style={{ position: 'absolute', top: '500vh', left: '10vw', fontSize: 'clamp(1.5rem, 15vw, 10em)' }}>
              onboard
              <br />
            </h1>
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}

export const generateMetadata = async () => ({
  title: 'SERVICES MAIN PAGE TITLE HERE', // TODO: Fill in unique title
  description: 'SERVICES MAIN PAGE DESCRIPTION HERE', // TODO: Fill in unique description
});
