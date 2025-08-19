'use client';
import React from 'react';

import { BallCanvas } from './canvas';
import { SectionWrapper } from '../hoc';
import { technologies } from '../constants';

const Tech = () => {
  const technologiesWithIcons = technologies.filter(
    (technology) => technology.icon
  );

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex flex-row flex-wrap justify-center gap-10">
        {technologiesWithIcons.map((technology) => (
          <div className="w-28 h-28" key={technology.name}>
            <BallCanvas icon={technology.icon} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Tech, '');
