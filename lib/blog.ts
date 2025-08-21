import fs from 'fs';
import path from 'path';
import { BlogPost, BlogMetadata, BlogTag, BlogHeading } from './types';

const BLOG_DIRECTORY = path.join(process.cwd(), 'content/blog');

// Helper to calculate reading time (average 200 words per minute)
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Helper to extract headings from MDX content for table of contents
function extractHeadings(content: string): BlogHeading[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: BlogHeading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    headings.push({
      id,
      text,
      level,
    });
  }

  return headings;
}

// Helper to extract frontmatter and content from MDX file
function parseMDXFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Extract frontmatter between --- markers
  const frontmatterMatch = fileContent.match(
    /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  );

  if (!frontmatterMatch) {
    throw new Error(`Invalid MDX file format: ${filePath}`);
  }

  const frontmatterString = frontmatterMatch[1];
  const content = frontmatterMatch[2];

  // Parse YAML-like frontmatter (simple key-value parsing)
  const metadata: Partial<BlogMetadata> = {};
  const lines = frontmatterString.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) continue;

    const colonIndex = trimmedLine.indexOf(':');
    if (colonIndex === -1) continue;

    const key = trimmedLine.slice(0, colonIndex).trim();
    let value = trimmedLine.slice(colonIndex + 1).trim();

    // Remove quotes if present
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Parse arrays (tags)
    if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
      const tagsString = value.slice(1, -1);
      metadata.tags = tagsString
        .split(',')
        .map((tag) => tag.trim().replace(/['"]/g, ''));
    } else if (key === 'published' || key === 'featured') {
      (metadata as any)[key] = value === 'true';
    } else {
      (metadata as any)[key] = value;
    }
  }

  return {
    metadata: metadata as BlogMetadata,
    content,
    readingTime: calculateReadingTime(content),
    headings: extractHeadings(content),
  };
}

// Get all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  // Create blog directory if it doesn't exist
  if (!fs.existsSync(BLOG_DIRECTORY)) {
    fs.mkdirSync(BLOG_DIRECTORY, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(BLOG_DIRECTORY);
  const mdxFiles = files.filter((file) => file.endsWith('.mdx'));

  const posts = mdxFiles
    .map((file) => {
      const slug = file.replace('.mdx', '');
      const filePath = path.join(BLOG_DIRECTORY, file);

      try {
        const { metadata, readingTime, headings } = parseMDXFile(filePath);

        return {
          slug,
          title: metadata.title || 'Untitled',
          description: metadata.description || '',
          date: metadata.date || new Date().toISOString(),
          readingTime,
          tags: metadata.tags || [],
          featured: metadata.featured || false,
          published: metadata.published !== false, // Default to true
          author: metadata.author || { name: 'Aiden Kopec' },
          excerpt: metadata.excerpt || metadata.description || '',
          coverImage: metadata.coverImage,
          headings: headings || [],
          category: metadata.category,
        };
      } catch (error) {
        console.error(`Error parsing blog post ${file}:`, error);
        return null;
      }
    })
    .filter(Boolean) as BlogPost[];

  // Sort by date (newest first) and filter published posts
  return posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Get a single blog post by slug
export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const filePath = path.join(BLOG_DIRECTORY, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const { metadata, content, readingTime, headings } = parseMDXFile(filePath);

    return {
      slug,
      title: metadata.title || 'Untitled',
      description: metadata.description || '',
      date: metadata.date || new Date().toISOString(),
      readingTime,
      tags: metadata.tags || [],
      featured: metadata.featured || false,
      published: metadata.published !== false,
      author: metadata.author || { name: 'Aiden Kopec' },
      excerpt: metadata.excerpt || metadata.description || '',
      coverImage: metadata.coverImage,
      content, // Include raw content for MDX rendering
      headings: headings || [],
      category: metadata.category,
    };
  } catch (error) {
    console.error(`Error parsing blog post ${slug}:`, error);
    return null;
  }
}

// Get posts by tag
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.filter((post) =>
    post.tags.some((postTag) => postTag.toLowerCase() === tag.toLowerCase())
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
  limit: number = 3
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
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
  );
}
