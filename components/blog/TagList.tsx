'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Tag } from 'lucide-react';
import { BlogTag } from '@/lib/types';

interface TagListProps {
  tags: BlogTag[];
  title?: string;
  className?: string;
}

export function TagList({
  tags,
  title = 'Popular Tags',
  className = '',
}: TagListProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${className}`}
    >
      <h3 className="text-xl font-bold text-secondary  mb-4 flex items-center gap-2">
        <Tag className="w-5 h-5 text-[var(--text-color-variable)]" />
        {title}
      </h3>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <motion.div
            key={tag.slug}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link
              href={`/blog/tag/${tag.slug}`}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-black-100 text-secondary  hover:text-secondary  hover:bg-tertiary transition-all duration-200 text-sm border border-transparent hover:border-[var(--text-color-variable)]/20"
            >
              <span>{tag.name}</span>
              <span className="text-xs bg-tertiary px-2 py-0.5 rounded-full">
                {tag.count}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
