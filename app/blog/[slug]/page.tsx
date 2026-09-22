import { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { BlogContent } from '@/components/blog/BlogContent';
import { BlogHeader } from '@/components/blog/BlogHeader';
import BlogNavbar from '@/components/blog/BlogNavbar';
import { BackToBlog, BlogNavigation } from '@/components/blog/BlogNavigation';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog';
import { BlogPost } from '@/lib/types';
import { getMDXComponents } from '@/mdx-components';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// 404s unknown and unpublished slugs at routing. Without it they answer 200
// with not-found content, which search engines index.
//
// TODO: incompatible with cacheComponents and fails the build once it is
// enabled. Delete then and call notFound() from the page instead.
export const dynamicParams = false;

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
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
    // Without this the root layout's `alternates` is inherited whole and every
    // post declares the homepage as its canonical, while the sitemap submits
    // this URL. Relative, so it composes with the root's `metadataBase`.
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author?.name || 'Aiden Kopec'],
      tags: post.tags,
      url: `https://aidenkopec.com/blog/${post.slug}`,
      images: post.coverImage
        ? [
            {
              url: post.coverImage,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
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
    <div
      role='status'
      aria-live='polite'
      className='mx-auto max-w-4xl animate-pulse'
    >
      <span className='sr-only'>Loading blog post</span>
      {/* Header Skeleton */}
      <div className='mb-12'>
        <div className='mb-6 h-4 w-24 rounded bg-black-100'></div>
        <div className='mb-6 h-12 rounded bg-black-100'></div>
        <div className='mb-8 h-6 w-3/4 rounded bg-black-100'></div>
        <div className='mb-8 flex gap-4'>
          <div className='h-4 w-32 rounded bg-black-100'></div>
          <div className='h-4 w-24 rounded bg-black-100'></div>
        </div>
        <div className='flex gap-2'>
          <div className='h-6 w-16 rounded-full bg-black-100'></div>
          <div className='h-6 w-20 rounded-full bg-black-100'></div>
          <div className='h-6 w-18 rounded-full bg-black-100'></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className='space-y-4'>
        {[...Array(8)].map((_, i) => (
          <div key={i} className='h-4 w-full rounded bg-black-100'></div>
        ))}
      </div>
    </div>
  );
}

// Server component. MDXRemote here is next-mdx-remote/rsc, not the client build.
function BlogPostRenderer({
  post,
  previousPost,
  nextPost,
}: {
  post: BlogPost;
  previousPost: BlogPost | null;
  nextPost: BlogPost | null;
}) {
  // Get MDX components for styling
  const mdxComponents = getMDXComponents();

  return (
    <div className='mx-auto max-w-7xl'>
      <BlogHeader post={post} />

      <BlogContent headings={post.headings} title={post.title} slug={post.slug}>
        <MDXRemote source={post.content || ''} components={mdxComponents} />
      </BlogContent>

      <BlogNavigation previousPost={previousPost} nextPost={nextPost} />

      <BackToBlog />
    </div>
  );
}

function blogPostingSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    keywords: post.tags,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Aiden Kopec',
      url: 'https://aidenkopec.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://aidenkopec.com/blog/${post.slug}`,
    },
    ...(post.coverImage && {
      image: `https://aidenkopec.com${post.coverImage}`,
    }),
  };
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
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const previousPost =
    currentIndex < allPosts.length - 1
      ? (allPosts[currentIndex + 1] ?? null)
      : null;
  const nextPost =
    currentIndex > 0 ? (allPosts[currentIndex - 1] ?? null) : null;

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingSchema(post)),
        }}
      />
      <BlogPostRenderer
        post={post}
        previousPost={previousPost}
        nextPost={nextPost}
      />
    </>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  return (
    <main className='min-h-screen w-full bg-primary'>
      <BlogNavbar />
      <div className='pt-28 pb-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <Suspense fallback={<BlogPostSkeleton />}>
            <BlogPostContent slug={slug} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
