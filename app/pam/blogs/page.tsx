"use client"
import React, { useState, useEffect, useCallback } from 'react';

// Mock Data for the blog posts
// The isPinned boolean is used to control which posts appear in the sidebar.
const mockBlogs = [
    {
        id: 1,
        title: 'Terra Cota Blog Name',
        excerpt: 'This is Lorem Ipsum, only typed by me so even navigating to elsewhere isn’t worth it for this, i hope this fulfills the design requirements and your imagination necessities.',
        author: 'Arjuna Dhananjaya',
        date: '12th May \'25',
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut laoreet ac sapien sed. Class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut laoreet ac sapien sed. Class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos.\n\nFaucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut laoreet ac sapien sed. Class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos.`,
        imageUrl: 'https://placehold.co/600x400/E6DACE/282222?text=Ancient+Art+1',
        detailImageUrl2: 'https://placehold.co/600x800/E6DACE/282222?text=Detail+View',
        isPinned: true,
    },
    {
        id: 2,
        title: 'Exploring Ancient Vases',
        excerpt: 'A deep dive into the stories painted on classical pottery, revealing tales of gods, heroes, and daily life from a bygone era.',
        author: 'Helena Troy',
        date: '10th May \'25',
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut laoreet ac sapien sed. Class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos.`,
        imageUrl: 'https://placehold.co/600x400/E6DACE/282222?text=Ancient+Art+2',
        detailImageUrl2: 'https://placehold.co/600x800/E6DACE/282222?text=Vase+Detail',
        isPinned: true,
    },
    {
        id: 3,
        title: 'The Symposium in Art',
        excerpt: 'Analyzing the depiction of social gatherings and philosophical discussions on ancient Greek kraters and kylixes.',
        author: 'Socrates Jr.',
        date: '8th May \'25',
        content: `This is a detailed exploration of symposium scenes in art. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.`,
        imageUrl: 'https://placehold.co/600x400/E6DACE/282222?text=Ancient+Art+3',
        detailImageUrl2: 'https://placehold.co/600x800/E6DACE/282222?text=Symposium+Art',
        isPinned: false,
    },
    {
        id: 4,
        title: 'Mythological Creatures',
        excerpt: 'From the Minotaur to the Hydra, a look at the fantastical beasts that adorned ancient pottery and their symbolic meanings.',
        author: 'Perseus Jackson',
        date: '5th May \'25',
        content: `Myths and legends come to life on these ancient artifacts. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.`,
        imageUrl: 'https://placehold.co/600x400/E6DACE/282222?text=Ancient+Art+4',
        detailImageUrl2: 'https://placehold.co/600x800/E6DACE/282222?text=Creature+Detail',
        isPinned: false,
    },
    {
        id: 5,
        title: 'The Craft of Black-Figure Pottery',
        excerpt: 'Understanding the intricate techniques used by artisans to create the iconic black-figure style of vase painting.',
        author: 'Athena Craftswoman',
        date: '2nd May \'25',
        content: 'The technique is fascinating. You start with the clay shape, then apply a slip that turns black during firing... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.',
        imageUrl: 'https://placehold.co/600x400/E6DACE/282222?text=Ancient+Art+5',
        detailImageUrl2: 'https://placehold.co/600x800/E6DACE/282222?text=Pottery+Craft',
        isPinned: true,
    },
     {
        id: 6,
        title: 'Daily Life in Ancient Greece',
        excerpt: 'Pottery provides a unique window into the everyday activities, clothing, and customs of the ancient world.',
        author: 'Historian Maximus',
        date: '1st May \'25',
        content: 'From weaving to warfare, the scenes offer invaluable insights. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor.',
        imageUrl: 'https://placehold.co/600x400/E6DACE/282222?text=Ancient+Art+6',
        detailImageUrl2: 'https://placehold.co/600x800/E6DACE/282222?text=Daily+Life',
        isPinned: false,
    }
];

// -- COMPONENTS --

