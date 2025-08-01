'use client';
import React, { useEffect, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis'; //switch to gsap
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect as useLayoutEffect, useRef as useLayoutRef } from 'react';
import gsap from 'gsap';
import CustomCursor from './Cursor';

interface NavItemProps {
  primary: string;
  secondary: string;
  href?: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ primary, secondary, href, onClick }) => (
  <h1 className="text" onClick={onClick} style={{ cursor: onClick ? 'pointer' : undefined }}>
    {primary}
    <span>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {secondary}
        </a>
      ) : (
        secondary
      )}
    </span>
  </h1>
);

interface NavOverlapProps {
  onClose: () => void;
  closeIconPath?: string;
}

export default function NavOverlap({ onClose, closeIconPath }: NavOverlapProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const [menu, setMenu] = useState<'main' | 'products' | 'releases'>('main');
  const [visible, setVisible] = useState(true);
  const router = useRouter();
  const overlayRef = useLayoutRef<HTMLDivElement | null>(null);
  // Slide in on mount
  useLayoutEffect(() => {
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { x: '100%' });
      gsap.to(overlayRef.current, { x: 0, duration: 0.7, ease: 'power4.inOut' });
    }
  }, []);
  // Slide out on close
  const handleClose = () => {
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        x: '100%',
        duration: 0.7,
        ease: 'power4.inOut',
        onComplete: () => {
          setVisible(false);
          if (onClose) onClose();
        },
      });
    } else {
      setVisible(false);
      if (onClose) onClose();
    }
  };
  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <style jsx global>{`
        html,
        body,
        #__next {
          height: 100%;
          margin: 0;
          padding: 0;
        }
        body {
          min-height: 100vh;
          height: 100vh;

          overflow: hidden;
        }
        .fullscreen-nav {
          min-height: 100vh;
          height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
          background: #0d0d0d;
        }
        .nav-top-bar {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2vw 3vw 0 3vw;
          z-index: 1100;
        }
        .nav-back-btn,
        .nav-close-btn {
          background: rgba(238, 238, 238, 0.95);
          color: #0d0d0d;
          border: none;
          font-size: 1.8rem;
          overflow: hidden;
          font-weight: 700;
          border-radius: 0;
          padding: 0.2vw 1vw;
          cursor: pointer;
          transition: background 0.2s;
        }
        .nav-back-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .nav-close-btn {
          background: #222222;
          color: rgb(224, 224, 224);
        }
        .text {
          font-size: 16vw;
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 100%;
          margin: 0;
          width: 100vw;
          color: rgba(182, 182, 182, 0.2);
          background: linear-gradient(to right, #b6b6b6, #b6b6b6) no-repeat;
          -webkit-background-clip: text;
          background-clip: text;
          background-size: 100%;
          border-bottom: 1px solid #2f2b28;
          display: flex;
          flex-direction: column;
          align-items: start;
          justify-content: start;
          position: relative;
          padding: 1.5vw 0;
          text-align: left;
          font-family: 'Poppins', 'Inter', sans-serif;
          font-weight: bold;
          overflow-wrap: break-word;
          word-break: break-word;
          white-space: normal;
          box-sizing: border-box;
        }
        @media (min-width: 768px) {
          .text {
            font-size: 6vw;
          }
        }
        .text span {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: rgb(224, 0, 0);
          color: #0d0d0d;
          clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
          transform-origin: center;
          transition: all cubic-bezier(0.1, 0.5, 0.5, 1) 0.4s;
          display: flex;
          top: 0em;
          flex-direction: column;
          justify-content: end;
          align-items: end;
        }
        .text:hover > span {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
        }
        .text a {
          text-decoration: none;
          color: inherit;
        }
      `}</style>
      <div className="fullscreen-nav" ref={overlayRef} style={{ borderLeft: '3px solid #fff' }}>
        <div className="nav-top-bar">
          {/* Back button only in submenu */}
          <button
            className="nav-back-btn"
            style={{
              visibility: menu !== 'main' ? 'visible' : 'hidden',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              paddingLeft: 0,
            }}
            onClick={() => setMenu('main')}
            disabled={menu === 'main'}
          >
            <Image
              src="/assets/back.svg"
              alt="Web design back navigation icon for UI/UX and creative development"
              width={30}
              height={60}
            />
            <span>back</span>
          </button>
          {/* Close button always visible */}
          <button
            className="nav-close-btn"
            onClick={handleClose}
            aria-label="Close menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              paddingRight: 10,
              paddingLeft: 10,
              paddingTop: 5,
              paddingBottom: 5,
            }}
          >
            <span>close</span>
            {closeIconPath && (
              <Image
                src={closeIconPath.replace('.png', '.svg')}
                alt="Web design close navigation icon for UI/UX and creative development"
                width={54}
                height={30}
              />
            )}
          </button>
        </div>
        {menu === 'main' && (
          <>
            <NavItem primary="home" onClick={() => router.push('/')} secondary="enter" />
            <NavItem
              primary="services"
              onClick={() => router.push('/services')}
              secondary="enter"
            />
            <NavItem
              primary="onboard"
              onClick={() => router.push('/onboard')}
              secondary="/create"
            />
            <NavItem primary="works" onClick={() => router.push('/works')} secondary="enter" />
            <NavItem
              primary="products"
              onClick={() => router.push('/products')}
              secondary="enter"
            />
            <NavItem primary="about" secondary="/contact" onClick={() => router.push('/about')} />
            <NavItem primary="releases" secondary="enter" onClick={() => setMenu('releases')} />
          </>
        )}
        {menu === 'releases' && (
          <>
            <NavItem primary="blogs" onClick={() => router.push('/pam/blogs')} secondary="enter" />
            <NavItem primary="news" onClick={() => router.push('/pam/news')} secondary="enter" />
          </>
        )}
      </div>
    </>
  );
}

//labels for each products;
