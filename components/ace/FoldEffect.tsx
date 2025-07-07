'use client';

import { useEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


const GlobalStyles = createGlobalStyle`
  :root {
    --step--2: clamp(3.13rem, 2.62rem + 2.51vw, 5.76rem);
    --step--1: clamp(3.75rem, 3.09rem + 3.29vw, 7.20rem);
    --step-0: clamp(4.50rem, 3.64rem + 4.29vw, 9.00rem);
  }

  body {
    background: #efefef;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
      'Segoe UI Symbol';
    font-weight: 600;
    min-height: 400vh;
  }
`;

const LoadingScreen = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000;
  color: #fff;
  z-index: 20;
  transition: opacity 0.5s ease-out;
`;

const LoadingText = styled.h1`
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: 2rem;
  letter-spacing: 0.1em;
`;

const LoadingBar = styled.div`
  width: 200px;
  height: 2px;
  background: #333;
  border-radius: 1px;
  overflow: hidden;
  position: relative;
`;

const LoadingProgress = styled.div<{ $progress: number }>`
  height: 100%;
  background: #fff;
  width: ${(props) => props.$progress}%;
  transition: width 0.3s ease-out;
`;

const Screen = styled.div<{ $isReady: boolean }>`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  opacity: ${(props) => (props.$isReady ? 1 : 0)};
  visibility: ${(props) => (props.$isReady ? 'visible' : 'hidden')};
  transition: opacity 0.4s ease-in-out;
  background-size: cover;
  background-position: center;
`;

const Wrapper3D = styled.div`
  position: relative;
  perspective: 20vw;
  transform-style: preserve-3d;
`;

const Fold = styled.div<{ $variant: string }>`
  overflow: hidden;
  width: 100vw;
  height: 80vh;
  position: ${(props) =>
    props.$variant === 'fold-center' ? 'relative' : 'absolute'};
  transform-origin: ${(props) =>
    props.$variant === 'fold-top'
      ? 'bottom center'
      : props.$variant === 'fold-bottom'
      ? 'top center'
      : 'initial'};
  ${(props) =>
    props.$variant === 'fold-top'
      ? 'bottom: 100%; transform: rotateX(-120deg);'
      : props.$variant === 'fold-bottom'
      ? 'top: 100%; transform: rotateX(120deg);'
      : ''}
`;

const FoldAlign = styled.div`
  width: 100%;
  height: 100%;
`;

const FoldContent = styled.div`
  .marquee {
    border-bottom: 1px solid #1a1a1a;
    color: #ccc;
    font-size: var(--step-0);
    font-weight: 700;
    height: calc(170px + 4rem);
    overflow: hidden;
    position: relative;
    width: 100vw;
    filter: invert(1);
    opacity: 1;
  }

  .track {
    height: 100%;
    overflow: hidden;
    padding: 2rem 0;
    position: absolute;
    white-space: nowrap;
    opacity: 1;
  }

  .-focus {
    color: #1a1a1a;
    font-weight: 900;
    filter: invert(1);
  }
`;

const FoldEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let loadingInterval: NodeJS.Timeout;
    let fallbackTimeout: NodeJS.Timeout;
    
    // Simulate loading progress
    loadingInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Fallback: if loading takes too long, hide loading screen anyway
    fallbackTimeout = setTimeout(() => {
      console.log('Fallback: hiding loading screen after timeout');
      setLoadingProgress(100);
      clearInterval(loadingInterval);
      setIsLoading(false);
    }, 5000); // 5 second fallback

    // Preload background image
    const img = new Image();
    img.onload = () => {
      console.log('Image loaded, setting progress to 100%');
      setLoadingProgress(100);
      clearInterval(loadingInterval);
      clearTimeout(fallbackTimeout);
      
      // Wait a bit then hide loading screen
      setTimeout(() => {
        console.log('Hiding loading screen');
        setIsLoading(false);
      }, 800);
    };
    
    img.onerror = () => {
      console.log('Image failed to load, hiding loading screen anyway');
      setLoadingProgress(100);
      clearInterval(loadingInterval);
      clearTimeout(fallbackTimeout);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };


    return () => {
      if (loadingInterval) {
        clearInterval(loadingInterval);
      }
      if (fallbackTimeout) {
        clearTimeout(fallbackTimeout);
      }
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const marquees = gsap.utils.toArray<HTMLElement>('.marquee');
    marquees.forEach((el, index) => {
      const track = el.querySelector('.track');
      const [x, xEnd] = index % 2 === 0 ? [-500, -1500] : [-500, 0];
      if (track) {
        gsap.fromTo(
          track,
          { x },
          {
            x: xEnd,
            scrollTrigger: {
              scrub: 1,
            },
          }
        );
      }
    });

    const centerContent = document.getElementById('center-content');
    const centerFold = document.getElementById('center-fold');
    const foldsContent = Array.from(
      document.querySelectorAll('.fold-content')
    ) as HTMLElement[];

    let targetScroll = -(
      document.documentElement.scrollTop || document.body.scrollTop
    );
    let currentScroll = targetScroll;

    const tick = () => {
      const overflowHeight =
        (centerContent?.clientHeight || 0) -
        (centerFold?.clientHeight || 0);

      document.body.style.height = `${
        overflowHeight + window.innerHeight
      }px`;

      targetScroll = -(
        document.documentElement.scrollTop || document.body.scrollTop
      );
      currentScroll += (targetScroll - currentScroll) * 0.1;

      foldsContent.forEach((content) => {
        content.style.transform = `translateY(${currentScroll}px)`;
      });

      requestAnimationFrame(tick);
    };

    tick();
    setIsReady(true);
  }, [isLoading]);

  if (isLoading) {
    return (
      <>
        <GlobalStyles />
        <LoadingScreen>
          <LoadingText>LOADING</LoadingText>
          <LoadingBar>
            <LoadingProgress $progress={loadingProgress} />
          </LoadingBar>
        </LoadingScreen>
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      <Screen ref={containerRef} $isReady={isReady} id="fold-effect">
        <Wrapper3D>
          {['fold-top', 'fold-center', 'fold-bottom'].map((fold) => (
            <Fold
              key={fold}
              $variant={fold}
              id={fold === 'fold-center' ? 'center-fold' : undefined}
            >
              <FoldAlign>
                <FoldContent
                  className="fold-content"
                  id={fold === 'fold-center' ? 'center-content' : undefined}
                >
                  {['कला', 'Thinkers', 'JUST EXPRESS', 'अनुभव'].map((word) => (
                    <div className="marquee" key={word}>
                      <div className="track">
                        {`${word}.${word}.`}
                        <span className="-focus">{word}.</span>
                        {`${word}.`.repeat(6)}
                      </div>
                    </div>
                  ))}
                </FoldContent>
              </FoldAlign>
            </Fold>
          ))}
        </Wrapper3D>
      </Screen>
    </>
  );
};

export default FoldEffect;