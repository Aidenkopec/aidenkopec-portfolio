'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Globe, Lock, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { type Project, type ProjectLink, type ProjectTier } from '@/constants';
import { useCanRender3D } from '@/hooks/useCanRender3D';
import { useInViewport } from '@/hooks/useInViewport';
import { useIsSmallViewport } from '@/hooks/useIsSmallViewport';
import SectionHeader from '@/components/chart/SectionHeader';
import github from '@/public/assets/github.png';

// Loaded on demand so three.js stays out of the initial bundle and the WebGL
// context is only created once the section is actually approaching the viewport.
const ProjectRingCanvas = dynamic(() => import('./canvas/ProjectRing'), {
  ssr: false,
});

const TIER_LABEL: Record<ProjectTier, string> = {
  featured: 'Featured',
  personal: 'Built for myself',
  client: 'Client work',
};

// Duplicated from components/canvas/ProjectRing.tsx rather than imported,
// because importing from that module here would pull three.js back into the
// initial bundle and defeat the dynamic import above.
const shortestDelta = (delta: number, count: number): number => {
  const half = count / 2;
  return ((((delta + half) % count) + count) % count) - half;
};

const StackChips: React.FC<{ stack: string[]; className?: string }> = ({
  stack,
  className = '',
}) => (
  <ul className={`flex flex-wrap gap-2 ${className}`}>
    {stack.map((item) => (
      <li
        key={item}
        className='rounded-full border border-[var(--black-100)] bg-[var(--black-100)]/60 px-2.5 py-1 text-[11px] text-[var(--secondary-color)]'
      >
        {item}
      </li>
    ))}
  </ul>
);

const ProjectLinkButton: React.FC<{ link: ProjectLink; primary?: boolean }> = ({
  link,
  primary = false,
}) => (
  <a
    href={link.href}
    target='_blank'
    rel='noreferrer noopener'
    className={`group/link inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[var(--text-color-variable)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary-color)] focus-visible:outline-none ${
      primary
        ? 'border-[var(--text-color-variable)]/60 bg-[var(--text-color-variable)]/10 text-[var(--text-color-variable)] hover:bg-[var(--text-color-variable)]/20'
        : 'border-[var(--black-100)] bg-gradient-to-r from-[var(--tertiary-color)] to-[var(--black-100)] text-[var(--secondary-color)] hover:border-[var(--text-color-variable)] hover:text-[var(--text-color-variable)]'
    }`}
  >
    {link.kind === 'source' ? (
      <Image src={github} alt='' aria-hidden='true' width={16} height={16} />
    ) : (
      <Globe className='h-4 w-4' aria-hidden='true' />
    )}
    {link.label}
    <span
      aria-hidden='true'
      className='transition-transform duration-300 group-hover/link:translate-x-1'
    >
      ↗
    </span>
  </a>
);

// Set like a label on a star chart rather than a pill.
const TierBadge: React.FC<{ tier: ProjectTier }> = ({ tier }) => (
  <span className='w-fit font-display text-[17px] text-[var(--text-color-variable)] italic'>
    {TIER_LABEL[tier]}
  </span>
);

const SourcePrivateNote: React.FC = () => (
  <span className='inline-flex items-center gap-1.5 text-xs text-[var(--secondary-color)]/70'>
    <Lock className='h-3.5 w-3.5' aria-hidden='true' />
    Source private
  </span>
);

