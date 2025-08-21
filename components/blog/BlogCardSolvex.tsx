'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, Tag, User } from 'lucide-react';
import { BlogPost } from '@/lib/types';

interface BlogCardProps {
  post: BlogPost;
  className?: string;
  featured?: boolean;
  index?: number;
  singleFeatured?: boolean;
}

export function BlogCardSolvex({ post, className = "", featured = false, index = 0, singleFeatured = false }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group ${className}`}
    >
      <Link href={`/blog/${post.slug}`}>
        <motion.div
          className={`
            overflow-hidden rounded-xl bg-tertiary shadow-sm hover:shadow-xl transition-all duration-300 border border-black-100 hover:border-[var(--text-color-variable)]/30
            ${singleFeatured ? 'flex flex-col lg:flex-row min-h-[300px]' : featured ? 'flex flex-col sm:flex-row' : 'flex flex-col'}
          `}
          whileHover={{ 
            y: -5,
            transition: { duration: 0.3 }
          }}
        >
          {/* Thumbnail Container for Single Featured */}
          {singleFeatured && (
            <div className="lg:w-1/2 bg-black-100/20 flex items-center justify-center p-8">
              {post.coverImage ? (
                <img 
                  src={post.coverImage} 
                  alt={post.title}
                  className="max-w-full max-h-48 object-contain rounded-lg"
                />
              ) : (
                <div className="w-32 h-32 bg-[var(--text-color-variable)]/10 rounded-xl flex items-center justify-center">
                  <div className="text-[var(--text-color-variable)] text-4xl font-bold">
                    {post.title.charAt(0)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Content Container */}
          <div className={`
            flex flex-col justify-between p-6
            ${singleFeatured ? 'lg:w-1/2' : featured ? 'sm:w-full' : 'w-full'}
          `}>
            {/* Header with Featured Badge */}
            <div>
              {post.featured && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--text-color-variable)]/10 text-[var(--text-color-variable)] mb-4"
                >
                  Featured
                </motion.div>
              )}

              {/* Title */}
              <motion.h2
                className={`
                  font-semibold text-white mb-3 transition-colors duration-200 group-hover:text-[var(--text-color-variable)]
                  ${singleFeatured ? 'text-3xl lg:text-4xl line-clamp-3' : featured ? 'text-2xl line-clamp-2' : 'text-xl line-clamp-2'}
                `}
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                {post.title}
              </motion.h2>

              {/* Description */}
              <p className={`
                text-secondary leading-relaxed
                ${singleFeatured ? 'mb-6 line-clamp-5 text-lg' : featured ? 'mb-6 line-clamp-4' : 'mb-4 line-clamp-3'}
              `}>
                {post.description}
              </p>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.slice(0, featured ? 4 : 3).map((tag, tagIndex) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + tagIndex * 0.05 }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-black-100 text-secondary group-hover:text-[var(--text-color-variable)] transition-colors"
                      whileHover={{ 
                        backgroundColor: "var(--text-color-variable)",
                        color: "white",
                        scale: 1.05
                      }}
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </motion.span>
                  ))}
                  {post.tags.length > (featured ? 4 : 3) && (
                    <span className="text-xs text-secondary flex items-center">
                      +{post.tags.length - (featured ? 4 : 3)} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-auto">
              {/* Meta Information */}
              <div className="flex items-center justify-between text-sm text-secondary mb-4">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="flex items-center gap-1"
                    whileHover={{ color: "var(--text-color-variable)" }}
                  >
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-1"
                    whileHover={{ color: "var(--text-color-variable)" }}
                  >
                    <Clock className="w-4 h-4" />
                    <span>{post.readingTime} min read</span>
                  </motion.div>
                </div>
                
                {/* Author */}
                {post.author && (
                  <motion.div 
                    className="flex items-center gap-1 text-xs"
                    whileHover={{ color: "var(--text-color-variable)" }}
                  >
                    <User className="w-3 h-3" />
                    <span>{post.author.name}</span>
                  </motion.div>
                )}
              </div>

              {/* Read More CTA */}
              <motion.div
                className="flex items-center justify-between p-3 rounded-lg bg-black-100/50 group-hover:bg-[var(--text-color-variable)]/5 transition-all"
                whileHover={{ x: 5 }}
              >
                <span className="text-[var(--text-color-variable)] font-medium text-sm">
                  Read full article
                </span>
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-8 h-8 rounded-full bg-[var(--text-color-variable)]/10 flex items-center justify-center group-hover:bg-[var(--text-color-variable)] transition-all"
                    whileHover={{ scale: 1.1 }}
                  >
                    <motion.svg
                      className="w-4 h-4 text-[var(--text-color-variable)] group-hover:text-white transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{ x: [0, 3, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeInOut"
                      }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[var(--text-color-variable)]/5 via-transparent to-[var(--text-color-variable)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />

          {/* Animated Border */}
          <motion.div
            className="absolute inset-0 rounded-xl border border-[var(--text-color-variable)]/0 group-hover:border-[var(--text-color-variable)]/30 transition-all duration-300"
            whileHover={{
              boxShadow: "0 0 20px var(--text-color-variable)/10"
            }}
          />
        </motion.div>
      </Link>
    </motion.article>
  );
}