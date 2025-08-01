'use client';

import * as THREE from 'three';
import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useIntersect, Image } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import TextPlugin from 'gsap/TextPlugin';
import Script from 'next/script';

gsap.registerPlugin(TextPlugin);

// SEO Structured Data
const servicesData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'services/maddevs – creative web design & development',
  description:
    'Full-range creative and development services at maddevs—including web design, PWA development, AI-powered systems, e-commerce platforms, RBAC dashboards, and immersive UI/UX. Every experience is crafted for impact, flow, and precision.',
  provider: {
    '@type': 'Organization',
    name: 'maddevs',
    url: 'https://maddevs.in',
    description:
      'maddevs is a global creative tech studio. We design and build expressive websites, apps, tools, and integrations with high-end aesthetics and robust systems for worldwide clients.'
  },
  serviceType: [
    'Web Design',
    'Web Development',
    'AI Applications',
    'E-commerce Development',
    'PWA Development',
    'RBAC Dashboards',
    'UI/UX Design',
    'Authentication Systems',
    'Blog Platforms',
    'User Management Systems'
  ],
  areaServed: {
    '@type': 'Country',
    name: 'Worldwide'
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Web Design & Development Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Web Design',
          description: 'Creative and responsive web design services crafted for clarity and expression.'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Web Development',
          description: 'Full-stack web development using modern, scalable, and performant technologies.'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'AI Applications',
          description: 'AI-driven applications, models, and data systems tuned for intelligence and empathy.'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'E-commerce Development',
          description: 'Modular, secure, and scalable e-commerce platforms with integrated payments and custom flows.'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'PWA Development',
          description: 'Progressive Web App development optimized for speed, UX, and offline resilience.'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'RBAC Dashboards',
          description: 'Custom role-based access systems with granular permissions and data control.'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Authentication Systems',
          description: 'End-to-end authentication flows including SSO, social login, and 2FA.'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Blog Platforms',
          description: 'Scalable content systems and blog platforms with clean authoring and publishing pipelines.'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'User Management Systems',
          description: 'User lifecycle flows, onboarding, profiles, permissions, and admin tools.'
        }
      }
    ]
  }
};

// Lazy load components
const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-32 bg-gray-100 animate-pulse" />,
  ssr: true,
});

const VideoAutoPlay = dynamic(() => import('@/components/VideoAutoPlay'), {
  loading: () => <div className="h-screen bg-gray-100 animate-pulse" />,
  ssr: false,
});

// Define types for the component props
interface ItemProps {
  url: string;
  scale: [number, number, number];
  type: 'image' | 'video';
  position?: [number, number, number];
}

// This is the component for each individual image, with corrected animation logic
function Item({ url, scale, type = 'image', position }: ItemProps) {
  const visible = useRef(false);
  const [hovered, hover] = useState(false);
  const ref = useIntersect<THREE.Mesh>(isVisible => (visible.current = isVisible));
  const { height } = useThree(state => state.viewport);
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
      video.play().catch(() => { });
    }
  }, [type, video]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.position.y = THREE.MathUtils.damp(
        ref.current.position.y,
        visible.current ? 0 : -height / 2 + 1,
        4,
        delta
      );
      const material = ref.current.material as any;
      if (material) {
        material.zoom = THREE.MathUtils.damp(material.zoom, visible.current ? 1 : 1.5, 4, delta);
        material.grayscale = THREE.MathUtils.damp(material.grayscale, hovered ? 1 : 0, 4, delta);
      }
    }
  });

  return (
    <group position={position}>
      {type === 'image' ? (
        <Image
          ref={ref}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
          scale={[scale[0], scale[1]]}
          url={url}
          toneMapped={false}
        />
      ) : (
        // Video: Web development and design visual (no alt attribute, but consider adding captions for accessibility)
        <mesh
          ref={ref}
          scale={scale}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial toneMapped={false}>
            {video && <videoTexture attach="map" args={[video]} />}
          </meshBasicMaterial>
        </mesh>
      )}
    </group>
  );
}

