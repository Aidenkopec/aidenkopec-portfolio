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
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 mt-8 first:mt-0 leading-tight"
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
          className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8"
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
          className="text-xl sm:text-2xl font-semibold text-white mb-3 mt-6"
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
          className="text-lg sm:text-xl font-semibold text-white mb-2 mt-4"
          {...props}
        >
          {children}
        </h4>
      );
    },
    p: ({ children }) => (
      <p className="text-secondary mb-4 leading-relaxed">{children}</p>
    ),
    a: ({ href, children }) => (
      <Link
        href={href || '#'}
        className="text-[var(--text-color-variable)] hover:underline transition-all duration-200"
      >
        {children}
      </Link>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[var(--text-color-variable)] pl-4 my-6 italic text-secondary bg-black-100 p-4 rounded-r-lg">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-black-100 text-[var(--text-color-variable)] px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-black-100 p-4 rounded-lg overflow-x-auto my-6 border border-tertiary">
        {children}
      </pre>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-secondary">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 text-secondary">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-secondary leading-relaxed">{children}</li>
    ),
    img: ({ src, alt, width, height, ...props }) => {
      const { ref, ...restProps } = props;
      return (
        <Image
          src={src || ''}
          alt={alt || ''}
          width={typeof width === 'string' ? parseInt(width) : width || 800}
          height={typeof height === 'string' ? parseInt(height) : height || 400}
          className="rounded-lg my-6 w-full h-auto"
          {...restProps}
        />
      );
    },
    hr: () => <hr className="border-tertiary my-8" />,
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse border border-tertiary rounded-lg">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-tertiary bg-black-100 px-4 py-2 text-left font-semibold text-white">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-tertiary px-4 py-2 text-secondary">
        {children}
      </td>
    ),
    // Custom components that can be used in MDX
    Button,
    ...components,
  };
}
