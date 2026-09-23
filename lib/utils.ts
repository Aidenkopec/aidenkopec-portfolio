import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * A tag's URL segment. Deliberately NOT the shared slugify from lib/slugify:
 * that strips punctuation, so `Next.js` would become `nextjs` and change live
 * URLs. Every tag href, route param and lookup goes through this one function.
 */
export function tagSlug(tag: string) {
  return tag.toLowerCase().replace(/\s+/g, '-');
}
