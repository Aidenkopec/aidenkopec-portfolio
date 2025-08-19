export const styles = {
  paddingX: 'sm:px-16 px-6',
  paddingY: 'sm:py-16 py-6',
  padding: 'sm:px-16 px-6 sm:py-16 py-10',

  heroHeadText:
    'font-black text-white lg:text-[80px] sm:text-[60px] xs:text-[50px] text-[40px] lg:leading-[98px] mt-2',
  heroSubText:
    'text-[#dfd9ff] font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px]',

  sectionHeadText:
    'text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]',
  sectionSubText:
    'sm:text-[18px] text-[14px] text-secondary uppercase tracking-wider',
};

// Theme definitions
export const themes = {
  default: {
    name: 'Default',
    '--primary-color': '#050816',
    '--secondary-color': '#aaa6c3',
    '--tertiary-color': '#151030',
    '--black-100': '#100d25',
    '--black-200': '#090325',
    '--white-100': '#f3f3f3',
    '--text-color-variable': '#915EFF',
  },
  midnight: {
    name: 'Midnight Blue',
    '--primary-color': '#0a192f',
    '--secondary-color': '#8892b0',
    '--tertiary-color': '#112240',
    '--black-100': '#0a192f',
    '--black-200': '#020c1b',
    '--white-100': '#ccd6f6',
    '--text-color-variable': '#64ffda',
  },
  dark: {
    name: 'Dark',
    '--primary-color': '#000000',
    '--secondary-color': '#666666',
    '--tertiary-color': '#1a1a1a',
    '--black-100': '#000000',
    '--black-200': '#000000',
    '--white-100': '#ffffff',
    '--text-color-variable': '#ff6b6b',
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
