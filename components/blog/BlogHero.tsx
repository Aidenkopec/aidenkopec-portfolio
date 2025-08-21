'use client';

import { motion } from 'framer-motion';
import { Search, ArrowRight, BookOpen, Tag, Filter } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { BlogPost } from '@/lib/types';

interface BlogHeroProps {
  postsCount: number;
  recentPosts: BlogPost[];
  onSearch?: (term: string) => void;
  onCategoryFilter?: (category: string) => void;
}

export function BlogHero({
  postsCount,
  recentPosts,
  onSearch,
  onCategoryFilter,
}: BlogHeroProps) {
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
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    setFilteredPosts(filtered);

    // Call parent search handler
    if (onSearch) {
      onSearch(searchTerm);
    }
  }, [searchTerm, recentPosts, onSearch]);

  const isSearchActive = searchTerm.trim().length > 0;

  return (
    <div className="relative isolate overflow-hidden">
      {/* Animated background pattern */}
      <motion.div
        className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2230%22%20height%3D%2230%22%20viewBox%3D%220%200%2030%2030%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%221%22%3E%3Ccircle%20cx%3D%2215%22%20cy%3D%2215%22%20r%3D%221%22/%3E%3C/g%3E%3C/svg%3E')] bg-[length:30px_30px] z-0"
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
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-color/70 to-primary-color z-10" />

      {/* Main content */}
      <div className="container relative mx-auto px-6 pt-32 pb-16 max-w-7xl z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Title and Buttons */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--text-color-variable)]/10 text-[var(--text-color-variable)] text-sm font-medium mb-6"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Insights & Resources
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 pb-2"
            >
              <span className="bg-gradient-to-r from-[var(--text-color-variable)] to-[var(--gradient-start)] bg-clip-text text-transparent">
                My Blog
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-secondary mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Latest insights, trends, and tips from a full-stack developer to
              help you build amazing applications and grow your skills.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4"
            >
              {/* Featured Articles Button */}
              <motion.a
                href="#featured"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-[var(--text-color-variable)] to-[var(--gradient-start)] hover:from-[var(--text-color-variable)]/90 hover:to-[var(--gradient-start)]/90 text-secondary  font-medium text-sm sm:text-base transition-all shadow-lg hover:shadow-[var(--text-color-variable)]/25 border border-[var(--text-color-variable)]/20 relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center">
                  Featured Articles
                  <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </motion.a>

              {/* Browse Categories Button */}
              <motion.a
                href="#blog-content"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 rounded-full bg-tertiary text-[var(--text-color-variable)] font-medium text-sm sm:text-base transition-all shadow-sm hover:shadow-md border border-black-100 hover:border-[var(--text-color-variable)]/30 hover:bg-[var(--text-color-variable)]/5"
              >
                <span className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
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
            className="mx-auto w-full max-w-md lg:max-w-lg"
          >
            <motion.div
              className="rounded-xl bg-tertiary shadow-xl overflow-hidden border border-black-100 relative"
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
              <div className="bg-gradient-to-r from-[var(--text-color-variable)]/10 to-[var(--text-color-variable)]/5 px-6 py-4 border-b border-black-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-[var(--text-color-variable)]/10 flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-[var(--text-color-variable)]" />
                    </div>
                    <h3 className="font-semibold text-secondary ">
                      Latest Articles
                    </h3>
                  </div>
                  <div className="text-sm font-medium text-[var(--text-color-variable)]">
                    {isSearchActive
                      ? `${filteredPosts.length} results`
                      : `${postsCount} posts`}
                  </div>
                </div>
              </div>

              {/* Search Box */}
              <div className="px-6 pt-4">
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-4 h-4 text-secondary" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2.5 pl-10 pr-4 bg-black-100 border border-black-100 rounded-lg text-sm text-secondary  placeholder-secondary focus:outline-none focus:ring-2 focus:ring-[var(--text-color-variable)] focus:border-transparent transition-all"
                    placeholder="Search articles..."
                  />
                </div>
              </div>

              {/* Recent Posts List */}
              <div className="px-4 pb-6">
                {/* No results message */}
                {searchTerm.trim() && filteredPosts.length === 0 && (
                  <div className="p-4 text-center text-secondary">
                    No posts found matching &quot;{searchTerm}&quot;
                  </div>
                )}

                {/* Posts List */}
                <div className="space-y-1">
                  {filteredPosts.map((post, index) => (
                    <Link href={`/blog/${post.slug}`} key={post.slug}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="p-3 rounded-lg hover:bg-[var(--text-color-variable)]/5 transition-colors cursor-pointer group"
                        whileHover={{
                          x: 5,
                          transition: { duration: 0.2 },
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium text-secondary  group-hover:text-[var(--text-color-variable)] transition-colors line-clamp-1">
                            {post.title}
                          </h4>

                          <motion.div
                            className="h-6 w-6 rounded-full bg-black-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            animate={{ x: [0, 5, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.5,
                              repeatType: 'loop',
                            }}
                          >
                            <ArrowRight className="h-3 w-3 text-[var(--text-color-variable)]" />
                          </motion.div>
                        </div>

                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="mt-1">
                            <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-[var(--text-color-variable)]/10 text-[var(--text-color-variable)]">
                              <Tag className="h-2.5 w-2.5 mr-1" />
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
                  className="mt-4 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <Link
                    href="#blog-content"
                    className="inline-flex items-center text-sm font-medium text-[var(--text-color-variable)] hover:text-[var(--text-color-variable)]/80 transition-colors"
                  >
                    View all articles
                    <ArrowRight className="ml-1 h-3 w-3" />
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
