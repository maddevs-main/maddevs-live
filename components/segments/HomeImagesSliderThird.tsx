'use client';

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
// Import Swiper and required modules
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';
import { gsap, Back, Expo, Quart } from 'gsap';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// --- STYLED COMPONENTS --- //
// This section replaces the original CSS file using styled-components.

const Section = styled.section`
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const SlideImage = styled.div`
  position: absolute;
  top: -200px;
  left: -200px;
  width: calc(100% + 400px);
  height: calc(100% + 400px);
  background-position: 50% 50%;
  background-size: cover;
`;

const SlideTitle = styled.h2`
  font-size: 4rem;
  line-height: 1;
  max-width: 90%;

  word-break: normal;
  overflow-wrap: break-word;
  white-space: normal;
  color: #fff;
  z-index: 100;
  font-family: 'Oswald', sans-serif;
  text-transform: lowercase;
  font-weight: normal;

  @media (min-width: 45em) {
    font-size: 7vw;
    max-width: none;
  }

  .word {
    display: inline-block;
    white-space: pre;
  }

  span {
    white-space: pre;
    display: inline-block;
    opacity: 0;
  }
`;

const StyledSlide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  text-align: center;
  font-size: 18px;
  background: #fff;
  overflow: hidden;
`;

const SlideshowNavigationButton = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 5rem;
  z-index: 1000;
  transition: all 0.3s ease;
  color: #fff;

  &:hover,
  &:focus {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.5);
  }

  &.prev {
    left: 0;
  }

  &.next {
    right: 0;
  }
`;

// This container holds the Swiper instance.
// We are targeting the class names generated by Swiper to apply styles.
const SwiperContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  .slideshow-pagination {
    position: absolute;
    bottom: 5rem;
    left: 0;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: start;
    transition: 0.3s opacity;
    z-index: 10;

    .slideshow-pagination-item {
      display: flex;
      align-items: center;

      .pagination-number {
        opacity: 0.5;
        font-size: 1.8rem;
        color: #fff;
        font-family: 'Oswald', sans-serif;
        padding: 0 0.5rem;
      }

      &:hover,
      &:focus {
        cursor: pointer;
      }

      .pagination-separator {
        display: none;
        @media (min-width: 45em) {
          display: block;
        }
        position: relative;
        width: 40px;
        height: 2px;
        background: rgba(255, 255, 255, 0.25);
        transition: all 0.3s ease;

        .pagination-separator-loader {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #ffffff;
          transform-origin: 0 0;
        }
      }

      &:last-of-type {
        .pagination-separator {
          width: 0;
        }
      }

      &.active {
        .pagination-number {
          opacity: 1;
        }
        .pagination-separator {
          width: 10vw;
        }
      }
    }
  }
`;

// --- REACT COMPONENT --- //

const slidesData = [
  {
    image: '/assets/media/website_design_development.jpg',
    title: 'design the lights, each pixel',
  },
  {
    image: '/assets/media/web_design_host_create_website.jpg',
    title: 'LIKE DUSK, LIKE DAWN',
  },
  {
    image: '/assets/media/web_code_develop.jpg',
    title: 'OR MIDNIGHT BLUES.',
  },
];

// A helper function to split title text into spans for the letter-by-letter animation.
// This replaces the functionality of the 'charming.js' library.
const CharmingTitle = ({ title }: { title: string }) => {
  return (
    <SlideTitle className="slide-title">
      {title.split(' ').map((word, wordIdx) => (
        <span className="word" key={wordIdx}>
          {word.split('').map((char, charIdx) => (
            <span key={charIdx}>{char}</span>
          ))}
          {/* Add a space after each word except the last */}
          {wordIdx !== title.split(' ').length - 1 && ' '}
        </span>
      ))}
    </SlideTitle>
  );
};

