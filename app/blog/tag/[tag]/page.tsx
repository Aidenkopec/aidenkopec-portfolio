import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Tag } from 'lucide-react';
import { getAllBlogTags, getBlogPostsByTag } from '@/lib/blog';
import { BlogCard } from '@/components/blog/BlogCard';
import BlogNavbar from '@/components/blog/BlogNavbar';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

// Generate static params for all tags
export async function generateStaticParams() {
  const tags = await getAllBlogTags();
  return tags.map((tag) => ({
    tag: tag.slug,
  }));
}

// Generate metadata for each tag page
export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const posts = await getBlogPostsByTag(tag);

  if (posts.length === 0) {
    return {
      title: 'Tag Not Found - Aiden Kopec',
      description: 'The requested tag could not be found.',
    };
  }

  // Find the actual tag name from the posts
  const tagName =
    posts[0]?.tags.find((t) => t.toLowerCase().replace(/\s+/g, '-') === tag) ||
    tag;

  return {
    title: `Posts tagged "${tagName}" - Aiden Kopec`,
    description: `Browse all blog posts tagged with "${tagName}". Insights about software development, AI tools, and modern web technologies.`,
    keywords: [tagName, 'blog', 'software development', 'aiden kopec'],
    openGraph: {
      title: `Posts tagged "${tagName}" - Aiden Kopec`,
      description: `Browse all blog posts tagged with "${tagName}". Insights about software development, AI tools, and modern web technologies.`,
      type: 'website',
      url: `https://aidenkopec.com/blog/tag/${tag}`,
    },
  };
}

function TagPageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Skeleton */}
      <div className="mb-12">
        <div className="h-4 bg-black-100 rounded w-24 mb-6"></div>
        <div className="h-8 bg-black-100 rounded w-64 mb-4"></div>
        <div className="h-4 bg-black-100 rounded w-96"></div>
      </div>

      {/* Posts Skeleton */}
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
    </div>
  );
}

async function TagPageContent({ tag }: { tag: string }) {
  const posts = await getBlogPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  // Find the actual tag name from the posts
  const tagName =
    posts[0]?.tags.find((t) => t.toLowerCase().replace(/\s+/g, '-') === tag) ||
    tag.replace(/-/g, ' ');

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        {/* Back to Blog */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-secondary hover:text-[var(--text-color-variable)] transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Tag Title */}
        <div className="flex items-center gap-3 mb-4">
          <Tag className="w-8 h-8 text-[var(--text-color-variable)]" />
          <h1 className="section-head-text">
            Posts tagged{' '}
            <span className="text-[var(--text-color-variable)]">
              "{tagName}"
            </span>
          </h1>
        </div>

        <p className="text-secondary text-lg">
          {posts.length} post{posts.length !== 1 ? 's' : ''} found
        </p>
      </header>

      {/* Posts */}
      <section>
        <div className="grid gap-8 md:gap-12">
          {posts.map((post, index) => (
            <BlogCard key={post.slug} post={post} index={index} />
          ))}
        </div>
      </section>

      {/* Back to All Posts */}
      <div className="text-center mt-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--text-color-variable)] text-secondary  rounded-lg hover:bg-[var(--text-color-variable)]/80 transition-all duration-200 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          View All Posts
        </Link>
      </div>
    </div>
  );
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;

  return (
    <main className="relative min-h-screen bg-primary-color">
      <BlogNavbar />
      <div className="padding pt-24">
        <Suspense fallback={<TagPageSkeleton />}>
          <TagPageContent tag={tag} />
        </Suspense>
      </div>
    </main>
  );
}
