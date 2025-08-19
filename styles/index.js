export const styles = {
  paddingX: 'padding-x',
  paddingY: 'padding-y',
  padding: 'padding',

  heroHeadText: 'hero-head-text',
  heroSubText: 'hero-sub-text',

  sectionHeadText: 'section-head-text',
  sectionSubText: 'section-sub-text',
};

// Theme definitions with your custom specifications
export const themes = {
  obsidian: {
    name: 'Obsidian Black',
    '--primary-color': '#0a0a0a',
    '--secondary-color': '#ffffff',
    '--tertiary-color': '#1a1a1a',
    '--black-100': '#141414',
    '--black-200': '#000000',
    '--white-100': '#ffffff',
    '--hero-pattern': 'url(/images/herobg_adjusted.png)',
    '--text-color-variable': '#ff6b6b',
    '--gradient-start': '#ff6b6b',
    '--gradient-end': 'rgba(255, 107, 107, 0)',
  },
  cosmicVoyage: {
    name: 'Cosmic Purple',
    '--primary-color': '#0a0514',
    '--secondary-color': '#aaa6c3',
    '--tertiary-color': '#1a0f2e',
    '--black-100': '#140a23',
    '--black-200': '#05020a',
    '--white-100': '#f8f5ff',
    '--hero-pattern': 'url(/images/herobg.png)',
    '--text-color-variable': '#a855f7',
    '--gradient-start': '#a855f7',
    '--gradient-end': 'rgba(168, 85, 247, 0)',
  },
  midnightBlue: {
    name: 'Ocean Blue',
    '--primary-color': '#0c1621',
    '--secondary-color': '#8892b0',
    '--tertiary-color': '#1e293b',
    '--black-100': '#0f172a',
    '--black-200': '#020617',
    '--white-100': '#f1f5f9',
    '--hero-pattern': 'url(/images/herobg_midnight_blue.png)',
    '--text-color-variable': '#06b6d4',
    '--gradient-start': '#06b6d4',
    '--gradient-end': 'rgba(6, 182, 212, 0)',
  },
  deepForest: {
    name: 'Matrix Green',
    '--primary-color': '#0a1a0a',
    '--secondary-color': '#64ffda',
    '--tertiary-color': '#14532d',
    '--black-100': '#052e16',
    '--black-200': '#022c22',
    '--white-100': '#f0fdf4',
    '--hero-pattern': 'url(/images/greenbg.png)',
    '--text-color-variable': '#10b981',
    '--gradient-start': '#10b981',
    '--gradient-end': 'rgba(16, 185, 129, 0)',
  },
  crimsonFire: {
    name: 'Crimson Fire',
    '--primary-color': '#1a0a0a',
    '--secondary-color': '#ffcdd2',
    '--tertiary-color': '#7f1d1d',
    '--black-100': '#450a0a',
    '--black-200': '#0c0404',
    '--white-100': '#fef2f2',
    '--hero-pattern': 'url(/images/herobg_adjusted.png)',
    '--text-color-variable': '#ef4444',
    '--gradient-start': '#ef4444',
    '--gradient-end': 'rgba(239, 68, 68, 0)',
  },
};

// Theme management functions
export const getCurrentTheme = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('selectedTheme') || 'default';
  }
  return 'default';
};

export const setTheme = (themeKey) => {
  if (typeof window !== 'undefined') {
    const theme = themes[themeKey];
    if (theme) {
      Object.entries(theme).forEach(([property, value]) => {
        if (property.startsWith('--')) {
          document.documentElement.style.setProperty(property, value);
        }
      });
      localStorage.setItem('selectedTheme', themeKey);
    }
  }
};
