"use client"
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import Flip from 'gsap/Flip';
import TextPlugin from 'gsap/TextPlugin';
import { useRouter } from 'next/navigation';
gsap.registerPlugin(Flip, TextPlugin);

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

// --- COMPONENTS ---

// Marquee Component for the flowing text banner
const Marquee = ({ children, speed = 25 }: { children: React.ReactNode; speed?: number }) => {
    const marqueeContainerRef = useRef<HTMLDivElement | null>(null);
    const marqueeContentRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        if (!marqueeContentRef.current || !marqueeContainerRef.current) return;
        
        const container = marqueeContainerRef.current as HTMLDivElement;
        const content = marqueeContentRef.current as HTMLDivElement;
        const originalContent = content.children[0] as HTMLElement;
        if (!originalContent) return;

        const contentWidth = originalContent.offsetWidth;
        
        while (content.children.length > 1) {
            content.removeChild(content.lastChild as ChildNode);
        }

        const clonesNeeded = contentWidth > 0 ? Math.ceil(container.offsetWidth / contentWidth) + 1 : 1;

        for (let i = 0; i < clonesNeeded; i++) {
            content.appendChild(originalContent.cloneNode(true));
        }

        const tl = gsap.to(content, {
            x: `-=${contentWidth}`,
            duration: speed,
            ease: 'none',
            repeat: -1,
        });

        return () => tl.kill();

    }, [children, speed]);

    return (
        <div ref={marqueeContainerRef} className="overflow-hidden whitespace-nowrap">
            <div ref={marqueeContentRef} className="inline-flex">
                <div className="inline-block">{children}</div>
            </div>
        </div>
    );
};


// NewsCard Component
const NewsCard = ({ article, onReadMore, cardRef }: { article: News; onReadMore: (slug: string) => void; cardRef: (el: HTMLDivElement | null) => void }) => {
    const { title, subtitle, imageUrl, layout } = article;
    
    // Accessibility: Handle keydown for Enter/Space to trigger the action
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onReadMore(article.slug);
        }
    };

    const content = (
         <div className="flex flex-col h-full p-4 sm:p-6 bg-white" data-flip-id={`content-${article.id}`}>
            <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wider">{title}</h3>
                <p className="mt-2 text-base sm:text-lg tracking-widest">{subtitle}</p>
            </div>
            <div className="flex-grow mt-4 pt-4 border-t-2 border-dashed border-black">
                <p className="text-sm leading-relaxed opacity-70">{article.content.substring(0, 150)}...</p>
            </div>
            <div className="mt-4 text-left font-bold uppercase tracking-widest hover:underline focus:outline-none">
                Read More
            </div>
        </div>
    );
    const image = (
        <div className="w-full h-48 sm:h-64 md:h-full bg-gray-200" data-flip-id={`image-${article.id}`}>
            <img src={imageUrl} alt={`Web development and design news image: ${title}`} className="w-full h-full object-cover" loading="lazy" />
        </div>
    );

    const commonClasses = "w-full border-b-2 border-black pb-8 cursor-pointer focus:outline-none";

    let cardLayout;
    if (layout === 'image-top') {
        cardLayout = <>{image}{content}</>;
    } else if (layout === 'image-right') {
        cardLayout = <div className="grid md:grid-cols-2 gap-4 md:gap-8">{content}{image}</div>;
    } else { // image-left
        cardLayout = <div className="grid md:grid-cols-2 gap-4 md:gap-8"><div className="md:order-last">{content}</div>{image}</div>;
    }

    return (
        <div 
            ref={cardRef} 
            onClick={() => onReadMore(article.slug)} 
            onKeyDown={handleKeyDown}
            className={commonClasses}
            role="button" // Accessibility: Indicate this div is interactive
            tabIndex="0" // Accessibility: Make it focusable
            aria-label={`Read more about ${title}`}
        >
            {cardLayout}
        </div>
    );
};

// ArticlePage Component
const ArticlePage = ({ article, onBack, articleRef }: { article: News; onBack: () => void; articleRef: React.RefObject<HTMLDivElement> }) => (
    <div ref={articleRef} className="fixed top-0 left-0 w-full h-full bg-white z-20 overflow-y-auto" style={{visibility: 'hidden'}}>
      <div className="max-w-4xl mx-auto py-8 md:py-16 px-4 sm:px-6 md:px-8">
        <button onClick={onBack} className="font-bold uppercase tracking-widest mb-8 hover:underline">
            NEWS/
        </button>
        <div className="w-full h-64 md:h-96 bg-gray-200 mb-8" data-flip-id={`image-${article.id}`}>
            <img src={article.imageUrl} alt={`Web development and creative design main image for news article: ${article.title}`} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div data-flip-id={`content-${article.id}`}>
          <h1 data-article-title className="text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-wider">{article.title}</h1>
          <p data-article-subtitle className="mt-4 text-lg sm:text-xl md:text-2xl tracking-widest">{article.subtitle}</p>
          <div className="my-8 border-t-2 border-dashed border-black"></div>
          <div data-article-content className="text-base md:text-lg leading-relaxed whitespace-pre-line">{article.content}</div>
        </div>
      </div>
    </div>
);