const Typewriter = ({ text, speed = 50, className = "", onFinished = () => {} }) => {
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

const BlogCard = ({ blog, onSelect, variant = 'default' }) => {
    // Sidebar variant now has a hard shadow effect, similar to the main cards.
    if (variant === 'sidebar') {
        return (
            <div
                className="grid grid-cols-3 gap-4 items-start cursor-pointer transition-all duration-200 ease-in-out bg-[#D1D0D0] p-3 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#282222] active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_#282222]"
                onClick={() => onSelect(blog.id)}
            >
                <div className="col-span-1">
                    <img src={blog.imageUrl} alt={blog.title} className="w-full object-cover aspect-square" />
                </div>
                <div className="col-span-2 self-center">
                    <p className="text-xs text-[#474242] mb-1">{blog.date}</p>
                    <p className="text-sm font-semibold leading-tight text-[#000000]">{blog.title}</p>
                </div>
            </div>
        );
    }

    // Default card for the main grid.
    return (
        <div 
            className="bg-[#D1D0D0] flex flex-col cursor-pointer transition-all duration-200 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#282222] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_#282222]"
            onClick={() => onSelect(blog.id)}
        >
            <div className="overflow-hidden">
                <img src={blog.imageUrl} alt={blog.title} className="w-full object-cover aspect-[4/3]" />
            </div>
            <div className="p-4 sm:p-6 flex flex-col flex-grow"> 
                <h3 className="text-lg font-semibold text-[#000000]">{blog.title}</h3>
                <p className="text-sm text-[#282222] mt-2 flex-grow">{blog.excerpt}</p>
                <p className="text-xs text-[#474242] mt-4 text-right">{blog.date}</p>
            </div>
        </div>
    );
};

const BlogListPage = ({ onNavigate }) => {
    const [visible, setVisible] = useState(false);
    // Pinned blogs are filtered for the sidebar.
    const pinnedBlogs = mockBlogs.filter(b => b.isPinned);
    // Regular blogs are all non-pinned posts.
    const regularBlogs = mockBlogs.filter(b => !b.isPinned);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);
    
    const handleNavigation = (blogId) => {
        setVisible(false);
        setTimeout(() => {
            onNavigate(blogId);
        }, 500);
    };

    return (
        <div className={`bg-[#EFEFEF] min-h-screen p-4 sm:p-8 md:p-12 font-mono transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <header className="flex justify-between items-center mb-12">
                <h1 className="text-5xl md:text-7xl font-bold text-[#000000] uppercase">Blogs</h1>
            </header>
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-16">
                {/* Main Content Area now only contains regular blogs */}
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {regularBlogs.map(blog => (
                            <BlogCard key={blog.id} blog={blog} onSelect={handleNavigation} />
                        ))}
                    </div>
                </div>
                {/* Sidebar now contains the Pinned posts */}
                <aside className="lg:col-span-1">
                     <div className="sticky top-12">
                        <div className="bg-[#D1D0D0] p-6">
                            <h3 className="font-semibold text-[#000000] mb-4 border-b border-[#A0A0A0] pb-2">°pinned</h3>
                            <div className="space-y-4">
                                {pinnedBlogs.map(blog => (
                                    <BlogCard key={blog.id} blog={blog} onSelect={handleNavigation} variant="sidebar" />
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

const BlogDetailPage = ({ blog, onNavigateBack }) => {
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
            <div className="bg-white min-h-screen flex flex-col items-center justify-center font-mono">
                <p>Blog not found.</p>
                 <button onClick={onNavigateBack} className="text-[#474242] hover:text-[#000000] underline mt-4">
                    &larr; Back to all blogs
                </button>
            </div>
        );
    }

    return (
        <div className={`bg-[#282222] min-h-screen p-4 sm:p-8 md:p-12 font-mono transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <header className="flex justify-between items-start mb-8 md:mb-12">
                 <div>
                    <button onClick={handleBackNavigation} className="text-base text-[#C0BDBD] hover:text-[#FFFFFF] mb-4 block hover:underline">
                        Blogs/
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
                    <img src={blog.imageUrl} alt={blog.title} className="w-full object-cover"/>
                    <img src={blog.detailImageUrl2} alt="Detail view of pottery" className="w-full object-cover" />
                </div>
            </article>
        </div>
    );
};


// -- MAIN APP --

export default function App() {
    const [navigation, setNavigation] = useState({ page: 'list', selectedBlogId: null });

    useEffect(() => {
        document.body.style.fontFamily = `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
        document.documentElement.style.scrollBehavior = 'smooth';
    }, []);

    const handleNavigateToDetail = (blogId) => {
        setNavigation({ page: 'detail', selectedBlogId: blogId });
        window.scrollTo(0, 0); 
    };

    const handleNavigateToList = () => {
        setNavigation({ page: 'list', selectedBlogId: null });
        window.scrollTo(0, 0);
    };

    const selectedBlog = navigation.selectedBlogId
        ? mockBlogs.find(b => b.id === navigation.selectedBlogId)
        : null;

    return (
        <div className="antialiased">
            {navigation.page === 'list' ? (
                <BlogListPage onNavigate={handleNavigateToDetail} />
            ) : (
                <BlogDetailPage blog={selectedBlog} onNavigateBack={handleNavigateToList} />
            )}
        </div>
    );
}
