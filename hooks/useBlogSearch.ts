'use client';

import { useState, useEffect, useMemo } from 'react';
import { BlogPost } from '@/lib/types';

export function useBlogSearch(posts: BlogPost[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(posts);

  // Get unique categories from posts
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => categorySet.add(tag));
    });
    return Array.from(categorySet).sort();
  }, [posts]);

  // Filter posts based on search term and category
  useEffect(() => {
    let filtered = posts;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(post =>
        post.tags.some(tag => 
          tag.toLowerCase() === selectedCategory.toLowerCase()
        )
      );
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, selectedCategory]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
  };

  const isFiltered = searchTerm.trim() !== '' || selectedCategory !== null;

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filteredPosts,
    categories,
    clearFilters,
    isFiltered,
    resultCount: filteredPosts.length,
    totalCount: posts.length,
  };
}