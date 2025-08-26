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
      {/* Mobile-Optimized Header */}
      <div className='mb-5 space-y-3 sm:mb-6 sm:space-y-4'>
        {/* Main Title Section */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex h-9 w-9 items-center justify-center rounded-full bg-[var(--text-color-variable)]/10 sm:h-10 sm:w-10'>
              <Filter className='h-4 w-4 text-[var(--text-color-variable)] sm:h-5 sm:w-5' />
            </div>
            <div className='flex flex-col'>
              <h3 className='text-secondary text-xl font-bold leading-tight sm:text-2xl'>
                Browse Categories
              </h3>
              {/* Mobile Results Counter - inline with title */}
              <div className='text-secondary/70 mt-0.5 text-xs sm:hidden'>
                {selectedCategory ? (
                  <span>
                    {resultCount} of {totalCount} articles
                  </span>
                ) : (
                  <span>{totalCount} total articles</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Desktop Results Counter */}
          <div className='text-secondary hidden text-sm sm:block'>
            {selectedCategory ? (
              <span>
                {resultCount} of {totalCount} articles
              </span>
            ) : (
              <span>{totalCount} total articles</span>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills - Mobile Optimized */}
      <div className='grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3 lg:gap-4'>
        {/* All Categories */}
        <motion.button
          onClick={() => onCategorySelect(null)}
          className={`flex h-11 items-center justify-center rounded-2xl border-2 px-4 py-2.5 text-sm font-semibold transition-all duration-300 sm:h-12 sm:inline-flex sm:w-auto sm:rounded-full sm:px-5 ${
            selectedCategory === null
              ? 'text-secondary border-[var(--text-color-variable)] bg-[var(--text-color-variable)] shadow-[var(--text-color-variable)]/30 shadow-xl'
              : 'border-black-100/50 bg-tertiary/80 text-secondary hover:border-[var(--text-color-variable)]/40 hover:bg-[var(--text-color-variable)]/10 hover:text-[var(--text-color-variable)] backdrop-blur-sm'
          }`}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          All Categories
        </motion.button>

        {/* Individual Categories */}
        {categories.map((category, index) => (
          <motion.button
            key={category}
            onClick={() => onCategorySelect(category)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08, type: "spring", stiffness: 300 }}
            className={`relative flex h-11 items-center justify-center rounded-2xl border-2 px-4 py-2.5 text-sm font-semibold transition-all duration-300 sm:h-12 sm:inline-flex sm:w-auto sm:rounded-full sm:px-5 ${
              selectedCategory === category
                ? 'text-secondary border-[var(--text-color-variable)] bg-[var(--text-color-variable)] shadow-[var(--text-color-variable)]/30 shadow-xl'
                : 'border-black-100/50 bg-tertiary/80 text-secondary hover:border-[var(--text-color-variable)]/40 hover:bg-[var(--text-color-variable)]/10 hover:text-[var(--text-color-variable)] backdrop-blur-sm'
            }`}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className='truncate'>{category}</span>

            {/* Selected indicator with improved styling */}
            {selectedCategory === category && (
              <motion.span
                initial={{ opacity: 0, scale: 0, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0, rotate: 90 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className='ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm'
              >
                <X className='h-3 w-3 text-white' />
              </motion.span>
            )}

            {/* Subtle active indicator */}
            {selectedCategory === category && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className='absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-white/60'
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Enhanced Clear Filter */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className='mt-4 flex items-center justify-center sm:mt-5 sm:justify-start'
        >
          <motion.button
            onClick={() => onCategorySelect(null)}
            className='group inline-flex items-center gap-2 rounded-xl border border-[var(--text-color-variable)]/20 bg-[var(--text-color-variable)]/5 px-4 py-2.5 text-sm font-medium text-[var(--text-color-variable)] transition-all duration-300 hover:border-[var(--text-color-variable)]/40 hover:bg-[var(--text-color-variable)]/10 hover:shadow-lg hover:shadow-[var(--text-color-variable)]/10 backdrop-blur-sm'
            whileHover={{ scale: 1.02, x: 3 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className='flex h-5 w-5 items-center justify-center rounded-full bg-[var(--text-color-variable)]/15 group-hover:bg-[var(--text-color-variable)]/25'
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X className='h-3 w-3' />
            </motion.div>
            <span className='font-semibold'>Clear filter</span>
          </motion.button>
        </motion.div>
      )}
    </motion.section>
  );
}
