'use client';
import React, { useState, useEffect, useCallback } from 'react';

// This is the reusable component, now with a text transition effect.
export default function CreativeSection() {
  // Array of words to cycle through, now all lowercase.
  const words = ['story', 'idea', 'meaning', 'value', 'dream'];
  // The character set for the glitch effect
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';

  // State to keep track of the current word's index
  const [currentIndex, setCurrentIndex] = useState(0);
  // State for the text that is actually displayed on screen
  const [displayText, setDisplayText] = useState(words[0]);

  // This function handles the glitch animation
  const triggerGlitch = useCallback(
    (targetWord: string) => {
      const scrambleDuration = 800; // Total duration of the glitch effect
      const frameRate = 40; // Milliseconds per frame update

      // Interval to rapidly change the text to random characters
      const scrambleInterval = setInterval(() => {
        let randomText = '';
        for (let i = 0; i < targetWord.length; i++) {
          randomText += chars[Math.floor(Math.random() * chars.length)];
        }
        setDisplayText(randomText);
      }, frameRate);

      // Timeout to stop the scrambling and reveal the final word
      setTimeout(() => {
        clearInterval(scrambleInterval);
        setDisplayText(targetWord);
      }, scrambleDuration);
    },
    [chars]
  );

  // This effect controls the loop of displaying a word and then glitching to the next one
  useEffect(() => {
    const wordDisplayTime = 2500; // How long each correct word is shown

    const cycleTimeout = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % words.length;
      triggerGlitch(words[nextIndex]);
      setCurrentIndex(nextIndex);
    }, wordDisplayTime);

    // Cleanup function to clear the timeout when the component is unmounted
    return () => clearTimeout(cycleTimeout);
  }, [currentIndex, triggerGlitch, words]);

  return (
    // Using justify-between to space the top and bottom content. All text is lowercase.
    <div className="subsection min-h-screen w-full flex flex-col justify-between bg-[#E9E3DF] text-[#222222] overflow-hidden font-mono">
      {/* The top section with a list of words */}
      <div className="flex flex-col mt-0 w-full">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-normal border-t-1 border-[#222222] py-4 px-6 sm:px-8">
          intent
        </h2>
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-normal border-t-2 border-[#222222] py-4 px-6 sm:px-8">
          desire
        </h2>
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-normal border-t-2 border-b-2 border-[#222222] py-4 px-6 sm:px-8">
          objective
        </h2>
      </div>

      {/* The bottom section with the glitching text */}
      <div className="pb-10">
        <h1 className="text-[8vw] sm:text-[10vw] md:text-[9vw] font-bold leading-none break-words flex items-baseline px-6 sm:px-8">
          {/* The static part of the text */}
          <span>the &nbsp;</span>

          {/* This container holds the animated text */}
          <div className="relative h-[1.2em] w-[8em]">
            <span>"{displayText}",</span>
          </div>
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mt-4 px-6 sm:px-8">
          simple, but significant.
        </h2>
      </div>
    </div>
  );
}
