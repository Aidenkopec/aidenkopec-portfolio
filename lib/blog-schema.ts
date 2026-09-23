import { z } from 'zod';

/**
 * The shape of a post's YAML frontmatter, and the source of truth for
 * `BlogMetadata`. Not 'server-only': this is a schema, and `lib/blog.ts` is the
 * side that reads the disk.
 *
 * These messages are read by whoever wrote the post, not by a visitor, so they
 * name the field and show the expected shape. A post that fails this schema
 * fails `npm run build` rather than disappearing from the index.
 */
export const blogFrontmatterSchema = z.object({
  title: z.string({ error: 'title is required' }).trim().min(1),
  description: z.string({ error: 'description is required' }).trim().min(1),
  /**
   * A quoted `date: '2026-05-20'` arrives as a string, an unquoted one as a
   * `Date`: YAML 1.1 resolves bare ISO dates to timestamps. Accept both, and
   * reject anything that does not parse rather than letting a typo become
   * "now" at render time.
   */
  date: z
    .union([z.string(), z.date()], { error: 'date is required' })
    .transform((value) => (value instanceof Date ? value.toISOString() : value))
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      error: 'date must be a parseable date, for example 2026-05-20',
    }),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  /**
   * Nested in the frontmatter, which is what the previous hand written parser
   * could not express: it read `author:` as an empty string and the indented
   * `name:` as a second top level key, so a guest byline was silently replaced
   * by the default below.
   */
  author: z
    .object({
      name: z.string(),
    })
    .default({ name: 'Aiden Kopec' }),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  category: z.string().optional(),
});

export type BlogMetadata = z.infer<typeof blogFrontmatterSchema>;

/** Every issue, one per line, so a broken post reports all its faults at once. */
export function formatIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const field = issue.path.join('.');
      return field ? `  ${field}: ${issue.message}` : `  ${issue.message}`;
    })
    .join('\n');
}
