import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Override default HTML elements with custom components
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
      const id =
        typeof children === 'string'
          ? children
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '')
          : 'heading-1';
      return (
        <h1
          id={id}
          className='mt-8 mb-6 text-2xl leading-tight font-bold text-white first:mt-0 sm:text-3xl md:text-4xl'
          {...props}
        >
          {children}
        </h1>
      );
    },
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
      const id =
        typeof children === 'string'
          ? children
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '')
          : 'heading-2';
      return (
        <h2
          id={id}
          className='mt-8 mb-4 text-2xl font-bold text-white sm:text-3xl'
          {...props}
        >
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
      const id =
        typeof children === 'string'
          ? children
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '')
          : 'heading-3';
      return (
        <h3
          id={id}
          className='mt-6 mb-3 text-xl font-semibold text-white sm:text-2xl'
          {...props}
        >
          {children}
        </h3>
      );
    },
    h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
      const id =
        typeof children === 'string'
          ? children
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '')
          : 'heading-4';
      return (
        <h4
          id={id}
          className='mt-4 mb-2 text-lg font-semibold text-white sm:text-xl'
          {...props}
        >
          {children}
        </h4>
      );
    },
    p: ({ children }) => (
      <p className='text-secondary mb-4 leading-relaxed'>{children}</p>
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
      <blockquote className='text-secondary bg-black-100 my-6 rounded-r-lg border-l-4 border-[var(--text-color-variable)] p-4 pl-4 italic'>
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className='bg-black-100 rounded px-2 py-1 font-mono text-sm text-[var(--text-color-variable)]'>
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className='bg-black-100 border-tertiary my-6 overflow-x-auto rounded-lg border p-4'>
        {children}
      </pre>
    ),
    ul: ({ children }) => (
      <ul className='text-secondary mb-4 list-inside list-disc space-y-2'>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className='text-secondary mb-4 list-inside list-decimal space-y-2'>
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className='text-secondary leading-relaxed'>{children}</li>
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
    hr: () => <hr className='border-tertiary my-8' />,
    table: ({ children }) => (
      <div className='my-6 overflow-x-auto'>
        <table className='border-tertiary w-full border-collapse rounded-lg border'>
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className='border-tertiary bg-black-100 border px-4 py-2 text-left font-semibold text-white'>
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className='border-tertiary text-secondary border px-4 py-2'>
        {children}
      </td>
    ),
    // Custom components that can be used in MDX
    Button,
    ...components,
  };
}
