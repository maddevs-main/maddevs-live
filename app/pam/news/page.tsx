"use client"
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

// --- GSAP ---
// We will load GSAP, Flip plugin, and Text plugin from a CDN.
const gsapCdnUrl = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
const flipCdnUrl = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/Flip.min.js";
const textCdnUrl = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/TextPlugin.min.js";

// --- MOCK DATA ---
const mockNewsData = [
    {
        id: 1,
        title: "TERRA COTTA PLAGUE NEWS POST",
        subtitle: "cooking something great",
        imageUrl: "https://placehold.co/600x400/D2691E/000000?text=TERRA+COTTA",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien, vitae pellentesque sem placerat. In id cursus mi, pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra, inceptos himenaeos. \n\n Vivamus dictum magna vitae sem egestas, ac varius nisl venenatis. Donec et eleifend ex, non aliquam quam. Praesent ac magna sit amet sem scelerisque tristique. Cras commodo, elit a lacinia commodo, est magna malesuada est, et laoreet ex nibh non lectus.",
        layout: "image-top",
        tags: ['design', 'updates'],
    },
    {
        id: 2,
        title: "TERRA COTTA NEWS POST",
        subtitle: "exploring ancient forms",
        imageUrl: "https://placehold.co/600x400/D2691E/000000?text=ART",
        content: "Suspendisse potenti. Nullam in erat ut lectus feugiat pulvinar. Proin non elit eget odio feugiat eleifend. Sed eu magna sed justo ullamcorper feugiat. Integer in nisi vel justo consequat lacinia. Duis in porta justo, a volutpat sem. Curabitur vitae nisi vel sem bibendum ultrices. \n\n Nam sit amet nunc nec turpis viverra fermentum. Sed eu facilisis turpis. Nulla facilisi. Praesent nec egestas erat, et facilisis massa. Donec id libero at dolor tincidunt faucibus. Fusce vitae lorem eu justo aliquam egestas. Maecenas sed odio sit amet elit consequat consequat.",
        layout: "image-right",
        tags: ['products'],
    },
    {
        id: 3,
        title: "TERRA COTTA PLAGUE NEWS POST",
        subtitle: "a study in black and orange",
        imageUrl: "https://placehold.co/600x400/D2691E/000000?text=ANCIENT+LIFE",
        content: "Aenean euismod, nisl eget ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Sed euismod, nisl eget ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. \n\n Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.",
        layout: "image-left",
        tags: ['design'],
    },
     {
        id: 4,
        title: "THE LATEST DISCOVERIES",
        subtitle: "unearthing the past",
        imageUrl: "https://placehold.co/600x400/D2691E/000000?text=HISTORY",
        content: "Cras et libero eu ex feugiat tristique. Sed et justo non est condimentum ultrices. Nullam nec libero nec justo aliquam tincidunt. Sed nec nunc et justo consequat eleifend. \n\n Ut fringilla, justo a ultricies aliquam, nunc nunc tincidunt nunc, id lacinia nunc nunc nec nunc. Vivamus nec nunc nec nunc ultricies aliquam. Donec nec nunc nec nunc ultricies aliquam. Fusce nec nunc nec nunc ultricies aliquam.",
        layout: "image-top",
        tags: ['updates'],
    },
     {
        id: 5,
        title: "ANCIENT CIVILIZATIONS",
        subtitle: "stories etched in clay",
        imageUrl: "https://placehold.co/600x400/D2691E/000000?text=CULTURE",
        content: "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. \n\n Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.",
        layout: "image-right",
        tags: ['products', 'design'],
    }
];


// --- COMPONENTS ---

