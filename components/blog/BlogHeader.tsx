'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { BlogPost } from '@/lib/types';

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
          className='text-secondary hover:text-secondary inline-flex items-center gap-2 text-sm transition-colors'
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
        className='bg-tertiary border-black-200 mb-12 rounded-xl border p-8'
      >
        <div className='mb-6 flex items-center gap-2'>
          {/* Category Badge */}
          {post.category && (
            <span className='rounded-full bg-[var(--text-color-variable)]/20 px-2.5 py-1 text-xs font-medium text-[var(--text-color-variable)]'>
              {post.category}
            </span>
          )}
          {/* Featured Badge */}
          {post.featured && (
            <span className='text-secondary rounded-full bg-[var(--text-color-variable)] px-2.5 py-1 text-xs font-medium'>
              Featured
            </span>
          )}
          <time className='text-secondary text-sm' dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>

        <h1 className='text-secondary mb-6 text-3xl font-bold md:text-4xl lg:text-5xl'>
          {post.title}
        </h1>

        <p className='text-secondary mb-8 max-w-3xl text-lg'>
          {post.description}
        </p>

        {/* Meta Information */}
        <div className='text-secondary mb-6 flex flex-wrap items-center gap-6'>
          <div className='flex items-center gap-2'>
            <Clock className='h-4 w-4' />
            <span className='text-sm'>{post.readingTime} min read</span>
          </div>

          {post.author && (
            <div className='text-sm'>
              by{' '}
              <span className='text-secondary font-medium'>
                {post.author.name}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                className='bg-black-100 text-secondary hover:text-secondary hover:bg-black-200 inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm transition-all duration-200'
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
          className='bg-tertiary border-black-200 mb-12 w-full rounded-xl border p-4'
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
