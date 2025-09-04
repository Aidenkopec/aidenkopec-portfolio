'use client';

import React from 'react';

interface ProjectPlaceholderProps {
  isHovered?: boolean;
}

// Clean Code Bracket Placeholder - Simple & Professional
const ProjectPlaceholder: React.FC<ProjectPlaceholderProps> = ({ isHovered = false }) => {
  return (
    <div className='relative h-full w-full overflow-hidden bg-gradient-to-br from-[var(--black-100)] via-[var(--tertiary-color)] to-[var(--black-200)]'>
      {/* Main code bracket symbol */}
      <div className='absolute inset-0 flex items-center justify-center'>
        <div
          className={`text-3xl font-mono font-bold text-transparent bg-gradient-to-r from-[var(--text-color-variable)] to-[var(--gradient-start)] bg-clip-text transition-all duration-300 ${
            isHovered 
              ? 'opacity-100 drop-shadow-[0_0_8px_var(--text-color-variable)]' 
              : 'opacity-70 drop-shadow-[0_0_4px_var(--text-color-variable)]'
          }`}
        >
          &lt;/&gt;
        </div>
      </div>
      
      {/* Subtle background highlight on hover */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-[var(--text-color-variable)]/10 via-transparent to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-50'
        }`} 
      />
    </div>
  );
};

export default ProjectPlaceholder;