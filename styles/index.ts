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
    '--text-color-variable': string;
    '--gradient-start': string;
    '--gradient-end': string;
  };
}

interface Themes {
  [key: string]: Theme;
}

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
      '--text-color-variable': '#ff6b6b',
      '--gradient-start': '#ff6b6b',
      '--gradient-end': 'rgba(255, 107, 107, 0)',
    },
  },
  cosmicVoyage: {
    name: 'Cosmic Purple',
    cssVars: {
      '--primary-color': '#0a0514',
      '--secondary-color': '#ffffff',
      '--tertiary-color': '#1a0f2e',
      '--black-100': '#140a23',
      '--black-200': '#05020a',
      '--white-100': '#f8f5ff',
      '--text-color-variable': '#a855f7',
      '--gradient-start': '#a855f7',
      '--gradient-end': 'rgba(168, 85, 247, 0)',
    },
  },
  glacierSapphire: {
    name: 'Glacier Sapphire',
    cssVars: {
      '--primary-color': '#07121a',
      '--secondary-color': '#ffffff',
      '--tertiary-color': '#0b2740',
      '--black-100': '#0b1b2b',
      '--black-200': '#030a12',
      '--white-100': '#ffffff',
      '--text-color-variable': '#60a5fa',
      '--gradient-start': '#60a5fa',
      '--gradient-end': 'rgba(96, 165, 250, 0)',
    },
  },
  auroraJade: {
    name: 'Aurora Jade',
    cssVars: {
      '--primary-color': '#05110d',
      '--secondary-color': '#ffffff',
      '--tertiary-color': '#0f2c24',
      '--black-100': '#0b1f19',
      '--black-200': '#030806',
      '--white-100': '#ffffff',
      '--text-color-variable': '#2dd4bf',
      '--gradient-start': '#2dd4bf',
      '--gradient-end': 'rgba(45, 212, 191, 0)',
    },
  },
};

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
