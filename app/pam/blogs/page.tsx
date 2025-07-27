"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

// -- COMPONENTS --

type Blog = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  date: string;
  content: string;
  imageUrl: string;
  detailImageUrl2: string;
  isPinned: boolean;
  tags: string[]; // Added tags field
};

const Typewriter = ({ text, speed = 50, className = "", onFinished = () => {} }: { text: string; speed?: number; className?: string; onFinished?: () => void }) => {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        let i = 0;
        setDisplayText(''); 
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
                onFinished();
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed, onFinished]);

    return <span className={className}>{displayText}</span>;
};

const BlogCard = ({ blog, onSelect, variant = 'default' }: { blog: Blog; onSelect: (slug: string) => void; variant?: string }) => {
    // Sidebar variant now has a hard shadow effect, similar to the main cards.
    if (variant === 'sidebar') {
        return (
            <div
                className="bg-[#F3F3E0] grid grid-cols-3 gap-4 items-start cursor-pointer border-2 border-[#22222] transition-all duration-200 ease-in-out p-0 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#282222] active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_#282222]"
                onClick={() => onSelect(blog.slug)}
            >
                <div className="col-span-1">
                    <img src={blog.imageUrl} alt={`Web development and design blog image: ${blog.title}`} className="w-full object-cover aspect-square" loading="lazy" />
                </div>
                <div className="col-span-2 self-center">
                    <p className="text-xs text-[#474242] mb-1">{blog.date}</p>
                    <p className="text-sm font-semibold leading-tight text-[#000000]">{blog.title}</p>
                    {/* Tags */}
                    <div className="mt-1 flex flex-wrap gap-1">
                      {blog.tags && blog.tags.map((tag, idx) => (
                        <span key={idx} className="bg-[#d1cfcf] text-xs px-2 py-0.5 rounded-full text-[#282222] uppercase font-bold tracking-wider">{tag}</span>
                      ))}
                    </div>
                </div>
            </div>
        );
    }

    // Default card for the main grid.
    return (
        <div 
            className="bg-[#948979] flex flex-col cursor-pointer transition-all duration-200 border-2 border-[#282222] ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#282222] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_#282222]"
            onClick={() => onSelect(blog.slug)}
        >
            <div className="overflow-hidden">
                <img src={blog.imageUrl} alt={`Web development and design blog image: ${blog.title}`} className="w-full object-cover aspect-[4/3]" loading="lazy" />
            </div>
            <div className="p-4 sm:p-6 flex flex-col border-t-1 border-[#282222] flex-grow"> 
                <h3 className="text-lg font-semibold text-[#000000]">{blog.title}</h3>
                <p className="text-sm text-[#282222] mt-2 flex-grow">{blog.excerpt}</p>
                {/* Tags */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {blog.tags && blog.tags.map((tag, idx) => (
                    <span key={idx} className="bg-[#d1cfcf] text-xs px-2 py-0.5 rounded-full text-[#282222] uppercase font-bold tracking-wider">{tag}</span>
                  ))}
                </div>
                <p className="text-xs text-[#474242] mt-4 text-right">{blog.date}</p>
            </div>
        </div>
    );
};

const BlogListPage = ({ blogs, onNavigate, error }: { blogs: Blog[]; onNavigate: (slug: string) => void; error?: string | null }) => {
    const [visible, setVisible] = useState(false);
    const [activeTag, setActiveTag] = useState('All');
    const containerRef = React.useRef<HTMLDivElement>(null);
    // Pinned blogs are filtered for the sidebar.
    const pinnedBlogs = blogs.filter((b: Blog) => b.isPinned);
    // All blogs (including pinned and unpinned)
    const allBlogs = blogs;
    // Tag filtering
    const allTags = Array.from(new Set(blogs.flatMap(b => (b.tags ?? []).map(t => t.charAt(0).toUpperCase() + t.slice(1)))));
    const filteredBlogs = activeTag === 'All' ? allBlogs : allBlogs.filter(blog => (blog.tags ?? []).map(t => t.toLowerCase()).includes(activeTag.toLowerCase()));
    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);
    React.useLayoutEffect(() => {
      if (!containerRef.current) return;
      gsap.set(containerRef.current, { opacity: 0, y: 40 });
      gsap.to(containerRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
    }, []);
    
    const handleNavigation = (slug: string) => {
        setVisible(false);
        setTimeout(() => {
            onNavigate(slug);
        }, 500);
    };
    // Tag filter button
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
    return (
        <div ref={containerRef} className={`bg-[#748873] min-h-screen p-4 sm:p-8 md:p-12 font-mono`}>
             <div className='h-[60px]'></div>
            <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-12">
                <h1 className="text-5xl md:text-7xl font-bold text-[#000000] ">/blogs</h1>
                <div role="group" aria-label="Filter blogs by tag" className="mt-8 flex flex-wrap gap-2 sm:gap-4">
                  <FilterButton tag="All" />
                  {allTags.map(tag => (
                    <FilterButton key={tag} tag={tag} />
                  ))}
                </div>
            </header>
          
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-16">
  {/* Sidebar: visible on top in mobile, on side in large screens */}
  <aside className="lg:col-span-1 order-1 lg:order-2">
    
    <div className="sticky top-12">
      <div className="bg-[#393E46] p-6">
        <h3 className="font-semibold text-[white] mb-4 border-b border-[#A0A0A0] pb-2"> pinned</h3>
        <div className="space-y-4">
          {pinnedBlogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} onSelect={handleNavigation} variant="sidebar" />
          ))}
        </div>
      </div>
    </div>
  </aside>

  {/* Main blog content */}
  <div className="lg:col-span-2 order-2 lg:order-1">
  <p>* date published</p>
  <br></br>
    {error ? (
      <div className="text-red-500 p-4">{error}</div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredBlogs.map(blog => (
          <BlogCard key={blog.id} blog={blog} onSelect={handleNavigation} />
        ))}
      </div>
    )}
  </div>
