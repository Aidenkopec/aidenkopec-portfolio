'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
            <div className='bg-black-100/20 flex items-center justify-center p-4 sm:p-6 lg:w-1/2 lg:p-8'>
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  className='max-h-32 max-w-full rounded-lg object-contain sm:max-h-40 lg:max-h-48'
                />
              ) : (
                <div className='flex h-24 w-24 items-center justify-center rounded-xl bg-[var(--text-color-variable)]/10 sm:h-28 sm:w-28 lg:h-32 lg:w-32'>
                  <div className='text-2xl font-bold text-[var(--text-color-variable)] sm:text-3xl lg:text-4xl'>
                    {post.title.charAt(0)}
                  </div>
                </div>
              )}
            </div>

            {/* Content Container */}
            <div className='flex flex-col justify-between p-4 sm:p-5 lg:w-1/2 lg:p-6'>
              <div>
                {post.featured && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='mb-3 inline-flex items-center rounded-full bg-[var(--text-color-variable)]/10 px-2.5 py-1 text-xs font-medium text-[var(--text-color-variable)] sm:mb-4 sm:px-3'
                  >
                    Featured
                  </motion.div>
                )}

                <motion.h2
                  className='text-secondary mb-2 line-clamp-3 text-xl font-semibold transition-colors duration-200 group-hover:text-[var(--text-color-variable)] sm:mb-3 sm:text-2xl lg:text-3xl xl:text-4xl'
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  {post.title}
                </motion.h2>

                <p className='text-secondary mb-4 line-clamp-4 text-sm leading-relaxed sm:mb-5 sm:line-clamp-5 sm:text-base lg:mb-6 lg:text-lg'>
                  {post.description}
                </p>
              </div>

              {/* Footer */}
              <div className='mt-auto'>
                <div className='text-secondary flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm'>
                  <div className='flex items-center gap-3 sm:gap-4'>
                    <motion.div
                      className='flex items-center gap-1'
                      whileHover={{ color: 'var(--text-color-variable)' }}
                    >
                      <Calendar className='h-3 w-3 sm:h-4 sm:w-4' />
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
                      <Clock className='h-3 w-3 sm:h-4 sm:w-4' />
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
                <div className='text-4xl font-bold text-[var(--text-color-variable)] opacity-50 sm:text-5xl lg:text-6xl'>
                  {post.title.charAt(0)}
                </div>
              </div>
            )}

            {/* Category Tag Overlay */}
            {post.tags.length > 0 && (
              <div className='absolute top-2 left-2 sm:top-3 sm:left-3 lg:top-4 lg:left-4'>
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className='text-secondary inline-flex items-center rounded-full bg-[var(--text-color-variable)] px-2 py-0.5 text-xs font-medium shadow-lg sm:px-2.5 sm:py-1 lg:px-3'
                  whileHover={{ scale: 1.05 }}
                >
                  {post.tags[0]}
                </motion.span>
              </div>
            )}
          </div>

          {/* Content Container */}
          <div className='flex h-full flex-col justify-between p-4 sm:p-5 lg:p-6'>
            <div>
              {/* Title */}
              <motion.h2
                className='text-secondary mb-2 line-clamp-2 text-lg font-semibold transition-colors duration-200 group-hover:text-[var(--text-color-variable)] sm:mb-3 sm:text-xl lg:text-xl'
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                {post.title}
              </motion.h2>

              {/* Description */}
              <p className='text-secondary mb-3 line-clamp-2 text-sm leading-relaxed sm:mb-4 sm:line-clamp-3 sm:text-base lg:text-base'>
                {post.description}
              </p>
            </div>

            {/* Footer */}
            <div className='mt-auto'>
              {/* Meta Information */}
              <div className='text-secondary flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm'>
                <div className='flex items-center gap-2 sm:gap-3'>
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
                    className='flex items-center gap-1 text-xs sm:mt-0'
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
