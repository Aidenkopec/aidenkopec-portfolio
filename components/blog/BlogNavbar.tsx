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
    { id: 'blog', title: 'Blog', href: '/blog' },
    { id: 'projects', title: 'Projects', href: '/#projects' },
    { id: 'contact', title: 'Contact', href: '/#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 z-50 flex w-full items-center py-5 transition-all duration-300 ${
        scrolled
          ? 'bg-primary-color/95 shadow-lg backdrop-blur-sm'
          : 'bg-transparent'
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-7xl items-center justify-between ${styles.paddingX}`}
      >
        {/* Logo/Home Link */}
        <Link href='/' className='group flex items-center gap-2'>
          <p className='text-secondary flex cursor-pointer text-[18px] font-bold transition-colors group-hover:text-[var(--text-color-variable)]'>
            Aiden Kopec &nbsp;
            <span className='hidden sm:block'> | Full Stack Developer</span>
          </p>
        </Link>

        {/* Desktop Navigation */}
        <div className='hidden items-center gap-10 sm:flex'>
          <ul className='flex list-none flex-row items-center gap-10'>
            {blogNavLinks.map((nav) => (
              <li key={nav.id}>
                <Link
                  href={nav.href}
                  className='text-secondary hover:text-secondary cursor-pointer text-[18px] font-medium transition-colors duration-200'
                >
                  {nav.title}
                </Link>
              </li>
            ))}

            {/* Customizations */}
            <li className='relative flex items-center gap-4'>
              <button
                onClick={() =>
                  setCustomizationMenuDesktop(!customizationMenuDesktop)
                }
                className='text-secondary hover:text-secondary cursor-pointer text-[18px] font-medium transition-colors duration-200'
              >
                Customizations
              </button>
              <CustomizationMenu
                isOpen={customizationMenuDesktop}
                onClose={() => setCustomizationMenuDesktop(false)}
              />
            </li>
          </ul>
        </div>

        {/* Mobile Menu Button */}
        <div className='flex flex-1 items-center justify-end gap-4 sm:hidden'>
          <button
            aria-label='Toggle menu'
            className='text-secondary hover:text-secondary z-[100] flex h-10 w-10 items-center justify-center rounded-md focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none'
            onClick={() => setToggle(!toggle)}
          >
            {toggle ? (
              // Close icon (X)
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='h-7 w-7'
              >
                <line x1='18' y1='6' x2='6' y2='18'></line>
                <line x1='6' y1='6' x2='18' y2='18'></line>
              </svg>
            ) : (
              // Hamburger icon
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='h-7 w-7'
              >
                <line x1='3' y1='6' x2='21' y2='6'></line>
                <line x1='3' y1='12' x2='21' y2='12'></line>
                <line x1='3' y1='18' x2='21' y2='18'></line>
              </svg>
            )}
          </button>

          {/* Mobile Dropdown Menu */}
          <div
            className={`${
              !toggle ? 'hidden' : 'flex'
            } black-gradient absolute top-20 right-0 z-50 mx-4 my-2 min-w-[200px] rounded-xl p-6`}
          >
            <ul className='flex flex-1 list-none flex-col items-start justify-end gap-4'>
              {/* Navigation Links */}
              {blogNavLinks.map((nav) => (
                <li key={nav.id}>
                  <Link
                    href={nav.href}
                    className='font-poppins text-secondary hover:text-secondary cursor-pointer text-[16px] font-medium transition-colors duration-200'
                    onClick={() => setToggle(false)}
                  >
                    {nav.title}
                  </Link>
                </li>
              ))}

              {/* Customizations */}
              <li className='relative pt-2'>
                <button
                  className='text-secondary hover:text-secondary cursor-pointer text-[16px] font-medium transition-colors duration-200'
                  onClick={() =>
                    setCustomizationMenuMobile(!customizationMenuMobile)
                  }
                >
                  Customizations
                </button>
                <CustomizationMenu
                  isOpen={customizationMenuMobile}
                  onClose={() => setCustomizationMenuMobile(false)}
                  isMobile={true}
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BlogNavbar;
