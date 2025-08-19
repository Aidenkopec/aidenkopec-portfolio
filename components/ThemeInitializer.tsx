'use client';
import { useEffect } from 'react';
import { initializeTheme } from '../styles';

const ThemeInitializer: React.FC = () => {
  useEffect(() => {
    // Initialize theme on app startup
    initializeTheme();
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default ThemeInitializer;