export const styles = {
  paddingX: 'padding-x',
  paddingY: 'padding-y',
  padding: 'padding',

  heroHeadText: 'hero-head-text',
  heroSubText: 'hero-sub-text',

  sectionHeadText: 'section-head-text',
  sectionSubText: 'section-sub-text',
};

interface Theme {
  name: string;
  cssVars: {
    '--primary-color': string;
    '--secondary-color': string;
    '--tertiary-color': string;
    '--black-100': string;
    '--black-200': string;
    '--white-100': string;
    '--hero-pattern': string;
    '--text-color-variable': string;
    '--gradient-start': string;
    '--gradient-end': string;
  };
}

interface Themes {
  [key: string]: Theme;
}

// Theme definitions with your custom specifications
export const themes: Themes = {
  obsidian: {
    name: 'Obsidian Black',
    cssVars: {
      '--primary-color': '#0a0a0a',
      '--secondary-color': '#ffffff',
      '--tertiary-color': '#1a1a1a',
      '--black-100': '#141414',
      '--black-200': '#000000',
      '--white-100': '#ffffff',
      '--hero-pattern': 'url(/backgrounds/hero-bg-adjusted.png)',
      '--text-color-variable': '#ff6b6b',
      '--gradient-start': '#ff6b6b',
      '--gradient-end': 'rgba(255, 107, 107, 0)',
    },
  },
  cosmicVoyage: {
    name: 'Cosmic Purple',
    cssVars: {
      '--primary-color': '#0a0514',
      '--secondary-color': '#aaa6c3',
      '--tertiary-color': '#1a0f2e',
      '--black-100': '#140a23',
      '--black-200': '#05020a',
      '--white-100': '#f8f5ff',
      '--hero-pattern': 'url(/backgrounds/hero-bg.png)',
      '--text-color-variable': '#a855f7',
      '--gradient-start': '#a855f7',
      '--gradient-end': 'rgba(168, 85, 247, 0)',
    },
  },
  midnightBlue: {
    name: 'Ocean Blue',
    cssVars: {
      '--primary-color': '#0c1621',
      '--secondary-color': '#8892b0',
      '--tertiary-color': '#1e293b',
      '--black-100': '#0f172a',
      '--black-200': '#020617',
      '--white-100': '#f1f5f9',
      '--hero-pattern': 'url(/backgrounds/hero-bg-midnight-blue.png)',
      '--text-color-variable': '#06b6d4',
      '--gradient-start': '#06b6d4',
      '--gradient-end': 'rgba(6, 182, 212, 0)',
    },
  },
  deepForest: {
    name: 'Matrix Green',
    cssVars: {
      '--primary-color': '#0a1a0a',
      '--secondary-color': '#64ffda',
      '--tertiary-color': '#14532d',
      '--black-100': '#052e16',
      '--black-200': '#022c22',
      '--white-100': '#f0fdf4',
      '--hero-pattern': 'url(/backgrounds/hero-bg-green.png)',
      '--text-color-variable': '#10b981',
      '--gradient-start': '#10b981',
      '--gradient-end': 'rgba(16, 185, 129, 0)',
    },
  },
  crimsonFire: {
    name: 'Crimson Fire',
    cssVars: {
      '--primary-color': '#1a1a0a',
      '--secondary-color': '#ffcdd2',
      '--tertiary-color': '#7f1d1d',
      '--black-100': '#450a0a',
      '--black-200': '#0c0404',
      '--white-100': '#fef2f2',
      '--hero-pattern': 'url(/backgrounds/hero-bg-adjusted.png)',
      '--text-color-variable': '#ef4444',
      '--gradient-start': '#ef4444',
      '--gradient-end': 'rgba(239, 68, 68, 0)',
    },
  },
};

// Utility function to apply theme CSS variables
// This function is no longer needed as theme variables are applied via CSS classes.
// export const applyThemeVars = (themeKey: string): void => {
//   if (typeof window !== 'undefined') {
//     const theme = themes[themeKey];
//     if (theme && theme.cssVars) {
//       Object.entries(theme.cssVars).forEach(([property, value]) => {
//         document.documentElement.style.setProperty(property, value);
//       });
//     }
//   }
// };

// Helper function to get theme preview colors for UI
export const getThemePreviewColors = (themeKey: string) => {
  const theme = themes[themeKey];
  if (!theme) return null;

  return {
    primary: theme.cssVars['--primary-color'],
    accent: theme.cssVars['--text-color-variable'],
    secondary: theme.cssVars['--tertiary-color'],
  };
};
