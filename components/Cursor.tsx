'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';

interface MenuItem {
  label: string;
  action: () => void;
}

interface MenuState {
  visible: boolean;
  x: number;
  y: number;
  items: MenuItem[];
}

// User's CustomCursor component, now with a dynamic context menu
export default function CustomCursor() {
  // State to manage the context menu's visibility, position, and items
  const [menu, setMenu] = useState<MenuState>({
    visible: false,
    x: 0,
    y: 0,
    items: [],
  });

  // Add refs to track mounted state and cleanup
  const isMountedRef = useRef(true);
  const cleanupFunctionsRef = useRef<(() => void)[]>([]);

  // --- Global Click to Hide Menu ---
  const handleGlobalClick = useCallback(
    (e: MouseEvent) => {
      if (menu.visible && !(e.target as Element).closest('#custom-context-menu')) {
        setMenu(prev => ({ ...prev, visible: false }));
      }
    },
    [menu.visible]
  );

  // --- Main Effect Hook ---
  useEffect(() => {
    isMountedRef.current = true;

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const cursorContainer = document.getElementById('custom-cursor-container');

    if (isTouchDevice && cursorContainer) {
      cursorContainer.style.display = 'none';
      return;
    }

    const cursor = document.getElementById('custom-cursor-circle');
    const indicator = document.getElementById('scroll-indicator');
    const cursorVisuals = document.getElementById('cursor-visual-container');
    let scrollTimeout: NodeJS.Timeout;

    // --- Event Handlers ---
    const moveCursor = (e: MouseEvent) => {
      if (!isMountedRef.current) return;

      const { clientX, clientY, target } = e;

      // Move the entire container
      if (cursorContainer) {
        cursorContainer.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }

      const textSelector =
        'p, h1, h2, h3, h4, h5, h6, li, blockquote, pre, code, span, label, input[type="text"], input[type="email"], input[type="search"], input[type="password"], input[type="url"], textarea, [contenteditable="true"]';
      const closestLink = (target as Element).closest('a');
      const isButton = (target as Element).closest('button');
      const isContextMenu = (target as Element).closest('#custom-context-menu');
      const isNavItem = (target as Element).closest('.text'); // Add this line to detect NavItem elements

      // Reset classes and styles first
      if (cursor) {
        cursor.classList.remove('text-hover', 'link-hover');
      }
      if (indicator) {
        indicator.style.opacity = '1';
      }

      // Apply new state if not hovering over the context menu
      if (isContextMenu) {
        // Keep default cursor over the menu
      } else if (isNavItem) {
        // Keep normal cursor for NavItem elements - don't add any special classes
      } else if (closestLink && cursor) {
        cursor.classList.add('link-hover');
        if (indicator) indicator.style.opacity = '0';
      } else if ((target as Element).matches(textSelector) && !isButton && cursor) {
        cursor.classList.add('text-hover');
        if (indicator) indicator.style.opacity = '0';
      }
    };

    const detectScroll = (e: WheelEvent) => {
      if (!isMountedRef.current || !indicator || !cursor) return;
      clearTimeout(scrollTimeout);

      // Remove all scroll classes
      indicator.classList.remove(
        'scrolling-up',
        'scrolling-down',
        'scrolling-left',
        'scrolling-right'
      );
      cursor.classList.add('scrolling');

      // Check for horizontal scrolling (shift + wheel or trackpad horizontal scroll)
      if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        // Horizontal scrolling
        if (e.deltaX > 0 || (e.shiftKey && e.deltaY > 0)) {
          indicator.classList.add('scrolling-right');
        } else {
          indicator.classList.add('scrolling-left');
        }
      } else {
        // Vertical scrolling
        if (e.deltaY > 0) {
          indicator.classList.add('scrolling-down');
        } else {
          indicator.classList.add('scrolling-up');
        }
      }

      scrollTimeout = setTimeout(() => {
        if (isMountedRef.current && indicator && cursor) {
          indicator.classList.remove(
            'scrolling-up',
            'scrolling-down',
            'scrolling-left',
            'scrolling-right'
          );
          cursor.classList.remove('scrolling');
        }
      }, 400);
    };

    const handleClick = () => {
      if (!isMountedRef.current || !cursor) return;
      cursor.classList.add('clicking');
      setTimeout(() => {
        if (isMountedRef.current && cursor) {
          cursor.classList.remove('clicking');
        }
      }, 150);
    };

    // --- Clipboard Helper ---
    const copyToClipboard = (text: string) => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (err) {

      }
      // Safe removal with existence check
      if (document.body.contains(textArea)) {
        document.body.removeChild(textArea);
      }
    };

    // --- Action Wrapper (to close menu after action) ---
    const createAction = (func: () => void) => () => {
      func();
      setMenu(prev => ({ ...prev, visible: false }));
    };

    // --- Right Click Handler ---
    const handleRightClick = (e: MouseEvent) => {
      e.preventDefault();
      if (!isMountedRef.current || !cursor) return;

      const target = e.target as Element;
      const newMenuItems: Array<{ label: string; action: () => void }> = [];
      const closestLink = target.closest('a');

      if (closestLink && closestLink.href) {
        newMenuItems.push({
          label: 'Open Link in New Tab',
          action: createAction(() => window.open(closestLink.href, '_blank')),
        });
        newMenuItems.push({
          label: 'Copy Link Address',
          action: createAction(() => copyToClipboard(closestLink.href)),
        });
      } else if (target.textContent && target.textContent.trim() !== '') {
        newMenuItems.push({
          label: 'Copy Text',
          action: createAction(() => copyToClipboard(target.textContent || '')),
        });
      }

      newMenuItems.push({
        label: 'Reload Page',
        action: createAction(() => window.location.reload()),
      });

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
      cursor.classList.add('right-click');
      setTimeout(() => {
        if (isMountedRef.current && cursor) {
          cursor.classList.remove('right-click');
        }
      }, 400);
    };

    // Add event listeners
    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('wheel', detectScroll, { passive: true });
    window.addEventListener('click', handleClick);
    window.addEventListener('contextmenu', handleRightClick);
    document.addEventListener('click', handleGlobalClick);

    // Store cleanup functions
    cleanupFunctionsRef.current = [
      () => window.removeEventListener('mousemove', moveCursor),
      () => window.removeEventListener('wheel', detectScroll),
      () => window.removeEventListener('click', handleClick),
      () => window.removeEventListener('contextmenu', handleRightClick),
      () => document.removeEventListener('click', handleGlobalClick),
      () => clearTimeout(scrollTimeout),
    ];

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      cleanupFunctionsRef.current.forEach(cleanup => cleanup());
      cleanupFunctionsRef.current = [];
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
          background-color: rgba(0, 0, 0, 0.68);
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
             width: 4px;
          height: 48px;
          border-radius: 1px;
          background-color: black;
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
          border-color: red;
        }
        #custom-cursor-circle.text-hover.scrolling {
           transform: translate(-50%, -50%) scale(1.2);
        }
        
        /* Vertical scroll indicators */
        #scroll-indicator.scrolling-up {
          border-top-color: red;
        }
        #scroll-indicator.scrolling-down {
          border-bottom-color: red;
        }
        
        /* Horizontal scroll indicators */
        #scroll-indicator.scrolling-left {
          border-left-color: red;
        }
        #scroll-indicator.scrolling-right {
          border-right-color: red;
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
