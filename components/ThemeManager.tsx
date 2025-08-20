'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { applyThemeVars } from '@/styles';

const ThemeManager: React.FC = () => {
  const { theme } = useTheme();

  useEffect(() => {
    // Apply CSS variables when theme changes
    if (theme) {
      applyThemeVars(theme);
    }
  }, [theme]);

  return null;
};

export default ThemeManager;