function Content() {
  const { width: w, height: h } = useThree(s => s.viewport);

  // Mobile responsive scaling function
  const getResponsiveScale = (baseScale: number, mobileMultiplier: number = 1.8) => {
    // On mobile (small viewport), increase scale to maintain visibility
    return w < 10 ? baseScale * mobileMultiplier : baseScale;
  };

  // Mobile responsive positioning function
  const getResponsivePosition = (basePosition: number, mobileOffset: number = 0) => {
    // Adjust positioning for mobile to maintain proper alignment
    return w < 10 ? basePosition + mobileOffset : basePosition;
  };

  const items: ItemProps[] = [
    {
      type: 'image',
      url: '/assets/media/web_design_one.png',
      scale: [getResponsiveScale(w / 3, 1.8), getResponsiveScale(w / 3, 1.8), 1],
      position: [getResponsivePosition(-w / 6), 0, 0]
    },
    {
      type: 'image',
      url: '/assets/media/ui_ux_main.jpg',
      scale: [getResponsiveScale(2, 1.2), getResponsiveScale(w / 3, 1.8), 1],
      position: [getResponsivePosition(w / 30), -h * 1.6, 0]
    },
    {
      type: 'image',
      url: '/assets/media/web_design_two.png',
      scale: [getResponsiveScale(w / 3, 1.8), getResponsiveScale(w / 5, 2.2), 1],
      position: [getResponsivePosition(-w / 4), -h * 1.9, 0]
    },
    {
      type: 'image',
      url: '/assets/media/design_developement_website.jpg',
      scale: [getResponsiveScale(w / 5, 2.0), getResponsiveScale(w / 5, 2.0), 1],
      position: [getResponsivePosition(w / 4), -h * 2.2, 0]
    },
    {
      type: 'image',
      url: '/assets/media/web_development_website.png',
      scale: [getResponsiveScale(w / 4, 1.8), getResponsiveScale(w / 4, 1.8), 1],
      position: [getResponsivePosition(w / 10), -h * 3.2, 0]
    },
    {
      type: 'image',
      url: '/assets/media/web_development_gear_image.png',
      scale: [getResponsiveScale(w / 3, 1.8), getResponsiveScale(w / 3, 1.8), 1],
      position: [getResponsivePosition(-w / 4), -h * 3.5, 0]
    },
    {
      type: 'video',
      url: '/assets/media/web_development_design_products.mp4',
      scale: [getResponsiveScale(w / 3, 1.6), getResponsiveScale(w / 5, 2.0), 1],
      position: [getResponsivePosition(-w / 4), -h * 4.8, 0]
    },
    {
      type: 'image',
      url: '/assets/media/web_design_service.png',
      scale: [getResponsiveScale(w / 2, 1.4), getResponsiveScale(w / 2, 1.4), 1],
      position: [getResponsivePosition(w / 4), -h * 5.2, 0]
    },
    {
      type: 'video',
      url: '/assets/media/web_development_partner.mp4',
      scale: [getResponsiveScale(w / 1.5, 1.2), getResponsiveScale(w / 2.5, 1.6), 1],
      position: [getResponsivePosition(-w / 7), -h * 6.4, 0]
    },
    {
      type: 'image',
      url: '/assets/media/creative_consulting_onboard.jpg',
      scale: [getResponsiveScale(w / 2.5, 1.4), getResponsiveScale(w / 2, 1.6), 1],
      position: [getResponsivePosition(w / 6), -h * 8.0, 0]
    },
  ];

  return (
    <Scroll>
      {items.map((item, i) => (
        <Item key={i} {...item} />
      ))}
    </Scroll>
  );
}