// HomePage Component
const HomePage = ({ news, onReadMore, setCardRefs, isArticleVisible, activeTag, setActiveTag, error }: {
  news: News[];
  onReadMore: (slug: string) => void;
  setCardRefs: (refs: Partial<Record<number, HTMLDivElement>>) => void;
  isArticleVisible: boolean;
  activeTag: string;
  setActiveTag: (tag: string) => void;
  error?: string | null;
}) => {
    const cardRefs = useRef<Partial<Record<number, HTMLDivElement>>>({});
    const glitchRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        setCardRefs(cardRefs.current);
    }, [setCardRefs]);
    useLayoutEffect(() => {
      if (!glitchRef.current) return;
      gsap.set(glitchRef.current, { opacity: 0, scale: 0.98, filter: 'none' });
      const tl = gsap.timeline();
      tl.to(glitchRef.current, { opacity: 1, duration: 0.01 });
      tl.to(glitchRef.current, { scale: 1.03, filter: 'drop-shadow(0 0 4px #f00)', duration: 0.04, ease: 'power1.in' }, ">-");
      tl.to(glitchRef.current, { scale: 0.97, filter: 'drop-shadow(0 0 4px #0ff)', duration: 0.04, ease: 'power1.in' }, "<");
      tl.to(glitchRef.current, { scale: 1, filter: 'none', duration: 0.08, ease: 'power1.out' }, ">-");
      tl.to(glitchRef.current, { opacity: 0.7, duration: 0.03, yoyo: true, repeat: 1 }, ">-");
      tl.to(glitchRef.current, { opacity: 1, duration: 0.03 }, ">-");
      return () => { tl.kill(); };
    }, []);
    const filteredNews = news.filter(article =>
        activeTag === 'All' || article.tags.includes(activeTag.toLowerCase())
    );
    const FilterButton = ({ tag }: { tag: string }) => {
        const isActive = activeTag === tag;
        return (
             <button
                className={`px-4 py-2 rounded-full border-2 border-black mr-2 mb-2 uppercase font-bold tracking-widest transition-colors ${isActive ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'}`}
                onClick={() => setActiveTag(tag)}
            >
                {tag}
            </button>
        );
    };
    // Get the latest three news titles (most recent first)
    const sortedNews = [...news].sort((a, b) => (b.id || 0) - (a.id || 0));
    const latestTitles = [
      sortedNews[0]?.title || '',
      sortedNews[1]?.title || sortedNews[0]?.title || '',
      sortedNews[2]?.title || sortedNews[1]?.title || sortedNews[0]?.title || '',
    ];
    return (
        <div ref={glitchRef} className="w-full py-8 md:py-16 px-4 sm:px-6 md:px-8">
  
            <header className="text-center items-start md:text-left py-8 md:py-12 border-b-2 border-black">
                <h1 className="text-5xl flex sm:text-6xl md:text-8xl font-bold tracking-widest">/news</h1>
                <div className="mt-4">
                    <Marquee speed={25 + Math.random() * 5}><p className="text-xl sm:text-2xl md:text-4xl font-bold uppercase tracking-wider mx-4">{latestTitles[0]}</p></Marquee>
                    <Marquee speed={20 + Math.random() * 5}><p className="text-xl sm:text-2xl md:text-4xl font-bold uppercase tracking-wider mx-4">{latestTitles[1]}</p></Marquee>
                    <Marquee speed={30 + Math.random() * 5}><p className="text-xl sm:text-2xl md:text-4xl font-bold uppercase tracking-wider mx-4">{latestTitles[2]}</p></Marquee>
                </div>
                 <div role="group" aria-label="Filter news by category" className="mt-8 flex flex-wrap justify-start md:justify-start gap-2 sm:gap-4">
                    <FilterButton tag="All" />
                    {Array.from(new Set(news.flatMap(n => n.tags.map(t => t.charAt(0).toUpperCase() + t.slice(1))))).map(tag => (
                        <FilterButton key={tag} tag={tag} />
                    ))}
                </div>
            </header>
            <main className="space-y-12 md:space-y-20 mt-12">
                {error ? (
                    <div className="text-red-500 p-4">{error}</div>
                ) : filteredNews.length === 0 ? (
                    <div className="text-gray-500 p-4">No news found.</div>
                ) : (
                    filteredNews.map(article => (
                    <NewsCard 
                        key={article.id} 
                        article={article} 
                        onReadMore={onReadMore}
                            cardRef={(el: HTMLDivElement | null) => cardRefs.current[article.id] = el || undefined}
                    />
                    ))
                )}
            </main>
        </div>
    );
};

