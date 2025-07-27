"use client"
import React, { useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import TextPlugin from 'gsap/TextPlugin';
gsap.registerPlugin(TextPlugin);

interface NewsPost {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  imageUrl: string;
  content: string;
  layout: string;
  tags: string[];
}

console.log('ClientAnimatedNewsPage module loaded');

export default function ClientAnimatedNewsPage({ post }: { post: NewsPost }) {
  console.log('ClientAnimatedNewsPage rendered', post?.title);
  const router = useRouter();
  const articleRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!articleRef.current || !titleRef.current || !subtitleRef.current || !contentRef.current) return;
    // Set initial state
    gsap.set(articleRef.current, {
      rotationY: -90,
      autoAlpha: 0,
      transformOrigin: 'left center',
      visibility: 'visible',
    });
    const originalTitle = post.title;
    const originalSubtitle = post.subtitle;
    const originalContent = post.content;
    titleRef.current.textContent = '';
    subtitleRef.current.textContent = '';
    contentRef.current.textContent = '';
    // Animate in
    const masterTl = gsap.timeline();
    masterTl.to(articleRef.current, {
      rotationY: 0,
      autoAlpha: 1,
      duration: 0.7,
      ease: 'power3.inOut',
    });
    // Faster, smooth typewriter effect
    const titleDuration = 0.25;
    const subtitleDuration = 0.25;
    const contentDuration = 0.5;
    masterTl.to(titleRef.current, { duration: titleDuration, text: originalTitle, ease: 'linear' }, 0.2)
      .to(subtitleRef.current, { duration: subtitleDuration, text: originalSubtitle, ease: 'linear' }, ">")
      .to(contentRef.current, { duration: contentDuration, text: originalContent, ease: 'linear' }, ">-");
    return () => { masterTl.kill(); };
  }, [post]);

  const handleBack = () => {
    if (!articleRef.current) return;
    const tl = gsap.timeline({
      onComplete: () => router.back(),
    });
    tl.to(
      [titleRef.current, subtitleRef.current, contentRef.current],
      {
        autoAlpha: 0,
        duration: 0.3,
        stagger: 0.05,
      }
    );
    tl.to(articleRef.current, {
      rotationY: -90,
      autoAlpha: 0,
      duration: 1,
      ease: 'power3.inOut',
      transformOrigin: 'left center',
    }, 0);
  };

  return (
    <div
      ref={articleRef}
      className="fixed top-0 left-0 w-full h-full bg-white z-20 overflow-y-auto"
      style={{ visibility: 'hidden', perspective: '1200px' }}
    >
      <div className="max-w-4xl mx-auto py-8 md:py-16 px-4 sm:px-6 md:px-8">
        <button
          onClick={handleBack}
          className="font-bold uppercase tracking-widest mb-8 hover:underline"
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
        >
          NEWS/
        </button>
        <div className="w-full h-64 md:h-96 bg-gray-200 mb-8" data-flip-id={`image-${post.id}`}>
          <img src={post.imageUrl} alt={`Web development and creative design news image: ${post.title}`} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div data-flip-id={`content-${post.id}`}> 
          <h1 ref={titleRef} data-article-title className="text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-wider" style={{ minHeight: 44 }}></h1>
          <p ref={subtitleRef} data-article-subtitle className="mt-4 text-lg sm:text-xl md:text-2xl tracking-widest" style={{ minHeight: 24 }}></p>
          <div className="my-8 border-t-2 border-dashed border-black"></div>
          <div ref={contentRef} data-article-content className="text-base md:text-lg leading-relaxed whitespace-pre-line" style={{ minHeight: 60 }}></div>
        </div>
        <div style={{ margin: '24px 0' }}>
          <strong>Tags:</strong> {post.tags && post.tags.length > 0 ? post.tags.join(', ') : 'None'}
        </div>
      </div>
    </div>
  );
} 