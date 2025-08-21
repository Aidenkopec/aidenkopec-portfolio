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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-[var(--text-color-variable)]/10">
            <Filter className="w-5 h-5 text-[var(--text-color-variable)]" />
          </div>
          <h3 className="text-xl font-bold text-secondary ">
            Browse Categories
          </h3>
        </div>

        {/* Results Counter */}
        <div className="text-sm text-secondary ">
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
      <div className="flex flex-wrap gap-3">
        {/* All Categories */}
        <motion.button
          onClick={() => onCategorySelect(null)}
          className={`
            inline-flex h-10 items-center rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200
            ${
              selectedCategory === null
                ? 'border-[var(--text-color-variable)] bg-[var(--text-color-variable)] text-secondary  shadow-lg shadow-[var(--text-color-variable)]/25'
                : 'border-black-100 bg-tertiary text-secondary  hover:text-secondary  hover:border-[var(--text-color-variable)]/30 hover:bg-[var(--text-color-variable)]/5'
            }
          `}
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
            className={`
              inline-flex h-10 items-center rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 relative
              ${
                selectedCategory === category
                  ? 'border-[var(--text-color-variable)] bg-[var(--text-color-variable)] text-secondary  shadow-lg shadow-[var(--text-color-variable)]/25'
                  : 'border-black-100 bg-tertiary text-secondary  hover:text-secondary  hover:border-[var(--text-color-variable)]/30 hover:bg-[var(--text-color-variable)]/5'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}

            {/* Selected indicator */}
            {selectedCategory === category && (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ml-2"
              >
                <X className="w-3 h-3" />
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
          className="mt-4"
        >
          <motion.button
            onClick={() => onCategorySelect(null)}
            className="inline-flex items-center gap-2 text-sm text-[var(--text-color-variable)] hover:text-[var(--text-color-variable)]/80 transition-colors"
            whileHover={{ x: 5 }}
          >
            <X className="w-4 h-4" />
            Clear filter
          </motion.button>
        </motion.div>
      )}
    </motion.section>
  );
}
