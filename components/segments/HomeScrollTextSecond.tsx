'use client';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Container = styled.div`
  position: relative;
  width: 100vw;
  max-width: 100vw;
  height: 80vh; // Match Screen height
  min-height: 400px;
  overflow: visible;
  background: #b6b09f;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Screen = styled.div`
  position: relative;
  width: 100vw;
  height: 70vh; // Match Container height
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const Wrapper3D = styled.div`
  position: relative;
  width: 100vw;
  height: 100%; // Inherit from Screen
  perspective: 20vw;
  transform-style: preserve-3d;
`;

const Fold = styled.div`
  overflow: hidden;
  width: 100vw;
  height: 80vh;
  pointer-events: auto;
`;

const FoldTop = styled(Fold)`
  position: absolute;
  transform-origin: bottom center;
  left: 0;
  right: 0;
  bottom: 100%;
  transform: rotateX(-120deg);
`;

const FoldCenter = styled(Fold)`
  width: 100vw;
  height: 100%; // Inherit from Wrapper3D
  position: relative;
`;

const FoldBottom = styled(Fold)`
  position: absolute;
  transform-origin: top center;
  right: 0;
  left: 0;
  top: 100%;
  transform: rotateX(120deg);
`;

const FoldAlign = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center; // vertically center
  justify-content: center; // horizontally center
`;

const FoldContent = styled.div`
  width: 100%;
  height: auto; // let content define height
  will-change: transform;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Marquee = styled.div`
  border-bottom: 4px solid #3c3316;
  border-top: 4px solid #3c3316;

  color: #f2f2f2;
  font-size: clamp(1.5rem, 2.64rem + 4.29vw, 9rem);
  font-weight: 700;
  height: calc(170px + 3rem);
  overflow: hidden;
  position: relative;
  width: 100vw;
  @media (max-width: 768px) {
    height: calc(90px + 3rem);
  }
  @media (max-width: 640px) {
    height: calc(90px + 3rem);
  }
  @media (max-width: 450px) {
    height: calc(90px + 3rem);
  }
  background: transparent;
`;

const Track = styled.div`
  height: 100%;
  overflow: hidden;
  padding: 2rem 0;
  position: absolute;
  white-space: nowrap;
  will-change: transform;
`;

const Focus = styled.span`
  color: #222222;
  font-weight: 900;
`;

const marqueeLines = [
  'Desire.Desire.Desire.Desire.Desire.',
  'Deduct.',
  'Design.Design.Design.Design.Design.Design.',
  'Do It.Do It.',
];

export default function TextScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerContentRef = useRef<HTMLDivElement>(null);
  const centerFoldRef = useRef<HTMLDivElement>(null);
  const foldsContent = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Horizontal marquee animation
    gsap.utils.toArray<HTMLElement>('.marquee', containerRef.current!).forEach((el, index) => {
      const w = el.querySelector('.track');
      const [x, xEnd] = index % 2 === 0 ? [-500, -1500] : [-500, 0];
      if (w) {
        gsap.fromTo(
          w,
          { x },
          {
            x: xEnd,
            scrollTrigger: {
              scrub: 1,
              trigger: containerRef.current,
              start: 'top bottom',
              end: 'bottom top',
            },
          }
        );
      }
    });

    // Vertical fold scroll effect (scoped to container)
    const centerContent = centerContentRef.current;
    const centerFold = centerFoldRef.current;
    const folds = foldsContent.current;
    if (!centerContent || !centerFold || folds.some(f => f === null)) return;

    let targetScroll = 0;
    let currentScroll = 0;
    let animFrame: number;

    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const winH = window.innerHeight;
      // How much of the container is scrolled into view
      const progress = Math.min(Math.max((winH - rect.top) / (rect.height + winH), 0), 1);
      // The overflow height is the difference between centerContent and centerFold
      const overflowHeight = centerContent.clientHeight - centerFold.clientHeight;
      targetScroll = -overflowHeight * progress;
    };

    const tick = () => {
      currentScroll += (targetScroll - currentScroll) * 0.1;
      folds.forEach(content => {
        if (content) {
          (content as HTMLDivElement).style.transform = `translateY(${currentScroll}px)`;
        }
      });
      animFrame = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    onScroll();
    tick();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  // Helper to render all marquee lines
  const renderMarquees = () => (
    <>
      {marqueeLines.map((line, i) => (
        <Marquee className="marquee lowercase" key={i}>
          <Track className="track">
            {line}
            <Focus className="-focus">{line.split('.')[0]}.</Focus>
            {line.repeat(5)}
            {line}
            <Focus className="-focus">{line.split('.')[0]}.</Focus>
            {line.repeat(5)}
          </Track>
        </Marquee>
      ))}
    </>
  );

  return (
    <Container ref={containerRef}>
      <Screen>
        <Wrapper3D>
          <FoldCenter ref={centerFoldRef}>
            <FoldAlign>
              <FoldContent id="center-content" ref={centerContentRef}>
                {renderMarquees()}
              </FoldContent>
            </FoldAlign>
          </FoldCenter>
        </Wrapper3D>
      </Screen>
    </Container>
  );
}
