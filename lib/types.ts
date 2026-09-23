import type { BlogMetadata } from './blog-schema';

export interface BlogHeading {
  id: string;
  text: string;
  level: number;
}

/**
 * A post is its validated frontmatter plus what lib/blog.ts derives from the
 * file. Composed rather than re-declared: the two used to be parallel interfaces
 * free to drift, and the frontmatter half is now owned by the zod schema.
 *
 * Type only, so nothing in the zod import reaches a client bundle.
 */
export interface BlogPost extends BlogMetadata {
  slug: string;
  readingTime: number;
  headings: BlogHeading[];
  /** Raw MDX source, present only on a single post fetched by slug. */
  content?: string;
}

export interface BlogTag {
  slug: string;
}
