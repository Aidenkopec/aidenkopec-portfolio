'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { styles } from '../styles';
import { navLinks } from '../constants';
// Direct paths for public folder assets - this is the correct Next.js approach
const logo = '/assets/logo.svg';
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
      } w-full flex items-center py-5 fixed top-0 z-50 ${
        scrolled ? 'bg-primary-color' : 'bg-transparent'
      }`}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => {
            setActive('');
            window.scrollTo(0, 0);
          }}
        >
          <Image
            src={logo}
            alt="logo"
            width={36}
            height={36}
            className="w-9 h-9 object-contain"
          />
          <p className="text-white text-[18px] font-bold cursor-pointer flex ">
            Aiden Kopec &nbsp;
            <span className="sm:block hidden"> | Full Stack Developer</span>
          </p>
        </Link>

        <div className="hidden sm:flex items-center gap-10">
          <ul className="list-none flex flex-row gap-10 items-center">
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={`${
                  active === nav.title ? 'text-white' : 'text-secondary'
                } hover:text-white text-[18px] font-medium cursor-pointer`}
                onClick={() => setActive(nav.title)}
              >
                <a href={`#${nav.id}`}>{nav.title}</a>
              </li>
            ))}
            <li className="flex items-center gap-4 relative">
              <button
                onClick={() =>
                  setCustomizationMenuDesktop(!customizationMenuDesktop)
                }
                className="text-secondary hover:text-white text-[18px] font-medium cursor-pointer transition-colors"
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

        <div className="sm:hidden flex flex-1 justify-end items-center gap-4">
          {/* Hamburger Menu Button - inline SVG to ensure visibility */}
          <button
            aria-label="Toggle menu"
            className="w-10 h-10 flex items-center justify-center rounded-md text-secondary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white z-[100]"
            onClick={() => setToggle(!toggle)}
          >
            {toggle ? (
              // Close icon (X)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              // Hamburger icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7"
              >
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>

          {/* Mobile Dropdown Menu - contains both nav links and music player */}
          <div
            className={`${
              !toggle ? 'hidden' : 'flex'
            } p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[200px] z-50 rounded-xl`}
          >
            <ul className="list-none flex justify-end items-start flex-1 flex-col gap-4">
              {/* Navigation Links */}
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-poppins font-medium cursor-pointer text-[16px] ${
                    active === nav.title ? 'text-white' : 'text-secondary'
                  }`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(nav.title);
                  }}
                >
                  <a href={`#${nav.id}`}>{nav.title}</a>
                </li>
              ))}

              {/* Customizations */}
              <li className="pt-2 relative">
                <button
                  className="text-secondary text-[16px] font-medium cursor-pointer hover:text-white transition-colors"
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
