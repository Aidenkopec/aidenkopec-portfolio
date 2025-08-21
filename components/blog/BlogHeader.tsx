'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { BlogPost } from '@/lib/types';

interface BlogHeaderProps {
  post: BlogPost;
}

export function BlogHeader({ post }: BlogHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      {/* Back to Blog */}
      <Link 
        href="/blog"
        className="inline-flex items-center gap-2 text-secondary hover:text-[var(--text-color-variable)] transition-colors mb-6 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>
      
      {/* Featured Badge */}
      {post.featured && (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--text-color-variable)] text-white mb-4">
          Featured Post
        </div>
      )}
      
      {/* Title */}
      <h1 className="hero-head-text mb-6">
        {post.title}
      </h1>
      
      {/* Description */}
      <p className="text-xl text-secondary mb-8 leading-relaxed max-w-3xl">
        {post.description}
      </p>
      
      {/* Meta Information */}
      <div className="flex flex-wrap items-center gap-6 mb-8 text-secondary">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <time dateTime={post.date} className="text-sm">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
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
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-black-100 text-secondary hover:text-[var(--text-color-variable)] hover:bg-tertiary transition-all duration-200"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </Link>
          ))}
        </div>
      )}
      
      {/* Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--text-color-variable)] to-transparent mt-12" />
    </motion.header>
  );
}