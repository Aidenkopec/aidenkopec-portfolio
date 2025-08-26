'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { navLinks } from '../constants';
import { styles } from '../styles';

// Direct paths for public folder assets - this is the correct Next.js approach
import CustomizationMenu from './CustomizationMenu';

const Navbar: React.FC = () => {
  const [active, setActive] = useState<string>('');
  const [toggle, setToggle] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [customizationMenuDesktop, setCustomizationMenuDesktop] =
    useState<boolean>(false);
  const [customizationMenuMobile, setCustomizationMenuMobile] =
    useState<boolean>(false);

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

  return (
    <nav
      className={`${
        styles.paddingX
      } fixed top-0 z-50 flex w-full items-center py-5 ${
        scrolled ? 'bg-primary-color' : 'bg-transparent'
      }`}
    >
      <div className='mx-auto flex w-full max-w-7xl items-center justify-between'>
        <Link
          href='/'
          className='flex items-center gap-2'
          onClick={() => {
            setActive('');
            window.scrollTo(0, 0);
          }}
        >
          <p className='text-secondary flex cursor-pointer text-[18px] font-bold'>
            Aiden Kopec &nbsp;
            <span className='hidden sm:block'> | Full Stack Developer</span>
          </p>
        </Link>

        <div className='hidden items-center gap-10 sm:flex'>
          <ul className='flex list-none flex-row items-center gap-10'>
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={`${
                  active === nav.title ? 'text-secondary' : 'text-secondary'
                } hover:text-secondary cursor-pointer text-[18px] font-medium`}
                onClick={() => setActive(nav.title)}
              >
                {nav.id === 'blog' ? (
                  <Link href='/blog'>{nav.title}</Link>
                ) : (
                  <a href={`#${nav.id}`}>{nav.title}</a>
                )}
              </li>
            ))}
            <li className='relative flex items-center gap-4'>
              <button
                onClick={() =>
                  setCustomizationMenuDesktop(!customizationMenuDesktop)
                }
                className='text-secondary hover:text-secondary cursor-pointer text-[18px] font-medium transition-colors'
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

        <div className='flex flex-1 items-center justify-end gap-4 sm:hidden'>
          {/* Hamburger Menu Button - inline SVG to ensure visibility */}
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

          {/* Mobile Dropdown Menu - contains both nav links and music player */}
          <div
            className={`${
              !toggle ? 'hidden' : 'flex'
            } black-gradient absolute top-20 right-0 z-50 mx-4 my-2 min-w-[200px] rounded-xl p-6`}
          >
            <ul className='flex flex-1 list-none flex-col items-start justify-end gap-4'>
              {/* Navigation Links */}
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-poppins cursor-pointer text-[16px] font-medium ${
                    active === nav.title ? 'text-secondary' : 'text-secondary'
                  }`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(nav.title);
                  }}
                >
                  {nav.id === 'blog' ? (
                    <Link href='/blog'>{nav.title}</Link>
                  ) : (
                    <a href={`#${nav.id}`}>{nav.title}</a>
                  )}
                </li>
              ))}

              {/* Customizations */}
              <li className='relative pt-2'>
                <button
                  className='text-secondary hover:text-secondary cursor-pointer text-[16px] font-medium transition-colors'
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

export default Navbar;
