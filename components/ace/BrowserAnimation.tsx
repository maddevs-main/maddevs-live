"use client"

import React, { useEffect, useRef } from 'react';
import styles from './BrowserAnimation.module.css';

const BrowserAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);
  const handRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const faceRef = useRef<SVGSVGElement>(null);

  const initializeAnimation = () => {
    if (typeof window === 'undefined' || !window.gsap) return;

    const gsap = window.gsap;
    const Flip = window.Flip;
    const ScrollTrigger = window.ScrollTrigger;
    const MorphSVGPlugin = window.MorphSVGPlugin;

    // Register plugins
    gsap.registerPlugin(Flip, ScrollTrigger, MorphSVGPlugin);

    const items = itemsRef.current;
    if (!items) return;

    let flipping = false;
    let count = 0;

    // Face bits!
    const faceBits = [
      '.left-eye',
      '.left-pupil',
      '.left-upper-lid',
      '.left-lower-lid',
      '.right-eye',
      '.right-pupil',
      '.right-upper-lid',
      '.right-lower-lid',
      '.mouth',
      '.teeth'
    ];

    // Convert all the svg shapes into paths for the SVGMorph plugin
    faceBits.forEach(bit => {
      if (MorphSVGPlugin && MorphSVGPlugin.convertToPath) {
        MorphSVGPlugin.convertToPath(bit);
      }
    });

    // Setting up a GSAP timeline for scroll animation
    const scroll = gsap.timeline({
      scrollTrigger: {
        scrub: 0.5,
        trigger: footerRef.current,
        start: "bottom bottom",
        end: "top 55%",
      },
      onComplete: () => addMore()
    });

    // Add face morphing animations
    for (let i = 1; i <= 2; i++) {
      faceBits.forEach(bit => {
        scroll.to(`.face ${bit}`, {
          morphSVG: `#face-step-${i} ${bit}`,
          duration: 1,
          ease: 'none'
        }, i - 1);
      });
    }

    // Add empty animation at the end
    scroll.to('footer', { duration: 0.3 }, 2);

    // Loading spinner animation
    gsap.from(".loading", {
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 55%",
        toggleActions: "play none none reset",
      },
      scale: 0,
      duration: 0.3,
      ease: "back.out"
    });

    // Hand animation
    gsap.from(".hand", {
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 57%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          count++;
          if (handRef.current) {
            handRef.current.dataset.type = (count <= 1 || Math.random() < 0.8) ? 'wave' : 'cookie';
          }
        }
      },
      scale: 0.3,
      opacity: 0,
      duration: 0.4,
      y: 200,
      ease: "back.out"
    });

    function addMore() {
      if (!flipping) {
        flipping = true;
        Flip.killFlipsOf('[data-flip]', true);
        createItems();
        const state = Flip.getState('[data-flip]');
        prepForFlip();
        ScrollTrigger.refresh();
        Flip.from(state, {
          duration: 0.7,
          ease: "bounce.out",
          onComplete: () => {
            flipping = false;
            if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) addMore();
          },
          onEnter: (elements: any) => gsap.fromTo(elements, 
            { xPercent: -120, opacity: 1 }, 
            { xPercent: 0, opacity: 1, delay: 0.1, duration: 0.5, stagger: 0.1, ease: "back.out" }
          )
        });
      }
    }

    function createItems() {
      if (!items) return;
      for (let i = 0; i < 4; i++) {
        const p = document.createElement("p");
        const li = document.createElement("li");
        
        li.dataset.flip = '';
        li.className = 'flipping';

        li.appendChild(p);
        items.appendChild(li);
      }
    }

    function prepForFlip() {
      if (!items) return;
      items.querySelectorAll('[data-flip]').forEach((item: any) => {
        item.classList.remove('flipping');
        delete item.dataset.flip;
      });
    }
  };

  useEffect(() => {
    // Load GSAP from CDN
    const loadGSAP = async () => {
      if (typeof window !== 'undefined' && !window.gsap) {
        const gsapScript = document.createElement('script');
        gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
        gsapScript.onload = () => {
          // Load GSAP plugins
          const flipScript = document.createElement('script');
          flipScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/Flip.min.js';
          flipScript.onload = () => {
            const morphScript = document.createElement('script');
            morphScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/MorphSVGPlugin.min.js';
            morphScript.onload = () => {
              const scrollTriggerScript = document.createElement('script');
              scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
              scrollTriggerScript.onload = () => {
                // Initialize the animation
                initializeAnimation();
              };
            };
          };
        };
        document.head.appendChild(gsapScript);
      } else if (window.gsap) {
        initializeAnimation();
      }
    };

    loadGSAP();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
      {/* SVG defs for face morphing */}
      <svg style={{ display: 'none' }} width="0" height="0" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <g id="face-step-1">
            <ellipse className="left-eye" cx="59.5" cy="59.001" rx="26.5" ry="37" fill="#fff"/>
            <ellipse className="right-eye" cx="131.5" cy="59.001" rx="26.5" ry="37" fill="#fff"/>
            <circle className="left-pupil" cx="59.5" cy="43.501" r="13.5" fill="#884578"/>
            <circle className="right-pupil" cx="131.5" cy="43.501" r="13.5" fill="#884578"/>
            <ellipse className="left-lower-lid" cx="62.367" cy="95.453" rx="46.487" ry="19.5" transform="rotate(-20.356 62.367 95.453)" fill="#C794BB"/>
            <ellipse className="left-upper-lid" rx="42.306" ry="14.491" transform="matrix(.96216 -.27248 .43717 .89938 47.04 24.56)" fill="#C794BB"/>
            <ellipse className="right-lower-lid" cx="130.194" cy="94.537" rx="46.487" ry="19.5" transform="rotate(17.442 130.194 94.537)" fill="#C794BB"/>
            <ellipse className="right-upper-lid" rx="42.508" ry="14.387" transform="matrix(.9694 .24552 -.39868 .9171 145.057 26.028)" fill="#C794BB"/>
            <path className="mouth" d="M98 114c-14.5 0-37 3-49 14.5 6.5 5 16.5 13.5 28 6.5s26-6 41.5 0c8.406 3.254 18.5-3 23.5-10-18-11-29.5-11-44-11Z" fill="#884578"/>
            <path className="teeth" d="M57 117a6 6 0 0 1 6-6h66a6 6 0 0 1 6 6v1.463c0 4.65-5.322 7.992-9.781 6.671-6.5-1.926-16.24-3.848-29.219-3.848-12.98 0-22.719 1.922-29.219 3.848-4.46 1.321-9.781-2.021-9.781-6.671V117Z" fill="#fff"/>
          </g>

          <g id="face-step-2">
            <ellipse className="left-eye" cx="59.5" cy="70" rx="26.5" ry="37" fill="#fff"/>
            <ellipse className="right-eye" cx="131.5" cy="70" rx="26.5" ry="37" fill="#fff"/>
            <circle className="left-pupil" cx="60" cy="72" r="15" fill="#884578"/>
            <circle className="right-pupil" cx="132" cy="72" r="15" fill="#884578"/>
            <ellipse className="left-lower-lid" cx="54.367" cy="122.452" rx="46.487" ry="19.5" transform="rotate(22.398 54.367 122.452)" fill="#C794BB"/>
            <ellipse className="left-upper-lid" rx="44.124" ry="10.325" transform="matrix(.98775 -.15603 .65697 .75392 50.367 15.669)" fill="#C794BB"/>
            <ellipse className="right-lower-lid" cx="140.194" cy="121.537" rx="46.487" ry="19.5" transform="rotate(-15 140.194 121.537)" fill="#C794BB"/>
            <ellipse className="right-upper-lid" rx="44.559" ry="9.991" transform="matrix(.99017 .13989 -.6147 .78876 143.314 16.545)" fill="#C794BB"/>
            <path className="mouth" d="M94 130c-36 0-49.5-9-61-3-9.5 4.957 9.5 36.5 31.5 46 17.48 7.548 41.258 7.727 58 0 19.5-9 42-41.444 34-45-13.5-6-26.5 2-62.5 2Z" fill="#884578"/>
            <path className="teeth" d="M39 117a6 6 0 0 1 6-6h101a6 6 0 0 1 6 6v10.614c0 2.612-1.689 4.9-4.233 5.489C140.278 134.835 122.856 138 95.5 138s-44.778-3.165-52.267-4.897c-2.544-.589-4.233-2.877-4.233-5.489V117Z" fill="#fff"/>
          </g>
        </defs>
      </svg>

      <div className={styles.browser} ref={containerRef}>
       
        <div className={styles.browserElements}>
    
          <div className={styles.topBar}>
        
            <div className={styles.points}>
              <span className={styles.point}></span>
              <span className={styles.point}></span>
              <span className={styles.point}></span>
            </div>
          </div>
          <div className="scroll-bar">
            <div className="bar"></div>
          </div>
        </div>
        <div className={`${styles.page} ${styles.contentSpacing}`}>
          <div data-flip className={styles.pageBackground}></div>
          <header className={styles.header}></header>
          <ul className={`${styles.items} ${styles.contentSpacing}`} ref={itemsRef}>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <div className={styles.loading}><span className={styles.spinner}></span></div>
          <footer data-flip className={styles.footer} ref={footerRef}>
            <svg className={`${styles.face} face`} ref={faceRef} viewBox="0 0 194 194" width="194" height="194" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <clipPath id="teethMask">
                  <path className="mouth" d="M98.5 154c-10 0-18.5 3.5-35 13.071C69 173 70.5 166 83 160.5s24-4 31.5 0S128 171 132 165c-14.5-8-23.5-11-33.5-11Z" fill="#884578"/>
                </clipPath>
              </defs>
              <ellipse className="left-eye" cx="59.5" cy="109" rx="26.5" ry="37" fill="#fff"/>
              <ellipse className="right-eye" cx="131.5" cy="109" rx="26.5" ry="37" fill="#fff"/>
              <circle className="left-pupil" cx="59.5" cy="123.5" r="13.5" fill="#884578"/>
              <circle className="right-pupil" cx="131.5" cy="123.5" r="13.5" fill="#884578"/>
              <ellipse className="left-lower-lid" cx="54.367" cy="152.453" rx="46.487" ry="19.5" transform="rotate(-20.356 54.367 152.453)" fill="#C794BB"/>
              <ellipse className="left-upper-lid" cx="50.367" cy="81.453" rx="46.487" ry="19.5" transform="rotate(-20.356 50.367 81.453)" fill="#C794BB"/>
              <ellipse className="right-lower-lid" cx="140.194" cy="151.537" rx="46.487" ry="19.5" transform="rotate(17.442 140.194 151.537)" fill="#C794BB"/>
              <ellipse className="right-upper-lid" cx="143.314" cy="83.511" rx="46.487" ry="19.5" transform="rotate(18.357 143.314 83.51)" fill="#C794BB"/>
              <path className="mouth" d="M98.5 154c-10 0-18.5 3.5-35 13.071C69 173 70.5 166 83 160.5s24-4 31.5 0S128 171 132 165c-14.5-8-23.5-11-33.5-11Z" fill="#884578"/>
              <path className="teeth" clipPath="url(#teethMask)" d="M62.5 136a6 6 0 0 1 6-6h57a6 6 0 0 1 6 6v9a6 6 0 0 1-6 6h-57a6 6 0 0 1-6-6v-9Z" fill="#fff"/>
            </svg>
            <div className={`${styles.hand} hand`} data-type ref={handRef}>
              <svg className={`${styles.handType} ${styles.handWave} hand-wave`} viewBox="0 0 126 115" width="126" height="115" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.882 56.862c-1.525 6.843-.838 20.375 3.335 30.087 4.172 9.712 14.813 19.839 22.393 24.083s19.868 3.753 28.056 0c8.187-3.753 19.207-13.67 25.999-24.083l29.5-35.644c3-4.26 8.5-11.26 3-15.76s-12 .5-15.5 4.5L86.482 62.37s-2.317 1.675-3.6 0c-1.281-1.675 0-3.298 0-3.298l29.783-42.027c2.5-4 2.999-9.757-1.001-12.5-3.999-2.744-9.5-1.5-12.753 3.802L72.3 49.94s-2.135 3.606-4.633 1.923c-2.5-1.683 0-4.517 0-4.517l17.64-31.864c3.859-7.134 1.359-11.936-2.641-13.936s-10 .5-13 5.5c0 0-18.5 33.5-22 40s-10.42 10.79-13.49 4.26c-3.072-6.53-1.927-14.867-8.53-20.81-9.737-8.761-19.786-6.727-24.98 2.55 5.764 5.152 12.122 15.264 10.216 23.817Z" fill="#9D608F"/>
              </svg>
              <svg className={`${styles.handType} ${styles.handCookie} hand-cookie`} viewBox="0 0 118 115" width="118" height="122" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="64.869" cy="52.5" r="52.5" fill="#E6B66C"/>
                <ellipse cx="42.869" cy="28" rx="7.5" ry="8" fill="#87624A"/>
                <ellipse cx="82.869" cy="33" rx="7.5" ry="8" fill="#87624A"/>
                <ellipse cx="51.869" cy="80" rx="7.5" ry="8" fill="#87624A"/>
                <ellipse cx="72.869" cy="56" rx="7.5" ry="8" fill="#87624A"/>
                <ellipse cx="79.869" cy="86" rx="7.5" ry="8" fill="#87624A"/>
                <path d="M2.869 100.5c9.2 25.2 31.5 22.5 44.5 18.5s21.5-8 25.5-14.5c-24.5 2.5-30-5.333-39-9-6-25.5 5.3-14 16.5-18s12-10 6.5-19.5c0 0-10 .5-29.5-6s-33.7 23.3-24.5 48.5Z" fill="#9D608F"/>
              </svg>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

// Extend Window interface for GSAP
declare global {
  interface Window {
    gsap: any;
    Flip: any;
    ScrollTrigger: any;
    MorphSVGPlugin: any;
  }
}

export default BrowserAnimation; 