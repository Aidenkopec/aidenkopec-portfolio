import type { MetadataRoute } from 'next';

import { getAllBlogPosts, getAllBlogTags } from '@/lib/blog';

const SITE_URL = 'https://aidenkopec.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, tags] = await Promise.all([
    getAllBlogPosts(),
    getAllBlogTags(),
  ]);

  // lastModified is intentionally derived from frontmatter rather than
  // new Date(): synchronous clock reads are a hard prerender error once
  // cacheComponents is enabled, and it cannot be deferred.
  return [
    { url: SITE_URL, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
    ...tags.map((tag) => ({
      url: `${SITE_URL}/blog/tag/${tag.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    })),
  ];
}
