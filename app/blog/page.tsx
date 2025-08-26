'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';

import { BlogCard } from '@/components/blog/BlogCard';
import { BlogCategories } from '@/components/blog/BlogCategories';
import { BlogHero } from '@/components/blog/BlogHero';
import { BlogPagination } from '@/components/blog/BlogPagination';
import { useBlogSearch } from '@/hooks/useBlogSearch';
import { BlogPost } from '@/lib/types';

function BlogSkeleton() {
  return (
    <div className='grid gap-8 md:gap-12'>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className='bg-black-100/20 border-tertiary/20 animate-pulse rounded-lg border p-6 backdrop-blur-sm'
        >
          <div className='bg-tertiary mb-4 h-6 w-3/4 rounded'></div>
          <div className='bg-tertiary mb-2 h-4 rounded'></div>
          <div className='bg-tertiary mb-4 h-4 w-2/3 rounded'></div>
          <div className='mb-4 flex gap-2'>
            <div className='bg-tertiary h-6 w-16 rounded-full'></div>
            <div className='bg-tertiary h-6 w-20 rounded-full'></div>
          </div>
          <div className='flex justify-between'>
            <div className='bg-tertiary h-4 w-32 rounded'></div>
            <div className='bg-tertiary h-4 w-24 rounded'></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function BlogContent() {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const POSTS_PER_PAGE = 6;

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

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch blog data');
        }
        const { allPosts: posts, featuredPosts: featured } =
          await response.json();
        setAllPosts(posts);
        setFeaturedPosts(featured);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) {
    return <BlogSkeleton />;
  }

  return (
    <>
      {/* Hero Section */}
      <BlogHero
        postsCount={allPosts.length}
        recentPosts={allPosts}
        onSearch={setSearchTerm}
        onCategoryFilter={setSelectedCategory}
      />

      {/* Main Content */}
      <div className='container mx-auto max-w-7xl px-6 py-16'>
        {/* Featured Post Section */}
        {!isFiltered && featuredPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='mb-16'
            id='featured'
          >
            {/* Single Large Featured Post */}
            <BlogCard
              key={featuredPosts[0].slug}
              post={featuredPosts[0]}
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
                <h3 className='text-secondary mb-2 text-xl font-semibold'>
                  {isFiltered ? 'No articles found' : 'No blog posts yet'}
                </h3>
                <p className='text-secondary mb-6'>
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
                    className='text-secondary inline-flex items-center gap-2 rounded-lg bg-[var(--text-color-variable)] px-4 py-2 transition-colors hover:bg-[var(--text-color-variable)]/90'
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

import BlogNavbar from '@/components/blog/BlogNavbar';

export default function BlogPage() {
  return (
    <main className='bg-primary-color relative min-h-screen'>
      <BlogNavbar />
      <div className='padding pt-24'>
        <div className='mx-auto max-w-7xl'>
          {/* Blog Content - BlogHero becomes the main hero */}
          <Suspense fallback={<BlogSkeleton />}>
            <BlogContent />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
