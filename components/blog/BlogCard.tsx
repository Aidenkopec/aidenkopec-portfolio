'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, Tag } from 'lucide-react';
import { BlogPost } from '@/lib/types';

interface BlogCardProps {
  post: BlogPost;
  index?: number;
}

export function BlogCard({ post, index = 0 }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="bg-tertiary p-6 rounded-lg border border-black-100 hover:border-[var(--text-color-variable)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--text-color-variable)]/10">
          {/* Featured Badge */}
          {post.featured && (
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[var(--text-color-variable)] text-white mb-4">
              Featured
            </div>
          )}
          
          {/* Title */}
          <h2 className="text-xl font-bold text-white mb-3 group-hover:text-[var(--text-color-variable)] transition-colors duration-200">
            {post.title}
          </h2>
          
          {/* Description */}
          <p className="text-secondary mb-4 line-clamp-3 leading-relaxed">
            {post.description}
          </p>
          
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-black-100 text-secondary hover:text-[var(--text-color-variable)] transition-colors"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-secondary">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}
          
          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-secondary">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime} min read</span>
              </div>
            </div>
            
            {/* Author */}
            {post.author && (
              <div className="text-xs">
                by {post.author.name}
              </div>
            )}
          </div>
          
          {/* Read More Indicator */}
          <div className="mt-4 text-[var(--text-color-variable)] text-sm font-medium group-hover:underline">
            Read more →
          </div>
        </div>
      </Link>
    </motion.article>
  );
}