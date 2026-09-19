'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React, { useState } from 'react';

import { BlogCard } from '@/components/blog/BlogCard';
import { BlogPost } from '@/lib/types';

import SectionWrapper from '../hoc/SectionWrapper';
import { styles } from '../styles';
import { fadeIn, textVariant } from '../utils';

// Blog Cards Grid Component - uses actual BlogCard component
const BlogCards: React.FC<{ posts: BlogPost[] }> = ({ posts }) => {
  return (
    <motion.div
      variants={fadeIn('up', 'spring', 0.3, 1)}
      className='grid auto-rows-fr gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    >
      {posts.map((post, index) => (
        <BlogCard
          key={post.slug}
          post={post}
          index={index}
          className='h-full'
        />
      ))}
    </motion.div>
  );
};

// Recent Blogs Header Component - matches ProjectsHeader design
const RecentBlogsHeader: React.FC = () => {
  return (
    <motion.div variants={textVariant()}>
      <p className={`${styles.sectionSubText}`}>Latest insights & tutorials</p>
      <h2 className={`${styles.sectionHeadText}`}>Recent Blog Posts.</h2>
    </motion.div>
  );
};

// Recent Blogs Description Component - matches ProjectsDescription design
const RecentBlogsDescription: React.FC = () => {
  return (
    <div className='flex w-full'>
      <motion.p
        variants={fadeIn('up', 'spring', 0.1, 1)}
        className='mt-3 max-w-3xl text-[17px] leading-[30px] text-secondary'
      >
        Dive into my thoughts on software development, AI tools, and emerging
        technologies. From practical tutorials to industry insights, these posts
        capture my journey as a developer and the lessons learned along the way.
      </motion.p>
    </div>
  );
};

// Section Header with View All Link - matches GitHub button styling
const RecentBlogsSectionHeader: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div variants={textVariant()} className='mt-16'>
      <div className='mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h3 className='text-[24px] font-bold text-secondary'>
          Featured Articles
        </h3>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href='/blog'
            className={`group flex items-center gap-2 rounded-lg border border-[var(--black-100)] bg-gradient-to-r from-[var(--tertiary-color)] to-[var(--black-100)] px-4 py-2 transition-all duration-300 hover:scale-105 hover:border-[var(--text-color-variable)] hover:shadow-[var(--text-color-variable)]/20 hover:shadow-lg`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span
              className={`text-sm font-medium transition-colors duration-300 ${isHovered ? 'text-[var(--text-color-variable)]' : 'text-[var(--secondary-color)]'}`}
            >
              View All Posts
            </span>
            <div
              className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
            >
              ↗
            </div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

const RecentBlogsClient: React.FC<{ posts: BlogPost[] }> = ({ posts }) => {
  return (
    <SectionWrapper idName='recent-blogs' label='Recent blog posts'>
      {/* Header Section */}
      <RecentBlogsHeader />
      <RecentBlogsDescription />

      {/* Featured Posts Section */}
      <RecentBlogsSectionHeader />

      <div className='mb-20'>
        <BlogCards posts={posts} />
      </div>
    </SectionWrapper>
  );
};

export default RecentBlogsClient;
