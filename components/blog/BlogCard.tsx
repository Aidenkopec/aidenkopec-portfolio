'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, User } from 'lucide-react';
import { BlogPost } from '@/lib/types';
import Image from 'next/image';

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
            className="overflow-hidden rounded-xl bg-tertiary shadow-sm hover:shadow-xl transition-all duration-300 border border-black-100 hover:border-[var(--text-color-variable)]/30 flex flex-col lg:flex-row min-h-[300px]"
            whileHover={{
              y: -5,
              transition: { duration: 0.3 },
            }}
          >
            {/* Thumbnail Container for Single Featured */}
            <div className="lg:w-1/2 bg-black-100/20 flex items-center justify-center p-8">
              {post.coverImage ? (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="max-w-full max-h-48 object-contain rounded-lg"
                />
              ) : (
                <div className="w-32 h-32 bg-[var(--text-color-variable)]/10 rounded-xl flex items-center justify-center">
                  <div className="text-[var(--text-color-variable)] text-4xl font-bold">
                    {post.title.charAt(0)}
                  </div>
                </div>
              )}
            </div>

            {/* Content Container */}
            <div className="lg:w-1/2 flex flex-col justify-between p-6">
              <div>
                {post.featured && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--text-color-variable)]/10 text-[var(--text-color-variable)] mb-4"
                  >
                    Featured
                  </motion.div>
                )}

                <motion.h2
                  className="font-semibold text-white mb-3 transition-colors duration-200 group-hover:text-[var(--text-color-variable)] text-3xl lg:text-4xl line-clamp-3"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  {post.title}
                </motion.h2>

                <p className="text-white leading-relaxed mb-6 line-clamp-5 text-lg">
                  {post.description}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-auto">
                <div className="flex items-center justify-between text-sm text-white mb-4">
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="flex items-center gap-1"
                      whileHover={{ color: 'var(--text-color-variable)' }}
                    >
                      <Calendar className="w-4 h-4" />
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </motion.div>

                    <motion.div
                      className="flex items-center gap-1"
                      whileHover={{ color: 'var(--text-color-variable)' }}
                    >
                      <Clock className="w-4 h-4" />
                      <span>{post.readingTime} min read</span>
                    </motion.div>
                  </div>

                  {post.author && (
                    <motion.div
                      className="flex items-center gap-1 text-xs"
                      whileHover={{ color: 'var(--text-color-variable)' }}
                    >
                      <User className="w-3 h-3" />
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
          className="overflow-hidden rounded-xl bg-tertiary shadow-sm hover:shadow-xl transition-all duration-300 border border-black-100 hover:border-[var(--text-color-variable)]/30 flex flex-col h-full"
          whileHover={{
            y: -5,
            transition: { duration: 0.3 },
          }}
        >
          {/* Thumbnail Image - Top of Card */}
          <div className="relative aspect-video w-full overflow-hidden">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[var(--text-color-variable)]/20 to-[var(--text-color-variable)]/5 flex items-center justify-center">
                <div className="text-[var(--text-color-variable)] text-6xl font-bold opacity-50">
                  {post.title.charAt(0)}
                </div>
              </div>
            )}

            {/* Category Tag Overlay */}
            {post.tags.length > 0 && (
              <div className="absolute left-4 top-4">
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--text-color-variable)] text-white shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  {post.tags[0]}
                </motion.span>
              </div>
            )}
          </div>

          {/* Content Container */}
          <div className="flex flex-col justify-between p-6 h-full">
            <div>
              {/* Title */}
              <motion.h2
                className="font-semibold text-white mb-3 line-clamp-2 transition-colors duration-200 group-hover:text-[var(--text-color-variable)] text-xl"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                {post.title}
              </motion.h2>

              {/* Description */}
              <p className="text-white leading-relaxed mb-4 line-clamp-3">
                {post.description}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-auto">
              {/* Meta Information */}
              <div className="flex items-center justify-between text-sm text-white">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="flex items-center gap-1"
                    whileHover={{ color: 'var(--text-color-variable)' }}
                  >
                    <Calendar className="w-3 h-3" />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-1"
                    whileHover={{ color: 'var(--text-color-variable)' }}
                  >
                    <Clock className="w-3 h-3" />
                    <span>{post.readingTime} min read</span>
                  </motion.div>
                </div>

                {/* Author */}
                {post.author && (
                  <motion.div
                    className="flex items-center gap-1 text-xs"
                    whileHover={{ color: 'var(--text-color-variable)' }}
                  >
                    <User className="w-3 h-3" />
                    <span>{post.author.name}</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[var(--text-color-variable)]/5 via-transparent to-[var(--text-color-variable)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
        </motion.div>
      </Link>
    </motion.article>
  );
}
