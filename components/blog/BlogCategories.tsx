'use client';

import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';

interface BlogCategoriesProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  resultCount: number;
  totalCount: number;
  className?: string;
}

export function BlogCategories({
  categories,
  selectedCategory,
  onCategorySelect,
  resultCount,
  totalCount,
  className = '',
}: BlogCategoriesProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`w-full ${className}`}
    >
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='rounded-full bg-[var(--text-color-variable)]/10 p-2'>
            <Filter className='h-5 w-5 text-[var(--text-color-variable)]' />
          </div>
          <h3 className='text-secondary text-xl font-bold'>
            Browse Categories
          </h3>
        </div>

        {/* Results Counter */}
        <div className='text-secondary text-sm'>
          {selectedCategory ? (
            <span>
              {resultCount} of {totalCount} articles
            </span>
          ) : (
            <span>{totalCount} total articles</span>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className='flex flex-wrap gap-3'>
        {/* All Categories */}
        <motion.button
          onClick={() => onCategorySelect(null)}
          className={`inline-flex h-10 items-center rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
            selectedCategory === null
              ? 'text-secondary border-[var(--text-color-variable)] bg-[var(--text-color-variable)] shadow-[var(--text-color-variable)]/25 shadow-lg'
              : 'border-black-100 bg-tertiary text-secondary hover:text-secondary hover:border-[var(--text-color-variable)]/30 hover:bg-[var(--text-color-variable)]/5'
          } `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          All Categories
        </motion.button>

        {/* Individual Categories */}
        {categories.map((category, index) => (
          <motion.button
            key={category}
            onClick={() => onCategorySelect(category)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`relative inline-flex h-10 items-center rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
              selectedCategory === category
                ? 'text-secondary border-[var(--text-color-variable)] bg-[var(--text-color-variable)] shadow-[var(--text-color-variable)]/25 shadow-lg'
                : 'border-black-100 bg-tertiary text-secondary hover:text-secondary hover:border-[var(--text-color-variable)]/30 hover:bg-[var(--text-color-variable)]/5'
            } `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}

            {/* Selected indicator */}
            {selectedCategory === category && (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className='ml-2'
              >
                <X className='h-3 w-3' />
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Clear Filter */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='mt-4'
        >
          <motion.button
            onClick={() => onCategorySelect(null)}
            className='inline-flex items-center gap-2 text-sm text-[var(--text-color-variable)] transition-colors hover:text-[var(--text-color-variable)]/80'
            whileHover={{ x: 5 }}
          >
            <X className='h-4 w-4' />
            Clear filter
          </motion.button>
        </motion.div>
      )}
    </motion.section>
  );
}
