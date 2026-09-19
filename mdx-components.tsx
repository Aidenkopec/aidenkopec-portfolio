import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';
import { createSlugger } from '@/lib/slugify';

/**
 * MDX hands a heading a plain string only when it contains nothing but text. Any
 * heading with inline code, bold or a link arrives as an array of nodes, so the
 * old `typeof children === 'string'` check fell through to a constant id and
 * every such heading collided.
 */
function childrenToText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return '';
  }
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(childrenToText).join('');
  if (React.isValidElement(node)) {
    // React 19 types `props` as `unknown`. Fragments land here too: their
    // payload is `props.children` like any other element.
    return childrenToText(
      (node.props as { children?: React.ReactNode }).children,
    );
  }
  return '';
}

const HEADING_CLASSES: Record<number, string> = {
  1: 'mt-8 mb-6 text-2xl leading-tight font-bold text-white first:mt-0 sm:text-3xl md:text-4xl',
  2: 'mt-8 mb-4 text-2xl font-bold text-white sm:text-3xl',
  3: 'mt-6 mb-3 text-xl font-semibold text-white sm:text-2xl',
  4: 'mt-4 mb-2 text-lg font-semibold text-white sm:text-xl',
  5: 'mt-4 mb-2 text-base font-semibold text-white sm:text-lg',
  6: 'mt-4 mb-2 text-sm font-semibold text-white sm:text-base',
};

function createHeading(level: number, slug: (input: string) => string) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  return function Heading({
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
      <Tag
        id={slug(childrenToText(children))}
        className={HEADING_CLASSES[level]}
        {...props}
      >
        {children}
      </Tag>
    );
  };
}

/**
 * The real builder. Not `use` prefixed, because it is not a hook and is called
 * from a server component in app/blog/[slug]/page.tsx.
 *
 * One slugger per call, matching the one `extractHeadings` makes per post, so
 * the collision suffixes on both sides line up. That only holds while this runs
 * per page render: hoisting the result to module scope would turn the counter
 * into a cross request global.
 */
export function getMDXComponents(): MDXComponents {
  const slug = createSlugger();

  return {
    // Override default HTML elements with custom components
    h1: createHeading(1, slug),
    h2: createHeading(2, slug),
    h3: createHeading(3, slug),
    h4: createHeading(4, slug),
    h5: createHeading(5, slug),
    h6: createHeading(6, slug),
    p: ({ children }) => (
      <p className='mb-4 leading-relaxed text-secondary'>{children}</p>
    ),
    a: ({ href, children }) => (
      <Link
        href={href || '#'}
        className='text-[var(--text-color-variable)] transition-all duration-200 hover:underline'
      >
        {children}
      </Link>
    ),
    blockquote: ({ children }) => (
      <blockquote className='my-6 rounded-r-lg border-l-4 border-[var(--text-color-variable)] bg-black-100 p-4 pl-4 text-secondary italic'>
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className='rounded bg-black-100 px-2 py-1 font-mono text-sm text-[var(--text-color-variable)]'>
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className='my-6 overflow-x-auto rounded-lg border border-tertiary bg-black-100 p-4'>
        {children}
      </pre>
    ),
    ul: ({ children }) => (
      <ul className='mb-4 list-inside list-disc space-y-2 text-secondary'>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className='mb-4 list-inside list-decimal space-y-2 text-secondary'>
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className='leading-relaxed text-secondary'>{children}</li>
    ),
    img: ({ src, alt, width, height, ...props }) => {
      const { ref, ...restProps } = props;
      return (
        <Image
          src={src || ''}
          alt={alt || ''}
          width={typeof width === 'string' ? parseInt(width) : width || 800}
          height={typeof height === 'string' ? parseInt(height) : height || 400}
          className='my-6 h-auto w-full rounded-lg'
          {...restProps}
        />
      );
    },
    hr: () => <hr className='my-8 border-tertiary' />,
    table: ({ children }) => (
      <div className='my-6 overflow-x-auto'>
        <table className='w-full border-collapse rounded-lg border border-tertiary'>
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className='border border-tertiary bg-black-100 px-4 py-2 text-left font-semibold text-white'>
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className='border border-tertiary px-4 py-2 text-secondary'>
        {children}
      </td>
    ),
    // Custom components that can be used in MDX
    Button,
  };
}

/**
 * The @next/mdx file convention. next.config.ts applies withMDX and puts `mdx`
 * in pageExtensions, so this file must export a function of exactly this name,
 * taking no arguments. It exists for file based MDX routes; the blog renders
 * through next-mdx-remote and calls getMDXComponents directly.
 */
export function useMDXComponents(): MDXComponents {
  return getMDXComponents();
}
