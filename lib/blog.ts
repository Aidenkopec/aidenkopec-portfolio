import 'server-only';

import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import { cache } from 'react';

import { blogFrontmatterSchema, formatIssues } from './blog-schema';
import { createSlugger, stripInlineMarkdown } from './slugify';
import { BlogPost, BlogTag, BlogHeading } from './types';

const BLOG_DIRECTORY = path.join(process.cwd(), 'content/blog');

// Helper to calculate reading time (average 200 words per minute)
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Helper to extract headings from MDX content for table of contents.
//
// Line scan rather than a global regex so `# comment` lines inside fenced code
// blocks stop producing phantom entries whose anchors point nowhere. The ids
// come from the same slugger the heading elements use, via lib/slugify.
function extractHeadings(content: string): BlogHeading[] {
  const headings: BlogHeading[] = [];
  const slug = createSlugger();
  // The open fence, not a boolean: a ``` line inside a ~~~ block is content,
  // not a close, and flipping on it desynced the flag for the rest of the file.
  let fence: { char: string; length: number } | null = null;

  for (const line of content.split('\n')) {
    const fenceMatch = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (fenceMatch) {
      // Group 1 matched, so it is a non-empty run of one repeated character.
      const run = fenceMatch[1] as string;
      const char = run[0] as string;
      const length = run.length;
      if (!fence) {
        fence = { char, length };
      } else if (char === fence.char && length >= fence.length) {
        fence = null;
      }
      continue;
    }
    if (fence) continue;

    // The optional trailing run handles ATX closing sequences. It needs the
    // leading whitespace CommonMark requires, so a `#` that is part of the
    // heading text survives: `## Why I picked C#`.
    const match = line.match(/^(#{1,6})\s+(.+?)(?:\s+#+)?\s*$/);
    if (!match) continue;

    // Both groups are mandatory in the pattern, so a match populates both.
    const hashes = match[1] as string;
    const text = stripInlineMarkdown((match[2] as string).trim());
    if (!text) continue;

    headings.push({
      id: slug(text),
      text,
      level: hashes.length,
    });
  }

  return headings;
}

/**
 * Frontmatter is parsed by gray-matter and validated by the schema, so the
 * returned metadata is a type the data actually satisfies. The previous hand
 * written parser split each line on its first colon, which could not express a
 * nested `author:` and laundered a `Partial` into a complete `BlogMetadata`
 * with two `as any` casts.
 *
 * Throws on a malformed post. Callers do not catch it: a post that cannot be
 * parsed must fail the build, not vanish from the index.
 */
function parseMDXFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  const parsed = blogFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in ${filePath}:\n${formatIssues(parsed.error)}`,
    );
  }

  return {
    metadata: parsed.data,
    content,
    readingTime: calculateReadingTime(content),
    headings: extractHeadings(content),
  };
}

// Get all blog posts
export const getAllBlogPosts = cache(async (): Promise<BlogPost[]> => {
  // A read path does not repair the tree. The directory ships with the repo, so
  // its absence is a build time problem, and mkdirSync here would throw EROFS on
  // a read only serverless filesystem rather than degrading to an empty list.
  if (!fs.existsSync(BLOG_DIRECTORY)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIRECTORY);
  const mdxFiles = files.filter((file) => file.endsWith('.mdx'));

  // parseMDXFile throws on a post that fails the schema, and nothing catches it.
  // Logging and skipping would hide a broken post behind a passing build.
  const posts = mdxFiles.map((file) => {
    const slug = file.replace('.mdx', '');
    const { metadata, readingTime, headings } = parseMDXFile(
      path.join(BLOG_DIRECTORY, file),
    );

    return {
      slug,
      readingTime,
      headings,
      ...metadata,
      excerpt: metadata.excerpt || metadata.description,
    };
  });

  // Sort by date (newest first) and filter published posts
  return posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

// Get a single blog post by slug
export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const filePath = path.join(BLOG_DIRECTORY, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const { metadata, content, readingTime, headings } = parseMDXFile(filePath);

  // Backstop for direct callers. The post page's dynamicParams export also
  // blocks draft slugs at routing, but that must go when cacheComponents lands.
  if (!metadata.published) {
    return null;
  }

  return {
    slug,
    readingTime,
    headings,
    ...metadata,
    excerpt: metadata.excerpt || metadata.description,
    content, // Include raw content for MDX rendering
  };
}

// Get posts by tag
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.filter((post) =>
    post.tags.some((postTag) => postTag.toLowerCase() === tag.toLowerCase()),
  );
}

// Get all unique tags with post counts
export async function getAllBlogTags(): Promise<BlogTag[]> {
  const allPosts = await getAllBlogPosts();
  const tagCounts: Record<string, number> = {};

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([name, count]) => ({
      name,
      count,
      // Deliberately NOT the shared slugify from lib/slugify. getBlogPostsByTag
      // above matches with a bare toLowerCase and never hyphenates, so the route
      // resolves only because this slug is lenient: `Next.js` stays `next.js`.
      // Running it through slugify would yield `nextjs`, the match would fail,
      // and /blog/tag/next.js would 404. Unifying the two means changing this,
      // the matcher, both reverse lookups in app/blog/tag/[tag]/page.tsx and the
      // href in components/blog/BlogHeader.tsx together, and it alters live URLs.
      slug: name.toLowerCase().replace(/\s+/g, '-'),
    }))
    .sort((a, b) => b.count - a.count);
}

// Get featured blog posts
export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.filter((post) => post.featured);
}

// Get recent blog posts (limit to n posts)
export async function getRecentBlogPosts(
  limit: number = 3,
): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.slice(0, limit);
}

// Search blog posts by title, description, or content
export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  const searchTerm = query.toLowerCase();

  return allPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.description.toLowerCase().includes(searchTerm) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
  );
}
