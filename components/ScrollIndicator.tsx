'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollIndicatorProps {
  className?: string;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768;
      setIsMobile(isMobileDevice);

      // Only show on mobile
      if (isMobileDevice) {
        // Show after a short delay to let the page load
        const timer = setTimeout(() => setIsVisible(true), 2000);
        return () => clearTimeout(timer);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleScrollDown = () => {
    // Smooth scroll to the About section
    const aboutSection = document.querySelector('#about');

    if (aboutSection) {
      aboutSection.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    } else {
      // Fallback: scroll down by viewport height
      window.scrollBy({
        top: window.innerHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startY = touch.clientY;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const currentY = touch.clientY;
      const deltaY = startY - currentY;

      // If swiped up (negative deltaY), scroll down
      if (deltaY > 50) {
        handleScrollDown();
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  // Don't render on desktop
  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
            duration: 0.6,
          }}
          className={`absolute left-1/2 transform -translate-x-1/2 z-[9998] pointer-events-auto ${className}`}
          style={{
            bottom: 'calc(80px + env(safe-area-inset-bottom))', // Position above music bar
            touchAction: 'pan-y',
          }}
        >
          {/* Text and arrow without button container */}
          <div
            className="flex items-center gap-2 text-white cursor-pointer select-none"
            onClick={handleScrollDown}
            onTouchStart={handleTouchStart}
          >
            {/* Text */}
            <span className="text-sm font-medium tracking-wide">
              Scroll Down
            </span>

            <motion.div
              animate={{
                y: [0, 3, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-4 h-4"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-full h-full"
              >
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
              </svg>
            </motion.div>
          </div>

          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl -z-10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollIndicator;