function FooterContent() {
  const textRef = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);

  const texts = ['PUSHING.', 'CREATING.', 'DREAMING.', 'SEEKING.'];
  const longestText = texts.reduce((a, b) => (a.length > b.length ? a : b));

  useEffect(() => {
    let ctx: any;
    let timeline: any;
    let isMounted = true;

    const runTypewriter = () => {
      if (!textRef.current || !cursorRef.current) return;

      ctx = gsap.context(() => {
        timeline = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });

        texts.forEach((text: string) => {
          if (cursorRef.current) timeline.set(cursorRef.current, { opacity: 1 });
          timeline.to(textRef.current, {
            duration: text.length * 0.08,
            text: { value: text },
            ease: 'none',
            onStart: () => {
              if (textRef.current) (textRef.current as HTMLSpanElement).innerText = '';
            },
          });
          if (cursorRef.current) {
            timeline.to(
              cursorRef.current,
              { opacity: 0, repeat: 3, yoyo: true, duration: 0.3, ease: 'steps(1)' },
              '+=0.2'
            );
          }
          timeline.to(
            { val: text.length },
            {
              val: 0,
              duration: text.length * 0.06,
              ease: 'none',
              onUpdate: function (this: any) {
                if (textRef.current) {
                  (textRef.current as HTMLSpanElement).innerText = text.substring(
                    0,
                    Math.floor(this.targets()[0].val)
                  );
                }
              },
            },
            '+=0.2'
          );
          if (cursorRef.current) timeline.set(cursorRef.current, { opacity: 1 });
        });
      }, containerRef);
    };

    if (isMounted) runTypewriter();

    return () => {
      isMounted = false;
      if (ctx) ctx.revert();
      if (timeline) timeline.kill();
    };
  }, [texts]);

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: '#E4E0E1',
        color: '#222222',
        borderTop: '1px solid #222222',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '48px 32px' }}>
        <div style={{ position: 'relative', minHeight: '12vw' }}>
          <h2
            style={{
              visibility: 'hidden',
              margin: 0,
              padding: 0,
              fontSize: '12vw',
              fontWeight: '900',
              lineHeight: 0.8,
              letterSpacing: '-0.05em',
              textTransform: 'uppercase',
            }}
          >
            {longestText}
          </h2>
          <h2
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              margin: 0,
              padding: 0,
              textAlign: 'left',
              fontSize: '12vw',
              fontWeight: '900',
              lineHeight: 0.8,
              letterSpacing: '-0.05em',
              textTransform: 'uppercase',
              color: '#222222',
            }}
          >
            KEEP <span ref={textRef}></span>
            <span
              ref={cursorRef}
              style={{
                display: 'inline-block',
                verticalAlign: 'middle',
                width: '4px',
                height: '1em',
                backgroundColor: '#222222',
                opacity: 1,
                marginLeft: '8px',
                transition: 'opacity 0.1s',
              }}
            ></span>
          </h2>
        </div>

        <div style={{ paddingTop: '48px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div style={{ textAlign: 'left', paddingLeft: '0.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <a
                  href="https://www.instagram.com/maddevsgroup"
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    fontSize: 'clamp(14px, 1.8vw, 19px)',
                  }}
                >
                  Instagram
                </a>
                <a
                  href="error"
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    fontSize: 'clamp(14px, 1.8vw, 19px)',
                  }}
                >
                  Dribbble
                </a>
                <a
                  href="https://www.behance.net/maddevsgroup"
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    fontSize: 'clamp(14px, 1.8vw, 19px)',
                  }}
                >
                  Behance
                </a>
                <a
                  href="https://x.com/maddevsgroup"
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    fontSize: 'clamp(14px, 1.8vw, 19px)',
                  }}
                >
                  X
                </a>
              </div>
            </div>
            <div
              style={{
                fontSize: '15vw',
                fontWeight: 'bold',
                fontFamily: 'Inter, sans-serif',
                fontStyle: 'italic',
                color: '#222222',
                opacity: '0.2',
                justifySelf: 'center',
              }}
            >
              md.
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a
                  href="/works"
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    fontSize: 'clamp(14px, 1.8vw, 19px)',
                  }}
                >
                  WORKS
                </a>
                <a
                  href="/"
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    fontSize: 'clamp(14px, 1.8vw, 19px)',
                  }}
                >
                  HOME
                </a>
                <a
                  href="/services"
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    fontSize: 'clamp(14px, 1.8vw, 19px)',
                  }}
                >
                  SERVICES
                </a>
                <a
                  href="/products"
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    fontSize: 'clamp(14px, 1.8vw, 19px)',
                  }}
                >
                  PRODUCTS
                </a>
                <a
                  href="/onboard"
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    fontSize: 'clamp(14px, 1.8vw, 19px)',
                  }}
                >
                  ONBOARD
                </a>
                <a
                  href="/about"
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    fontSize: 'clamp(14px, 1.8vw, 19px)',
                  }}
                >
                  ABOUT
                </a>
                <a
                  href="/about#contact"
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    fontSize: 'clamp(14px, 1.8vw, 19px)',
                  }}
                >
                  CONTACT
                </a>
                <a
                  href="/pam/blogs"
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    fontSize: 'clamp(14px, 1.8vw, 19px)',
                  }}
                >
                  BLOGS
                </a>
                <a
                  href="/pam/news"
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    fontSize: 'clamp(14px, 1.8vw, 19px)',
                  }}
                >
                  NEWS
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          backgroundColor: '#222222',
          color: '#EEEEEE',
          padding: '16px 0',
          textAlign: 'center',
          fontSize: '0.9rem',
          marginTop: '48px',
        }}
      >
        © 2025 maddevs - All rights reserved.
      </div>
    </div>
  );
}

