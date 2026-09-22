'use client';

import { useState, useMemo } from 'react';

import { BlogPost } from '@/lib/types';

export function useBlogSearch(posts: BlogPost[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Unique tags across posts. The blog UI presents these as categories;
  // BlogPost.category is a separate, display only field.
  const tags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  // Filter posts based on search term and tag
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter((post) =>
        post.tags.some(
          (tag) => tag.toLowerCase() === selectedTag.toLowerCase(),
        ),
      );
    }

    return filtered;
  }, [posts, searchTerm, selectedTag]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTag(null);
  };

  const isFiltered = searchTerm.trim() !== '' || selectedTag !== null;

  return {
    searchTerm,
    setSearchTerm,
    selectedTag,
    setSelectedTag,
    filteredPosts,
    tags,
    clearFilters,
    isFiltered,
    resultCount: filteredPosts.length,
    totalCount: posts.length,
  };
}
