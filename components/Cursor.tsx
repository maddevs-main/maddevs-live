import React, { useEffect, useState, useCallback } from 'react';

// User's CustomCursor component, now with a dynamic context menu
export default function CustomCursor() {
  // State to manage the context menu's visibility, position, and items
  const [menu, setMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    items: [],
  });

  // --- Global Click to Hide Menu ---
  const handleGlobalClick = useCallback((e) => {
      if (menu.visible && !e.target.closest('#custom-context-menu')) {
          setMenu(prev => ({ ...prev, visible: false }));
      }
  }, [menu.visible]);

  // --- Main Effect Hook ---
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const cursorContainer = document.getElementById('custom-cursor-container');

    if (isTouchDevice && cursorContainer) {
      cursorContainer.style.display = 'none';
      return;
    }

    const cursor = document.getElementById("custom-cursor-circle");
    const indicator = document.getElementById("scroll-indicator");
    const cursorVisuals = document.getElementById("cursor-visual-container"); // New container for blend mode
    let scrollTimeout;

    // --- Event Handlers ---
    const moveCursor = (e) => {
      const { clientX, clientY, target } = e;
      
      // Move the entire container
      if (cursorContainer) {
        cursorContainer.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }

      const textSelector = 'p, h1, h2, h3, h4, h5, h6, li, blockquote, pre, code, span, label, input[type="text"], input[type="email"], input[type="search"], input[type="password"], input[type="url"], textarea, [contenteditable="true"]';
      const closestLink = target.closest('a');
      const isButton = target.closest('button');
      const isContextMenu = target.closest('#custom-context-menu'); // Check for context menu

      // Reset classes and styles first
      cursor.classList.remove('text-hover', 'link-hover');
      indicator.style.opacity = '1';

      // Apply new state if not hovering over the context menu
      if (isContextMenu) {
        // Keep default cursor over the menu
      } else if (closestLink) {
        cursor.classList.add('link-hover');
        indicator.style.opacity = '0';
      } else if (target.matches(textSelector) && !isButton) {
        cursor.classList.add('text-hover');
        indicator.style.opacity = '0';
      }
    };

    const detectScroll = (e) => {
      if (!indicator || !cursor) return;
      clearTimeout(scrollTimeout);
      indicator.classList.remove("scrolling-up", "scrolling-down");
      cursor.classList.add("scrolling");

      if (e.deltaY > 0) {
        indicator.classList.add("scrolling-down");
      } else {
        indicator.classList.add("scrolling-up");
      }

      scrollTimeout = setTimeout(() => {
        indicator.classList.remove("scrolling-up", "scrolling-down");
        cursor.classList.remove("scrolling");
      }, 400);
    };

    const handleClick = () => {
      if (!cursor) return;
      cursor.classList.add("clicking");
      setTimeout(() => cursor.classList.remove("clicking"), 150);
    };

    // --- Clipboard Helper ---
    const copyToClipboard = (text) => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
      }
      document.body.removeChild(textArea);
    };

    // --- Action Wrapper (to close menu after action) ---
    const createAction = (func) => () => {
      func();
      setMenu(prev => ({ ...prev, visible: false }));
    };

    // --- Right Click Handler ---
    const handleRightClick = (e) => {
      e.preventDefault();
      if (!cursor) return;
      
      const target = e.target;
      const newMenuItems = [];
      const closestLink = target.closest('a');

      if (closestLink && closestLink.href) {
        newMenuItems.push({ label: 'Open Link in New Tab', action: createAction(() => window.open(closestLink.href, '_blank')) });
        newMenuItems.push({ label: 'Copy Link Address', action: createAction(() => copyToClipboard(closestLink.href)) });
      } else if (target.innerText && target.innerText.trim() !== '') {
        newMenuItems.push({ label: 'Copy Text', action: createAction(() => copyToClipboard(target.innerText)) });
      }
      
      newMenuItems.push({ label: 'Reload Page', action: createAction(() => window.location.reload()) });

      const menuWidth = 180; 
      const menuHeight = newMenuItems.length * 40;
      let x = e.clientX;
      let y = e.clientY;

      if (x + menuWidth > window.innerWidth) {
        x = window.innerWidth - menuWidth - 10;
      }
      if (y + menuHeight > window.innerHeight) {
        y = window.innerHeight - menuHeight - 10;
      }

      setMenu({ visible: true, x, y, items: newMenuItems });
      cursor.classList.add("right-click");
      setTimeout(() => cursor.classList.remove("right-click"), 400);
    };
    
    // Add event listeners
    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("wheel", detectScroll, { passive: true });
    window.addEventListener("click", handleClick);
    window.addEventListener("contextmenu", handleRightClick);
    document.addEventListener('click', handleGlobalClick);

    // Cleanup function
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("wheel", detectScroll);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("contextmenu", handleRightClick);
      document.removeEventListener('click', handleGlobalClick);
      clearTimeout(scrollTimeout);
    };
  }, [handleGlobalClick]);

  return (
    <>
      <style>{`
        /* Hide the default browser cursor */
        body, a, button, input, textarea {
          cursor: none;
        }
        /* Main container for all custom elements */
        #custom-cursor-container {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 99999999;
          transform: translate3d(0, 0, 0); /* Initial position */
        }
        /* This new container holds the visual parts of the cursor and applies the blend mode */
        #cursor-visual-container {
            position: absolute;
            top: 0;
            left: 0;
            /* transform: translate(-50%, -50%); */ /* This was causing the displacement, so it's removed. */
            mix-blend-mode: difference;
            pointer-events: none;
            z-index: 10000000; /* Ensure cursor is on top of the menu */
        }
        /* The main cursor circle */
        #custom-cursor-circle {
          position: absolute; /* Position relative to the visual container */
          top: 0;
          left: 0;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid white;
          background-color: rgba(255, 255, 255, 0.8);
          transform: translate(-50%, -50%);
          transition: transform 0.2s ease, background-color 0.3s ease, border-color 0.3s ease, width 0.3s ease, height 0.3s ease, border-radius 0.3s ease;
        }

        /* The scroll indicator element */
        #scroll-indicator {
          position: absolute; /* Position relative to the visual container */
          top: 0;
          left: 0;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: 2px solid transparent;
          transform: translate(-50%, -50%);
          transition: border-color 0.3s ease, opacity 0.3s ease;
        }

        /* --- Context Menu Styles --- */
        #custom-context-menu {
            position: fixed; /* Position relative to the viewport */
            background-color: #222222;
            border-radius: 0px;
            border: 1px solid #555555;
            padding: 5px;
            z-index: 9999999; /* High z-index, but lower than cursor */
            pointer-events: all; /* Allow clicks on the menu */
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        #custom-context-menu ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        #custom-context-menu li {
            padding: 10px 15px;
            font-size: 14px;
            color: #f0f0f0; /* Light text for dark background */
            border-radius: 0px;
            cursor: none; /* Use custom cursor over menu items */
            transition: background-color 0.2s ease;
            white-space: nowrap;
        }
        #custom-context-menu li:hover {
            background-color: #333333;
        }

        /* --- STATE-BASED STYLES --- */
        #custom-cursor-circle.link-hover {
          width: 40px; /* Wider shape */
          height: 3px;  /* Thin like an underscore */
          border-radius: 2px; /* Slightly rounded corners */
          background-color: white; /* Solid color for the blend mode */
          border: none; /* Remove the border */
          transform: translate(-50%, -50%); /* Reset any scaling */
        }
        #custom-cursor-circle.text-hover {
          width: 2px;
          height: 28px;
          border-radius: 1px;
          background-color: white;
          border-color: white;
          transform: translate(-50%, -50%);
        }
        #custom-cursor-circle.clicking {
          transform: translate(-50%, -50%) scale(0.9);
        }
        #custom-cursor-circle.text-hover.clicking {
          transform: translate(-50%, -50%) scale(0.9);
        }
        #custom-cursor-circle.link-hover.clicking {
          transform: translate(-50%, -50%) scaleY(0.6); /* Squeeze the underscore vertically */
        }
        #custom-cursor-circle.right-click {
          background-color: rgba(255, 0, 0, 0.8);
          border-color: red;
        }
        #custom-cursor-circle.scrolling {
          transform: translate(-50%, -50%) scale(1.2);
          border-color: white;
        }
        #custom-cursor-circle.text-hover.scrolling {
           transform: translate(-50%, -50%) scale(1.2);
        }
        #scroll-indicator.scrolling-up {
          border-top-color: white;
        }
        #scroll-indicator.scrolling-down {
          border-bottom-color: white;
        }
      `}</style>

      {/* The main container now just tracks position */}
      <div id="custom-cursor-container">
        {/* This new container handles the blend mode and z-index to keep the cursor on top */}
        <div id="cursor-visual-container">
            <div id="custom-cursor-circle"></div>
            <div id="scroll-indicator"></div>
        </div>
      </div>
      
      {/* The context menu is now separate and will not be affected by the blend mode */}
      {menu.visible && (
          <div id="custom-context-menu" style={{ top: `${menu.y}px`, left: `${menu.x}px` }}>
              <ul>
                  {menu.items.map((item, index) => (
                      <li key={index} onClick={item.action}>
                          {item.label}
                      </li>
                  ))}
              </ul>
          </div>
      )}
    </>
  );
}
