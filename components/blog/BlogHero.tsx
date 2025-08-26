'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Filter, Search, Tag } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { BlogPost } from '@/lib/types';

interface BlogHeroProps {
  postsCount: number;
  recentPosts: BlogPost[];
  onSearch?: (term: string) => void;
  onCategoryFilter?: (category: string) => void;
}

export function BlogHero({ postsCount, recentPosts, onSearch }: BlogHeroProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  // Filter posts based on search term
  useEffect(() => {
    const latestPosts = recentPosts.slice(0, 3);

    if (!searchTerm.trim()) {
      setFilteredPosts(latestPosts);
      return;
    }

    const filtered = recentPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    );

    setFilteredPosts(filtered);

    // Call parent search handler
    if (onSearch) {
      onSearch(searchTerm);
    }
  }, [searchTerm, recentPosts, onSearch]);

  const isSearchActive = searchTerm.trim().length > 0;

  return (
    <div className='relative isolate overflow-hidden'>
      {/* Animated background pattern */}
      <motion.div
        className="absolute inset-0 z-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2230%22%20height%3D%2230%22%20viewBox%3D%220%200%2030%2030%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%221%22%3E%3Ccircle%20cx%3D%2215%22%20cy%3D%2215%22%20r%3D%221%22/%3E%3C/g%3E%3C/svg%3E')] bg-[length:30px_30px] opacity-[0.02]"
        style={{
          backgroundPosition: '0px 0px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '30px 30px'],
        }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: 'linear',
        }}
      />

      {/* Gradient overlay */}
      <div className='via-primary-color/70 to-primary-color absolute inset-0 z-10 bg-gradient-to-b from-transparent' />

      {/* Main content */}
      <div className='relative z-20 container mx-auto max-w-7xl px-6 pt-32 pb-16'>
        <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
          {/* Left Column - Title and Buttons */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center lg:text-left'
          >
            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='mb-6 inline-flex items-center rounded-full bg-[var(--text-color-variable)]/10 px-4 py-2 text-sm font-medium text-[var(--text-color-variable)]'
            >
              <BookOpen className='mr-2 h-4 w-4' />
              Insights & Resources
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className='mb-6 pb-2 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl'
            >
              <span className='bg-gradient-to-r from-[var(--text-color-variable)] to-[var(--gradient-start)] bg-clip-text text-transparent'>
                My Blog
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='text-secondary mx-auto mb-8 max-w-xl text-xl leading-relaxed lg:mx-0'
            >
              Latest insights, trends, and tips from a full-stack developer to
              help you build amazing applications and grow your skills.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className='flex flex-col justify-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start'
            >
              {/* Featured Articles Button */}
              <motion.a
                href='#featured'
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className='text-secondary group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[var(--text-color-variable)]/20 bg-gradient-to-r from-[var(--text-color-variable)] to-[var(--gradient-start)] px-6 py-3 text-sm font-medium shadow-lg transition-all hover:from-[var(--text-color-variable)]/90 hover:to-[var(--gradient-start)]/90 hover:shadow-[var(--text-color-variable)]/25 sm:text-base md:px-8 md:py-4'
              >
                <span className='absolute inset-0 h-full w-full bg-gradient-to-r from-white/10 to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100'></span>
                <span className='relative z-10 flex items-center'>
                  Featured Articles
                  <ArrowRight className='ml-2 h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-1' />
                </span>
              </motion.a>

              {/* Browse Categories Button */}
              <motion.a
                href='#blog-content'
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className='bg-tertiary border-black-100 inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-medium text-[var(--text-color-variable)] shadow-sm transition-all hover:border-[var(--text-color-variable)]/30 hover:bg-[var(--text-color-variable)]/5 hover:shadow-md sm:text-base md:px-8 md:py-4'
              >
                <span className='flex items-center'>
                  <Filter className='mr-2 h-4 w-4' />
                  Browse Categories
                </span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Column - Latest Articles Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='mx-auto w-full max-w-md lg:max-w-lg'
          >
            <motion.div
              className='bg-tertiary border-black-100 relative overflow-hidden rounded-xl border shadow-xl'
              whileHover={{
                scale: 1.02,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 15,
              }}
            >
              {/* Card Header */}
              <div className='border-black-100 border-b bg-gradient-to-r from-[var(--text-color-variable)]/10 to-[var(--text-color-variable)]/5 px-6 py-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[var(--text-color-variable)]/10'>
                      <BookOpen className='h-4 w-4 text-[var(--text-color-variable)]' />
                    </div>
                    <h3 className='text-secondary font-semibold'>
                      Latest Articles
                    </h3>
                  </div>
                  <div className='text-sm font-medium text-[var(--text-color-variable)]'>
                    {isSearchActive
                      ? `${filteredPosts.length} results`
                      : `${postsCount} posts`}
                  </div>
                </div>
              </div>

              {/* Search Box */}
              <div className='px-6 pt-4'>
                <div className='relative mb-4'>
                  <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                    <Search className='text-secondary h-4 w-4' />
                  </div>
                  <input
                    type='text'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='bg-black-100 border-black-100 text-secondary placeholder-secondary w-full rounded-lg border py-2.5 pr-4 pl-10 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-[var(--text-color-variable)] focus:outline-none'
                    placeholder='Search articles...'
                  />
                </div>
              </div>

              {/* Recent Posts List */}
              <div className='px-4 pb-6'>
                {/* No results message */}
                {searchTerm.trim() && filteredPosts.length === 0 && (
                  <div className='text-secondary p-4 text-center'>
                    No posts found matching &quot;{searchTerm}&quot;
                  </div>
                )}

                {/* Posts List */}
                <div className='space-y-1'>
                  {filteredPosts.map((post, index) => (
                    <Link href={`/blog/${post.slug}`} key={post.slug}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className='group cursor-pointer rounded-lg p-3 transition-colors hover:bg-[var(--text-color-variable)]/5'
                        whileHover={{
                          x: 5,
                          transition: { duration: 0.2 },
                        }}
                      >
                        <div className='flex items-center justify-between'>
                          <h4 className='text-secondary line-clamp-1 text-sm font-medium transition-colors group-hover:text-[var(--text-color-variable)]'>
                            {post.title}
                          </h4>

                          <motion.div
                            className='bg-black-100 flex h-6 w-6 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100'
                            animate={{ x: [0, 5, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.5,
                              repeatType: 'loop',
                            }}
                          >
                            <ArrowRight className='h-3 w-3 text-[var(--text-color-variable)]' />
                          </motion.div>
                        </div>

                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className='mt-1'>
                            <span className='inline-flex items-center rounded-full bg-[var(--text-color-variable)]/10 px-2 py-0.5 text-xs text-[var(--text-color-variable)]'>
                              <Tag className='mr-1 h-2.5 w-2.5' />
                              {post.tags[0]}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    </Link>
                  ))}
                </div>

                {/* View All Link */}
                <motion.div
                  className='mt-4 text-center'
                  whileHover={{ scale: 1.05 }}
                >
                  <Link
                    href='#blog-content'
                    className='inline-flex items-center text-sm font-medium text-[var(--text-color-variable)] transition-colors hover:text-[var(--text-color-variable)]/80'
                  >
                    View all articles
                    <ArrowRight className='ml-1 h-3 w-3' />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
