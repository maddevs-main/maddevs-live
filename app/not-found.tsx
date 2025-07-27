"use client"
import React from 'react';

// This is the isolated error page component.
// It takes an optional 'message' and 'errorCode' as props.
// The 'onNavigate' prop is a function that should handle routing back to the home page.
const NotFoundPage = ({ message = "this page doesnt exist.", errorCode = 404, onNavigate }) => (
    // Added `relative` class to this container to act as a positioning context for the absolute button.
    <div className="bg-[#FF0000] text-white font-mono h-screen w-screen overflow-hidden flex flex-col relative">
      
      {/* The button is now positioned absolutely relative to the main container. */}
      {/* `top-8` and `right-8` place it in the top-right corner with some padding. */}
      {/* `whitespace-nowrap` prevents the text from breaking into multiple lines. */}
      {/* z-10 ensures the button stays on top of other content if there's any overlap. */}
      <button  
          onClick={() => onNavigate('/')}
          className="absolute top-8 right-8 z-10 bg-[#f0f0f0] border-0 border-black px-4 py-2 text-black font-mono-menu text-sm font-bold shadow-[4px_4px_0px_black] hover:shadow-[2px_2px_0px_black] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all whitespace-nowrap"
          >
          return to home
      </button>

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
              Disclaimer: This page displays server-side errors. For client-side issues (errors related to your browser or device), please refer to your browser's developer console for more details.
          </p>
      </div>
      <div className="sr-only">404 Not Found: web development, user experience, digital agency</div>
    </div>
);

// The main App component is only for display purposes in this isolated view.
export default function App() {
    // A dummy navigation function for demonstration.
    const handleNavigate = (page) => {
        console.log(`Navigating to ${page}...`);
    }
    return <NotFoundPage onNavigate={handleNavigate} />;
}
