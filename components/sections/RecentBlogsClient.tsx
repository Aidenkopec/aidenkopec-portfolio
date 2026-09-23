'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import SectionHeader from '@/components/chart/SectionHeader';
import SectionWrapper from '@/components/layout/SectionWrapper';
import { usePlayWhileVisible } from '@/hooks/usePlayWhileVisible';
import { BlogPost } from '@/lib/types';

// Bar heights of the signal glyph, as a share of its height.
const SIGNAL = [0.35, 0.7, 0.5, 1, 0.6, 0.85, 0.4];

// A small waveform that plays while its post is hovered or focused.
const Signal: React.FC = () => (
  <svg
    aria-hidden='true'
    viewBox='0 0 40 20'
    className='signal h-5 w-10 text-[var(--text-color-variable)]'
  >
    {SIGNAL.map((height, i) => (
      <rect
        key={i}
        x={i * 6}
        y={10 - height * 9}
        width={2.5}
        height={height * 18}
        rx={1.25}
        fill='currentColor'
        style={{ animationDelay: `${i * 90}ms` }}
      />
    ))}
  </svg>
);

// Frontmatter dates are plain days, parsed as UTC midnight, so they are shown
// in UTC too. In a local zone west of UTC they would read as the day before.
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });

// Posts arrive like transmissions: newest first, the latest with its cover.
const RecentBlogsClient: React.FC<{ posts: BlogPost[] }> = ({ posts }) => {
  const listRef = usePlayWhileVisible<HTMLOListElement>();

  return (
    <SectionWrapper idName='recent-blogs' label='Recent blog posts'>
      <SectionHeader
        title='Writing'
        intro='Notes on what I build and what I learn doing it, including the parts that did not work.'
        action={
          <Link href='/blog' className='chart-link'>
            Read all posts
          </Link>
        }
      />

      <ol ref={listRef} className='mt-12 border-b border-[var(--chart-faint)]'>
        {posts.map((post, index) => {
          const cover = index === 0 ? post.coverImage : undefined;
          return (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className='transmission group grid gap-5 border-t border-[var(--chart-faint)] py-8 outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-color-variable)] md:grid-cols-[10rem_1fr_auto] md:gap-10 md:py-10 md:max-lg:grid-cols-[10rem_1fr]'
              >
                <div className='flex items-center gap-4 text-[14px] text-white-100/55 md:flex-col md:items-start md:gap-2'>
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span>{post.readingTime} min read</span>
                  <Signal />
                </div>

                <div className='max-w-2xl'>
                  <h3
                    className={`font-display leading-tight text-white-100 italic transition-colors duration-300 group-hover:text-[var(--text-color-variable)] ${
                      index === 0
                        ? 'text-[32px] sm:text-[44px]'
                        : 'text-[26px] sm:text-[32px]'
                    }`}
                  >
                    {post.title}
                  </h3>
                  <p className='mt-3 text-[16px] leading-[1.7] text-white-100/70'>
                    {post.excerpt ?? post.description}
                  </p>
                </div>

                {cover && (
                  <div className='relative aspect-video w-full overflow-hidden rounded-lg border border-[var(--chart-faint)] md:w-72 md:max-lg:col-start-2'>
                    <Image
                      src={cover}
                      alt=''
                      fill
                      sizes='(min-width: 768px) 288px, 100vw'
                      className='object-cover transition-transform duration-500 group-hover:scale-105'
                    />
                  </div>
                )}
              </Link>
            </li>
          );
        })}
      </ol>
    </SectionWrapper>
  );
};

export default RecentBlogsClient;
