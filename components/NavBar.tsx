"use client";
import React, { useEffect, useRef, useState } from 'react';
import NavOverlap from './NavOverlap';

import { useRouter as useAppRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Define GSAP and ScrollTrigger on the global window object for TypeScript
declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}



// Main App component that renders the navbar


//make it feature the l=custom loading progress bar


export default function NavBar() {
  const appRouter = useAppRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);


  // Listen to scroll for hide/show navbar
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY && currentScrollY > 60) {
            setShowNav(false);
          } else {
            setShowNav(true);
          }
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close overlay on route change (App Router workaround)
  useEffect(() => {
    let lastPath = window.location.pathname;
    const interval = setInterval(() => {
      if (window.location.pathname !== lastPath) {
        lastPath = window.location.pathname;
        setMenuOpen(false);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
        
        body, html {
       

        }

        .navbar {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid white;
          align-items: center;
          padding: 0.2rem 0rem;
          background-color: rgba(34,34,34,0.7);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          box-sizing: border-box;
          z-index: 1000;
          transition: transform 0.35s cubic-bezier(.4,0,.2,1), background-color 0.3s;
          will-change: transform;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(10px);
        }
        .navbar:hover {
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          background-color: rgba(34,34,34,1);
          transition: backdrop-filter 0.3s, -webkit-backdrop-filter 0.3s, background-color 0.3s;
        }


 
        .navbar.hide {
          transform: translateY(-100%);
        }
        .navbar.show {
          transform: translateY(0);
        }
        .navbar-progress-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 3px;
          background: #fff;
          z-index: 1100;
          pointer-events: none;
        }
        .navbar-progress-bar {
          height: 100%;
          background: #222;
          transition: width 0.2s cubic-bezier(.4,0,.2,1);
        }
        .nav-left .nav-button,
        .nav-right .menu-button {
            border: none;
            padding: 0.2rem 0.8rem;
            border-radius: 0;
            cursor: pointer;
            font-weight: 700;
            transition: background-color 0.3s;
            font-size: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
            min-width: 80px;
            min-height: 36px;
            box-sizing: border-box;
            gap: 8px;
        }
        .nav-left .nav-button {
          background-color:rgba(224, 224, 224, 0);
          color:rgb(255, 255, 255);
          margin-left: 0px;
          color: white;
          font-weight: 100;
          text-transform: lowercase;
          letter-spacing: 0.5px;
        }
        .nav-left .nav-button:hover {
          background-color:rgb(63, 26, 26);
        }
        .nav-center .logo {
          font-family: 'Inter', sans-serif;
          font-style: italic;
          font-weight: 700;
          font-size: 2rem;
          color: #ffffff;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
          
        .nav-right .menu-button {
          background-color: rgba(255, 0, 0, 0);
          color: white;
          font-weight: 100;
          text-transform: lowercase;
          margin-right: 0px;
          letter-spacing: 0.5px;
        }
        .nav-right .menu-button:hover {
          background-color:rgb(45, 45, 45);
        }
        .nav-left .nav-button img, .nav-right .menu-button img {
          max-width: 28px;
          max-height: 28px;
        }
        .menu-text {
          display: inline;
        }
        @media (max-width: 639px) {
          .nav-right .menu-button {
            padding-right: 2.2rem;
              margin-right: -20px;
          }
          .nav-right .menu-button img {
            max-width: 62px;
            max-height: 52px;
          }


          
          .menu-text {
            display: none;
          }
          .nav-left .nav-button img {
            max-width: 44px;
            max-height: 44px;
          }
          .nav-left .nav-button {
            gap: 4px;
          }
        }
        @media (min-width: 640px) {
          .nav-left .nav-button, .nav-right .menu-button {
            font-size: 1.25rem;
            min-width: 120px;
            min-height: 48px;
            padding: 0.2vw 1.5vw;
            gap: 12px;
          }
          .nav-left .nav-button img, .nav-right .menu-button img {
            max-width: 62px;
            max-height: 52px;
          }
          .nav-center .logo {
            font-size: 2.5rem;
          }
          .menu-text {
            display: inline;
          }
        }

        /* Add this to style the link and prepare for the transition */
.nav-center .logo a {
  color: inherit; /* Inherits the white color from .logo */
  text-decoration: none;
  transition: text-shadow 0.35s cubic-bezier(.4,0,.2,1);
}

/* This creates the multi-layered glow effect on hover */
.nav-center .logo a:hover {
  text-shadow: 0 0 4px rgba(253, 245, 230, 0.5), /* Inner sharp glow (Creme color: #FDF5E6) */
               0 0 12px rgba(253, 245, 230, 0.4), /* Mid-level soft glow */
               0 0 24px rgba(253, 245, 230, 0.2);  /* Outer faint glow */
}

          @media (min-width: 450px) {
          .nav-left .nav-button, .nav-right .menu-button {
            font-size: 1.25rem;
            min-width: 120px;
            min-height: 48px;
            padding: 0.2vw 1.5vw;
            gap: 12px;
          }
          .nav-left .nav-button img, .nav-right .menu-button img {
            max-width: 62px;
            max-height: 52px;
          }
          .nav-center .logo {
            font-size: 2.5rem;
          }
          .menu-text {
            display: inline;
          }
        }


        @media (min-width: 1024px) {
          .nav-left .nav-button, .nav-right .menu-button {
            font-size: 1.5rem;
            min-width: 140px;
            min-height: 56px;
            gap: 1px;
          }
          .nav-left .nav-button img, .nav-right .menu-button img {
            max-width: 62px;
            max-height: 52px;
          }
          .nav-center .logo {
            font-size: 3rem;
          }
        }
      `}</style>
      
     
      <nav ref={navRef} className={`navbar${showNav ? ' show' : ' hide'}`}>
        <div className="nav-left">
          <button
            className="nav-button"
            onClick={() => appRouter.push('/onboard')}
          >
            <Image src="/assets/create.svg" alt="Web design create icon for UI/UX and creative development" width={52} height={62} />
            <span>create</span>
          </button>
        </div>
        <div className="nav-center">
          <div className="logo"><Link href="/">md.</Link></div>
        </div>
        <div className="nav-right">
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            
            <span className="menu-text">menu</span>
            <Image src="/assets/menu.svg" alt="Web design menu icon for UI/UX and creative development" width={62} height={52} />
          </button>
        </div>
      </nav>
      {menuOpen && <NavOverlap onClose={() => setMenuOpen(false)} closeIconPath="/assets/close.svg" />}
     
    </>
  );
}
