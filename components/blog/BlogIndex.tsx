'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useState } from 'react';

import { BlogCard } from '@/components/blog/BlogCard';
import { BlogCategories } from '@/components/blog/BlogCategories';
import { BlogHero } from '@/components/blog/BlogHero';
import { BlogPagination } from '@/components/blog/BlogPagination';
import { useBlogSearch } from '@/hooks/useBlogSearch';
import { BlogPost } from '@/lib/types';

const POSTS_PER_PAGE = 6;

interface BlogIndexProps {
  allPosts: BlogPost[];
  featuredPosts: BlogPost[];
}

export function BlogIndex({ allPosts, featuredPosts }: BlogIndexProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Only the first featured post is rendered. Bound here so the JSX guard
  // narrows the element itself rather than checking the array's length.
  const featuredPost = featuredPosts[0];

  const {
    filteredPosts,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    resultCount,
    totalCount,
    isFiltered,
  } = useBlogSearch(allPosts);

  // Reset to page 1 when filters change. Adjusted during render rather than in
  // an effect, so the new page is used on this pass instead of a second one.
  const filterKey = `${searchTerm}\u0000${selectedCategory ?? ''}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setCurrentPage(1);
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  return (
    <>
      {/* Hero Section */}
      <BlogHero
        postsCount={allPosts.length}
        recentPosts={allPosts}
        onSearch={setSearchTerm}
      />

      {/* Main Content */}
      <div className='container mx-auto max-w-7xl px-6 py-16'>
        {/* Featured Post Section */}
        {!isFiltered && featuredPost && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='mb-16'
            id='featured'
          >
            {/* Single Large Featured Post */}
            <BlogCard
              key={featuredPost.slug}
              post={featuredPost}
              singleFeatured={true}
              index={0}
            />
          </motion.section>
        )}

        {/* Categories Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='mb-12'
          id='blog-content'
        >
          <BlogCategories
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            resultCount={resultCount}
            totalCount={totalCount}
          />
        </motion.div>

        {/* All Posts Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className='mb-8 flex items-center justify-between'>
            <h2 className='section-head-text'>
              {isFiltered ? 'Filtered Results' : 'All Articles'}
            </h2>
          </div>

          {paginatedPosts.length > 0 ? (
            <>
              <div className='grid auto-rows-fr gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                {paginatedPosts.map((post, index) => (
                  <BlogCard
                    key={post.slug}
                    post={post}
                    index={index}
                    className='h-full'
                  />
                ))}
              </div>

              {/* Pagination */}
              <BlogPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className='py-16 text-center'
            >
              <div className='mx-auto max-w-md'>
                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--text-color-variable)]/10'>
                  <Search className='h-8 w-8 text-[var(--text-color-variable)]' />
                </div>
                <h3 className='mb-2 text-xl font-semibold text-secondary'>
                  {isFiltered ? 'No articles found' : 'No blog posts yet'}
                </h3>
                <p className='mb-6 text-secondary'>
                  {isFiltered
                    ? 'Try adjusting your search or filter criteria'
                    : 'Stay tuned for upcoming posts about software development, AI tools, and more!'}
                </p>
                {isFiltered && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory(null);
                    }}
                    className='inline-flex items-center gap-2 rounded-lg bg-[var(--text-color-variable)] px-4 py-2 text-secondary transition-colors hover:bg-[var(--text-color-variable)]/90'
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </motion.section>
      </div>
    </>
  );
}
