'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { BlogPost } from '@/lib/types';

interface BlogNavigationProps {
  previousPost?: BlogPost | null;
  nextPost?: BlogPost | null;
}

export function BlogNavigation({
  previousPost,
  nextPost,
}: BlogNavigationProps) {
  if (!previousPost && !nextPost) {
    return null;
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='border-tertiary mt-16 flex flex-col gap-4 border-t pt-8 sm:flex-row'
    >
      {/* Previous Post */}
      <div className='flex-1'>
        {previousPost ? (
          <Link
            href={`/blog/${previousPost.slug}`}
            className='group bg-tertiary border-black-100 block rounded-lg border p-6 transition-all duration-300 hover:border-[var(--text-color-variable)]'
          >
            <div className='text-secondary mb-2 flex items-center gap-3 text-sm'>
              <ArrowLeft className='h-4 w-4' />
              <span>Previous Post</span>
            </div>
            <h3 className='text-secondary line-clamp-2 text-lg font-semibold transition-colors duration-200 group-hover:text-[var(--text-color-variable)]'>
              {previousPost.title}
            </h3>
            <p className='text-secondary mt-2 line-clamp-2 text-sm'>
              {previousPost.description}
            </p>
          </Link>
        ) : (
          <div className='bg-black-100 rounded-lg p-6 opacity-50'>
            <div className='text-secondary mb-2 flex items-center gap-3 text-sm'>
              <ArrowLeft className='h-4 w-4' />
              <span>Previous Post</span>
            </div>
            <p className='text-secondary'>No previous post</p>
          </div>
        )}
      </div>

      {/* Next Post */}
      <div className='flex-1'>
        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug}`}
            className='group bg-tertiary border-black-100 block rounded-lg border p-6 text-right transition-all duration-300 hover:border-[var(--text-color-variable)]'
          >
            <div className='text-secondary mb-2 flex items-center justify-end gap-3 text-sm'>
              <span>Next Post</span>
              <ArrowRight className='h-4 w-4' />
            </div>
            <h3 className='text-secondary line-clamp-2 text-lg font-semibold transition-colors duration-200 group-hover:text-[var(--text-color-variable)]'>
              {nextPost.title}
            </h3>
            <p className='text-secondary mt-2 line-clamp-2 text-sm'>
              {nextPost.description}
            </p>
          </Link>
        ) : (
          <div className='bg-black-100 rounded-lg p-6 text-right opacity-50'>
            <div className='text-secondary mb-2 flex items-center justify-end gap-3 text-sm'>
              <span>Next Post</span>
              <ArrowRight className='h-4 w-4' />
            </div>
            <p className='text-secondary'>No next post</p>
          </div>
        )}
      </div>
    </motion.nav>
  );
}

// Back to Blog Link Component
export function BackToBlog() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className='mt-12 text-center'
    >
      <Link
        href='/blog'
        className='text-secondary inline-flex items-center gap-2 rounded-lg bg-[var(--text-color-variable)] px-6 py-3 font-medium transition-all duration-200 hover:bg-[var(--text-color-variable)]/80'
      >
        <ArrowLeft className='h-4 w-4' />
        Back to All Posts
      </Link>
    </motion.div>
  );
}
