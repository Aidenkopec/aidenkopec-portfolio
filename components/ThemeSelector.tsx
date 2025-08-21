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
      } bg-black-100 border border-tertiary rounded-xl p-4 shadow-2xl z-[9999]`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-secondary  text-lg font-semibold">Choose Theme</h3>
        <button
          onClick={onClose}
          className="text-secondary hover:text-secondary  transition-colors text-xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
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
              className={`
                relative p-3 rounded-lg cursor-pointer transition-all duration-300 border
                ${
                  isSelected
                    ? 'border-[var(--text-color-variable)] bg-[var(--tertiary-color)] shadow-lg'
                    : 'border-tertiary hover:border-[var(--text-color-variable)] bg-tertiary hover:bg-[var(--tertiary-color)]'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-secondary  font-medium text-sm mb-2">
                    {themeData.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    {colors && (
                      <>
                        <div
                          className="w-4 h-4 rounded-full border border-gray-600"
                          style={{ backgroundColor: colors.primary }}
                          title="Primary Color"
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-gray-600"
                          style={{ backgroundColor: colors.accent }}
                          title="Accent Color"
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-gray-600"
                          style={{ backgroundColor: colors.secondary }}
                          title="Secondary Color"
                        />
                      </>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <div className="text-[var(--text-color-variable)] text-sm font-medium">
                    ✓ Active
                  </div>
                )}
              </div>

              {/* Theme preview gradient */}
              {colors && (
                <div
                  className="absolute top-0 right-0 w-1 h-full rounded-r-lg"
                  style={{
                    background: `linear-gradient(to bottom, ${colors.accent}, ${colors.primary})`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-tertiary">
        <p className="text-secondary text-xs text-center">
          Themes are automatically saved
        </p>
      </div>
    </div>
  );
};

export default ThemeSelector;
