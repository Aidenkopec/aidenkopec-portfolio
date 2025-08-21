'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/lib/types';

interface BlogNavigationProps {
  previousPost?: BlogPost | null;
  nextPost?: BlogPost | null;
}

export function BlogNavigation({ previousPost, nextPost }: BlogNavigationProps) {
  if (!previousPost && !nextPost) {
    return null;
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col sm:flex-row gap-4 mt-16 pt-8 border-t border-tertiary"
    >
      {/* Previous Post */}
      <div className="flex-1">
        {previousPost ? (
          <Link
            href={`/blog/${previousPost.slug}`}
            className="group block p-6 bg-tertiary rounded-lg border border-black-100 hover:border-[var(--text-color-variable)] transition-all duration-300"
          >
            <div className="flex items-center gap-3 text-secondary text-sm mb-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Post</span>
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-[var(--text-color-variable)] transition-colors duration-200 line-clamp-2">
              {previousPost.title}
            </h3>
            <p className="text-secondary mt-2 text-sm line-clamp-2">
              {previousPost.description}
            </p>
          </Link>
        ) : (
          <div className="p-6 bg-black-100 rounded-lg opacity-50">
            <div className="flex items-center gap-3 text-secondary text-sm mb-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Post</span>
            </div>
            <p className="text-secondary">No previous post</p>
          </div>
        )}
      </div>

      {/* Next Post */}
      <div className="flex-1">
        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="group block p-6 bg-tertiary rounded-lg border border-black-100 hover:border-[var(--text-color-variable)] transition-all duration-300 text-right"
          >
            <div className="flex items-center justify-end gap-3 text-secondary text-sm mb-2">
              <span>Next Post</span>
              <ArrowRight className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-[var(--text-color-variable)] transition-colors duration-200 line-clamp-2">
              {nextPost.title}
            </h3>
            <p className="text-secondary mt-2 text-sm line-clamp-2">
              {nextPost.description}
            </p>
          </Link>
        ) : (
          <div className="p-6 bg-black-100 rounded-lg opacity-50 text-right">
            <div className="flex items-center justify-end gap-3 text-secondary text-sm mb-2">
              <span>Next Post</span>
              <ArrowRight className="w-4 h-4" />
            </div>
            <p className="text-secondary">No next post</p>
          </div>
        )}
      </div>
    </motion.nav>
  );
}

// Back to Blog Link Component
export function BackToBlog() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="text-center mt-12"
    >
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--text-color-variable)] text-white rounded-lg hover:bg-[var(--text-color-variable)]/80 transition-all duration-200 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Posts
      </Link>
    </motion.div>
  );
}