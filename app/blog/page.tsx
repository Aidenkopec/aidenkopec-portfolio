import type { Metadata } from 'next';

import { BlogIndex } from '@/components/blog/BlogIndex';
import BlogNavbar from '@/components/blog/BlogNavbar';
import { getAllBlogPosts, getFeaturedBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog - Aiden Kopec',
  description:
    'Practical writing on AI, automation and software development. Real projects with real code and honest results.',
  keywords: ['blog', 'software development', 'ai', 'automation', 'aiden kopec'],
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog - Aiden Kopec',
    description:
      'Practical writing on AI, automation and software development. Real projects with real code and honest results.',
    type: 'website',
    url: 'https://aidenkopec.com/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Aiden Kopec',
    description:
      'Practical writing on AI, automation and software development. Real projects with real code and honest results.',
  },
};

export default async function BlogPage() {
  const [allPosts, featuredPosts] = await Promise.all([
    getAllBlogPosts(),
    getFeaturedBlogPosts(),
  ]);

  return (
    <main className='bg-primary-color relative min-h-screen'>
      <BlogNavbar />
      <div className='padding pt-24'>
        <div className='mx-auto max-w-7xl'>
          <BlogIndex allPosts={allPosts} featuredPosts={featuredPosts} />
        </div>
      </div>
    </main>
  );
}
