"use client"
import React, { useEffect, useState, useRef, useLayoutEffect, use as useUnwrap } from 'react';
import { useRouter, useParams } from 'next/navigation';
import gsap from 'gsap';
import TextPlugin from 'gsap/TextPlugin';
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

const ArticlePage = ({ article, onBack }: { article: News; onBack: () => void }) => {
  const articleRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const redRef = useRef<HTMLImageElement>(null);
  const greenRef = useRef<HTMLImageElement>(null);
  const blueRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    console.log('ArticlePage mounted', { article });
    console.log('Refs:', {
      articleRef: articleRef.current,
      titleRef: titleRef.current,
      subtitleRef: subtitleRef.current,
      contentRef: contentRef.current,
      imageRef: imageRef.current,
      redRef: redRef.current,
      greenRef: greenRef.current,
      blueRef: blueRef.current,
    });
  }, [article]);

  useLayoutEffect(() => {
    if (!articleRef.current || !titleRef.current || !subtitleRef.current || !contentRef.current || !imageRef.current || !redRef.current || !greenRef.current || !blueRef.current) {
      console.warn('Some refs are not ready, skipping animation');
      return;
    }
    gsap.set(articleRef.current, { opacity: 0, scale: 0.98, filter: 'none', y: 60, visibility: 'visible' });
    gsap.set([redRef.current, greenRef.current, blueRef.current], { x: 0, y: 0, opacity: 0 });
    const originalTitle = article.title;
    const originalSubtitle = article.subtitle;
    const originalContent = article.content;
    titleRef.current.textContent = '';
    subtitleRef.current.textContent = '';
    contentRef.current.textContent = '';
    const masterTl = gsap.timeline();
    masterTl.to(articleRef.current, { opacity: 1, duration: 0.01 });
    masterTl.to(articleRef.current, { scale: 1.03, filter: 'drop-shadow(0 0 4px #f00)', y: -12, duration: 0.04, ease: 'power1.in' }, ">-");
    masterTl.to(articleRef.current, { scale: 0.97, filter: 'drop-shadow(0 0 4px #0ff)', y: 8, duration: 0.04, ease: 'power1.in' }, "<");
    masterTl.to(articleRef.current, { scale: 1, filter: 'none', y: 0, duration: 0.08, ease: 'power1.out' }, ">-");
    masterTl.to(articleRef.current, { opacity: 0.7, duration: 0.03, yoyo: true, repeat: 1 }, ">-");
    masterTl.to(articleRef.current, { opacity: 1, duration: 0.03 }, ">-");
    masterTl.to([redRef.current, greenRef.current, blueRef.current], { opacity: 1, duration: 0.01 }, 0.15)
      .to(redRef.current, { x: 8, y: -2, duration: 0.04, ease: 'power1.in' }, ">-")
      .to(greenRef.current, { x: -8, y: 2, duration: 0.04, ease: 'power1.in' }, "<")
      .to(blueRef.current, { x: 4, y: 4, duration: 0.04, ease: 'power1.in' }, "<")
      .to([redRef.current, greenRef.current, blueRef.current], { x: 0, y: 0, duration: 0.06, ease: 'power1.out' }, ">-")
      .to([redRef.current, greenRef.current, blueRef.current], { opacity: 0.7, duration: 0.03, yoyo: true, repeat: 1 }, ">-")
      .to([redRef.current, greenRef.current, blueRef.current], { opacity: 1, duration: 0.03 }, ">-");
    const titleDuration = 0.12;
    const subtitleDuration = 0.12;
    const contentDuration = 0.25;
    masterTl.to(titleRef.current, { duration: titleDuration, text: originalTitle, ease: 'linear' }, 0.1)
      .to(subtitleRef.current, { duration: subtitleDuration, text: originalSubtitle, ease: 'linear' }, ">")
      .to(contentRef.current, { duration: contentDuration, text: originalContent, ease: 'linear' }, ">-");
    return () => { masterTl.kill(); };
  }, [article]);

  const refsReady = articleRef.current && titleRef.current && subtitleRef.current && contentRef.current && imageRef.current && redRef.current && greenRef.current && blueRef.current;

  return (
    <div ref={articleRef} style={{ visibility: refsReady ? 'hidden' : 'visible' }} className="w-full min-h-screen bg-white">
      <div className="py-8 md:py-16 px-2 sm:px-4 md:px-8 w-full">
        <button onClick={onBack} className="font-bold text-4xl tracking-widest mb-8 hover:underline ml-2 mt-4">
         <h2>news/</h2> 
        </button>
        <div ref={imageRef} className="flex justify-center mb-8">
          <div className="w-full  aspect-[3/2] bg-gray-200 relative overflow-hidden mx-auto" style={{ willChange: 'transform, opacity', paddingBottom: '66.6667%' }}>
            {/* RGB Glitch Images */}
            <img ref={redRef} src={article.imageUrl} alt={`Web development and UI design red channel overlay for news article: ${article.title}`} className="absolute top-0 left-0 w-full h-full object-cover" style={{ filter: 'brightness(1.2) contrast(1.1) sepia(0.2) hue-rotate(-10deg)' }} loading="lazy" />
            <img ref={greenRef} src={article.imageUrl} alt={`Web development and UI design green channel overlay for news article: ${article.title}`} className="absolute top-0 left-0 w-full h-full object-cover" style={{ filter: 'brightness(1.1) contrast(1.1) sepia(0.1) hue-rotate(10deg)' }} loading="lazy" />
            <img ref={blueRef} src={article.imageUrl} alt={`Web development and UI design blue channel overlay for news article: ${article.title}`} className="absolute top-0 left-0 w-full h-full object-cover" style={{ filter: 'brightness(1.2) contrast(1.1) sepia(0.2) hue-rotate(20deg)' }} loading="lazy" />
            {/* Fallback base image for when glitch is done */}
            <img src={article.imageUrl} alt={`Web development and creative design main image for news article: ${article.title}`} className="absolute top-0 left-0 w-full h-full object-cover z-10" style={{ pointerEvents: 'none' }} loading="lazy" />
          </div>
        </div>
        <div className="w-full flex flex-col items-start">
          <h1 ref={titleRef} className="text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-wider w-full text-left px-0 md:px-0">{article.title}</h1>
          <p ref={subtitleRef} className="mt-4 text-lg sm:text-xl md:text-2xl tracking-widest w-full text-left px-0 md:px-0" style={{ minHeight: 24 }}>{article.subtitle}</p>
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-4 justify-start w-full">
            {article.tags && article.tags.map((tag, idx) => (
              <span key={idx} className="bg-[#d1cfcf] text-xs px-2 py-0.5 rounded-full text-[#282222] uppercase font-bold tracking-wider">{tag}</span>
            ))}
          </div>
          <div className="my-8 border-t-2 border-dashed border-black w-full"></div>
          <div ref={contentRef} className="text-base md:text-lg leading-relaxed whitespace-pre-line w-full px-0 md:px-0 text-left" style={{ minHeight: 60 }}>{article.content}</div>
        </div>
      </div>
    </div>
  );
};

export default function NewsSlugPage() {
  const router = useRouter();
  const { slug } = useParams() as { slug: string };
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      setError('');
      setRuntimeError(null);
      try {
        const res = await fetch(`/api/news/slug/${slug}`);
        if (!res.ok) throw new Error('News not found');
        const data = await res.json();
        // Check for required fields
        if (!data.title || !data.content || !data.imageUrl) {
          setRuntimeError('News data is missing required fields.');
          return;
        }
        setNews(data);
      } catch (e) {
        setError('News not found');
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchNews();
  }, [slug]);

  const handleBack = () => {
    router.push('/pam/news');
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error || !news) return (
    <div className="bg-[white] min-h-screen flex flex-col items-center justify-center font-mono">
      <p>News not found.</p>
      <button onClick={handleBack} className="text-[#474242] hover:text-[#000000] underline mt-4">&larr; Back to all news</button>
    </div>
  );
  if (runtimeError) return (
    <div className="bg-[white] min-h-screen flex flex-col items-center justify-center font-mono">
      <p>{runtimeError}</p>
      <button onClick={handleBack} className="text-[#474242] hover:text-[#000000] underline mt-4">&larr; Back to all news</button>
    </div>
  );

  return <ArticlePage article={news} onBack={handleBack} />;
} 