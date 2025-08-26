'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { styles } from '../../styles';
import CustomizationMenu from '../CustomizationMenu';

const BlogNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [customizationMenuDesktop, setCustomizationMenuDesktop] =
    useState<boolean>(false);
  const [customizationMenuMobile, setCustomizationMenuMobile] =
    useState<boolean>(false);
  const [toggle, setToggle] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!toggle) {
      setCustomizationMenuMobile(false);
    }
  }, [toggle]);

  const blogNavLinks = [
    { id: 'home', title: 'Home', href: '/' },
    { id: 'contact', title: 'Contact', href: '/#contact' },
    { id: 'blog', title: 'Blog', href: '/blog' },
  ];

  return (
    <nav
      className={`fixed top-0 z-50 flex w-full items-center py-4 transition-all duration-500 ease-in-out ${
        scrolled
          ? 'bg-primary-color/90 border-b border-[var(--text-color-variable)]/20 shadow-2xl backdrop-blur-xl'
          : 'bg-transparent'
      } ${styles.paddingX}`}
    >
      {/* Animated gradient border on scroll */}
      {scrolled && (
        <div className='absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--text-color-variable)] to-transparent opacity-60' />
      )}

      <div className='relative mx-auto flex w-full max-w-7xl items-center justify-between'>
        {/* Enhanced Logo/Home Link */}
        <Link
          href='/'
          className='group relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-2 transition-all duration-300 hover:bg-[var(--text-color-variable)]/10'
        >
          {/* Animated background on hover */}
          <div className='absolute inset-0 bg-gradient-to-r from-[var(--text-color-variable)]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

          <div className='relative flex items-center gap-2'>
            {/* Logo animation dot */}
            <div className='h-2 w-2 animate-pulse rounded-full bg-[var(--text-color-variable)]' />
            <p className='text-secondary flex cursor-pointer text-[18px] font-bold transition-colors duration-300 group-hover:text-[var(--text-color-variable)]'>
              Aiden Kopec &nbsp;
              <span className='hidden opacity-80 transition-opacity duration-300 group-hover:opacity-100 sm:block'>
                {' '}
                | Full Stack Developer
              </span>
            </p>
          </div>
        </Link>

        {/* Enhanced Desktop Navigation */}
        <div className='hidden items-center gap-2 sm:flex'>
          <ul className='flex list-none flex-row items-center gap-1'>
            {blogNavLinks.map((nav) => (
              <li key={nav.id} className='group relative'>
                <Link
                  href={nav.href}
                  className='text-secondary relative block cursor-pointer overflow-hidden rounded-lg px-4 py-2 transition-all duration-300 hover:bg-[var(--text-color-variable)]/10 hover:text-[var(--text-color-variable)]'
                >
                  {/* Animated underline */}
                  <div className='absolute bottom-0 left-0 h-0.5 w-0 bg-[var(--text-color-variable)] transition-all duration-300 group-hover:w-full' />

                  {/* Shimmer effect on hover */}
                  <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full' />

                  <span className='relative text-[16px] font-medium'>
                    {nav.title}
                  </span>
                </Link>
              </li>
            ))}

            {/* Enhanced Customizations Button */}
            <li className='relative ml-4 flex items-center gap-4'>
              <button
                onClick={() =>
                  setCustomizationMenuDesktop(!customizationMenuDesktop)
                }
                className={`group relative overflow-hidden rounded-lg px-6 py-2 text-[16px] font-medium transition-all duration-300 ${
                  customizationMenuDesktop
                    ? 'bg-[var(--text-color-variable)]/20 text-[var(--text-color-variable)]'
                    : 'text-secondary hover:text-[var(--text-color-variable)]'
                }`}
              >
                {/* Glowing border effect */}
                <div
                  className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                    customizationMenuDesktop
                      ? 'bg-gradient-to-r from-[var(--text-color-variable)]/20 to-[var(--text-color-variable)]/10'
                      : 'bg-gradient-to-r from-transparent to-transparent group-hover:from-[var(--text-color-variable)]/10 group-hover:to-[var(--text-color-variable)]/5'
                  }`}
                />

                {/* Animated icon */}
                <div className='relative flex items-center gap-2'>
                  <span>Customizations</span>
                  <div
                    className={`h-1 w-1 rounded-full bg-[var(--text-color-variable)] transition-all duration-300 ${customizationMenuDesktop ? 'scale-150' : 'scale-100 group-hover:scale-125'}`}
                  />
                </div>
              </button>

              <CustomizationMenu
                isOpen={customizationMenuDesktop}
                onClose={() => setCustomizationMenuDesktop(false)}
              />
            </li>
          </ul>
        </div>

        {/* Enhanced Mobile Menu Button */}
        <div className='flex flex-1 items-center justify-end gap-4 sm:hidden'>
          <button
            aria-label='Toggle menu'
            className={`group relative z-[100] flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl transition-all duration-300 focus:ring-2 focus:ring-[var(--text-color-variable)] focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none ${
              toggle
                ? 'bg-[var(--text-color-variable)]/20 text-[var(--text-color-variable)]'
                : 'text-secondary hover:bg-[var(--text-color-variable)]/10 hover:text-[var(--text-color-variable)]'
            }`}
            onClick={() => setToggle(!toggle)}
          >
            {/* Animated background */}
            <div
              className={`absolute inset-0 bg-gradient-to-r from-[var(--text-color-variable)]/10 to-[var(--text-color-variable)]/5 transition-all duration-300 ${toggle ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            />

            {/* Pulsing border */}
            <div
              className={`absolute inset-0 rounded-xl border border-[var(--text-color-variable)]/30 transition-all duration-300 ${toggle ? 'scale-100 opacity-100' : 'scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`}
            />

            <div className='relative'>
              {toggle ? (
                // Enhanced Close icon with rotation animation
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='h-6 w-6 rotate-90 transform transition-transform duration-300'
                >
                  <line x1='18' y1='6' x2='6' y2='18'></line>
                  <line x1='6' y1='6' x2='18' y2='18'></line>
                </svg>
              ) : (
                // Enhanced Hamburger with animated lines
                <div className='flex flex-col gap-1'>
                  <div className='h-0.5 w-5 rounded-full bg-current transition-all duration-300 group-hover:w-6' />
                  <div className='h-0.5 w-4 rounded-full bg-current transition-all duration-300 group-hover:w-6' />
                  <div className='h-0.5 w-5 rounded-full bg-current transition-all duration-300 group-hover:w-6' />
                </div>
              )}
            </div>
          </button>

          {/* Enhanced Mobile Dropdown Menu */}
          <div
            className={`${
              !toggle
                ? 'hidden scale-95 opacity-0'
                : 'flex scale-100 opacity-100'
            } black-gradient absolute top-20 right-0 z-50 mx-4 my-2 min-w-[240px] rounded-2xl border border-[var(--text-color-variable)]/20 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated gradient background */}
            <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--text-color-variable)]/5 to-transparent' />

            {/* Glowing border effect */}
            <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--text-color-variable)]/20 via-transparent to-[var(--text-color-variable)]/20 opacity-50' />

            <ul className='relative z-10 flex flex-1 list-none flex-col items-start justify-end gap-2'>
              {/* Enhanced Navigation Links */}
              {blogNavLinks.map((nav, index) => (
                <li
                  key={nav.id}
                  className='group w-full'
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Link
                    href={nav.href}
                    className='text-secondary relative block w-full cursor-pointer overflow-hidden rounded-lg px-4 py-3 transition-all duration-300 hover:bg-[var(--text-color-variable)]/10 hover:text-[var(--text-color-variable)]'
                    onClick={() => setToggle(false)}
                  >
                    {/* Slide-in animation background */}
                    <div className='absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-[var(--text-color-variable)]/10 to-transparent transition-transform duration-300 group-hover:translate-x-0' />

                    <span className='relative ml-0 text-[16px] font-medium transition-all duration-300 group-hover:ml-2'>
                      {nav.title}
                    </span>
                  </Link>
                </li>
              ))}

              {/* Enhanced Customizations Button */}
              <li className='relative mt-2 w-full border-t border-[var(--text-color-variable)]/20 pt-4'>
                <button
                  className={`group relative w-full overflow-hidden rounded-lg px-4 py-3 text-[16px] font-medium transition-all duration-300 ${
                    customizationMenuMobile
                      ? 'bg-[var(--text-color-variable)]/20 text-[var(--text-color-variable)]'
                      : 'text-secondary hover:bg-[var(--text-color-variable)]/10 hover:text-[var(--text-color-variable)]'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (!customizationMenuMobile) {
                      // Opening customization menu
                      setToggle(false); // Close mobile dropdown first
                      // Longer delay to ensure proper state transitions
                      setTimeout(() => {
                        setCustomizationMenuMobile(true);
                      }, 300);
                    } else {
                      // Closing customization menu
                      setCustomizationMenuMobile(false);
                    }
                  }}
                >
                  {/* Glowing effect */}
                  <div
                    className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                      customizationMenuMobile
                        ? 'bg-gradient-to-r from-[var(--text-color-variable)]/20 to-[var(--text-color-variable)]/10'
                        : 'bg-gradient-to-r from-transparent to-transparent group-hover:from-[var(--text-color-variable)]/10 group-hover:to-[var(--text-color-variable)]/5'
                    }`}
                  />

                  <div className='relative flex items-center gap-3'>
                    <div
                      className={`h-2 w-2 rounded-full bg-[var(--text-color-variable)] transition-all duration-300 ${customizationMenuMobile ? 'scale-125 animate-pulse' : 'scale-100 group-hover:scale-110'}`}
                    />
                    <span>Customizations</span>
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile CustomizationMenu - Render outside dropdown for proper modal display */}
      <CustomizationMenu
        isOpen={customizationMenuMobile}
        onClose={() => setCustomizationMenuMobile(false)}
        isMobile={true}
      />
    </nav>
  );
};

export default BlogNavbar;
