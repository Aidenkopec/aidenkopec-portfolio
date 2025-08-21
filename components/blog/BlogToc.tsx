'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BlogHeading } from '@/lib/types';

interface BlogTocProps {
  headings: BlogHeading[];
  className?: string;
}

export function BlogToc({ headings, className }: BlogTocProps) {
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
        rootMargin: '0px 0px -80% 0px',
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn('w-full bg-tertiary p-6 rounded-lg border border-black-200', className)}
    >
      <h3 className="text-lg font-semibold text-white mb-4">
        Table of Contents
      </h3>

      <nav>
        <ol className="space-y-3 text-sm">
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
                  'block transition-colors inline-flex hover:text-[var(--text-color-variable)] duration-200',
                  activeId === heading.id
                    ? 'text-[var(--text-color-variable)] font-medium'
                    : 'text-secondary'
                )}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(heading.id);
                  if (element) {
                    const topOffset =
                      element.getBoundingClientRect().top +
                      window.scrollY -
                      100;
                    window.scrollTo({ top: topOffset, behavior: 'smooth' });
                    setActiveId(heading.id);
                  }
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </motion.div>
  );
}