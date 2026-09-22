import { ArrowLeft, Tag } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { BlogCard } from '@/components/blog/BlogCard';
import BlogNavbar from '@/components/blog/BlogNavbar';
import { getAllBlogTags, getBlogPostsByTag } from '@/lib/blog';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

// 404s unknown tags at routing. Without it they answer 200 with not-found
// content, because notFound() runs inside the Suspense boundary below and lands
// after the response has already started. Same fix as app/blog/[slug]/page.tsx.
export const dynamicParams = false;

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
    // `tag` is already the slug form that `getAllBlogTags` and the sitemap emit.
    // Without this the root layout's `alternates` is inherited whole and every
    // tag page declares the homepage as its canonical.
    alternates: {
      canonical: `/blog/tag/${tag}`,
    },
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
    <div role='status' aria-live='polite' className='mx-auto max-w-6xl'>
      <span className='sr-only'>Loading tagged posts</span>
      {/* Header Skeleton */}
      <div className='mb-12'>
        <div className='mb-6 h-4 w-24 rounded bg-black-100'></div>
        <div className='mb-4 h-8 w-64 rounded bg-black-100'></div>
        <div className='h-4 w-96 rounded bg-black-100'></div>
      </div>

      {/* Posts Skeleton */}
      <div className='grid gap-8 md:gap-12'>
        {[...Array(3)].map((_, i) => (
          <div key={i} className='animate-pulse rounded-lg bg-tertiary p-6'>
            <div className='mb-4 h-6 w-3/4 rounded bg-black-100'></div>
            <div className='mb-2 h-4 rounded bg-black-100'></div>
            <div className='mb-4 h-4 w-2/3 rounded bg-black-100'></div>
            <div className='mb-4 flex gap-2'>
              <div className='h-6 w-16 rounded-full bg-black-100'></div>
              <div className='h-6 w-20 rounded-full bg-black-100'></div>
            </div>
            <div className='flex justify-between'>
              <div className='h-4 w-32 rounded bg-black-100'></div>
              <div className='h-4 w-24 rounded bg-black-100'></div>
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
    <div className='mx-auto max-w-6xl'>
      {/* Header */}
      <header className='mb-12'>
        {/* Back to Blog */}
        <Link
          href='/blog'
          className='mb-6 inline-flex items-center gap-2 text-sm text-secondary transition-colors hover:text-[var(--text-color-variable)]'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Blog
        </Link>

        {/* Tag Title */}
        <div className='mb-4 flex items-center gap-3'>
          <Tag className='h-8 w-8 text-[var(--text-color-variable)]' />
          <h1 className='section-head-text'>
            Posts tagged{' '}
            <span className='text-[var(--text-color-variable)]'>
              &ldquo;{tagName}&rdquo;
            </span>
          </h1>
        </div>

        <p className='text-lg text-secondary'>
          {posts.length} post{posts.length !== 1 ? 's' : ''} found
        </p>
      </header>

      {/* Posts */}
      <section>
        <div className='grid gap-8 md:gap-12'>
          {posts.map((post, index) => (
            <BlogCard key={post.slug} post={post} index={index} />
          ))}
        </div>
      </section>

      {/* Back to All Posts */}
      <div className='mt-16 text-center'>
        <Link
          href='/blog'
          className='inline-flex items-center gap-2 rounded-lg bg-[var(--text-color-variable)] px-6 py-3 font-medium text-primary transition-all duration-200 hover:bg-[var(--text-color-variable)]/80'
        >
          <ArrowLeft className='h-4 w-4' />
          View All Posts
        </Link>
      </div>
    </div>
  );
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;

  return (
    <main className='relative min-h-screen bg-primary'>
      <BlogNavbar />
      <div className='padding'>
        <Suspense fallback={<TagPageSkeleton />}>
          <TagPageContent tag={tag} />
        </Suspense>
      </div>
    </main>
  );
}
