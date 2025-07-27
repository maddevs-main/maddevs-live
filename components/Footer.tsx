"use client"
// I've fixed the cursor positioning and updated its style.
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import TextPlugin from 'gsap/TextPlugin';
gsap.registerPlugin(TextPlugin);

export default function App() {
  // Refs to target the elements for animation
  const textRef = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  
  // Define texts and longestText in the component scope so it's accessible to JSX
  const texts = ['DESIRE IT.', 'MAP IT.', 'DO IT.'];
  const longestText = texts.reduce((a, b) => a.length > b.length ? a : b);

  // This effect runs once after the component mounts
  useEffect(() => {
    let ctx: any;
    let timeline: any;
    let isMounted = true;

    const runTypewriter = () => {
      if (!textRef.current || !cursorRef.current) return;

      ctx = gsap.context(() => {
        timeline = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });

        texts.forEach((text: string) => {
          // Ensure cursor is visible at the start of each cycle
          if (cursorRef.current) timeline.set(cursorRef.current, { opacity: 1 });
          // Typing in
          timeline.to(textRef.current, {
            duration: text.length * 0.08,
            text: { value: text },
            ease: 'none',
            onStart: () => {
              if (textRef.current) (textRef.current as HTMLSpanElement).innerText = '';
            }
          });
          // Cursor blink
          if (cursorRef.current) {
            timeline.to(
              cursorRef.current,
              { opacity: 0, repeat: 3, yoyo: true, duration: 0.3, ease: 'steps(1)' },
              '+=0.2'
            );
          }
          // Deleting
          timeline.to(
            { val: text.length },
            {
              val: 0,
              duration: text.length * 0.06,
              ease: 'none',
              onUpdate: function (this: any) {
                if (textRef.current) {
                  (textRef.current as HTMLSpanElement).innerText = text.substring(0, Math.floor(this.targets()[0].val));
                }
              }
            },
            '+=0.2'
          );
          // Ensure cursor is visible at the end of each cycle
          if (cursorRef.current) timeline.set(cursorRef.current, { opacity: 1 });
        });
      }, containerRef);
    };

    // Run typewriter immediately (GSAP and TextPlugin are imported locally)
    if (isMounted) runTypewriter();

    return () => {
      isMounted = false;
      if (ctx) ctx.revert();
      if (timeline) timeline.kill();
    };
  }, [texts]);

  return (
    // Main container to structure the page with a footer
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '0vh',
      backgroundColor: '#222222',
      fontFamily: 'Inter, sans-serif',
      margin: 0,
      padding: 0,
    }}>
      {/* Main content area */}
      <main style={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#333',
        padding: '1px'
      }}>
        
      </main>

      {/* Big Footer */}
      <footer ref={containerRef} style={{
        backgroundColor: '#E4E0E1',
        padding: '48px 32px',
        color: '##222222',
        borderTop: '1px solid #222222',
   
        overflow: 'hidden',
      }}>
        <div style={{position: 'relative', minHeight: '12vw'}}>
          <h2 style={{
            visibility: 'hidden',
            margin: 0,
            padding: 0,
            fontSize: '12vw',
            fontWeight: '900',
            lineHeight: 0.8,
            letterSpacing: '-0.05em',
            textTransform: 'uppercase',
          }}>
            {longestText}
          </h2>
          <h2 style={{
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
          }}>
            <span ref={textRef}></span>
            {/* New, styled cursor */}
            <span
              ref={cursorRef}
              style={{
                display: 'inline-block',
                verticalAlign: 'middle',
                width: '4px',
                height: '1em', // match the text height
                backgroundColor: '#222222',
                opacity: 1, // visible by default
                marginLeft: '8px',
                transition: 'opacity 0.1s'
              }}
            ></span>
          </h2>
        </div>
        
        <div style={{paddingTop: '48px'}}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            width: '100%'
          }}>
            <div style={{ textAlign: 'left', paddingLeft: '0.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <a href="https://www.instagram.com/maddevsgroup" style={{color: 'inherit', textDecoration: 'none', textTransform: 'uppercase', fontSize: 'clamp(14px, 1.8vw, 19px)'}}>Instagram</a>
                <a href="error" style={{color: 'inherit', textDecoration: 'none', textTransform: 'uppercase', fontSize: 'clamp(14px, 1.8vw, 19px)'}}>Dribbble</a>
                <a href="https://www.behance.net/maddevsgroup" style={{color: 'inherit', textDecoration: 'none', textTransform: 'uppercase', fontSize: 'clamp(14px, 1.8vw, 19px)'}}>Behance</a>
                <a href="https://x.com/maddevsgroup" style={{color: 'inherit', textDecoration: 'none', textTransform: 'uppercase', fontSize: 'clamp(14px, 1.8vw, 19px)'}}>X</a>
              </div>
            </div>
            <div style={{
              fontSize: '15vw',
              fontWeight: 'bold',
              fontFamily: "Inter, sans-serif",
              fontStyle: 'italic',
              color: '[#222222]',
              opacity: '0.2',
              justifySelf: 'center'
            }}>
              md.
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href="#" style={{color: 'inherit', textDecoration: 'none', textTransform: 'uppercase', fontSize: 'clamp(14px, 1.8vw, 19px)'}}>WORKS</a>
                <a href="#" style={{color: 'inherit', textDecoration: 'none', textTransform: 'uppercase', fontSize: 'clamp(14px, 1.8vw, 19px)'}}>HOME</a>
                <a href="#" style={{color: 'inherit', textDecoration: 'none', textTransform: 'uppercase', fontSize: 'clamp(14px, 1.8vw, 19px)'}}>SERVICES</a>
                <a href="#" style={{color: 'inherit', textDecoration: 'none', textTransform: 'uppercase', fontSize: 'clamp(14px, 1.8vw, 19px)'}}>PRODUCTS</a>
                <a href="#" style={{color: 'inherit', textDecoration: 'none', textTransform: 'uppercase', fontSize: 'clamp(14px, 1.8vw, 19px)'}}>ONBOARD</a>
                <a href="#" style={{color: 'inherit', textDecoration: 'none', textTransform: 'uppercase', fontSize: 'clamp(14px, 1.8vw, 19px)'}}>CONTACT</a>
                <a href="#" style={{color: 'inherit', textDecoration: 'none', textTransform: 'uppercase', fontSize: 'clamp(14px, 1.8vw, 19px)'}}>RELEASES</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div style={{
        backgroundColor: '##222222',
        color: '#EEEEEE',
        padding: '16px 0',
        textAlign: 'center',
        fontSize: '0.9rem'
      }}>
        © 2025 maddevs - All rights reserved.
      </div>
    </div>
  );
}
