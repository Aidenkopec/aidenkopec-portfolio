import React from 'react';

import SectionWrapper from '@/components/layout/SectionWrapper';
import { technologies } from '@/constants';

import TechGrid from './TechGrid';

const Tech: React.FC = () => {
  const technologiesWithIcons = technologies.filter(
    (technology) => technology.icon,
  );

  return (
    <SectionWrapper label='Technologies'>
      <div className='flex flex-col items-center gap-10'>
        <TechGrid technologies={technologiesWithIcons} />
      </div>
    </SectionWrapper>
  );
};

export default Tech;
