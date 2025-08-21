import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog';
import { BlogHeader } from '@/components/blog/BlogHeader';
import { BlogContent } from '@/components/blog/BlogContent';
import { BlogNavigation, BackToBlog } from '@/components/blog/BlogNavigation';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found - Aiden Kopec',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} - Aiden Kopec`,
    description: post.description,
    keywords: [...post.tags, 'blog', 'software development', 'aiden kopec'],
    authors: [{ name: post.author?.name || 'Aiden Kopec' }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author?.name || 'Aiden Kopec'],
      tags: post.tags,
      url: `https://aidenkopec.com/blog/${post.slug}`,
      images: post.coverImage ? [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

function BlogPostSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-12">
        <div className="h-4 bg-black-100 rounded w-24 mb-6"></div>
        <div className="h-12 bg-black-100 rounded mb-6"></div>
        <div className="h-6 bg-black-100 rounded mb-8 w-3/4"></div>
        <div className="flex gap-4 mb-8">
          <div className="h-4 bg-black-100 rounded w-32"></div>
          <div className="h-4 bg-black-100 rounded w-24"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-black-100 rounded-full w-16"></div>
          <div className="h-6 bg-black-100 rounded-full w-20"></div>
          <div className="h-6 bg-black-100 rounded-full w-18"></div>
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-4 bg-black-100 rounded w-full"></div>
        ))}
      </div>
    </div>
  );
}

async function BlogPostContent({ slug }: { slug: string }) {
  const [post, allPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getAllBlogPosts(),
  ]);

  if (!post) {
    notFound();
  }

  // Find previous and next posts
  const currentIndex = allPosts.findIndex(p => p.slug === slug);
  const previousPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  // Dynamically import the MDX content
  const MDXContent = await import(`@/content/blog/${slug}.mdx`).then(mod => mod.default);

  // Use headings from parsed blog post
  const headings = post.headings || [];

  return (
    <div className="max-w-7xl mx-auto">
      <BlogHeader post={post} />
      
      <BlogContent headings={headings} title={post.title} slug={post.slug}>
        <MDXContent />
      </BlogContent>
      
      <BlogNavigation previousPost={previousPost} nextPost={nextPost} />
      
      <BackToBlog />
    </div>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  return (
    <main className="min-h-screen w-full bg-primary-color pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<BlogPostSkeleton />}>
          <BlogPostContent slug={slug} />
        </Suspense>
      </div>
    </main>
  );
}