// Marquee Component for the flowing text banner
const Marquee = ({ children, speed = 25 }) => {
    const marqueeContainerRef = useRef(null);
    const marqueeContentRef = useRef(null);

    useLayoutEffect(() => {
        if (!window.gsap || !marqueeContentRef.current || !marqueeContainerRef.current) return;
        
        const container = marqueeContainerRef.current;
        const content = marqueeContentRef.current;
        const originalContent = content.children[0];
        if (!originalContent) return;

        const contentWidth = originalContent.offsetWidth;
        
        while (content.children.length > 1) {
            content.removeChild(content.lastChild);
        }

        const clonesNeeded = contentWidth > 0 ? Math.ceil(container.offsetWidth / contentWidth) + 1 : 1;

        for (let i = 0; i < clonesNeeded; i++) {
            content.appendChild(originalContent.cloneNode(true));
        }

        const tl = window.gsap.to(content, {
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
const NewsCard = ({ article, onReadMore, cardRef }) => {
    const { title, subtitle, imageUrl, layout } = article;
    
    // Accessibility: Handle keydown for Enter/Space to trigger the action
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onReadMore(article);
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
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
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
            onClick={() => onReadMore(article)} 
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
const ArticlePage = ({ article, onBack, articleRef }) => (
    <div ref={articleRef} className="fixed top-0 left-0 w-full h-full bg-white z-20 overflow-y-auto" style={{visibility: 'hidden'}}>
      <div className="max-w-4xl mx-auto py-8 md:py-16 px-4 sm:px-6 md:px-8">
        <button onClick={onBack} className="font-bold uppercase tracking-widest mb-8 hover:underline">
            NEWS/
        </button>
        <div className="w-full h-64 md:h-96 bg-gray-200 mb-8" data-flip-id={`image-${article.id}`}>
            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
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
const HomePage = ({ onReadMore, setCardRefs, isArticleVisible, activeTag, setActiveTag }) => {
    const cardRefs = useRef({});
    
    useEffect(() => {
        setCardRefs(cardRefs.current);
    }, [setCardRefs]);
    
    const filteredNews = mockNewsData.filter(article =>
        activeTag === 'All' || article.tags.includes(activeTag.toLowerCase())
    );

    const FilterButton = ({ tag }) => {
        const isActive = activeTag === tag;
        return (
             <button
                onClick={() => setActiveTag(tag)}
                className={`px-3 sm:px-4 py-2 border-2 border-black uppercase font-bold text-sm sm:text-base tracking-widest transition-colors ${
                    isActive ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
                }`}
            >
                {tag}
            </button>
        );
    }
    
    return(
        <div className="w-full" style={{ visibility: isArticleVisible ? 'hidden' : 'visible'}}>
            <header className="text-center md:text-left py-8 md:py-12 border-b-2 border-black">
                <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-widest uppercase">NEWS</h1>
                <div className="mt-4">
                    <Marquee speed={25 + Math.random() * 5}><p className="text-xl sm:text-2xl md:text-4xl font-bold uppercase tracking-wider mx-4">Lorem Ipsum Released</p></Marquee>
                    <Marquee speed={20 + Math.random() * 5}><p className="text-xl sm:text-2xl md:text-4xl font-bold uppercase tracking-wider mx-4">Lorem Ipsum Released</p></Marquee>
                    <Marquee speed={30 + Math.random() * 5}><p className="text-xl sm:text-2xl md:text-4xl font-bold uppercase tracking-wider mx-4">Lorem Ipsum Released</p></Marquee>
                </div>
                 <div role="group" aria-label="Filter news by category" className="mt-8 flex flex-wrap justify-center md:justify-start gap-2 sm:gap-4">
                    <FilterButton tag="All" />
                    <FilterButton tag="Design" />
                    <FilterButton tag="Products" />
                    <FilterButton tag="Updates" />
                </div>
            </header>

            <main className="space-y-12 md:space-y-20 mt-12">
                {filteredNews.map(article => (
                    <NewsCard 
                        key={article.id} 
                        article={article} 
                        onReadMore={onReadMore}
                        cardRef={el => cardRefs.current[article.id] = el}
                    />
                ))}
                 {filteredNews.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-lg tracking-widest">No news found for this category.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

// Main App Component
export default function App() {
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [cardRefs, setCardRefs] = useState({});
    const [isAnimating, setIsAnimating] = useState(false);
    const articleRef = useRef(null);
    const [gsapLoaded, setGsapLoaded] = useState(false);
    const [activeTag, setActiveTag] = useState('All');
    
    // Load GSAP scripts and register plugins
    useEffect(() => {
        const loadScript = (src, onLoad) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = onLoad;
            document.body.appendChild(script);
            return script;
        };

        const gsapScript = loadScript(gsapCdnUrl, () => {
             loadScript(flipCdnUrl, () => {
                loadScript(textCdnUrl, () => {
                    window.gsap.registerPlugin(window.Flip, window.TextPlugin);
                    setGsapLoaded(true);
                });
             });
        });

        return () => {
             if (gsapScript && document.body.contains(gsapScript)) document.body.removeChild(gsapScript);
        };
    }, []);

    const handleReadMore = (article) => {
        if (isAnimating || !gsapLoaded) return;

        setIsAnimating(true);
        const cardEl = cardRefs[article.id];
        if (!cardEl) return;

        // Animate out all other cards
        Object.values(cardRefs).forEach(ref => {
            if (ref !== cardEl) {
                window.gsap.to(ref, { autoAlpha: 0, duration: 0.4 });
            }
        });

        // After a slight delay, set the selected article to trigger the main animation
        setTimeout(() => {
            setSelectedArticle(article);
        }, 150); // 150ms delay
    };

    const handleBack = () => {
        if (isAnimating || !gsapLoaded || !selectedArticle) return;
        
        const cardEl = cardRefs[selectedArticle.id];
        if (!cardEl) return;

        setIsAnimating(true);
        
        window.gsap.killTweensOf(articleRef.current.querySelectorAll('[data-article-title], [data-article-subtitle], [data-article-content]'));
        
        const state = window.Flip.getState(
            articleRef.current.querySelectorAll("[data-flip-id]")
        );

        // Animate all cards back to visibility
        Object.values(cardRefs).forEach(ref => {
            window.gsap.to(ref, { autoAlpha: 1, duration: 0.4, delay: 0.6 });
        });

        const masterTl = window.gsap.timeline({
            onComplete: () => {
                setSelectedArticle(null);
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

        const flip = window.Flip.from(state, {
            targets: cardEl.querySelectorAll("[data-flip-id]"),
            duration: 1,
            ease: "power3.inOut",
            scale: true,
        });
        
        masterTl.add(flip, 0);
    };
    
    useLayoutEffect(() => {
        if (selectedArticle && gsapLoaded) {
            window.scrollTo(0,0);
            if(articleRef.current) articleRef.current.scrollTop = 0;
            
            const cardEl = cardRefs[selectedArticle.id];
            if (!cardEl) {
                setIsAnimating(false);
                return;
            };

            const state = window.Flip.getState(
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
            
            window.gsap.set(articleRef.current, {
                visibility: 'visible',
                transformOrigin: 'left center',
                rotationY: -90,
                autoAlpha: 0
            });
            
            const masterTl = window.gsap.timeline({
                onComplete: () => setIsAnimating(false)
            });

            masterTl.to(articleRef.current, {
                rotationY: 0,
                autoAlpha: 1,
                duration: 1,
                ease: 'power3.inOut'
            });

            const flip = window.Flip.from(state, {
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
    }, [selectedArticle, gsapLoaded]);


    return (
        <div style={{ fontFamily: "'SF Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace", perspective: '1200px' }}
             className="bg-white text-black min-h-screen p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto relative">
                <HomePage 
                    onReadMore={handleReadMore} 
                    setCardRefs={setCardRefs} 
                    isArticleVisible={!!selectedArticle}
                    activeTag={activeTag}
                    setActiveTag={setActiveTag}
                />
                {selectedArticle && (
                    <ArticlePage 
                        article={selectedArticle} 
                        onBack={handleBack}
                        articleRef={articleRef}
                    />
                )}
            </div>
            <footer className="text-center py-12 mt-12 border-t-2 border-black">
                <p className="tracking-widest text-sm">TERRA COTTA NEWS • © 2025</p>
            </footer>
        </div>
    );
}