export default function SlideshowComponent() {
  const swiperRef = useRef<HTMLDivElement>(null);
  const swiperInstance = useRef<Swiper | null>(null);

  const animate = (direction = 'next') => {
    if (!swiperRef.current) return;

    const activeSlide = swiperRef.current.querySelector('.swiper-slide-active');
    if (!activeSlide) return;

    const activeSlideImg = activeSlide.querySelector('.slide-image') as HTMLElement;
    const activeSlideTitle = activeSlide.querySelector('.slide-title');
    const activeSlideTitleLetters = activeSlideTitle?.querySelectorAll('span');

    if (!activeSlideImg || !activeSlideTitleLetters) return;

    const letterArray =
      direction === 'next'
        ? Array.from(activeSlideTitleLetters)
        : Array.from(activeSlideTitleLetters).reverse();

    const oldSlideSelector = direction === 'next' ? '.swiper-slide-prev' : '.swiper-slide-next';
    const oldSlide = swiperRef.current.querySelector(oldSlideSelector);

    if (oldSlide) {
      const oldSlideTitleLetters = oldSlide.querySelectorAll('.slide-title span');
      gsap.killTweensOf(oldSlideTitleLetters); // Kill previous animations
      oldSlideTitleLetters.forEach((letter, pos) => {
        gsap.to(letter, {
          duration: 0.3,
          ease: Quart.easeIn,
          delay: (oldSlideTitleLetters.length - pos - 1) * 0.04,
          y: '50%',
          opacity: 0,
        });
      });
    }

    gsap.killTweensOf(activeSlideTitleLetters); // Kill previous animations
    letterArray.forEach((letter, pos) => {
      gsap.to(letter, {
        duration: 0.6,
        ease: Back.easeOut,
        delay: pos * 0.05,
        startAt: { y: '50%', opacity: 0 },
        y: '0%',
        opacity: 1,
      });
    });

    gsap.killTweensOf(activeSlideImg); // Kill previous animations
    gsap.to(activeSlideImg, {
      duration: 1.5,
      ease: Expo.easeOut,
      startAt: { x: direction === 'next' ? 200 : -200 },
      x: 0,
    });
  };

  const animatePagination = (swiper: Swiper) => {
    if (!swiper.pagination || !swiper.pagination.el) {
      return;
    }
    const activePaginationItem = swiper.pagination.el.querySelector(
      '.slideshow-pagination-item.active'
    );
    if (!activePaginationItem) return;

    const activePaginationItemLoader = activePaginationItem.querySelector(
      '.pagination-separator-loader'
    );
    const allLoaders = swiper.pagination.el.querySelectorAll('.pagination-separator-loader');

    const autoplayDelay = (swiper.params.autoplay as any)?.delay;
    if (!autoplayDelay) return;

    gsap.killTweensOf(allLoaders); // Kill previous animations
    gsap.set(allLoaders, { scaleX: 0 });
    gsap.to(activePaginationItemLoader, {
      duration: autoplayDelay / 1000,
      startAt: { scaleX: 0 },
      scaleX: 1,
    });
  };

  useEffect(() => {
    if (swiperRef.current && !swiperInstance.current) {
      swiperInstance.current = new Swiper(swiperRef.current, {
        // Register the required modules
        modules: [Navigation, Pagination, Autoplay],
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        speed: 500,
        // preloadImages: true, // This option doesn't exist in SwiperOptions
        // updateOnImagesReady: true, // This option doesn't exist in SwiperOptions

        pagination: {
          el: '.slideshow-pagination',
          clickable: true,
          bulletClass: 'slideshow-pagination-item',
          bulletActiveClass: 'active',
          renderBullet: (index, className) => {
            const number = index < 9 ? '0' + (index + 1) : index + 1;
            return `
                        <span class="${className}">
                            <span class="pagination-number"></span>
                            <span class="pagination-separator">
                                <span class="pagination-separator-loader"></span>
                            </span>
                        </span>
                    `;
          },
        },

        navigation: {
          nextEl: '.slideshow-navigation-button.next',
          prevEl: '.slideshow-navigation-button.prev',
        },

        on: {
          init: swiper => {
            // Animate the first slide's content on initialization
            requestAnimationFrame(() => {
              animate('next');
            });
          },
          // Use afterInit to ensure all modules, including pagination, are ready
          afterInit: swiper => {
            // Animate the pagination on initialization
            requestAnimationFrame(() => {
              animatePagination(swiper);
            });
          },
          slideChange: swiper => {
            // Re-animate pagination on every slide change
            animatePagination(swiper);
          },
          slideNextTransitionStart: () => animate('next'),
          slidePrevTransitionStart: () => animate('prev'),
        },
      });
    }

    // Cleanup on unmount
    return () => {
      if (swiperInstance.current) {
        swiperInstance.current.destroy(true, true);
        swiperInstance.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <Section>
      <SwiperContainer className="swiper-container" ref={swiperRef}>
        <div className="swiper-wrapper">
          {slidesData.map((slide, index) => (
            <StyledSlide key={index} className="swiper-slide">
              <SlideImage
                className="slide-image"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <CharmingTitle title={slide.title} />
            </StyledSlide>
          ))}
        </div>

        <div className="slideshow-pagination"></div>

        <div className="slideshow-navigation">
          <SlideshowNavigationButton className="slideshow-navigation-button prev">
            <span className="fas fa-chevron-left"></span>
          </SlideshowNavigationButton>
          <SlideshowNavigationButton className="slideshow-navigation-button next">
            <span className="fas fa-chevron-right"></span>
          </SlideshowNavigationButton>
        </div>
      </SwiperContainer>
    </Section>
  );
}