// Main App Component
export default function App() {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [isArticleVisible, setIsArticleVisible] = useState(false);
    const [activeArticle, setActiveArticle] = useState<News | null>(null);
    const [activeTag, setActiveTag] = useState('All');
    const [cardRefs, setCardRefs] = useState<any>({});
    const articleRef = useRef<HTMLDivElement>(null);
    const [gsapLoaded, setGsapLoaded] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    
    useEffect(() => {
        setGsapLoaded(true);
    }, []);

    useEffect(() => {
        async function fetchNews() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('/api/news');
                const data = await res.json();
                setNews(data.news || []);
            } catch (err) {
                setError('Failed to fetch news');
            } finally {
                setLoading(false);
            }
        }
        fetchNews();
    }, []);

    const handleReadMore = (slug: string) => {
        router.push(`/pam/news/${slug}`);
    };

    const handleBack = () => {
        if (isAnimating || !gsapLoaded || !activeArticle) return;
        
        const cardEl = cardRefs[activeArticle.id];
        if (!cardEl) return;

        setIsAnimating(true);
        
        gsap.killTweensOf(articleRef.current.querySelectorAll('[data-article-title], [data-article-subtitle], [data-article-content]'));
        
        const state = Flip.getState(
            articleRef.current.querySelectorAll("[data-flip-id]")
        );

        // Animate all cards back to visibility
        Object.values(cardRefs).forEach(ref => {
            gsap.to(ref, { autoAlpha: 1, duration: 0.4, delay: 0.6 });
        });

        const masterTl = gsap.timeline({
            onComplete: () => {
                setActiveArticle(null);
                setIsAnimating(false);
                cardEl.style.visibility = 'visible';
            }
        });
        
        masterTl.to(articleRef.current.querySelectorAll('[data-article-title], [data-article-subtitle], [data-article-content]'), {
            autoAlpha: 0,
            duration: 0.3,
            stagger: 0.05,
        });
        
        masterTl.to(articleRef.current, {
            rotationY: -90,
            autoAlpha: 0,
            duration: 1,
            ease: 'power3.inOut',
            transformOrigin: 'left center',
        }, 0);

        const flip = Flip.from(state, {
            targets: cardEl.querySelectorAll("[data-flip-id]"),
            duration: 1,
            ease: "power3.inOut",
            scale: true,
        });
        
        masterTl.add(flip, 0);
    };
    
    useLayoutEffect(() => {
        if (activeArticle && gsapLoaded) {
            window.scrollTo(0,0);
            if(articleRef.current) articleRef.current.scrollTop = 0;
            
            const cardEl = cardRefs[activeArticle.id];
            if (!cardEl) {
                setIsAnimating(false);
                return;
            };

            const state = Flip.getState(
                cardEl.querySelectorAll("[data-flip-id]")
            );
            
            const titleEl = articleRef.current.querySelector('[data-article-title]');
            const subtitleEl = articleRef.current.querySelector('[data-article-subtitle]');
            const contentEl = articleRef.current.querySelector('[data-article-content]');
            
            const originalTitle = titleEl.textContent;
            const originalSubtitle = subtitleEl.textContent;
            const originalContent = contentEl.textContent;

            titleEl.textContent = '';
            subtitleEl.textContent = '';
            contentEl.textContent = '';
            
            gsap.set(articleRef.current, {
                visibility: 'visible',
                transformOrigin: 'left center',
                rotationY: -90,
                autoAlpha: 0
            });
            
            const masterTl = gsap.timeline({
                onComplete: () => setIsAnimating(false)
            });

            masterTl.to(articleRef.current, {
                rotationY: 0,
                autoAlpha: 1,
                duration: 1,
                ease: 'power3.inOut'
            });

            const flip = Flip.from(state, {
                targets: articleRef.current.querySelectorAll("[data-flip-id]"),
                duration: 1,
                ease: "power3.inOut",
                scale: true,
            });
            masterTl.add(flip, 0);

            const totalTypingDuration = 2; 
            const titleDuration = 0.5;
            const subtitleDuration = 0.5;
            const contentDuration = totalTypingDuration - titleDuration - subtitleDuration;

            masterTl.to(titleEl, { duration: titleDuration, text: originalTitle, ease: 'none' }, 0.5)
              .to(subtitleEl, { duration: subtitleDuration, text: originalSubtitle, ease: 'none' }, ">")
              .to(contentEl, { duration: contentDuration, text: originalContent, ease: 'none' }, ">");
        }
    }, [activeArticle, gsapLoaded]);

    if (loading) return <div className="p-8 text-center">Loading news...</div>;
    return (
        <div style={{ fontFamily: "'SF Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace", perspective: '1200px' }}
             className="bg-white text-black min-h-screen p-4 sm:p-6 md:p-8 w-screen">
      
            <div className="relative w-full">
                <HomePage 
                    news={news}
                    onReadMore={handleReadMore} 
                    setCardRefs={setCardRefs} 
                    isArticleVisible={isArticleVisible}
                    activeTag={activeTag}
                    setActiveTag={setActiveTag}
                    error={error}
                />
            </div>
            <div className="sr-only">News: web development, digital agency, SaaS, AI, technology updates</div>
            {/* <footer className="text-center py-12 mt-12 border-t-2 border-black">
     
            </footer> */}
        </div>
    );
}
