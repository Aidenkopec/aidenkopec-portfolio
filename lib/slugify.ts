/**
 * Shared by `lib/blog.ts` (which builds the table of contents from the raw
 * markdown) and `mdx-components.tsx` (which puts the ids on the rendered
 * headings). The two used to carry their own copy of the same expression, so a
 * TOC link and the heading it points at could disagree.
 *
 * No 'server-only' and no imports, so either side can use it.
 */

/** The slug expression both sides already used, unchanged. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Reduces a raw markdown heading to the text a reader actually sees, so slugging
 * the source and slugging the rendered output land on the same id.
 *
 * `[^a-z0-9\s-]` already strips `*`, `_` and backticks, so emphasis and code
 * spans agreed by accident. Links did not: the URL survived into the slug. These
 * rules also fix the TOC labels, which rendered the literal `The **fast** path`.
 *
 * A text level approximation, not a markdown parser. Reference style links and
 * MDX expressions in headings still diverge; neither appears in content/blog.
 */
export function stripInlineMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`+([^`]*)`+/g, '$1')
    .replace(/(\*\*\*|___)(.*?)\1/g, '$2')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\\([\\`*_{}[\]()#+\-.!])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * A slugger scoped to one document, appending `-2`, `-3` to repeated headings.
 * Neither side de-duplicated before, so two identical headings produced two
 * elements with the same id.
 *
 * Both sides walk the same document in the same order, so the suffixes agree.
 * That holds only while each gets a fresh slugger per render.
 */
export function createSlugger(): (input: string) => string {
  const seen = new Map<string, number>();

  return (input: string): string => {
    const base = slugify(input) || 'section';
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  };
}
