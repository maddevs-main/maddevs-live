'use client';
import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import TextPlugin from 'gsap/TextPlugin';
import LenisSmoothScroll from '@/components/LenisSmoothScroll';
gsap.registerPlugin(TextPlugin);

type News = {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  imageUrl: string;
  content: string;
  layout: string;
  tags: string[];
};

interface NewsClientProps {
  article: News;
}

const ArticlePage = ({ article, onBack }: { article: News; onBack: () => void }) => {
  const articleRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const redRef = useRef<HTMLImageElement>(null);
  const greenRef = useRef<HTMLImageElement>(null);
  const blueRef = useRef<HTMLImageElement>(null);

  // Helper function to check if image URL is valid
  const isValidImageUrl = (url: string) => {
    return url && url.trim() !== '' && url !== 'null' && url !== 'undefined';
  };

  useEffect(() => {
    // Page load tracking
    const startTime = performance.now();
    console.log(
      "Welcome to maddevs, this page was designed and created by maddevs, visit 'https://www.maddevs.in' for further information"
    );

    return () => {
      const endTime = performance.now();
      const loadTime = ((endTime - startTime) / 1000).toFixed(2);
      console.log(`The page loaded in ${loadTime} seconds`);
    };
  }, [article]);

  useLayoutEffect(() => {
    // Check if we have all required refs
    const requiredRefs = [
      articleRef.current,
      titleRef.current,
      subtitleRef.current,
      contentRef.current
    ];

    // Only add image refs if we have a valid image
    if (isValidImageUrl(article.imageUrl)) {
      requiredRefs.push(imageRef.current, redRef.current, greenRef.current, blueRef.current);
    }

    if (requiredRefs.some(ref => !ref)) {
      return;
    }

    gsap.set(articleRef.current, {
      opacity: 0,
      scale: 0.98,
      filter: 'none',
      y: 60,
      visibility: 'visible',
    });

    // Only set image refs if we have a valid image
    if (isValidImageUrl(article.imageUrl) && redRef.current && greenRef.current && blueRef.current) {
      gsap.set([redRef.current, greenRef.current, blueRef.current], { x: 0, y: 0, opacity: 0 });
    }

    const originalTitle = article.title;
    const originalSubtitle = article.subtitle;
    const originalContent = article.content;
    titleRef.current.textContent = '';
    subtitleRef.current.textContent = '';
    contentRef.current.textContent = '';

    const masterTl = gsap.timeline();
    masterTl.to(articleRef.current, { opacity: 1, duration: 0.01 });
    masterTl.to(
      articleRef.current,
      {
        scale: 1.03,
        filter: 'drop-shadow(0 0 4px #f00)',
        y: -12,
        duration: 0.04,
        ease: 'power1.in',
      },
      '>-'
    );
    masterTl.to(
      articleRef.current,
      { scale: 0.97, filter: 'drop-shadow(0 0 4px #0ff)', y: 8, duration: 0.04, ease: 'power1.in' },
      '<'
    );
    masterTl.to(
      articleRef.current,
      { scale: 1, filter: 'none', y: 0, duration: 0.08, ease: 'power1.out' },
      '>-'
    );
    masterTl.to(articleRef.current, { opacity: 0.7, duration: 0.03, yoyo: true, repeat: 1 }, '>-');
    masterTl.to(articleRef.current, { opacity: 1, duration: 0.03 }, '>-');
    masterTl
      .to(titleRef.current, {
        text: { value: originalTitle },
        duration: originalTitle.length * 0.01, // Faster: reduced from 0.03 to 0.01
        ease: 'none',
      })
      .to(
        subtitleRef.current,
        {
          text: { value: originalSubtitle },
          duration: originalSubtitle.length * 0.01, // Faster: reduced from 0.03 to 0.01
          ease: 'none',
        },
        '>-'
      )
      .to(
        contentRef.current,
        {
          text: { value: originalContent },
          duration: originalContent.length * 0.005, // Much faster: reduced from 0.02 to 0.005
          ease: 'none',
        },
        '>-'
      );

    // Only animate image effects if we have a valid image
    if (isValidImageUrl(article.imageUrl) && redRef.current && greenRef.current && blueRef.current) {
      masterTl
        .to(
          [redRef.current, greenRef.current, blueRef.current],
          {
            x: (i) => (i === 0 ? -2 : i === 1 ? 2 : 0),
            y: (i) => (i === 0 ? 1 : i === 1 ? -1 : 0),
            opacity: 0.8,
            duration: 0.1,
            ease: 'power1.in',
          },
          '>-'
        )
        .to(
          [redRef.current, greenRef.current, blueRef.current],
          {
            x: 0,
            y: 0,
            opacity: 0,
            duration: 0.2,
            ease: 'power1.out',
          },
          '>+0.1'
        );
    }
  }, [article]);

  return (
    <div
      ref={articleRef}
      className="w-full min-h-screen bg-white"
    >
      <LenisSmoothScroll />
      <div className="py-8 md:py-16 px-2 sm:px-4 md:px-8 w-full">
        <button
          onClick={onBack}
          className="font-bold text-4xl tracking-widest mb-8 hover:underline ml-2 mt-4"
        >
          <h2>news/</h2>
        </button>

        {/* Only render image section if there's a valid image */}
        {isValidImageUrl(article.imageUrl) && (
          <div ref={imageRef} className="flex justify-center mb-8">
            <div
              className="w-full aspect-[3/2] bg-gray-200 relative overflow-hidden mx-auto"
              style={{ willChange: 'transform, opacity', paddingBottom: '66.6667%' }}
            >
              {/* RGB Glitch Images */}
              <img
                ref={redRef}
                src={article.imageUrl}
                alt={`Web development and UI design red channel overlay for news article: ${article.title}`}
                className="absolute top-0 left-0 w-full h-full object-cover"
                style={{ filter: 'brightness(1.2) contrast(1.1) sepia(0.2) hue-rotate(-10deg)' }}
                loading="lazy"
              />
              <img
                ref={greenRef}
                src={article.imageUrl}
                alt={`Web development and UI design green channel overlay for news article: ${article.title}`}
                className="absolute top-0 left-0 w-full h-full object-cover"
                style={{ filter: 'brightness(1.1) contrast(1.1) sepia(0.1) hue-rotate(10deg)' }}
                loading="lazy"
              />
              <img
                ref={blueRef}
                src={article.imageUrl}
                alt={`Web development and UI design blue channel overlay for news article: ${article.title}`}
                className="absolute top-0 left-0 w-full h-full object-cover"
                style={{ filter: 'brightness(1.2) contrast(1.1) sepia(0.2) hue-rotate(20deg)' }}
                loading="lazy"
              />
              {/* Fallback base image for when glitch is done */}
              <img
                src={article.imageUrl}
                alt={`Web development and creative design main image for news article: ${article.title}`}
                className="absolute top-0 left-0 w-full h-full object-cover z-10"
                style={{ pointerEvents: 'none' }}
                loading="lazy"
              />
            </div>
          </div>
        )}

        <div className="w-full flex flex-col items-start">
          <h1
            ref={titleRef}
            className="text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-wider w-full text-left px-0 md:px-0"
          >
            {article.title}
          </h1>
          <p
            ref={subtitleRef}
            className="mt-4 text-lg sm:text-xl md:text-2xl tracking-widest w-full text-left px-0 md:px-0"
            style={{ minHeight: 24 }}
          >
            {article.subtitle}
          </p>
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-4 justify-start w-full">
            {article.tags &&
              article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#d1cfcf] text-xs px-2 py-0.5 rounded-full text-[#282222] uppercase font-bold tracking-wider"
                >
                  {tag}
                </span>
              ))}
          </div>
          <div className="my-8 border-t-2 border-dashed border-black w-full"></div>
          <div
            ref={contentRef}
            className="text-base md:text-lg leading-relaxed whitespace-pre-line w-full px-0 md:px-0 text-left"
            style={{ minHeight: 60 }}
          >
            {article.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function NewsClient({ article }: NewsClientProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push('/pam/news');
  };

  return <ArticlePage article={article} onBack={handleBack} />;
}
