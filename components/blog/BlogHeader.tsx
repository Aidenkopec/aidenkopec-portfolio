'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/types';

interface BlogHeaderProps {
  post: BlogPost;
}

export function BlogHeader({ post }: BlogHeaderProps) {
  return (
    <>
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-secondary hover:text-[var(--text-color-variable)] transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to blog
        </Link>
      </motion.div>

      {/* Article Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-12 bg-tertiary p-8 rounded-xl border border-black-200"
      >
        <div className="flex items-center gap-2 mb-6">
          {/* Category Badge */}
          {post.category && (
            <span className="text-xs font-medium py-1 px-2.5 bg-[var(--text-color-variable)]/20 text-[var(--text-color-variable)] rounded-full">
              {post.category}
            </span>
          )}
          {/* Featured Badge */}
          {post.featured && (
            <span className="text-xs font-medium py-1 px-2.5 bg-[var(--text-color-variable)] text-white rounded-full">
              Featured
            </span>
          )}
          <time className="text-sm text-secondary" dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          {post.title}
        </h1>

        <p className="text-lg text-secondary max-w-3xl mb-8">
          {post.description}
        </p>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 mb-6 text-secondary">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{post.readingTime} min read</span>
          </div>
          
          {post.author && (
            <div className="text-sm">
              by <span className="text-white font-medium">{post.author.name}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-black-100 text-secondary hover:text-[var(--text-color-variable)] hover:bg-black-200 transition-all duration-200"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </Link>
            ))}
          </div>
        )}
      </motion.header>

      {/* Featured Image */}
      {post.coverImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full bg-tertiary p-4 rounded-xl border border-black-200 mb-12"
        >
          <div className="w-full h-[30rem] relative rounded-lg overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      )}
    </>
  );
}