'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import LenisSmoothScroll from '@/components/LenisSmoothScroll';

// Blog type (should match backend)
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
  tags: string[];
};

const Typewriter = ({
  text,
  speed = 50,
  className = '',
  onFinished = () => { },
}: {
  text: string;
  speed?: number;
  className?: string;
  onFinished?: () => void;
}) => {
  const [displayText, setDisplayText] = useState('');
  useEffect(() => {
    let i = 0;
    setDisplayText('');
    const timer = setInterval(
      () => {
        if (i < text.length) {
          setDisplayText(prev => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(timer);
          onFinished();
        }
      },
      Math.max(10, speed * 0.4)
    );
    return () => clearInterval(timer);
  }, [text, speed, onFinished]);
  return <span className={className}>{displayText}</span>;
};

interface BlogClientProps {
  blog: Blog;
}

export default function BlogClient({ blog }: BlogClientProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [typingStep, setTypingStep] = useState(0);

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

    setTimeout(() => setVisible(true), 10);

    return () => {
      const endTime = performance.now();
      const loadTime = ((endTime - startTime) / 1000).toFixed(2);
      console.log(`The page loaded in ${loadTime} seconds`);
    };
  }, []);

  const handleTypingFinished = useCallback(() => {
    setTypingStep(prev => prev + 1);
  }, []);

  const handleBackNavigation = () => {
    router.push('/pam/blogs');
  };

  const paragraphs = blog.content.split('\n\n');
  const totalCharacters = blog.title.length + blog.content.length;
  const typingSpeed = Math.max(1, 2000 / totalCharacters);

  return (
    <div
      className={`bg-[#282222] min-h-screen p-4 sm:p-8 md:p-12 font-mono transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <LenisSmoothScroll />
      <div className="h-[60px]"></div>
      <header className="flex justify-between items-start mb-8 md:mb-12">
        <div>
          <button
            onClick={handleBackNavigation}
            className="text-4xl text-[#C0BDBD] hover:text-[#FFFFFF] mb-4 block hover:underline"
          >
            blogs/
          </button>
          <h1 className="text-4xl md:text-6xl font-bold text-[#FFFFFF] max-w-2xl min-h-[80px] md:min-h-[144px]">
            {typingStep === 0 && (
              <Typewriter text={blog.title} speed={typingSpeed} onFinished={handleTypingFinished} />
            )}
            {typingStep > 0 && blog.title}
          </h1>
          <div className="flex flex-wrap gap-1 mt-4">
            {blog.tags &&
              blog.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#d1cfcf] text-xs px-2 py-0.5 rounded-full text-[#282222] uppercase font-bold tracking-wider"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>
        <div
          className={`text-right flex-shrink-0 ml-4 mt-12 transition-opacity duration-500 ${typingStep > 0 ? 'opacity-100' : 'opacity-0'}`}
        >
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
                  <Typewriter
                    text={paragraph}
                    speed={typingSpeed}
                    onFinished={handleTypingFinished}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Only render sidebar if there are valid images */}
        {(isValidImageUrl(blog.imageUrl) || isValidImageUrl(blog.detailImageUrl2)) && (
          <div
            className={`lg:col-span-1 space-y-8 transition-opacity duration-1000 ${typingStep > 0 ? 'opacity-100' : 'opacity-0'}`}
          >
            {isValidImageUrl(blog.imageUrl) && (
              <img
                src={blog.imageUrl}
                alt={`Web development and design blog main image: ${blog.title}`}
                className="w-full object-cover"
                loading="lazy"
              />
            )}
            {isValidImageUrl(blog.detailImageUrl2) && (
              <img
                src={blog.detailImageUrl2}
                alt="Creative design detail view image"
                className="w-full object-cover"
                loading="lazy"
              />
            )}
          </div>
        )}
      </article>
    </div>
  );
}
