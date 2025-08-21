import { Suspense } from 'react';
import { Metadata } from 'next';
import { getAllBlogPosts, getAllBlogTags, getFeaturedBlogPosts } from '@/lib/blog';
import { BlogCard } from '@/components/blog/BlogCard';
import { TagList } from '@/components/blog/TagList';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: 'Blog - Aiden Kopec',
  description: 'Insights and experiences from a full-stack software developer. Learn about scalable web applications, AI tools, and modern development practices.',
  keywords: [
    'blog',
    'software development',
    'web development',
    'next.js',
    'typescript',
    'ai tools',
    'full stack development',
    'programming',
  ],
  openGraph: {
    title: 'Blog - Aiden Kopec',
    description: 'Insights and experiences from a full-stack software developer. Learn about scalable web applications, AI tools, and modern development practices.',
    type: 'website',
    url: 'https://aidenkopec.com/blog',
  },
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

async function BlogContent() {
  const [allPosts, featuredPosts, tags] = await Promise.all([
    getAllBlogPosts(),
    getFeaturedBlogPosts(),
    getAllBlogTags(),
  ]);

  return (
    <>
      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="mb-16">
          <h2 className="section-head-text mb-8">Featured Posts</h2>
          <div className="grid gap-8 md:gap-12">
            {featuredPosts.map((post, index) => (
              <BlogCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        </section>
      )}

      <div className="grid lg:grid-cols-4 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <h2 className="section-head-text mb-8">
            {featuredPosts.length > 0 ? 'All Posts' : 'Latest Posts'}
          </h2>
          
          {allPosts.length > 0 ? (
            <div className="grid gap-8 md:gap-12">
              {allPosts.map((post, index) => (
                <BlogCard 
                  key={post.slug} 
                  post={post} 
                  index={featuredPosts.length > 0 ? index : index} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-white mb-4">
                No blog posts yet
              </h3>
              <p className="text-secondary">
                Stay tuned for upcoming posts about software development, AI tools, and more!
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-8 space-y-8">
            {/* Tags */}
            {tags.length > 0 && (
              <TagList tags={tags} />
            )}
            
            {/* About Section */}
            <div className="bg-tertiary p-6 rounded-lg border border-black-100">
              <h3 className="text-lg font-bold text-white mb-4">About This Blog</h3>
              <p className="text-secondary text-sm leading-relaxed mb-4">
                Welcome to my blog where I share insights about full-stack development, 
                AI integration, and building scalable applications. Learn from real-world 
                projects that have generated $2M+ in business impact.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary">Total Posts:</span>
                  <span className="text-white font-medium">{allPosts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Topics:</span>
                  <span className="text-white font-medium">{tags.length}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

export default function BlogPage() {
  return (
    <main className="relative min-h-screen bg-primary-color">
      <div className="padding">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-16 pt-24">
            <h1 className="hero-head-text mb-6">
              <span className="text-[var(--text-color-variable)]">Blog</span>
            </h1>
            <p className="hero-sub-text max-w-3xl mx-auto">
              Insights and experiences from building scalable web applications, 
              integrating AI tools, and delivering high-impact software solutions.
            </p>
          </section>

          {/* Blog Content */}
          <Suspense fallback={<BlogSkeleton />}>
            <BlogContent />
          </Suspense>
        </div>
      </div>
    </main>
  );
}