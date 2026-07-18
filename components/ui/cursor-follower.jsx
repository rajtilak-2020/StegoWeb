'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CursorFollower() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e) => {
      // Check if hovering over clickable elements
      if (
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.tagName.toLowerCase() === 'a' ||
        e.target.tagName.toLowerCase() === 'input' ||
        e.target.closest('button') ||
        e.target.closest('a') ||
        e.target.closest('.cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  // Don't render on server
  if (typeof window === 'undefined') return null;

  return (
    <>
      {/* Outer Springy Circle */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[100] hidden md:flex items-center justify-center mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          opacity: isVisible ? 1 : 0
        }}
        animate={{ 
          width: isHovering ? 48 : 32,
          height: isHovering ? 48 : 32,
          marginLeft: isHovering ? -24 : -16,
          marginTop: isHovering ? -24 : -16,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className={`w-full h-full rounded-full transition-all duration-300 ${
          isHovering 
            ? 'border-2 border-brand-400 bg-brand-500/20 shadow-[0_0_20px_rgba(20,184,166,0.6)] backdrop-blur-sm' 
            : 'border border-brand-500/40 bg-brand-500/5 shadow-[0_0_15px_rgba(20,184,166,0.2)]'
        }`} />
      </motion.div>
    </>
  );
}