function OverlayUI() {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const buttonStyle: React.CSSProperties = {
    backgroundColor: 'black',
    color: 'white',
    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
    fontWeight: 'bold',
    boxShadow: hovered
      ? '2px 2px 0px 2px rgba(45, 44, 44, 0.3)'
      : '4px 4px 0px 2px rgba(45, 44, 44, 0.5)',
    transform: clicked
      ? 'translateY(2px) scale(0.97)'
      : hovered
        ? 'translateY(1px) scale(0.99)'
        : 'scale(1)',
    transition: 'all 0.15s ease',
    padding: '10px 20px',
    border: 'none',
    cursor: 'pointer',
  };

  // Mobile responsive section positioning
  const getResponsiveTop = (baseTop: string, mobileOffset: string = '0vh') => {
    // On mobile, adjust section positioning to align with larger images
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) {
      const baseValue = parseInt(baseTop);
      const offsetValue = parseInt(mobileOffset);
      return `${baseValue + offsetValue}vh`;
    }
    return baseTop;
  };

  const sections = [
    {
      top: getResponsiveTop('260vh', '20vh'),
      title: 'DESIGN',
      text: 'Your web expression, to express every grain of it intentionally. The visuals, the interfaces, the functions, and its movement, flow, and rhythm. Interfaces that disappear in the craft of experience, ensuring the desired experience—that is, your expression.'
    },
    {
      top: getResponsiveTop('425vh', '30vh'),
      title: 'DEVELOPMENT',
      text: 'We shape experiences through leveraging most precise technologies, whether pre-existing or inhouse—purposefully tuned and crafted for clarity, flow, and impact. Intelligent, empathetic and efficient systems, every detail aligned to feel intuitive and whole.'
    },
    {
      top: getResponsiveTop('570vh', '40vh'),
      title: 'PRODUCTS',
      text: 'We design independent empathy-led applications—solutions that fulfill their purpose while uplifting every surrounding function. Whether integrated or standalone, each is built to scale its cause. To keep ideas in motion, we craft our own products—systems that sustain momentum and spark meaningful impact. '
    },
    {
      top: getResponsiveTop('679vh', '50vh'),
      title: 'RETAINER',
      text: 'Once your web experience is live, it needs care to stay true to its measure—tech integrations, design evolutions, facelifts, health checks, SEO and SEA handling. At Delivery, we equip you with the insight to manage it—or stay on as collaborators, ensuring your experience evolves with intent. '
    },
    {
      top: getResponsiveTop('850vh', '60vh'),
      title: 'ONBOARD',
      text: "We handle all creative studio and tech consultancy, delivery, their finances, and every service through direct contact, through meetings, conversations and internal channels. We want to understand your idea, your need—what you truly seek. Every project is delicate, shaped through expression and tailored with precision. If you can feel it, step in. Let's begin."
    },
  ];

  return (
    <Scroll html style={{ width: '100%' }}>
      <h1
        style={{
          position: 'absolute',
          top: '80vh',
          right: '10vw',
          fontSize: 'clamp(1.5rem, 19vw, 10em)',
        }}
      >
        /services
      </h1>

      {sections.map((s, i) => (
        <React.Fragment key={i}>
          <h1
            style={{
              position: 'absolute',
              top: s.top,
              left: '10vw',
              fontSize: 'clamp(1.5rem, 15vw, 10em)',
              background: 'rgba(133,133,133,0.36)',
              color: 'black',
            }}
          >
            {s.title}
          </h1>

          <div
            style={{
              position: 'absolute',
              top: `calc(${s.top} + 10rem)`,
              left: '10vw',
              background: 'rgba(0,0,0,0.72)',
              color: '#ccc',
              padding: '20px',
              maxWidth: '350px',
              fontStyle: 'italic',
              fontSize: 'clamp(0.8rem, 1.5vw, 1.1rem)',
              lineHeight: 1.5,
              fontWeight: 300,
            }}
          >
            <p>{s.text}</p>
          </div>
        </React.Fragment>
      ))}

      <button
        onClick={() => {
          setClicked(true);
          setTimeout(() => {
            setClicked(false);
            router.push('/onboard');
          }, 150);
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'absolute',
          top: getResponsiveTop('880vh', '80vh'),
          right: '10vw',
          zIndex: 100,
          ...buttonStyle
        }}
      >
        /onboard
      </button>

      {/* Footer positioned at the very bottom */}
      <div
        style={{
          position: 'absolute',
          top: getResponsiveTop('900vh', '100vh'),
          left: 0,
          right: 0,
          width: '100%',
          height: '100vh',
        }}
      >
        <FooterContent />
      </div>
    </Scroll>
  );
}