</main>
        </div>
    );
};

const BlogDetailPage = ({ blog, onNavigateBack }: { blog: Blog; onNavigateBack: () => void }) => {
    const [visible, setVisible] = useState(false);
    const [typingStep, setTypingStep] = useState(0);

    const paragraphs = blog ? blog.content.split('\n\n') : [];

    const totalCharacters = blog ? blog.title.length + blog.content.length : 1;
    const typingSpeed = Math.max(1, 2000 / totalCharacters);


    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);
    
    const handleTypingFinished = useCallback(() => {
        setTypingStep(prev => prev + 1);
    }, []);
    
    const handleBackNavigation = () => {
        setVisible(false);
        setTimeout(() => {
            onNavigateBack();
        }, 500);
    };

    if (!blog) {
        return (
            <div className="bg-[white] min-h-screen flex flex-col items-center justify-center font-mono">
                <p>Blog not found.</p>
                 <button onClick={onNavigateBack} className="text-[#474242] hover:text-[#000000] underline mt-4">
                    &larr; Back to all blogs
                </button>
            </div>
        );
    }

    return (
        <div className={`bg-[#282222] min-h-screen p-4 sm:p-8 md:p-12 font-mono transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
             <div className='h-[60px]'></div>
            <header className="flex justify-between items-start mb-8 md:mb-12">
                 <div>
               
                    <button onClick={handleBackNavigation} className="text-base text-[#C0BDBD] hover:text-[#FFFFFF] mb-4 block hover:underline">
                        blogs/
                    </button>
                    <h1 className="text-4xl md:text-6xl font-bold text-[#FFFFFF] max-w-2xl min-h-[80px] md:min-h-[144px]">
                        {typingStep === 0 && <Typewriter text={blog.title} speed={typingSpeed} onFinished={handleTypingFinished} />}
                        {typingStep > 0 && blog.title}
                    </h1>
                </div>
                <div className={`text-right flex-shrink-0 ml-4 mt-12 transition-opacity duration-500 ${typingStep > 0 ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-sm font-semibold text-[#FFFFFF]">{blog.author}</p>
                    <p className="text-sm text-[#C0BDBD]">{blog.date}</p>
                </div>
            </header>

            <article className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-[#D1D0D0] leading-relaxed">
                <div className="lg:col-span-2">
                    <div className="columns-1 md:columns-2 gap-12">
                       {paragraphs.map((paragraph, index) => (
                           <div key={index} className="mb-4 break-inside-avoid">
                               {typingStep > index + 1 && <p>{paragraph}</p>}
                               {typingStep === index + 1 && (
                                   <Typewriter text={paragraph} speed={typingSpeed} onFinished={handleTypingFinished}/>
                               )}
                           </div>
                       ))}
                    </div>
                </div>
                
                <div className={`lg:col-span-1 space-y-8 transition-opacity duration-1000 ${typingStep > 0 ? 'opacity-100' : 'opacity-0'}`}>
                    <img src={blog.imageUrl} alt={`Web development and design blog image: ${blog.title}`} className="w-full object-cover" loading="lazy"/>
                    <img src={blog.detailImageUrl2} alt="Creative design detail view image" className="w-full object-cover" loading="lazy" />
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-4">
                      {blog.tags && blog.tags.map((tag, idx) => (
                        <span key={idx} className="bg-[#d1cfcf] text-xs px-2 py-0.5 rounded-full text-[#282222] uppercase font-bold tracking-wider">{tag}</span>
                      ))}
                    </div>
                </div>
            </article>
        </div>
    );
};


// -- MAIN APP --

export default function App() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [navigation, setNavigation] = useState<{ selectedBlogId: number | null; page: 'list' | 'detail' }>({ selectedBlogId: null, page: 'list' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchBlogs() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('/api/blogs');
                const data = await res.json();
                setBlogs(data.blogs || []);
            } catch (err) {
                setError('Failed to fetch blogs');
            } finally {
                setLoading(false);
            }
        }
        fetchBlogs();
    }, []);

    const handleNavigateToDetail = (slug: string) => {
        router.push(`/pam/blogs/${slug}`);
    };
    const handleNavigateToList = () => {
        setNavigation({ selectedBlogId: null, page: 'list' });
    };

    if (loading) return <div className="p-8 text-center">Loading blogs...</div>;
    return (
        <>
          <div className="sr-only">Blogs: web development, user experience, SaaS, AI, digital product insights</div>
          <BlogListPage blogs={blogs} onNavigate={handleNavigateToDetail} error={error} />
        </>
    );
}

