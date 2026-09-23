'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { BlogPost } from '@/lib/types';
import { tagSlug } from '@/lib/utils';

interface BlogHeaderProps {
  post: BlogPost;
}

export function BlogHeader({ post }: BlogHeaderProps) {
  return (
    <>
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='mb-8'
      >
        <Link
          href='/blog'
          className='inline-flex items-center gap-2 text-sm text-secondary transition-colors hover:text-secondary max-lg:min-h-11'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to blog
        </Link>
      </motion.div>

      {/* Article Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className='mb-12 rounded-xl border border-black-200 bg-tertiary p-8'
      >
        <div className='mb-6 flex items-center gap-2'>
          {/* Category Badge */}
          {post.category && (
            <span className='rounded-full px-2.5 py-1 text-xs font-medium text-[var(--text-color-variable)] ring-1 ring-[var(--text-color-variable)]/40 ring-inset'>
              {post.category}
            </span>
          )}
          {/* Featured Badge */}
          {post.featured && (
            <span className='rounded-full bg-[var(--text-color-variable)] px-2.5 py-1 text-xs font-medium text-primary'>
              Featured
            </span>
          )}
          <time className='text-sm text-secondary' dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>

        <h1 className='mb-6 text-3xl font-bold text-secondary md:text-4xl lg:text-5xl'>
          {post.title}
        </h1>

        <p className='mb-8 max-w-3xl text-lg text-secondary'>
          {post.description}
        </p>

        {/* Meta Information */}
        <div className='mb-6 flex flex-wrap items-center gap-6 text-secondary'>
          <div className='flex items-center gap-2'>
            <Clock className='h-4 w-4' />
            <span className='text-sm'>{post.readingTime} min read</span>
          </div>

          <div className='text-sm'>
            by{' '}
            <span className='font-medium text-secondary'>
              {post.author.name}
            </span>
          </div>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tagSlug(tag)}`}
                className='inline-flex items-center gap-1 rounded-full bg-black-100 px-3 py-1 text-sm text-secondary transition-all duration-200 hover:bg-black-200 hover:text-secondary max-lg:relative max-lg:after:absolute max-lg:after:-inset-y-2'
              >
                <Tag className='h-3 w-3' />
                {tag}
              </Link>
            ))}
          </div>
        )}
      </motion.header>

      {/* Featured Image */}
      {post.coverImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='mb-12 w-full rounded-xl border border-black-200 bg-tertiary p-4'
        >
          <div className='relative h-[30rem] w-full overflow-hidden rounded-lg'>
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className='object-cover'
              priority
            />
          </div>
        </motion.div>
      )}
    </>
  );
}
