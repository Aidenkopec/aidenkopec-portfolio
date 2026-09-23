'use client';

import { motion } from 'framer-motion';

import { BlogHeading } from '@/lib/types';

import { BlogToc } from './BlogToc';
import { BlogShare } from './BlogShare';

interface BlogContentProps {
  children: React.ReactNode;
  headings: BlogHeading[];
  title: string;
  slug: string;
}

export function BlogContent({
  children,
  headings,
  title,
  slug,
}: BlogContentProps) {
  return (
    <>
      {/* Mobile Table of Contents - Displayed above content on mobile */}
      {headings.length > 0 && (
        <div className='mb-8 lg:hidden'>
          <div className='rounded-lg border border-black-200 bg-tertiary p-6'>
            <BlogToc headings={headings} isMobile={true} />
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 gap-12 lg:grid-cols-12'>
        {/* Table of Contents - Desktop */}
        {headings.length > 0 && (
          <div className='relative hidden lg:col-span-3 lg:block'>
            <div className='sticky top-32'>
              <BlogToc headings={headings} className='mb-6' />
              {/* Share Component */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className='rounded-lg border border-black-200 bg-tertiary p-6'
              >
                <BlogShare slug={slug} title={title} />
              </motion.div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`rounded-xl border border-black-200 bg-tertiary p-8 ${
            headings.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'
          }`}
        >
          <div className='blog-content'>{children}</div>
        </motion.article>
      </div>

      {/* Mobile Share Component - Displayed at the bottom for mobile only */}
      <div className='mt-12 lg:hidden'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className='rounded-lg border border-black-200 bg-tertiary p-6'
        >
          <BlogShare slug={slug} title={title} />
        </motion.div>
      </div>

      <style jsx global>{`
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4,
        .blog-content h5,
        .blog-content h6 {
          color: var(--white-100);
          font-weight: 700;
        }

        .blog-content p {
          color: var(--secondary-color);
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }

        .blog-content code {
          background-color: var(--black-100);
          color: var(--text-color-variable);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-family: var(--font-mono);
        }

        .blog-content pre {
          background-color: var(--black-100);
          border: 1px solid var(--tertiary-color);
          border-radius: 0.5rem;
          padding: 1.5rem;
          overflow-x: auto;
          margin: 2rem 0;
        }

        .blog-content pre code {
          background: none;
          padding: 0;
          color: var(--white-100);
        }

        .blog-content blockquote {
          border-left: 4px solid var(--text-color-variable);
          background-color: var(--black-100);
          padding: 1rem 1.5rem;
          margin: 2rem 0;
          border-radius: 0 0.5rem 0.5rem 0;
          font-style: italic;
        }

        .blog-content blockquote p {
          color: var(--secondary-color);
          margin-bottom: 0;
        }

        .blog-content ul,
        .blog-content ol {
          color: var(--secondary-color);
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }

        .blog-content li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }

        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          border: 1px solid var(--tertiary-color);
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .blog-content th {
          background-color: var(--black-100);
          color: var(--white-100);
          font-weight: 600;
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid var(--tertiary-color);
        }

        .blog-content td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--tertiary-color);
          color: var(--secondary-color);
        }

        .blog-content img {
          border-radius: 0.5rem;
          margin: 2rem 0;
          width: 100%;
          height: auto;
        }

        .blog-content hr {
          border: none;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--text-color-variable),
            transparent
          );
          margin: 3rem 0;
        }
      `}</style>
    </>
  );
}
