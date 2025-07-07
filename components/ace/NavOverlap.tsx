import React, { useEffect, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';

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

export default function NavOverlap() {
  const lenisRef = useRef<Lenis | null>(null);
  const [menu, setMenu] = useState<'main' | 'products'>('main');
  const [visible, setVisible] = useState(true);

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
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap');
        html, body, #__next {
          height: 100%;
          margin: 0;
          padding: 0;
        }
        body {
          min-height: 100vh;
          height: 100vh;
          font-family: 'Poppins', sans-serif;
          background-color: #0D0D0D;
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
          background: #0D0D0D;
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
        .nav-back-btn, .nav-close-btn {
          background: rgba(238,238,238,0.95); 
          color: #0D0D0D;
          border: none;
          font-size: 1.2rem;
          overflow: hidden;
          
          font-weight: 700;
          border-radius: 0;
          padding: 0.7vw 2vw;
          cursor: pointer;
          transition: background 0.2s;
          
        }
        .nav-back-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .nav-close-btn {
          background: #b6b6b6;
          color: #0D0D0D;
        }
        .text {
          font-size: 9vw;
          font-weight: 700;
          letter-spacing: -.01em;
          line-height: 100%;
          margin: 0;
          width: 100vw;
          color: rgba(182, 182, 182, 0.2);
          background: linear-gradient(to right, #b6b6b6, #b6b6b6) no-repeat;
          -webkit-background-clip: text;
          background-clip: text;
          background-size: 100%;
          border-bottom: 1px solid #2F2B28;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 2vw 0;
          text-align: center;
          font-family: 'Poppins', sans-serif;
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
          background-color: #EEEEEE;
          color: #0D0D0D;
          clip-path: polygon(0 50%, 100% 50%, 100% 50%, 0 50%);
          transform-origin: center;
          transition: all cubic-bezier(.1,.5,.5,1) 0.4s;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .text:hover > span {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
        }
        .text a {
          text-decoration: none;
          color: inherit;
        }
      `}</style>
      <div className="fullscreen-nav">
        <div className="nav-top-bar">
          {/* Back button only in submenu */}
          <button
            className="nav-back-btn"
            style={{ visibility: menu === 'products' ? 'visible' : 'hidden' }}
            onClick={() => setMenu('main')}
            disabled={menu !== 'products'}
          >
            back
          </button>
          {/* Close button always visible */}
          <button
            className="nav-close-btn"
            onClick={() => setVisible(false)}
            aria-label="Close menu"
          >
          close
          </button>
        </div>
        {menu === 'main' && (
          <>
            <NavItem primary="HOME" secondary="ENTER" />
            <NavItem primary="SERVICES" secondary="ENTER" />
            <NavItem primary="ONBOARD" secondary="/LETS CREATE" />
            <NavItem primary="RELEASES" secondary="ENTER" />
            <NavItem
              primary="ABOUT"
              secondary="/CONTACT"
              href="https://stacksorted.com/text-effects/minh-pham"
            />
            <NavItem
              primary="PRODUCTS"
              secondary="ENTER"
              onClick={() => setMenu('products')}
            />
          </>
        )}
        {menu === 'products' && (
          <>
            <NavItem primary="PAM-THE RECEPTIONIST" secondary="COMING SOON" />
            
          </>
        )}
      </div>
    </>
  );
}

//labels for each products; 