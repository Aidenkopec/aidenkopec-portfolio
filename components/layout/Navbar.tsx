'use client';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

import { navLinks } from '@/constants';
import { HEAD } from '@/components/chart/FlightPath';
import { useDismiss } from '@/hooks/useDismiss';

import CustomizationMenu from './CustomizationMenu';

/**
 * Tracks the reader along the homepage route. Returns the index of the last
 * section whose flight path stop has crossed the head line, or -1 above the
 * first. Writes --route-at on `strip` every frame, so the probe moves without
 * a React render.
 */
function useRouteProgress(strip: React.RefObject<HTMLElement | null>) {
  const [reached, setReached] = useState(-1);

  useEffect(() => {
    // Each section's first waypoint is its title's stop on the flight path.
    const stops = navLinks.map((nav) => {
      const section = document.getElementById(nav.id);
      return section?.querySelector<HTMLElement>('[data-waypoint]') ?? section;
    });
    let frame = 0;

    const draw = () => {
      frame = 0;
      const head = window.innerHeight * HEAD;
      const ys = stops.map((stop) => {
        if (!stop) return Infinity;
        const rect = stop.getBoundingClientRect();
        return rect.top + rect.height / 2;
      });

      let index = -1;
      while (index + 1 < ys.length && ys[index + 1]! <= head) index++;

      const from = ys[index];
      const to = ys[index + 1];
      const fraction =
        from === undefined || to === undefined || to === Infinity
          ? 0
          : Math.min(1, (head - from) / (to - from));

      strip.current?.style.setProperty(
        '--route-at',
        String(Math.max(0, index + fraction)),
      );
      setReached(index);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, [strip]);

  return reached;
}

// A four point star, the glyph for the customization menu.
const StarGlyph: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    aria-hidden='true'
    viewBox='0 0 24 24'
    fill='currentColor'
    className={className}
  >
    <path d='M12 2l1.9 8.1L22 12l-8.1 1.9L12 22l-1.9-8.1L2 12l8.1-1.9z' />
  </svg>
);

const Navbar: React.FC = () => {
  const [toggle, setToggle] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [customizationMenuDesktop, setCustomizationMenuDesktop] =
    useState<boolean>(false);
  const [customizationMenuMobile, setCustomizationMenuMobile] =
    useState<boolean>(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const reached = useRouteProgress(stripRef);

  useEffect(() => {
    const handleScroll = () => {
      // Functional update so React only commits on the transition, not on every
      // scroll frame.
      setScrolled(window.scrollY > 100);
    };

    // Passive: without it the browser must wait on this handler in case it
    // calls preventDefault, which it never does.
    window.addEventListener('scroll', handleScroll, { passive: true });
    // A reload restores the scroll position without firing a scroll event.
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Closing the mobile dropdown takes the customization menu with it. The
  // Customizations button below closes the dropdown on its own while keeping
  // the menu open, so it calls setToggle directly instead.
  const setMobileMenuOpen = (open: boolean) => {
    setToggle(open);
    if (!open) {
      setCustomizationMenuMobile(false);
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  useDismiss(toggle, mobileMenuRef, closeMobileMenu);

  return (
    <nav
      aria-label='Primary'
      className={`site-nav fixed top-0 z-50 flex w-full items-center py-3 padding-x transition-all duration-500 ease-in-out ${
        scrolled ? 'bg-primary/75 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      {/* Gradient border on scroll. On the homepage the swarm draws it in
          dust first; globals.css holds it back until the dust arrives. */}
      <div
        data-swarm-slot='navline'
        className={`nav-line absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--text-color-variable)] to-transparent ${
          scrolled ? 'opacity-60' : 'opacity-0'
        }`}
      />

      <div className='relative mx-auto flex w-full max-w-7xl items-center justify-between'>
        <Link
          href='/'
          className='navbar-logo group flex items-baseline gap-4 transition-opacity duration-500'
          onClick={() => window.scrollTo(0, 0)}
        >
          <span className='font-display text-[26px] leading-none text-white-100 italic transition-colors duration-300 group-hover:text-[var(--text-color-variable)]'>
            Aiden Kopec
          </span>
          <span className='nav-label hidden lg:inline'>
            Full-Stack Developer
          </span>
        </Link>

        <div className='hidden items-center gap-8 md:flex'>
          <div
            ref={stripRef}
            data-flying={reached >= 0 ? '' : undefined}
            className='nav-route relative'
            style={{ '--stops': navLinks.length } as React.CSSProperties}
          >
            <span aria-hidden='true' className='nav-route-course' />
            <span aria-hidden='true' className='nav-route-flown' />
            <ol className='nav-route-grid relative list-none'>
              {navLinks.map((nav, index) => (
                <li key={nav.id}>
                  <a
                    href={`#${nav.id}`}
                    aria-current={index === reached ? 'location' : undefined}
                    data-reached={index <= reached ? '' : undefined}
                    className='nav-stop'
                  >
                    <span className='nav-label'>{nav.title}</span>
                    <span className='nav-stop-ring-row'>
                      <span aria-hidden='true' className='nav-stop-ring' />
                    </span>
                  </a>
                </li>
              ))}
            </ol>
            {/* After the rings, so it passes over them. */}
            <span aria-hidden='true' className='nav-route-probe' />
          </div>

          <Link href='/blog' className='nav-stop'>
            <span className='nav-label'>Blog</span>
            <span className='nav-stop-ring-row'>
              <span aria-hidden='true' className='nav-stop-dash' />
            </span>
          </Link>

          <div className='relative'>
            <button
              type='button'
              onClick={() =>
                setCustomizationMenuDesktop(!customizationMenuDesktop)
              }
              aria-expanded={customizationMenuDesktop}
              aria-label='Customizations'
              title='Customizations'
              className={`group flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300 ${
                customizationMenuDesktop
                  ? 'border-[var(--text-color-variable)] text-[var(--text-color-variable)]'
                  : 'border-[var(--chart-line)] text-white-100/70 hover:border-[var(--text-color-variable)] hover:text-[var(--text-color-variable)]'
              }`}
            >
              <StarGlyph
                className={`h-4 w-4 transition-transform duration-500 ${
                  customizationMenuDesktop
                    ? 'rotate-45'
                    : 'group-hover:rotate-45'
                }`}
              />
            </button>

            <CustomizationMenu
              isOpen={customizationMenuDesktop}
              onClose={() => setCustomizationMenuDesktop(false)}
            />
          </div>
        </div>

        <div
          ref={mobileMenuRef}
          className='flex flex-1 items-center justify-end md:hidden'
        >
          <button
            type='button'
            aria-label='Toggle menu'
            aria-expanded={toggle}
            aria-controls='mobile-menu'
            className={`relative z-[100] flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-color-variable)] ${
              toggle
                ? 'border-[var(--text-color-variable)] text-[var(--text-color-variable)]'
                : 'border-[var(--chart-line)] text-white-100/80'
            }`}
            onClick={() => setMobileMenuOpen(!toggle)}
          >
            {/* Two strokes that cross into a close mark. */}
            <span aria-hidden='true' className='relative block h-3 w-4'>
              <span
                className={`absolute left-0 h-px w-4 bg-current transition-transform duration-300 ${
                  toggle ? 'top-1.5 rotate-45' : 'top-0.5'
                }`}
              />
              <span
                className={`absolute left-0 h-px w-4 bg-current transition-transform duration-300 ${
                  toggle ? 'top-1.5 -rotate-45' : 'top-2.5'
                }`}
              />
            </span>
          </button>

          {/* The handler only stops a click inside the panel from reaching the
              document listener that closes the menu. Not an affordance. */}
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
          <div
            id='mobile-menu'
            className={`${
              toggle ? 'flex' : 'hidden'
            } absolute top-14 right-0 z-50 min-w-[260px] flex-col rounded-2xl border border-[var(--chart-line)] bg-primary/95 p-6 shadow-2xl backdrop-blur-xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <ol className='nav-route-vertical list-none'>
              {navLinks.map((nav, index) => (
                <li key={nav.id}>
                  <a
                    href={`#${nav.id}`}
                    aria-current={index === reached ? 'location' : undefined}
                    data-reached={index <= reached ? '' : undefined}
                    className='group flex items-center gap-5 py-3'
                    onClick={closeMobileMenu}
                  >
                    <span aria-hidden='true' className='nav-stop-ring' />
                    <span className='font-display text-[26px] leading-none text-white-100/75 italic transition-colors group-hover:text-white-100 group-aria-[current=location]:text-white-100'>
                      {nav.title}
                    </span>
                  </a>
                </li>
              ))}
            </ol>

            <div className='mt-4 flex flex-col border-t border-[var(--chart-line)] pt-3'>
              <Link
                href='/blog'
                className='nav-label flex min-h-11 items-center hover:text-white-100'
                onClick={closeMobileMenu}
              >
                Blog
              </Link>
              <button
                type='button'
                aria-expanded={customizationMenuMobile}
                className={`nav-label flex min-h-11 items-center gap-3 text-left hover:text-white-100 ${
                  customizationMenuMobile
                    ? 'text-[var(--text-color-variable)]'
                    : ''
                }`}
                onClick={() => {
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
                <StarGlyph className='h-3.5 w-3.5' />
                Customizations
              </button>
            </div>
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

export default Navbar;