export default function ServicesPage() {
  // Page load tracking
  useEffect(() => {
    const startTime = performance.now();
    console.log(
      "Welcome to maddevs, this page was designed and created by maddevs, visit 'https://www.maddevs.in' for further information"
    );

    // Disable global scroll progress bar for this page
    const scrollProgressBar = document.querySelector('[data-scroll-progress]');
    if (scrollProgressBar) {
      (scrollProgressBar as HTMLElement).style.display = 'none';
    }

    // Add page identifier to body for CSS targeting
    document.body.setAttribute('data-page', 'services');

    // Wait for Canvas and ScrollControls to be ready before initializing scroll
    const initializeScroll = () => {
      // Force scroll to top on page load
      window.scrollTo(0, 0);

      // Clear any existing scroll restoration
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }

      // Only prevent overscroll behavior, don't disable scrolling
      document.body.style.overscrollBehavior = 'none';
    };

    // Give ScrollControls time to initialize - increased delay
    setTimeout(initializeScroll, 500);

    // Also handle on route change
    const handleRouteChange = () => {
      setTimeout(initializeScroll, 500);
    };

    window.addEventListener('popstate', handleRouteChange);

    // Cleanup only GSAP ScrollTrigger instances that might conflict
    const cleanupConflictingScrolls = () => {
      // Only disable GSAP ScrollTrigger instances for this specific page
      if (typeof window !== 'undefined' && (window as any).ScrollTrigger) {
        const triggers = (window as any).ScrollTrigger.getAll();
        triggers.forEach((trigger: any) => {
          // Store original state to restore later
          trigger.setAttribute('data-services-page-disabled', 'true');
          trigger.disable();
        });
      }
    };

    // Run cleanup after ScrollControls has had time to initialize
    setTimeout(cleanupConflictingScrolls, 800);

    return () => {
      const endTime = performance.now();
      const loadTime = ((endTime - startTime) / 1000).toFixed(2);
      console.log(`The page loaded in ${loadTime} seconds`);

      // Re-enable scroll progress bar when leaving
      if (scrollProgressBar) {
        (scrollProgressBar as HTMLElement).style.display = '';
      }

      // Restore normal scroll behavior
      document.body.style.overscrollBehavior = '';
      document.body.removeAttribute('data-page');

      // Re-enable only the GSAP ScrollTrigger instances that were disabled by this page
      if (typeof window !== 'undefined' && (window as any).ScrollTrigger) {
        const triggers = (window as any).ScrollTrigger.getAll();
        triggers.forEach((trigger: any) => {
          if (trigger.getAttribute && trigger.getAttribute('data-services-page-disabled')) {
            trigger.enable();
            trigger.removeAttribute('data-services-page-disabled');
          }
        });
      }

      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-0">
      <style jsx global>{`
        /* Services page specific scroll isolation - minimal fix */
        body[data-page="services"] {
          overscroll-behavior: none !important;
        }
        
        /* Hide scroll progress bar only on services page */
        body[data-page="services"] [data-scroll-progress] {
          display: none !important;
        }
        
        /* Ensure canvas takes full space on services page */
        body[data-page="services"] canvas {
          display: block !important;
        }
        
        /* Prevent external scroll interference only on services page */
        html[data-page="services"] {
          overscroll-behavior: none !important;
        }
      `}</style>
      <Canvas
        orthographic
        camera={{ zoom: 80 }}
        gl={{ alpha: false, antialias: true }}
        dpr={[1, 1.5]}
        className="w-full h-full"
      >
        <color attach="background" args={['#DDDAD0']} />
        <ScrollControls damping={1} pages={9.68} enabled={true}>
          <Suspense fallback={null}>
            <Content />
            <OverlayUI />
          </Suspense>
        </ScrollControls>
      </Canvas>
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesData) }}
      />
    </div>
  );
}
