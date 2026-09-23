import React from 'react';

import SectionWrapper from '@/components/layout/SectionWrapper';
import { technologies } from '@/constants';

import TechGrid from './TechGrid';

const Tech: React.FC = () => {
  return (
    <SectionWrapper label='Technologies'>
      <TechGrid technologies={technologies} />
    </SectionWrapper>
  );
};

export default Tech;
