'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface BlogHeading {
  id: string;
  text: string;
  level: number;
}

interface BlogTocProps {
  headings: BlogHeading[];
  className?: string;
  isMobile?: boolean;
}

export function BlogToc({
  headings,
  className,
  isMobile = false,
}: BlogTocProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0.1,
      }
    );

    // Observe all section headings
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [headings]);

  if (!headings.length) return null;

  return (
    <div className={cn('w-full', className)}>
      <h3 className="text-lg font-semibold text-secondary  mb-4">
        Table of Contents
      </h3>

      <nav>
        <ol className={cn('text-sm', isMobile ? 'space-y-3' : 'space-y-1')}>
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={cn(
                heading.level === 1
                  ? 'ml-0'
                  : heading.level === 2
                    ? 'ml-3'
                    : heading.level === 3
                      ? 'ml-6'
                      : 'ml-9'
              )}
            >
              <a
                href={`#${heading.id}`}
                className={cn(
                  'block transition-colors duration-200 inline-flex',
                  activeId === heading.id
                    ? 'text-[var(--text-color-variable)] font-medium'
                    : 'text-secondary  hover:text-[var(--text-color-variable)]',
                  // Mobile gets more spacing, desktop stays compact
                  isMobile ? 'py-3 px-3 min-h-[44px] items-center' : 'py-1'
                )}
                onClick={(e) => {
                  // Let the native anchor behavior handle the navigation
                  // Just update the active ID for styling
                  setActiveId(heading.id);

                  // Add a small delay to ensure the scroll happens before updating active state
                  setTimeout(() => {
                    const element = document.getElementById(heading.id);
                    if (element) {
                      // Verify the element exists and update active state
                      setActiveId(heading.id);
                    }
                  }, 100);
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