// Locks the page behind the sheet. `overflow: hidden` on <body> alone is not
// enough on iOS Safari, so the scroll position is pinned with `position: fixed`
// and restored on close. Padding compensates for the desktop scrollbar so the
// page underneath does not shift when it disappears.
function useScrollLock(): void {
  useEffect(() => {
    const { body } = document;
    const scrollY = window.scrollY;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const previous = body.style.cssText;

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    return () => {
      body.style.cssText = previous;
      // `behavior: instant` overrides the global `scroll-behavior: smooth`,
      // which would otherwise animate the page back on close.
      window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' });
    };
  }, []);
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

// Every long-form detail the ring deliberately hides lives here.
//
// Rendered through a portal on <body> deliberately: the section this lives in
// is a `relative z-0` stacking context, so an in-place `z-[10000]` would still
// paint below the fixed navbar (z-50) and the music bar (z-9999) and leave the
// close button untappable.
const ProjectDetail: React.FC<{
  project: Project;
  onClose: () => void;
}> = ({ project, onClose }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useScrollLock();

  // Take focus once and hand it back on close. Deliberately keyed on [], because
  // `onClose` is a fresh closure on every parent render and any re-run of this
  // effect would yank focus back to the close button mid-read.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    return () => {
      if (opener?.isConnected) opener.focus();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  // Nothing behind the sheet is inert, so `aria-modal` alone does not stop Tab
  // walking into the page underneath. Wrap it by hand.
  const trapFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(FOCUSABLE),
    );
    if (focusable.length === 0) return;

    // The length check above guarantees both ends exist.
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    const current = document.activeElement;

    if (event.shiftKey && (current === first || !dialog.contains(current))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && current === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 z-[10000] flex justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-4'
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-label={`${project.name} details`}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.25 }}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={trapFocus}
        className='relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[var(--tertiary-color)] sm:h-auto sm:max-h-[88vh] sm:max-w-3xl sm:rounded-2xl sm:border sm:border-[var(--black-100)]'
      >
        {/* Its own row rather than an overlay on the screenshot, so nothing can
            ever paint over the only way out. */}
        <header className='flex shrink-0 items-start justify-between gap-3 border-b border-[var(--black-100)] px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-4 sm:px-7 sm:pt-5'>
          <div className='min-w-0'>
            <TierBadge tier={project.tier} />
            <h3 className='mt-2 truncate text-[20px] font-bold text-[var(--white-100)] sm:text-[24px]'>
              {project.name}
            </h3>
          </div>

          <button
            ref={closeRef}
            type='button'
            onClick={onClose}
            aria-label='Close project details'
            className='-mr-1 shrink-0 rounded-lg border border-[var(--black-100)] bg-[var(--black-100)]/70 p-3 text-[var(--secondary-color)] transition-colors hover:text-[var(--text-color-variable)] focus-visible:ring-2 focus-visible:ring-[var(--text-color-variable)] focus-visible:outline-none'
          >
            <X className='h-4 w-4' />
          </button>
        </header>

        <div className='flex-1 overflow-y-auto overscroll-contain px-5 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-7 sm:pb-7'>
          <div className='relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-[var(--black-100)]'>
            <Image
              src={project.image}
              alt={`${project.name} screenshot`}
              fill
              sizes='(max-width: 768px) 100vw, 768px'
              placeholder='blur'
              className='object-cover object-top'
            />
          </div>

          {project.tagline && (
            <p className='mt-5 text-[15px] leading-[24px] text-[var(--text-color-variable)]/90'>
              {project.tagline}
            </p>
          )}

          <p className='mt-3 text-[15px] leading-[26px] text-secondary'>
            {project.description}
          </p>

          {project.tier === 'client' && (
            <p className='mt-3 text-[13px] leading-[21px] text-secondary/70'>
              Built and delivered through Solvex Digital, the agency I founded.
              The site is live. The source stays private.
            </p>
          )}

          {project.metrics && (
            <dl className='mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-y border-[var(--black-100)] py-5 lg:grid-cols-4'>
              {project.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt className='sr-only'>{metric.label}</dt>
                  <dd>
                    <span className='block text-[22px] leading-none font-bold text-[var(--text-color-variable)]'>
                      {metric.value}
                    </span>
                    <span className='mt-1.5 block text-[11px] leading-[15px] tracking-wide text-secondary uppercase'>
                      {metric.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <StackChips stack={project.stack} className='mt-6' />

          <div className='mt-6 flex flex-wrap items-center gap-3'>
            {project.links.map((link, i) => (
              <ProjectLinkButton
                key={link.href}
                link={link}
                primary={i === 0}
              />
            ))}
            {project.sourcePrivate && <SourcePrivateNote />}
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
};

// Phones, reduced motion, and anything without WebGL get this instead.
const ProjectStrip: React.FC<{
  projects: Project[];
  onOpenDetail: (index: number) => void;
}> = ({ projects, onOpenDetail }) => (
  <div className='-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-6 pb-4 max-sm:-ml-12 max-sm:pl-12 sm:-mx-16 sm:px-16'>
    {projects.map((project, index) => (
      <article
        key={project.slug}
        className='flex w-[85%] shrink-0 snap-center flex-col overflow-hidden rounded-xl border border-[var(--chart-faint)] bg-[var(--primary-color)]/60 backdrop-blur-md sm:w-[60%]'
      >
        <div className='relative aspect-[16/10] w-full border-b border-[var(--chart-faint)]'>
          <Image
            src={project.image}
            alt={`${project.name} screenshot`}
            fill
            sizes='(max-width: 640px) 85vw, 60vw'
            placeholder='blur'
            className='object-cover object-top'
          />
        </div>

        <div className='flex flex-1 flex-col p-5'>
          <TierBadge tier={project.tier} />
          <h3 className='mt-1 font-display text-[26px] leading-tight text-[var(--white-100)] italic'>
            {project.name}
          </h3>
          <p className='mt-2 text-[14px] leading-[23px] text-secondary'>
            {project.blurb}
          </p>
          <StackChips stack={project.stack} className='mt-4' />

          <div className='mt-5 flex flex-wrap items-center gap-3'>
            {project.links.map((link, i) => (
              <ProjectLinkButton
                key={link.href}
                link={link}
                primary={i === 0}
              />
            ))}
            <button
              type='button'
              onClick={() => onOpenDetail(index)}
              className='inline-flex min-h-11 items-center rounded-lg px-3 text-[13px] text-[var(--text-color-variable)] underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-[var(--text-color-variable)] focus-visible:outline-none'
            >
              Details
            </button>
          </div>
        </div>
      </article>
    ))}
  </div>
);

const DRAG_PX_PER_SLOT = 260;
const DRAG_THRESHOLD_PX = 6;

const ProjectsShowcase: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const count = projects.length;

  const [cursor, setCursor] = useState(0);
  const cursorRef = useRef(0);
  const dragOffset = useRef(0);

  const [detailIndex, setDetailIndex] = useState<number | null>(null);

  // Both false on the server and the first client paint, so the strip is what
  // gets prerendered. See the comment on the render branch below.
  const canRender3D = useCanRender3D();
  const isSmallViewport = useIsSmallViewport();
  // The ring is driven by dragging, which is a poor fit for a phone, so the
  // strip stays the small viewport path even where WebGL is available.
  const showRing = canRender3D && !isSmallViewport;
  const mode = showRing ? 'ring' : 'strip';
  const {
    ref: stageRef,
    mounted: canvasMounted,
    paused,
  } = useInViewport<HTMLDivElement>(showRing);

  const drag = useRef<{
    pointerId: number;
    startX: number;
    lastX: number;
    lastTime: number;
    velocity: number;
    captured: boolean;
  } | null>(null);

  const activeIndex = ((cursor % count) + count) % count;
  // activeIndex is cursor wrapped into [0, count), so it always indexes a
  // project. `projects` comes from constants and is never empty.
  const active = projects[activeIndex]!;

  const setCursorTo = useCallback((next: number) => {
    cursorRef.current = next;
    setCursor(next);
  }, []);

  const step = useCallback(
    (delta: number) => setCursorTo(cursorRef.current + delta),
    [setCursorTo],
  );

  const goTo = useCallback(
    (index: number) => {
      const current = ((cursorRef.current % count) + count) % count;
      setCursorTo(cursorRef.current + shortestDelta(index - current, count));
    },
    [count, setCursorTo],
  );

  // Settling is driven off `drag.current` alone rather than an event, so a lost
  // or never-delivered pointerup can recover through the same path.
  const settleDrag = useCallback(() => {
    const state = drag.current;
    if (!state) return;
    drag.current = null;

    if (!state.captured) {
      dragOffset.current = 0;
      return;
    }

    // Keep the total continuous across the handoff: the scene lerps from where
    // the drag left it to the settled slot, so there is no snap back.
    const total = cursorRef.current + dragOffset.current;
    const flick = (-state.velocity * 1000) / DRAG_PX_PER_SLOT;
    dragOffset.current = 0;
    setCursorTo(Math.round(total + Math.max(-1, Math.min(1, flick * 0.25))));
  }, [setCursorTo]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
      captured: false,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || event.pointerId !== state.pointerId) return;

    // A press released off the stage never delivers pointerup here. Without this
    // the next button-less hover would pick the stale drag back up.
    if (event.buttons === 0) {
      settleDrag();
      return;
    }

    const dx = event.clientX - state.startX;

    // Capture only once this is unambiguously a drag, so a plain tap still
    // reaches the panels inside the canvas as a click.
    if (!state.captured) {
      if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
      event.currentTarget.setPointerCapture(state.pointerId);
      state.captured = true;
    }

    const dt = event.timeStamp - state.lastTime;
    if (dt > 0) {
      state.velocity = (event.clientX - state.lastX) / dt;
      state.lastX = event.clientX;
      state.lastTime = event.timeStamp;
    }

    dragOffset.current = -dx / DRAG_PX_PER_SLOT;
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || event.pointerId !== state.pointerId) return;

    const { pointerId, captured } = state;
    settleDrag();

    if (captured && event.currentTarget.hasPointerCapture(pointerId)) {
      event.currentTarget.releasePointerCapture(pointerId);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      step(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      step(1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setDetailIndex(activeIndex);
    }
  };

  return (
    <>
      <SectionHeader
        title='Projects'
        intro='Client work, products I run, and a few experiments.'
      />

      {/* Both gates read false until after hydration, so the server HTML and
          the first client paint are the strip. It is the path that works
          without JS, without WebGL, under reduced motion, and on a phone. */}
      {mode !== 'ring' ? (
        <div className='mt-10'>
          <ProjectStrip projects={projects} onOpenDetail={setDetailIndex} />
        </div>
      ) : (
        <>
          <div
            ref={stageRef}
            role='group'
            tabIndex={0}
            aria-label='Project showcase. Use the left and right arrow keys to browse.'
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onLostPointerCapture={settleDrag}
            onKeyDown={onKeyDown}
            style={{ touchAction: 'pan-y' }}
            className='project-stage relative mt-8 h-[clamp(280px,calc(100svh-500px),560px)] w-full cursor-grab rounded-2xl select-none focus-visible:ring-2 focus-visible:ring-[var(--text-color-variable)] focus-visible:outline-none active:cursor-grabbing'
          >
            {/* Side panels dissolve into the dust instead of meeting an edge. */}
            <div className='absolute inset-0 [mask-image:linear-gradient(to_right,transparent,#000_14%,#000_86%,transparent)]'>
              {canvasMounted && (
                <ProjectRingCanvas
                  projects={projects}
                  cursorRef={cursorRef}
                  dragOffset={dragOffset}
                  paused={paused}
                  onSelect={goTo}
                  onOpenDetail={(index) => {
                    goTo(index);
                    setDetailIndex(index);
                  }}
                />
              )}
            </div>

            <button
              type='button'
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => step(-1)}
              aria-label='Previous project'
              className='stage-arrow left-2 sm:left-4'
            >
              <ChevronLeft className='h-5 w-5' />
            </button>
            <button
              type='button'
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => step(1)}
              aria-label='Next project'
              className='stage-arrow right-2 sm:right-4'
            >
              <ChevronRight className='h-5 w-5' />
            </button>
          </div>

          <div className='relative z-10 mx-auto -mt-16 w-full max-w-3xl rounded-2xl border border-[var(--chart-faint)] bg-[var(--primary-color)]/70 px-6 py-4 text-center backdrop-blur-md sm:px-10 sm:py-5'>
            <div className='flex items-center justify-center gap-2'>
              {projects.map((project, index) => (
                <button
                  key={project.slug}
                  type='button'
                  onClick={() => goTo(index)}
                  aria-label={`Show ${project.name}`}
                  aria-current={index === activeIndex}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-6 bg-[var(--text-color-variable)]'
                      : 'w-1.5 bg-[var(--secondary-color)]/30 hover:bg-[var(--secondary-color)]/60'
                  }`}
                />
              ))}
            </div>

            {/* Keyed on the project, so the text changes in step with the
                ring rather than snapping mid turn. */}
            <AnimatePresence mode='wait' initial={false}>
              <motion.div
                key={active.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className='mt-3 flex flex-col items-center'
              >
                <TierBadge tier={active.tier} />
                <h3 className='mt-1 font-display text-[32px] leading-tight text-[var(--white-100)] italic sm:text-[40px]'>
                  {active.name}
                </h3>
                <p className='mt-1 max-w-xl text-[15px] leading-[24px] text-secondary'>
                  {active.blurb}
                </p>

                <StackChips
                  stack={active.stack}
                  className='mt-3 justify-center'
                />

                <div className='mt-4 flex flex-wrap items-center justify-center gap-3'>
                  {active.links.map((link, i) => (
                    <ProjectLinkButton
                      key={link.href}
                      link={link}
                      primary={i === 0}
                    />
                  ))}
                  <button
                    type='button'
                    onClick={() => setDetailIndex(activeIndex)}
                    className='inline-flex min-h-11 items-center rounded-lg px-3 text-[13px] text-[var(--text-color-variable)] underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-[var(--text-color-variable)] focus-visible:outline-none'
                  >
                    Details
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}

      {/* The ring shows one project at a time. This keeps all of them reachable
          for screen readers and crawlers. */}
      <ul className='sr-only'>
        {projects.map((project) => (
          <li key={project.slug}>
            <h3>{project.name}</h3>
            <p>{project.blurb}</p>
            <p>{project.description}</p>
            {project.links.map((link) => (
              <a key={link.href} href={link.href}>
                {`${project.name}: ${link.label}`}
              </a>
            ))}
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {detailIndex !== null && (
          <ProjectDetail
            // detailIndex is only ever set from activeIndex, already wrapped.
            project={projects[detailIndex]!}
            onClose={() => setDetailIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectsShowcase;
