'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function BlogPagination({
  currentPage,
  totalPages,
  onPageChange,
  className = ""
}: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (start > 1) {
        pages[0] = 1;
        if (start > 2) {
          pages.splice(1, 0, '...');
        }
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`flex items-center justify-center gap-2 mt-12 ${className}`}
    >
      {/* Previous Button */}
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${currentPage === 1
            ? 'bg-black-100/50 text-white/50 cursor-not-allowed'
            : 'bg-tertiary text-white hover:bg-[var(--text-color-variable)] hover:text-white border border-black-100 hover:border-[var(--text-color-variable)]'
          }
        `}
        whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
        whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </motion.button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span 
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-white"
              >
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <motion.button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`
                w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-[var(--text-color-variable)] text-white shadow-lg shadow-[var(--text-color-variable)]/25'
                  : 'bg-tertiary text-white hover:text-white hover:bg-[var(--text-color-variable)]/5 border border-black-100 hover:border-[var(--text-color-variable)]/30'
                }
              `}
              whileHover={{ scale: isActive ? 1 : 1.05 }}
              whileTap={{ scale: isActive ? 1 : 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {pageNumber}
            </motion.button>
          );
        })}
      </div>

      {/* Next Button */}
      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${currentPage === totalPages
            ? 'bg-black-100/50 text-white/50 cursor-not-allowed'
            : 'bg-tertiary text-white hover:bg-[var(--text-color-variable)] hover:text-white border border-black-100 hover:border-[var(--text-color-variable)]'
          }
        `}
        whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
        whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}