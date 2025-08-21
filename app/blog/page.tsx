'use client';

import { Suspense, useState, useEffect } from 'react';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogHero } from '@/components/blog/BlogHero';
import { BlogCategories } from '@/components/blog/BlogCategories';
import { BlogPagination } from '@/components/blog/BlogPagination';
import { useBlogSearch } from '@/hooks/useBlogSearch';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { BlogPost } from '@/lib/types';

// Move metadata to a separate file or handle differently since this is now a client component
const blogMetadata = {
  title: 'Blog - Aiden Kopec',
  description:
    'Insights and experiences from a full-stack software developer. Learn about scalable web applications, AI tools, and modern development practices.',
};

function BlogSkeleton() {
  return (
    <div className="grid gap-8 md:gap-12">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-tertiary p-6 rounded-lg animate-pulse">
          <div className="h-6 bg-black-100 rounded mb-4 w-3/4"></div>
          <div className="h-4 bg-black-100 rounded mb-2"></div>
          <div className="h-4 bg-black-100 rounded mb-4 w-2/3"></div>
          <div className="flex gap-2 mb-4">
            <div className="h-6 bg-black-100 rounded-full w-16"></div>
            <div className="h-6 bg-black-100 rounded-full w-20"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-black-100 rounded w-32"></div>
            <div className="h-4 bg-black-100 rounded w-24"></div>
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
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        {/* Featured Post Section */}
        {!isFiltered && featuredPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
            id="featured"
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
          className="mb-12"
          id="blog-content"
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-head-text">
              {isFiltered ? 'Filtered Results' : 'All Articles'}
            </h2>
            <span className="text-secondary text-sm">
              {isFiltered
                ? `${resultCount} results`
                : `${totalCount} total articles`}
            </span>
          </div>

          {paginatedPosts.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
                {paginatedPosts.map((post, index) => (
                  <BlogCard
                    key={post.slug}
                    post={post}
                    index={index}
                    className="h-full"
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
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--text-color-variable)]/10 flex items-center justify-center">
                  <Search className="w-8 h-8 text-[var(--text-color-variable)]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {isFiltered ? 'No articles found' : 'No blog posts yet'}
                </h3>
                <p className="text-secondary mb-6">
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
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--text-color-variable)] text-white hover:bg-[var(--text-color-variable)]/90 transition-colors"
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
    <main className="relative min-h-screen bg-primary-color">
      <BlogNavbar />
      <div className="padding pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Blog Content - BlogHero becomes the main hero */}
          <Suspense fallback={<BlogSkeleton />}>
            <BlogContent />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
