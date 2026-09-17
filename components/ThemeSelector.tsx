'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

import { themes, getThemePreviewColors } from '../styles';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  isOpen,
  onClose,
  isMobile = false,
}) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleThemeChange = (themeKey: string): void => {
    setTheme(themeKey);
    // Close the selector after a short delay for better UX
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen || !mounted) return null;

  return (
    <div
      ref={selectorRef}
      className={`absolute top-full ${isMobile ? 'left-0' : 'right-0'} mt-2 ${
        isMobile ? 'w-72' : 'w-80'
      } z-[9999] rounded-xl border border-tertiary bg-black-100 p-4 shadow-2xl`}
    >
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-secondary'>Choose Theme</h3>
        <button
          onClick={onClose}
          className='text-xl text-secondary transition-colors hover:text-secondary'
        >
          ×
        </button>
      </div>

      <div className='max-h-80 space-y-3 overflow-y-auto'>
        {Object.entries(themes).map(([themeKey, themeData]) => {
          const colors = getThemePreviewColors(themeKey);
          const isSelected = theme === themeKey;

          return (
            <div
              key={themeKey}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleThemeChange(themeKey);
              }}
              className={`relative cursor-pointer rounded-lg border p-3 transition-all duration-300 ${
                isSelected
                  ? 'border-[var(--text-color-variable)] bg-[var(--tertiary-color)] shadow-lg'
                  : 'border-tertiary bg-tertiary hover:border-[var(--text-color-variable)] hover:bg-[var(--tertiary-color)]'
              } `}
            >
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <h4 className='mb-2 text-sm font-medium text-secondary'>
                    {themeData.name}
                  </h4>
                  <div className='flex items-center gap-2'>
                    {colors && (
                      <>
                        <div
                          className='h-4 w-4 rounded-full border border-gray-600'
                          style={{ backgroundColor: colors.primary }}
                          title='Primary Color'
                        />
                        <div
                          className='h-4 w-4 rounded-full border border-gray-600'
                          style={{ backgroundColor: colors.accent }}
                          title='Accent Color'
                        />
                        <div
                          className='h-4 w-4 rounded-full border border-gray-600'
                          style={{ backgroundColor: colors.secondary }}
                          title='Secondary Color'
                        />
                      </>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <div className='text-sm font-medium text-[var(--text-color-variable)]'>
                    ✓ Active
                  </div>
                )}
              </div>

              {/* Theme preview gradient */}
              {colors && (
                <div
                  className='absolute top-0 right-0 h-full w-1 rounded-r-lg'
                  style={{
                    background: `linear-gradient(to bottom, ${colors.accent}, ${colors.primary})`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className='mt-4 border-t border-tertiary pt-3'>
        <p className='text-center text-xs text-secondary'>
          Themes are automatically saved
        </p>
      </div>
    </div>
  );
};

export default ThemeSelector;
