'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, User } from 'lucide-react';
import Image from 'next/image';

import { BlogPost } from '@/lib/types';

interface BlogCardProps {
  post: BlogPost;
  className?: string;
  index?: number;
  singleFeatured?: boolean;
}

export function BlogCard({
  post,
  className = '',

  index = 0,
  singleFeatured = false,
}: BlogCardProps) {
  // Render single featured post layout (horizontal)
  if (singleFeatured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className={`group ${className}`}
      >
        <Link href={`/blog/${post.slug}`}>
          <motion.div
            className='bg-tertiary border-black-100 flex min-h-[300px] flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:border-[var(--text-color-variable)]/30 hover:shadow-xl lg:flex-row'
            whileHover={{
              y: -5,
              transition: { duration: 0.3 },
            }}
          >
            {/* Thumbnail Container for Single Featured */}
            <div className='bg-black-100/20 flex items-center justify-center p-8 lg:w-1/2'>
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  className='max-h-48 max-w-full rounded-lg object-contain'
                />
              ) : (
                <div className='flex h-32 w-32 items-center justify-center rounded-xl bg-[var(--text-color-variable)]/10'>
                  <div className='text-4xl font-bold text-[var(--text-color-variable)]'>
                    {post.title.charAt(0)}
                  </div>
                </div>
              )}
            </div>

            {/* Content Container */}
            <div className='flex flex-col justify-between p-6 lg:w-1/2'>
              <div>
                {post.featured && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='mb-4 inline-flex items-center rounded-full bg-[var(--text-color-variable)]/10 px-3 py-1 text-xs font-medium text-[var(--text-color-variable)]'
                  >
                    Featured
                  </motion.div>
                )}

                <motion.h2
                  className='text-secondary mb-3 line-clamp-3 text-3xl font-semibold transition-colors duration-200 group-hover:text-[var(--text-color-variable)] lg:text-4xl'
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  {post.title}
                </motion.h2>

                <p className='text-secondary mb-6 line-clamp-5 text-lg leading-relaxed'>
                  {post.description}
                </p>
              </div>

              {/* Footer */}
              <div className='mt-auto'>
                <div className='text-secondary mb-4 flex items-center justify-between text-sm'>
                  <div className='flex items-center gap-4'>
                    <motion.div
                      className='flex items-center gap-1'
                      whileHover={{ color: 'var(--text-color-variable)' }}
                    >
                      <Calendar className='h-4 w-4' />
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </motion.div>

                    <motion.div
                      className='flex items-center gap-1'
                      whileHover={{ color: 'var(--text-color-variable)' }}
                    >
                      <Clock className='h-4 w-4' />
                      <span>{post.readingTime} min read</span>
                    </motion.div>
                  </div>

                  {post.author && (
                    <motion.div
                      className='flex items-center gap-1 text-xs'
                      whileHover={{ color: 'var(--text-color-variable)' }}
                    >
                      <User className='h-3 w-3' />
                      <span>{post.author.name}</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      </motion.article>
    );
  }

  // Render standard Solvex-style card (thumbnail-first layout)
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group ${className}`}
    >
      <Link href={`/blog/${post.slug}`}>
        <motion.div
          className='bg-tertiary border-black-100 flex h-full flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:border-[var(--text-color-variable)]/30 hover:shadow-xl'
          whileHover={{
            y: -5,
            transition: { duration: 0.3 },
          }}
        >
          {/* Thumbnail Image - Top of Card */}
          <div className='relative aspect-video w-full overflow-hidden'>
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className='object-cover transition-transform duration-300 group-hover:scale-105'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--text-color-variable)]/20 to-[var(--text-color-variable)]/5'>
                <div className='text-6xl font-bold text-[var(--text-color-variable)] opacity-50'>
                  {post.title.charAt(0)}
                </div>
              </div>
            )}

            {/* Category Tag Overlay */}
            {post.tags.length > 0 && (
              <div className='absolute top-4 left-4'>
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className='text-secondary inline-flex items-center rounded-full bg-[var(--text-color-variable)] px-3 py-1 text-xs font-medium shadow-lg'
                  whileHover={{ scale: 1.05 }}
                >
                  {post.tags[0]}
                </motion.span>
              </div>
            )}
          </div>

          {/* Content Container */}
          <div className='flex h-full flex-col justify-between p-6'>
            <div>
              {/* Title */}
              <motion.h2
                className='text-secondary mb-3 line-clamp-2 text-xl font-semibold transition-colors duration-200 group-hover:text-[var(--text-color-variable)]'
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                {post.title}
              </motion.h2>

              {/* Description */}
              <p className='text-secondary mb-4 line-clamp-3 leading-relaxed'>
                {post.description}
              </p>
            </div>

            {/* Footer */}
            <div className='mt-auto'>
              {/* Meta Information */}
              <div className='text-secondary flex items-center justify-between text-sm'>
                <div className='flex items-center gap-3'>
                  <motion.div
                    className='flex items-center gap-1'
                    whileHover={{ color: 'var(--text-color-variable)' }}
                  >
                    <Calendar className='h-3 w-3' />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                  </motion.div>

                  <motion.div
                    className='flex items-center gap-1'
                    whileHover={{ color: 'var(--text-color-variable)' }}
                  >
                    <Clock className='h-3 w-3' />
                    <span>{post.readingTime} min read</span>
                  </motion.div>
                </div>

                {/* Author */}
                {post.author && (
                  <motion.div
                    className='flex items-center gap-1 text-xs'
                    whileHover={{ color: 'var(--text-color-variable)' }}
                  >
                    <User className='h-3 w-3' />
                    <span>{post.author.name}</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className='pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--text-color-variable)]/5 via-transparent to-[var(--text-color-variable)]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100'
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
        </motion.div>
      </Link>
    </motion.article>
  );
}
