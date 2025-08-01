'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

interface NotFoundPageProps {
  message?: string;
  errorCode?: number;
  onNavigate: (path: string) => void;
  onGoBack: () => void;
}

// This is the isolated error page component.
// It takes an optional 'message' and 'errorCode' as props.
// The 'onNavigate' prop is a function that should handle routing back to the home page.
// The 'onGoBack' prop is a function that should handle going back to the previous page.
const NotFoundPage = ({
  message = 'this page doesnt exist.',
  errorCode = 404,
  onNavigate,
  onGoBack,
}: NotFoundPageProps) => (
  // Added `relative` class to this container to act as a positioning context for the absolute button.
  <div className="bg-[#FF0000] text-white font-mono h-screen w-screen overflow-hidden flex flex-col relative">
    {/* Button container positioned absolutely in the top-right area */}
    <div className="absolute top-48 right-40 z-10 flex flex-col gap-4">
      {/* Return to home button */}
      <button
        onClick={() => onNavigate('/')}
        className="bg-[#f0f0f0] border-0 border-black px-4 py-2 text-black font-mono-menu text-sm font-bold shadow-[4px_4px_0px_black] hover:shadow-[2px_2px_0px_black] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all whitespace-nowrap"
      >
        return to home
      </button>

      {/* Go back to previous page button */}
      <button
        onClick={onGoBack}
        className="bg-[#f0f0f0] border-0 border-black px-4 py-2 text-black font-mono-menu text-sm font-bold shadow-[4px_4px_0px_black] hover:shadow-[2px_2px_0px_black] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all whitespace-nowrap"
      >
        go back to previous page
      </button>
    </div>

    {/* Main error content area */}
    <div className="flex-grow flex items-center justify-center relative">
      <div
        className="absolute whitespace-nowrap font-bold leading-none"
        style={{ fontSize: '28vw', top: '50%', left: '50%', transform: 'translate(-44%, -50%)' }}
      >
        /ERROR
      </div>
      <div
        className="absolute text-[4vw] sm:text-[3vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[32px] leading-tight w-full px-8 text-center"
        style={{ top: '60%', left: '50%', transform: 'translate(-50%, 400%)' }}
      >
        <span>code: {errorCode}</span>
        <span className="mx-2 sm:mx-4">|</span>
        <span>message: "{message}"</span>
      </div>
      {/* The button was moved from here to the top of the component. */}
    </div>

    {/* Footer section with disclaimer */}
    <div className="w-full pb-4">
      <div className="w-full h-px bg-white mb-2"></div>
      <p className="text-xs text-center text-white/80 px-4 sm:px-8">
        Disclaimer: This page displays server-side errors. For client-side issues (errors related to
        your browser or device), please refer to your browser's developer console for more details.
      </p>
    </div>
    <div className="sr-only">404 Not Found: web development, user experience, digital agency</div>
  </div>
);

// The main App component now properly handles navigation
export default function App() {
  const router = useRouter();

  // Proper navigation function that uses Next.js router
  const handleNavigate = (path: string) => {
    router.push(path);
  };

  // Go back to previous page function
  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      // If no previous page in history, go to home
      router.push('/');
    }
  };

  return <NotFoundPage onNavigate={handleNavigate} onGoBack={handleGoBack} />;
}
